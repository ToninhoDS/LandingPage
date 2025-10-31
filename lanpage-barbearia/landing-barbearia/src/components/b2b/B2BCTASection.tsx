import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const B2BCTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('b2b-cta');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const benefits = [
    {
      icon: Clock,
      title: "Configuração em 5 minutos",
      description: "Setup automático, sem complicação"
    },
    {
      icon: Shield,
      title: "Garantia de 30 dias",
      description: "Não funcionou? Devolvemos seu dinheiro"
    },
    {
      icon: Zap,
      title: "Resultados em 7 dias",
      description: "Veja o aumento de agendamentos imediatamente"
    },
    {
      icon: Users,
      title: "Suporte especializado",
      description: "Equipe dedicada para barbearias"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Cadastre-se Grátis",
      description: "Crie sua conta em 30 segundos",
      icon: Rocket
    },
    {
      number: "2",
      title: "Configure seu APP",
      description: "Nossa equipe ajuda na configuração",
      icon: Calendar
    },
    {
      number: "3",
      title: "Comece a Lucrar",
      description: "Veja sua receita crescer automaticamente",
      icon: TrendingUp
    }
  ];

  const socialProof = [
    "500+ barbearias ativas",
    "50k+ agendamentos/mês",
    "98% satisfação",
    "+45% receita média"
  ];

  return (
    <section id="b2b-cta" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Urgency Timer */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm inline-block">
            <div className="text-red-400 text-sm font-medium mb-2">⚡ OFERTA LIMITADA</div>
            <div className="text-white text-lg font-bold mb-4">
              Teste grátis por 7 dias termina em:
            </div>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="bg-red-500/20 rounded-lg p-3 min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-red-400">HORAS</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-red-500/20 rounded-lg p-3 min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-red-400">MIN</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-red-500/20 rounded-lg p-3 min-w-[60px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-red-400">SEG</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Transforme sua barbearia
            <span className="block bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              HOJE MESMO
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Junte-se a mais de 500 barbearias que já aumentaram sua receita em 45% 
            com nosso sistema completo de gestão e agendamento.
          </p>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {socialProof.map((proof, index) => (
              <div key={index} className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <Star className="h-4 w-4 text-amber-400 mr-2" />
                <span className="text-white text-sm font-medium">{proof}</span>
              </div>
            ))}
          </div>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold px-12 py-6 text-xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Rocket className="h-6 w-6 mr-3" />
              COMEÇAR TESTE GRÁTIS AGORA
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-gray-600 text-white hover:bg-gray-800 px-12 py-6 text-xl rounded-2xl"
            >
              Ver Demonstração ao Vivo
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </div>

          <p className="text-gray-400 text-lg">
            ✅ Sem cartão de crédito • ✅ Cancele quando quiser • ✅ Suporte 24/7
          </p>
        </div>

        {/* Benefits Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 p-6 text-center backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="bg-amber-500/20 p-4 rounded-2xl w-fit mx-auto mb-4">
                <benefit.icon className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-300 text-sm">{benefit.description}</p>
            </Card>
          ))}
        </div>

        {/* How it Works */}
        <div className={`transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">
              Como Funciona em <span className="text-amber-400">3 Passos</span>
            </h3>
            <p className="text-xl text-gray-300">
              Da configuração aos primeiros resultados em menos de 24 horas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-y-1/2 z-0"></div>
                )}
                
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 p-8 backdrop-blur-sm relative z-10">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {step.number}
                  </div>
                  <step.icon className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-white mb-4">{step.title}</h4>
                  <p className="text-gray-300">{step.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className={`text-center transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <Card className="bg-gradient-to-br from-amber-400/10 to-amber-600/10 border-amber-400/30 border-2 p-12 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Não perca mais <span className="text-amber-400">clientes</span> e <span className="text-amber-400">dinheiro</span>
              </h3>
              <p className="text-2xl text-gray-300 mb-8">
                Cada dia que você espera é receita perdida. Comece agora e veja 
                sua barbearia crescer automaticamente.
              </p>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                  <span className="text-2xl font-bold text-white">Garantia de Resultados</span>
                </div>
                <p className="text-lg text-gray-300">
                  Se não aumentar sua receita em 30 dias, devolvemos 100% do seu dinheiro
                </p>
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold px-16 py-8 text-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6"
              >
                <Rocket className="h-8 w-8 mr-4" />
                QUERO TRANSFORMAR MINHA BARBEARIA AGORA
              </Button>

              <div className="text-gray-400 text-lg">
                <div className="mb-2">🚀 Configuração em 5 minutos</div>
                <div className="mb-2">💰 Primeiros resultados em 24h</div>
                <div>🛡️ Garantia total de 30 dias</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Info */}
        <div className={`text-center mt-12 transform transition-all duration-1000 delay-1100 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <p className="text-gray-400 mb-4">
            Precisa de ajuda? Fale com nossos especialistas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/5511999999999" 
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
            >
              WhatsApp: (11) 99999-9999
            </a>
            <a 
              href="mailto:vendas@barbeariaapp.com" 
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
            >
              Email: vendas@barbeariaapp.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BCTASection;