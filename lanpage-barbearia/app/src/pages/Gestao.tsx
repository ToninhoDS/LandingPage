import React, { useState } from 'react'
import { 
  Users, 
  Scissors, 
  Package, 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TouchButton from '@/components/mobile/TouchButton'
import SwipeableCard from '@/components/mobile/SwipeableCard'
import RoleManager from '@/components/admin/RoleManager'

// Mock data
const barbeiros = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@barbearia.com',
    telefone: '(11) 99999-1234',
    especialidades: ['Corte Clássico', 'Barba'],
    status: 'ativo',
    rating: 4.9,
    agendamentosHoje: 8,
    receitaMes: 2450.00,
    avatar: '👨‍🦲'
  },
  {
    id: 2,
    nome: 'Pedro Santos',
    email: 'pedro@barbearia.com',
    telefone: '(11) 99999-5678',
    especialidades: ['Corte Moderno', 'Sobrancelha'],
    status: 'ativo',
    rating: 4.8,
    agendamentosHoje: 6,
    receitaMes: 1890.00,
    avatar: '🧔'
  },
  {
    id: 3,
    nome: 'Carlos Lima',
    email: 'carlos@barbearia.com',
    telefone: '(11) 99999-9012',
    especialidades: ['Barba', 'Bigode'],
    status: 'inativo',
    rating: 4.7,
    agendamentosHoje: 0,
    receitaMes: 0,
    avatar: '👨‍🦱'
  }
]

const servicos = [
  {
    id: 1,
    nome: 'Corte Simples',
    preco: 25.00,
    duracao: 30,
    categoria: 'Cabelo',
    ativo: true,
    agendamentosHoje: 12
  },
  {
    id: 2,
    nome: 'Corte + Barba',
    preco: 40.00,
    duracao: 45,
    categoria: 'Combo',
    ativo: true,
    agendamentosHoje: 8
  },
  {
    id: 3,
    nome: 'Barba Completa',
    preco: 20.00,
    duracao: 25,
    categoria: 'Barba',
    ativo: true,
    agendamentosHoje: 5
  },
  {
    id: 4,
    nome: 'Corte Premium',
    preco: 60.00,
    duracao: 60,
    categoria: 'Premium',
    ativo: false,
    agendamentosHoje: 0
  }
]

const clientes = [
  {
    id: 1,
    nome: 'Roberto Costa',
    email: 'roberto@email.com',
    telefone: '(11) 99999-1111',
    ultimaVisita: '2024-01-15',
    totalGasto: 320.00,
    agendamentos: 8,
    status: 'ativo'
  },
  {
    id: 2,
    nome: 'André Oliveira',
    email: 'andre@email.com',
    telefone: '(11) 99999-2222',
    ultimaVisita: '2024-01-10',
    totalGasto: 180.00,
    agendamentos: 4,
    status: 'ativo'
  },
  {
    id: 3,
    nome: 'Fernando Silva',
    email: 'fernando@email.com',
    telefone: '(11) 99999-3333',
    ultimaVisita: '2023-12-20',
    totalGasto: 450.00,
    agendamentos: 12,
    status: 'inativo'
  }
]

export default function Gestao() {
  const [activeTab, setActiveTab] = useState('barbeiros')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBarbeiros = barbeiros.filter(barbeiro =>
    barbeiro.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredServicos = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Gestão</h1>
          <Button size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
          <TabsTrigger value="barbeiros">Barbeiros</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>

        {/* Barbeiros Tab */}
        <TabsContent value="barbeiros" className="px-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {barbeiros.filter(b => b.status === 'ativo').length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Barbeiros Ativos
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {barbeiros.reduce((total, b) => total + b.receitaMes, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Receita Total
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {filteredBarbeiros.map(barbeiro => (
            <SwipeableCard key={barbeiro.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{barbeiro.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{barbeiro.nome}</h3>
                        <Badge variant={barbeiro.status === 'ativo' ? 'default' : 'secondary'}>
                          {barbeiro.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{barbeiro.rating}</span>
                          <span>•</span>
                          <span>{barbeiro.especialidades.join(', ')}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div className="text-center">
                            <div className="font-semibold text-primary">
                              {barbeiro.agendamentosHoje}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Hoje
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-600">
                              R$ {barbeiro.receitaMes.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Este mês
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SwipeableCard>
          ))}
        </TabsContent>

        {/* Serviços Tab */}
        <TabsContent value="servicos" className="px-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {servicos.filter(s => s.ativo).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Serviços Ativos
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {servicos.reduce((total, s) => total + s.agendamentosHoje, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Agendamentos Hoje
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {filteredServicos.map(servico => (
            <SwipeableCard key={servico.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{servico.nome}</h3>
                        <Badge variant={servico.ativo ? 'default' : 'secondary'}>
                          {servico.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>R$ {servico.preco.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{servico.duracao}min</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {servico.categoria}
                        </Badge>
                      </div>

                      <div className="mt-2">
                        <div className="text-sm">
                          <span className="font-medium">{servico.agendamentosHoje}</span>
                          <span className="text-muted-foreground"> agendamentos hoje</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SwipeableCard>
          ))}
        </TabsContent>

        {/* Clientes Tab */}
        <TabsContent value="clientes" className="px-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {clientes.filter(c => c.status === 'ativo').length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Clientes Ativos
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {clientes.reduce((total, c) => total + c.totalGasto, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Receita Total
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {filteredClientes.map(cliente => (
            <SwipeableCard key={cliente.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                        <Badge variant={cliente.status === 'ativo' ? 'default' : 'secondary'}>
                          {cliente.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>{cliente.email}</div>
                        <div>{cliente.telefone}</div>
                        <div>Última visita: {new Date(cliente.ultimaVisita).toLocaleDateString('pt-BR')}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="text-center">
                          <div className="font-semibold text-primary">
                            {cliente.agendamentos}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Agendamentos
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">
                            R$ {cliente.totalGasto.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total gasto
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SwipeableCard>
          ))}
        </TabsContent>

        {/* Usuários Tab */}
        <TabsContent value="usuarios" className="px-4">
          <RoleManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}