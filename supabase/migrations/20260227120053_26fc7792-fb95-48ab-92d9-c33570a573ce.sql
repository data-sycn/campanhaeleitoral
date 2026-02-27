-- PARTE 1: Supporters, Streets, Budget Allocations, Expenses, Material, Reports, Votes, Messages

INSERT INTO supporters (campanha_id, nome, email, telefone, cpf, endereco, bairro, cidade, estado, cep, latitude, longitude) VALUES
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Maria da Conceição Silva','maria.silva@email.com','81999001001','111.222.333-01','Rua da Aurora, 100','Boa Vista','Recife','PE','50050-000',-8.0578,-34.8770),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','José Carlos Santos','jose.santos@email.com','81999001002','111.222.333-02','Av. Conde da Boa Vista, 200','Boa Vista','Recife','PE','50060-000',-8.0560,-34.8750),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Ana Paula Ferreira','ana.ferreira@email.com','81999001003','111.222.333-03','Rua do Hospício, 50','Boa Vista','Recife','PE','50060-080',-8.0590,-34.8780),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Francisco Barbosa','francisco.b@email.com','81999001004','111.222.333-04','Rua Sete de Setembro, 300','Santo Amaro','Recife','PE','50100-000',-8.0520,-34.8810),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Luciana Oliveira','luciana.o@email.com','81999001005','111.222.333-05','Av. Dantas Barreto, 400','São José','Recife','PE','50020-000',-8.0630,-34.8740),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Roberto Lima','roberto.lima@email.com','81999001006','111.222.333-06','Rua do Imperador, 150','São José','Recife','PE','50010-000',-8.0610,-34.8760),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Fernanda Costa','fernanda.c@email.com','81999001007','111.222.333-07','Rua da Palma, 80','Santo Antônio','Recife','PE','50010-060',-8.0620,-34.8800),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Carlos Eduardo Ramos','carlos.ramos@email.com','81999001008','111.222.333-08','Av. Caxangá, 1000','Iputinga','Recife','PE','50731-000',-8.0370,-34.9300),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Sandra Melo','sandra.melo@email.com','81999001009','111.222.333-09','Rua Real da Torre, 500','Madalena','Recife','PE','50610-000',-8.0410,-34.9100),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Pedro Henrique Souza','pedro.souza@email.com','81999001010','111.222.333-10','Av. Beira Rio, 200','Madalena','Recife','PE','50610-090',-8.0430,-34.9120),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Patrícia Alves','patricia.a@email.com','81999001011','111.222.333-11','Rua Benfica, 300','Madalena','Recife','PE','50720-000',-8.0400,-34.9080),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Marcos Vinícius','marcos.v@email.com','81999001012','111.222.333-12','Av. Norte, 1500','Casa Amarela','Recife','PE','52051-000',-8.0180,-34.8950),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Adriana Bezerra','adriana.b@email.com','81999001013','111.222.333-13','Rua José Bonifácio, 200','Casa Amarela','Recife','PE','52060-000',-8.0200,-34.8970),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Cláudio Nunes','claudio.n@email.com','81999001014','111.222.333-14','Estrada do Arraial, 3000','Tamarineira','Recife','PE','52051-380',-8.0210,-34.8990),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Juliana Pereira','juliana.p@email.com','81999001015','111.222.333-15','Av. Agamenon Magalhães, 2000','Espinheiro','Recife','PE','52021-000',-8.0350,-34.8880),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Antônio Tavares','antonio.t@email.com','81999001016','111.222.333-16','Rua do Futuro, 100','Aflitos','Recife','PE','52050-010',-8.0310,-34.8920),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Renata Moura','renata.m@email.com','81999001017','111.222.333-17','Av. Pres. Getúlio Vargas, 500','Bairro Novo','Olinda','PE','53030-010',-8.0100,-34.8550),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Gilberto Santos','gilberto.s@email.com','81999001018','111.222.333-18','Rua do Sol, 200','Carmo','Olinda','PE','53120-010',-8.0130,-34.8570),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Cíntia Lopes','cintia.l@email.com','81999001019','111.222.333-19','Rua 13 de Maio, 100','Varadouro','Olinda','PE','53010-000',-8.0090,-34.8490),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Rafael Cavalcanti','rafael.c@email.com','81999001020','111.222.333-20','Av. Pres. Kennedy, 800','Prazeres','Jaboatão dos Guararapes','PE','54310-000',-8.1250,-34.9200),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Débora Fonseca','debora.f@email.com','81999001021','111.222.333-21','Rua Barreto de Menezes, 400','Piedade','Jaboatão dos Guararapes','PE','54400-000',-8.1600,-34.9100),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Edson Ribeiro','edson.r@email.com','81999001022','111.222.333-22','Av. Barreto de Menezes, 600','Piedade','Jaboatão dos Guararapes','PE','54410-000',-8.1580,-34.9080),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Tatiana Gomes','tatiana.g@email.com','81999001023','111.222.333-23','Rua do Cajueiro, 150','Ibura','Recife','PE','51230-000',-8.1100,-34.9350),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Wellington Dias','wellington.d@email.com','81999001024','111.222.333-24','Av. Recife, 3000','Jardim São Paulo','Recife','PE','50790-000',-8.0900,-34.9200),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Simone Araújo','simone.a@email.com','81999001025','111.222.333-25','Rua J. Paulo Bittencourt, 100','Imbiribeira','Recife','PE','51150-000',-8.1050,-34.9000),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Thiago Monteiro','thiago.m@email.com','81999001026','111.222.333-26','Av. Mascarenhas de Moraes, 4000','Imbiribeira','Recife','PE','51170-000',-8.1000,-34.9050),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Valéria Duarte','valeria.d@email.com','81999001027','111.222.333-27','Rua São Miguel, 200','Afogados','Recife','PE','50770-000',-8.0700,-34.8950),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Anderson Freitas','anderson.f@email.com','81999001028','111.222.333-28','Av. Sul, 800','Afogados','Recife','PE','50761-000',-8.0720,-34.8980),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Lúcia Helena','lucia.h@email.com','81999001029','111.222.333-29','Rua Imperial, 300','São José','Recife','PE','50090-000',-8.0640,-34.8720),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Márcio Augusto','marcio.a@email.com','81999001030','111.222.333-30','Rua da Soledade, 100','Boa Vista','Recife','PE','50070-000',-8.0550,-34.8790);

