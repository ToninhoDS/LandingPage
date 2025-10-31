import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  User, 
  Star, 
  Plus, 
  TrendingUp, 
  Users, 
  Scissors,
  Bell,
  Settings,
  BarChart3,
  MessageCircle,
  MapPin,
  Phone,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import TouchButton from '@/components/mobile/TouchButton'
import SwipeableCard from '@/components/mobile/SwipeableCard'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

// Mock data
const proximosAgendamentos = [
  {
    id: 1,
    cliente: 'João Silva',
    servico: 'Corte + Barba',
    data: '2024-01-15',
    horario: '14:30',
    barbeiro: 'Pedro Santos',
    status: 'confirmado',
    preco: 40,
    avatar: '👨‍💼'
  },
  {
    id: 2,
    cliente: 'Carlos Lima',
    servico: 'Corte Simples',
    data: '2024-01-15',
    horario: '15:00',
    barbeiro: 'João Silva',
    status: 'pendente',
    preco: 25,
    avatar: '👨‍🦱'
  },
  {
    id: 3,
    cliente: 'Ana Costa',
    servico: 'Corte Premium',
    data: '2024-01-15',
    horario: '16:00',
    barbeiro: 'Pedro Santos',
    status: 'confirmado',
    preco: 60,
    avatar: '👩‍💼'
  }
]

const estatisticas = {
  agendamentosHoje: 8,
  faturamentoHoje: 320,
  clientesAtendidos: 156,
  avaliacaoMedia: 4.8,
  crescimentoMensal: 12.5
}

const notificacoes = [
  {
    id: 1,
    tipo: 'agendamento',
    titulo: 'Novo agendamento',
    descricao: 'João Silva agendou para hoje às 14:30',
    tempo: '5 min atrás',
    lida: false
  },
  {
    id: 2,
    tipo: 'avaliacao',
    titulo: 'Nova avaliação',
    descricao: 'Carlos Lima avaliou seu atendimento com 5 estrelas',
    tempo: '1 hora atrás',
    lida: false
  },
  {
    id: 3,
    tipo: 'lembrete',
    titulo: 'Lembrete',
    descricao: 'Próximo cliente em 15 minutos',
    tempo: '2 horas atrás',
    lida: true
  }
]

const servicosPopulares = [
  { nome: 'Corte + Barba', quantidade: 45, crescimento: 15 },
  { nome: 'Corte Simples', quantidade: 38, crescimento: 8 },
  { nome: 'Apenas Barba', quantidade: 22, crescimento: -5 },
  { nome: 'Corte Premium', quantidade: 18, crescimento: 25 }
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('hoje')
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(
    notificacoes.filter(n => !n.lida).length
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle className="h-3 w-3" />
      case 'pendente':
        return <AlertCircle className="h-3 w-3" />
      case 'cancelado':
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Olá, {user?.email?.split('@')[0] || 'Usuário'}!</h1>
            <p className="text-primary-foreground/80 text-sm">
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <TouchButton
              variant="ghost"
              size="sm"
              className="relative text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5" />
              {notificacoesNaoLidas > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                  {notificacoesNaoLidas}
                </Badge>
              )}
            </TouchButton>
            
            <TouchButton
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
            </TouchButton>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary-foreground" />
                <div>
                  <p className="text-xs text-primary-foreground/80">Hoje</p>
                  <p className="text-lg font-bold text-primary-foreground">
                    {estatisticas.agendamentosHoje}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
                <div>
                  <p className="text-xs text-primary-foreground/80">Faturamento</p>
                  <p className="text-lg font-bold text-primary-foreground">
                    {formatCurrency(estatisticas.faturamentoHoje)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <TouchButton
            variant="outline"
            className="h-20 flex-col space-y-2"
            onClick={() => navigate('/agendamento')}
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm font-medium">Novo Agendamento</span>
          </TouchButton>
          
          <TouchButton
            variant="outline"
            className="h-20 flex-col space-y-2"
            onClick={() => navigate('/clientes')}
          >
            <Users className="h-6 w-6" />
            <span className="text-sm font-medium">Clientes</span>
          </TouchButton>
        </div>

        {/* Próximos Agendamentos */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={() => navigate('/agenda')}
              >
                Ver todos
                <ChevronRight className="h-4 w-4 ml-1" />
              </TouchButton>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {proximosAgendamentos.slice(0, 3).map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="text-2xl">{agendamento.avatar}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-sm truncate">
                      {agendamento.cliente}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getStatusColor(agendamento.status))}
                    >
                      {getStatusIcon(agendamento.status)}
                      <span className="ml-1 capitalize">{agendamento.status}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {agendamento.servico} • {agendamento.barbeiro}
                  </p>
                  
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {agendamento.horario}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-green-600">
                      {formatCurrency(agendamento.preco)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {proximosAgendamentos.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum agendamento para hoje</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Clientes</p>
                  <p className="text-lg font-bold">{estatisticas.clientesAtendidos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avaliação</p>
                  <p className="text-lg font-bold">{estatisticas.avaliacaoMedia}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Serviços Populares */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Serviços Populares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {servicosPopulares.map((servico, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Scissors className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{servico.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {servico.quantidade} agendamentos
                    </p>
                  </div>
                </div>
                
                <Badge
                  variant={servico.crescimento > 0 ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    servico.crescimento > 0 
                      ? "bg-green-100 text-green-800" 
                      : servico.crescimento < 0 
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  )}
                >
                  {servico.crescimento > 0 ? '+' : ''}{servico.crescimento}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notificações Recentes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificações</CardTitle>
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notifications')}
              >
                Ver todas
                <ChevronRight className="h-4 w-4 ml-1" />
              </TouchButton>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notificacoes.slice(0, 3).map((notificacao) => (
              <div
                key={notificacao.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border transition-colors",
                  !notificacao.lida ? "bg-blue-50 border-blue-200" : "hover:bg-muted/50"
                )}
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  {notificacao.tipo === 'agendamento' && <Calendar className="h-4 w-4 text-primary" />}
                  {notificacao.tipo === 'avaliacao' && <Star className="h-4 w-4 text-yellow-600" />}
                  {notificacao.tipo === 'lembrete' && <Bell className="h-4 w-4 text-orange-600" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-sm">{notificacao.titulo}</p>
                    {!notificacao.lida && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notificacao.descricao}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notificacao.tempo}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Contato Rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <TouchButton
                variant="outline"
                className="h-16 flex-col space-y-1"
                onClick={() => window.open('tel:+5511999999999')}
              >
                <Phone className="h-5 w-5" />
                <span className="text-xs">Ligar</span>
              </TouchButton>
              
              <TouchButton
                variant="outline"
                className="h-16 flex-col space-y-1"
                onClick={() => window.open('https://wa.me/5511999999999')}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">WhatsApp</span>
              </TouchButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}