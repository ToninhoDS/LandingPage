
import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, ThumbsUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ReviewsSection = () => {
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

  const reviews = [
    {
      id: 1,
      client: "João Pedro",
      barber: "Carlos Silva",
      rating: 5,
      date: "Há 2 dias",
      comment: "Excelente profissional! A IA sugeriu um corte que ficou perfeito no meu rosto. Super recomendo!",
      service: "Corte + Barba"
    },
    {
      id: 2,
      client: "Marcus Vinícius",
      barber: "Roberto Santos",
      rating: 5,
      date: "Há 1 semana",
      comment: "Primeira vez usando o app e adorei! O sistema de agendamento é muito prático e o resultado ficou incrível.",
      service: "Fade Moderno"
    },
    {
      id: 3,
      client: "Rafael Costa",
      barber: "Fernando Costa",
      rating: 4,
      date: "Há 3 dias",
      comment: "Ótimo atendimento e resultado. A sugestão da IA foi certeira, mudou completamente meu visual!",
      service: "Pompadour"
    }
  ];

  const stats = [
    { label: "Clientes Satisfeitos", value: "12.5K+", icon: ThumbsUp },
    { label: "Avaliação Média", value: "4.9", icon: Star },
    { label: "Cortes Realizados", value: "25K+", icon: Award },
    { label: "Comentários", value: "8.2K+", icon: MessageSquare }
  ];

  return (
    <section id="reviews-section" ref={sectionRef} className="py-32 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`bg-black/50 backdrop-blur-md border-amber-400/30 p-8 text-center hover:bg-black/70 transition-all duration-500 group transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/20 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="inline-block p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl mb-6 group-hover:scale-125 transition-transform duration-500 shadow-xl shadow-amber-500/30">
                <stat.icon className="h-8 w-8 text-black" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">{stat.value}</div>
              <div className="text-gray-400 text-lg font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`} style={{ transitionDelay: '400ms' }}>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            O que nossos
            <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Clientes Dizem
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
            Experiências reais de quem já transformou seu visual com nossa plataforma
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviews.map((review, index) => (
            <Card 
              key={review.id} 
              className={`bg-gray-800/70 backdrop-blur-md border-gray-600 hover:border-amber-400/70 transition-all duration-500 group transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/20 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${600 + index * 150}ms` }}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="font-bold text-white text-lg group-hover:text-amber-400 transition-colors duration-300 mb-2">{review.client}</h4>
                    <p className="text-gray-400">Atendido por <span className="text-amber-400 font-semibold">{review.barber}</span></p>
                  </div>
                  <span className="text-gray-500 text-sm">{review.date}</span>
                </div>

                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < review.rating 
                          ? 'text-amber-400 fill-current' 
                          : 'text-gray-600'
                      }`} 
                    />
                  ))}
                  <span className="ml-2 text-amber-400 font-semibold text-lg">{review.rating}.0</span>
                </div>

                <p className="text-white mb-6 leading-relaxed text-lg">{review.comment}</p>

                <Badge variant="secondary" className="bg-amber-400/15 text-amber-400 border-amber-400/30 px-3 py-2">
                  {review.service}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
