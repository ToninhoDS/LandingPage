import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { pushNotificationService, NotificationTemplate, ScheduledNotification } from '../services/pushNotifications';
import { serviceWorkerManager } from '../utils/serviceWorker';
import { useAuth } from '../contexts/AuthContext';

export interface NotificationStats {
  sent: number;
  delivered: number;
  clicked: number;
  failed: number;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ sent: 0, delivered: 0, clicked: 0, failed: 0 });
  const [loading, setLoading] = useState(false);

  // Initialize push notifications
  useEffect(() => {
    initializePushNotifications();
    loadTemplates();
    
    if (user) {
      loadScheduledNotifications();
      loadStats();
    }
  }, [user]);

  // Initialize push notification system
  const initializePushNotifications = useCallback(async () => {
    try {
      // Check current permission
      if ('Notification' in window) {
        setPermission(Notification.permission);
      }

      // Check if user is already subscribed
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }, []);

  // Load notification templates
  const loadTemplates = useCallback(() => {
    const allTemplates = pushNotificationService.getTemplates();
    setTemplates(allTemplates);
  }, []);

  // Load scheduled notifications for current user
  const loadScheduledNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const notifications = await pushNotificationService.getScheduledNotifications(user.id);
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error('Failed to load scheduled notifications:', error);
      toast.error('Erro ao carregar notificações agendadas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load notification statistics
  const loadStats = useCallback(async () => {
    if (!user) return;

    try {
      const userStats = await pushNotificationService.getNotificationStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load notification stats:', error);
    }
  }, [user]);

  // Request notification permission and subscribe
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para receber notificações');
      return false;
    }

    try {
      setLoading(true);

      // Request permission
      const permission = await serviceWorkerManager.requestNotificationPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        toast.error('Permissão para notificações negada');
        return false;
      }

      // Subscribe to push notifications
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9LdNnC_NNNNNNNNNNNNNNNNNNNNNNNN'; // Replace with your VAPID public key
      const subscription = await serviceWorkerManager.subscribeToPush(vapidPublicKey);

      if (!subscription) {
        toast.error('Falha ao criar inscrição para notificações');
        return false;
      }

      // Send subscription to server
      const success = await pushNotificationService.subscribeToPush(user.id, subscription);

      if (success) {
        setIsSubscribed(true);
        toast.success('Notificações ativadas com sucesso!');
        return true;
      } else {
        toast.error('Falha ao ativar notificações no servidor');
        return false;
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      toast.error('Erro ao ativar notificações');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);

      // Unsubscribe from push manager
      const success = await serviceWorkerManager.unsubscribeFromPush();

      if (success) {
        // Remove subscription from server
        await pushNotificationService.unsubscribeFromPush(user.id);
        setIsSubscribed(false);
        toast.success('Notificações desativadas');
        return true;
      } else {
        toast.error('Erro ao desativar notificações');
        return false;
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      toast.error('Erro ao desativar notificações');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Send test notification
  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    if (!user || !isSubscribed) {
      toast.error('Você precisa estar inscrito para receber notificações');
      return false;
    }

    try {
      const success = await pushNotificationService.sendTemplateNotification(
        user.id,
        'feedback-request',
        {
          barber: 'João Silva',
          service: 'Corte + Barba'
        }
      );

      if (success) {
        toast.success('Notificação de teste enviada!');
        await loadStats(); // Refresh stats
        return true;
      } else {
        toast.error('Falha ao enviar notificação de teste');
        return false;
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error('Erro ao enviar notificação de teste');
      return false;
    }
  }, [user, isSubscribed, loadStats]);

  // Send notification using template
  const sendNotification = useCallback(async (
    templateId: string,
    variables: Record<string, string> = {}
  ): Promise<boolean> => {
    if (!user || !isSubscribed) {
      console.warn('User not subscribed to notifications');
      return false;
    }

    try {
      const success = await pushNotificationService.sendTemplateNotification(
        user.id,
        templateId,
        variables
      );

      if (success) {
        await loadStats(); // Refresh stats
      }

      return success;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }, [user, isSubscribed, loadStats]);

  // Schedule notification
  const scheduleNotification = useCallback(async (
    templateId: string,
    scheduledFor: Date,
    variables: Record<string, string> = {}
  ): Promise<string | null> => {
    if (!user || !isSubscribed) {
      toast.error('Você precisa estar inscrito para agendar notificações');
      return null;
    }

    try {
      const notificationId = await pushNotificationService.scheduleNotification(
        user.id,
        templateId,
        scheduledFor,
        variables
      );

      if (notificationId) {
        toast.success('Notificação agendada com sucesso!');
        await loadScheduledNotifications(); // Refresh scheduled notifications
      } else {
        toast.error('Falha ao agendar notificação');
      }

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      toast.error('Erro ao agendar notificação');
      return null;
    }
  }, [user, isSubscribed, loadScheduledNotifications]);

  // Cancel scheduled notification
  const cancelScheduledNotification = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      const success = await pushNotificationService.cancelScheduledNotification(notificationId);

      if (success) {
        toast.success('Notificação cancelada');
        await loadScheduledNotifications(); // Refresh scheduled notifications
      } else {
        toast.error('Falha ao cancelar notificação');
      }

      return success;
    } catch (error) {
      console.error('Failed to cancel scheduled notification:', error);
      toast.error('Erro ao cancelar notificação');
      return false;
    }
  }, [loadScheduledNotifications]);

  // Get templates by category
  const getTemplatesByCategory = useCallback((category: NotificationTemplate['category']) => {
    return pushNotificationService.getTemplatesByCategory(category);
  }, []);

  // Appointment-specific helpers
  const sendAppointmentConfirmation = useCallback(async (appointmentData: {
    date: string;
    time: string;
    barber: string;
    service: string;
  }): Promise<boolean> => {
    if (!user || !isSubscribed) return false;

    return await pushNotificationService.sendAppointmentConfirmation(user.id, appointmentData);
  }, [user, isSubscribed]);

  const scheduleAppointmentReminder = useCallback(async (
    appointmentData: {
      date: string;
      time: string;
      barber: string;
    },
    reminderTime: Date
  ): Promise<string | null> => {
    if (!user || !isSubscribed) return null;

    const notificationId = await pushNotificationService.scheduleAppointmentReminder(
      user.id,
      appointmentData,
      reminderTime
    );

    if (notificationId) {
      await loadScheduledNotifications();
    }

    return notificationId;
  }, [user, isSubscribed, loadScheduledNotifications]);

  const sendAppointmentCancellation = useCallback(async (appointmentData: {
    date: string;
    time: string;
    barber: string;
  }): Promise<boolean> => {
    if (!user || !isSubscribed) return false;

    return await pushNotificationService.sendAppointmentCancellation(user.id, appointmentData);
  }, [user, isSubscribed]);

  // Request feedback after appointment
  const requestFeedback = useCallback(async (appointmentData: {
    barber: string;
    service: string;
  }): Promise<boolean> => {
    if (!user || !isSubscribed) return false;

    return await pushNotificationService.requestFeedback(user.id, appointmentData);
  }, [user, isSubscribed]);

  return {
    // State
    isSubscribed,
    permission,
    templates,
    scheduledNotifications,
    stats,
    loading,

    // Actions
    subscribe,
    unsubscribe,
    sendTestNotification,
    sendNotification,
    scheduleNotification,
    cancelScheduledNotification,
    
    // Helpers
    getTemplatesByCategory,
    loadScheduledNotifications,
    loadStats,

    // Appointment-specific
    sendAppointmentConfirmation,
    scheduleAppointmentReminder,
    sendAppointmentCancellation,
    requestFeedback,

    // Computed
    canReceiveNotifications: permission === 'granted' && isSubscribed,
    hasPermission: permission === 'granted'
  };
}