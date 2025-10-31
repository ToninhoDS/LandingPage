import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the database
export interface User {
  id: string
  email: string
  nome: string
  telefone?: string
  created_at: string
  updated_at: string
}

export interface Barbeiro {
  id: string
  nome: string
  especialidades: string[]
  avaliacao: number
  foto_url?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Servico {
  id: string
  nome: string
  descricao?: string
  preco: number
  duracao: number
  categoria: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Agendamento {
  id: string
  user_id: string
  barbeiro_id: string
  servicos: string[]
  data_agendamento: string
  horario: string
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
  observacoes?: string
  valor_total: number
  created_at: string
  updated_at: string
  // Relations
  user?: User
  barbeiro?: Barbeiro
}

export interface Avaliacao {
  id: string
  user_id: string
  barbeiro_id: string
  agendamento_id: string
  nota: number
  comentario?: string
  created_at: string
  // Relations
  user?: User
  barbeiro?: Barbeiro
}

// Admin-specific functions
export const adminQueries = {
  // Dashboard stats
  async getDashboardStats() {
    const [
      { count: totalUsers },
      { count: totalAgendamentos },
      { count: agendamentosHoje },
      { data: faturamentoMes }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('agendamentos').select('*', { count: 'exact', head: true }),
      supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('data_agendamento', new Date().toISOString().split('T')[0]),
      supabase
        .from('agendamentos')
        .select('valor_total')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .eq('status', 'concluido')
    ])

    const faturamentoTotal = faturamentoMes?.reduce((sum, item) => sum + item.valor_total, 0) || 0

    return {
      totalUsers: totalUsers || 0,
      totalAgendamentos: totalAgendamentos || 0,
      agendamentosHoje: agendamentosHoje || 0,
      faturamentoMes: faturamentoTotal
    }
  },

  // Get all users with pagination
  async getUsers(page = 1, limit = 10) {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  },

  // Get all appointments with relations
  async getAgendamentos(page = 1, limit = 10, status?: string) {
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('agendamentos')
      .select(`
        *,
        user:users(nome, email, telefone),
        barbeiro:barbeiros(nome, foto_url)
      `, { count: 'exact' })
      .order('data_agendamento', { ascending: false })
      .order('horario', { ascending: false })
      .range(from, to)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  },

  // Get revenue analytics
  async getRevenueAnalytics(days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('agendamentos')
      .select('data_agendamento, valor_total')
      .eq('status', 'concluido')
      .gte('data_agendamento', startDate.toISOString().split('T')[0])
      .order('data_agendamento')

    if (error) throw error

    // Group by date
    const revenueByDate = (data || []).reduce((acc, item) => {
      const date = item.data_agendamento
      acc[date] = (acc[date] || 0) + item.valor_total
      return acc
    }, {} as Record<string, number>)

    return Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue
    }))
  },

  // Get barbeiros performance
  async getBarbeirosPerformance() {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        barbeiro_id,
        valor_total,
        barbeiro:barbeiros(nome)
      `)
      .eq('status', 'concluido')

    if (error) throw error

    // Group by barbeiro
    const performance = (data || []).reduce((acc, item) => {
      const barbeiroId = item.barbeiro_id
      const barbeiroNome = item.barbeiro?.nome || 'Desconhecido'
      
      if (!acc[barbeiroId]) {
        acc[barbeiroId] = {
          nome: barbeiroNome,
          totalAgendamentos: 0,
          totalFaturamento: 0
        }
      }
      
      acc[barbeiroId].totalAgendamentos++
      acc[barbeiroId].totalFaturamento += item.valor_total
      
      return acc
    }, {} as Record<string, any>)

    return Object.values(performance)
  }
}