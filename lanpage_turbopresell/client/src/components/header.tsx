import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Rocket className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-gray-900">Super Presell</span>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">
              Depoimentos
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
              Preços
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button className="gradient-primary text-white hover:shadow-lg transition-all duration-300">
              Começar Agora
            </Button>
            
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
                Recursos
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">
                Depoimentos
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
                Preços
              </a>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
