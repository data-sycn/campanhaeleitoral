
-- Candidato
INSERT INTO public.candidates (id, name, party, position)
VALUES ('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'TITO', 'PT', 'Deputado Federal')
ON CONFLICT (id) DO NOTHING;

-- Campanha
INSERT INTO public.campanhas (id, nome, partido, cargo, municipio, uf, numero_candidato, cor_primaria)
VALUES ('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'TITO DO PT - Barreiras', 'PT', 'Deputado Federal', 'Barreiras', 'BA', '1313', '#DC2626')
ON CONFLICT (id) DO NOTHING;

-- Apoiadores
INSERT INTO public.supporters (campanha_id, nome, telefone, email, endereco, bairro, cidade, estado, cep, latitude, longitude) VALUES
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Maria Santos', '(77)99901-0001', 'maria@email.com', 'Rua do Açude 100', 'Centro', 'Barreiras', 'BA', '47800-000', -12.1528, -44.9940),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'José Oliveira', '(77)99901-0002', 'jose@email.com', 'Av. Clériston Andrade 200', 'Barreirinhas', 'Barreiras', 'BA', '47800-001', -12.1490, -44.9980),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Ana Lima', '(77)99901-0003', 'ana@email.com', 'Rua da Matriz 50', 'Centro', 'Barreiras', 'BA', '47800-002', -12.1535, -44.9925),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Carlos Souza', '(77)99901-0004', 'carlos@email.com', 'Rua Prof. Edgard Santos 300', 'Morada da Lua', 'Barreiras', 'BA', '47800-003', -12.1600, -45.0010),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Francisca Alves', '(77)99901-0005', 'francisca@email.com', 'Av. Benedita Silveira 400', 'São Pedro', 'Barreiras', 'BA', '47800-004', -12.1450, -44.9900),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Paulo Ribeiro', '(77)99901-0006', NULL, 'Rua do Mercado 80', 'Centro', 'Barreiras', 'BA', '47800-005', -12.1540, -44.9935),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Luiza Ferreira', '(77)99901-0007', NULL, 'Rua Barão do Rio Branco 150', 'Vila Rica', 'Barreiras', 'BA', '47800-006', -12.1580, -44.9870),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Roberto Nascimento', '(77)99901-0008', NULL, 'Av. Ahylon Macedo 500', 'Renato Gonçalves', 'Barreiras', 'BA', '47800-007', -12.1470, -45.0050),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Teresa Costa', '(77)99901-0009', NULL, 'Rua 7 de Setembro 220', 'Boa Sorte', 'Barreiras', 'BA', '47800-008', -12.1620, -44.9960),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Marcos Pereira', '(77)99901-0010', NULL, 'Rua Castro Alves 90', 'Centro', 'Barreiras', 'BA', '47800-009', -12.1525, -44.9950),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Lúcia Barbosa', '(77)99901-0011', NULL, 'Rua das Mangueiras 110', 'Jardim Ouro Branco', 'Barreiras', 'BA', '47800-010', -12.1650, -44.9880),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Fernando Gomes', '(77)99901-0012', NULL, 'Av. Brasil 600', 'Vila Brasil', 'Barreiras', 'BA', '47800-011', -12.1400, -45.0020),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Silvana Rocha', '(77)99901-0013', NULL, 'Rua Pará 75', 'Sandra Regina', 'Barreiras', 'BA', '47800-012', -12.1560, -45.0080),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'João Batista', '(77)99901-0014', NULL, 'Rua Rio Grande 130', 'Morada da Lua', 'Barreiras', 'BA', '47800-013', -12.1610, -45.0005),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Cláudia Mendes', '(77)99901-0015', NULL, 'Av. Hermínio 350', 'Barreirinhas', 'Barreiras', 'BA', '47800-014', -12.1480, -44.9970),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Antônio Luz', '(77)99901-0016', NULL, 'Rua Principal 50', 'Centro', 'Luís Eduardo Magalhães', 'BA', '47850-000', -12.0940, -45.7870),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Raquel Dias', '(77)99901-0017', NULL, 'Av. Santos Dumont 200', 'Mimoso', 'Luís Eduardo Magalhães', 'BA', '47850-001', -12.0960, -45.7900),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Osvaldo Nunes', '(77)99901-0018', NULL, 'Rua JK 180', 'Centro', 'Luís Eduardo Magalhães', 'BA', '47850-002', -12.0920, -45.7850),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Mariana Cardoso', '(77)99901-0019', NULL, 'Rua do Comércio 90', 'Centro', 'São Desidério', 'BA', '47820-000', -12.3630, -44.9730),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Pedro Henrique', '(77)99901-0020', NULL, 'Av. Rio de Janeiro 250', 'Nova Barreiras', 'Barreiras', 'BA', '47800-015', -12.1380, -44.9910);

