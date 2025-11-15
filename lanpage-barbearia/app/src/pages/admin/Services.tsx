const AdminServices = () => {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="text-xl font-semibold">Serviços</h3>
      <p className="mt-2 text-sm text-neutral-300">Cadastre, edite preços, tempo e status.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-neutral-800 p-4 text-white">Corte de Cabelo</div>
        <div className="rounded-md bg-neutral-800 p-4 text-white">Barba</div>
      </div>
    </div>
  );
};

export default AdminServices;