-- Criação das tabelas principais do sistema de barbearia
-- Baseado na documentação do PRD e arquitetura

-- Tabela de usuários (perfis)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    avatar_url TEXT,
    tipo_usuario VARCHAR(20) DEFAULT 'cliente' CHECK (tipo_usuario IN ('cliente', 'barbeiro', 'admin')),
    data_nascimento DATE,
    preferencias JSONB DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de barbearias
CREATE TABLE IF NOT EXISTS barbearias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    endereco TEXT NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(255),
    horario_funcionamento JSONB DEFAULT '{}',
    configuracoes JSONB DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de barbeiros
CREATE TABLE IF NOT EXISTS barbeiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    barbearia_id UUID REFERENCES barbearias(id) ON DELETE CASCADE,
    especialidades TEXT[],
    biografia TEXT,
    horario_trabalho JSONB DEFAULT '{}',
    avaliacao_media DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barbearia_id UUID REFERENCES barbearias(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    duracao_minutos INTEGER NOT NULL,
    categoria VARCHAR(100),
    imagem_url TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    barbeiro_id UUID REFERENCES barbeiros(id) ON DELETE CASCADE,
    barbearia_id UUID REFERENCES barbearias(id) ON DELETE CASCADE,
    data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'nao_compareceu')),
    observacoes TEXT,
    valor_total DECIMAL(10,2) NOT NULL,
    forma_pagamento VARCHAR(50),
    pagamento_status VARCHAR(20) DEFAULT 'pendente' CHECK (pagamento_status IN ('pendente', 'pago', 'cancelado', 'reembolsado')),
    google_calendar_event_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do agendamento (serviços selecionados)
CREATE TABLE IF NOT EXISTS agendamento_servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agendamento_id UUID REFERENCES agendamentos(id) ON DELETE CASCADE,
    servico_id UUID REFERENCES servicos(id) ON DELETE CASCADE,
    preco DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agendamento_id UUID REFERENCES agendamentos(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255),
    valor DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'sucesso', 'falhou', 'cancelado', 'reembolsado')),
    metodo_pagamento VARCHAR(50),
    data_pagamento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agendamento_id UUID REFERENCES agendamentos(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    barbeiro_id UUID REFERENCES barbeiros(id) ON DELETE CASCADE,
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'info' CHECK (tipo IN ('info', 'lembrete', 'promocao', 'confirmacao', 'cancelamento')),
    lida BOOLEAN DEFAULT false,
    data_envio TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS configuracoes_sistema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave VARCHAR(255) UNIQUE NOT NULL,
    valor JSONB NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_barbeiros_usuario ON barbeiros(usuario_id);
CREATE INDEX IF NOT EXISTS idx_barbeiros_barbearia ON barbeiros(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro ON agendamentos(barbeiro_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_agendamento);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barbearias_updated_at BEFORE UPDATE ON barbearias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barbeiros_updated_at BEFORE UPDATE ON barbeiros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON pagamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracoes_sistema_updated_at BEFORE UPDATE ON configuracoes_sistema FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security) em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbearias ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamento_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_sistema ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas
-- Usuários podem ver e editar seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados" ON usuarios
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados" ON usuarios
    FOR UPDATE USING (auth.uid() = id);

-- Todos podem ver barbearias ativas
CREATE POLICY "Todos podem ver barbearias ativas" ON barbearias
    FOR SELECT USING (ativo = true);

-- Todos podem ver barbeiros ativos
CREATE POLICY "Todos podem ver barbeiros ativos" ON barbeiros
    FOR SELECT USING (ativo = true);

-- Todos podem ver serviços ativos
CREATE POLICY "Todos podem ver serviços ativos" ON servicos
    FOR SELECT USING (ativo = true);

-- Clientes podem ver seus próprios agendamentos
CREATE POLICY "Clientes podem ver seus agendamentos" ON agendamentos
    FOR SELECT USING (auth.uid() = cliente_id);

-- Clientes podem criar agendamentos
CREATE POLICY "Clientes podem criar agendamentos" ON agendamentos
    FOR INSERT WITH CHECK (auth.uid() = cliente_id);

-- Clientes podem atualizar seus agendamentos (cancelar)
CREATE POLICY "Clientes podem atualizar seus agendamentos" ON agendamentos
    FOR UPDATE USING (auth.uid() = cliente_id);

-- Clientes podem ver serviços de seus agendamentos
CREATE POLICY "Clientes podem ver serviços de seus agendamentos" ON agendamento_servicos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agendamentos 
            WHERE agendamentos.id = agendamento_servicos.agendamento_id 
            AND agendamentos.cliente_id = auth.uid()
        )
    );

-- Clientes podem ver seus pagamentos
CREATE POLICY "Clientes podem ver seus pagamentos" ON pagamentos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agendamentos 
            WHERE agendamentos.id = pagamentos.agendamento_id 
            AND agendamentos.cliente_id = auth.uid()
        )
    );

-- Clientes podem ver e criar suas avaliações
CREATE POLICY "Clientes podem ver suas avaliações" ON avaliacoes
    FOR SELECT USING (auth.uid() = cliente_id);

CREATE POLICY "Clientes podem criar avaliações" ON avaliacoes
    FOR INSERT WITH CHECK (auth.uid() = cliente_id);

-- Usuários podem ver suas notificações
CREATE POLICY "Usuários podem ver suas notificações" ON notificacoes
    FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar suas notificações" ON notificacoes
    FOR UPDATE USING (auth.uid() = usuario_id);