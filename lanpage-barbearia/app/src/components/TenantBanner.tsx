import { useMemo } from "react";
import InstallPrompt from "./InstallPrompt";

type Props = { slug: string; tenantId: string };

const TenantBanner = ({ slug, tenantId }: Props) => {
  const title = useMemo(() => slug.replace(/-/g, " ").toUpperCase(), [slug]);
  return (
    <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-black to-neutral-900 p-8">
      <div className="absolute inset-0 opacity-30 bg-gradient-radial from-amber-500/30 to-transparent" />
      <div className="relative">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-neutral-300">Identificador: {tenantId}</p>
        <div className="mt-3">
          <InstallPrompt />
        </div>
      </div>
    </div>
  );
};

export default TenantBanner;