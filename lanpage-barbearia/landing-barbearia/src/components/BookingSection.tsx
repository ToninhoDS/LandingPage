
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BookingSection = () => {
  const [selectedBarber, setSelectedBarber] = useState(null);
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

  const barbers = [
    {
      id: 1,
      name: "Carlos Silva",
      rating: 4.9,
      specialties: ["Corte Clássico", "Barba"],
      image: "/placeholder.svg",
      nextAvailable: "Hoje, 14:30",
      price: "R$ 45"
    },
    {
      id: 2,
      name: "Roberto Santos",
      rating: 4.8,
      specialties: ["Fade", "Design"],
      image: "/placeholder.svg",
      nextAvailable: "Amanhã, 09:00",
      price: "R$ 50"
    },
    {
      id: 3,
      name: "Fernando Costa",
      rating: 4.7,
      specialties: ["Moicano", "Barba"],
      image: "/placeholder.svg",
      nextAvailable: "Amanhã, 15:00",
      price: "R$ 40"
    }
  ];

  return (
    <section id="booking-section" ref={sectionRef} className="py-32 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto max-w-6xl">
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Agende com os
            <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Melhores Barbeiros
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
            Escolha seu profissional favorito e garanta o horário que funciona melhor para você
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {barbers.map((barber, index) => (
            <Card 
              key={barber.id}
              className={`bg-gray-800/90 backdrop-blur-sm border-gray-600 hover:border-amber-400/70 transition-all duration-500 cursor-pointer group transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/20 ${
                selectedBarber === barber.id ? 'border-amber-400 bg-amber-400/10 shadow-2xl shadow-amber-400/30' : ''
              } ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
              onClick={() => setSelectedBarber(barber.id)}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      {barber.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">{barber.name}</h3>
                      <div className="flex items-center space-x-1 mt-2">
                        <Star className="h-5 w-5 text-amber-400 fill-current" />
                        <span className="text-amber-400 font-semibold text-lg">{barber.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-amber-400">{barber.price}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {barber.specialties.map((specialty) => (
                    <Badge 
                      key={specialty} 
                      variant="secondary" 
                      className="bg-amber-400/20 text-amber-300 border-amber-400/40 px-3 py-1"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center text-gray-300 text-sm mb-6">
                  <Clock className="h-4 w-4 mr-2" />
                  Próximo horário: <span className="text-amber-400 ml-1 font-semibold">{barber.nextAvailable}</span>
                </div>

                <Button 
                  className={`w-full transition-all duration-300 transform hover:scale-105 ${
                    selectedBarber === barber.id 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold shadow-lg shadow-amber-400/30' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white hover:shadow-lg'
                  }`}
                >
                  {selectedBarber === barber.id ? 'Selecionado ✓' : 'Selecionar'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {selectedBarber && (
          <Card className={`bg-gray-800/90 border-amber-400/50 backdrop-blur-sm transform transition-all duration-500 animate-fade-in hover:shadow-2xl hover:shadow-amber-400/20`}>
            <div className="p-10 text-center">
              <h3 className="text-3xl font-bold text-white mb-6">Finalizar Agendamento</h3>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold px-10 py-4 hover:from-amber-500 hover:to-amber-700 transform hover:scale-110 transition-all duration-300 shadow-xl shadow-amber-400/30"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Escolher Data e Hora
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-amber-400/50 text-amber-400 hover:bg-amber-400/10 px-10 py-4 transform hover:scale-110 transition-all duration-300"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Ver Localização
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};

export default BookingSection;
