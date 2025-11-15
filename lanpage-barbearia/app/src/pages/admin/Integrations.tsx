const AdminIntegrations = () => {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="text-xl font-semibold">Integrações</h3>
      <p className="mt-2 text-sm text-neutral-300">Configure Google Agenda e webhook do n8n.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-neutral-800 p-4 text-white">Google Agenda</div>
        <div className="rounded-md bg-neutral-800 p-4 text-white">n8n Webhook</div>
      </div>
    </div>
  );
};

export default AdminIntegrations;