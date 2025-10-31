import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interfaces para as tabelas do banco
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  whatsapp?: string;
  endereco?: string;
  tipo: 'cliente' | 'barbeiro' | 'admin';
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Barbearia {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email?: string;
  logo_url?: string;
  plano: 'basico' | 'premium' | 'enterprise';
  owner_id?: string;
  horario_funcionamento: any;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Barbeiro {
  id: string
  usuario_id: string
  barbearia_id: string
  especialidades?: string[]
  biografia?: string
  horario_trabalho?: any
  avaliacao_media: number
  total_avaliacoes: number
  preco_base?: number
  comissao_percentual: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Servico {
  id: string
  barbearia_id: string
  nome: string
  descricao?: string
  preco: number
  duracao_minutos: number
  categoria?: string
  imagem_url?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Agendamento {
  id: string
  cliente_id: string
  barbeiro_id: string
  barbearia_id: string
  data_agendamento: string
  data_fim: string
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu'
  observacoes?: string
  valor_total: number
  forma_pagamento?: string
  pagamento_status: 'pendente' | 'pago' | 'cancelado' | 'reembolsado'
  google_calendar_event_id?: string
  created_at: string
  updated_at: string
}

export interface AgendamentoServico {
  id: string
  agendamento_id: string
  servico_id: string
  preco: number
  created_at: string
}

export interface Pagamento {
  id: string
  agendamento_id: string
  stripe_payment_intent_id?: string
  valor: number
  status: 'pendente' | 'processando' | 'sucesso' | 'falhou' | 'cancelado' | 'reembolsado'
  metodo_pagamento?: string
  data_pagamento?: string
  created_at: string
  updated_at: string
}

export interface Avaliacao {
  id: string
  agendamento_id: string
  cliente_id: string
  barbeiro_id: string
  nota: number
  comentario?: string
  created_at: string
}

export interface Notificacao {
  id: string;
  usuario_id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'aviso' | 'erro';
  lida: boolean;
  created_at: string;
}

export interface Produto {
  id: string;
  barbearia_id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoria?: string;
  imagem_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Integracao {
  id: string;
  barbearia_id: string;
  tipo: 'whatsapp' | 'google_calendar' | 'n8n' | 'openai';
  configuracao: any;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppTemplate {
  id: string;
  barbearia_id: string;
  nome: string;
  template_id: string;
  categoria?: string;
  conteudo: any;
  ativo: boolean;
  created_at: string;
}

export interface LogIntegracao {
  id: string;
  barbearia_id: string;
  tipo_integracao: string;
  acao: string;
  dados_entrada?: any;
  dados_saida?: any;
  status: 'sucesso' | 'erro' | 'pendente';
  erro_mensagem?: string;
  created_at: string;
}

export interface DisponibilidadeBarbeiro {
  id: string;
  barbeiro_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  disponivel: boolean;
  motivo?: string;
  created_at: string;
}

export interface CampanhaMarketing {
  id: string;
  barbearia_id: string;
  nome: string;
  tipo: 'whatsapp' | 'email' | 'push';
  publico_alvo?: any;
  conteudo: any;
  data_inicio?: string;
  data_fim?: string;
  status: 'rascunho' | 'agendada' | 'ativa' | 'pausada' | 'finalizada';
  metricas: any;
  created_at: string;
  updated_at: string;
}

export interface FeedbackSistema {
  id: string;
  usuario_id: string;
  tipo: 'bug' | 'sugestao' | 'elogio' | 'reclamacao';
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'aberto' | 'em_analise' | 'resolvido' | 'fechado';
  resposta?: string;
  created_at: string;
  updated_at: string;
}