import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sitesRouter from './routes/sites.js';
import dataRouter from './routes/data.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/sites', sitesRouter);
app.use('/api/data', dataRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
