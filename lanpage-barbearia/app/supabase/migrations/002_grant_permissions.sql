-- Conceder permissões para as roles anon e authenticated

-- Permissões para role anon (usuários não logados)
-- Podem ver barbearias, barbeiros e serviços ativos
GRANT SELECT ON barbearias TO anon;
GRANT SELECT ON barbeiros TO anon;
GRANT SELECT ON servicos TO anon;

-- Permissões para role authenticated (usuários logados)
-- Acesso completo às suas próprias informações e dados relacionados
GRANT ALL PRIVILEGES ON usuarios TO authenticated;
GRANT SELECT ON barbearias TO authenticated;
GRANT SELECT ON barbeiros TO authenticated;
GRANT SELECT ON servicos TO authenticated;
GRANT ALL PRIVILEGES ON agendamentos TO authenticated;
GRANT ALL PRIVILEGES ON agendamento_servicos TO authenticated;
GRANT ALL PRIVILEGES ON pagamentos TO authenticated;
GRANT ALL PRIVILEGES ON avaliacoes TO authenticated;
GRANT ALL PRIVILEGES ON notificacoes TO authenticated;
GRANT SELECT ON configuracoes_sistema TO authenticated;

-- Permissões para sequences (necessário para inserções)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;