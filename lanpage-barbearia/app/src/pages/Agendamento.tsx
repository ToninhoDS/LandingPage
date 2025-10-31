import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  MapPin, 
  CreditCard,
  MessageCircle,
  Star
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import MobileCalendar from '@/components/mobile/MobileCalendar'
import TimeSlotPicker from '@/components/mobile/TimeSlotPicker'
import TouchButton from '@/components/mobile/TouchButton'
import SwipeableCard from '@/components/mobile/SwipeableCard'
import { cn } from '@/lib/utils'

// Mock data
const barbeiros = [
  { id: 1, nome: 'João Silva', especialidade: 'Corte Clássico', rating: 4.9, avatar: '👨‍🦲' },
  { id: 2, nome: 'Pedro Santos', especialidade: 'Barba & Bigode', rating: 4.8, avatar: '🧔' },
  { id: 3, nome: 'Carlos Lima', especialidade: 'Corte Moderno', rating: 4.7, avatar: '👨‍🦱' },
]

const servicos = [
  { id: 1, nome: 'Corte Simples', preco: 25, duracao: 30, descricao: 'Corte básico com máquina e tesoura' },
  { id: 2, nome: 'Corte + Barba', preco: 40, duracao: 45, descricao: 'Corte completo com barba alinhada' },
  { id: 3, nome: 'Corte Premium', preco: 60, duracao: 60, descricao: 'Corte + barba + sobrancelha + hidratação' },
  { id: 4, nome: 'Apenas Barba', preco: 20, duracao: 20, descricao: 'Barba alinhada e hidratada' },
]

const horarios = [
  { time: '08:00', available: true, price: 25 },
  { time: '08:30', available: true, price: 25 },
  { time: '09:00', available: false },
  { time: '09:30', available: true, price: 25 },
  { time: '10:00', available: true, price: 25 },
  { time: '10:30', available: false },
  { time: '11:00', available: true, price: 25 },
  { time: '11:30', available: true, price: 25 },
  { time: '14:00', available: true, price: 30 },
  { time: '14:30', available: true, price: 30 },
  { time: '15:00', available: false },
  { time: '15:30', available: true, price: 30 },
  { time: '16:00', available: true, price: 30 },
  { time: '16:30', available: true, price: 30 },
  { time: '17:00', available: false },
  { time: '17:30', available: true, price: 35 },
  { time: '18:00', available: true, price: 35 },
]

interface AgendamentoData {
  barbeiro?: typeof barbeiros[0]
  servicos: typeof servicos
  data?: Date
  horario?: string
  observacoes?: string
  pagamento?: 'dinheiro' | 'cartao' | 'pix'
  contato?: string
}

