// Push Notifications Service
export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  actions?: NotificationAction[];
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  timestamp?: number;
  url?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  icon?: string;
  actions?: NotificationAction[];
  category: 'appointment' | 'reminder' | 'promotion' | 'system';
}

export interface ScheduledNotification {
  id: string;
  templateId: string;
  userId: string;
  scheduledFor: Date;
  payload: PushNotificationPayload;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  createdAt: Date;
}

class PushNotificationService {
  private vapidPublicKey: string = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9LdNnC_NNNNNNNNNNNNNNNNNNNNNNNN'; // Replace with your VAPID public key
  private apiEndpoint: string = '/api/push-notifications';

  // Predefined notification templates
  private templates: NotificationTemplate[] = [
    {
      id: 'appointment-confirmation',
      name: 'Confirmação de Agendamento',
      title: '✅ Agendamento Confirmado',
      body: 'Seu agendamento foi confirmado para {date} às {time} com {barber}',
      icon: '/icons/icon-192x192.svg',
      category: 'appointment',
      actions: [
        { action: 'view', title: 'Ver Detalhes', icon: '/icons/icon-192x192.svg' },
        { action: 'cancel', title: 'Cancelar', icon: '/icons/icon-192x192.svg' }
      ]
    },
    {
      id: 'appointment-reminder',
      name: 'Lembrete de Agendamento',
      title: '⏰ Lembrete: Seu agendamento é hoje!',
      body: 'Não esqueça! Você tem um agendamento às {time} com {barber}',
      icon: '/icons/icon-192x192.svg',
      category: 'reminder',
      actions: [
        { action: 'directions', title: 'Como Chegar', icon: '/icons/icon-192x192.svg' },
        { action: 'reschedule', title: 'Reagendar', icon: '/icons/icon-192x192.svg' }
      ]
    },
    {
      id: 'appointment-tomorrow',
      name: 'Agendamento Amanhã',
      title: '📅 Agendamento Amanhã',
      body: 'Lembrete: Você tem um agendamento amanhã às {time} com {barber}',
      icon: '/icons/icon-192x192.svg',
      category: 'reminder'
    },
    {
      id: 'appointment-cancelled',
      name: 'Agendamento Cancelado',
      title: '❌ Agendamento Cancelado',
      body: 'Seu agendamento de {date} às {time} foi cancelado',
      icon: '/icons/icon-192x192.svg',
      category: 'appointment',
      actions: [
        { action: 'reschedule', title: 'Reagendar', icon: '/icons/icon-192x192.svg' }
      ]
    },
    {
      id: 'appointment-rescheduled',
      name: 'Agendamento Reagendado',
      title: '🔄 Agendamento Reagendado',
      body: 'Seu agendamento foi reagendado para {date} às {time}',
      icon: '/icons/icon-192x192.svg',
      category: 'appointment'
    },
    {
      id: 'promotion-discount',
      name: 'Promoção Desconto',
      title: '🎉 Oferta Especial!',
      body: '{discount}% de desconto em {service}. Válido até {expiry}',
      icon: '/icons/icon-192x192.svg',
      category: 'promotion',
      actions: [
        { action: 'book', title: 'Agendar Agora', icon: '/icons/icon-192x192.svg' }
      ]
    },
    {
      id: 'loyalty-reward',
      name: 'Recompensa Fidelidade',
      title: '🏆 Parabéns! Você ganhou uma recompensa',
      body: 'Complete mais {remaining} visitas e ganhe um corte grátis!',
      icon: '/icons/icon-192x192.svg',
      category: 'promotion'
    },
    {
      id: 'birthday-special',
      name: 'Oferta Aniversário',
      title: '🎂 Feliz Aniversário!',
      body: 'Ganhe 20% de desconto no seu próximo corte. Oferta válida por 7 dias!',
      icon: '/icons/icon-192x192.svg',
      category: 'promotion',
      actions: [
        { action: 'claim', title: 'Resgatar', icon: '/icons/icon-192x192.svg' }
      ]
    },
    {
      id: 'new-service',
      name: 'Novo Serviço',
      title: '✨ Novo Serviço Disponível!',
      body: 'Conheça nosso novo serviço: {service}. Agende já!',
      icon: '/icons/icon-192x192.svg',
      category: 'promotion'
    },
    {
      id: 'feedback-request',
      name: 'Solicitação de Feedback',
      title: '⭐ Como foi sua experiência?',
      body: 'Nos ajude a melhorar! Avalie seu último atendimento',
      icon: '/icons/icon-192x192.svg',
      category: 'system',
      actions: [
        { action: 'rate', title: 'Avaliar', icon: '/icons/icon-192x192.svg' }
      ]
    }
  ];

  // Get all notification templates
  getTemplates(): NotificationTemplate[] {
    return this.templates;
  }

