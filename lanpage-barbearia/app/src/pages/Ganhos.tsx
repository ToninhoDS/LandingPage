import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Users,
  CreditCard,
  PieChart,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TouchButton from '@/components/mobile/TouchButton';
import SwipeableCard from '@/components/mobile/SwipeableCard';

// Mock data for barber earnings
const mockEarnings = {
  today: {
    total: 280.00,
    appointments: 8,
    commission: 168.00,
    tips: 45.00
  },
  week: {
    total: 1680.00,
    appointments: 42,
    commission: 1008.00,
    tips: 230.00
  },
  month: {
    total: 6720.00,
    appointments: 168,
    commission: 4032.00,
    tips: 890.00
  }
};

const mockRecentEarnings = [
  {
    id: 1,
    client: 'João Silva',
    service: 'Corte + Barba',
    value: 45.00,
    commission: 27.00,
    tip: 5.00,
    date: '2024-01-15',
    time: '14:30',
    paymentMethod: 'PIX'
  },
  {
    id: 2,
    client: 'Pedro Santos',
    service: 'Corte Degradê',
    value: 35.00,
    commission: 21.00,
    tip: 0.00,
    date: '2024-01-15',
    time: '13:00',
    paymentMethod: 'Cartão'
  },
  {
    id: 3,
    client: 'Carlos Lima',
    service: 'Barba Completa',
    value: 25.00,
    commission: 15.00,
    tip: 10.00,
    date: '2024-01-15',
    time: '11:30',
    paymentMethod: 'Dinheiro'
  },
  {
    id: 4,
    client: 'Rafael Costa',
    service: 'Corte + Sobrancelha',
    value: 40.00,
    commission: 24.00,
    tip: 0.00,
    date: '2024-01-15',
    time: '10:00',
    paymentMethod: 'PIX'
  }
];

const mockWeeklyData = [
  { day: 'Seg', earnings: 240 },
  { day: 'Ter', earnings: 320 },
  { day: 'Qua', earnings: 280 },
  { day: 'Qui', earnings: 360 },
  { day: 'Sex', earnings: 420 },
  { day: 'Sáb', earnings: 480 },
  { day: 'Dom', earnings: 180 }
];

export default function Ganhos() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [showFilters, setShowFilters] = useState(false);

  const getCurrentEarnings = () => {
    switch (selectedPeriod) {
      case 'week':
        return mockEarnings.week;
      case 'month':
        return mockEarnings.month;
      default:
        return mockEarnings.today;
    }
  };

  const currentEarnings = getCurrentEarnings();
  const maxWeeklyEarnings = Math.max(...mockWeeklyData.map(d => d.earnings));

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Ganhos</h1>
          <p className="text-muted-foreground">Acompanhe seus rendimentos</p>
        </div>
        <TouchButton
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          <ChevronDown className="h-4 w-4 ml-2" />
        </TouchButton>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: 'today', label: 'Hoje' },
          { key: 'week', label: 'Semana' },
          { key: 'month', label: 'Mês' }
        ].map((period) => (
          <TouchButton
            key={period.key}
            variant={selectedPeriod === period.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod(period.key)}
            className="flex-1"
          >
            {period.label}
          </TouchButton>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <SwipeableCard className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            R$ {currentEarnings.total.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentEarnings.appointments} atendimentos
          </p>
        </SwipeableCard>

        <SwipeableCard className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Comissão</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            R$ {currentEarnings.commission.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            60% dos serviços
          </p>
        </SwipeableCard>

        <SwipeableCard className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium">Gorjetas</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            R$ {currentEarnings.tips.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            Extras dos clientes
          </p>
        </SwipeableCard>

        <SwipeableCard className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">Média/Hora</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            R$ {(currentEarnings.total / (currentEarnings.appointments * 0.75)).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            Por atendimento
          </p>
        </SwipeableCard>
      </div>

      {/* Weekly Chart */}
      {selectedPeriod === 'week' && (
        <SwipeableCard className="p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Ganhos da Semana</h3>
            <PieChart className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {mockWeeklyData.map((day, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-8">{day.day}</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(day.earnings / maxWeeklyEarnings) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-16 text-right">
                  R$ {day.earnings}
                </span>
              </div>
            ))}
          </div>
        </SwipeableCard>
      )}

      {/* Recent Earnings */}
      <SwipeableCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Atendimentos Recentes</h3>
          <TouchButton variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </TouchButton>
        </div>
        
        <div className="space-y-3">
          {mockRecentEarnings.map((earning) => (
            <div key={earning.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{earning.client}</p>
                  <p className="text-sm text-muted-foreground">{earning.service}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    R$ {earning.commission.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    de R$ {earning.value.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(earning.date).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {earning.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {earning.tip > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +R$ {earning.tip.toFixed(2)} gorjeta
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    <CreditCard className="h-3 w-3 mr-1" />
                    {earning.paymentMethod}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SwipeableCard>

      {/* Export Options */}
      <div className="mt-6 flex space-x-3">
        <TouchButton variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Relatório PDF
        </TouchButton>
        <TouchButton variant="outline" className="flex-1">
          <TrendingUp className="h-4 w-4 mr-2" />
          Análise Detalhada
        </TouchButton>
      </div>
    </div>
  );
}