export default function Agendamento() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [agendamento, setAgendamento] = useState<AgendamentoData>({
    servicos: []
  })

  const totalSteps = 7
  const progress = (currentStep / totalSteps) * 100

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return agendamento.servicos.length > 0
      case 2: return agendamento.barbeiro !== undefined
      case 3: return agendamento.data !== undefined
      case 4: return agendamento.horario !== undefined
      case 5: return true // Observações são opcionais
      case 6: return agendamento.pagamento !== undefined
      case 7: return agendamento.contato !== undefined
      default: return false
    }
  }

  const handleServicoToggle = (servico: typeof servicos[0]) => {
    setAgendamento(prev => ({
      ...prev,
      servicos: prev.servicos.find(s => s.id === servico.id)
        ? prev.servicos.filter(s => s.id !== servico.id)
        : [...prev.servicos, servico]
    }))
  }

  const getTotalPreco = () => {
    return agendamento.servicos.reduce((total, servico) => total + servico.preco, 0)
  }

  const getTotalDuracao = () => {
    return agendamento.servicos.reduce((total, servico) => total + servico.duracao, 0)
  }

  const handleFinalizarAgendamento = async () => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Agendamento realizado com sucesso!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Erro ao realizar agendamento')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scissors className="h-5 w-5 text-primary" />
                <span>Escolha os Serviços</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {servicos.map(servico => (
                <TouchButton
                  key={servico.id}
                  variant={agendamento.servicos.find(s => s.id === servico.id) ? "primary" : "outline"}
                  fullWidth
                  className="h-auto p-4 text-left"
                  onClick={() => handleServicoToggle(servico)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{servico.nome}</span>
                        {agendamento.servicos.find(s => s.id === servico.id) && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {servico.descricao}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="secondary">
                          R$ {servico.preco}
                        </Badge>
                        <Badge variant="outline">
                          {servico.duracao}min
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TouchButton>
              ))}
              
              {agendamento.servicos.length > 0 && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <div className="text-right">
                      <div className="font-bold text-lg">R$ {getTotalPreco()}</div>
                      <div className="text-sm text-muted-foreground">
                        {getTotalDuracao()} minutos
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Escolha o Barbeiro</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {barbeiros.map(barbeiro => (
                <TouchButton
                  key={barbeiro.id}
                  variant={agendamento.barbeiro?.id === barbeiro.id ? "primary" : "outline"}
                  fullWidth
                  className="h-auto p-4 text-left"
                  onClick={() => setAgendamento(prev => ({ ...prev, barbeiro }))}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="text-2xl">{barbeiro.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{barbeiro.nome}</span>
                        {agendamento.barbeiro?.id === barbeiro.id && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {barbeiro.especialidade}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{barbeiro.rating}</span>
                      </div>
                    </div>
                  </div>
                </TouchButton>
              ))}
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Escolha a Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MobileCalendar
                selectedDate={agendamento.data}
                onDateSelect={(date) => setAgendamento(prev => ({ ...prev, data: date }))}
                minDate={new Date()}
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
              />
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Escolha o Horário</span>
              </CardTitle>
              {agendamento.data && (
                <p className="text-sm text-muted-foreground">
                  {agendamento.data.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <TimeSlotPicker
                timeSlots={horarios}
                selectedTime={agendamento.horario}
                onTimeSelect={(time) => setAgendamento(prev => ({ ...prev, horario: time }))}
              />
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Observações (Opcional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Alguma observação especial? Ex: corte específico, alergia, etc."
                value={agendamento.observacoes || ''}
                onChange={(e) => setAgendamento(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={4}
                className="resize-none"
              />
              
              <div className="text-sm text-muted-foreground">
                <p>💡 Dicas:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Mencione se tem alguma alergia</li>
                  <li>Descreva o corte desejado</li>
                  <li>Informe se é primeira vez na barbearia</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Forma de Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 'dinheiro', nome: 'Dinheiro', icon: '💵', descricao: 'Pagamento na barbearia' },
                { id: 'cartao', nome: 'Cartão', icon: '💳', descricao: 'Débito ou crédito' },
                { id: 'pix', nome: 'PIX', icon: '📱', descricao: 'Transferência instantânea' },
              ].map(pagamento => (
                <TouchButton
                  key={pagamento.id}
                  variant={agendamento.pagamento === pagamento.id ? "primary" : "outline"}
                  fullWidth
                  className="h-auto p-4 text-left"
                  onClick={() => setAgendamento(prev => ({ ...prev, pagamento: pagamento.id as any }))}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="text-2xl">{pagamento.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{pagamento.nome}</span>
                        {agendamento.pagamento === pagamento.id && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pagamento.descricao}
                      </p>
                    </div>
                  </div>
                </TouchButton>
              ))}
            </CardContent>
          </Card>
        )

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Contato para Confirmação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="WhatsApp para confirmação"
                value={agendamento.contato || ''}
                onChange={(e) => setAgendamento(prev => ({ ...prev, contato: e.target.value }))}
                type="tel"
              />
              
              {/* Resumo do agendamento */}
              <div className="mt-6 p-4 bg-muted rounded-lg space-y-3">
                <h3 className="font-semibold">Resumo do Agendamento</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Barbeiro:</span>
                    <span className="font-medium">{agendamento.barbeiro?.nome}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Data:</span>
                    <span className="font-medium">
                      {agendamento.data?.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Horário:</span>
                    <span className="font-medium">{agendamento.horario}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Serviços:</span>
                    <span className="font-medium">
                      {agendamento.servicos.map(s => s.nome).join(', ')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Duração:</span>
                    <span className="font-medium">{getTotalDuracao()} min</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Pagamento:</span>
                    <span className="font-medium capitalize">{agendamento.pagamento}</span>
                  </div>
                  
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">R$ {getTotalPreco()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <TouchButton
          variant="ghost"
          size="sm"
          onClick={() => currentStep === 1 ? navigate('/dashboard') : prevStep()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </TouchButton>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold">Novo Agendamento</h1>
          <p className="text-sm text-muted-foreground">
            Etapa {currentStep} de {totalSteps}
          </p>
        </div>
        
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-4 left-4 right-4 flex space-x-3">
        {currentStep > 1 && (
          <TouchButton
            variant="outline"
            onClick={prevStep}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </TouchButton>
        )}
        
        {currentStep < totalSteps ? (
          <TouchButton
            variant="primary"
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex-1"
          >
            Próximo
            <ArrowRight className="h-4 w-4 ml-2" />
          </TouchButton>
        ) : (
          <TouchButton
            variant="primary"
            onClick={handleFinalizarAgendamento}
            disabled={!canProceed()}
            className="flex-1"
            loading={false}
          >
            <Check className="h-4 w-4 mr-2" />
            Confirmar Agendamento
          </TouchButton>
        )}
      </div>
    </div>
  )
}