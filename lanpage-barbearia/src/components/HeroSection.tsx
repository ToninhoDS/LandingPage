
import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-32 px-6 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced background decoration with parallax */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYmY3ZjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30 animate-pulse"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400/10 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-amber-400/10 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <div className={`inline-block mb-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-amber-400/15 text-amber-300 text-lg font-semibold rounded-full border border-amber-400/30 backdrop-blur-sm">
              ✨ Tecnologia + Tradição
            </span>
          </div>
          
          <h1 className={`text-6xl md:text-8xl font-bold text-white mb-10 leading-tight transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Sua barbearia
            <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-2xl">
              inteligente
            </span>
          </h1>
          
          <p className={`text-2xl md:text-3xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-light transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Descubra o corte perfeito com nossa IA avançada. Agende com os melhores barbeiros 
            e tenha uma experiência personalizada como nunca antes.
          </p>

          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-24 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold px-12 py-6 text-xl hover:from-amber-500 hover:to-amber-700 transform hover:scale-110 transition-all duration-500 shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60"
            >
              <Sparkles className="h-6 w-6 mr-3" />
              Descobrir Meu Estilo
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-amber-400/50 text-amber-400 hover:bg-amber-400/10 px-12 py-6 text-xl backdrop-blur-sm transform hover:scale-110 transition-all duration-500 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-400/20"
            >
              Ver Como Funciona
            </Button>
          </div>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: Zap,
              title: "IA Personalizada",
              description: "Nossa inteligência artificial analisa seu rosto e sugere os cortes que mais combinam com você.",
              delay: "900"
            },
            {
              icon: Users,
              title: "Barbeiros Expert",
              description: "Conecte-se com os melhores profissionais da sua região e agende quando for melhor para você.",
              delay: "1100"
            },
            {
              icon: Sparkles,
              title: "Experiência Premium",
              description: "Do agendamento à avaliação, cada etapa é pensada para oferecer o melhor atendimento.",
              delay: "1300"
            }
          ].map((feature, index) => (
            <Card key={index} className={`bg-white/10 backdrop-blur-md border-amber-400/30 p-10 hover:bg-white/15 transition-all duration-500 group transform hover:-translate-y-4 hover:shadow-2xl hover:shadow-amber-400/20 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{transitionDelay: `${feature.delay}ms`}}>
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-xl w-fit mb-8 group-hover:scale-125 transition-transform duration-500 shadow-xl shadow-amber-500/30">
                <feature.icon className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-amber-400 transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
