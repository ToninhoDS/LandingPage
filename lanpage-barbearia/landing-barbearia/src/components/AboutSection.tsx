import React, { useState, useEffect } from 'react';
import { Users, Award, Clock, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AboutSection = () => {
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

    const section = document.getElementById('about-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    {
      name: "Carlos Silva",
      role: "Barbeiro Master",
      experience: "15 anos",
      specialty: "Cortes clássicos e modernos",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20barber%20man%20with%20beard%20in%20black%20shirt%20smiling%20portrait%20studio%20lighting&image_size=portrait_4_3"
    },
    {
      name: "João Santos",
      role: "Especialista em Barba",
      experience: "10 anos",
      specialty: "Barbas e bigodes",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=young%20professional%20barber%20man%20with%20styled%20hair%20in%20black%20uniform%20smiling%20portrait&image_size=portrait_4_3"
    },
    {
      name: "Pedro Costa",
      role: "Barbeiro Criativo",
      experience: "8 anos",
      specialty: "Cortes artísticos e desenhos",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20barber%20man%20with%20tattoos%20in%20black%20shirt%20professional%20portrait%20studio&image_size=portrait_4_3"
    }
  ];

  const stats = [
    { icon: Users, number: "5000+", label: "Clientes Satisfeitos" },
    { icon: Award, number: "15", label: "Anos de Experiência" },
    { icon: Clock, number: "24/7", label: "Agendamento Online" },
    { icon: Heart, number: "98%", label: "Avaliações Positivas" }
  ];

  return (
    <section id="about-section" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-amber-400/15 text-amber-300 text-lg font-semibold rounded-full border border-amber-400/30 backdrop-blur-sm inline-block mb-8">
              ✨ Nossa História
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Tradição e
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Inovação
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Há mais de 15 anos transformando o conceito de barbearia, unindo técnicas tradicionais 
              com tecnologia moderna para oferecer a melhor experiência aos nossos clientes.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-amber-400/30 p-8 text-center hover:bg-white/15 transition-all duration-500 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <stat.icon className="h-8 w-8 text-black" />
              </div>
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-gray-300 font-medium">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Mission & Values */}
        <div className={`grid md:grid-cols-2 gap-16 mb-24 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div>
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full mr-4"></div>
              Nossa Missão
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Proporcionar uma experiência única e personalizada, onde cada cliente se sinta especial. 
              Combinamos a arte tradicional da barbearia com tecnologia de ponta para criar um ambiente 
              moderno, confortável e profissional.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-amber-400">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-4"></div>
                <span>Atendimento personalizado e de qualidade</span>
              </div>
              <div className="flex items-center text-amber-400">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-4"></div>
                <span>Técnicas tradicionais com equipamentos modernos</span>
              </div>
              <div className="flex items-center text-amber-400">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-4"></div>
                <span>Ambiente acolhedor e profissional</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full mr-4"></div>
              Nossos Valores
            </h3>
            <div className="space-y-6">
              <Card className="bg-white/5 border-amber-400/20 p-6 hover:bg-white/10 transition-all duration-300">
                <h4 className="text-xl font-bold text-amber-400 mb-3">Excelência</h4>
                <p className="text-gray-300">Buscamos sempre a perfeição em cada corte, cada detalhe importa.</p>
              </Card>
              <Card className="bg-white/5 border-amber-400/20 p-6 hover:bg-white/10 transition-all duration-300">
                <h4 className="text-xl font-bold text-amber-400 mb-3">Inovação</h4>
                <p className="text-gray-300">Sempre atualizados com as últimas tendências e tecnologias.</p>
              </Card>
              <Card className="bg-white/5 border-amber-400/20 p-6 hover:bg-white/10 transition-all duration-300">
                <h4 className="text-xl font-bold text-amber-400 mb-3">Respeito</h4>
                <p className="text-gray-300">Cada cliente é único e merece atenção especial.</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className={`transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-6">
              Conheça Nossa
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Equipe Expert
              </span>
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Profissionais experientes e apaixonados pela arte da barbearia, 
              prontos para criar o visual perfeito para você.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-amber-400/30 overflow-hidden hover:bg-white/15 transition-all duration-500 group hover:-translate-y-4 hover:shadow-2xl hover:shadow-amber-400/20">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                    {member.name}
                  </h4>
                  <p className="text-amber-400 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-300 mb-4">{member.experience} de experiência</p>
                  <p className="text-gray-400 text-sm">{member.specialty}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold px-12 py-6 text-xl hover:from-amber-500 hover:to-amber-700 transform hover:scale-110 transition-all duration-500 shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60"
            >
              Agendar com a Equipe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;