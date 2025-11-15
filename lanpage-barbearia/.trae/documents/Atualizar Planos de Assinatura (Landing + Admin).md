## Objetivo
Substituir os planos atuais pela nova estrutura com dois planos (Completo e Básico), refletindo corretamente recursos e restrições na landing e na tela admin, e ajustar cópias inconsistentes.

## Escopo
- Landing: atualizar seção de preços, tabela de comparação e textos que afirmam WhatsApp/IA indiscriminadamente.
- Admin: exibir os planos ao usuário que contratou, com destaque do plano atual.

## Mudanças na Landing
- `landing-barbearia/src/components/b2b/B2BPricingSection.tsx`
  - Substituir os 3 planos atuais por 2:
    - 🟩 Plano Completo — R$ 29,99/mês
    - 🟧 Plano Básico — R$ 19,99/mês
  - Local do array atual: `B2BPricingSection.tsx:37-133` (const `plans`). Remover toggle anual e exibir apenas `/mês` (`B2BPricingSection.tsx:196-227`, `262-269`).
  - Atualizar a tabela de comparação para colunas “Completo” e “Básico”, com linhas:
    - Link de agendamento com logo (✔ em ambos)
    - Ferramentas de gestão (✔ em ambos)
    - Personalização do site (✔ em ambos)
    - Integração com WhatsApp (✔ Completo, ✖ Básico)
    - Assistente que conversa e agenda (✔ Completo, ✖ Básico)
    - Integração com Google Agenda (✔ em ambos)
    - Automação via n8n (✔ Completo, ✖ Básico)
  - Local da tabela: `B2BPricingSection.tsx:329-394`. Trocar cabeçalhos “Starter/Professional/Enterprise” por “Básico/Completo” e marcar `Check/X` conforme.
  - Manter formato de moeda com `Intl` (`B2BPricingSection.tsx:162-167`) e usar `29.99` / `19.99`.

- Ajustes de cópia (consistência com planos):
  - `BusinessFeaturesSection.tsx:54` — trocar “WhatsApp automático 24h e 1h antes” por “Lembretes por WhatsApp (Plano Completo)”.
  - `b2b/AppDemoSection.tsx:41` e `58-63` — adicionar nota “Disponível no Plano Completo” nas descrições de WhatsApp/automação.
  - `IntegrationsSection.tsx:40-51` — sinalizar recursos de WhatsApp/IA como “Plano Completo”; manter “Google Calendar” e recursos gerais em ambos. Opcional: badge “Plano Completo” ao lado de itens exclusivos.
  - `src/components/AppDemoSection.tsx:41-44` — marcar “Confirme por WhatsApp” como recurso do Plano Completo.

## Exibição na tela Admin
- Adicionar página “Planos” com cards e lista de recursos (✔/✖):
  - Novo arquivo: `app/web/src/pages/admin/Plans.tsx` (cards “Completo” e “Básico”, preço, features e indicação do plano atual).
  - Adicionar rota e link:
    - Rota: `app/web/src/App.tsx:15-21` — incluir `path="planos"` apontando para `Plans`.
    - Navegação: `app/web/src/pages/admin/AdminLayout.tsx` — inserir `NavLink` “Planos”.

## Centralização dos dados
- Definir estrutura dos planos (nome, preço, features) em um módulo:
  - Opção A: `landing-barbearia/src/config/plans.ts` e importar em `B2BPricingSection`.
  - Opção B: manter no componente por ora e replicar em `app/web` até existir um pacote compartilhado.

## Verificações de Consistência
- Remover/ajustar qualquer afirmação de “WhatsApp automático”, “IA/assistente” como disponível para todos os usuários.
- Garantir “Google Agenda” e “Gestão” apareçam em ambos os planos.
- Garantir “n8n” e “WhatsApp/Assistente” apareçam apenas no Completo.

## Validação
- Executar a aplicação e revisar:
  - Landing: preços e tabela de comparação atualizados, sem referências inconsistentes.
  - Admin: `/admin/planos` visível com os dois planos e destaque do plano atual.
  - Responsividade e acessibilidade ok em mobile e desktop.

Confirma que posso aplicar essas alterações?