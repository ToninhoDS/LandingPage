import { useState } from "react";
import { Plus, User, Calendar, Settings } from "lucide-react";

const AdminProfessionals = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const professionals = [
    {
      id: 1,
      name: "Luiz",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20barber%20with%20short%20hair%20wearing%20black%20barber%20uniform%20smiling%20confident%20studio%20portrait&image_size=square",
      services: ["Corte Clássico", "Barba"],
      status: "ativo",
      rating: 5.0,
      experience: "10 anos"
    },
    {
      id: 2,
      name: "Carlos",
      image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20barber%20with%20modern%20style%20wearing%20white%20barber%20coat%20confident%20portrait&image_size=square",
      services: ["Corte Moderno", "Degradê"],
      status: "ativo",
      rating: 4.9,
      experience: "8 anos"
    }
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Profissionais</h3>
          <p className="mt-1 text-sm text-neutral-300">Cadastre e defina dias/horários e disponibilidade.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-black font-medium hover:bg-amber-400 transition-colors"
        >
          <Plus size={18} />
          Novo Profissional
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {professionals.map((professional) => (
          <div key={professional.id} className="rounded-xl border border-neutral-700 bg-neutral-800 p-4">
            <div className="flex items-start gap-4 mb-3">
              <img
                src={professional.image}
                alt={professional.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-lg">{professional.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <span className="text-amber-400">★</span> {professional.rating}
                      <span className="text-neutral-500">•</span>
                      <span>{professional.experience}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    professional.status === 'ativo' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {professional.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {professional.services.map((service, index) => (
                  <span key={index} className="text-xs bg-neutral-700 text-neutral-300 px-2 py-1 rounded-full">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-neutral-700 px-3 py-2 text-white hover:bg-neutral-600 transition-colors text-sm">
                <Calendar size={14} />
                Horários
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-neutral-700 px-3 py-2 text-white hover:bg-neutral-600 transition-colors text-sm">
                <Settings size={14} />
                Configurar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Professional Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-8 max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Novo Profissional</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Nome do Profissional</label>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2 focus:outline-none"
                    placeholder="Ex: João Silva"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Tempo de Experiência</label>
                  <select className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2 focus:outline-none">
                    <option>1 ano</option>
                    <option>2 anos</option>
                    <option>3 anos</option>
                    <option>5 anos</option>
                    <option>10+ anos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Descrição</label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2 focus:outline-none"
                  placeholder="Descreva as qualificações e experiência do profissional..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Serviços Oferecidos</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Corte Clássico", "Barba", "Degradê", "Platinado", "Tintura", "Mechas"].map((service) => (
                    <label key={service} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-neutral-600 bg-neutral-900 text-amber-500 focus:ring-amber-500" />
                      <span className="text-sm text-neutral-300">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Foto do Profissional</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                    <User size={24} className="text-neutral-500" />
                  </div>
                  <button type="button" className="rounded-lg bg-neutral-700 px-4 py-2 text-white hover:bg-neutral-600 transition-colors text-sm">
                    Escolher Foto
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl bg-neutral-700 px-4 py-3 text-white hover:bg-neutral-600 transition-all duration-200 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-amber-500 px-4 py-3 text-black hover:bg-amber-400 transition-all duration-200 font-medium"
                >
                  Criar Profissional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfessionals;