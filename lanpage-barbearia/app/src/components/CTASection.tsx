import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  slug: string;
  tenantId: string;
}

const CTASection = ({ slug, tenantId }: CTASectionProps) => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate(`/${slug}/${tenantId}/agendar`);
  };
  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-6 sm:p-8 text-center animate-fadeIn">
        <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-white md:text-4xl leading-tight">
          Pronto para renovar seu visual?
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg text-neutral-300 leading-relaxed">
          Agende seu horário agora e garanta o melhor atendimento da região
        </p>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <Calendar className="mx-auto mb-2 h-6 w-6 text-amber-400" />
            <div className="text-sm font-semibold text-white">Agendamento Online</div>
            <div className="text-xs text-neutral-400">24h disponível</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <Clock className="mx-auto mb-2 h-6 w-6 text-amber-400" />
            <div className="text-sm font-semibold text-white">Atendimento Rápido</div>
            <div className="text-xs text-neutral-400">Sem filas</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <MapPin className="mx-auto mb-2 h-6 w-6 text-amber-400" />
            <div className="text-sm font-semibold text-white">Localização</div>
            <div className="text-xs text-neutral-400">Fácil acesso</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <Phone className="mx-auto mb-2 h-6 w-6 text-amber-400" />
            <div className="text-sm font-semibold text-white">Suporte</div>
            <div className="text-xs text-neutral-400">WhatsApp</div>
          </div>
        </div>
        
        <button 
          onClick={handleBookingClick}
          className="mt-8 rounded-xl bg-amber-500 px-8 py-4 font-semibold text-black transition-all hover:bg-amber-400 hover:scale-105"
        >
          Agendar meu horário
        </button>
      </div>
    </section>
  );
};

export default CTASection;