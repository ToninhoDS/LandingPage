import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euqumyijacufchvdxwyq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cXVteWlqYWN1ZmNodmR4d3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MjU0ODIsImV4cCI6MjA3NzQwMTQ4Mn0.S_dh5YmdLCs6MDr0kWHnJYrytBWbJQhr95uEodZjicw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para o banco de dados
export interface Usuario {
  id: string
  email: string
  nome: string
  telefone?: string
  whatsapp?: string
  role: 'cliente' | 'barbeiro' | 'admin'
  fcm_token?: string
  created_at: string
  updated_at: string
}

export interface Barbearia {
  id: string
  nome: string
  endereco?: string
  telefone?: string
  whatsapp_business?: string
  horarios_funcionamento?: any
  configuracoes?: any
  created_at: string
  updated_at: string
}

export interface Barbeiro {
  id: string
  usuario_id: string
  barbearia_id: string
  especialidades?: string[]
  google_calendar_id?: string
  ativo: boolean
  created_at: string
}

export interface Servico {
  id: string
  barbearia_id: string
  nome: string
  descricao?: string
  preco: number
  duracao_minutos: number
  categoria?: string
  ativo: boolean
  created_at: string
}

export interface Agendamento {
  id: string
  cliente_id: string
  barbeiro_id: string
  servico_id: string
  data_hora: string
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
  observacoes?: string
  google_event_id?: string
  created_at: string
  updated_at: string
}

export interface Pagamento {
  id: string
  agendamento_id: string
  valor: number
  metodo: 'dinheiro' | 'cartao' | 'pix' | 'online'
  status: 'pendente' | 'processando' | 'aprovado' | 'rejeitado'
  stripe_payment_id?: string
  created_at: string
}