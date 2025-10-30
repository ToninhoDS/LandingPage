import { useState, useEffect } from 'react';
import { whatsappService, type AppointmentData } from '@/services/whatsappService';
import { googleCalendarService, type AppointmentCalendarData } from '@/services/googleCalendarService';
import { toast } from 'sonner';

interface IntegrationStatus {
  whatsapp: boolean;
  googleCalendar: boolean;
}

interface AppointmentIntegrationData {
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  service: string;
  barber: string;
  barbershop: string;
  date: string;
  time: string;
  duration: number;
  address: string;
  price: number;
  notes?: string;
}

export function useIntegrations() {
  const [status, setStatus] = useState<IntegrationStatus>({
    whatsapp: false,
    googleCalendar: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIntegrationsStatus();
  }, []);

  const checkIntegrationsStatus = async () => {
    setLoading(true);
    try {
      const [whatsappStatus, calendarStatus] = await Promise.all([
        whatsappService.testConnection(),
        googleCalendarService.testConnection(),
      ]);

      setStatus({
        whatsapp: whatsappStatus,
        googleCalendar: calendarStatus,
      });
    } catch (error) {
      console.error('Error checking integrations status:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendAppointmentConfirmation = async (appointment: AppointmentIntegrationData): Promise<boolean> => {
    if (!status.whatsapp) {
      console.warn('WhatsApp not configured');
      return false;
    }

    const whatsappData: AppointmentData = {
      clientName: appointment.clientName,
      clientPhone: whatsappService.formatPhoneNumber(appointment.clientPhone),
      service: appointment.service,
      barber: appointment.barber,
      barbershop: appointment.barbershop,
      date: appointment.date,
      time: appointment.time,
      address: appointment.address,
      price: appointment.price,
    };

    try {
      const success = await whatsappService.sendAppointmentConfirmation(whatsappData);
      if (success) {
        toast.success('Confirmação enviada via WhatsApp');
      } else {
        toast.error('Erro ao enviar confirmação via WhatsApp');
      }
      return success;
    } catch (error) {
      console.error('Error sending WhatsApp confirmation:', error);
      toast.error('Erro ao enviar confirmação via WhatsApp');
      return false;
    }
  };

  const sendAppointmentReminder = async (appointment: AppointmentIntegrationData): Promise<boolean> => {
    if (!status.whatsapp) {
      console.warn('WhatsApp not configured');
      return false;
    }

    const whatsappData: AppointmentData = {
      clientName: appointment.clientName,
      clientPhone: whatsappService.formatPhoneNumber(appointment.clientPhone),
      service: appointment.service,
      barber: appointment.barber,
      barbershop: appointment.barbershop,
      date: appointment.date,
      time: appointment.time,
      address: appointment.address,
      price: appointment.price,
    };

    try {
      const success = await whatsappService.sendAppointmentReminder(whatsappData);
      if (success) {
        toast.success('Lembrete enviado via WhatsApp');
      } else {
        toast.error('Erro ao enviar lembrete via WhatsApp');
      }
      return success;
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error);
      toast.error('Erro ao enviar lembrete via WhatsApp');
      return false;
    }
  };

  const createCalendarEvent = async (appointment: AppointmentIntegrationData): Promise<string | null> => {
    if (!status.googleCalendar) {
      console.warn('Google Calendar not configured');
      return null;
    }

    const calendarData: AppointmentCalendarData = {
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      service: appointment.service,
      barber: appointment.barber,
      barbershop: appointment.barbershop,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      address: appointment.address,
      price: appointment.price,
      notes: appointment.notes,
    };

    try {
      const eventId = await googleCalendarService.createAppointmentEvent(calendarData);
      if (eventId) {
        toast.success('Evento criado no Google Calendar');
      } else {
        toast.error('Erro ao criar evento no Google Calendar');
      }
      return eventId;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      toast.error('Erro ao criar evento no Google Calendar');
      return null;
    }
  };

  const updateCalendarEvent = async (eventId: string, appointment: AppointmentIntegrationData): Promise<boolean> => {
    if (!status.googleCalendar) {
      console.warn('Google Calendar not configured');
      return false;
    }

    const calendarData: AppointmentCalendarData = {
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      service: appointment.service,
      barber: appointment.barber,
      barbershop: appointment.barbershop,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      address: appointment.address,
      price: appointment.price,
      notes: appointment.notes,
    };

    try {
      const success = await googleCalendarService.updateAppointmentEvent(eventId, calendarData);
      if (success) {
        toast.success('Evento atualizado no Google Calendar');
      } else {
        toast.error('Erro ao atualizar evento no Google Calendar');
      }
      return success;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      toast.error('Erro ao atualizar evento no Google Calendar');
      return false;
    }
  };

  const deleteCalendarEvent = async (eventId: string): Promise<boolean> => {
    if (!status.googleCalendar) {
      console.warn('Google Calendar not configured');
      return false;
    }

    try {
      const success = await googleCalendarService.deleteAppointmentEvent(eventId);
      if (success) {
        toast.success('Evento removido do Google Calendar');
      } else {
        toast.error('Erro ao remover evento do Google Calendar');
      }
      return success;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      toast.error('Erro ao remover evento do Google Calendar');
      return false;
    }
  };

  const getAvailableSlots = async (date: string, duration: number = 60): Promise<string[]> => {
    if (!status.googleCalendar) {
      console.warn('Google Calendar not configured');
      return [];
    }

    try {
      return await googleCalendarService.getAvailableSlots(date, duration);
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  };

  const sendWelcomeMessage = async (clientPhone: string, clientName: string): Promise<boolean> => {
    if (!status.whatsapp) {
      console.warn('WhatsApp not configured');
      return false;
    }

    try {
      const success = await whatsappService.sendWelcomeMessage(
        whatsappService.formatPhoneNumber(clientPhone),
        clientName
      );
      if (success) {
        toast.success('Mensagem de boas-vindas enviada');
      }
      return success;
    } catch (error) {
      console.error('Error sending welcome message:', error);
      return false;
    }
  };

  const sendPromotionalMessage = async (clientPhone: string, clientName: string, promotion: string): Promise<boolean> => {
    if (!status.whatsapp) {
      console.warn('WhatsApp not configured');
      return false;
    }

    try {
      const success = await whatsappService.sendPromotionalMessage(
        whatsappService.formatPhoneNumber(clientPhone),
        clientName,
        promotion
      );
      if (success) {
        toast.success('Mensagem promocional enviada');
      }
      return success;
    } catch (error) {
      console.error('Error sending promotional message:', error);
      return false;
    }
  };

  const processNewAppointment = async (appointment: AppointmentIntegrationData): Promise<{
    whatsappSent: boolean;
    calendarEventId: string | null;
  }> => {
    const results = {
      whatsappSent: false,
      calendarEventId: null as string | null,
    };

    // Enviar confirmação via WhatsApp
    if (status.whatsapp) {
      results.whatsappSent = await sendAppointmentConfirmation(appointment);
    }

    // Criar evento no Google Calendar
    if (status.googleCalendar) {
      results.calendarEventId = await createCalendarEvent(appointment);
    }

    return results;
  };

  const connectGoogleCalendar = () => {
    const authUrl = googleCalendarService.getAuthUrl();
    window.open(authUrl, '_blank', 'width=500,height=600');
  };

  return {
    status,
    loading,
    checkIntegrationsStatus,
    sendAppointmentConfirmation,
    sendAppointmentReminder,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    getAvailableSlots,
    sendWelcomeMessage,
    sendPromotionalMessage,
    processNewAppointment,
    connectGoogleCalendar,
  };
}

export type { AppointmentIntegrationData, IntegrationStatus };