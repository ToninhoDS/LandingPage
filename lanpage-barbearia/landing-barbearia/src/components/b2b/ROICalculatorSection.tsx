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
    <section id="roi-calculator" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTMwIDMwaDMwdjMwSDMweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
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
              Descubra quanto você
              <span className="block bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                pode ganhar
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Calcule o retorno real do investimento no nosso APP para sua barbearia. 
              Os números não mentem!
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Inputs */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Card className="bg-gray-800/50 border-gray-700 p-8 backdrop-blur-sm">
              <div className="flex items-center mb-8">
                <Calculator className="h-8 w-8 text-amber-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Dados da Sua Barbearia</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Clientes por dia
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={inputs.dailyClients}
                    onChange={(e) => handleInputChange('dailyClients', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>5</span>
                    <span className="text-amber-400 font-bold">{inputs.dailyClients}</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Ticket médio (R$)
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={inputs.averageTicket}
                    onChange={(e) => handleInputChange('averageTicket', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>R$ 20</span>
                    <span className="text-amber-400 font-bold">R$ {inputs.averageTicket}</span>
                    <span>R$ 100</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Dias trabalhados/mês
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="30"
                    value={inputs.workingDays}
                    onChange={(e) => handleInputChange('workingDays', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>20</span>
                    <span className="text-amber-400 font-bold">{inputs.workingDays}</span>
                    <span>30</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Taxa de no-show (%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={inputs.noShowRate}
                    onChange={(e) => handleInputChange('noShowRate', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>10%</span>
                    <span className="text-amber-400 font-bold">{inputs.noShowRate}%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className={`transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/30 p-8 backdrop-blur-sm">
              <div className="flex items-center mb-8">
                <TrendingUp className="h-8 w-8 text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Seus Resultados</h3>
              </div>

              <div className="space-y-6">
                {/* Current vs Potential */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                    <div className="text-red-400 text-sm font-medium mb-1">Receita Atual</div>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(results.currentRevenue)}
                    </div>
                    <div className="text-xs text-gray-400">por mês</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                    <div className="text-green-400 text-sm font-medium mb-1">Com o APP</div>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(results.potentialRevenue)}
                    </div>
                    <div className="text-xs text-gray-400">por mês</div>
                  </div>
                </div>

                {/* Monthly Gain */}
                <div className="text-center p-6 bg-amber-500/10 rounded-xl border border-amber-500/30">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-6 w-6 text-amber-400 mr-2" />
                    <span className="text-amber-400 text-lg font-medium">Ganho Mensal</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {formatCurrency(results.monthlyGain)}
                  </div>
                  <div className="text-sm text-gray-400">
                    +{((results.monthlyGain / results.currentRevenue) * 100).toFixed(0)}% de aumento
                  </div>
                </div>

                {/* ROI */}
                <div className="text-center p-6 bg-purple-500/10 rounded-xl border border-purple-500/30">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="h-6 w-6 text-purple-400 mr-2" />
                    <span className="text-purple-400 text-lg font-medium">ROI Anual</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {results.roi.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    Retorno: {formatCurrency(results.yearlyGain)}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <div className="flex items-center text-green-400">
                    <Clock className="h-5 w-5 mr-3" />
                    <span className="text-sm">Agendamentos 24/7 automáticos</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <Users className="h-5 w-5 mr-3" />
                    <span className="text-sm">90% menos no-shows</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="h-5 w-5 mr-3" />
                    <span className="text-sm">+40% mais clientes</span>
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
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }
        
        .slider::-moz-range-thumb {
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