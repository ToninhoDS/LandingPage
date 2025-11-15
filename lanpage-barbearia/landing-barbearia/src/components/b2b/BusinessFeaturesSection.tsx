import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Clock, 
  CreditCard,
  Smartphone,
  Zap,
  Shield,
  TrendingUp,
  Settings,
  Bell
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BusinessFeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('agendamento');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('business-features');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const featureCategories = {
    agendamento: {
      title: 'Agendamento Inteligente',
      icon: Calendar,
      color: 'blue',
      features: [
        {
          icon: Clock,
          title: 'Agenda 24/7',
          description: 'Clientes agendam sozinhos, qualquer hora do dia',
          benefit: 'Sem perder clientes fora do horário'
        },
        {
          icon: Bell,
          title: 'Lembretes Automáticos',
          description: 'Lembretes por WhatsApp (Plano Completo)',
          benefit: '90% menos no-shows'
        },
        {
          icon: Users,
          title: 'Gestão de Profissionais',
          description: 'Cada barbeiro com sua agenda e especialidades',
          benefit: 'Organização total'
        },
        {
          icon: Calendar,
          title: 'Bloqueios Inteligentes',
          description: 'Feriados, folgas e horários especiais',
          benefit: 'Zero conflitos'
        }
      ]
    },
    vendas: {
      title: 'Vendas & Pagamentos',
      icon: CreditCard,
      color: 'green',
      features: [
        {
          icon: CreditCard,
          title: 'Pagamento Online',
          description: 'PIX, cartão e parcelamento direto no app',
          benefit: 'Receba antes do serviço'
        },
        {
          icon: BarChart3,
          title: 'Relatórios Completos',
          description: 'Faturamento, clientes, serviços mais vendidos',
          benefit: 'Decisões baseadas em dados'
        },
        {
          icon: TrendingUp,
          title: 'Vendas Noturnas',
          description: 'Clientes compram produtos 24h por dia',
          benefit: '+30% de receita extra'
        },
        {
          icon: Smartphone,
          title: 'Catálogo Digital',
          description: 'Produtos e serviços com fotos e preços',
          benefit: 'Venda mais e melhor'
        }
      ]
    },
    gestao: {
      title: 'Gestão Completa',
      icon: Settings,
      color: 'purple',
      features: [
        {
          icon: Users,
          title: 'Cadastro de Clientes',
          description: 'Histórico completo, preferências e observações',
          benefit: 'Atendimento personalizado'
        },
        {
          icon: BarChart3,
          title: 'Dashboard Executivo',
          description: 'Métricas em tempo real do seu negócio',
          benefit: 'Controle total'
        },
        {
          icon: Shield,
          title: 'Backup Automático',
          description: 'Seus dados seguros na nuvem',
          benefit: 'Zero risco de perda'
        },
        {
          icon: Zap,
          title: 'Automações',
          description: 'Fluxos automáticos para tarefas repetitivas',
          benefit: 'Mais tempo para cortar'
        }
      ]
    }
  };

  const tabs = [
    { id: 'agendamento', label: 'Agendamento', icon: Calendar },
    { id: 'vendas', label: 'Vendas', icon: CreditCard },
    { id: 'gestao', label: 'Gestão', icon: Settings }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        iconBg: 'bg-blue-500/20'
      },
      green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        iconBg: 'bg-green-500/20'
      },
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        iconBg: 'bg-purple-500/20'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section id="business-features" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-amber-500/15 text-amber-300 text-lg font-semibold rounded-full border border-amber-500/30 backdrop-blur-sm inline-block mb-8">
              🚀 Funcionalidades Completas
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Tudo que sua barbearia
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                precisa em um APP
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Sistema completo de gestão desenvolvido especificamente para barbearias modernas. 
              Desde agendamento até vendas, tudo integrado e automatizado.
            </p>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className={`transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800/50 p-2 rounded-2xl backdrop-blur-sm border border-gray-700">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-amber-500 text-black font-bold'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Content */}
        <div className={`transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {Object.entries(featureCategories).map(([key, category]) => (
            <div
              key={key}
              className={`${activeTab === key ? 'block' : 'hidden'} transition-all duration-500`}
            >
              <div className="text-center mb-12">
                <div className={`inline-flex items-center px-6 py-3 rounded-2xl mb-6 ${getColorClasses(category.color).bg} ${getColorClasses(category.color).border} border backdrop-blur-sm`}>
                  <category.icon className={`h-8 w-8 mr-3 ${getColorClasses(category.color).text}`} />
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.features.map((feature, index) => (
                  <Card 
                    key={index} 
                    className={`${getColorClasses(category.color).bg} ${getColorClasses(category.color).border} border p-6 hover:scale-105 transition-all duration-300 backdrop-blur-sm`}
                  >
                    <div className={`${getColorClasses(category.color).iconBg} p-3 rounded-xl w-fit mb-4`}>
                      <feature.icon className={`h-6 w-6 ${getColorClasses(category.color).text}`} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{feature.description}</p>
                    <div className={`text-sm font-semibold ${getColorClasses(category.color).text}`}>
                      ✅ {feature.benefit}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className={`mt-20 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              Resultados Comprovados
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-400 mb-2">500+</div>
                <div className="text-gray-300">Barbearias Ativas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">+40%</div>
                <div className="text-gray-300">Aumento de Receita</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">90%</div>
                <div className="text-gray-300">Menos No-Shows</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-300">Funcionamento</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-amber-400/10 to-amber-600/10 border border-amber-400/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto para <span className="text-amber-400">Revolucionar</span> sua Barbearia?
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Teste todas as funcionalidades grátis por 7 dias. Sem compromisso.
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
                Ver Demonstração
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Configuração em 5 minutos • Suporte especializado • Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessFeaturesSection;