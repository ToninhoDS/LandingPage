import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, CreditCard, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const PricingSection = () => {
  const plans = [
    {
      name: "Iniciante",
      description: "Perfeito para quem está começando no marketing de afiliados",
      price: "97",
      features: [
        "Até 100 presells/mês",
        "Presell fantasma básica",
        "Sistema anti-bloqueio",
        "Suporte por email"
      ],
      buttonText: "Começar Teste Grátis",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Profissional",
      description: "Ideal para afiliados que querem escalar suas vendas",
      price: "197",
      features: [
        "Presells ilimitadas",
        "Presell fantasma avançada",
        "Sistema de cookies duplo",
        "Análise de performance",
        "Suporte prioritário"
      ],
      buttonText: "Começar Teste Grátis",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Empresarial",
      description: "Para agências e grandes afiliados que precisam de máxima performance",
      price: "397",
      features: [
        "Tudo do Profissional",
        "API personalizada",
        "Integrações avançadas",
        "Suporte 24/7",
        "Consultoria especializada"
      ],
      buttonText: "Começar Teste Grátis",
      buttonVariant: "default" as const,
      popular: false
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
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Planos e <span className="text-gradient-primary">Preços</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para maximizar suas vendas e comece a faturar mais hoje mesmo
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative ${plan.popular ? 'transform scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-secondary text-white px-6 py-2 font-bold">
                    MAIS POPULAR
                  </Badge>
                </div>
              )}
              
              <Card className={`${plan.popular ? 'gradient-primary text-white shadow-2xl' : 'bg-white border-gray-200'} p-8 conversion-hover`}>
                <CardHeader className="p-0 mb-6">
                  <CardTitle className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </CardTitle>
                  <p className={`${plan.popular ? 'text-white opacity-90' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className={`text-4xl font-bold mb-6 ${plan.popular ? 'text-white' : 'text-primary'}`}>
                    R$ {plan.price}
                    <span className={`text-lg font-normal ${plan.popular ? 'text-white opacity-75' : 'text-gray-500'}`}>
                      /mês
                    </span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className={`${plan.popular ? 'text-white' : 'text-accent'} mr-3 h-5 w-5`} />
                        <span className={plan.popular ? 'text-white' : 'text-gray-700'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-4 font-semibold transition-all ${
                      plan.popular 
                        ? 'bg-white text-primary hover:shadow-lg' 
                        : plan.buttonVariant === 'outline' 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'gradient-primary text-white hover:shadow-lg'
                    }`}
                    variant={plan.popular ? "secondary" : plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
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
          className="text-center mt-12"
        >
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Shield className="text-accent mr-2 h-4 w-4" />
              <span>Compra Segura</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="text-accent mr-2 h-4 w-4" />
              <span>Garantia 30 dias</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="text-accent mr-2 h-4 w-4" />
              <span>Pagamento Seguro</span>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            14 dias grátis • Sem compromisso • Cancele quando quiser
          </p>
          <Button variant="link" className="text-primary font-semibold">
            Precisa de um plano personalizado? Entre em contato
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
