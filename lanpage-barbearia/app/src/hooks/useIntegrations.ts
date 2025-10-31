import { useState, useEffect } from 'react'
import { whatsappService } from '@/services/whatsappService'
import { googleCalendarService } from '@/services/googleCalendarService'
import { stripeService } from '@/services/stripeService'
import type { AppointmentData } from '@/services/whatsappService'
import type { AppointmentCalendarData } from '@/services/googleCalendarService'
import type { AppointmentPaymentData } from '@/services/stripeService'

interface IntegrationStatus {
  whatsapp: {
    configured: boolean
    connected: boolean
    lastTest?: Date
  }
  googleCalendar: {
    configured: boolean
    connected: boolean
    lastTest?: Date
  }
  stripe: {
    configured: boolean
    connected: boolean
    lastTest?: Date
  }
}

interface AppointmentIntegrationData {
  clientName: string
  clientPhone: string
  clientEmail?: string
  service: string
  barber: string
  barbershop: string
  date: string
  time: string
  duration: number
  address: string
  price: number
  notes?: string
  agendamentoId: string
  services: Array<{
    name: string
    price: number
  }>
}

export function useIntegrations() {
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    whatsapp: { configured: false, connected: false },
    googleCalendar: { configured: false, connected: false },
    stripe: { configured: false, connected: false }
  })
  const [loading, setLoading] = useState(false)

  // Verificar status das integrações
  const checkIntegrationStatus = async () => {
    setLoading(true)
    
    try {
      // Verificar WhatsApp
      const whatsappConfigured = whatsappService.isConfigured()
      const whatsappConnected = whatsappConfigured ? await whatsappService.testConnection() : false

      // Verificar Google Calendar
      const googleCalendarConfigured = googleCalendarService.isConfigured()
      const googleCalendarConnected = googleCalendarConfigured ? await googleCalendarService.testConnection() : false

      // Verificar Stripe
      const stripeConfigured = stripeService.isConfigured()
      const stripeConnected = stripeConfigured ? await stripeService.testConnection() : false

      setIntegrationStatus({
        whatsapp: {
          configured: whatsappConfigured,
          connected: whatsappConnected,
          lastTest: new Date()
        },
        googleCalendar: {
          configured: googleCalendarConfigured,
          connected: googleCalendarConnected,
          lastTest: new Date()
        },
        stripe: {
          configured: stripeConfigured,
          connected: stripeConnected,
          lastTest: new Date()
        }
      })
    } catch (error) {
      console.error('Error checking integration status:', error)
    } finally {
      setLoading(false)
    }
  }

  // Enviar confirmação via WhatsApp
  const sendWhatsAppConfirmation = async (appointmentData: AppointmentIntegrationData): Promise<boolean> => {
    if (!integrationStatus.whatsapp.configured) {
      console.warn('WhatsApp not configured')
      return false
    }

    const whatsappData: AppointmentData = {
      clientName: appointmentData.clientName,
      clientPhone: appointmentData.clientPhone,
      service: appointmentData.service,
      barber: appointmentData.barber,
      barbershop: appointmentData.barbershop,
      date: appointmentData.date,
      time: appointmentData.time,
      address: appointmentData.address,
      price: appointmentData.price
    }

    return await whatsappService.sendAppointmentConfirmation(whatsappData)
  }

  // Enviar lembrete via WhatsApp
  const sendWhatsAppReminder = async (appointmentData: AppointmentIntegrationData): Promise<boolean> => {
    if (!integrationStatus.whatsapp.configured) {
      console.warn('WhatsApp not configured')
      return false
    }

    const whatsappData: AppointmentData = {
      clientName: appointmentData.clientName,
      clientPhone: appointmentData.clientPhone,
      service: appointmentData.service,
      barber: appointmentData.barber,
      barbershop: appointmentData.barbershop,
      date: appointmentData.date,
      time: appointmentData.time,
      address: appointmentData.address,
      price: appointmentData.price
    }

    return await whatsappService.sendAppointmentReminder(whatsappData)
  }

  // Criar evento no Google Calendar
  const createGoogleCalendarEvent = async (appointmentData: AppointmentIntegrationData): Promise<string | null> => {
    if (!integrationStatus.googleCalendar.configured) {
      console.warn('Google Calendar not configured')
      return null
    }

    const calendarData: AppointmentCalendarData = {
      clientName: appointmentData.clientName,
      clientEmail: appointmentData.clientEmail,
      service: appointmentData.service,
      barber: appointmentData.barber,
      barbershop: appointmentData.barbershop,
      date: appointmentData.date,
      time: appointmentData.time,
      duration: appointmentData.duration,
      address: appointmentData.address,
      price: appointmentData.price,
      notes: appointmentData.notes
    }

    return await googleCalendarService.createAppointmentEvent(calendarData)
  }

  // Atualizar evento no Google Calendar
  const updateGoogleCalendarEvent = async (eventId: string, appointmentData: AppointmentIntegrationData): Promise<boolean> => {
    if (!integrationStatus.googleCalendar.configured) {
      console.warn('Google Calendar not configured')
      return false
    }

    const calendarData: AppointmentCalendarData = {
      clientName: appointmentData.clientName,
      clientEmail: appointmentData.clientEmail,
      service: appointmentData.service,
      barber: appointmentData.barber,
      barbershop: appointmentData.barbershop,
      date: appointmentData.date,
      time: appointmentData.time,
      duration: appointmentData.duration,
      address: appointmentData.address,
      price: appointmentData.price,
      notes: appointmentData.notes
    }

    return await googleCalendarService.updateAppointmentEvent(eventId, calendarData)
  }

  // Deletar evento do Google Calendar
  const deleteGoogleCalendarEvent = async (eventId: string): Promise<boolean> => {
    if (!integrationStatus.googleCalendar.configured) {
      console.warn('Google Calendar not configured')
      return false
    }

    return await googleCalendarService.deleteAppointmentEvent(eventId)
  }

  // Buscar horários disponíveis no Google Calendar
  const getGoogleCalendarAvailableSlots = async (date: string, duration: number = 60): Promise<string[]> => {
    if (!integrationStatus.googleCalendar.configured) {
      console.warn('Google Calendar not configured')
      return []
    }

    return await googleCalendarService.getAvailableSlots(date, duration)
  }

  // Criar Payment Intent no Stripe
  const createStripePaymentIntent = async (appointmentData: AppointmentIntegrationData) => {
    if (!integrationStatus.stripe.configured) {
      console.warn('Stripe not configured')
      return null
    }

    const paymentData: AppointmentPaymentData = {
      agendamentoId: appointmentData.agendamentoId,
      clientName: appointmentData.clientName,
      clientEmail: appointmentData.clientEmail,
      services: appointmentData.services,
      barbershop: appointmentData.barbershop,
      barber: appointmentData.barber,
      date: appointmentData.date,
      time: appointmentData.time
    }

    return await stripeService.createAppointmentPaymentIntent(paymentData)
  }

  // Confirmar pagamento no Stripe
  const confirmStripePayment = async (paymentIntentId: string, paymentMethodId: string): Promise<boolean> => {
    if (!integrationStatus.stripe.configured) {
      console.warn('Stripe not configured')
      return false
    }

    return await stripeService.confirmPayment(paymentIntentId, paymentMethodId)
  }

  // Cancelar pagamento no Stripe
  const cancelStripePayment = async (paymentIntentId: string): Promise<boolean> => {
    if (!integrationStatus.stripe.configured) {
      console.warn('Stripe not configured')
      return false
    }

    return await stripeService.cancelPaymentIntent(paymentIntentId)
  }

  // Criar reembolso no Stripe
  const createStripeRefund = async (paymentIntentId: string, amount?: number, reason?: string): Promise<boolean> => {
    if (!integrationStatus.stripe.configured) {
      console.warn('Stripe not configured')
      return false
    }

    return await stripeService.createRefund(paymentIntentId, amount, reason)
  }

  // Enviar mensagem de boas-vindas via WhatsApp
  const sendWelcomeMessage = async (clientPhone: string, clientName: string): Promise<boolean> => {
    if (!integrationStatus.whatsapp.configured) {
      console.warn('WhatsApp not configured')
      return false
    }

    return await whatsappService.sendWelcomeMessage(clientPhone, clientName)
  }

  // Enviar mensagem promocional via WhatsApp
  const sendPromotionalMessage = async (clientPhone: string, clientName: string, promotion: string): Promise<boolean> => {
    if (!integrationStatus.whatsapp.configured) {
      console.warn('WhatsApp not configured')
      return false
    }

    return await whatsappService.sendPromotionalMessage(clientPhone, clientName, promotion)
  }

  // Processar novo agendamento com todas as integrações
  const processNewAppointment = async (appointmentData: AppointmentIntegrationData): Promise<{
    whatsappSent: boolean
    calendarEventId: string | null
    paymentIntentId: string | null
  }> => {
    const results = {
      whatsappSent: false,
      calendarEventId: null as string | null,
      paymentIntentId: null as string | null
    }

    try {
      // Enviar confirmação via WhatsApp
      if (integrationStatus.whatsapp.configured) {
        results.whatsappSent = await sendWhatsAppConfirmation(appointmentData)
      }

      // Criar evento no Google Calendar
      if (integrationStatus.googleCalendar.configured) {
        results.calendarEventId = await createGoogleCalendarEvent(appointmentData)
      }

      // Criar Payment Intent no Stripe (se necessário)
      if (integrationStatus.stripe.configured && appointmentData.price > 0) {
        const paymentIntent = await createStripePaymentIntent(appointmentData)
        results.paymentIntentId = paymentIntent?.id || null
      }
    } catch (error) {
      console.error('Error processing new appointment integrations:', error)
    }

    return results
  }

  // Conectar Google Calendar (OAuth)
  const connectGoogleCalendar = () => {
    const authUrl = googleCalendarService.getAuthUrl()
    window.open(authUrl, '_blank', 'width=500,height=600')
  }

  // Verificar status das integrações na inicialização
  useEffect(() => {
    checkIntegrationStatus()
  }, [])

  return {
    integrationStatus,
    loading,
    checkIntegrationStatus,
    
    // WhatsApp
    sendWhatsAppConfirmation,
    sendWhatsAppReminder,
    sendWelcomeMessage,
    sendPromotionalMessage,
    
    // Google Calendar
    createGoogleCalendarEvent,
    updateGoogleCalendarEvent,
    deleteGoogleCalendarEvent,
    getGoogleCalendarAvailableSlots,
    connectGoogleCalendar,
    
    // Stripe
    createStripePaymentIntent,
    confirmStripePayment,
    cancelStripePayment,
    createStripeRefund,
    
    // Processamento completo
    processNewAppointment
  }
}

export type { AppointmentIntegrationData, IntegrationStatus }