import { useState } from "react";
import { Plus, Clock, DollarSign, Package, Scissors } from "lucide-react";

const AdminServices = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [serviceType, setServiceType] = useState<'service' | 'product'>('service');
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  
  const services = [
    {
      id: 1,
      name: "Corte Clássico",
      type: "serviço",
      duration: "30 min",
      price: "R$ 35,00",
      status: "ativo",
      description: "Corte tradicional com tesoura e navalha"
    },
    {
      id: 2,
      name: "Barba Completa",
      type: "serviço", 
      duration: "25 min",
      price: "R$ 25,00",
      status: "ativo",
      description: "Barba com navalha e cuidados especiais"
    },
    {
      id: 3,
      name: "Shampoo Premium",
      type: "produto",
      price: "R$ 45,00",
      status: "ativo",
      description: "Shampoo profissional para cabelos masculinos",
      stock: 15
    }
  ];

  const durationOptions = [
    "15 min", "30 min", "45 min", "60 min", "75 min", "90 min", "120 min"
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900">
      {/* Tabs Header */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'services'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-neutral-800/50'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Scissors size={16} />
            Serviços
          </div>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'products'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-neutral-800/50'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Package size={16} />
            Produtos
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {activeTab === 'services' ? 'Serviços' : 'Produtos'}
            </h3>
            <p className="mt-1 text-sm text-neutral-300">
              {activeTab === 'services' 
                ? 'Gerencie os serviços oferecidos pela barbearia' 
                : 'Gerencie os produtos disponíveis para venda'
              }
            </p>
          </div>
          <button
            onClick={() => {
              setServiceType(activeTab === 'services' ? 'service' : 'product');
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-black font-medium hover:bg-amber-400 transition-colors"
          >
            <Plus size={18} />
            Novo {activeTab === 'services' ? 'Serviço' : 'Produto'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.filter(item => 
            activeTab === 'services' ? item.type === 'serviço' : item.type === 'produto'
          ).map((item) => (
            <div key={item.id} className="rounded-xl border border-neutral-700 bg-neutral-800 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'serviço' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {item.type === 'serviço' ? <Scissors size={16} /> : <Package size={16} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{item.name}</h4>
                    <span className="text-xs text-neutral-400 capitalize">{item.type}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'ativo' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-neutral-300 mb-3">{item.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-neutral-400" />
                    <span className="text-white font-medium">{item.price}</span>
                  </div>
                  {item.duration && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-neutral-400" />
                      <span className="text-neutral-300">{item.duration}</span>
                    </div>
                  )}
                  {item.stock && (
                    <div className="text-neutral-300">
                      <span className="text-green-400">{item.stock}</span> unid.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 rounded-lg bg-neutral-700 px-3 py-2 text-white hover:bg-neutral-600 transition-colors text-sm">
                  Editar
                </button>
                <button className="flex-1 rounded-lg bg-neutral-700 px-3 py-2 text-white hover:bg-neutral-600 transition-colors text-sm">
                  Configurar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Service/Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-8 max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Novo {serviceType === 'service' ? 'Serviço' : 'Produto'}
              </h3>
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
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Nome</label>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2 focus:outline-none"
                    placeholder={`Ex: ${serviceType === 'service' ? 'Corte Clássico' : 'Shampoo Premium'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Preço</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 pl-8 pr-4 py-3 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2 focus:outline-none"
                      placeholder="35,00"
                    />
                  </div>
                </div>

                {serviceType === 'service' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Duração</label>
                    <select className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2 focus:outline-none">
                      {durationOptions.map(duration => (
                        <option key={duration} value={duration}>{duration}</option>
                      ))}
                    </select>
                  </div>
                )}

                {serviceType === 'product' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Estoque Inicial</label>
                    <input
                      type="number"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2 focus:outline-none"
                      placeholder="10 unidades"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Descrição</label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-3 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2 focus:outline-none"
                  placeholder={`Descreva o ${serviceType === 'service' ? 'serviço' : 'produto'}...`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Profissionais Vinculados</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Luiz", "Carlos", "Ana", "João"].map((professional) => (
                    <label key={professional} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-neutral-600 bg-neutral-900 text-amber-500 focus:ring-amber-500" />
                      <span className="text-sm text-neutral-300">{professional}</span>
                    </label>
                  ))}
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
                  Criar {serviceType === 'service' ? 'Serviço' : 'Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;