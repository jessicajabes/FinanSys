import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import banksRoutes from './routes/banksRoutes.js'
import banksModel from './models/banksModel.js'


dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// DEV: log incoming requests to help diagnose routing
app.use((req, res, next) => {
  try {
    console.log('INCOMING', req.method, req.originalUrl)
  } catch (e) {
    console.error('Error logging request', e)
  }
  next()
})

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', banksRoutes);

// compatibility: allow GET /api/auth/bank?id=1 (query string)
app.get('/api/auth/bank', async (req, res) => {
  try {
    const rawId = req.query.id
    const id = Number(rawId)
    if (!id) return res.status(400).json({ error: 'ID inválido' })
    const bank = await banksModel.findById(id)
    if (!bank) return res.status(404).json({ error: 'Banco não encontrado' })
    return res.json({ bank })
  } catch (err) {
    console.error('Erro na rota compat /api/auth/bank', err)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
})


app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Rota não encontrada',
    path: req.originalUrl 
  });
});

export default app;