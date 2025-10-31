import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Users, TrendingDown, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ProblemSolutionSection = () => {
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

    const section = document.getElementById('problem-solution');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const problems = [
    {
      icon: Clock,
      title: "Perda de Tempo",
      description: "Horas perdidas atendendo telefone para agendamentos",
      impact: "4h/dia perdidas"
    },
    {
      icon: Users,
      title: "Clientes Perdidos",
      description: "No-shows e cancelamentos de última hora",
      impact: "30% dos agendamentos"
    },
    {
      icon: TrendingDown,
      title: "Receita Limitada",
      description: "Só funciona no horário comercial",
      impact: "60% menos vendas"
    },
    {
      icon: Calendar,
      title: "Desorganização",
      description: "Agenda bagunçada, conflitos de horários",
      impact: "Estresse diário"
    }
  ];

  const solutions = [
    {
      icon: CheckCircle,
      title: "Agendamento 24/7",
      description: "Clientes agendam sozinhos, qualquer hora",
      benefit: "Mais tempo para cortar"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Automático",
      description: "Confirmações e lembretes automáticos",
      benefit: "90% menos no-shows"
    },
    {
      icon: TrendingUp,
      title: "Vendas Noturnas",
      description: "Agendamentos e vendas 24h por dia",
      benefit: "+40% de receita"
    },
    {
      icon: Calendar,
      title: "Gestão Inteligente",
      description: "Agenda organizada com IA",
      benefit: "Zero conflitos"
    }
  ];

  return (
    <section id="problem-solution" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-red-500/15 text-red-300 text-lg font-semibold rounded-full border border-red-500/30 backdrop-blur-sm inline-block mb-8">
              ⚠️ Problemas Reais de Barbearias
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Pare de perder
              <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                dinheiro
              </span>
              todo dia
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Você trabalha duro, mas sua barbearia não cresce? Estes problemas estão 
              matando seu negócio silenciosamente.
            </p>
          </div>
        </div>

        {/* Problems vs Solutions */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Problems */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-red-400 mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 mr-3" />
                Seus Problemas Atuais
              </h3>
              <p className="text-gray-400">O que está impedindo seu crescimento</p>
            </div>

            <div className="space-y-6">
              {problems.map((problem, index) => (
                <Card key={index} className="bg-red-500/10 border-red-500/30 p-6 hover:bg-red-500/15 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-500/20 p-3 rounded-xl">
                      <problem.icon className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{problem.title}</h4>
                      <p className="text-gray-300 mb-2">{problem.description}</p>
                      <span className="text-red-400 font-semibold text-sm">
                        💸 {problem.impact}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className={`transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-green-400 mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 mr-3" />
                Nossa Solução
              </h3>
              <p className="text-gray-400">Como o APP resolve cada problema</p>
            </div>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <Card key={index} className="bg-green-500/10 border-green-500/30 p-6 hover:bg-green-500/15 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500/20 p-3 rounded-xl">
                      <solution.icon className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{solution.title}</h4>
                      <p className="text-gray-300 mb-2">{solution.description}</p>
                      <span className="text-green-400 font-semibold text-sm">
                        ✅ {solution.benefit}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-amber-400/10 to-amber-600/10 border border-amber-400/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Transforme Problemas em <span className="text-amber-400">Oportunidades</span>
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Mais de 500 barbearias já aumentaram sua receita em 40% com nosso APP
            </p>
            <div className="flex items-center justify-center space-x-8 text-amber-400">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-gray-400">Barbearias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">+40%</div>
                <div className="text-sm text-gray-400">Receita</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-gray-400">Funcionamento</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;