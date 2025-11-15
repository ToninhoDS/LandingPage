import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Zap, 
  Bot, 
  Smartphone,
  CreditCard,
  BarChart3,
  Shield,
  CheckCircle,
  ArrowRight,
  Workflow
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const IntegrationsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIntegration, setActiveIntegration] = useState('whatsapp');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('integrations');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const integrations = {
    whatsapp: {
      title: 'WhatsApp Business API (Plano Completo)',
      icon: MessageSquare,
      color: 'green',
      description: 'Automação completa via WhatsApp oficial',
      features: [
        'Confirmação automática de agendamentos (Plano Completo)',
        'Lembretes 24h e 1h antes do horário (Plano Completo)',
        'Cancelamentos e reagendamentos pelo chat (Plano Completo)',
        'Catálogo de produtos integrado (Plano Completo)',
        'Atendimento 24/7 com IA (Plano Completo)',
        'Histórico completo de conversas (Plano Completo)'
      ],
      benefits: [
        '90% redução em no-shows',
        'Atendimento sem interrupção',
        'Vendas diretas pelo WhatsApp',
        'Cliente nunca fica sem resposta'
      ],
      stats: {
        efficiency: '90%',
        response: '24/7',
        sales: '+30%'
      }
    },
    calendar: {
      title: 'Google Calendar Sync',
      icon: Calendar,
      color: 'blue',
      description: 'Sincronização bidirecional em tempo real',
      features: [
        'Agenda sincronizada automaticamente',
        'Bloqueios de horário em tempo real',
        'Múltiplos calendários por profissional',
        'Notificações push nativas',
        'Backup automático na nuvem',
        'Acesso offline aos agendamentos'
      ],
      benefits: [
        'Zero conflitos de horário',
        'Agenda sempre atualizada',
        'Acesso de qualquer dispositivo',
        'Backup seguro dos dados'
      ],
      stats: {
        sync: '100%',
        conflicts: '0',
        uptime: '99.9%'
      }
    },
    n8n: {
      title: 'N8N Workflows',
      icon: Workflow,
      color: 'purple',
      description: 'Automações avançadas personalizadas',
      features: [
        'Fluxos de trabalho personalizados',
        'Integração com múltiplas ferramentas',
        'Automação de tarefas repetitivas',
        'Relatórios automáticos por email',
        'Backup e sincronização de dados',
        'Webhooks para sistemas externos'
      ],
      benefits: [
        'Processos 100% automatizados',
        'Economia de 4h/dia',
        'Integração com qualquer sistema',
        'Escalabilidade infinita'
      ],
      stats: {
        automation: '100%',
        timeSaved: '4h/dia',
        integrations: '∞'
      }
    },
    ai: {
      title: 'Agentes de IA',
      icon: Bot,
      color: 'amber',
      description: 'Inteligência artificial para atendimento',
      features: [
        'Atendimento inteligente 24/7',
        'Agendamentos por voz e texto',
        'Recomendações personalizadas',
        'Análise de sentimento do cliente',
        'Previsão de demanda',
        'Otimização automática de agenda'
      ],
      benefits: [
        'Atendimento humanizado 24h',
        'Vendas inteligentes',
        'Clientes sempre satisfeitos',
        'Decisões baseadas em IA'
      ],
      stats: {
        availability: '24/7',
        satisfaction: '95%',
        intelligence: 'GPT-4'
      }
    }
  };

  const integrationTabs = [
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'calendar', label: 'Google Calendar', icon: Calendar },
    { id: 'n8n', label: 'N8N Workflows', icon: Workflow },
    { id: 'ai', label: 'IA Agents', icon: Bot }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        iconBg: 'bg-green-500/20',
        gradient: 'from-green-400 to-green-600'
      },
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        iconBg: 'bg-blue-500/20',
        gradient: 'from-blue-400 to-blue-600'
      },
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        iconBg: 'bg-purple-500/20',
        gradient: 'from-purple-400 to-purple-600'
      },
      amber: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        iconBg: 'bg-amber-500/20',
        gradient: 'from-amber-400 to-amber-600'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section id="integrations" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTMwIDMwaDMwdjMwSDMweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-blue-500/15 text-blue-300 text-lg font-semibold rounded-full border border-blue-500/30 backdrop-blur-sm inline-block mb-8">
              🔗 Integrações Poderosas
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Conecte tudo que
              <span className="block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                sua barbearia usa
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Integrações nativas com as principais ferramentas do mercado. 
              Automatize processos e conecte seu negócio ao futuro.
            </p>
          </div>
        </div>

        {/* Integration Tabs */}
        <div className={`transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex justify-center mb-12 overflow-x-auto">
            <div className="bg-gray-800/50 p-2 rounded-2xl backdrop-blur-sm border border-gray-700 min-w-fit">
              <div className="flex space-x-2">
                {integrationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveIntegration(tab.id)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                      activeIntegration === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold'
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

        {/* Integration Content */}
        <div className={`transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {Object.entries(integrations).map(([key, integration]) => (
            <div
              key={key}
              className={`${activeIntegration === key ? 'block' : 'hidden'} transition-all duration-500`}
            >
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Integration Info */}
                <div>
                  <div className={`inline-flex items-center px-6 py-3 rounded-2xl mb-6 ${getColorClasses(integration.color).bg} ${getColorClasses(integration.color).border} border backdrop-blur-sm`}>
                    <integration.icon className={`h-8 w-8 mr-3 ${getColorClasses(integration.color).text}`} />
                    <h3 className="text-2xl font-bold text-white">{integration.title}</h3>
                  </div>
                  
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    {integration.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {Object.entries(integration.stats).map(([key, value]) => (
                      <div key={key} className={`text-center p-4 ${getColorClasses(integration.color).bg} rounded-xl border ${getColorClasses(integration.color).border}`}>
                        <div className={`text-2xl font-bold ${getColorClasses(integration.color).text}`}>
                          {value}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold text-white mb-4">Benefícios Principais:</h4>
                    {integration.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className={`h-5 w-5 mr-3 ${getColorClasses(integration.color).text}`} />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features List */}
                <div>
                  <h4 className="text-2xl font-bold text-white mb-6">Funcionalidades:</h4>
                  <div className="space-y-4">
                    {integration.features.map((feature, index) => (
                      <Card 
                        key={index} 
                        className={`${getColorClasses(integration.color).bg} ${getColorClasses(integration.color).border} border p-4 hover:scale-105 transition-all duration-300 backdrop-blur-sm`}
                      >
                        <div className="flex items-center">
                          <div className={`${getColorClasses(integration.color).iconBg} p-2 rounded-lg mr-4`}>
                            <ArrowRight className={`h-4 w-4 ${getColorClasses(integration.color).text}`} />
                          </div>
                          <span className="text-white font-medium">{feature}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Flow */}
        <div className={`mt-20 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Como Funciona a <span className="text-blue-400">Integração</span>
            </h3>
            <p className="text-xl text-gray-300">
              Configuração automática em poucos cliques
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Conectar',
                description: 'Conecte suas contas com 1 clique',
                icon: Zap
              },
              {
                step: '2',
                title: 'Configurar',
                description: 'Personalize as automações',
                icon: Shield
              },
              {
                step: '3',
                title: 'Automatizar',
                description: 'Deixe tudo funcionando sozinho',
                icon: Bot
              },
              {
                step: '4',
                title: 'Lucrar',
                description: 'Veja sua receita crescer',
                icon: BarChart3
              }
            ].map((step, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 p-6 text-center backdrop-blur-sm">
                <div className="bg-blue-500/20 p-4 rounded-full w-fit mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-blue-400 font-bold text-lg mb-2">Passo {step.step}</div>
                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-blue-400/10 to-purple-600/10 border border-blue-400/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto para <span className="text-blue-400">Automatizar</span> Tudo?
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Configure todas as integrações em menos de 10 minutos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg"
              >
                Configurar Integrações
              </Button>
              <Button 
                size="lg" 
                className="border-2 border-blue-400 text-blue-400 bg-transparent hover:bg-blue-400 hover:text-black px-8 py-4 text-lg transition-all duration-300"
              >
                Ver Demonstração
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Suporte técnico incluído • Configuração gratuita • Funciona em 5 minutos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;