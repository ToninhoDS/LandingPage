import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Shield, Gauge, Zap } from "lucide-react";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: Wand2,
      title: "Criação Instantânea",
      description: "Crie páginas presell profissionais em apenas 5 segundos. Copie qualquer página e transforme em uma máquina de vendas.",
      metric: "+300% Conversão",
      color: "from-primary/5 to-primary/10",
      iconBg: "bg-primary"
    },
    {
      icon: Shield,
      title: "Anti-Bloqueio",
      description: "Sistema de blindagem que protege suas campanhas de revisões manuais. Anuncie sem medo no Google Ads e Facebook.",
      metric: "Zero Bloqueios",
      color: "from-accent/5 to-accent/10",
      iconBg: "bg-accent"
    },
    {
      icon: Gauge,
      title: "Performance Superior",
      description: "Páginas com pontuação 98+ no PageSpeed. Carregamento ultrarrápido = menos custo por clique e mais vendas.",
      metric: "50% Mais Rápido",
      color: "from-secondary/5 to-secondary/10",
      iconBg: "bg-secondary"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Descubra Seu <span className="text-gradient-primary">Poder de Conversão</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma analisa suas necessidades e cria presells otimizadas que convertem visitantes em clientes pagantes
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className={`bg-gradient-to-br ${feature.color} p-8 hover:shadow-lg transition-all duration-300 conversion-hover border-0`}>
                <CardContent className="p-0">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <span className="text-primary font-semibold">{feature.metric}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="gradient-primary rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
            <Zap className="mr-2 h-6 w-6" />
            Powered by IA
          </h3>
          <p className="text-lg opacity-90 mb-6">
            Nossa inteligência artificial otimiza automaticamente suas presells para máxima conversão
          </p>
          <Button className="bg-white text-primary px-8 py-3 font-semibold hover:shadow-lg transition-all">
            Testar IA Gratuitamente
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
