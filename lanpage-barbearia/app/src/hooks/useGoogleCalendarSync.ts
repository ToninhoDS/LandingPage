import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { googleCalendarService } from '@/services/googleCalendar';

export function useGoogleCalendarSync(barbeariaId: string) {
  useEffect(() => {
    if (!barbeariaId) return;

    // Escutar mudanças nos agendamentos para sincronizar com Google Calendar
    const agendamentosSubscription = supabase
      .channel('agendamentos_calendar')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agendamentos',
          filter: `barbearia_id=eq.${barbeariaId}`,
        },
        async (payload) => {
          await handleNewAppointment(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agendamentos',
          filter: `barbearia_id=eq.${barbeariaId}`,
        },
        async (payload) => {
          await handleAppointmentUpdate(payload.new, payload.old);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'agendamentos',
          filter: `barbearia_id=eq.${barbeariaId}`,
        },
        async (payload) => {
          await handleAppointmentDelete(payload.old);
        }
      )
      .subscribe();

    return () => {
      agendamentosSubscription.unsubscribe();
    };
  }, [barbeariaId]);

  const handleNewAppointment = async (agendamento: any) => {
    try {
      // Verificar se a integração com Google Calendar está ativa
      const { data: integracao } = await supabase
        .from('integracoes')
        .select('ativo')
        .eq('barbearia_id', barbeariaId)
        .eq('tipo', 'google_calendar')
        .single();

      if (!integracao?.ativo) {
        console.log('Integração com Google Calendar não está ativa');
        return;
      }

      // Sincronizar novo agendamento com Google Calendar
      const eventId = await googleCalendarService.syncAppointmentToCalendar(
        agendamento,
        barbeariaId
      );

      if (eventId) {
        console.log(`Agendamento ${agendamento.id} sincronizado com Google Calendar: ${eventId}`);
      } else {
        console.error(`Falha ao sincronizar agendamento ${agendamento.id} com Google Calendar`);
      }
    } catch (error) {
      console.error('Erro ao processar novo agendamento para Google Calendar:', error);
    }
  };

  const handleAppointmentUpdate = async (newData: any, oldData: any) => {
    try {
      // Verificar se a integração com Google Calendar está ativa
      const { data: integracao } = await supabase
        .from('integracoes')
        .select('ativo')
        .eq('barbearia_id', barbeariaId)
        .eq('tipo', 'google_calendar')
        .single();

      if (!integracao?.ativo) {
        console.log('Integração com Google Calendar não está ativa');
        return;
      }

      // Se o agendamento foi cancelado, deletar do Google Calendar
      if (oldData.status !== 'cancelado' && newData.status === 'cancelado') {
        const success = await googleCalendarService.deleteAppointmentFromCalendar(
          newData,
          barbeariaId
        );

        if (success) {
          console.log(`Agendamento ${newData.id} removido do Google Calendar`);
        } else {
          console.error(`Falha ao remover agendamento ${newData.id} do Google Calendar`);
        }
        return;
      }

      // Se houve mudança na data/hora ou outros dados relevantes, atualizar no Google Calendar
      const camposRelevantes = ['data_hora', 'valor_total', 'status'];
      const houveMudanca = camposRelevantes.some(campo => oldData[campo] !== newData[campo]);

      if (houveMudanca) {
        const success = await googleCalendarService.updateAppointmentInCalendar(
          newData,
          barbeariaId
        );

        if (success) {
          console.log(`Agendamento ${newData.id} atualizado no Google Calendar`);
        } else {
          console.error(`Falha ao atualizar agendamento ${newData.id} no Google Calendar`);
        }
      }
    } catch (error) {
      console.error('Erro ao processar atualização de agendamento para Google Calendar:', error);
    }
  };

  const handleAppointmentDelete = async (agendamento: any) => {
    try {
      // Verificar se a integração com Google Calendar está ativa
      const { data: integracao } = await supabase
        .from('integracoes')
        .select('ativo')
        .eq('barbearia_id', barbeariaId)
        .eq('tipo', 'google_calendar')
        .single();

      if (!integracao?.ativo) {
        console.log('Integração com Google Calendar não está ativa');
        return;
      }

      // Deletar agendamento do Google Calendar
      const success = await googleCalendarService.deleteAppointmentFromCalendar(
        agendamento,
        barbeariaId
      );

      if (success) {
        console.log(`Agendamento ${agendamento.id} removido do Google Calendar`);
      } else {
        console.error(`Falha ao remover agendamento ${agendamento.id} do Google Calendar`);
      }
    } catch (error) {
      console.error('Erro ao processar exclusão de agendamento para Google Calendar:', error);
    }
  };

  const syncAllAppointments = async () => {
    try {
      // Buscar todos os agendamentos futuros que não estão cancelados
      const { data: agendamentos } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .neq('status', 'cancelado')
        .gte('data_hora', new Date().toISOString())
        .is('google_calendar_event_id', null);

      if (!agendamentos?.length) {
        console.log('Nenhum agendamento para sincronizar');
        return;
      }

      console.log(`Sincronizando ${agendamentos.length} agendamentos com Google Calendar...`);

      const promises = agendamentos.map(async (agendamento) => {
        const eventId = await googleCalendarService.syncAppointmentToCalendar(
          agendamento,
          barbeariaId
        );
        return { agendamento: agendamento.id, eventId, success: !!eventId };
      });

      const resultados = await Promise.all(promises);
      const sucessos = resultados.filter(r => r.success).length;
      const falhas = resultados.filter(r => !r.success).length;

      console.log(`Sincronização concluída: ${sucessos} sucessos, ${falhas} falhas`);
      return { sucessos, falhas, total: agendamentos.length };
    } catch (error) {
      console.error('Erro ao sincronizar todos os agendamentos:', error);
      throw error;
    }
  };

  const testCalendarConnection = async () => {
    try {
      // Criar um evento de teste
      const testEvent = {
        summary: 'Teste de Conexão - Barbearia Digital',
        description: 'Evento de teste para verificar a integração com Google Calendar',
        start: {
          dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hora no futuro
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 1h30 no futuro
          timeZone: 'America/Sao_Paulo',
        },
      };

      const eventId = await googleCalendarService.createEvent(testEvent, barbeariaId);

      if (eventId) {
        // Deletar o evento de teste
        await googleCalendarService.deleteEvent(eventId, barbeariaId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao testar conexão com Google Calendar:', error);
      return false;
    }
  };

  return {
    syncAllAppointments,
    testCalendarConnection,
  };
}