import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Smartphone, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Clock,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

const AppDemoSection = () => {
  const [activeDemo, setActiveDemo] = useState('scheduling');

  const demoFeatures = {
    scheduling: {
      title: 'Agendamento Inteligente',
      description: 'Sistema completo de agendamentos com confirmação automática',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Agenda online 24/7',
        'Confirmação automática via WhatsApp',
        'Lembretes personalizados',
        'Reagendamento fácil',
        'Bloqueio de horários'
      ]
    },
    whatsapp: {
      title: 'WhatsApp Business',
      description: 'Automação completa de mensagens e atendimento',
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      features: [
        'Mensagens automáticas',
        'Confirmação de agendamentos',
        'Lembretes personalizados',
        'Atendimento 24h',
        'Histórico de conversas'
      ]
    },
    analytics: {
      title: 'Relatórios e Analytics',
      description: 'Dados completos para otimizar seu negócio',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Faturamento em tempo real',
        'Clientes mais frequentes',
        'Horários de pico',
        'Taxa de no-show',
        'Crescimento mensal'
      ]
    }
  };

  const stats = [
    { label: 'Agendamentos/dia', value: '150+', icon: Calendar },
    { label: 'Taxa de conversão', value: '89%', icon: CheckCircle },
    { label: 'Satisfação', value: '4.9★', icon: Star },
    { label: 'Tempo economizado', value: '5h/dia', icon: Clock }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
            Demonstração do APP
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Veja o APP em <span className="text-blue-400">Ação</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubra como nosso aplicativo revoluciona a gestão da sua barbearia 
            com tecnologia de ponta e automação inteligente
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(demoFeatures).map(([key, feature]) => {
            const IconComponent = feature.icon;
            return (
              <Button
                key={key}
                variant={activeDemo === key ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveDemo(key)}
                className={`${
                  activeDemo === key 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                {feature.title}
              </Button>
            );
          })}
        </div>

        {/* Demo Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Demo Video/Image Placeholder */}
          <div className="relative">
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {/* Phone Frame */}
                  <div className="relative w-64 h-[500px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                      {/* Status Bar */}
                      <div className="h-8 bg-gray-100 flex items-center justify-between px-4 text-xs">
                        <span>9:41</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                          <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                          <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* App Content */}
                      <div className={`h-full bg-gradient-to-br ${demoFeatures[activeDemo].color} p-4 text-white`}>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            {React.createElement(demoFeatures[activeDemo].icon, { 
                              className: "w-8 h-8 text-white" 
                            })}
                          </div>
                          <h3 className="text-lg font-bold mb-2">
                            {demoFeatures[activeDemo].title}
                          </h3>
                          <p className="text-sm opacity-90 mb-6">
                            {demoFeatures[activeDemo].description}
                          </p>
                          
                          {/* Feature List */}
                          <div className="space-y-2">
                            {demoFeatures[activeDemo].features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 mr-2 text-white/80" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <Button 
                    size="lg"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full w-16 h-16 p-0"
                  >
                    <Play className="w-6 h-6 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Features */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                {demoFeatures[activeDemo].title}
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                {demoFeatures[activeDemo].description}
              </p>
              
              <div className="space-y-4">
                {demoFeatures[activeDemo].features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Smartphone className="w-5 h-5 mr-2" />
                Testar APP Grátis
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Play className="w-5 h-5 mr-2" />
                Ver Demo Completa
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-gray-800/50 border-gray-700 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Pronto para Revolucionar sua Barbearia?
              </h3>
              <p className="text-blue-100 mb-6">
                Teste gratuitamente por 14 dias e veja o impacto no seu faturamento
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Começar Teste Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppDemoSection;