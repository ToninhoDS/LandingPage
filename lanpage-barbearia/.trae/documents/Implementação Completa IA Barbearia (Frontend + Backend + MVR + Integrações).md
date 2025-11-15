## Objetivo
- Entregar um PWA de agendamento para barbearias com painel administrativo, fluxo progressivo, MVR (bloqueio 5 min), integração n8n/WhatsApp, Google Agenda e pagamentos.

## Escopo
- Frontend React já iniciado será evoluído com Tailwind, Framer Motion, React Query.
- Backend Node com Redis para locks de MVR, endpoints REST, integrações n8n/Google Agenda, autenticação JWT para painel.

## Arquitetura
- Frontend: React + Vite, SPA com rotas `/` (painel) e `/:slug/:tenantId/*` (público).
- Backend: Fastify (ou NestJS) + Prisma (ou Drizzle) para ORM.
- Cache/locks: Redis para MVR 5 min.
- Integrações: Webhook n8n, Google Calendar API.

## Frontend
1. Tailwind CSS
- Instalar e configurar Tailwind (tema black + amarelo suave, componentes básicos: botão, card, input).
- Migrar `styles.css` para utilitários Tailwind mantendo o visual atual.

2. Framer Motion
- Animar transições entre passos (enter/exit), microinterações nos botões.

3. React Query + Axios
- Criar client HTTP e camada de hooks (`useServices`, `useProfessionals`, `useSlots`, `useBooking`).
- Estados do fluxo: serviço → profissional → data → horário → lock → dados → resumo → pagamento → confirmação.

4. Páginas e rotas
- Painel: telas de Serviços, Profissionais, Horários, Pagamentos, Google Agenda, Webhook n8n, Assinaturas.
- Público: componentes de carrossel, seleção de slots 30 min, adição multi-pessoa.

5. PWA/Performance
- Ícones no `manifest`, offline fallback de assets, precache básico.
- Lighthouse 90+: lazy-loading, code-splitting das rotas, imagens otimizadas.

## Backend
1. Base do servidor
- Fastify com rotas REST conforme tabela de endpoints definida no prompt.
- Configuração CORS, validação com Zod/TypeBox.

2. Modelos de dados
- Implementar tabelas: tenants, services, professionals, schedules, bookings, locks, payment_methods, google_integrations, webhooks, subscriptions.

3. Endpoints
- `/api/:slug/:tenantId/services`, `/professionals`, `/slots`, `/lock`, `/book`, `/confirm`, `/cancel`.
- Admin: `/api/admin/:tenantId/config` (GET/POST) e endpoints para gestão (CRUD) de serviços/profissionais/horários.

4. MVR (bloqueio 5 min)
- Redis: chave composta `lock:{tenantId}:{professionalId}:{date}:{time}` com TTL 300s.
- Ao clicar no slot: verificar lock; se livre, criar lock e retornar contador.

5. Integração n8n
- Após confirmação, enviar `POST` ao webhook do tenant com payload do booking.

6. Google Agenda
- OAuth no painel; salvar credenciais; criar evento na agenda do profissional/estabelecimento ao confirmar.

7. Pagamentos
- Ativar/desativar métodos; integração com gateway (stub inicial). Para Pix: gerar payload; Cartão: integração futura; Local: marcar como `pending_confirmed`.

8. Autenticação
- JWT para painel administrativo; escopo por `tenantId`.

## Infra e DevOps
- Variáveis de ambiente (`.env`) para Redis, n8n webhook, Google API, gateway.
- Docker Compose para Redis.
- Seeds de dados demo (serviços, profissionais, horários).
- Testes unitários e e2e (frontend: Playwright; backend: Vitest/Jest).
- Logs estruturados e tratamento de erros.

## Milestones
- Fase 1: Frontend UI/UX premium (Tailwind + Framer Motion) e fluxo completo usando mocks.
- Fase 2: Backend mínimo com slots de 30 min e MVR via Redis.
- Fase 3: n8n webhook e painel para configurar URL.
- Fase 4: Google Agenda e métodos de pagamento.
- Fase 5: Assinaturas (Starter/Pro/Business), polimento, Lighthouse 90+.

## Entregáveis
- Frontend funcional com transições e tema.
- API com documentação (OpenAPI), banco e Redis.
- Integrações n8n/Google Agenda operacionais.
- PWA instalável e responsivo.

## Validação
- Rotas públicas/admin funcionando nas URLs.
- Bloqueio MVR auditável (TTL Redis).
- Webhook n8n recebendo payload e enviando WhatsApp.
- Eventos criados na Google Agenda após confirmação.
- Testes e relatório de performance.

Confirma a execução deste plano? Após confirmação, inicio pela Fase 1 (Tailwind + Framer Motion + hooks de dados) e preparo os stubs de API para integração progressiva.