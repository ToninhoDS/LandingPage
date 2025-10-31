import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, Users, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ROICalculatorSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [inputs, setInputs] = useState({
    dailyClients: 15,
    averageTicket: 35,
    workingDays: 25,
    noShowRate: 30
  });

  const [results, setResults] = useState({
    currentRevenue: 0,
    lostRevenue: 0,
    potentialRevenue: 0,
    monthlyGain: 0,
    yearlyGain: 0,
    roi: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('roi-calculator');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const calculateROI = () => {
    const { dailyClients, averageTicket, workingDays, noShowRate } = inputs;
    
    // Receita atual
    const currentRevenue = dailyClients * averageTicket * workingDays;
    
    // Receita perdida por no-shows
    const lostRevenue = (currentRevenue * noShowRate) / 100;
    
    // Com o APP: +40% de agendamentos, -90% no-shows, vendas 24h
    const newDailyClients = dailyClients * 1.4; // 40% mais clientes
    const newNoShowRate = noShowRate * 0.1; // 90% menos no-shows
    const nightSales = dailyClients * 0.3 * averageTicket * workingDays; // 30% vendas noturnas
    
    const potentialRevenue = (newDailyClients * averageTicket * workingDays) + nightSales;
    const newLostRevenue = (potentialRevenue * newNoShowRate) / 100;
    const finalRevenue = potentialRevenue - newLostRevenue;
    
    const monthlyGain = finalRevenue - (currentRevenue - lostRevenue);
    const yearlyGain = monthlyGain * 12;
    const appCost = 197 * 12; // Custo anual do APP
    const roi = ((yearlyGain - appCost) / appCost) * 100;

    setResults({
      currentRevenue: currentRevenue - lostRevenue,
      lostRevenue,
      potentialRevenue: finalRevenue,
      monthlyGain,
      yearlyGain,
      roi
    });
  };

  const handleInputChange = (field: string, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <section id="roi-calculator" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/5 to-amber-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-green-500/15 text-green-300 text-lg font-semibold rounded-full border border-green-500/30 backdrop-blur-sm inline-block mb-8">
              💰 Calculadora de ROI
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Descubra quanto você <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-amber-400">pode ganhar</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Calcule o retorno do investimento do nosso sistema para sua barbearia
            </p>
          </div>
        </div>

        {/* Calculator Inputs */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Input Controls */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Card className="relative bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-black/80 border-gray-700/50 p-8 backdrop-blur-sm shadow-2xl shadow-gray-900/50 overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <Calculator className="h-8 w-8 text-amber-400 mr-3" />
                  Dados da sua Barbearia
                </h3>

                <div className="space-y-8">
                  <div>
                    <label className="block text-white font-semibold mb-4">
                      Clientes por dia: <span className="text-amber-400">{inputs.dailyClients}</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={inputs.dailyClients}
                      onChange={(e) => handleInputChange('dailyClients', parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>5</span>
                      <span>50</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-4">
                      Ticket médio: <span className="text-amber-400">R$ {inputs.averageTicket}</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={inputs.averageTicket}
                      onChange={(e) => handleInputChange('averageTicket', parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>R$ 20</span>
                      <span>R$ 100</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-4">
                      Dias trabalhados/mês: <span className="text-amber-400">{inputs.workingDays}</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="30"
                      value={inputs.workingDays}
                      onChange={(e) => handleInputChange('workingDays', parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>20</span>
                      <span>30</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-4">
                      Taxa de no-show: <span className="text-red-400">{inputs.noShowRate}%</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={inputs.noShowRate}
                      onChange={(e) => handleInputChange('noShowRate', parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>10%</span>
                      <span className="text-amber-400 font-bold">{inputs.noShowRate}%</span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className={`transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Card className="relative bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-600/20 border-green-400/50 p-8 backdrop-blur-sm shadow-2xl shadow-green-500/20 overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-400/30 to-green-500/30 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-8 text-center">
                  🎯 Seus Resultados
                </h3>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <Card className="relative bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-600/20 border-blue-400/50 p-6 backdrop-blur-sm shadow-xl shadow-blue-500/20 overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/40 to-indigo-500/40 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-purple-400/40 to-blue-500/40 rounded-full blur-lg"></div>
                    
                    <div className="relative z-10">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-300 mb-2">Receita Atual</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(results.currentRevenue)}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="relative bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-red-600/20 border-purple-400/50 p-6 backdrop-blur-sm shadow-xl shadow-purple-500/20 overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/40 to-pink-500/40 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-red-400/40 to-purple-500/40 rounded-full blur-lg"></div>
                    
                    <div className="relative z-10">
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-300 mb-2">Com o Sistema</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(results.potentialRevenue)}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="relative bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-red-600/20 border-amber-400/50 p-6 backdrop-blur-sm shadow-xl shadow-amber-500/20 overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/40 to-orange-500/40 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-red-400/40 to-amber-500/40 rounded-full blur-lg"></div>
                    
                    <div className="relative z-10">
                      <div className="text-center">
                        <Zap className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-300 mb-2">Ganho Mensal</p>
                        <p className="text-xl font-bold text-amber-400">{formatCurrency(results.monthlyGain)}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="relative bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-600/20 border-green-400/50 p-6 backdrop-blur-sm shadow-xl shadow-green-500/20 overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/40 to-emerald-500/40 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-teal-400/40 to-green-500/40 rounded-full blur-lg"></div>
                    
                    <div className="relative z-10">
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-300 mb-2">ROI Anual</p>
                        <p className="text-xl font-bold text-green-400">{results.roi.toFixed(0)}%</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Users className="h-5 w-5 text-green-400 mr-2" />
                    Benefícios Inclusos:
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center text-green-400">
                      <Clock className="h-5 w-5 mr-3" />
                      <span className="text-sm">Agendamentos 24/7 automáticos</span>
                    </div>
                    <div className="flex items-center text-green-400">
                      <TrendingUp className="h-5 w-5 mr-3" />
                      <span className="text-sm">90% menos no-shows</span>
                    </div>
                    <div className="flex items-center text-green-400">
                      <TrendingUp className="h-5 w-5 mr-3" />
                      <span className="text-sm">+40% mais clientes</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-amber-400/10 to-amber-600/10 border border-amber-400/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Investimento: <span className="text-amber-400">R$ 197/mês</span>
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Se paga em menos de {Math.ceil((197 / results.monthlyGain) * 30)} dias!
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold px-8 py-4 text-lg"
            >
              Quero Testar Grátis por 7 Dias
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              Sem compromisso • Cancele quando quiser • Suporte 24/7
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }
      `}</style>
    </section>
  );
};

export default ROICalculatorSection;