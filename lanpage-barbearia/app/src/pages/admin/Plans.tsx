import { Check, X, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Plano Básico",
    price: 19.99,
    icon: Zap,
    color: "blue",
    features: [
      "Link de agendamento com seu logo",
      "Ferramentas de gestão",
      "Personalização do site",
      "Integração com Google Agenda"
    ],
    limitations: [
      "Sem integração com WhatsApp",
      "Sem assistente automatizado"
    ]
  },
  {
    name: "Plano Completo",
    price: 29.99,
    icon: Crown,
    color: "amber",
    features: [
      "Link de agendamento com seu logo",
      "Ferramentas de gestão",
      "Personalização do site",
      "Integração com WhatsApp",
      "Assistente que conversa e agenda automaticamente",
      "Integração com Google Agenda",
      "Automação via n8n"
    ],
    limitations: []
  }
];

const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const AdminPlans = () => {
  const currentPlan = "Plano Completo";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h1 className="text-2xl font-bold mb-2">Planos de Assinatura</h1>
        <p className="text-neutral-300">Escolha o plano ideal para sua barbearia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative rounded-xl border p-6 ${
              plan.name === currentPlan
                ? "border-amber-500 bg-amber-500/10"
                : "border-neutral-800 bg-neutral-900"
            }`}
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-800 mb-2">
                {plan.icon && (
                  <plan.icon className={plan.name === currentPlan ? "text-amber-400" : "text-white"} />
                )}
              </div>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="text-3xl font-bold mt-1">
                {formatBRL(plan.price)} <span className="text-sm text-neutral-300">/ mês</span>
              </div>
              {plan.name === currentPlan && (
                <div className="mt-2 text-xs font-semibold text-amber-400">Plano atual</div>
              )}
            </div>

            <div className="space-y-2">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-neutral-200">{f}</span>
                </div>
              ))}
              {plan.limitations.map((l, i) => (
                <div key={i} className="flex items-center text-sm">
                  <X className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-neutral-400">{l}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                className={`w-full rounded-md px-4 py-2 font-semibold ${
                  plan.name === currentPlan
                    ? "bg-neutral-800 text-white"
                    : "bg-amber-500 text-black hover:bg-amber-600"
                }`}
              >
                {plan.name === currentPlan ? "Seu plano atual" : "Escolher este plano"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPlans;