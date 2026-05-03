import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, statSync } from 'fs';
import { join } from 'path';
import { adminFetch } from './ghostClients.js';
import {
  BACKUPS_DIR,
  createBackupRecord,
  updateBackupRecord,
  getBackup,
  deleteBackupRecord,
  getExpiredIds,
} from './backupStore.js';

async function buildContentExport(client) {
  const { api, site } = client;

  const [posts, pages, tags, members, newsletters, tiersBody, offersBody] = await Promise.allSettled([
    api.posts.browse({ limit: 'all', include: 'tags,authors' }),
    api.pages.browse({ limit: 'all', include: 'tags,authors' }),
    api.tags.browse({ limit: 'all' }),
    api.members.browse({ limit: 'all' }),
    api.newsletters.browse({ limit: 'all' }),
    adminFetch(site, 'tiers/', { limit: 'all', include: 'monthly_price,yearly_price,benefits' }),
    adminFetch(site, 'offers/', { limit: 'all' }),
  ]);

  const val = r => (r.status === 'fulfilled' ? r.value : []);

  return {
    exportedAt: new Date().toISOString(),
    siteId: site.id,
    siteLabel: site.label,
    siteUrl: site.url,
    data: {
      posts:         val(posts),
      pages:         val(pages),
      tags:          val(tags),
      members:       val(members),
      newsletters:   val(newsletters),
      tiers:         tiersBody.status === 'fulfilled' ? (tiersBody.value.tiers ?? []) : [],
      offers:        offersBody.status === 'fulfilled' ? (offersBody.value.offers ?? []) : [],
    },
  };
}

export async function runBackup(client) {
  const { site } = client;
  const record = createBackupRecord(site.id, site.label);
  const backupDir = join(BACKUPS_DIR, record.id);

  try {
    mkdirSync(backupDir, { recursive: true });

    // ── Ghost content export via Admin API ─────────────────────────────
    const exportBody = await buildContentExport(client);
    const exportJson = JSON.stringify(exportBody, null, 2);
    writeFileSync(join(backupDir, 'content-export.json'), exportJson);
    const contentExportSize = Buffer.byteLength(exportJson);

    // ── SSH media backup (self-hosted only) ────────────────────────────
    let hasMedia = false;
    let mediaArchiveSize = null;

    if (site.backup?.ssh) {
      try {
        const result = await backupMediaViaSSH(site, backupDir);
        hasMedia = true;
        mediaArchiveSize = result.size;
      } catch (sshErr) {
        console.warn(`[backup] SSH media backup failed for ${site.id}:`, sshErr.message);
      }
    }

    updateBackupRecord(record.id, {
      completedAt: new Date().toISOString(),
      status: 'success',
      contentExportSize,
      hasMedia,
      mediaArchiveSize,
    });

    // Prune backups older than retainDays
    const retainDays = site.backup?.retainDays ?? 30;
    for (const oldId of getExpiredIds(site.id, retainDays)) {
      const oldDir = join(BACKUPS_DIR, oldId);
      if (existsSync(oldDir)) rmSync(oldDir, { recursive: true });
      deleteBackupRecord(oldId);
    }

    return getBackup(record.id);
  } catch (err) {
    updateBackupRecord(record.id, {
      completedAt: new Date().toISOString(),
      status: 'failed',
      error: err.message,
    });
    throw err;
  }
}

async function backupMediaViaSSH(site, backupDir) {
  const { host, port = 22, username, privateKeyPath, password, contentPath = '/var/www/ghost/content' } = site.backup.ssh;
  const { Client } = await import('ssh2');

  return new Promise((resolve, reject) => {
    const conn = new Client();
    const tmpFile = `/tmp/ghost-media-${Date.now()}.tar.gz`;
    const localFile = join(backupDir, 'media.tar.gz');

    conn.on('ready', () => {
      // Archive images + files on the remote server
      const tarCmd = `tar czf ${tmpFile} -C ${contentPath} images files 2>/dev/null; echo $?`;
      conn.exec(tarCmd, (err, stream) => {
        if (err) { conn.end(); return reject(err); }

        stream.on('close', () => {
          conn.sftp((err, sftp) => {
            if (err) { conn.end(); return reject(err); }

            sftp.fastGet(tmpFile, localFile, (err) => {
              // Clean up temp file regardless of download result
              conn.exec(`rm -f ${tmpFile}`, (_e, s) => { if (!_e) s?.resume(); });

              if (err) { conn.end(); return reject(err); }

              conn.end();
              resolve({ size: statSync(localFile).size });
            });
          });
        });
      });
    });

    conn.on('error', reject);

    const cfg = { host, port: Number(port), username };
    if (privateKeyPath) cfg.privateKey = readFileSync(privateKeyPath);
    else if (password)  cfg.password   = password;

    conn.connect(cfg);
  });
}
