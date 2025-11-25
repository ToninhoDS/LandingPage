## Contexto Atual
- No agendador, o "Resumo do Agendamento" (card grande) e o strip compacto aparecem juntos no passo 5, gerando redundância visual.
- O strip compacto é renderizado por `BookingSummaryStrip` quando `step >= 1`.

## Mudança Proposta
- Renderizar `BookingSummaryStrip` apenas nas etapas iniciais (passos 1–3) e ocultá-lo quando o card de resumo unificado estiver ativo.
- Assim, no passo 5 o strip não aparecerá, mantendo apenas o card de resumo grande.

## Implementação
- Editar `app/src/components/SchedulingWizard.tsx` próximo ao bloco de renderização do `BookingSummaryStrip`.
- Substituir a condição atual:
```
{step >= 1 && (
  <BookingSummaryStrip
    selectedProfessional={selectedProfessional}
    selectedService={selectedService}
    selectedDay={selectedDay}
    selectedTime={selectedTime}
    compact={true}
  />
)}
```
- Pela condição restrita às etapas 1–3 e quando o resumo unificado não estiver visível:
```
{step >= 1 && step <= 3 && !showSummary && (
  <BookingSummaryStrip
    selectedProfessional={selectedProfessional}
    selectedService={selectedService}
    selectedDay={selectedDay}
    selectedTime={selectedTime}
    compact={true}
  />
)}
```

## Validação
- Rodar o build para garantir ausência de erros.
- Navegar pelos passos 1–7 verificando:
  - Passos 1–3: strip compacto aparece corretamente.
  - Passo 4 em diante (inclui passo 5): apenas o card de resumo unificado aparece; o strip não.
- Confirmar no passo 5 que o bloco com "PROFISSIONAL" e avatar não aparece mais.

## Impacto na UX
- Elimina duplicidade de informações no passo 5.
- Mantém contexto nos passos iniciais e foco no resumo unificado nas etapas finais.

Confirma para eu aplicar a alteração e validar em seguida?