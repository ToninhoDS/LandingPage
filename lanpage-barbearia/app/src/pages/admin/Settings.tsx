import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [tenantId, setTenantId] = useState("");
  const previewUrl = useMemo(() => (slug && tenantId ? `/${slug}/${tenantId}/` : ""), [slug, tenantId]);

  useEffect(() => {
    const saved = localStorage.getItem("iab_tenant");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCompanyName(data.name || "");
        setSlug(data.slug || "");
        setTenantId(data.tenantId || "");
      } catch {}
    }
  }, []);

  const toSlug = (v: string) => {
    return v
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  };

  const generateLowerId = (len = 10) => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  };

  const onSave = () => {
    if (!companyName.trim()) return;
    const newSlug = slug || toSlug(companyName);
    // Generate Tenant ID only if it doesn't exist yet
    const newId = tenantId || generateLowerId(10);
    setSlug(newSlug);
    setTenantId(newId);
    const payload = { name: companyName.trim(), slug: newSlug, tenantId: newId };
    localStorage.setItem("iab_tenant", JSON.stringify(payload));
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="text-xl font-semibold">Configurações Gerais</h3>
      <p className="mt-2 text-sm text-neutral-300">Defina nome, slug e identifique seu tenant para gerar seu link público.</p>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">Nome da Empresa</label>
          <input
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setSlug(toSlug(e.target.value));
            }}
            placeholder="Ex.: Barbearia do Luiz"
            className="w-full rounded-md bg-neutral-800 p-3 text-white outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(toSlug(e.target.value))}
              placeholder="barbearia-do-luiz"
              className="w-full rounded-md bg-neutral-800 p-3 text-white outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Tenant ID (letras minúsculas, gerado automaticamente ao salvar)</label>
            <input
              value={tenantId}
              disabled
              placeholder="Será gerado ao salvar"
              className={`w-full rounded-md p-3 text-white ${
                tenantId 
                  ? 'bg-neutral-800 opacity-50 cursor-not-allowed' 
                  : 'bg-neutral-800 opacity-70'
              }`}
            />
            {tenantId && (
              <p className="text-xs text-neutral-400">ID único gerado - não pode ser alterado</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-md bg-amber-500 px-4 py-2 font-medium text-black hover:bg-amber-400"
            onClick={onSave}
          >Salvar</button>
          {previewUrl && (
            <button
              className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700"
              onClick={() => navigate(previewUrl)}
            >Abrir APP Público</button>
          )}
        </div>

        <div className="mt-2 text-sm text-neutral-300">
          {previewUrl ? (
            <span>Link: <span className="text-amber-400">{previewUrl}</span></span>
          ) : (
            <span>Preencha nome, slug e tenant ID para gerar o link.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;