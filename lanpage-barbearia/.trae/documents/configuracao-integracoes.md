# Configuração das Integrações

Este documento explica como configurar as integrações do sistema de barbearia.

## 🔧 Integrações Disponíveis

### 1. Google Calendar
**Funcionalidade**: Sincronização automática de agendamentos com Google Calendar

**Configuração necessária**:
```env
# No arquivo app/.env
VITE_GOOGLE_CALENDAR_API_KEY=sua_api_key_aqui
VITE_GOOGLE_CALENDAR_ID=primary
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui

# No arquivo admin-panel/api/.env
GOOGLE_CALENDAR_API_KEY=sua_api_key_aqui
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
```

**Como obter as credenciais**:
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google Calendar API
4. Crie credenciais OAuth 2.0
5. Configure as URLs de redirecionamento

### 2. WhatsApp Business API
**Funcionalidade**: Envio automático de confirmações e lembretes via WhatsApp

**Configuração necessária**:
```env
# No arquivo app/.env
VITE_WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
VITE_WHATSAPP_ACCESS_TOKEN=seu_access_token

# No arquivo admin-panel/api/.env
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=seu_webhook_token
```

**Como obter as credenciais**:
1. Acesse [Meta for Developers](https://developers.facebook.com/)
2. Crie um app Business
3. Configure WhatsApp Business API
4. Obtenha o Phone Number ID e Access Token

### 3. Stripe (Pagamentos)
**Funcionalidade**: Processamento de pagamentos online

**Configuração necessária**:
```env
# No arquivo app/.env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# No arquivo admin-panel/api/.env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Como obter as credenciais**:
1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
2. Crie uma conta ou faça login
3. Vá em Developers > API keys
4. Copie as chaves pública e secreta

## 🚀 Como Ativar as Integrações

### Passo 1: Configurar Variáveis de Ambiente
1. Copie os arquivos `.env.example` para `.env` em cada projeto
2. Preencha as variáveis de ambiente com suas credenciais

### Passo 2: Testar as Integrações
Execute o endpoint de status para verificar se as integrações estão funcionando:

```bash
curl http://localhost:3001/api/status
```

Resposta esperada:
```json
{
  "stripe": {
    "configured": true,
    "healthy": true
  },
  "whatsapp": {
    "configured": true,
    "healthy": true
  },
  "googleCalendar": {
    "configured": true,
    "healthy": true
  }
}
```

### Passo 3: Configurar Webhooks (Opcional)

#### Stripe Webhooks
1. No Stripe Dashboard, vá em Developers > Webhooks
2. Adicione endpoint: `http://localhost:3001/api/stripe/webhook`
3. Selecione os eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`

#### WhatsApp Webhooks
1. Configure o webhook URL: `http://localhost:3001/api/whatsapp/webhook`
2. Use o WEBHOOK_VERIFY_TOKEN configurado

## 🔍 Testando as Funcionalidades

### Teste do Google Calendar
```bash
# Obter URL de autorização
curl http://localhost:3001/api/google/auth-url

# Testar saúde da integração
curl http://localhost:3001/api/google/health
```

### Teste do WhatsApp
```bash
# Enviar mensagem de teste
curl -X POST http://localhost:3001/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5511999999999",
    "message": "Teste de integração WhatsApp"
  }'
```

### Teste do Stripe
```bash
# Criar Payment Intent de teste
curl -X POST http://localhost:3001/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "brl",
    "description": "Teste de pagamento"
  }'
```

## 🛠️ Solução de Problemas

### Erro: "Integration not configured"
- Verifique se todas as variáveis de ambiente estão preenchidas
- Reinicie o servidor após alterar o .env

### Erro: "API key invalid"
- Verifique se as credenciais estão corretas
- Confirme se as APIs estão ativadas nos respectivos consoles

### Erro: "CORS"
- Verifique se as URLs estão configuradas corretamente no CORS
- Confirme se os domínios estão autorizados nas configurações das APIs

## 📝 Notas Importantes

1. **Ambiente de Desenvolvimento**: Use sempre as chaves de teste
2. **Segurança**: Nunca commite arquivos .env no repositório
3. **Produção**: Configure as variáveis de ambiente no servidor de produção
4. **Monitoramento**: Use os endpoints de health check para monitorar as integrações

## 🔗 Links Úteis

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Stripe API Documentation](https://stripe.com/docs/api)