INSERT INTO streets (campanha_id, nome, bairro, cidade, estado, cep, status_cobertura) VALUES
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Rua da Aurora','Boa Vista','Recife','PE','50050-000','concluida'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Conde da Boa Vista','Boa Vista','Recife','PE','50060-000','concluida'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Rua do Hospício','Boa Vista','Recife','PE','50060-080','em_visitacao'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Dantas Barreto','São José','Recife','PE','50020-000','concluida'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Rua do Imperador','São José','Recife','PE','50010-000','em_visitacao'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Caxangá','Iputinga','Recife','PE','50731-000','nao_visitada'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Rua Real da Torre','Madalena','Recife','PE','50610-000','concluida'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Beira Rio','Madalena','Recife','PE','50610-090','em_visitacao'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Norte','Casa Amarela','Recife','PE','52051-000','nao_visitada'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Estrada do Arraial','Tamarineira','Recife','PE','52051-380','nao_visitada'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Agamenon Magalhães','Espinheiro','Recife','PE','52021-000','concluida'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Rua do Futuro','Aflitos','Recife','PE','52050-010','em_visitacao'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Pres. Getúlio Vargas','Bairro Novo','Olinda','PE','53030-010','concluida'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Rua do Sol','Carmo','Olinda','PE','53120-010','nao_visitada'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Rua 13 de Maio','Varadouro','Olinda','PE','53010-000','em_visitacao'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Pres. Kennedy','Prazeres','Jaboatão dos Guararapes','PE','54310-000','nao_visitada'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Rua Barreto de Menezes','Piedade','Jaboatão dos Guararapes','PE','54400-000','concluida'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Recife','Jardim São Paulo','Recife','PE','50790-000','nao_visitada'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Mascarenhas de Moraes','Imbiribeira','Recife','PE','51170-000','necessita_retorno'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Av. Sul','Afogados','Recife','PE','50761-000','nao_visitada');

INSERT INTO budget_allocations (budget_id, category, planned_amount)
VALUES
('ca5040fe-45bd-48a1-aa7f-3baf782926f5','publicidade',80000),
('ca5040fe-45bd-48a1-aa7f-3baf782926f5','transporte',35000),
('ca5040fe-45bd-48a1-aa7f-3baf782926f5','alimentacao',25000),
('ca5040fe-45bd-48a1-aa7f-3baf782926f5','material',40000),
('ca5040fe-45bd-48a1-aa7f-3baf782926f5','eventos',30000),
('ca5040fe-45bd-48a1-aa7f-3baf782926f5','pessoal',25000),
('ca5040fe-45bd-48a1-aa7f-3baf782926f5','outros',15000)
ON CONFLICT (budget_id, category) DO UPDATE SET planned_amount = EXCLUDED.planned_amount;

INSERT INTO expenses (campanha_id, candidate_id, description, amount, category, payment_method, date, created_by) VALUES
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Impressão santinhos',4500,'publicidade','pix','2028-06-01','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Bandeiras lote 1',3200,'publicidade','transferencia','2028-06-05','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Impulsionamento redes',6000,'publicidade','pix','2028-06-15','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Jingle eleitoral',8500,'publicidade','transferencia','2028-06-20','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Adesivos carro',1800,'publicidade','dinheiro','2028-07-01','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Combustível Jun',2800,'transporte','cartao','2028-06-30','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Aluguel van',4500,'transporte','transferencia','2028-07-01','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Combustível Jul',3100,'transporte','cartao','2028-07-31','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Marmitas Ibura',850,'alimentacao','dinheiro','2028-06-22','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Coffee Olinda',620,'alimentacao','pix','2028-07-10','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Lanches campo',1200,'alimentacao','dinheiro','2028-07-15','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Camisetas',3600,'material','pix','2028-06-10','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Bonés',2700,'material','transferencia','2028-06-25','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Comício Derby',5500,'eventos','transferencia','2028-07-20','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Caminhada Olinda',2200,'eventos','pix','2028-07-25','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Reunião Jaboatão',1800,'eventos','dinheiro','2028-08-01','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Salário coord Jun',3500,'pessoal','transferencia','2028-06-30','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Salário coord Jul',3500,'pessoal','transferencia','2028-07-31','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Aluguel comitê',3000,'outros','transferencia','2028-06-01','827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','bdb4fadb-3514-4745-b65d-953a7d0be3e8','Energia internet',680,'outros','cartao','2028-07-10','827a4592-bf18-41c0-927e-789565994511');

