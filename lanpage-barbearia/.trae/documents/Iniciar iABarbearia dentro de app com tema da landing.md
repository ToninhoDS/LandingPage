## Arquitetura e Stack
- Basear no stack já usado: `React 18`, `Vite`, `Tailwind`, `shadcn/ui` (Radix), `React Router`, `TanStack Query`, `Supabase` (auth, DB, edge functions)
- Referências existentes: `landing-barbearia/package.json` confirma deps principais e router (`react-router-dom`) em `landing-barbearia/src/App.tsx:17-21`

## Reutilização de Tema
- Reusar o tema Tailwind com variáveis CSS da landing: `landing-barbearia/tailwind.config.ts:21-64` e `landing-barbearia/src/index.css:9-48`
- Importar a mesma camada base e utilitários, mantendo o visual preto/dourado e animações já definidas (`index.css:147-182`)

## Estrutura de Pastas (app)
- `app/web` — PWA público de agendamento multi-tenant
- `app/admin` — painel administrativo
- `app/shared` — componentes/ui, hooks e tema compartilhado
- `app/server` — edge functions (Supabase) para MVR, pagamentos, Google Agenda, webhooks n8n

## Rotas e Multi-Tenant
- Público: `/:slug/:tenantId/` como base do app sem login, seguindo o prompt
- Admin: `/` exibindo login e, após auth, navegação para dashboards
- Resolver `tenantId` e `slug` via loader/hook, carregando branding e configurações do tenant

## Páginas do APP Público
- Home do estabelecimento: banner, carrosséis, serviços, profissionais, horários
- Fluxo guiado com barra de progresso: serviço → profissional → dia → horário → +1 pessoa → pagamento → confirmar
- Carrossel invertido de horários com intervalos de 30 min, com animações e microinterações (usar `calendar.tsx`, `carousel.tsx`, `progress.tsx` já existentes)

## Painel Administrativo
- Configurações gerais: capa, fotos, dados do negócio
- Serviços: CRUD com preço, duração, status
- Profissionais: cadastro, dias/horários, disponibilidade
- Pagamentos: ativar/desativar meios
- Integrações: credenciais Google Agenda, webhook n8n

## MVR (Reserva Temporária)
- Ao escolher horário, criar reserva temporária de 5 min que bloqueia o slot para outros usuários
- Implementação no server: tabela `reservations` com `expires_at`, estado, `tenant_id`, `professional_id`, `slot_start`
- Função transacional `reserve_slot` que verifica disponibilidade e cria hold atômico; cron/edge function para liberar expirados
- UI mostra contagem regressiva e revalida slot com Query polling ou realtime

## Banco de Dados (Supabase)
- Tabelas: `tenants`, `services`, `professionals`, `schedules`, `slots`, `reservations`, `bookings`, `payments`, `customers`
- Índices por `tenant_id` e chaves compostas em `professional_id + slot_start`
- RLS por `tenant_id`; funções seguras para mutações críticas (MVR e confirmação)
- Referência Supabase atual: `landing-barbearia/src/integrations/supabase/client.ts:5-11` (migrar para `.env` e usar edge functions para chaves sensíveis)

## Integrações
- n8n: disparar webhook ao confirmar `booking` com payload contendo cliente, serviço, profissional, horário, valor e status
- Google Agenda: OAuth por tenant, armazenar tokens com segurança; edge function `sync_booking_to_google` cria evento após confirmação

## Pagamentos
- Suporte a: local, Pix, cartão, antecipado; modelo extensível por tenant
- Iniciar com Pix e pagamento/local; abstrair gateway futuro sem acoplar UI

## PWA
- `manifest.json` com nome iABarbearia, ícones e tema
- Service Worker (Workbox) para cache de assets, shell offline e fallback
- Prompt A2HS e banners de instalação

## Segurança e Configuração
- Remover chaves hardcoded; usar `VITE_` env para client e service keys apenas no server
- RLS ativa por `tenant_id`; validar inputs com `zod`; não logar dados sensíveis

## Fases de Implementação
- Fase 1: Scaffold `app/web` com tema da landing, rotas `/:slug/:tenantId/`, Home do estabelecimento, wizard de agendamento (UI e estado)
- Fase 2: `app/admin` com login, CRUD de serviços e profissionais, configurações
- Fase 3: Schema Supabase e edge functions para MVR (`reserve_slot`, `confirm_booking`, `release_expired`), integração n8n
- Fase 4: Integração Google Agenda + pagamentos básicos
- Fase 5: PWA (manifest, SW), otimizações e animações premium

## Validação
- Testes de fluxo de agendamento com simulação de concorrência para MVR
- Verificação de rotas multi-tenant e tema consistente
- Preview local do PWA e inspeção de SW/manifest

Confirma que posso iniciar a Fase 1 dentro de `app`, reutilizando o tema da `landing-barbearia` e criando a base de rotas multi-tenant?