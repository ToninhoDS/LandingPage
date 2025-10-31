import { supabase } from '@/lib/supabase'
import type { 
  Barbearia, 
  Servico, 
  Barbeiro, 
  Agendamento, 
  AgendamentoServico,
  Usuario 
} from '@/lib/supabase'

export interface AgendamentoData {
  cliente_id: string
  barbeiro_id: string
  barbearia_id: string
  servicos: string[] // IDs dos serviços
  data_agendamento: string
  observacoes?: string
}

export interface AgendamentoCompleto extends Agendamento {
  barbearia: Barbearia
  barbeiro: Usuario
  servicos: (AgendamentoServico & { servico: Servico })[]
  cliente: Usuario
}

class AgendamentoService {
  // Buscar todas as barbearias ativas
  async getBarbearias(): Promise<Barbearia[]> {
    const { data, error } = await supabase
      .from('barbearias')
      .select('*')
      .eq('ativo', true)
      .order('nome')

    if (error) {
      console.error('Erro ao buscar barbearias:', error)
      throw error
    }

    return data || []
  }

  // Buscar serviços de uma barbearia
  async getServicosByBarbearia(barbeariaId: string): Promise<Servico[]> {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('barbearia_id', barbeariaId)
      .eq('ativo', true)
      .order('nome')

    if (error) {
      console.error('Erro ao buscar serviços:', error)
      throw error
    }

    return data || []
  }

  // Buscar barbeiros de uma barbearia
  async getBarbeirosByBarbearia(barbeariaId: string): Promise<(Barbeiro & { usuario: Usuario })[]> {
    const { data, error } = await supabase
      .from('barbeiros')
      .select(`
        *,
        usuario:usuarios(*)
      `)
      .eq('barbearia_id', barbeariaId)
      .eq('ativo', true)

    if (error) {
      console.error('Erro ao buscar barbeiros:', error)
      throw error
    }

    return data || []
  }

