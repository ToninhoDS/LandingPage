import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Lazy initialization of Supabase client
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    return supabase;
  }
  
  return null;
}

// Configure web-push
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@barbearia.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
}

export interface PushSubscription {
  id?: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
  vibrate?: number[];
}

export interface ScheduledNotification {
  id?: string;
  user_id: string;
  title: string;
  body: string;
  payload: NotificationPayload;
  scheduled_for: string;
  sent: boolean;
  created_at?: string;
}

export class PushNotificationService {
  // Subscribe user to push notifications
  static async subscribe(subscription: PushSubscription): Promise<{ success: boolean; error?: string }> {
    try {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        return { success: false, error: 'Supabase not configured' };
      }

      // Check if subscription already exists
      const { data: existing } = await supabaseClient
        .from('push_subscriptions')
        .select('id')
        .eq('user_id', subscription.user_id)
        .eq('endpoint', subscription.endpoint)
        .single();

      if (existing) {
        // Update existing subscription
        const { error } = await supabaseClient
          .from('push_subscriptions')
          .update({
            p256dh: subscription.p256dh,
            auth: subscription.auth,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabaseClient
          .from('push_subscriptions')
          .insert({
            user_id: subscription.user_id,
            endpoint: subscription.endpoint,
            p256dh: subscription.p256dh,
            auth: subscription.auth
          });

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Unsubscribe user from push notifications
  static async unsubscribe(userId: string, endpoint?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        return { success: false, error: 'Supabase not configured' };
      }

      let query = supabaseClient.from('push_subscriptions').delete().eq('user_id', userId);
      
      if (endpoint) {
        query = query.eq('endpoint', endpoint);
      }

      const { error } = await query;
      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Send notification to a specific user
  static async sendToUser(userId: string, payload: NotificationPayload): Promise<{ success: boolean; error?: string; sentCount?: number }> {
    try {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        return { success: false, error: 'Supabase not configured' };
      }

      // Get user's subscriptions
      const { data: subscriptions, error } = await supabaseClient
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      if (!subscriptions || subscriptions.length === 0) {
        return { success: false, error: 'No subscriptions found for user' };
      }

      let sentCount = 0;
      const failedSubscriptions: string[] = [];

      // Send to all user's subscriptions
      for (const subscription of subscriptions) {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth
              }
            },
            JSON.stringify(payload)
          );
          sentCount++;
        } catch (error) {
          console.error(`Failed to send notification to subscription ${subscription.id}:`, error);
          failedSubscriptions.push(subscription.id);
          
          // Remove invalid subscriptions
          if (error instanceof Error && (error.message.includes('410') || error.message.includes('invalid'))) {
            await supabaseClient.from('push_subscriptions').delete().eq('id', subscription.id);
          }
        }
      }

      return { success: sentCount > 0, sentCount };
    } catch (error) {
      console.error('Error sending notification to user:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Send notification to multiple users
  static async sendToUsers(userIds: string[], payload: NotificationPayload): Promise<{ success: boolean; error?: string; sentCount?: number }> {
    try {
      let totalSent = 0;
      
      for (const userId of userIds) {
        const result = await this.sendToUser(userId, payload);
        if (result.success && result.sentCount) {
          totalSent += result.sentCount;
        }
      }

      return { success: totalSent > 0, sentCount: totalSent };
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Send notification to all users with a specific role
  static async sendToRole(role: string, payload: NotificationPayload): Promise<{ success: boolean; error?: string; sentCount?: number }> {
    try {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        return { success: false, error: 'Supabase not configured' };
      }

      // Get users with the specified role
      const { data: users, error } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('role', role);

      if (error) throw error;
      if (!users || users.length === 0) {
        return { success: false, error: `No users found with role: ${role}` };
      }

      const userIds = users.map(user => user.id);
      return await this.sendToUsers(userIds, payload);
    } catch (error) {
      console.error('Error sending notification to role:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Schedule a notification
  static async scheduleNotification(notification: ScheduledNotification): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data, error } = await supabaseClient
        .from('scheduled_notifications')
        .insert({
          user_id: notification.user_id,
          title: notification.title,
          body: notification.body,
          payload: notification.payload,
          scheduled_for: notification.scheduled_for,
          sent: false
        })
        .select('id')
        .single();

      if (error) throw error;

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Cancel a scheduled notification
  static async cancelScheduledNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { error } = await supabaseClient
        .from('scheduled_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('sent', false);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error canceling scheduled notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get scheduled notifications for a user
  static async getScheduledNotifications(userId: string): Promise<{ success: boolean; error?: string; notifications?: ScheduledNotification[] }> {
    try {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data, error } = await supabaseClient
        .from('scheduled_notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('sent', false)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;

      return { success: true, notifications: data || [] };
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Process scheduled notifications (to be called by a cron job)
  static async processScheduledNotifications(): Promise<{ success: boolean; error?: string; processedCount?: number }> {
    try {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        return { success: false, error: 'Supabase not configured' };
      }

      const now = new Date().toISOString();
      
      // Get notifications that should be sent now
      const { data: notifications, error } = await supabaseClient
        .from('scheduled_notifications')
        .select('*')
        .eq('sent', false)
        .lte('scheduled_for', now);

      if (error) throw error;
      if (!notifications || notifications.length === 0) {
        return { success: true, processedCount: 0 };
      }

      let processedCount = 0;

      for (const notification of notifications) {
        try {
          // Send the notification
          const result = await this.sendToUser(notification.user_id, notification.payload);
          
          if (result.success) {
            // Mark as sent
            await supabaseClient
              .from('scheduled_notifications')
              .update({ sent: true })
              .eq('id', notification.id);
            
            processedCount++;
          }
        } catch (error) {
          console.error(`Failed to process scheduled notification ${notification.id}:`, error);
        }
      }

      return { success: true, processedCount };
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get notification statistics
  static async getStatistics(): Promise<{ success: boolean; error?: string; stats?: any }> {
    try {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        return { success: false, error: 'Supabase not configured' };
      }

      // Get total subscriptions
      const { count: totalSubscriptions } = await supabaseClient
        .from('push_subscriptions')
        .select('*', { count: 'exact', head: true });

      // Get scheduled notifications count
      const { count: scheduledCount } = await supabaseClient
        .from('scheduled_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('sent', false);

      // Get sent notifications count (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: sentCount } = await supabaseClient
        .from('scheduled_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('sent', true)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const stats = {
        totalSubscriptions: totalSubscriptions || 0,
        scheduledNotifications: scheduledCount || 0,
        sentLast30Days: sentCount || 0,
        lastUpdated: new Date().toISOString()
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Error getting notification statistics:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Generate VAPID keys (for initial setup)
  static generateVapidKeys() {
    return webpush.generateVAPIDKeys();
  }
}