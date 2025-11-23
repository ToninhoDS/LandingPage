# ✅ **PROMPT FINAL — APP PWA iABarbearia (Com Planos Atualizados)**

Quero que você desenvolva um **APP PWA moderno e profissional** para barbearias, chamado **iABarbearia**, utilizando as **cores e identidade visual da minha Landing Page**.
O sistema deve oferecer **experiência premium**, animações, microinterações, fluidez e foco em **alta conversão**.

---

# 🎨 **1. Identidade Visual do APP**

* Usar as cores e estilo da minha landing page.
* Layout elegante, com UX moderna e de alto padrão.
* Microinterações visuais durante seleção de serviços, carregamento, progresso etc.
* O APP será 100% PWA com comportamento de aplicativo nativo.

---

# 🌐 **2. Estrutura de Domínio / Rotas**

### **Painel Administrativo do Contratante**

```
https://www.iabarbearia.com/
```

* Aqui aparece o **login administrativo**.
* Cada contratante acessa seu painel, configura serviços, profissionais, agenda, pagamentos etc.

### **APP Público do Contratante (sem login)**

```
https://www.iabarbearia.com/[slug-do-contratante]/[tenantId]/
```

Exemplo:

```
https://www.iabarbearia.com/barbearia-do-luiz/1234/
```

Nesta rota:

* NÃO deve aparecer botão de login
* Apenas o APP público do contratante
* Exibir:

  * capa/banner
  * carrossel de fotos
  * carrossel de horários disponíveis
  * serviços
  * profissionais
  * botões temáticos de ação
  * fluxo de agendamento completo

---

# 🧔‍♂️ **3. APP Público — Fluxo do Usuário (cliente)**

### **Tela inicial**

* Banner/capa do estabelecimento
* Carrossel com fotos enviadas pelo contratante
* Segundo carrossel com horários disponíveis
* Botões temáticos:

  * Agendar Serviço
  * Ver Profissionais
  * Serviços Disponíveis

### **Processo Guiado com Barra de Progresso**

1. Selecionar serviço
2. Selecionar profissional
3. Escolher dia
4. Escolher horário
5. Adicionar outra pessoa (opcional)
6. Escolher pagamento
7. Confirmar

### **Sistema de Reserva Temporária (MVR)**

* Quando um horário é selecionado, bloquear por **5 minutos**
* Outros usuários não podem agendar o mesmo horário durante esse período
* Horários sempre em intervalos de **30 minutos**

---

# 🛠️ **4. Painel Administrativo**

O contratante pode:

### **Configurações Gerais**

* Alterar capa/banner
* Adicionar fotos ao carrossel
* Definir nome e informações do estabelecimento

### **Profissionais**

* Cadastrar profissionais
* Definir horários e dias disponíveis
* Ativar/desativar profissionais

### **Serviços**

* Cadastrar serviços (corte, barba, estética, etc.)
* Preço
* Tempo de execução
* Ativar/desativar

### **Pagamentos**

Ativar ou não:

* Pagar no local
* Pix
* Cartão
* Pagamento antecipado
* Pagar no ato do corte

### **Integração com Google Agenda**

* Inserir credenciais
* Agendamentos aparecem automaticamente na agenda do contratante

---

# 🔔 **5. Integração com n8n — WhatsApp (Para Plano Completo)**

O sistema enviará webhooks para fluxos no n8n, permitindo:

* Enviar mensagens automáticas ao WhatsApp do cliente
* Envio de lembretes
* Mensagens de confirmação
* Status do agendamento
* Notificação ao profissional

### **Assistente / Agente Inteligente**

(Disponível apenas no **Plano Completo**)

O agente será capaz de:

* Conversar com usuários via WhatsApp
* Ajudar o cliente a escolher serviço
* Mostrar horários disponíveis
* Agendar diretamente via WhatsApp
* Confirmar e registrar o agendamento na plataforma
* Sincronizar com Google Agenda

---

# 💳 **6. PLANOS DE ASSINATURA (Atualizado)**
- eles sao exibidos na tela admin do usuario que contratou o sistema
## 🟩 **PLANO COMPLETO**

**R$ 29,99 / mês**

Inclui:

* Link de agendamento com seu logo
* Ferramentas de gestão
* Personalização do site
* **Integração com WhatsApp**
* **Assistente que conversa com os clientes e agenda automaticamente**
* Integração com Google Agenda
* Automação via n8n

---

## 🟧 **PLANO BÁSICO**

**R$ 19,99 / mês** (aprox. R$ 1/dia)

Inclui:

* Link de agendamento com seu logo
* Ferramentas de gestão
* Personalização do site
* Integração com Google Agenda
* ❌ **Sem integração com WhatsApp**
* ❌ Sem assistente automatizado

---

# 📱 **7. Requisitos Técnicos**

* PWA com experiência nativa
* Multi-tenant (estrutura por slug + tenantId)
* MVR bloqueando horários por 5 minutos
* Animações e microinterações
* Estrutura escalável
* Alto desempenho


