import { Pool } from 'pg'

const required = ['DB_HOST','DB_PORT','DB_NAME','DB_USER','DB_PASSWORD'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  throw new Error(`Para conexão é necessário as seguintes variáveis: ${missing.join(', ')}`);
}

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    console.log('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
    console.log('Erro no PostgreSQL:', err);
});

export default {
    query: (text, params) => pool.query(text, params),
    pool
};