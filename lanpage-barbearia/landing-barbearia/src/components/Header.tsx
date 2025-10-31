
import React, { useState, useEffect } from 'react';
import { Scissors, Calendar, Star, Sparkles, Wand2, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-black/70 backdrop-blur-lg border-b border-amber-600/40' 
        : 'bg-black/50 backdrop-blur-sm border-b border-amber-600/20'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg transform hover:scale-110 transition-all duration-300 shadow-lg">
              <Scissors className="h-7 w-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">BarberIA</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('app-download')}
              className="text-white hover:text-amber-400 transition-all duration-300 relative group font-medium text-lg"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Baixar App</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            
            <button 
              onClick={() => scrollToSection('ai-styles-section')}
              className="text-white hover:text-amber-400 transition-all duration-300 relative group font-medium text-lg"
            >
              <div className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5" />
                <span>Estilos IA</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            
            <button 
              onClick={() => scrollToSection('reviews-section')}
              className="text-white hover:text-amber-400 transition-all duration-300 relative group font-medium text-lg"
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Avaliações</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-300 font-medium text-lg"
            >
              <User className="h-5 w-5 mr-2" />
              Login
            </Button>

            <Button 
              onClick={() => scrollToSection('pricing-section')}
              className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold hover:from-amber-500 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25 text-lg px-6 py-3"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Teste 14 Dias
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