-- Ruas (valores corretos do enum)
INSERT INTO public.streets (campanha_id, nome, bairro, cidade, estado, status_cobertura) VALUES
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua do Açude', 'Centro', 'Barreiras', 'BA', 'concluida'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Av. Clériston Andrade', 'Barreirinhas', 'Barreiras', 'BA', 'concluida'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua da Matriz', 'Centro', 'Barreiras', 'BA', 'em_visitacao'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua Prof. Edgard Santos', 'Morada da Lua', 'Barreiras', 'BA', 'em_visitacao'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Av. Benedita Silveira', 'São Pedro', 'Barreiras', 'BA', 'nao_visitada'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua do Mercado', 'Centro', 'Barreiras', 'BA', 'concluida'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua Barão do Rio Branco', 'Vila Rica', 'Barreiras', 'BA', 'nao_visitada'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Av. Ahylon Macedo', 'Renato Gonçalves', 'Barreiras', 'BA', 'em_visitacao'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua 7 de Setembro', 'Boa Sorte', 'Barreiras', 'BA', 'concluida'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua Castro Alves', 'Centro', 'Barreiras', 'BA', 'nao_visitada'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua das Mangueiras', 'Jardim Ouro Branco', 'Barreiras', 'BA', 'necessita_retorno'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Av. Brasil', 'Vila Brasil', 'Barreiras', 'BA', 'nao_visitada'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua Principal', 'Centro', 'Luís Eduardo Magalhães', 'BA', 'concluida'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Av. Santos Dumont', 'Mimoso', 'Luís Eduardo Magalhães', 'BA', 'em_visitacao'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Rua do Comércio', 'Centro', 'São Desidério', 'BA', 'nao_visitada');

-- Orçamento
INSERT INTO public.budgets (id, candidate_id, campanha_id, year, total_planned, active, notes)
VALUES ('d3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 2026, 350000, true, 'Orçamento Deputado Federal - Oeste da Bahia')
ON CONFLICT (id) DO NOTHING;

-- Alocações
INSERT INTO public.budget_allocations (budget_id, category, planned_amount) VALUES
('d3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'publicidade', 120000),
('d3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'transporte', 60000),
('d3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'alimentacao', 35000),
('d3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'material', 45000),
('d3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'eventos', 40000),
('d3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'pessoal', 30000),
('d3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'outros', 20000);

-- Despesas
INSERT INTO public.expenses (candidate_id, campanha_id, description, amount, category, payment_method, date) VALUES
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Impressão santinhos 50mil', 8500, 'publicidade', 'pix', '2026-01-15'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Bandeiras e faixas', 6200, 'publicidade', 'transferencia', '2026-01-20'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Impulsionamento redes jan', 5000, 'publicidade', 'pix', '2026-01-25'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Aluguel carro som', 4500, 'transporte', 'dinheiro', '2026-01-18'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Combustível veículos', 3800, 'transporte', 'pix', '2026-01-30'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Manutenção veículos', 2200, 'transporte', 'pix', '2026-02-05'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Café comício Barreiras', 1800, 'alimentacao', 'dinheiro', '2026-02-01'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Almoço equipe LEM', 2500, 'alimentacao', 'pix', '2026-02-08'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Camisetas 1000un', 7500, 'material', 'transferencia', '2026-01-10'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Adesivos e bonés', 3200, 'material', 'pix', '2026-01-22'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Comício Praça Castro Alves', 5500, 'eventos', 'transferencia', '2026-02-10'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Carreata Oeste Baiano', 4000, 'eventos', 'dinheiro', '2026-02-15'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Salário coordenador', 6000, 'pessoal', 'transferencia', '2026-02-01'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Diárias cabos eleitorais', 4800, 'pessoal', 'dinheiro', '2026-02-10'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Impulsionamento fev', 7000, 'publicidade', 'pix', '2026-02-12'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Jingle e audiovisual', 12000, 'publicidade', 'transferencia', '2026-02-18'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Aluguel comitê LEM', 3000, 'outros', 'transferencia', '2026-02-01'),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Material escritório', 1500, 'outros', 'pix', '2026-02-05');

-- Material
INSERT INTO public.material_inventory (campanha_id, tipo, descricao, cidade, quantidade_enviada, quantidade_reportada) VALUES
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Santinhos', 'Santinhos 10x15cm', 'Barreiras', 30000, 22000),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Santinhos', 'Santinhos 10x15cm', 'Luís Eduardo Magalhães', 15000, 8000),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Bandeiras', 'Bandeiras 70x100', 'Barreiras', 500, 350),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Camisetas', 'Camisetas vermelhas', 'Barreiras', 600, 480),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Adesivos', 'Adesivos carro', 'Barreiras', 2000, 1200),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Bonés', 'Bonés vermelhos', 'São Desidério', 400, 150);

-- Reports
INSERT INTO public.reports (campanha_id, title, description, report_type) VALUES
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Relatório Mensal Janeiro', 'Resumo janeiro 2026', 'mensal'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Relatório Mensal Fevereiro', 'Resumo fevereiro 2026', 'mensal'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Mapa Apoiadores Oeste Baiano', 'Distribuição geográfica', 'geografico'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Prestação de Contas', 'Prestação parcial TSE', 'financeiro'),
('c2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Análise ROI', 'Custo por voto', 'roi');

-- Votes
INSERT INTO public.votes_raw (candidate_id, zone, section, votes) VALUES
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0045', '0101', 320),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0045', '0102', 285),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0045', '0103', 410),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0045', '0201', 195),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0045', '0202', 260),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0046', '0101', 180),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0046', '0102', 220),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0046', '0201', 305),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0046', '0202', 275),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0047', '0101', 150),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0047', '0102', 190),
('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '0047', '0201', 135);

INSERT INTO public.votes_agg (candidate_id, total_votes)
VALUES ('b1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 2925);
