import { whatsappService, WhatsAppWebhookEvent } from '@/services/whatsapp';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode && token && challenge) {
    const verificationResult = whatsappService.verifyWebhook(mode, token, challenge);
    
    if (verificationResult) {
      console.log('Webhook verificado com sucesso');
      return new Response(challenge, { status: 200 });
    } else {
      console.log('Falha na verificação do webhook');
      return new Response('Forbidden', { status: 403 });
    }
  }

  return new Response('Bad Request', { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body: WhatsAppWebhookEvent = await request.json();
    
    // Verificar se é um evento do WhatsApp
    if (body.object !== 'whatsapp_business_account') {
      return new Response('Not a WhatsApp event', { status: 400 });
    }

    // Processar o webhook
    await whatsappService.handleWebhook(body);
    
    console.log('Webhook processado com sucesso');
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}