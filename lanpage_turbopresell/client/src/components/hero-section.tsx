import { Button } from "@/components/ui/button";
import { Rocket, Play, Zap } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 via-white to-accent/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6"
          >
            <Zap className="text-secondary mr-2 h-4 w-4" />
            <span className="text-sm font-medium text-gray-700">Tecnologia + Conversão</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Crie Páginas Presell Que
            <span className="text-gradient-primary block">
              Vendem em 5 Segundos
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Pare de perder vendas por páginas que não convertem. Com nossa tecnologia avançada, você cria presells profissionais que maximizam suas comissões sem bloqueios.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button className="gradient-primary text-white px-8 py-4 text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Rocket className="mr-2 h-5 w-5" />
              Criar Minha Presell Agora
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Demonstração
            </Button>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-16 max-w-6xl mx-auto px-4"
      >
        <img 
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
          alt="Modern workspace with multiple screens showing presell pages" 
          className="w-full rounded-2xl shadow-2xl border border-gray-200 conversion-hover" 
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
