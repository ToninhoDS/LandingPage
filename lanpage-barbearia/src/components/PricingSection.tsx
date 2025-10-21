
import React, { useState, useEffect, useRef } from 'react';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PricingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: "Básico",
      price: "R$ 29",
      description: "Perfeito para barbeiros iniciantes",
      icon: Zap,
      features: [
        "Até 50 agendamentos/mês",
        "Análise IA básica",
        "1 barbeiro",
        "Suporte por email"
      ],
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 59",
      description: "Ideal para barbearias em crescimento",
      icon: Crown,
      features: [
        "Agendamentos ilimitados",
        "Análise IA avançada",
        "Até 3 barbeiros",
        "Relatórios detalhados",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "R$ 99",
      description: "Para barbearias estabelecidas",
      icon: Sparkles,
      features: [
        "Tudo do Profissional",
        "Barbeiros ilimitados",
        "IA personalizada",
        "Integração com redes sociais",
        "Suporte 24/7"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing-section" ref={sectionRef} className="py-32 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto max-w-6xl">
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Planos e
            <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Preços
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
            Escolha o plano ideal para sua barbearia e comece a transformar seu negócio hoje mesmo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative bg-gray-800/90 backdrop-blur-sm border-gray-600 hover:border-amber-400/70 transition-all duration-500 group transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/20 ${
                plan.popular ? 'border-amber-400 bg-amber-400/10 shadow-2xl shadow-amber-400/30 scale-105' : ''
              } ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold px-6 py-2 text-sm">
                    MAIS POPULAR
                  </Badge>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-amber-500/30">
                    <plan.icon className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-white mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-400">/mês</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-white">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full transition-all duration-300 transform hover:scale-105 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white hover:shadow-lg'
                  }`}
                  size="lg"
                >
                  Começar Teste Grátis
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className={`text-center mt-16 transform transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <p className="text-white text-lg mb-6">
            14 dias grátis • Sem compromisso • Cancele quando quiser
          </p>
          <p className="text-gray-400">
            Precisa de um plano personalizado? 
            <button className="text-amber-400 hover:text-amber-300 ml-2 font-semibold underline">
              Entre em contato
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
