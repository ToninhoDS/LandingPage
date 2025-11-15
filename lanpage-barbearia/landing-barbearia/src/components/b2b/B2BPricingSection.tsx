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
      name: "Plano Básico",
      description: "Essenciais para começar",
      icon: Zap,
      color: "blue",
      pricing: {
        monthly: 19.99,
        yearly: 19.99
      },
      savings: null,
      features: [
        "Link de agendamento com seu logo",
        "Ferramentas de gestão",
        "Personalização do site",
        "Integração com Google Agenda"
      ],
      limitations: [
        "Sem integração com WhatsApp",
        "Sem assistente automatizado"
      ],
      cta: "Contratar Plano Básico",
      popular: false
    },
    {
      name: "Plano Completo",
      description: "Tudo para automatizar sua barbearia",
      icon: Crown,
      color: "amber",
      pricing: {
        monthly: 29.99,
        yearly: 29.99
      },
      savings: null,
      features: [
        "Link de agendamento com seu logo",
        "Ferramentas de gestão",
        "Personalização do site",
        "Integração com WhatsApp",
        "Assistente que conversa e agenda automaticamente",
        "Integração com Google Agenda",
        "Automação via n8n"
      ],
      limitations: [],
      cta: "Contratar Plano Completo",
      popular: true
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
    <section id="b2b-pricing" className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTMwIDMwaDMwdjMwSDMweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-4 py-2 bg-green-500/15 text-green-300 text-sm font-semibold rounded-full border border-green-500/30 backdrop-blur-sm inline-block mb-6">
              💰 Investimento que se Paga
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Planos que cabem
              <span className="block bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                no seu bolso
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Escolha o plano ideal para sua barbearia. Todos incluem teste grátis de 7 dias 
              e garantia de 30 dias.
            </p>
          </div>
        </div>

        

        {/* Pricing Cards - Compactos e Responsivos */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 h-fit ${
                plan.popular 
                  ? 'bg-gradient-to-br from-[#0b0b0b] via-[#111111] to-[#0b0b0b] border-amber-500/60 ring-1 ring-amber-400/40 shadow-xl shadow-amber-500/30 transform scale-105' 
                  : `${getColorClasses(plan.color).bg} ${getColorClasses(plan.color).border} border`
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-1 rounded-full font-bold text-xs flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    MAIS POPULAR
                  </div>
                </div>
              )}

              {/* Plan Header - Compacto */}
              <div className="text-center mb-6">
                <div className={`${getColorClasses(plan.color).iconBg} p-3 rounded-xl w-fit mx-auto mb-3`}>
                  <plan.icon className={`h-6 w-6 ${getColorClasses(plan.color).text}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              {/* Pricing - Compacto */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center mb-1">
                  <span className="text-3xl font-bold text-white">
                    {formatCurrency(plan.pricing.monthly)}
                  </span>
                  <span className="text-gray-400 ml-1 text-sm">
                    /mês
                  </span>
                </div>
              </div>

              

              {/* Features - Limitadas para manter compacto */}
              <div className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-300 text-xs">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, limitIndex) => (
                  <div key={limitIndex} className="flex items-center">
                    <X className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-400 text-xs">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button - Compacto */}
              <Button 
                className={`w-full py-3 text-sm font-bold ${
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

        {/* Comparison Table - Mais compacta */}
        <div className={`transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-3">
              Compare os <span className="text-green-400">Planos</span>
            </h3>
            <p className="text-lg text-gray-300">
              Veja todas as funcionalidades lado a lado
            </p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-white font-bold text-sm">Funcionalidades</th>
                    <th className="text-center p-4 text-blue-400 font-bold text-sm">Básico</th>
                    <th className="text-center p-4 text-amber-400 font-bold text-sm">Completo</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Link de agendamento com logo', true, true],
                    ['Ferramentas de gestão', true, true],
                    ['Personalização do site', true, true],
                    ['Integração com WhatsApp', false, true],
                    ['Assistente que conversa e agenda', false, true],
                    ['Integração com Google Agenda', true, true],
                    ['Automação via n8n', false, true]
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-700/50">
                      <td className="p-4 text-gray-300 font-medium text-sm">{row[0]}</td>
                      <td className="p-4 text-center">
                        {typeof row[1] === 'boolean' ? (
                          row[1] ? <Check className="h-4 w-4 text-green-400 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-white text-sm">{row[1]}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row[2] === 'boolean' ? (
                          row[2] ? <Check className="h-4 w-4 text-green-400 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-white text-sm">{row[2]}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Guarantee - Compacta */}
        <div className={`text-center mt-12 transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              <span className="text-green-400">Garantia Total</span> de 30 Dias
            </h3>
            <p className="text-lg text-gray-300 mb-4">
              Se não aumentar sua receita em 30 dias, devolvemos 100% do seu dinheiro.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-white text-sm">7 dias grátis</span>
              </div>
              <div className="flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-white text-sm">30 dias garantia</span>
              </div>
              <div className="flex items-center justify-center">
                <Users className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-white text-sm">Suporte incluído</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BPricingSection;