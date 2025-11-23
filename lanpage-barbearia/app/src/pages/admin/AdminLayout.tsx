import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 px-6 py-6">
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="mb-4 text-xl font-semibold">Painel</h2>
            <nav className="space-y-2">
              <NavLink to="/admin/configuracoes" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? "bg-amber-500 text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}>Configurações</NavLink>
              <NavLink to="/admin/servicos" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? "bg-amber-500 text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}>Serviços</NavLink>
              <NavLink to="/admin/profissionais" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? "bg-amber-500 text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}>Profissionais</NavLink>
              <NavLink to="/admin/pagamentos" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? "bg-amber-500 text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}>Pagamentos</NavLink>
              <NavLink to="/admin/integracoes" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? "bg-amber-500 text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}>Integrações</NavLink>
              <NavLink to="/admin/planos" className={({ isActive }) => `block rounded-md px-3 py-2 ${isActive ? "bg-amber-500 text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}>Planos</NavLink>
            </nav>
          </div>
        </aside>
        <main className="col-span-12 md:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;