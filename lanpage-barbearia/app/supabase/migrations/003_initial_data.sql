-- Dados iniciais para o sistema de barbearia

-- Inserir barbearia principal
INSERT INTO barbearias (id, nome, descricao, endereco, telefone, email, horario_funcionamento, configuracoes) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Barbearia Premium',
    'A melhor barbearia da cidade com serviços de alta qualidade e profissionais experientes.',
    'Rua das Flores, 123 - Centro - São Paulo/SP',
    '(11) 99999-9999',
    'contato@barbeariapremium.com',
    '{
        "segunda": {"abertura": "09:00", "fechamento": "18:00"},
        "terca": {"abertura": "09:00", "fechamento": "18:00"},
        "quarta": {"abertura": "09:00", "fechamento": "18:00"},
        "quinta": {"abertura": "09:00", "fechamento": "18:00"},
        "sexta": {"abertura": "09:00", "fechamento": "19:00"},
        "sabado": {"abertura": "08:00", "fechamento": "17:00"},
        "domingo": {"fechado": true}
    }',
    '{
        "whatsapp_business_id": "",
        "google_calendar_id": "",
        "stripe_account_id": "",
        "notificacoes_push": true,
        "agendamento_antecedencia_minima": 60,
        "cancelamento_antecedencia_minima": 120
    }'
);

-- Inserir serviços
INSERT INTO servicos (id, barbearia_id, nome, descricao, preco, duracao_minutos, categoria) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Corte Masculino',
    'Corte de cabelo masculino tradicional com acabamento profissional',
    35.00,
    45,
    'Cabelo'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'Barba Completa',
    'Aparar e modelar a barba com navalha e produtos premium',
    25.00,
    30,
    'Barba'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    'Corte + Barba',
    'Pacote completo com corte de cabelo e barba',
    55.00,
    75,
    'Combo'
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440000',
    'Sobrancelha Masculina',
    'Design e limpeza de sobrancelha masculina',
    15.00,
    20,
    'Estética'
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440000',
    'Relaxamento Capilar',
    'Tratamento de relaxamento e hidratação capilar',
    80.00,
    120,
    'Tratamento'
);

-- Inserir usuários barbeiros (sem senha, serão criados via Supabase Auth)
INSERT INTO usuarios (id, email, nome, telefone, tipo_usuario) VALUES
(
    '550e8400-e29b-41d4-a716-446655440010',
    'joao@barbeariapremium.com',
    'João Silva',
    '(11) 98888-8888',
    'barbeiro'
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    'carlos@barbeariapremium.com',
    'Carlos Santos',
    '(11) 97777-7777',
    'barbeiro'
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    'admin@barbeariapremium.com',
    'Administrador',
    '(11) 96666-6666',
    'admin'
);

-- Inserir barbeiros
INSERT INTO barbeiros (id, usuario_id, barbearia_id, especialidades, biografia, horario_trabalho, avaliacao_media, total_avaliacoes) VALUES
(
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440000',
    ARRAY['Corte Masculino', 'Barba', 'Sobrancelha'],
    'Barbeiro com mais de 10 anos de experiência, especialista em cortes clássicos e modernos.',
    '{
        "segunda": {"inicio": "09:00", "fim": "18:00"},
        "terca": {"inicio": "09:00", "fim": "18:00"},
        "quarta": {"inicio": "09:00", "fim": "18:00"},
        "quinta": {"inicio": "09:00", "fim": "18:00"},
        "sexta": {"inicio": "09:00", "fim": "19:00"},
        "sabado": {"inicio": "08:00", "fim": "17:00"}
    }',
    4.8,
    127
),
(
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440000',
    ARRAY['Corte Masculino', 'Relaxamento', 'Tratamentos'],
    'Especialista em tratamentos capilares e cortes modernos, sempre atualizado com as últimas tendências.',
    '{
        "terca": {"inicio": "10:00", "fim": "19:00"},
        "quarta": {"inicio": "10:00", "fim": "19:00"},
        "quinta": {"inicio": "10:00", "fim": "19:00"},
        "sexta": {"inicio": "10:00", "fim": "20:00"},
        "sabado": {"inicio": "09:00", "fim": "18:00"},
        "domingo": {"inicio": "09:00", "fim": "15:00"}
    }',
    4.9,
    89
);

-- Inserir configurações do sistema
INSERT INTO configuracoes_sistema (chave, valor, descricao) VALUES
('whatsapp_config', '{
    "phone_number_id": "",
    "access_token": "",
    "webhook_verify_token": "",
    "business_account_id": ""
}', 'Configurações da integração WhatsApp Business API'),

('google_calendar_config', '{
    "api_key": "",
    "client_id": "",
    "calendar_id": ""
}', 'Configurações da integração Google Calendar'),

('stripe_config', '{
    "publishable_key": "",
    "secret_key": "",
    "webhook_secret": ""
}', 'Configurações do gateway de pagamento Stripe'),

('notificacoes_config', '{
    "push_enabled": true,
    "email_enabled": true,
    "whatsapp_enabled": true,
    "lembrete_antecedencia_horas": 24
}', 'Configurações de notificações do sistema'),

('app_config', '{
    "nome_app": "Barbearia Premium",
    "versao": "1.0.0",
    "manutencao": false,
    "agendamento_antecedencia_minima": 60,
    "cancelamento_antecedencia_minima": 120
}', 'Configurações gerais do aplicativo');