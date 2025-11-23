import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Star, Users } from "lucide-react";

const HeroSection = ({ slug, tenantId }: { slug: string; tenantId: string }) => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate(`/${slug}/${tenantId}/agendar`);
  };

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
      <div className="absolute inset-0 opacity-30 bg-gradient-radial from-amber-500/30 to-transparent" />
      
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:items-center">
          <div className="space-y-4 sm:space-y-6 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs sm:text-sm text-amber-400 animate-fadeIn">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Barbearia Premium</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-white md:text-5xl lg:text-6xl leading-tight animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              Transforme seu visual com
              <span className="text-amber-400"> quem entende</span>
            </h1>
            

            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <button
                onClick={handleBookingClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 sm:px-6 py-3 font-semibold text-black transition-all hover:bg-amber-400 hover:scale-105"
              >
                Agendar agora
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              
              <button
                onClick={() => navigate(`#servicos`)}
                className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 sm:px-6 py-3 font-semibold text-white transition-all hover:bg-neutral-700"
              >
                Ver serviços
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-4 sm:pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                <span className="text-xs sm:text-sm text-neutral-300">Atendimento rápido</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                <span className="text-xs sm:text-sm text-neutral-300">+1000 clientes satisfeitos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                <span className="text-xs sm:text-sm text-neutral-300">5.0 estrelas</span>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    </section>
  );
};

export default HeroSection;