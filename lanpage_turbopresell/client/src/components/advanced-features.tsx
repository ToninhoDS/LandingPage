import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Eye, Cookie, Shield } from "lucide-react";
import { motion } from "framer-motion";

const AdvancedFeatures = () => {
  const features = [
    {
      icon: Eye,
      title: "Taxa de Fuga Zero",
      description: "Cada visitante é direcionado para a página de vendas, garantindo máxima conversão."
    },
    {
      icon: Cookie,
      title: "Ativação Dupla de Cookies",
      description: "Nunca mais perca comissões. Sistema de backup garante que sua venda seja creditada."
    },
    {
      icon: Shield,
      title: "Bloqueio de Cliques Abusivos",
      description: "Identifica e bloqueia IPs suspeitos, otimizando seus gastos com anúncios."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Presell Fantasma & Cookies
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Transforme cada clique em oportunidade de venda. Nossas presells invisíveis capturam 100% dos visitantes sem que eles percebam.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="text-white h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <feature.icon className="mr-2 h-5 w-5 text-primary" />
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80" 
              alt="Digital marketing tools interface showing analytics dashboard" 
              className="rounded-2xl shadow-2xl conversion-hover" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Conversão Ativa</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;
