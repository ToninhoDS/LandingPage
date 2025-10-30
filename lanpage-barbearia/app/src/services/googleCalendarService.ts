interface CalendarEvent {
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
  location?: string;
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
}

interface AppointmentCalendarData {
  clientName: string;
  clientEmail?: string;
  service: string;
  barber: string;
  barbershop: string;
  date: string;
  time: string;
  duration: number; // em minutos
  address: string;
  price: number;
  notes?: string;
}

class GoogleCalendarService {
  private apiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY || '';
  private calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID || 'primary';
  private accessToken = '';

  // Inicializar com token de acesso (obtido via OAuth)
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) {
    const url = `https://www.googleapis.com/calendar/v3${endpoint}`;
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Calendar API request failed:', error);
      throw error;
    }
  }

  async createAppointmentEvent(appointment: AppointmentCalendarData): Promise<string | null> {
    try {
      const startDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const endDateTime = new Date(startDateTime.getTime() + appointment.duration * 60000);

      const event: CalendarEvent = {
        summary: `${appointment.service} - ${appointment.clientName}`,
        description: `
Agendamento na Barbearia

Cliente: ${appointment.clientName}
Serviço: ${appointment.service}
Profissional: ${appointment.barber}
Valor: R$ ${appointment.price.toFixed(2)}
${appointment.notes ? `Observações: ${appointment.notes}` : ''}

Agendado via Barbearia App
        `.trim(),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        location: `${appointment.barbershop} - ${appointment.address}`,
        attendees: appointment.clientEmail ? [
          {
            email: appointment.clientEmail,
            displayName: appointment.clientName,
          }
        ] : undefined,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 dia antes
            { method: 'popup', minutes: 60 }, // 1 hora antes
            { method: 'popup', minutes: 15 }, // 15 minutos antes
          ],
        },
      };

      const result = await this.makeRequest(`/calendars/${this.calendarId}/events`, 'POST', event);
      console.log('Calendar event created:', result.id);
      return result.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
  }

  async updateAppointmentEvent(eventId: string, appointment: AppointmentCalendarData): Promise<boolean> {
    try {
      const startDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const endDateTime = new Date(startDateTime.getTime() + appointment.duration * 60000);

      const event: CalendarEvent = {
        summary: `${appointment.service} - ${appointment.clientName}`,
        description: `
Agendamento na Barbearia (Atualizado)

Cliente: ${appointment.clientName}
Serviço: ${appointment.service}
Profissional: ${appointment.barber}
Valor: R$ ${appointment.price.toFixed(2)}
${appointment.notes ? `Observações: ${appointment.notes}` : ''}

Agendado via Barbearia App
        `.trim(),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        location: `${appointment.barbershop} - ${appointment.address}`,
        attendees: appointment.clientEmail ? [
          {
            email: appointment.clientEmail,
            displayName: appointment.clientName,
          }
        ] : undefined,
      };

      await this.makeRequest(`/calendars/${this.calendarId}/events/${eventId}`, 'PUT', event);
      console.log('Calendar event updated:', eventId);
      return true;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return false;
    }
  }

  async deleteAppointmentEvent(eventId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/calendars/${this.calendarId}/events/${eventId}`, 'DELETE');
      console.log('Calendar event deleted:', eventId);
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  }

  async getAvailableSlots(date: string, duration: number = 60): Promise<string[]> {
    try {
      const startOfDay = new Date(`${date}T08:00:00`);
      const endOfDay = new Date(`${date}T18:00:00`);

      // Buscar eventos existentes do dia
      const events = await this.makeRequest(
        `/calendars/${this.calendarId}/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true&orderBy=startTime`
      );

      const busySlots: Array<{ start: Date; end: Date }> = events.items.map((event: any) => ({
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
      }));

      // Gerar slots disponíveis (de 30 em 30 minutos, das 8h às 18h)
      const availableSlots: string[] = [];
      const slotDuration = 30; // minutos
      
      for (let hour = 8; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const slotStart = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
          const slotEnd = new Date(slotStart.getTime() + duration * 60000);

          // Verificar se o slot não conflita com eventos existentes
          const isAvailable = !busySlots.some(busy => 
            (slotStart >= busy.start && slotStart < busy.end) ||
            (slotEnd > busy.start && slotEnd <= busy.end) ||
            (slotStart <= busy.start && slotEnd >= busy.end)
          );

          if (isAvailable && slotEnd.getHours() <= 18) {
            availableSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
          }
        }
      }

      return availableSlots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  }

  async getAppointmentsForDate(date: string): Promise<any[]> {
    try {
      const startOfDay = new Date(`${date}T00:00:00`);
      const endOfDay = new Date(`${date}T23:59:59`);

      const events = await this.makeRequest(
        `/calendars/${this.calendarId}/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true&orderBy=startTime`
      );

      return events.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description,
        location: event.location,
        attendees: event.attendees,
      }));
    } catch (error) {
      console.error('Error getting appointments for date:', error);
      return [];
    }
  }

  // Método para verificar se o Google Calendar está configurado
  isConfigured(): boolean {
    return !!(this.accessToken && this.calendarId);
  }

  // Método para testar a conexão
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('Google Calendar not configured');
      return false;
    }

    try {
      await this.makeRequest(`/calendars/${this.calendarId}`);
      return true;
    } catch (error) {
      console.error('Google Calendar connection test failed:', error);
      return false;
    }
  }

  // Método para inicializar OAuth (simplificado)
  getAuthUrl(): string {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'https://www.googleapis.com/auth/calendar';
    
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline`;
  }
}

export const googleCalendarService = new GoogleCalendarService();
export type { AppointmentCalendarData, CalendarEvent };