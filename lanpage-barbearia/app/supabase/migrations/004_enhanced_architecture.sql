-- Migração para estrutura aprimorada seguindo arquitetura técnica reformulada

-- Adicionar campos faltantes na tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS endereco TEXT;

-- Adicionar campos faltantes na tabela barbearias
ALTER TABLE barbearias ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE barbearias ADD COLUMN IF NOT EXISTS plano VARCHAR(20) DEFAULT 'basico';
ALTER TABLE barbearias ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES usuarios(id);

-- Adicionar campos faltantes na tabela barbeiros
ALTER TABLE barbeiros ADD COLUMN IF NOT EXISTS preco_base DECIMAL(10,2);
ALTER TABLE barbeiros ADD COLUMN IF NOT EXISTS comissao_percentual DECIMAL(5,2) DEFAULT 50.00;

-- Criar tabela de produtos (para venda)
CREATE TABLE IF NOT EXISTS produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barbearia_id UUID REFERENCES barbearias(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INTEGER DEFAULT 0,
    categoria VARCHAR(50),
    imagem_url TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de integrações
CREATE TABLE IF NOT EXISTS integracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barbearia_id UUID REFERENCES barbearias(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'whatsapp', 'google_calendar', 'n8n', 'openai'
    configuracao JSONB NOT NULL, -- credenciais e configs específicas
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de templates WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barbearia_id UUID REFERENCES barbearias(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    template_id VARCHAR(255) NOT NULL, -- ID do template no WhatsApp
    categoria VARCHAR(50), -- 'confirmacao', 'lembrete', 'promocao'
    conteudo JSONB NOT NULL, -- estrutura do template
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de logs de integração
CREATE TABLE IF NOT EXISTS logs_integracao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barbearia_id UUID REFERENCES barbearias(id) ON DELETE CASCADE,
    tipo_integracao VARCHAR(50) NOT NULL,
    acao VARCHAR(100) NOT NULL,
    dados_entrada JSONB,
    dados_saida JSONB,
    status VARCHAR(20) DEFAULT 'sucesso' CHECK (status IN ('sucesso', 'erro', 'pendente')),
    erro_mensagem TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de disponibilidade dos barbeiros
CREATE TABLE IF NOT EXISTS disponibilidade_barbeiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barbeiro_id UUID REFERENCES barbeiros(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    disponivel BOOLEAN DEFAULT true,
    motivo VARCHAR(255), -- 'folga', 'ferias', 'doenca', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(barbeiro_id, data, hora_inicio)
);

-- Criar tabela de campanhas de marketing
CREATE TABLE IF NOT EXISTS campanhas_marketing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barbearia_id UUID REFERENCES barbearias(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'whatsapp', 'email', 'push'
    publico_alvo JSONB, -- critérios de segmentação
    conteudo JSONB NOT NULL,
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_fim TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'agendada', 'ativa', 'pausada', 'finalizada')),
    metricas JSONB DEFAULT '{}', -- estatísticas da campanha
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de feedback do sistema
CREATE TABLE IF NOT EXISTS feedback_sistema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'bug', 'sugestao', 'elogio', 'reclamacao'
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')),
    status VARCHAR(20) DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_analise', 'resolvido', 'fechado')),
    resposta TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar índices para as novas tabelas
CREATE INDEX IF NOT EXISTS idx_produtos_barbearia ON produtos(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_integracoes_barbearia ON integracoes(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_integracoes_tipo ON integracoes(tipo);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_barbearia ON whatsapp_templates(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_logs_integracao_barbearia ON logs_integracao(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_logs_integracao_tipo ON logs_integracao(tipo_integracao);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_barbeiro_data ON disponibilidade_barbeiros(barbeiro_id, data);
CREATE INDEX IF NOT EXISTS idx_campanhas_barbearia ON campanhas_marketing(barbearia_id);
CREATE INDEX IF NOT EXISTS idx_feedback_usuario ON feedback_sistema(usuario_id);

-- Adicionar triggers para as novas tabelas
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integracoes_updated_at BEFORE UPDATE ON integracoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campanhas_marketing_updated_at BEFORE UPDATE ON campanhas_marketing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_sistema_updated_at BEFORE UPDATE ON feedback_sistema FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS nas novas tabelas
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE integracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_integracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidade_barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanhas_marketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_sistema ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para as novas tabelas
-- Produtos podem ser vistos por todos
CREATE POLICY "Todos podem ver produtos ativos" ON produtos
    FOR SELECT USING (ativo = true);

-- Integrações só podem ser vistas pelos donos da barbearia
CREATE POLICY "Donos podem ver integrações da barbearia" ON integracoes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM barbearias b 
            WHERE b.id = integracoes.barbearia_id 
            AND b.owner_id = auth.uid()
        )
    );

-- Templates WhatsApp só podem ser vistos pelos donos da barbearia
CREATE POLICY "Donos podem ver templates WhatsApp" ON whatsapp_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM barbearias b 
            WHERE b.id = whatsapp_templates.barbearia_id 
            AND b.owner_id = auth.uid()
        )
    );

-- Logs só podem ser vistos pelos donos da barbearia
CREATE POLICY "Donos podem ver logs de integração" ON logs_integracao
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM barbearias b 
            WHERE b.id = logs_integracao.barbearia_id 
            AND b.owner_id = auth.uid()
        )
    );

-- Disponibilidade pode ser vista por todos, mas só editada pelo barbeiro
CREATE POLICY "Todos podem ver disponibilidade" ON disponibilidade_barbeiros
    FOR SELECT USING (true);

CREATE POLICY "Barbeiros podem editar sua disponibilidade" ON disponibilidade_barbeiros
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM barbeiros b 
            WHERE b.id = disponibilidade_barbeiros.barbeiro_id 
            AND b.usuario_id = auth.uid()
        )
    );

-- Campanhas só podem ser vistas pelos donos da barbearia
CREATE POLICY "Donos podem gerenciar campanhas" ON campanhas_marketing
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM barbearias b 
            WHERE b.id = campanhas_marketing.barbearia_id 
            AND b.owner_id = auth.uid()
        )
    );

-- Feedback pode ser visto pelo próprio usuário
CREATE POLICY "Usuários podem ver seu próprio feedback" ON feedback_sistema
    FOR ALL USING (auth.uid() = usuario_id);

-- Conceder permissões para as novas tabelas
GRANT SELECT ON produtos TO anon;
GRANT SELECT ON produtos TO authenticated;
GRANT ALL PRIVILEGES ON integracoes TO authenticated;
GRANT ALL PRIVILEGES ON whatsapp_templates TO authenticated;
GRANT SELECT ON logs_integracao TO authenticated;
GRANT ALL PRIVILEGES ON disponibilidade_barbeiros TO authenticated;
GRANT ALL PRIVILEGES ON campanhas_marketing TO authenticated;
GRANT ALL PRIVILEGES ON feedback_sistema TO authenticated;