  // Get template by ID
  getTemplate(id: string): NotificationTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  // Get templates by category
  getTemplatesByCategory(category: NotificationTemplate['category']): NotificationTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  // Create notification payload from template
  createNotificationFromTemplate(
    templateId: string, 
    variables: Record<string, string> = {}
  ): PushNotificationPayload | null {
    const template = this.getTemplate(templateId);
    if (!template) {
      console.error(`Template not found: ${templateId}`);
      return null;
    }

    // Replace variables in title and body
    let title = template.title;
    let body = template.body;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      title = title.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    });

    return {
      title,
      body,
      icon: template.icon || '/icons/icon-192x192.svg',
      badge: '/icons/icon-72x72.svg',
      actions: template.actions,
      tag: templateId,
      requireInteraction: template.category === 'appointment',
      vibrate: [100, 50, 100],
      timestamp: Date.now(),
      data: {
        templateId,
        category: template.category,
        variables
      }
    };
  }

  // Send immediate notification
  async sendNotification(
    userId: string,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          payload
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Notification sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Send notification using template
  async sendTemplateNotification(
    userId: string,
    templateId: string,
    variables: Record<string, string> = {}
  ): Promise<boolean> {
    const payload = this.createNotificationFromTemplate(templateId, variables);
    if (!payload) {
      return false;
    }

    return await this.sendNotification(userId, payload);
  }

  // Schedule notification
  async scheduleNotification(
    userId: string,
    templateId: string,
    scheduledFor: Date,
    variables: Record<string, string> = {}
  ): Promise<string | null> {
    const payload = this.createNotificationFromTemplate(templateId, variables);
    if (!payload) {
      return null;
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          templateId,
          scheduledFor: scheduledFor.toISOString(),
          payload,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Notification scheduled successfully:', result);
      return result.id;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }

  // Cancel scheduled notification
  async cancelScheduledNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/cancel/${notificationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Scheduled notification cancelled');
      return true;
    } catch (error) {
      console.error('Failed to cancel scheduled notification:', error);
      return false;
    }
  }

  // Get scheduled notifications for user
  async getScheduledNotifications(userId: string): Promise<ScheduledNotification[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/scheduled/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notifications = await response.json();
      return notifications.map((notification: any) => ({
        ...notification,
        scheduledFor: new Date(notification.scheduledFor),
        createdAt: new Date(notification.createdAt)
      }));
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  // Send bulk notifications
  async sendBulkNotifications(
    userIds: string[],
    templateId: string,
    variables: Record<string, string> = {}
  ): Promise<{ success: number; failed: number }> {
    const payload = this.createNotificationFromTemplate(templateId, variables);
    if (!payload) {
      return { success: 0, failed: userIds.length };
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds,
          payload
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Bulk notifications sent:', result);
      return result;
    } catch (error) {
      console.error('Failed to send bulk notifications:', error);
      return { success: 0, failed: userIds.length };
    }
  }

  // Subscribe user to push notifications
  async subscribeToPush(userId: string, subscription: PushSubscription): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subscription
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('User subscribed to push notifications');
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  // Unsubscribe user from push notifications
  async unsubscribeFromPush(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('User unsubscribed from push notifications');
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  // Get notification statistics
  async getNotificationStats(userId?: string): Promise<{
    sent: number;
    delivered: number;
    clicked: number;
    failed: number;
  }> {
    try {
      const url = userId 
        ? `${this.apiEndpoint}/stats/${userId}`
        : `${this.apiEndpoint}/stats`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get notification stats:', error);
      return { sent: 0, delivered: 0, clicked: 0, failed: 0 };
    }
  }

  // Appointment-specific notification helpers
  async sendAppointmentConfirmation(
    userId: string,
    appointmentData: {
      date: string;
      time: string;
      barber: string;
      service: string;
    }
  ): Promise<boolean> {
    return await this.sendTemplateNotification(userId, 'appointment-confirmation', appointmentData);
  }

  async scheduleAppointmentReminder(
    userId: string,
    appointmentData: {
      date: string;
      time: string;
      barber: string;
    },
    reminderTime: Date
  ): Promise<string | null> {
    return await this.scheduleNotification(userId, 'appointment-reminder', reminderTime, appointmentData);
  }

  async sendAppointmentCancellation(
    userId: string,
    appointmentData: {
      date: string;
      time: string;
      barber: string;
    }
  ): Promise<boolean> {
    return await this.sendTemplateNotification(userId, 'appointment-cancelled', appointmentData);
  }

  // Promotion-specific notification helpers
  async sendPromotionalOffer(
    userIds: string[],
    offerData: {
      discount: string;
      service: string;
      expiry: string;
    }
  ): Promise<{ success: number; failed: number }> {
    return await this.sendBulkNotifications(userIds, 'promotion-discount', offerData);
  }

  async sendBirthdayOffer(userId: string): Promise<boolean> {
    return await this.sendTemplateNotification(userId, 'birthday-special');
  }

  // System notification helpers
  async requestFeedback(
    userId: string,
    appointmentData: {
      barber: string;
      service: string;
    }
  ): Promise<boolean> {
    return await this.sendTemplateNotification(userId, 'feedback-request', appointmentData);
  }
}

// Create singleton instance
export const pushNotificationService = new PushNotificationService();

// Export default
export default pushNotificationService;