import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import sitesRouter from './routes/sites.js';
import dataRouter from './routes/data.js';
import backupsRouter from './routes/backups.js';
import { getClients } from './lib/ghostClients.js';
import { runBackup } from './lib/backupRunner.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/sites', sitesRouter);
app.use('/api/data', dataRouter);
app.use('/api/backups', backupsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  initBackupScheduler();
});

function initBackupScheduler() {
  const clients = getClients();
  for (const client of Object.values(clients)) {
    const cfg = client.site.backup;
    if (!cfg?.enabled || !cfg?.schedule) continue;
    if (!cron.validate(cfg.schedule)) {
      console.warn(`[backup] Invalid cron for ${client.site.id}: ${cfg.schedule}`);
      continue;
    }
    cron.schedule(cfg.schedule, () => {
      console.log(`[backup] Running scheduled backup for ${client.site.id}…`);
      runBackup(client).catch(err =>
        console.error(`[backup] Scheduled backup failed for ${client.site.id}:`, err.message)
      );
    });
    console.log(`[backup] Scheduled ${client.site.id}: ${cfg.schedule}`);
  }
}
