-- Seed idempotente: popular tabelas para user_id = 10
-- Escopo: todas as tabelas exceto `users` e `movements_calculations`
-- Gera ~15 registros por tabela (categories, banks, cards, transactions)

DO $$
DECLARE
	v_by INTEGER := (SELECT id FROM users WHERE id = 10);
BEGIN

	----------------------------------------------------------------------------
	-- 1) CATEGORIES (15 nomes)
	----------------------------------------------------------------------------
	INSERT INTO categories (name, type, created_at, created_by, updated_at, updated_by)
	VALUES
		('SALARY','R', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('FREELANCE','R', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('INVESTMENTS','R', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('RENT','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('GROCERIES','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('RESTAURANTS','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('TRANSPORT','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('HEALTH','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('EDUCATION','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('ENTERTAINMENT','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('UTILITIES','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('SUBSCRIPTIONS','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('TRAVEL','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('GIFTS','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		('MISC','D', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by)
	ON CONFLICT (name) DO UPDATE
	SET type = EXCLUDED.type,
			updated_at = CURRENT_TIMESTAMP,
			updated_by = EXCLUDED.updated_by;

	----------------------------------------------------------------------------
	-- 2) BANKS (15 registros) - ids: 1000..1014
	----------------------------------------------------------------------------
	INSERT INTO banks (id, user_id, balance, description, created_at, created_by, updated_at, updated_by)
	VALUES
		(1000, v_by, 2500.00, 'NU - CORRENTE', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1001, v_by, 10234.50, 'SANTANDER - POUPANCA', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1002, v_by, 500.00, 'ITAU - CORRENTE', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1003, v_by, 1200.75, 'BRADESCO - CORRENTE', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1004, v_by, 300.10, 'C6 - CORRENTE', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1005, v_by, 980.00, 'SICREDI', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1006, v_by, 15000.00, 'BTG - INVEST', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1007, v_by, 45.20, 'CAIXA - POUPANCA', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1008, v_by, 600.00, 'XP - CORRENTE', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1009, v_by, 420.00, 'BANKA', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1010, v_by, 75.00, 'DIGITAL ONE', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1011, v_by, 999.99, 'BANK TWO', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1012, v_by, 150.00, 'EMPRESA X', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1013, v_by, 2200.00, 'EMPRESA Y', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(1014, v_by, 5.00, 'POCKET', CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by)
	ON CONFLICT (id) DO UPDATE
	SET user_id = EXCLUDED.user_id,
			balance = EXCLUDED.balance,
			description = EXCLUDED.description,
			updated_at = CURRENT_TIMESTAMP,
			updated_by = EXCLUDED.updated_by;

	----------------------------------------------------------------------------
	-- 3) CARDS (15 registros) - ids: 2000..2014, vinculados a banks existentes
	----------------------------------------------------------------------------
	INSERT INTO cards (id, user_id, description, bank_id, created_at, created_by, updated_at, updated_by)
	VALUES
		(2000, v_by, 'VISA GOLD 1111', 1000, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2001, v_by, 'MASTERCARD 2222', 1001, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2002, v_by, 'AMEX 3333', 1002, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2003, v_by, 'VISA 4444', 1003, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2004, v_by, 'MASTERCARD 5555', 1004, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2005, v_by, 'VISA 6666', 1005, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2006, v_by, 'MASTERCARD 7777', 1006, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2007, v_by, 'VISA 8888', 1007, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2008, v_by, 'MASTERCARD 9999', 1008, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2009, v_by, 'VISA 0000', 1009, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2010, v_by, 'MASTERCARD A123', 1010, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2011, v_by, 'VISA B234', 1011, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2012, v_by, 'MASTERCARD C345', 1012, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2013, v_by, 'VISA D456', 1013, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(2014, v_by, 'MASTERCARD E567', 1014, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by)
	ON CONFLICT (id) DO UPDATE
	SET user_id = EXCLUDED.user_id,
			description = EXCLUDED.description,
			bank_id = EXCLUDED.bank_id,
			updated_at = CURRENT_TIMESTAMP,
			updated_by = EXCLUDED.updated_by;

	----------------------------------------------------------------------------
	-- 4) TRANSACTIONS (15 registros) - ids: 5000..5014, vinculados a categories/banks/cards
	-- Nota: assumimos que existe user com id = 10 (não criamos users aqui)
	----------------------------------------------------------------------------
	INSERT INTO transactions (id, category_id, user_id, description, amount, transaction_type, fixed_variable, payment_method, bank_id, card_id, start_date, end_date, created_at, created_by, updated_at, updated_by)
	VALUES
		(5000, (SELECT id FROM categories WHERE name='SALARY' LIMIT 1), v_by, 'Salary october', 4500.00, 'R', 'F', 'pix', 1000, NULL, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5001, (SELECT id FROM categories WHERE name='FREELANCE' LIMIT 1), v_by, 'Freelance gig', 800.00, 'R', 'F', 'pix', 1001, NULL, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5002, (SELECT id FROM categories WHERE name='RENT' LIMIT 1), v_by, 'Monthly rent', -1200.00, 'D', 'F', 'boleto', 1002, NULL, to_date('2025-10-01','YYYY-MM-DD'), NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5003, (SELECT id FROM categories WHERE name='GROCERIES' LIMIT 1), v_by, 'Supermarket', -230.45, 'D', 'V', 'debit', 1003, 2003, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5004, (SELECT id FROM categories WHERE name='RESTAURANTS' LIMIT 1), v_by, 'Dinner out', -65.90, 'D', 'V', 'credit', 1004, 2004, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5005, (SELECT id FROM categories WHERE name='TRANSPORT' LIMIT 1), v_by, 'Uber', -23.30, 'D', 'V', 'pix', 1005, NULL, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5006, (SELECT id FROM categories WHERE name='HEALTH' LIMIT 1), v_by, 'Pharmacy', -45.00, 'D', 'V', 'cash', 1006, NULL, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5007, (SELECT id FROM categories WHERE name='EDUCATION' LIMIT 1), v_by, 'Course fee', -120.00, 'D', 'V', 'pix', 1007, NULL, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5008, (SELECT id FROM categories WHERE name='ENTERTAINMENT' LIMIT 1), v_by, 'Movie', -30.00, 'D', 'V', 'credit', 1008, 2008, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5009, (SELECT id FROM categories WHERE name='UTILITIES' LIMIT 1), v_by, 'Electric bill', -150.00, 'D', 'F', 'boleto', 1009, NULL, to_date('2025-10-01','YYYY-MM-DD'), NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5010, (SELECT id FROM categories WHERE name='SUBSCRIPTIONS' LIMIT 1), v_by, 'Spotify', -16.90, 'D', 'F', 'credit', 1010, 2010, to_date('2025-10-01','YYYY-MM-DD'), to_date('2026-09-30','YYYY-MM-DD'), CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5011, (SELECT id FROM categories WHERE name='TRAVEL' LIMIT 1), v_by, 'Flight booking', -450.00, 'D', 'V', 'pix', 1011, NULL, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5012, (SELECT id FROM categories WHERE name='GIFTS' LIMIT 1), v_by, 'Gift', -80.00, 'D', 'V', 'cash', 1012, NULL, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5013, (SELECT id FROM categories WHERE name='MISC' LIMIT 1), v_by, 'Random expense', -12.00, 'D', 'V', 'cash', 1013, NULL, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by),
		(5014, (SELECT id FROM categories WHERE name='INVESTMENTS' LIMIT 1), v_by, 'Investment sell', 1200.00, 'R', 'F', 'pix', 1014, NULL, NULL, NULL, CURRENT_TIMESTAMP, v_by, CURRENT_TIMESTAMP, v_by)
	ON CONFLICT (id) DO UPDATE
	SET category_id = EXCLUDED.category_id,
			user_id = EXCLUDED.user_id,
			description = EXCLUDED.description,
			amount = EXCLUDED.amount,
			transaction_type = EXCLUDED.transaction_type,
			fixed_variable = EXCLUDED.fixed_variable,
			payment_method = EXCLUDED.payment_method,
			bank_id = EXCLUDED.bank_id,
			card_id = EXCLUDED.card_id,
			start_date = EXCLUDED.start_date,
			end_date = EXCLUDED.end_date,
			updated_at = CURRENT_TIMESTAMP,
			updated_by = EXCLUDED.updated_by;

	----------------------------------------------------------------------------
	-- 5) Ajustar sequences para evitar colisões quando inserimos ids manualmente
	----------------------------------------------------------------------------
	PERFORM setval(pg_get_serial_sequence('categories','id'), GREATEST((SELECT COALESCE(MAX(id),0) FROM categories), nextval(pg_get_serial_sequence('categories','id'))));
	PERFORM setval(pg_get_serial_sequence('banks','id'), GREATEST((SELECT COALESCE(MAX(id),0) FROM banks), nextval(pg_get_serial_sequence('banks','id'))));
	PERFORM setval(pg_get_serial_sequence('cards','id'), GREATEST((SELECT COALESCE(MAX(id),0) FROM cards), nextval(pg_get_serial_sequence('cards','id'))));
	PERFORM setval(pg_get_serial_sequence('transactions','id'), GREATEST((SELECT COALESCE(MAX(id),0) FROM transactions), nextval(pg_get_serial_sequence('transactions','id'))));

END
$$;

-- Observações:
-- • Este seed NÃO cria usuários. Ele assume que o usuário com id = 10 já existe (created_by/updated_by referenciam 10).
-- • Para executar no container:
--   docker exec -i finansys-bd psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -f /docker-entrypoint-initdb.d/02-seed.sql


