import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import SkeletonCard from "./SkeletonCard";

const services = [
  { name: "Corte de Cabelo", price: "R$ 35", duration: "30 min", rating: 5.0, description: "Corte clássico com navalha e tesoura, finalização perfeita.", popular: true },
  { name: "Barba Completa", price: "R$ 25", duration: "20 min", rating: 4.9, description: "Barba feita com navalha quente e produtos premium." },
  { name: "Combo Corte + Barba", price: "R$ 55", duration: "50 min", rating: 5.0, description: "O melhor custo-benefício: corte e barba em uma sessão." },
  { name: "Coloração", price: "R$ 70", duration: "60 min", rating: 4.8, description: "Tintura profissional com tonalizante e hidratação." },
];

const ServicesSection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const id = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">Nossos Serviços</h2>
          <p className="mt-2 text-neutral-400">Escolha o serviço ideal para você</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : services.map((s, i) => (
                <div key={s.name} className="animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ServiceCard {...s} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;