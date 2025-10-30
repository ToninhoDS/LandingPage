import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, Car, Bus, Train } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LocationSection = () => {
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

    const section = document.getElementById('location-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const businessHours = [
    { day: 'Segunda-feira', hours: '09:00 - 19:00', isOpen: true },
    { day: 'Terça-feira', hours: '09:00 - 19:00', isOpen: true },
    { day: 'Quarta-feira', hours: '09:00 - 19:00', isOpen: true },
    { day: 'Quinta-feira', hours: '09:00 - 20:00', isOpen: true },
    { day: 'Sexta-feira', hours: '09:00 - 20:00', isOpen: true },
    { day: 'Sábado', hours: '08:00 - 18:00', isOpen: true },
    { day: 'Domingo', hours: 'Fechado', isOpen: false }
  ];

  const transportOptions = [
    {
      icon: Car,
      title: 'De Carro',
      description: 'Estacionamento gratuito disponível',
      details: 'Rua com fácil acesso e vagas na porta'
    },
    {
      icon: Bus,
      title: 'Ônibus',
      description: 'Linhas 101, 205, 340',
      details: 'Ponto de ônibus a 50m da barbearia'
    },
    {
      icon: Train,
      title: 'Metrô',
      description: 'Estação Central - Linha Azul',
      details: '10 minutos a pé da estação'
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: 'Telefone',
      value: '(11) 99999-9999',
      action: 'tel:+5511999999999'
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: 'contato@barbearia.com',
      action: 'mailto:contato@barbearia.com'
    },
    {
      icon: MapPin,
      label: 'Endereço',
      value: 'Rua das Flores, 123 - Centro',
      action: 'https://maps.google.com/?q=Rua+das+Flores+123+Centro'
    }
  ];

  return (
    <section id="location-section" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-amber-400/15 text-amber-300 text-lg font-semibold rounded-full border border-amber-400/30 backdrop-blur-sm inline-block mb-8">
              📍 Nossa Localização
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Venha nos
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Visitar
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Estamos localizados no coração da cidade, com fácil acesso e estacionamento. 
              Venha conhecer nosso espaço moderno e acolhedor.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Map and Address */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Card className="bg-white/10 backdrop-blur-md border-amber-400/30 overflow-hidden hover:bg-white/15 transition-all duration-500">
              {/* Interactive Map Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-white text-xl font-bold mb-2">Barbearia Premium</h3>
                    <p className="text-gray-300">Rua das Flores, 123 - Centro</p>
                    <p className="text-gray-300">São Paulo - SP, 01234-567</p>
                  </div>
                </div>
                
                {/* Overlay with Google Maps link */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    className="bg-amber-400 text-black hover:bg-amber-500 font-bold"
                    onClick={() => window.open('https://maps.google.com/?q=Rua+das+Flores+123+Centro+São+Paulo', '_blank')}
                  >
                    <Navigation className="h-5 w-5 mr-2" />
                    Abrir no Google Maps
                  </Button>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MapPin className="h-6 w-6 text-amber-400 mr-3" />
                  Endereço Completo
                </h3>
                <div className="space-y-4">
                  <div className="text-gray-300">
                    <p className="text-lg font-semibold text-white">Barbearia Premium</p>
                    <p>Rua das Flores, 123 - Centro</p>
                    <p>São Paulo - SP, CEP: 01234-567</p>
                    <p className="mt-2 text-sm text-amber-400">
                      📍 Próximo ao Shopping Center e Estação de Metrô
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Transport Options */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {transportOptions.map((transport, index) => (
                <Card key={index} className="bg-white/5 border-amber-400/20 p-6 hover:bg-white/10 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <transport.icon className="h-6 w-6 text-black" />
                    </div>
                    <h4 className="text-white font-bold mb-2">{transport.title}</h4>
                    <p className="text-amber-400 text-sm font-semibold mb-1">{transport.description}</p>
                    <p className="text-gray-400 text-xs">{transport.details}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Info and Hours */}
          <div className={`space-y-8 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {/* Contact Information */}
            <Card className="bg-white/10 backdrop-blur-md border-amber-400/30 p-8 hover:bg-white/15 transition-all duration-500">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Phone className="h-6 w-6 text-amber-400 mr-3" />
                Informações de Contato
              </h3>
              <div className="space-y-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-center group cursor-pointer" onClick={() => window.open(contact.action, '_blank')}>
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <contact.icon className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{contact.label}</p>
                      <p className="text-white font-semibold group-hover:text-amber-400 transition-colors duration-300">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Business Hours */}
            <Card className="bg-white/10 backdrop-blur-md border-amber-400/30 p-8 hover:bg-white/15 transition-all duration-500">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Clock className="h-6 w-6 text-amber-400 mr-3" />
                Horário de Funcionamento
              </h3>
              <div className="space-y-4">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0">
                    <span className="text-gray-300 font-medium">{schedule.day}</span>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${schedule.isOpen ? 'text-white' : 'text-gray-500'}`}>
                        {schedule.hours}
                      </span>
                      <Badge 
                        variant={schedule.isOpen ? "default" : "secondary"}
                        className={schedule.isOpen 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {schedule.isOpen ? 'Aberto' : 'Fechado'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-amber-400/10 border border-amber-400/30 rounded-lg">
                <p className="text-amber-400 text-sm font-semibold mb-2">💡 Dica Importante:</p>
                <p className="text-gray-300 text-sm">
                  Recomendamos agendamento prévio para garantir seu horário preferido. 
                  Atendemos por ordem de chegada quando há disponibilidade.
                </p>
              </div>
            </Card>

            {/* Call to Action */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold px-12 py-6 text-xl hover:from-amber-500 hover:to-amber-700 transform hover:scale-110 transition-all duration-500 shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 w-full"
                onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de agendar um horário na barbearia.', '_blank')}
              >
                <Phone className="h-6 w-6 mr-3" />
                Agendar via WhatsApp
              </Button>
              
              <p className="text-gray-400 text-sm mt-4">
                Ou ligue diretamente: (11) 99999-9999
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;