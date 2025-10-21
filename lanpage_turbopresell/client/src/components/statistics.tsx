import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Statistics = () => {
  const [counts, setCounts] = useState({
    clients: 0,
    conversion: 0,
    pages: 0,
    revenue: 0
  });

  const finalCounts = {
    clients: 25000,
    conversion: 98,
    pages: 50000,
    revenue: 2000000
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    const timer = setInterval(() => {
      setCounts(prev => ({
        clients: Math.min(prev.clients + Math.ceil(finalCounts.clients / steps), finalCounts.clients),
        conversion: Math.min(prev.conversion + Math.ceil(finalCounts.conversion / steps), finalCounts.conversion),
        pages: Math.min(prev.pages + Math.ceil(finalCounts.pages / steps), finalCounts.pages),
        revenue: Math.min(prev.revenue + Math.ceil(finalCounts.revenue / steps), finalCounts.revenue)
      }));
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number, type: string) => {
    if (type === 'clients' || type === 'pages') {
      return num >= 1000 ? `${Math.floor(num / 1000)}K+` : num.toString();
    }
    if (type === 'revenue') {
      return `R$ ${Math.floor(num / 1000000)}M+`;
    }
    return `${num}%`;
  };

  const stats = [
    {
      key: 'clients',
      label: 'Afiliados Ativos',
      color: 'text-primary'
    },
    {
      key: 'conversion',
      label: 'Taxa de Conversão',
      color: 'text-accent'
    },
    {
      key: 'pages',
      label: 'Presells Criadas',
      color: 'text-secondary'
    },
    {
      key: 'revenue',
      label: 'Em Comissões Geradas',
      color: 'text-primary'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {formatNumber(counts[stat.key as keyof typeof counts], stat.key)}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
