
import React from 'react';
import { Scissors, Instagram, Facebook, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg">
                <Scissors className="h-6 w-6 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">BarberIA</h3>
                <p className="text-xs text-amber-400">Powered by AI</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Revolucionando o mundo das barbearias com inteligência artificial. 
              Conectamos você aos melhores profissionais e sugerimos o corte perfeito para seu estilo.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-400">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-400">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-400">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Agendar Horário</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Estilos IA</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Nossos Barbeiros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Avaliações</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Sobre Nós</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4 text-amber-400" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4 text-amber-400" />
                <span>contato@barberia.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 BarberIA. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Política de Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Termos de Uso</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
