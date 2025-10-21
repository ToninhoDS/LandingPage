import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rafael Silva",
      role: "Afiliado Digital",
      avatar: "RS",
      rating: 5,
      content: "Minhas vendas triplicaram depois que comecei a usar as presells fantasma. Nunca mais perdi uma comissão por bloqueio!",
      time: "Há 2 dias",
      gradient: "from-primary to-accent"
    },
    {
      name: "Marina Costa",
      role: "Produtora Digital",
      avatar: "MC",
      rating: 5,
      content: "A velocidade de criação é impressionante. Em 5 segundos tenho uma presell profissional que converte mais que páginas que levavam horas para fazer.",
      time: "Há 1 semana",
      gradient: "from-accent to-secondary"
    },
    {
      name: "Lucas Santos",
      role: "Especialista em Tráfego",
      avatar: "LS",
      rating: 5,
      content: "O sistema anti-bloqueio é uma revolução. Posso escalar minhas campanhas sem medo de ter as páginas derrubadas.",
      time: "Há 3 dias",
      gradient: "from-secondary to-primary"
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
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            O que nossos <span className="text-gradient-primary">Afiliados Dizem</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experiências reais de quem já multiplicou suas vendas com nossa plataforma
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-white p-8 shadow-lg border border-gray-100 conversion-hover">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <Avatar className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient}`}>
                      <AvatarFallback className="text-white font-bold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                    <div className="ml-auto flex text-secondary">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="text-sm text-gray-500">{testimonial.time}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
