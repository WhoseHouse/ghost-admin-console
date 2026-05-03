import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { I } from '../components/icons.jsx';

const HUE_PALETTE = [
  'oklch(0.66 0.13 35)', 'oklch(0.74 0.11 180)', 'oklch(0.62 0.10 260)',
  'oklch(0.74 0.13 80)', 'oklch(0.55 0.10 320)', 'oklch(0.66 0.15 25)',
];

async function apiFetch(path, opts = {}) {
  const res = await fetch(path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function fmtBytes(n) {
  if (n == null) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function relTime(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function StatusPill({ status }) {
  const map = {
    success: { cls: 'pill-teal',    label: 'success' },
    failed:  { cls: 'pill-red',     label: 'failed' },
    running: { cls: 'pill-dim',     label: 'running…' },
  };
  const { cls, label } = map[status] ?? { cls: 'pill-dim', label: status };
  return <span className={`pill ${cls}`}>{label}</span>;
}

export default function Backups() {
  const qc = useQueryClient();
  const [runningFor, setRunningFor] = useState(null); // siteId or 'all'

  const { data: backups = [], isLoading, error } = useQuery({
    queryKey: ['backups'],
    queryFn: () => apiFetch('/api/backups'),
    refetchInterval: runningFor ? 3000 : false,
    staleTime: 10_000,
  });

  const { data: sites = [] } = useQuery({
    queryKey: ['sites'],
    queryFn: () => apiFetch('/api/sites'),
    staleTime: 60_000,
  });

  const runMutation = useMutation({
    mutationFn: (siteId) => apiFetch('/api/backups/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteId ? { siteId } : {}),
    }),
    onSuccess: () => {
      setRunningFor(null);
      qc.invalidateQueries({ queryKey: ['backups'] });
    },
    onError: () => setRunningFor(null),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiFetch(`/api/backups/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['backups'] }),
  });

  function triggerBackup(siteId) {
    setRunningFor(siteId ?? 'all');
    runMutation.mutate(siteId);
  }

  // Group backups by site for the site cards
  const bySite = {};
  for (const b of backups) {
    if (!bySite[b.siteId]) bySite[b.siteId] = [];
    bySite[b.siteId].push(b);
  }

  // All known sites (from /api/sites + any in backup records)
  const knownSites = sites.length > 0 ? sites : [...new Set(backups.map(b => b.siteId))].map(id => ({
    id, label: backups.find(b => b.siteId === id)?.siteLabel ?? id,
  }));

  const totalBackups = backups.length;
  const successCount = backups.filter(b => b.status === 'success').length;
  const totalSize    = backups.reduce((a, b) => a + (b.contentExportSize ?? 0) + (b.mediaArchiveSize ?? 0), 0);
  const isRunning    = runningFor !== null;

  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Backups</h1>
          <p className="page-sub">
            <span className="mono">{knownSites.length} site{knownSites.length !== 1 ? 's' : ''}</span>
            {totalBackups > 0 && <> · <span className="mono">{totalBackups} backup{totalBackups !== 1 ? 's' : ''}</span> stored</>}
          </p>
        </div>
        <div className="head-tools">
          <button
            className="btn primary"
            disabled={isRunning}
            onClick={() => triggerBackup(null)}
          >
            {isRunning && runningFor === 'all'
              ? <><I.Refresh size={13} style={{ animation: 'spin 1s linear infinite' }} /> Running…</>
              : <><I.Backup size={13} /> Back up all sites</>
            }
          </button>
        </div>
      </div>

      {/* summary metrics */}
      <div className="metrics" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Backups',   val: String(totalBackups),  sub: 'across all sites' },
          { label: 'Successful',      val: String(successCount),  sub: `${totalBackups > 0 ? Math.round(successCount / totalBackups * 100) : 0}% success rate`, cls: successCount > 0 ? 'up' : 'flat' },
          { label: 'Storage Used',    val: fmtBytes(totalSize),   sub: 'content exports' },
          { label: 'Sites Covered',   val: String(Object.keys(bySite).length), sub: `of ${knownSites.length} configured` },
        ].map(m => (
          <div key={m.label} className="metric" style={{ padding: '14px 16px' }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ fontSize: 28, marginTop: 10 }}>{m.val}</div>
            <div className="metric-foot"><span className={'delta ' + (m.cls || 'flat')}>{m.sub}</span></div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'oklch(0.55 0.1 25 / 0.1)', border: '1px solid oklch(0.55 0.1 25 / 0.3)', borderRadius: 8, color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>
          Failed to load backups: {error.message}
        </div>
      )}

      {/* per-site cards */}
      <div className="sec-head">
        <div className="sec-title">Sites <span className="sec-count">{knownSites.length}</span></div>
      </div>

      <div className="sites" style={{ marginBottom: 24 }}>
        {knownSites.map((site, i) => {
          const hue     = HUE_PALETTE[i % HUE_PALETTE.length];
          const bg      = hue.replace(')', ' / 0.18)');
          const border  = hue.replace(')', ' / 0.35)');
          const ini     = site.label.split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
          const siteBackups = bySite[site.id] ?? [];
          const latest  = siteBackups[0];
          const runningThis = isRunning && (runningFor === site.id || runningFor === 'all');

          return (
            <div key={site.id} className="site">
              <div className="site-head">
                <div className="site-fav" style={{ background: bg, color: hue, borderColor: border }}>{ini}</div>
                <div className="site-id">
                  <div className="site-name">{site.label}</div>
                  <div className="site-url">{site.url?.replace(/^https?:\/\//, '') ?? site.id}</div>
                </div>
                <div className={'status ' + (latest?.status === 'success' ? 'online' : latest?.status === 'failed' ? 'offline' : 'warn')}>
                  <span className="d" />
                  {latest ? latest.status : 'never'}
                </div>
              </div>

              <div className="site-stats">
                <div className="stat">
                  <div className="stat-l">Backups</div>
                  <div className="stat-v">{siteBackups.length}<span className="sub">· {siteBackups.filter(b => b.status === 'success').length} ok</span></div>
                </div>
                <div className="stat">
                  <div className="stat-l">Last run</div>
                  <div className="stat-v" style={{ fontSize: 12 }}>{latest ? relTime(latest.startedAt) : '—'}</div>
                </div>
              </div>

              {latest && (
                <div className="last-post">
                  <div className="last-post-label">Last backup</div>
                  <div className="last-post-title">{fmtDate(latest.startedAt)}</div>
                  <div className="last-post-meta">
                    {fmtBytes(latest.contentExportSize)} content
                    {latest.hasMedia && ` · ${fmtBytes(latest.mediaArchiveSize)} media`}
                  </div>
                </div>
              )}

              <div style={{ padding: '10px 14px 14px', display: 'flex', gap: 8, borderTop: '1px solid var(--border)' }}>
                <button
                  className="btn"
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={runningThis}
                  onClick={() => triggerBackup(site.id)}
                >
                  {runningThis
                    ? <><I.Refresh size={12} style={{ animation: 'spin 1s linear infinite' }} /> Running…</>
                    : <><I.Backup size={12} /> Back up now</>
                  }
                </button>
                {latest?.status === 'success' && (
                  <a href={`/api/backups/${latest.id}/download`} download>
                    <button className="btn" title="Download content export">
                      <I.Down size={12} /> Export
                    </button>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* history table */}
      {backups.length > 0 && (
        <>
          <div className="sec-head">
            <div className="sec-title">History <span className="sec-count">{backups.length}</span></div>
          </div>
          <div className="data-table">
            <div className="dt-head" style={{ gridTemplateColumns: '8px 1fr 90px 90px 90px 60px 80px 32px' }}>
              <div /><div>Site</div><div>Status</div><div>Content</div>
              <div>Media</div><div className="r">Duration</div><div className="r">Started</div><div />
            </div>
            {backups.map((b, i) => {
              const hue = HUE_PALETTE[i % HUE_PALETTE.length];
              const durMs = b.completedAt
                ? new Date(b.completedAt) - new Date(b.startedAt)
                : null;
              const dur = durMs != null ? (durMs < 1000 ? `${durMs}ms` : `${(durMs / 1000).toFixed(1)}s`) : '—';
              return (
                <div key={b.id} className="dt-row" style={{ gridTemplateColumns: '8px 1fr 90px 90px 90px 60px 80px 32px' }}>
                  <div className="dt-site-dot" style={{ background: hue }} />
                  <div>
                    <div className="dt-title">{b.siteLabel}</div>
                    {b.error && <div className="dt-sub" style={{ color: 'var(--red)' }}>{b.error}</div>}
                  </div>
                  <div><StatusPill status={b.status} /></div>
                  <div className="mono-sm" style={{ color: 'var(--text-2)' }}>{fmtBytes(b.contentExportSize)}</div>
                  <div className="mono-sm" style={{ color: 'var(--text-3)' }}>
                    {b.hasMedia ? fmtBytes(b.mediaArchiveSize) : '—'}
                  </div>
                  <div className="r mono-sm" style={{ color: 'var(--text-3)' }}>{dur}</div>
                  <div className="r mono-sm" style={{ color: 'var(--text-2)' }}>{relTime(b.startedAt)}</div>
                  <div className="dt-act" style={{ display: 'flex', gap: 4 }}>
                    {b.status === 'success' && (
                      <a href={`/api/backups/${b.id}/download`} download>
                        <button className="icon-btn" title="Download export"><I.Down size={12} /></button>
                      </a>
                    )}
                    {b.status === 'success' && b.hasMedia && (
                      <a href={`/api/backups/${b.id}/download-media`} download>
                        <button className="icon-btn" title="Download media archive"><I.Doc size={12} /></button>
                      </a>
                    )}
                    <button
                      className="icon-btn"
                      title="Delete backup"
                      onClick={() => deleteMutation.mutate(b.id)}
                    >
                      <I.Trash size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="dt-foot"><span>{backups.length} backup{backups.length !== 1 ? 's' : ''} stored</span></div>
          </div>
        </>
      )}

      {backups.length === 0 && !isLoading && (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--text-3)',
          fontFamily: 'var(--mono)',
          fontSize: 12,
          border: '1px dashed var(--border)',
          borderRadius: 10,
        }}>
          No backups yet. Click &ldquo;Back up all sites&rdquo; to create your first backup.
        </div>
      )}

      {/* schedule info */}
      <div className="widget" style={{ marginTop: 24 }}>
        <div className="widget-title"><I.Clock size={12} style={{ marginRight: 6 }} />Schedule</div>
        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: '8px 0 0' }}>
          Automated backups run on the cron schedule set per-site in <code style={{ fontFamily: 'var(--mono)', fontSize: 11, background: 'var(--bg-2)', padding: '1px 5px', borderRadius: 3 }}>apps/api/sites.json</code>.
          Add <code style={{ fontFamily: 'var(--mono)', fontSize: 11, background: 'var(--bg-2)', padding: '1px 5px', borderRadius: 3 }}>"backup": {"{"}"enabled": true, "schedule": "0 3 * * *", "retainDays": 30{"}"}</code> to any site entry.
          For self-hosted droplets, also add an <code style={{ fontFamily: 'var(--mono)', fontSize: 11, background: 'var(--bg-2)', padding: '1px 5px', borderRadius: 3 }}>"ssh"</code> object with host, username, and privateKeyPath to back up media files.
        </p>
      </div>
    </div>
  );
}
