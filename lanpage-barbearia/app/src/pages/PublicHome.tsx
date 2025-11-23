import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TenantBanner from "@/components/TenantBanner";
import SchedulingWizard from "@/components/SchedulingWizard";
import PhotoCarousel from "@/components/PhotoCarousel";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const PublicHome = () => {
  const { slug = "estabelecimento", tenantId = "0000" } = useParams();
  const [valid, setValid] = useState(false);
  const link = useMemo(() => `/${slug}/${tenantId}/`, [slug, tenantId]);

  useEffect(() => {
    const saved = localStorage.getItem("iab_tenant");
    if (!saved) return setValid(false);
    try {
      const data = JSON.parse(saved);
      setValid(data.slug === slug && data.tenantId === tenantId);
    } catch {
      setValid(false);
    }
  }, [slug, tenantId]);

  if (!valid) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-xl font-semibold">Estabelecimento não encontrado</h3>
            <p className="mt-2 text-sm text-neutral-300">Verifique o link ou gere seu acesso nas Configurações.</p>
            <p className="mt-2 text-xs text-neutral-500">{link}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection slug={slug} tenantId={tenantId} />
      
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-8">
              <PhotoCarousel />
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <h3 className="mb-4 text-xl font-semibold">Horários de hoje</h3>
                <p className="mb-4 text-sm text-neutral-300">Escolha um horário para iniciar</p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => window.location.href = `/${slug}/${tenantId}/agendar`}
                    className="rounded-md bg-amber-500 px-4 py-2 font-medium text-black hover:bg-amber-400"
                  >
                    Agendar Serviço
                  </button>
                  <button className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Ver Profissionais</button>
                  <button className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Promoções</button>
                </div>
              </div>
            </div>
            
            <div id="agendar" className="scroll-mt-16">
              {/* Wizard moved to separate booking page */}
            </div>
          </div>
        </div>
      </section>

      <section id="servicos">
        <ServicesSection />
      </section>

      <CTASection slug={slug} tenantId={tenantId} />
      <Footer />
    </div>
  );
};

export default PublicHome;