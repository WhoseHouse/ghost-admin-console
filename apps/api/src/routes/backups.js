import { Router } from 'express';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { getClients } from '../lib/ghostClients.js';
import { listBackups, getBackup, deleteBackupRecord, BACKUPS_DIR } from '../lib/backupStore.js';
import { runBackup } from '../lib/backupRunner.js';

const router = Router();

// GET /api/backups?siteId=x
router.get('/', (req, res) => {
  res.json(listBackups(req.query.siteId));
});

// POST /api/backups/run  body: { siteId? }
router.post('/run', async (req, res) => {
  const { siteId } = req.body ?? {};
  const clients = getClients();
  const targets = siteId
    ? (clients[siteId] ? [clients[siteId]] : [])
    : Object.values(clients);

  if (targets.length === 0) return res.status(404).json({ error: 'No sites found' });

  const results = await Promise.allSettled(targets.map(runBackup));
  res.json(results.map(r =>
    r.status === 'fulfilled' ? r.value : { status: 'failed', error: r.reason.message }
  ));
});

// GET /api/backups/:id/download
router.get('/:id/download', (req, res) => {
  const record = getBackup(req.params.id);
  if (!record) return res.status(404).json({ error: 'Backup not found' });

  const file = join(BACKUPS_DIR, record.id, 'content-export.json');
  if (!existsSync(file)) return res.status(404).json({ error: 'Export file missing' });

  res.download(file, `ghost-export-${record.siteId}-${record.startedAt.slice(0, 10)}.json`);
});

// GET /api/backups/:id/download-media
router.get('/:id/download-media', (req, res) => {
  const record = getBackup(req.params.id);
  if (!record?.hasMedia) return res.status(404).json({ error: 'No media archive for this backup' });

  const file = join(BACKUPS_DIR, record.id, 'media.tar.gz');
  if (!existsSync(file)) return res.status(404).json({ error: 'Archive file missing' });

  res.download(file, `ghost-media-${record.siteId}-${record.startedAt.slice(0, 10)}.tar.gz`);
});

// DELETE /api/backups/:id
router.delete('/:id', (req, res) => {
  const record = getBackup(req.params.id);
  if (!record) return res.status(404).json({ error: 'Backup not found' });

  const dir = join(BACKUPS_DIR, record.id);
  if (existsSync(dir)) rmSync(dir, { recursive: true });
  deleteBackupRecord(record.id);
  res.json({ ok: true });
});

export default router;