INSERT INTO material_inventory (campanha_id, tipo, descricao, cidade, quantidade_enviada, quantidade_reportada, created_by) VALUES
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Santinhos','Santinho 10x15','Recife',10000,8500,'827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Santinhos','Santinho 10x15','Olinda',3000,2200,'827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Santinhos','Santinho 10x15','Jaboatão dos Guararapes',4000,3100,'827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Bandeiras','Bandeira 1x1.5m','Recife',50,42,'827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Bandeiras','Bandeira 1x1.5m','Olinda',20,18,'827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Adesivos','Adesivo carro','Recife',300,250,'827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Camisetas','Camiseta vermelha','Recife',120,95,'827a4592-bf18-41c0-927e-789565994511'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Camisetas','Camiseta vermelha','Jaboatão dos Guararapes',80,60,'827a4592-bf18-41c0-927e-789565994511');

INSERT INTO reports (campanha_id, title, description, report_type) VALUES
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Financeiro Jun 2028','Consolidado gastos junho','financeiro'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Financeiro Jul 2028','Consolidado gastos julho','financeiro'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Produtividade Jun','Check-ins junho','produtividade'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Produtividade Jul','Check-ins julho','produtividade'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','Mapa Calor','Distribuição apoiadores','territorial');

INSERT INTO votes_raw (candidate_id, zone, section, votes) VALUES
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','001','0101',245),('bdb4fadb-3514-4745-b65d-953a7d0be3e8','001','0102',189),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','001','0103',312),('bdb4fadb-3514-4745-b65d-953a7d0be3e8','001','0104',167),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','002','0201',298),('bdb4fadb-3514-4745-b65d-953a7d0be3e8','002','0202',221),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','002','0203',185),('bdb4fadb-3514-4745-b65d-953a7d0be3e8','003','0301',410),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','003','0302',334),('bdb4fadb-3514-4745-b65d-953a7d0be3e8','003','0303',276),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','004','0401',198),('bdb4fadb-3514-4745-b65d-953a7d0be3e8','004','0402',267),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','005','0501',345),('bdb4fadb-3514-4745-b65d-953a7d0be3e8','005','0502',289),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','006','0601',156);

INSERT INTO votes_agg (candidate_id, total_votes) VALUES ('bdb4fadb-3514-4745-b65d-953a7d0be3e8', 3892);

INSERT INTO team_messages (campanha_id, sender_id, titulo, conteudo, prioridade, cidade) VALUES
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','827a4592-bf18-41c0-927e-789565994511','Caminhada Olinda','Praça do Carmo às 8h amanhã','alta','Olinda'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','827a4592-bf18-41c0-927e-789565994511','Reforço Ibura','Foco Rua do Cajueiro','normal','Recife'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','827a4592-bf18-41c0-927e-789565994511','Material comitê','Santinhos e bonés disponíveis','normal',NULL),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','827a4592-bf18-41c0-927e-789565994511','Jaboatão prioridade','Mais cobertura necessária','alta','Jaboatão dos Guararapes'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','827a4592-bf18-41c0-927e-789565994511','Parabéns Casa Amarela','Meta batida!','normal','Recife');

INSERT INTO resource_requests (campanha_id, user_id, tipo, descricao, localidade, cidade, bairro, quantidade, valor_estimado, status) VALUES
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','827a4592-bf18-41c0-927e-789565994511','material','Santinhos Ibura 2000un','Ibura','Recife','Ibura',2000,900,'aprovado'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','66119af4-ea39-4691-acca-607e0df04fb8','combustivel','Combustível Olinda','Olinda','Olinda','Carmo',1,350,'aprovado'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','827a4592-bf18-41c0-927e-789565994511','alimentacao','Marmitas Jaboatão','Piedade','Jaboatão dos Guararapes','Piedade',30,450,'pendente'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','66119af4-ea39-4691-acca-607e0df04fb8','material','Bandeiras Afogados','Afogados','Recife','Afogados',10,500,'pendente'),
('bdb4fadb-3514-4745-b65d-953a7d0be3e8','827a4592-bf18-41c0-927e-789565994511','outros','Som comício Casa Amarela','Casa Amarela','Recife','Casa Amarela',1,1200,'recusado');