import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dir = dirname(fileURLToPath(import.meta.url));
export const BACKUPS_DIR = join(__dir, '../../backups');
const MANIFEST = join(BACKUPS_DIR, 'manifest.json');

function loadManifest() {
  if (!existsSync(MANIFEST)) return [];
  try { return JSON.parse(readFileSync(MANIFEST, 'utf8')); }
  catch { return []; }
}

function saveManifest(records) {
  mkdirSync(BACKUPS_DIR, { recursive: true });
  writeFileSync(MANIFEST, JSON.stringify(records, null, 2));
}

export function listBackups(siteId) {
  const all = loadManifest();
  return siteId ? all.filter(r => r.siteId === siteId) : all;
}

export function getBackup(id) {
  return loadManifest().find(r => r.id === id) ?? null;
}

export function createBackupRecord(siteId, siteLabel) {
  const record = {
    id: randomUUID(),
    siteId,
    siteLabel,
    startedAt: new Date().toISOString(),
    completedAt: null,
    status: 'running',
    error: null,
    contentExportSize: null,
    mediaArchiveSize: null,
    hasMedia: false,
  };
  const records = loadManifest();
  records.unshift(record);
  saveManifest(records);
  return record;
}

export function updateBackupRecord(id, updates) {
  const records = loadManifest();
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...updates };
  saveManifest(records);
  return records[idx];
}

export function deleteBackupRecord(id) {
  const records = loadManifest();
  const filtered = records.filter(r => r.id !== id);
  saveManifest(filtered);
}

export function getExpiredIds(siteId, retainDays = 30) {
  const cutoff = Date.now() - retainDays * 86_400_000;
  return loadManifest()
    .filter(r => r.siteId === siteId && new Date(r.startedAt).getTime() < cutoff)
    .map(r => r.id);
}
