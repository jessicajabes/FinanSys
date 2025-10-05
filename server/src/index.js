import express from 'express';
import process from 'process';

const app = express();
const port = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.send('FinanSys API - server is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
