import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Shield, 
  Star,
  Calculator,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const B2BPricingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('b2b-pricing');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: "Starter",
      description: "Para barbearias iniciantes",
      icon: Zap,
      color: "blue",
      pricing: {
        monthly: 97,
        yearly: 970
      },
      savings: billingCycle === 'yearly' ? '2 meses grátis' : null,
      features: [
        "Agendamento 24/7",
        "WhatsApp automático",
        "Até 2 profissionais",
        "Relatórios básicos",
        "Suporte por email",
        "App mobile completo"
      ],
      limitations: [
        "Máximo 500 agendamentos/mês",
        "Sem integrações avançadas",
        "Sem IA personalizada"
      ],
      cta: "Começar Teste Grátis",
      popular: false,
      roi: {
        investment: billingCycle === 'monthly' ? 97 : 970,
        expectedReturn: billingCycle === 'monthly' ? 1500 : 18000,
        paybackDays: 15
      }
    },
    {
      name: "Professional",
      description: "Para barbearias em crescimento",
      icon: Crown,
      color: "amber",
      pricing: {
        monthly: 197,
        yearly: 1970
      },
      savings: billingCycle === 'yearly' ? '2 meses grátis' : null,
      features: [
        "Tudo do Starter",
        "Até 5 profissionais",
        "Integrações completas",
        "Google Calendar sync",
        "N8N workflows",
        "IA básica",
        "Relatórios avançados",
        "Suporte prioritário",
        "Vendas noturnas",
        "Catálogo de produtos"
      ],
      limitations: [
        "Máximo 2000 agendamentos/mês"
      ],
      cta: "Mais Popular",
      popular: true,
      roi: {
        investment: billingCycle === 'monthly' ? 197 : 1970,
        expectedReturn: billingCycle === 'monthly' ? 3000 : 36000,
        paybackDays: 10
      }
    },
    {
      name: "Enterprise",
      description: "Para redes e grandes barbearias",
      icon: Shield,
      color: "purple",
      pricing: {
        monthly: 397,
        yearly: 3970
      },
      savings: billingCycle === 'yearly' ? '2 meses grátis' : null,
      features: [
        "Tudo do Professional",
        "Profissionais ilimitados",
        "Múltiplas unidades",
        "IA avançada personalizada",
        "API personalizada",
        "Relatórios executivos",
        "Suporte 24/7",
        "Gerente de conta dedicado",
        "Treinamento da equipe",
        "Customizações exclusivas"
      ],
      limitations: [],
      cta: "Falar com Vendas",
      popular: false,
      roi: {
        investment: billingCycle === 'monthly' ? 397 : 3970,
        expectedReturn: billingCycle === 'monthly' ? 8000 : 96000,
        paybackDays: 7
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        gradient: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-500/20'
      },
      amber: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        gradient: 'from-amber-500 to-amber-600',
        iconBg: 'bg-amber-500/20'
      },
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        gradient: 'from-purple-500 to-purple-600',
        iconBg: 'bg-purple-500/20'
      }
    };
    return colors[color as keyof typeof colors];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <section id="b2b-pricing" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTMwIDMwaDMwdjMwSDMweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-green-500/15 text-green-300 text-lg font-semibold rounded-full border border-green-500/30 backdrop-blur-sm inline-block mb-8">
              💰 Investimento que se Paga
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Planos que cabem
              <span className="block bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                no seu bolso
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Escolha o plano ideal para sua barbearia. Todos incluem teste grátis de 7 dias 
              e garantia de 30 dias. Se não aumentar sua receita, devolvemos seu dinheiro.
            </p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className={`flex justify-center mb-12 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gray-800/50 p-2 rounded-2xl backdrop-blur-sm border border-gray-700">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-green-500 text-black font-bold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-xl transition-all duration-300 relative ${
                  billingCycle === 'yearly'
                    ? 'bg-green-500 text-black font-bold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Anual
                <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                  -17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className={`grid lg:grid-cols-3 gap-8 mb-16 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 border-amber-500/50 border-2 scale-105' 
                  : `${getColorClasses(plan.color).bg} ${getColorClasses(plan.color).border} border`
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2 rounded-full font-bold text-sm flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    MAIS POPULAR
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`${getColorClasses(plan.color).iconBg} p-4 rounded-2xl w-fit mx-auto mb-4`}>
                  <plan.icon className={`h-8 w-8 ${getColorClasses(plan.color).text}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-white">
                    {formatCurrency(plan.pricing[billingCycle])}
                  </span>
                  <span className="text-gray-400 ml-2">
                    /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </div>
                {plan.savings && (
                  <div className="text-green-400 text-sm font-medium">
                    💰 {plan.savings}
                  </div>
                )}
              </div>

              {/* ROI Info */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">ROI Esperado:</span>
                  <span className="text-green-400 font-bold">
                    {formatCurrency(plan.roi.expectedReturn)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-300">Se paga em:</span>
                  <span className="text-green-400 font-bold">
                    {plan.roi.paybackDays} dias
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, limitIndex) => (
                  <div key={limitIndex} className="flex items-center">
                    <X className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-400 text-sm">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                className={`w-full py-4 text-lg font-bold ${
                  plan.popular
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black'
                    : `bg-gradient-to-r ${getColorClasses(plan.color).gradient} hover:opacity-90 text-white`
                }`}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className={`transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Compare os <span className="text-green-400">Planos</span>
            </h3>
            <p className="text-xl text-gray-300">
              Veja todas as funcionalidades lado a lado
            </p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-6 text-white font-bold">Funcionalidades</th>
                    <th className="text-center p-6 text-blue-400 font-bold">Starter</th>
                    <th className="text-center p-6 text-amber-400 font-bold">Professional</th>
                    <th className="text-center p-6 text-purple-400 font-bold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Agendamento 24/7', true, true, true],
                    ['WhatsApp Automático', true, true, true],
                    ['Profissionais', '2', '5', 'Ilimitado'],
                    ['Google Calendar', false, true, true],
                    ['Integrações N8N', false, true, true],
                    ['IA Personalizada', false, 'Básica', 'Avançada'],
                    ['Múltiplas Unidades', false, false, true],
                    ['Suporte', 'Email', 'Prioritário', '24/7'],
                    ['API Personalizada', false, false, true]
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-700/50">
                      <td className="p-6 text-gray-300 font-medium">{row[0]}</td>
                      <td className="p-6 text-center">
                        {typeof row[1] === 'boolean' ? (
                          row[1] ? <Check className="h-5 w-5 text-green-400 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-white">{row[1]}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row[2] === 'boolean' ? (
                          row[2] ? <Check className="h-5 w-5 text-green-400 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-white">{row[2]}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row[3] === 'boolean' ? (
                          row[3] ? <Check className="h-5 w-5 text-green-400 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-white">{row[3]}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Guarantee */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-2xl p-8 backdrop-blur-sm">
            <Shield className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              <span className="text-green-400">Garantia Total</span> de 30 Dias
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Se não aumentar sua receita em 30 dias, devolvemos 100% do seu dinheiro. 
              Sem perguntas, sem burocracia.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-400 mr-3" />
                <span className="text-white">7 dias grátis</span>
              </div>
              <div className="flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-400 mr-3" />
                <span className="text-white">30 dias garantia</span>
              </div>
              <div className="flex items-center justify-center">
                <Users className="h-6 w-6 text-green-400 mr-3" />
                <span className="text-white">Suporte incluído</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BPricingSection;