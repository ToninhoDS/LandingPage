import { useParams } from "react-router-dom";
import TenantBanner from "@/components/TenantBanner";
import SchedulingWizard from "@/components/SchedulingWizard";

const PublicHome = () => {
  const { slug = "estabelecimento", tenantId = "0000" } = useParams();
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <TenantBanner slug={slug} tenantId={tenantId} />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <h3 className="text-xl font-semibold">Fotos</h3>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="h-24 rounded-md bg-neutral-800" />
                <div className="h-24 rounded-md bg-neutral-800" />
                <div className="h-24 rounded-md bg-neutral-800" />
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <h3 className="text-xl font-semibold">Horários de hoje</h3>
              <div className="mt-2 text-sm text-neutral-300">Escolha um horário para iniciar</div>
              <div className="mt-4">
                <div className="flex gap-2">
                  <button className="rounded-md bg-amber-500 px-4 py-2 font-medium text-black hover:bg-amber-400">Agendar Serviço</button>
                  <button className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Ver Profissionais</button>
                  <button className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Promoções</button>
                  <button className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Serviços</button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SchedulingWizard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicHome;