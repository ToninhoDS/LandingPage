import { Button } from "@/components/ui/button";
import { Download, Shield, RotateCcw, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="py-20 gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Não Fique Para Trás
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl opacity-90 mb-8 max-w-2xl mx-auto"
          >
            Seus concorrentes já estão usando nossas presells e fazendo mais vendas com menos esforço. 
            Transforme suas campanhas hoje mesmo e alcance o sucesso que você merece.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Download className="mr-2 h-5 w-5" />
              Baixar Super Presell Agora
            </Button>
            
            <img 
              src="https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80" 
              alt="Business success celebration with team raising hands in victory" 
              className="hidden md:block w-24 h-24 rounded-full border-4 border-white shadow-lg conversion-hover" 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-8 text-sm opacity-75"
          >
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Compra Segura</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>Garantia 30 dias</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Pagamento Seguro</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
