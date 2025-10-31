import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import axios from 'axios';
import { google } from 'googleapis';
import { PushNotificationService, type NotificationPayload, type PushSubscription, type ScheduledNotification } from '../services/pushNotificationService.js';
import crypto from 'crypto';
import webpush from 'web-push';

const router = express.Router();

// Stripe integration - lazy initialization
let stripe: Stripe | null = null;

function getStripeClient(): Stripe | null {
  if (stripe) return stripe;
  
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    });
    return stripe;
  }
  
  return null;
}

// Lazy initialization for web-push
let webpushConfigured = false;

function configureWebPush() {
  if (!webpushConfigured && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    webpushConfigured = true;
  }
  return webpushConfigured;
}

// WhatsApp Webhook Verification
router.get('/whatsapp/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log('WhatsApp webhook verified');
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// WhatsApp Webhook Handler
router.post('/whatsapp/webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Check if this is a WhatsApp webhook event
    if (body.object) {
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
        const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        const msgBody = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

        console.log(`Received message from ${from}: ${msgBody}`);

        // Process the incoming message
        await processIncomingWhatsAppMessage(from, msgBody, phoneNumberId);

        // Mark message as read
        await markMessageAsRead(body.entry[0].changes[0].value.messages[0].id, phoneNumberId);
      }

      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process incoming WhatsApp message
async function processIncomingWhatsAppMessage(from: string, message: string, phoneNumberId: string) {
  try {
    // Here you can implement your business logic
    // For example, check if it's an appointment confirmation, cancellation, etc.
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('agendar') || lowerMessage.includes('marcar')) {
      // Handle appointment booking request
      await sendWhatsAppMessage(from, 'Olá! Para agendar um horário, acesse nosso app ou site. Em breve um de nossos atendentes entrará em contato.', phoneNumberId);
    } else if (lowerMessage.includes('cancelar')) {
      // Handle cancellation request
      await sendWhatsAppMessage(from, 'Para cancelar seu agendamento, por favor entre em contato conosco ou use nosso app.', phoneNumberId);
    } else if (lowerMessage.includes('horário') || lowerMessage.includes('funcionamento')) {
      // Handle business hours inquiry
      await sendWhatsAppMessage(from, 'Nosso horário de funcionamento é de segunda a sábado, das 8h às 18h.', phoneNumberId);
    } else {
      // Default response
      await sendWhatsAppMessage(from, 'Obrigado pela sua mensagem! Em breve retornaremos o contato.', phoneNumberId);
    }

    // Log the interaction
    console.log(`Processed message from ${from}: ${message}`);
  } catch (error) {
    console.error('Error processing incoming message:', error);
  }
}

// Send WhatsApp message helper
async function sendWhatsAppMessage(to: string, message: string, phoneNumberId: string) {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    const whatsappMessage = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body: message,
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      whatsappMessage,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

// Mark WhatsApp message as read
async function markMessageAsRead(messageId: string, phoneNumberId: string) {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
}

// Push Notifications Routes

// Subscribe to push notifications
router.post('/push-notifications/subscribe', async (req: Request, res: Response) => {
  try {
    if (!configureWebPush()) {
      return res.status(500).json({ error: 'Push notifications not configured' });
    }

    const { user_id, endpoint, p256dh, auth } = req.body;

    if (!user_id || !endpoint || !p256dh || !auth) {
      return res.status(400).json({ error: 'Missing required subscription data' });
    }

    const subscription: PushSubscription = {
      user_id,
      endpoint,
      p256dh,
      auth
    };

    const result = await PushNotificationService.subscribe(subscription);

    if (result.success) {
      res.json({ success: true, message: 'Subscription saved successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Unsubscribe from push notifications
router.post('/push-notifications/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { user_id, endpoint } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }

    const result = await PushNotificationService.unsubscribe(user_id, endpoint);

    if (result.success) {
      res.json({ success: true, message: 'Unsubscribed successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Send push notification to user
router.post('/push-notifications/send', async (req: Request, res: Response) => {
  try {
    if (!configureWebPush()) {
      return res.status(500).json({ error: 'Push notifications not configured' });
    }

    const { user_id, payload } = req.body;

    if (!user_id || !payload) {
      return res.status(400).json({ error: 'Missing user_id or payload' });
    }

    const result = await PushNotificationService.sendToUser(user_id, payload);

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Notification sent successfully',
        sentCount: result.sentCount 
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Send bulk push notifications
router.post('/push-notifications/bulk', async (req: Request, res: Response) => {
  try {
    if (!configureWebPush()) {
      return res.status(500).json({ error: 'Push notifications not configured' });
    }

    const { user_ids, payload } = req.body;

    if (!user_ids || !Array.isArray(user_ids) || !payload) {
      return res.status(400).json({ error: 'Missing user_ids array or payload' });
    }

    const result = await PushNotificationService.sendToUsers(user_ids, payload);

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Bulk notifications sent',
        sentCount: result.sentCount 
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error sending bulk push notifications:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Send notification to role
router.post('/push-notifications/send-to-role', async (req: Request, res: Response) => {
  try {
    if (!configureWebPush()) {
      return res.status(500).json({ error: 'Push notifications not configured' });
    }

    const { role, payload } = req.body;

    if (!role || !payload) {
      return res.status(400).json({ error: 'Missing role or payload' });
    }

    const result = await PushNotificationService.sendToRole(role, payload);

    if (result.success) {
      res.json({ 
        success: true, 
        message: `Notifications sent to role: ${role}`,
        sentCount: result.sentCount 
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error sending notifications to role:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Schedule push notification
router.post('/push-notifications/schedule', async (req: Request, res: Response) => {
  try {
    if (!configureWebPush()) {
      return res.status(500).json({ error: 'Push notifications not configured' });
    }

    const { user_id, title, body, payload, scheduled_for } = req.body;

    if (!user_id || !title || !body || !payload || !scheduled_for) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const notification: ScheduledNotification = {
      user_id,
      title,
      body,
      payload,
      scheduled_for,
      sent: false
    };

    const result = await PushNotificationService.scheduleNotification(notification);

    if (result.success) {
      res.json({ 
        success: true, 
        id: result.id,
        message: 'Notification scheduled successfully' 
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error scheduling push notification:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Cancel scheduled notification
router.delete('/push-notifications/cancel/:notificationId', async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const result = await PushNotificationService.cancelScheduledNotification(notificationId);

    if (result.success) {
      res.json({ success: true, message: 'Scheduled notification cancelled' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error cancelling scheduled notification:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get scheduled notifications for user
router.get('/push-notifications/scheduled/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await PushNotificationService.getScheduledNotifications(userId);

    if (result.success) {
      res.json({ 
        success: true, 
        notifications: result.notifications 
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get notification statistics
router.get('/push-notifications/stats', async (req: Request, res: Response) => {
  try {
    const result = await PushNotificationService.getStatistics();

    if (result.success) {
      res.json({ 
        success: true, 
        stats: result.stats 
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error getting notification stats:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Process scheduled notifications (for cron job)
router.post('/push-notifications/process-scheduled', async (req: Request, res: Response) => {
  try {
    const result = await PushNotificationService.processScheduledNotifications();

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Scheduled notifications processed',
        processedCount: result.processedCount 
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error processing scheduled notifications:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get VAPID public key
router.get('/push-notifications/vapid-key', (req: Request, res: Response) => {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    
    if (!publicKey) {
      return res.status(500).json({ error: 'VAPID public key not configured' });
    }

    res.json({ publicKey });
  } catch (error) {
    console.error('Error getting VAPID public key:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Stripe Payment Intent Creation
router.post('/payments/create-intent', async (req: Request, res: Response) => {
  try {
    const stripeClient = getStripeClient();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { amount, currency, description, customerEmail, customerName, metadata } = req.body;

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency,
      description,
      metadata,
      receipt_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Payment Confirmation
router.post('/payments/confirm', async (req: Request, res: Response) => {
  try {
    const stripeClient = getStripeClient();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { payment_intent_id, payment_method_id } = req.body;

    const paymentIntent = await stripeClient.paymentIntents.confirm(payment_intent_id, {
      payment_method: payment_method_id,
    });

    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Payment Cancellation
router.post('/payments/cancel', async (req, res) => {
  try {
    const stripeClient = getStripeClient();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { payment_intent_id } = req.body;

    const paymentIntent = await stripeClient.paymentIntents.cancel(payment_intent_id);

    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Refund Creation
router.post('/payments/refund', async (req, res) => {
  try {
    const stripeClient = getStripeClient();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { payment_intent_id, amount, reason } = req.body;

    const refund = await stripeClient.refunds.create({
      payment_intent: payment_intent_id,
      amount,
      reason,
    });

    res.json({
      id: refund.id,
      status: refund.status,
      amount: refund.amount,
      reason: refund.reason,
    });
  } catch (error) {
    console.error('Error creating refund:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Payment Status
router.get('/payments/status/:payment_intent_id', async (req, res) => {
  try {
    const stripeClient = getStripeClient();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { payment_intent_id } = req.params;

    const paymentIntent = await stripeClient.paymentIntents.retrieve(payment_intent_id);

    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Customer Payments
router.get('/payments/customer/:email', async (req, res) => {
  try {
    const stripeClient = getStripeClient();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { email } = req.params;

    const customers = await stripeClient.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.json({ payments: [] });
    }

    const customer = customers.data[0];
    const paymentIntents = await stripeClient.paymentIntents.list({
      customer: customer.id,
      limit: 100,
    });

    res.json({
      payments: paymentIntents.data.map(pi => ({
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        created: pi.created,
        description: pi.description,
        metadata: pi.metadata,
      })),
    });
  } catch (error) {
    console.error('Error getting customer payments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Health Check
router.get('/payments/health', async (req, res) => {
  try {
    const stripeClient = getStripeClient();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    // Test Stripe connection by listing a small number of payment intents
    await stripeClient.paymentIntents.list({ limit: 1 });
    res.json({ status: 'ok', service: 'stripe' });
  } catch (error) {
    console.error('Stripe health check failed:', error);
    res.status(500).json({ status: 'error', service: 'stripe', error: error.message });
  }
});

// WhatsApp Message Sending
router.post('/whatsapp/send', async (req, res) => {
  try {
    const { to, message, type = 'text' } = req.body;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      return res.status(400).json({ error: 'WhatsApp not configured' });
    }

    const whatsappMessage = {
      messaging_product: 'whatsapp',
      to,
      type,
      text: {
        body: message,
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      whatsappMessage,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      success: true,
      messageId: response.data.messages[0].id,
      status: response.data.messages[0].message_status,
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: error.message });
  }
});

// WhatsApp Health Check
router.get('/whatsapp/health', async (req, res) => {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      return res.status(400).json({ status: 'error', service: 'whatsapp', error: 'Not configured' });
    }

    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${phoneNumberId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    res.json({ status: 'ok', service: 'whatsapp', data: response.data });
  } catch (error) {
    console.error('WhatsApp health check failed:', error);
    res.status(500).json({ status: 'error', service: 'whatsapp', error: error.message });
  }
});

// Google Calendar OAuth URL
router.get('/google/auth-url', (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = ['https://www.googleapis.com/auth/calendar'];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    res.json({ authUrl: url });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Google Calendar OAuth Callback
router.post('/google/callback', async (req, res) => {
  try {
    const { code } = req.body;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens securely (in production, use a database)
    // For now, we'll return them to the client
    res.json({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    });
  } catch (error) {
    console.error('Error handling Google OAuth callback:', error);
    res.status(500).json({ error: error.message });
  }
});

// Google Calendar Health Check
router.get('/google/health', async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(400).json({ status: 'error', service: 'google-calendar', error: 'Not configured' });
    }

    res.json({ status: 'ok', service: 'google-calendar', configured: true });
  } catch (error) {
    console.error('Google Calendar health check failed:', error);
    res.status(500).json({ status: 'error', service: 'google-calendar', error: error.message });
  }
});

// Integration Status Check
router.get('/status', async (req, res) => {
  try {
    const status = {
      stripe: {
        configured: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY),
        healthy: false,
      },
      whatsapp: {
        configured: !!(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN),
        healthy: false,
      },
      googleCalendar: {
        configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        healthy: false,
      },
      pushNotifications: {
        configured: !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
        healthy: false,
      },
    };

    // Test each service health
    try {
      if (status.stripe.configured) {
        const stripeClient = getStripeClient();
        if (stripeClient) {
          await stripeClient.paymentIntents.list({ limit: 1 });
          status.stripe.healthy = true;
        }
      }
    } catch (error) {
      console.error('Stripe health check failed:', error);
    }

    try {
      if (status.whatsapp.configured) {
        const response = await axios.get(
          `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            },
          }
        );
        status.whatsapp.healthy = response.status === 200;
      }
    } catch (error) {
      console.error('WhatsApp health check failed:', error);
    }

    status.googleCalendar.healthy = status.googleCalendar.configured;
    status.pushNotifications.healthy = status.pushNotifications.configured;

    res.json(status);
  } catch (error) {
    console.error('Error checking integration status:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;