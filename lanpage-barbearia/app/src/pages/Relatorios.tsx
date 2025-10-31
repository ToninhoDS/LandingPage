import React, { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Clock,
  BarChart3,
  PieChart,
  Download,
  Filter,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TouchButton from '@/components/mobile/TouchButton'
import SwipeableCard from '@/components/mobile/SwipeableCard'

// Mock data
const resumoFinanceiro = {
  receitaTotal: 15420.00,
  receitaOntem: 890.00,
  receitaMes: 12340.00,
  receitaAnterior: 11200.00,
  agendamentosHoje: 24,
  agendamentosOntem: 18,
  clientesAtivos: 156,
  clientesNovos: 12,
  ticketMedio: 42.50,
  ticketAnterior: 38.90
}

const topServicos = [
  { nome: 'Corte Simples', quantidade: 45, receita: 1125.00, percentual: 35 },
  { nome: 'Corte + Barba', quantidade: 28, receita: 1120.00, percentual: 22 },
  { nome: 'Barba Completa', quantidade: 22, receita: 440.00, percentual: 17 },
  { nome: 'Corte Premium', quantidade: 15, receita: 900.00, percentual: 12 },
  { nome: 'Sobrancelha', quantidade: 18, receita: 270.00, percentual: 14 }
]

const topBarbeiros = [
  { nome: 'João Silva', agendamentos: 32, receita: 1280.00, rating: 4.9, avatar: '👨‍🦲' },
  { nome: 'Pedro Santos', agendamentos: 28, receita: 1120.00, rating: 4.8, avatar: '🧔' },
  { nome: 'Carlos Lima', agendamentos: 24, receita: 960.00, rating: 4.7, avatar: '👨‍🦱' }
]

const horariosPico = [
  { horario: '09:00 - 10:00', agendamentos: 8, percentual: 15 },
  { horario: '10:00 - 11:00', agendamentos: 12, percentual: 22 },
  { horario: '14:00 - 15:00', agendamentos: 15, percentual: 28 },
  { horario: '15:00 - 16:00', agendamentos: 10, percentual: 18 },
  { horario: '16:00 - 17:00', agendamentos: 9, percentual: 17 }
]

const receitaSemanal = [
  { dia: 'Seg', receita: 420.00 },
  { dia: 'Ter', receita: 380.00 },
  { dia: 'Qua', receita: 520.00 },
  { dia: 'Qui', receita: 610.00 },
  { dia: 'Sex', receita: 890.00 },
  { dia: 'Sáb', receita: 1240.00 },
  { dia: 'Dom', receita: 680.00 }
]

export default function Relatorios() {
  const [activeTab, setActiveTab] = useState('resumo')
  const [periodo, setPeriodo] = useState('hoje')

  const calcularVariacao = (atual: number, anterior: number) => {
    const variacao = ((atual - anterior) / anterior) * 100
    return {
      valor: Math.abs(variacao).toFixed(1),
      positiva: variacao > 0
    }
  }

  const variacaoReceita = calcularVariacao(resumoFinanceiro.receitaMes, resumoFinanceiro.receitaAnterior)
  const variacaoTicket = calcularVariacao(resumoFinanceiro.ticketMedio, resumoFinanceiro.ticketAnterior)

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Período Selector */}
        <div className="flex space-x-2">
          {['hoje', 'semana', 'mês', 'ano'].map((p) => (
            <TouchButton
              key={p}
              variant={periodo === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodo(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </TouchButton>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Resumo Tab */}
        <TabsContent value="resumo" className="px-4 space-y-4">
          {/* Cards de Métricas Principais */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Hoje</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {resumoFinanceiro.receitaTotal.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Agendamentos</p>
                    <p className="text-2xl font-bold text-primary">
                      {resumoFinanceiro.agendamentosHoje}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+33.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {resumoFinanceiro.clientesAtivos}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    +{resumoFinanceiro.clientesNovos} novos
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ticket Médio</p>
                    <p className="text-2xl font-bold text-purple-600">
                      R$ {resumoFinanceiro.ticketMedio.toFixed(2)}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{variacaoTicket.valor}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Receita Semanal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Receita Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {receitaSemanal.map((item, index) => {
                  const maxReceita = Math.max(...receitaSemanal.map(r => r.receita))
                  const largura = (item.receita / maxReceita) * 100
                  
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 text-sm font-medium">{item.dia}</div>
                      <div className="flex-1">
                        <div className="bg-muted rounded-full h-2 relative">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all duration-300"
                            style={{ width: `${largura}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-sm font-medium text-right">
                        R$ {item.receita.toFixed(0)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Horários de Pico */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Horários de Pico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {horariosPico.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.horario}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{item.agendamentos}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.percentual}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendas Tab */}
        <TabsContent value="vendas" className="px-4 space-y-4">
          {/* Top Serviços */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Serviços Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServicos.map((servico, index) => (
                  <SwipeableCard key={index}>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{servico.nome}</h4>
                          <Badge variant="outline">{servico.percentual}%</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{servico.quantidade} vendas</span>
                          <span className="font-medium text-green-600">
                            R$ {servico.receita.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SwipeableCard>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comparativo Mensal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comparativo Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Este Mês</p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {resumoFinanceiro.receitaMes.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">
                      +{variacaoReceita.valor}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Mês Anterior</p>
                    <p className="text-xl font-bold">
                      R$ {resumoFinanceiro.receitaAnterior.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="px-4 space-y-4">
          {/* Top Barbeiros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance dos Barbeiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBarbeiros.map((barbeiro, index) => (
                  <SwipeableCard key={index}>
                    <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl">{barbeiro.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{barbeiro.nome}</h4>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm">⭐</span>
                            <span className="text-sm font-medium">{barbeiro.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{barbeiro.agendamentos} agendamentos</span>
                          <span className="font-medium text-green-600">
                            R$ {barbeiro.receita.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </SwipeableCard>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Métricas de Eficiência */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">94%</div>
                  <div className="text-sm text-muted-foreground">
                    Taxa de Ocupação
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4.8</div>
                  <div className="text-sm text-muted-foreground">
                    Avaliação Média
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12min</div>
                  <div className="text-sm text-muted-foreground">
                    Tempo Médio Espera
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-sm text-muted-foreground">
                    Taxa de Retorno
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}