import React, { useState, useEffect } from 'react';
import { Star, Quote, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const B2BTestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('b2b-testimonials');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Carlos Silva",
      business: "Barbearia Premium",
      location: "São Paulo, SP",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20barber%20owner%20smiling%20confident%20business%20portrait%20modern%20barbershop%20background&image_size=square",
      quote: "Em 3 meses aumentei minha receita em 45%. O APP funciona 24h vendendo por mim. Melhor investimento que já fiz!",
      results: {
        revenue: "+45%",
        clients: "+60%",
        noShows: "-85%"
      },
      beforeAfter: {
        before: "15 clientes/dia",
        after: "24 clientes/dia"
      }
    },
    {
      name: "Roberto Santos",
      business: "Santos Barbearia",
      location: "Rio de Janeiro, RJ",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=experienced%20barber%20business%20owner%20professional%20portrait%20successful%20entrepreneur&image_size=square",
      quote: "Antes eu perdia 4 horas por dia só atendendo telefone. Agora foco 100% nos cortes e a agenda se organiza sozinha.",
      results: {
        revenue: "+38%",
        clients: "+50%",
        noShows: "-90%"
      },
      beforeAfter: {
        before: "4h/dia no telefone",
        after: "0h/dia no telefone"
      }
    },
    {
      name: "André Costa",
      business: "Barbershop Elite",
      location: "Belo Horizonte, MG",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=young%20modern%20barber%20entrepreneur%20confident%20smile%20contemporary%20barbershop%20setting&image_size=square",
      quote: "Abri minha segunda unidade em 6 meses. O sistema me deu controle total e automação que eu nem sabia que precisava.",
      results: {
        revenue: "+120%",
        clients: "+200%",
        noShows: "-95%"
      },
      beforeAfter: {
        before: "1 barbearia",
        after: "2 barbearias"
      }
    },
    {
      name: "Fernando Lima",
      business: "Lima's Barber",
      location: "Brasília, DF",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mature%20barber%20business%20owner%20professional%20successful%20traditional%20barbershop%20background&image_size=square",
      quote: "Meus clientes adoram agendar pelo WhatsApp. Nunca mais tive conflito de horário e as vendas noturnas são um bônus incrível.",
      results: {
        revenue: "+52%",
        clients: "+70%",
        noShows: "-88%"
      },
      beforeAfter: {
        before: "Agenda bagunçada",
        after: "Zero conflitos"
      }
    }
  ];

  const stats = [
    {
      icon: TrendingUp,
      value: "500+",
      label: "Barbearias Transformadas",
      color: "text-green-400"
    },
    {
      icon: Users,
      value: "50k+",
      label: "Clientes Atendidos/Mês",
      color: "text-blue-400"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Funcionamento Automático",
      color: "text-purple-400"
    },
    {
      icon: CheckCircle,
      value: "98%",
      label: "Satisfação dos Donos",
      color: "text-amber-400"
    }
  ];

  return (
    <section id="b2b-testimonials" className="py-24 relative overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-black"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/6 via-transparent to-amber-600/6 animate-pulse"></div>

      {/* Radial glow overlays for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,76,0.08),transparent_65%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.07),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.06),transparent_60%)]"></div>
      </div>
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDRhZjM3IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-amber-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-400/8 to-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-400/6 to-emerald-600/4 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Smaller accent orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-bounce delay-700"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-16 right-16 w-16 h-16 border border-amber-400/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-16 left-16 w-12 h-12 border border-blue-400/20 rotate-12 animate-pulse"></div>
      </div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-gray-900/20 to-black/40"></div>
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==')]"></div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-amber-500/15 text-amber-300 text-lg font-semibold rounded-full border border-amber-500/30 backdrop-blur-sm inline-block mb-8">
              ⭐ Casos de Sucesso
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Donos que já
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                transformaram
              </span>
              seus negócios
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Histórias reais de barbearias que multiplicaram sua receita e 
              automatizaram seus processos com nosso APP.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid md:grid-cols-4 gap-6 mb-16 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {stats.map((stat, index) => (
            <Card key={index} className="relative bg-gradient-to-br from-[#0c0c0c]/85 via-[#121212]/85 to-[#0c0c0c]/85 border border-neutral-800 p-6 text-center backdrop-blur-lg hover:border-amber-400/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/10 group overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 border border-amber-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              
              <div className="relative z-10">
                <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                <div className={`text-3xl font-bold mb-2 ${stat.color} group-hover:text-amber-400 transition-colors duration-300`}>
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className={`transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <Card className="relative bg-gradient-to-br from-[#0b0b0b] via-[#101010] to-[#0b0b0b] border border-neutral-800 ring-1 ring-amber-400/25 p-8 lg:p-12 backdrop-blur-xl shadow-2xl shadow-black/40 hover:shadow-amber-500/20 transition-all duration-500 hover:border-amber-400/40 group">
            {/* Card inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-amber-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-400/30 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-400/30 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-400/30 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-400/30 rounded-br-lg"></div>
            
            <div className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Testimonial Content */}
              <div>
                <Quote className="h-12 w-12 text-amber-400 mb-6" />
                <blockquote className="text-2xl lg:text-3xl font-medium text-white mb-8 leading-relaxed">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center mb-8">
                  <img 
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="text-xl font-bold text-white">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-amber-400 font-medium">
                      {testimonials[activeTestimonial].business}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonials[activeTestimonial].location}
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-amber-400 fill-current" />
                  ))}
                  <span className="ml-3 text-gray-300">5.0 estrelas</span>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Resultados Alcançados:</h3>
                
                <div className="space-y-4 mb-8">
                  {Object.entries(testimonials[activeTestimonial].results).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                      <span className="text-gray-300 capitalize">
                        {key === 'revenue' ? 'Aumento de Receita' : 
                         key === 'clients' ? 'Mais Clientes' : 
                         'Redução No-Shows'}
                      </span>
                      <span className="text-2xl font-bold text-green-400">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Before/After */}
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Antes vs Depois:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-red-400 text-sm font-medium mb-1">ANTES</div>
                      <div className="text-white font-bold">
                        {testimonials[activeTestimonial].beforeAfter.before}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 text-sm font-medium mb-1">DEPOIS</div>
                      <div className="text-white font-bold">
                        {testimonials[activeTestimonial].beforeAfter.after}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </Card>
        </div>

        {/* Testimonial Navigation */}
        <div className={`flex justify-center mt-8 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  activeTestimonial === index 
                    ? 'bg-amber-400 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className={`grid md:grid-cols-3 gap-6 mt-16 transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card key={index} className="relative bg-gradient-to-br from-[#0c0c0c]/85 via-[#121212]/85 to-[#0c0c0c]/85 border border-neutral-800 p-6 backdrop-blur-lg hover:border-amber-400/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10 group overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-amber-400 text-sm">{testimonial.business}</div>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                "{testimonial.quote.substring(0, 120)}..."
              </p>
              
              <div className="mt-4 text-green-400 font-bold text-sm">
                {testimonial.results.revenue} de aumento
              </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-1100 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="relative bg-gradient-to-r from-amber-400/15 via-amber-500/10 to-amber-600/15 border border-amber-400/40 rounded-2xl p-8 backdrop-blur-lg shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-500 group overflow-hidden">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Animated border glow */}
            <div className="absolute inset-0 border-2 border-amber-400/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            
            <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Seja o Próximo <span className="text-amber-400">Caso de Sucesso</span>
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Junte-se a mais de 500 barbearias que já transformaram seus negócios
            </p>
            <div className="text-amber-400 text-lg font-bold mb-6">
              Média de aumento: +45% de receita em 90 dias
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BTestimonialsSection;