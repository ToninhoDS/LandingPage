import React, { useState, useEffect } from 'react';
import { Play, Smartphone, Calendar, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AppDemoSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);

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

  const demoSteps = [
    {
      icon: Smartphone,
      title: "Abra o App",
      description: "Interface intuitiva e moderna",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20mobile%20app%20interface%20barbershop%20login%20screen%20dark%20theme%20amber%20accents&image_size=portrait_4_3"
    },
    {
      icon: Calendar,
      title: "Escolha o Horário",
      description: "Veja disponibilidade em tempo real",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20app%20calendar%20booking%20interface%20barbershop%20appointment%20scheduling%20dark%20theme&image_size=portrait_4_3"
    },
    {
      icon: MessageCircle,
      title: "Confirme por WhatsApp (Plano Completo)",
      description: "Receba confirmação instantânea",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=whatsapp%20chat%20interface%20barbershop%20appointment%20confirmation%20mobile%20screen&image_size=portrait_4_3"
    },
    {
      icon: Star,
      title: "Avalie o Serviço",
      description: "Compartilhe sua experiência",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20app%20rating%20review%20interface%20barbershop%20service%20evaluation%20stars&image_size=portrait_4_3"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demoSteps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [demoSteps.length]);

  return (
    <section id="app-demo" className="py-32 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-amber-400/15 text-amber-300 text-lg font-semibold rounded-full border border-amber-400/30 backdrop-blur-sm mb-8 inline-block">
              📱 Demonstração do App
            </span>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Veja como é
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                simples usar
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Em apenas alguns toques, você agenda seu corte, recebe confirmação e ainda pode avaliar o serviço. 
              Tudo integrado e automatizado.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Demo Steps */}
          <div className={`space-y-8 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            {demoSteps.map((step, index) => (
              <Card 
                key={index}
                className={`p-8 cursor-pointer transition-all duration-500 ${
                  activeDemo === index 
                    ? 'bg-amber-400/20 border-amber-400/50 shadow-xl shadow-amber-400/20' 
                    : 'bg-white/5 border-gray-700/50 hover:bg-white/10'
                }`}
                onClick={() => setActiveDemo(index)}
              >
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-xl transition-all duration-300 ${
                    activeDemo === index 
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600' 
                      : 'bg-gray-700'
                  }`}>
                    <step.icon className={`h-8 w-8 ${
                      activeDemo === index ? 'text-black' : 'text-white'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                      activeDemo === index ? 'text-amber-400' : 'text-white'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-lg">
                      {step.description}
                    </p>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    activeDemo === index 
                      ? 'border-amber-400 bg-amber-400' 
                      : 'border-gray-600'
                  }`}>
                    {activeDemo === index && (
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Phone Mockup */}
          <div className={`relative transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-4 shadow-2xl">
              {/* Phone Frame */}
              <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                {/* Status Bar */}
                <div className="h-8 bg-black flex items-center justify-between px-6 text-white text-sm">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white rounded-sm">
                      <div className="w-3 h-1 bg-white rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                {/* App Content */}
                <div className="h-full bg-gradient-to-br from-gray-900 to-black p-4">
                  <img 
                    src={demoSteps[activeDemo].image}
                    alt={demoSteps[activeDemo].title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-400/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-400/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold px-12 py-6 text-xl hover:from-amber-500 hover:to-amber-700 transform hover:scale-110 transition-all duration-500 shadow-2xl shadow-amber-500/40"
          >
            <Play className="h-6 w-6 mr-3" />
            Experimentar Agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AppDemoSection;