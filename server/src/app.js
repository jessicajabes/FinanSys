import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import banksRoutes from './routes/banksRoutes.js'
import categoriesRoutes from './routes/categoriesRoutes.js'
import movementssRoutes from './routes/movementsRoutes.js'
import transactionsRoutes from './routes/transactionsRoutes.js'


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


app.use('/api/auth', authRoutes);
app.use('/api/auth', banksRoutes);
app.use('/api/auth', categoriesRoutes);
app.use('/api/auth', movementssRoutes);
app.use('/api/auth', transactionsRoutes);



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