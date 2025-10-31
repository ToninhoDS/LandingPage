import { supabase } from '@/lib/supabase';

// Configurações do Google Calendar API
const GOOGLE_CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3';
const GOOGLE_OAUTH_URL = 'https://oauth2.googleapis.com/token';

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
  extendedProperties?: {
    private?: {
      barbeariaId?: string;
      agendamentoId?: string;
      syncVersion?: string;
    };
  };
}

export interface GoogleCalendarConfig {
  apiKey: string;
  calendarId: string;
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiryDate?: number;
  syncToken?: string;
  lastSyncTime?: string;
}

export interface SyncConflict {
  type: 'time_overlap' | 'double_booking' | 'external_event';
  localEvent: any;
  remoteEvent: GoogleCalendarEvent;
  resolution?: 'keep_local' | 'keep_remote' | 'merge' | 'manual';
}

export interface SyncResult {
  success: boolean;
  created: number;
  updated: number;
  deleted: number;
  conflicts: SyncConflict[];
  errors: string[];
}

class GoogleCalendarService {
  private config: GoogleCalendarConfig | null = null;
  private syncInProgress = false;

  async initialize(barbeariaId: string): Promise<void> {
    try {
      const { data: integracao } = await supabase
        .from('integracoes')
        .select('configuracao')
        .eq('barbearia_id', barbeariaId)
        .eq('tipo', 'google_calendar')
        .eq('ativo', true)
        .single();

      if (integracao) {
        this.config = integracao.configuracao as GoogleCalendarConfig;
        
        // Verificar se o token precisa ser renovado
        if (this.config.tokenExpiryDate && Date.now() > this.config.tokenExpiryDate) {
          await this.refreshAccessToken(barbeariaId);
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar Google Calendar:', error);
      throw new Error('Falha ao configurar Google Calendar API');
    }
  }

  async refreshAccessToken(barbeariaId: string): Promise<boolean> {
    if (!this.config?.refreshToken) {
      throw new Error('Refresh token não disponível');
    }

    try {
      const response = await fetch(GOOGLE_OAUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.config.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        this.config.accessToken = data.access_token;
        this.config.tokenExpiryDate = Date.now() + (data.expires_in * 1000);

        // Salvar nova configuração
        await supabase
          .from('integracoes')
          .update({
            configuracao: this.config,
          })
          .eq('barbearia_id', barbeariaId)
          .eq('tipo', 'google_calendar');

        return true;
      } else {
        console.error('Erro ao renovar token:', data);
        return false;
      }
    } catch (error) {
      console.error('Erro ao renovar access token:', error);
      return false;
    }
  }

  async createEvent(event: GoogleCalendarEvent, barbeariaId: string): Promise<string | null> {
    if (!this.config) {
      await this.initialize(barbeariaId);
    }

    if (!this.config) {
      throw new Error('Google Calendar não configurado para esta barbearia');
    }

    try {
      // Adicionar propriedades de sincronização
      event.extendedProperties = {
        private: {
          barbeariaId,
          agendamentoId: event.extendedProperties?.private?.agendamentoId,
          syncVersion: Date.now().toString(),
        },
      };

      const response = await fetch(
        `${GOOGLE_CALENDAR_API_URL}/calendars/${this.config.calendarId}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      const result = await response.json();

      // Log da integração
      await this.logIntegracao(barbeariaId, 'criar_evento', event, result, response.ok);

      if (response.ok) {
        return result.id;
      } else {
        console.error('Erro ao criar evento:', result);
        
        // Tentar renovar token se erro de autorização
        if (response.status === 401) {
          const tokenRefreshed = await this.refreshAccessToken(barbeariaId);
          if (tokenRefreshed) {
            return this.createEvent(event, barbeariaId);
          }
        }
        
        return null;
      }
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar:', error);
      await this.logIntegracao(barbeariaId, 'criar_evento', event, null, false, error.message);
      return null;
    }
  }

  async updateEvent(eventId: string, event: GoogleCalendarEvent, barbeariaId: string): Promise<boolean> {
    if (!this.config) {
      await this.initialize(barbeariaId);
    }

    if (!this.config) {
      throw new Error('Google Calendar não configurado para esta barbearia');
    }

    try {
      // Atualizar versão de sincronização
      event.extendedProperties = {
        ...event.extendedProperties,
        private: {
          ...event.extendedProperties?.private,
          barbeariaId,
          syncVersion: Date.now().toString(),
        },
      };

      const response = await fetch(
        `${GOOGLE_CALENDAR_API_URL}/calendars/${this.config.calendarId}/events/${eventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      const result = await response.json();

      await this.logIntegracao(barbeariaId, 'atualizar_evento', { eventId, ...event }, result, response.ok);

      if (response.ok) {
        return true;
      } else {
        console.error('Erro ao atualizar evento:', result);
        
        if (response.status === 401) {
          const tokenRefreshed = await this.refreshAccessToken(barbeariaId);
          if (tokenRefreshed) {
            return this.updateEvent(eventId, event, barbeariaId);
          }
        }
        
        return false;
      }
    } catch (error) {
      console.error('Erro ao atualizar evento no Google Calendar:', error);
      await this.logIntegracao(barbeariaId, 'atualizar_evento', { eventId, ...event }, null, false, error.message);
      return false;
    }
  }

  async deleteEvent(eventId: string, barbeariaId: string): Promise<boolean> {
    if (!this.config) {
      await this.initialize(barbeariaId);
    }

    if (!this.config) {
      throw new Error('Google Calendar não configurado para esta barbearia');
    }

    try {
      const response = await fetch(
        `${GOOGLE_CALENDAR_API_URL}/calendars/${this.config.calendarId}/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
          },
        }
      );

      await this.logIntegracao(barbeariaId, 'deletar_evento', { eventId }, null, response.ok);

      if (response.ok || response.status === 410) { // 410 = Gone (já deletado)
        return true;
      } else {
        console.error('Erro ao deletar evento:', response.statusText);
        
        if (response.status === 401) {
          const tokenRefreshed = await this.refreshAccessToken(barbeariaId);
          if (tokenRefreshed) {
            return this.deleteEvent(eventId, barbeariaId);
          }
        }
        
        return false;
      }
    } catch (error) {
      console.error('Erro ao deletar evento no Google Calendar:', error);
      await this.logIntegracao(barbeariaId, 'deletar_evento', { eventId }, null, false, error.message);
      return false;
    }
  }

  async getEvents(barbeariaId: string, timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> {
    if (!this.config) {
      await this.initialize(barbeariaId);
    }

    if (!this.config) {
      throw new Error('Google Calendar não configurado para esta barbearia');
    }

    try {
      const params = new URLSearchParams({
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '250',
      });

      if (timeMin) params.append('timeMin', timeMin);
      if (timeMax) params.append('timeMax', timeMax);

      const response = await fetch(
        `${GOOGLE_CALENDAR_API_URL}/calendars/${this.config.calendarId}/events?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        return result.items || [];
      } else {
        console.error('Erro ao buscar eventos:', result);
        
        if (response.status === 401) {
          const tokenRefreshed = await this.refreshAccessToken(barbeariaId);
          if (tokenRefreshed) {
            return this.getEvents(barbeariaId, timeMin, timeMax);
          }
        }
        
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar eventos do Google Calendar:', error);
      return [];
    }
  }

  async syncWithLocalAppointments(barbeariaId: string): Promise<SyncResult> {
    if (this.syncInProgress) {
      throw new Error('Sincronização já em andamento');
    }

    this.syncInProgress = true;
    const result: SyncResult = {
      success: false,
      created: 0,
      updated: 0,
      deleted: 0,
      conflicts: [],
      errors: [],
    };

    try {
      // Buscar agendamentos locais dos próximos 30 dias
      const now = new Date();
      const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const { data: localAppointments } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes(nome, email),
          servicos(nome, duracao, preco),
          barbeiros(nome),
          barbearias(nome, endereco)
        `)
        .eq('barbearia_id', barbeariaId)
        .gte('data_hora', now.toISOString())
        .lte('data_hora', futureDate.toISOString())
        .neq('status', 'cancelado');

      // Buscar eventos do Google Calendar
      const remoteEvents = await this.getEvents(
        barbeariaId,
        now.toISOString(),
        futureDate.toISOString()
      );

      // Sincronizar agendamentos locais para o Google Calendar
      for (const appointment of localAppointments || []) {
        try {
          const existingEvent = remoteEvents.find(event => 
            event.extendedProperties?.private?.agendamentoId === appointment.id.toString()
          );

          const calendarEvent = this.convertAppointmentToEvent(appointment);

          if (existingEvent) {
            // Verificar se precisa atualizar
            const localVersion = appointment.updated_at;
            const remoteVersion = existingEvent.extendedProperties?.private?.syncVersion;

            if (!remoteVersion || new Date(localVersion) > new Date(parseInt(remoteVersion))) {
              const updated = await this.updateEvent(existingEvent.id!, calendarEvent, barbeariaId);
              if (updated) result.updated++;
            }
          } else {
            // Criar novo evento
            calendarEvent.extendedProperties = {
              private: {
                barbeariaId,
                agendamentoId: appointment.id.toString(),
                syncVersion: Date.now().toString(),
              },
            };

            const eventId = await this.createEvent(calendarEvent, barbeariaId);
            if (eventId) {
              result.created++;
              
              // Salvar ID do evento no agendamento
              await supabase
                .from('agendamentos')
                .update({ google_calendar_event_id: eventId })
                .eq('id', appointment.id);
            }
          }
        } catch (error) {
          result.errors.push(`Erro ao sincronizar agendamento ${appointment.id}: ${error.message}`);
        }
      }

      // Verificar eventos externos que podem causar conflitos
      const externalEvents = remoteEvents.filter(event => 
        !event.extendedProperties?.private?.barbeariaId
      );

      for (const externalEvent of externalEvents) {
        const conflicts = await this.detectConflicts(externalEvent, localAppointments || [], barbeariaId);
        result.conflicts.push(...conflicts);
      }

      // Atualizar token de sincronização
      if (this.config) {
        this.config.lastSyncTime = new Date().toISOString();
        await supabase
          .from('integracoes')
          .update({ configuracao: this.config })
          .eq('barbearia_id', barbeariaId)
          .eq('tipo', 'google_calendar');
      }

      result.success = true;
      await this.logIntegracao(barbeariaId, 'sincronizacao_completa', null, result, true);

    } catch (error) {
      result.errors.push(`Erro geral na sincronização: ${error.message}`);
      await this.logIntegracao(barbeariaId, 'sincronizacao_completa', null, result, false, error.message);
    } finally {
      this.syncInProgress = false;
    }

    return result;
  }

  private async detectConflicts(
    externalEvent: GoogleCalendarEvent,
    localAppointments: any[],
    barbeariaId: string
  ): Promise<SyncConflict[]> {
    const conflicts: SyncConflict[] = [];

    const eventStart = new Date(externalEvent.start.dateTime);
    const eventEnd = new Date(externalEvent.end.dateTime);

    for (const appointment of localAppointments) {
      const appointmentStart = new Date(appointment.data_hora);
      const appointmentEnd = new Date(appointmentStart.getTime() + (appointment.servicos?.duracao || 60) * 60000);

      // Verificar sobreposição de horários
      if (
        (eventStart < appointmentEnd && eventEnd > appointmentStart) ||
        (appointmentStart < eventEnd && appointmentEnd > eventStart)
      ) {
        conflicts.push({
          type: 'time_overlap',
          localEvent: appointment,
          remoteEvent: externalEvent,
          resolution: 'manual', // Requer resolução manual
        });
      }
    }

    return conflicts;
  }

  private convertAppointmentToEvent(appointment: any): GoogleCalendarEvent {
    const startTime = new Date(appointment.data_hora);
    const duration = appointment.servicos?.duracao || 60;
    const endTime = new Date(startTime.getTime() + duration * 60000);

    return {
      summary: `${appointment.servicos?.nome || 'Serviço'} - ${appointment.clientes?.nome || 'Cliente'}`,
      description: `
Serviço: ${appointment.servicos?.nome || 'N/A'}
Cliente: ${appointment.clientes?.nome || 'N/A'}
Barbeiro: ${appointment.barbeiros?.nome || 'N/A'}
Preço: R$ ${appointment.servicos?.preco || '0,00'}
Observações: ${appointment.observacoes || 'Nenhuma'}
      `.trim(),
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      location: appointment.barbearias?.endereco || '',
      attendees: appointment.clientes?.email ? [{
        email: appointment.clientes.email,
        displayName: appointment.clientes.nome,
      }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    };
  }

  async resolveConflict(
    conflict: SyncConflict,
    resolution: 'keep_local' | 'keep_remote' | 'merge',
    barbeariaId: string
  ): Promise<boolean> {
    try {
      switch (resolution) {
        case 'keep_local':
          // Manter agendamento local, deletar evento remoto se possível
          if (conflict.remoteEvent.id) {
            await this.deleteEvent(conflict.remoteEvent.id, barbeariaId);
          }
          break;

        case 'keep_remote':
          // Cancelar agendamento local
          await supabase
            .from('agendamentos')
            .update({ 
              status: 'cancelado',
              observacoes: `Cancelado devido a conflito com evento externo: ${conflict.remoteEvent.summary}`,
            })
            .eq('id', conflict.localEvent.id);
          break;

        case 'merge':
          // Tentar reagendar o agendamento local
          const newSlots = await this.findAvailableSlots(
            barbeariaId,
            new Date(conflict.localEvent.data_hora),
            conflict.localEvent.servicos?.duracao || 60
          );

          if (newSlots.length > 0) {
            await supabase
              .from('agendamentos')
              .update({ 
                data_hora: newSlots[0],
                observacoes: `Reagendado devido a conflito com evento externo`,
              })
              .eq('id', conflict.localEvent.id);
          }
          break;
      }

      return true;
    } catch (error) {
      console.error('Erro ao resolver conflito:', error);
      return false;
    }
  }

  private async findAvailableSlots(
    barbeariaId: string,
    preferredDate: Date,
    duration: number
  ): Promise<string[]> {
    // Implementar lógica para encontrar horários disponíveis
    // Por simplicidade, retornar slots do mesmo dia em horários diferentes
    const slots: string[] = [];
    const baseDate = new Date(preferredDate);
    
    for (let hour = 9; hour <= 18; hour++) {
      const slotTime = new Date(baseDate);
      slotTime.setHours(hour, 0, 0, 0);
      
      // Verificar se o slot está disponível (implementar verificação real)
      slots.push(slotTime.toISOString());
    }

    return slots.slice(0, 3); // Retornar apenas 3 opções
  }

  async testConnection(barbeariaId: string): Promise<boolean> {
    try {
      if (!this.config) {
        await this.initialize(barbeariaId);
      }

      if (!this.config) {
        return false;
      }

      const response = await fetch(
        `${GOOGLE_CALENDAR_API_URL}/calendars/${this.config.calendarId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
          },
        }
      );

      if (response.ok) {
        return true;
      } else if (response.status === 401) {
        // Tentar renovar token
        return await this.refreshAccessToken(barbeariaId);
      }

      return false;
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return false;
    }
  }

  async getCalendarList(barbeariaId: string): Promise<any[]> {
    if (!this.config) {
      await this.initialize(barbeariaId);
    }

    if (!this.config) {
      return [];
    }

    try {
      const response = await fetch(
        `${GOOGLE_CALENDAR_API_URL}/users/me/calendarList`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        return result.items || [];
      } else {
        console.error('Erro ao buscar lista de calendários:', result);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar calendários:', error);
      return [];
    }
  }

  private async logIntegracao(
    barbeariaId: string,
    acao: string,
    dadosEntrada: any,
    dadosSaida: any,
    sucesso: boolean,
    erroMensagem?: string
  ): Promise<void> {
    try {
      await supabase.from('logs_integracao').insert({
        barbearia_id: barbeariaId,
        tipo_integracao: 'google_calendar',
        acao,
        dados_entrada: dadosEntrada,
        dados_saida: dadosSaida,
        status: sucesso ? 'sucesso' : 'erro',
        erro_mensagem: erroMensagem,
      });
    } catch (error) {
      console.error('Erro ao salvar log de integração:', error);
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();
export type { SyncConflict, SyncResult };