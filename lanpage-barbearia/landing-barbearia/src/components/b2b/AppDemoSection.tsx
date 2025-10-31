import React, { useState, useEffect } from 'react';
import { Play, Smartphone, Calendar, MessageSquare, BarChart3, Users, Clock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AppDemoSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('app-demo');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Auto-play demo steps
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveDemo((prev) => (prev + 1) % demoSteps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const demoSteps = [
    {
      id: 1,
      title: 'Agendamento Instantâneo',
      description: 'Cliente agenda em segundos, direto pelo WhatsApp',
      icon: Calendar,
      color: 'blue',
      features: ['Agenda 24/7', 'Confirmação automática', 'Lembretes inteligentes'],
      mockup: '📱 Cliente: "Quero agendar"\n🤖 Bot: "Que dia prefere?"\n📅 Agenda: Hoje 14h ✅'
    },
    {
      id: 2,
      title: 'Gestão Completa',
      description: 'Controle total da sua barbearia em tempo real',
      icon: BarChart3,
      color: 'green',
      features: ['Dashboard executivo', 'Relatórios automáticos', 'Métricas em tempo real'],
      mockup: '📊 Hoje: 12 clientes\n💰 Receita: R$ 840\n📈 +25% vs ontem'
    },
    {
      id: 3,
      title: 'WhatsApp Automático',
      description: 'Comunicação automatizada que funciona 24h',
      icon: MessageSquare,
      color: 'purple',
      features: ['Respostas automáticas', 'Confirmações', 'Promoções'],
      mockup: '💬 "Olá! Confirma seu horário\namanhã às 14h?"\n✅ "Sim, confirmado!"\n🎉 "Ótimo! Te esperamos!"'
    },
    {
      id: 4,
      title: 'Pagamentos Online',
      description: 'Receba antes mesmo do cliente chegar',
      icon: Users,
      color: 'amber',
      features: ['PIX instantâneo', 'Cartão de crédito', 'Parcelamento'],
      mockup: '💳 Pagamento recebido!\n💰 R$ 45,00 via PIX\n✅ João - Corte + Barba'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', accent: 'bg-blue-500' },
      green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', accent: 'bg-green-500' },
      purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', accent: 'bg-purple-500' },
      amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', accent: 'bg-amber-500' }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section id="app-demo" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-gradient-to-r from-amber-500/15 to-amber-600/15 text-amber-300 text-lg font-semibold rounded-full border border-amber-500/30 backdrop-blur-sm inline-block mb-8">
              🚀 Demonstração Interativa
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Veja o APP
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Revolucionando
              </span>
              sua Barbearia
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Descubra como mais de 500 barbearias estão automatizando processos, 
              aumentando receita e conquistando mais clientes com nossa plataforma.
            </p>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className={`transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Demo Controls */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-white">Funcionalidades Principais</h3>
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-6 py-2`}
                >
                  {isPlaying ? 'Pausar' : 'Auto-Play'}
                </Button>
              </div>

              <div className="space-y-4">
                {demoSteps.map((step, index) => (
                  <Card
                    key={step.id}
                    className={`p-6 cursor-pointer transition-all duration-300 ${
                      activeDemo === index
                        ? `${getColorClasses(step.color).bg} ${getColorClasses(step.color).border} border-2 scale-105`
                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
                    }`}
                    onClick={() => {
                      setActiveDemo(index);
                      setIsPlaying(false);
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${
                        activeDemo === index ? getColorClasses(step.color).accent : 'bg-gray-700'
                      }`}>
                        <step.icon className={`h-6 w-6 ${
                          activeDemo === index ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xl font-bold mb-2 ${
                          activeDemo === index ? 'text-white' : 'text-gray-300'
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`mb-3 ${
                          activeDemo === index ? 'text-gray-200' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                activeDemo === index
                                  ? `${getColorClasses(step.color).text} bg-white/10`
                                  : 'text-gray-500 bg-gray-700/50'
                              }`}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="relative">
              <div className="mx-auto w-80 h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-4 shadow-2xl border border-gray-600">
                {/* Phone Screen */}
                <div className="w-full h-full bg-black rounded-[2.5rem] p-6 overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-white text-sm mb-6">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-6 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className={`transition-all duration-500 ${getColorClasses(demoSteps[activeDemo].color).bg} rounded-2xl p-4 h-full border ${getColorClasses(demoSteps[activeDemo].color).border}`}>
                    <div className="text-center mb-6">
                      <div className={`inline-flex p-4 rounded-2xl ${getColorClasses(demoSteps[activeDemo].color).accent} mb-4`}>
                        {React.createElement(demoSteps[activeDemo].icon, { className: "h-8 w-8 text-white" })}
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        {demoSteps[activeDemo].title}
                      </h4>
                    </div>

                    {/* Demo Content */}
                    <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                      <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-mono">
                        {demoSteps[activeDemo].mockup}
                      </pre>
                    </div>

                    {/* Progress Indicators */}
                    <div className="flex justify-center space-x-2 mt-6">
                      {demoSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === activeDemo ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-green-500/90 backdrop-blur-sm rounded-2xl p-4 text-white">
                <div className="text-2xl font-bold">+40%</div>
                <div className="text-xs">Receita</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500/90 backdrop-blur-sm rounded-2xl p-4 text-white">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs">Online</div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className={`mt-20 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              Resultados <span className="text-amber-400">Comprovados</span>
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: '500+', label: 'Barbearias Ativas', icon: Users },
                { number: '+40%', label: 'Aumento de Receita', icon: BarChart3 },
                { number: '90%', label: 'Menos No-Shows', icon: CheckCircle },
                { number: '4.9★', label: 'Avaliação Média', icon: Star }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-amber-500/10 p-4 rounded-2xl w-fit mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-amber-400" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-amber-400/10 to-amber-600/10 border border-amber-400/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto para <span className="text-amber-400">Revolucionar</span> sua Barbearia?
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Teste todas as funcionalidades grátis por 7 dias. Configure em 5 minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold px-8 py-4 text-lg"
              >
                Começar Teste Grátis
              </Button>
              <Button 
                size="lg" 
                className="border-2 border-amber-400 text-amber-400 bg-transparent hover:bg-amber-400 hover:text-black px-8 py-4 text-lg transition-all duration-300"
              >
                <Play className="h-5 w-5 mr-2" />
                Ver Demo Completa
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Sem compromisso • Cancele quando quiser • Suporte 24/7 incluído
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDemoSection;