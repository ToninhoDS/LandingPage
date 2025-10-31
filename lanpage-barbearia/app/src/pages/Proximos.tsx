import React, { useState } from 'react'
import { Calendar, Clock, User, Phone, MapPin, ChevronRight, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TouchButton from '@/components/mobile/TouchButton'
import SwipeableCard from '@/components/mobile/SwipeableCard'
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Mock data
const agendamentos = [
  {
    id: 1,
    cliente: 'João Silva',
    telefone: '(11) 99999-1234',
    servico: 'Corte + Barba',
    data: addDays(new Date(), 1),
    horario: '09:00',
    duracao: 45,
    preco: 40,
    status: 'confirmado',
    observacoes: 'Cliente prefere corte baixo nas laterais'
  },
  {
    id: 2,
    cliente: 'Pedro Santos',
    telefone: '(11) 99999-5678',
    servico: 'Corte Simples',
    data: addDays(new Date(), 1),
    horario: '10:30',
    duracao: 30,
    preco: 25,
    status: 'confirmado'
  },
  {
    id: 3,
    cliente: 'Carlos Lima',
    telefone: '(11) 99999-9012',
    servico: 'Barba + Sobrancelha',
    data: addDays(new Date(), 2),
    horario: '14:00',
    duracao: 40,
    preco: 35,
    status: 'pendente'
  },
  {
    id: 4,
    cliente: 'Roberto Costa',
    telefone: '(11) 99999-3456',
    servico: 'Corte Premium',
    data: addDays(new Date(), 3),
    horario: '16:00',
    duracao: 60,
    preco: 60,
    status: 'confirmado',
    observacoes: 'Primeira vez na barbearia'
  },
  {
    id: 5,
    cliente: 'André Oliveira',
    telefone: '(11) 99999-7890',
    servico: 'Corte + Barba',
    data: addDays(new Date(), 4),
    horario: '11:00',
    duracao: 45,
    preco: 40,
    status: 'confirmado'
  }
]

const statusColors = {
  confirmado: 'bg-green-100 text-green-800',
  pendente: 'bg-yellow-100 text-yellow-800',
  cancelado: 'bg-red-100 text-red-800'
}

export default function Proximos() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('todos')

  // Group appointments by date
  const groupedAgendamentos = agendamentos.reduce((groups, agendamento) => {
    const dateKey = format(agendamento.data, 'yyyy-MM-dd')
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(agendamento)
    return groups
  }, {} as Record<string, typeof agendamentos>)

  // Filter appointments
  const filteredGroups = Object.entries(groupedAgendamentos).reduce((filtered, [date, appointments]) => {
    const filteredAppointments = appointments.filter(appointment => 
      filterStatus === 'todos' || appointment.status === filterStatus
    )
    if (filteredAppointments.length > 0) {
      filtered[date] = filteredAppointments
    }
    return filtered
  }, {} as Record<string, typeof agendamentos>)

  const getTotalAgendamentos = () => {
    return Object.values(filteredGroups).flat().length
  }

  const getTotalReceita = () => {
    return Object.values(filteredGroups).flat().reduce((total, agendamento) => {
      return total + (agendamento.status === 'confirmado' ? agendamento.preco : 0)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Próximos Dias</h1>
          <Button variant="outline" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {getTotalAgendamentos()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Agendamentos
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  R$ {getTotalReceita().toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Receita Prevista
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Status */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['todos', 'confirmado', 'pendente'].map(status => (
            <TouchButton
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="whitespace-nowrap"
            >
              {status === 'todos' ? 'Todos' : 
               status === 'confirmado' ? 'Confirmados' : 'Pendentes'}
            </TouchButton>
          ))}
        </div>
      </div>

      {/* Appointments by Date */}
      <div className="p-4 space-y-6">
        {Object.entries(filteredGroups).map(([dateKey, appointments]) => {
          const date = new Date(dateKey)
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
          const isTomorrow = format(date, 'yyyy-MM-dd') === format(addDays(new Date(), 1), 'yyyy-MM-dd')
          
          let dateLabel = format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })
          if (isToday) dateLabel = 'Hoje'
          if (isTomorrow) dateLabel = 'Amanhã'

          return (
            <div key={dateKey}>
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold capitalize">{dateLabel}</h2>
                <Badge variant="outline">
                  {appointments.length} {appointments.length === 1 ? 'agendamento' : 'agendamentos'}
                </Badge>
              </div>

              <div className="space-y-3">
                {appointments.map(agendamento => (
                  <SwipeableCard key={agendamento.id}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-lg">
                                {agendamento.cliente}
                              </span>
                              <Badge className={statusColors[agendamento.status as keyof typeof statusColors]}>
                                {agendamento.status}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{agendamento.horario} ({agendamento.duracao}min)</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{agendamento.servico}</span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{agendamento.telefone}</span>
                              </div>

                              {agendamento.observacoes && (
                                <div className="mt-2 p-2 bg-muted rounded text-xs">
                                  <strong>Obs:</strong> {agendamento.observacoes}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              R$ {agendamento.preco.toFixed(2)}
                            </div>
                            <TouchButton size="sm" variant="outline" className="mt-2">
                              <ChevronRight className="h-4 w-4" />
                            </TouchButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SwipeableCard>
                ))}
              </div>
            </div>
          )
        })}

        {Object.keys(filteredGroups).length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-muted-foreground">
              {filterStatus === 'todos' 
                ? 'Você não tem agendamentos nos próximos dias.'
                : `Nenhum agendamento ${filterStatus} encontrado.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}