  // Verificar horários disponíveis para um barbeiro em uma data
  async getHorariosDisponiveis(
    barbeiroId: string, 
    data: string,
    duracaoMinutos: number = 60
  ): Promise<string[]> {
    // Buscar agendamentos existentes para o barbeiro na data
    const { data: agendamentos, error } = await supabase
      .from('agendamentos')
      .select('data_agendamento, data_fim')
      .eq('barbeiro_id', barbeiroId)
      .gte('data_agendamento', `${data}T00:00:00`)
      .lt('data_agendamento', `${data}T23:59:59`)
      .in('status', ['agendado', 'confirmado', 'em_andamento'])

    if (error) {
      console.error('Erro ao buscar agendamentos:', error)
      throw error
    }

    // Gerar todos os horários possíveis (8h às 18h, intervalos de 30min)
    const todosHorarios: string[] = []
    for (let hora = 8; hora <= 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        if (hora === 18 && minuto > 0) break // Não incluir 18:30
        const horarioStr = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`
        todosHorarios.push(horarioStr)
      }
    }

    // Filtrar horários ocupados
    const horariosOcupados = new Set<string>()
    
    agendamentos?.forEach(agendamento => {
      const inicio = new Date(agendamento.data_agendamento)
      const fim = new Date(agendamento.data_fim)
      
      // Marcar todos os horários entre início e fim como ocupados
      let current = new Date(inicio)
      while (current < fim) {
        const horario = current.toTimeString().slice(0, 5)
        horariosOcupados.add(horario)
        current.setMinutes(current.getMinutes() + 30)
      }
    })

    // Verificar se cada horário tem espaço suficiente para o serviço
    const horariosDisponiveis = todosHorarios.filter(horario => {
      const [hora, minuto] = horario.split(':').map(Number)
      const inicioServico = new Date(`${data}T${horario}:00`)
      const fimServico = new Date(inicioServico.getTime() + duracaoMinutos * 60000)
      
      // Verificar se algum slot necessário está ocupado
      let current = new Date(inicioServico)
      while (current < fimServico) {
        const horarioCheck = current.toTimeString().slice(0, 5)
        if (horariosOcupados.has(horarioCheck)) {
          return false
        }
        current.setMinutes(current.getMinutes() + 30)
      }
      
      // Verificar se não ultrapassa o horário de funcionamento
      return fimServico.getHours() <= 18
    })

    return horariosDisponiveis
  }

  // Criar um novo agendamento
  async criarAgendamento(agendamentoData: AgendamentoData): Promise<Agendamento> {
    // Calcular duração total dos serviços
    const { data: servicos, error: servicosError } = await supabase
      .from('servicos')
      .select('duracao_minutos, preco')
      .in('id', agendamentoData.servicos)

    if (servicosError) {
      console.error('Erro ao buscar serviços:', servicosError)
      throw servicosError
    }

    const duracaoTotal = servicos?.reduce((total, servico) => total + servico.duracao_minutos, 0) || 60
    const valorTotal = servicos?.reduce((total, servico) => total + servico.preco, 0) || 0

    // Calcular data de fim
    const dataInicio = new Date(agendamentoData.data_agendamento)
    const dataFim = new Date(dataInicio.getTime() + duracaoTotal * 60000)

    // Criar agendamento
    const { data: agendamento, error: agendamentoError } = await supabase
      .from('agendamentos')
      .insert([
        {
          cliente_id: agendamentoData.cliente_id,
          barbeiro_id: agendamentoData.barbeiro_id,
          barbearia_id: agendamentoData.barbearia_id,
          data_agendamento: agendamentoData.data_agendamento,
          data_fim: dataFim.toISOString(),
          valor_total: valorTotal,
          observacoes: agendamentoData.observacoes,
          status: 'agendado',
          pagamento_status: 'pendente'
        }
      ])
      .select()
      .single()

    if (agendamentoError) {
      console.error('Erro ao criar agendamento:', agendamentoError)
      throw agendamentoError
    }

    // Criar registros de agendamento_servicos
    const agendamentoServicos = agendamentoData.servicos.map((servicoId, index) => ({
      agendamento_id: agendamento.id,
      servico_id: servicoId,
      preco: servicos?.[index]?.preco || 0
    }))

    const { error: servicosAgendamentoError } = await supabase
      .from('agendamento_servicos')
      .insert(agendamentoServicos)

    if (servicosAgendamentoError) {
      console.error('Erro ao criar agendamento_servicos:', servicosAgendamentoError)
      // Reverter agendamento se falhar
      await supabase.from('agendamentos').delete().eq('id', agendamento.id)
      throw servicosAgendamentoError
    }

    return agendamento
  }

  // Buscar agendamentos de um cliente
  async getAgendamentosByCliente(clienteId: string): Promise<AgendamentoCompleto[]> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        barbearia:barbearias(*),
        barbeiro:usuarios(*),
        cliente:usuarios(*),
        agendamento_servicos(
          *,
          servico:servicos(*)
        )
      `)
      .eq('cliente_id', clienteId)
      .order('data_agendamento', { ascending: false })

    if (error) {
      console.error('Erro ao buscar agendamentos:', error)
      throw error
    }

    return data || []
  }

  // Cancelar agendamento
  async cancelarAgendamento(agendamentoId: string): Promise<void> {
    const { error } = await supabase
      .from('agendamentos')
      .update({ 
        status: 'cancelado',
        pagamento_status: 'cancelado'
      })
      .eq('id', agendamentoId)

    if (error) {
      console.error('Erro ao cancelar agendamento:', error)
      throw error
    }
  }

  // Buscar próximos agendamentos de um cliente
  async getProximosAgendamentos(clienteId: string, limite: number = 5): Promise<AgendamentoCompleto[]> {
    const agora = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        barbearia:barbearias(*),
        barbeiro:usuarios(*),
        cliente:usuarios(*),
        agendamento_servicos(
          *,
          servico:servicos(*)
        )
      `)
      .eq('cliente_id', clienteId)
      .gte('data_agendamento', agora)
      .in('status', ['agendado', 'confirmado'])
      .order('data_agendamento', { ascending: true })
      .limit(limite)

    if (error) {
      console.error('Erro ao buscar próximos agendamentos:', error)
      throw error
    }

    return data || []
  }
}

export const agendamentoService = new AgendamentoService()