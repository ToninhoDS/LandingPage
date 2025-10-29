
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Camera, Wand2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AIStylesSection = () => {
  const [selectedStyle, setSelectedStyle] = useState(null);
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

  const popularStyles = [
    {
      id: 1,
      name: "Fade Clássico",
      description: "Corte moderno com degradê lateral",
      image: "/placeholder.svg",
      difficulty: "Fácil",
      duration: "45 min",
      trend: "+25%"
    },
    {
      id: 2,
      name: "Pompadour",
      description: "Estilo vintage com volume no topo",
      image: "/placeholder.svg",
      difficulty: "Médio",
      duration: "60 min",
      trend: "+18%"
    },
    {
      id: 3,
      name: "Undercut",
      description: "Lateral raspada com topo longo",
      image: "/placeholder.svg",
      difficulty: "Fácil",
      duration: "40 min",
      trend: "+32%"
    },
    {
      id: 4,
      name: "Quiff Moderno",
      description: "Mistura de pompadour com mohawk",
      image: "/placeholder.svg",
      difficulty: "Difícil",
      duration: "75 min",
      trend: "+41%"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Fácil': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Médio': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Difícil': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <section id="ai-styles-section" ref={sectionRef} className="py-32 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-amber-500/20 text-amber-300 text-sm font-semibold rounded-full border border-amber-500/40 backdrop-blur-sm">
              🤖 Powered by AI
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Descubra seu
            <span className="block bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              Estilo Perfeito
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white max-w-4xl mx-auto mb-16 leading-relaxed font-medium">
            Nossa IA analisa seu formato de rosto, estilo de vida e preferências para sugerir 
            os cortes que mais combinam com você
          </p>

          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold px-10 py-6 text-lg hover:from-purple-600 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              <Camera className="h-6 w-6 mr-3" />
              Analisar Meu Rosto
            </Button>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold px-10 py-6 text-lg hover:from-amber-500 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50"
            >
              <Wand2 className="h-6 w-6 mr-3" />
              Gerar Sugestões IA
            </Button>
          </div>
        </div>

        {/* Popular Styles Grid */}
        <div className="mb-20">
          <div className={`flex items-center justify-between mb-12 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h3 className="text-3xl md:text-4xl font-bold text-white">Estilos em Tendência</h3>
            <div className="flex items-center text-amber-400 bg-amber-500/20 px-4 py-2 rounded-full border border-amber-500/40">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="font-semibold">Baseado em dados reais</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularStyles.map((style, index) => (
              <Card 
                key={style.id}
                className={`bg-gray-800/90 backdrop-blur-sm border-gray-600 hover:border-amber-400/70 hover:shadow-2xl hover:shadow-amber-400/20 transition-all duration-500 cursor-pointer group overflow-hidden transform hover:-translate-y-2 ${
                  selectedStyle === style.id ? 'border-amber-400 bg-amber-400/10 shadow-2xl shadow-amber-500/30' : ''
                } ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
                onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 border-b border-gray-600">
                  ✂️
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                      {style.name}
                    </h4>
                    <div className="flex items-center text-green-400 text-sm font-semibold bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {style.trend}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{style.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getDifficultyColor(style.difficulty)}>
                      {style.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-700/80 text-gray-200 border border-gray-600">
                      {style.duration}
                    </Badge>
                  </div>

                  {selectedStyle === style.id && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-lg border border-amber-400/40 animate-fade-in">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105 transition-all duration-300"
                        >
                          Ver Detalhes
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 border-amber-400 text-amber-400 hover:bg-amber-400/10 transform hover:scale-105 transition-all duration-300"
                        >
                          Agendar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Analysis Card */}
        <Card className={`bg-gray-800/90 backdrop-blur-sm border-amber-400/40 shadow-2xl transform transition-all duration-1000 delay-1200 hover:scale-105 hover:shadow-amber-400/30 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="p-12 text-center">
            <div className="inline-block p-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-8 shadow-2xl shadow-purple-500/40">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Análise Personalizada por IA
            </h3>
            
            <p className="text-white text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
              Carregue sua foto e nossa inteligência artificial analisará seu formato de rosto, 
              textura do cabelo e estilo pessoal para criar sugestões únicas para você.
            </p>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 via-purple-600 to-amber-500 text-white font-bold px-16 py-6 text-xl hover:from-purple-600 hover:via-purple-700 hover:to-amber-600 transform hover:scale-110 transition-all duration-500 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60"
            >
              <Camera className="h-6 w-6 mr-3" />
              Começar Análise IA
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AIStylesSection;
