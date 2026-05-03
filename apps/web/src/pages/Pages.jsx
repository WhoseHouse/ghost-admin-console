import { useState } from 'react';
import { I } from '../components/icons.jsx';
import { SITES, fmtNum } from '../data/mockData.js';
import { useLivePages } from '../hooks/useLiveData.js';
import useSiteStore from '../store/siteStore.js';

const HUE_PALETTE = [
  'oklch(0.66 0.13 35)', 'oklch(0.74 0.11 180)', 'oklch(0.62 0.10 260)',
  'oklch(0.74 0.13 80)', 'oklch(0.55 0.10 320)', 'oklch(0.66 0.15 25)',
];

const PAGES_DATA = [
  { siteId:"wd",  title:"About Wavelength Daily",   url:"/about",     status:"published", updated:"2026-05-01" },
  { siteId:"qm",  title:"Start Here",               url:"/start",     status:"published", updated:"2026-04-30" },
  { siteId:"fl",  title:"The Field Lab Manifesto",  url:"/manifesto", status:"published", updated:"2026-04-28" },
  { siteId:"rh",  title:"Press Kit",                url:"/press",     status:"draft",     updated:"2026-04-24" },
  { siteId:"qm",  title:"Work With Me",             url:"/work",      status:"published", updated:"2026-04-20" },
  { siteId:"tn",  title:"Shipping & Returns",       url:"/shipping",  status:"published", updated:"2026-04-15" },
  { siteId:"ng",  title:"Coming Soon",              url:"/",          status:"draft",     updated:"2026-04-22" },
  { siteId:"wd",  title:"Privacy Policy",           url:"/privacy",   status:"published", updated:"2026-03-10" },
];

export default function Pages() {
  const { dataSource } = useSiteStore();
  const isLive = dataSource === 'live';
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: livePages = [], isLoading, error } = useLivePages({ status: statusFilter, limit: 50 });

  const mockFiltered = PAGES_DATA.filter(p => statusFilter === 'all' || p.status === statusFilter);
  const rows = isLive ? livePages : mockFiltered;

  const livePublished = livePages.filter(p => p.status === 'published').length;
  const liveDrafts    = livePages.filter(p => p.status === 'draft').length;

  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Pages</h1>
          <p className="page-sub">
            {isLive
              ? (error ? <span style={{ color: 'var(--red)' }}>API error: {error.message}</span>
                : <><span className="mono">{livePages.length} pages</span> from your sites</>)
              : <><span className="mono">47 pages</span> across <span className="mono">6 sites</span></>
            }
          </p>
        </div>
        <div className="head-tools">
          <div className="v-filter">
            {['all', 'published', 'draft'].map(f => (
              <button key={f} className={statusFilter === f ? 'on' : ''} onClick={() => setStatusFilter(f)}>{f}</button>
            ))}
          </div>
          <button className="btn primary"><I.Plus size={13} /> New page</button>
        </div>
      </div>

      <div className="metrics" style={{ marginBottom: 24 }}>
        {isLive ? [
          { label: 'Total Pages',  val: isLoading ? '…' : fmtNum(livePages.length), sub: 'fetched live' },
          { label: 'Published',    val: isLoading ? '…' : fmtNum(livePublished),    sub: '', cls: 'up' },
          { label: 'Drafts',       val: isLoading ? '…' : fmtNum(liveDrafts),       sub: 'in progress', cls: liveDrafts > 0 ? 'warn' : 'flat' },
          { label: 'Sites',        val: isLoading ? '…' : String([...new Set(livePages.map(p => p.siteId))].length), sub: 'contributing' },
        ].map(m => (
          <div key={m.label} className="metric" style={{ padding: '14px 16px' }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ fontSize: 28, marginTop: 10 }}>{m.val}</div>
            <div className="metric-foot"><span className={'delta ' + (m.cls || 'flat')}>{m.sub}</span></div>
          </div>
        )) : [
          { label: 'Total Pages',    val: '47',  sub: 'across 6 sites' },
          { label: 'Published',      val: '40',  sub: '85% ratio', cls: 'up' },
          { label: 'Drafts',         val: '7',   sub: 'needs review', cls: 'warn' },
          { label: 'Avg Perf Score', val: '92',  sub: '↑ vs last audit', cls: 'up' },
        ].map(m => (
          <div key={m.label} className="metric" style={{ padding: '14px 16px' }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ fontSize: 28, marginTop: 10 }}>{m.val}</div>
            <div className="metric-foot"><span className={'delta ' + (m.cls || 'flat')}>{m.sub}</span></div>
          </div>
        ))}
      </div>

      <div className="tw-col">
        <div className="data-table" style={{ flex: '1 1 0' }}>
          {isLive ? (
            <>
              <div className="dt-head" style={{ gridTemplateColumns: '8px 1fr 90px 90px 80px 32px' }}>
                <div /><div>Page · URL</div><div>Site</div><div>Status</div>
                <div className="r">Updated</div><div />
              </div>
              {isLoading && (
                <div style={{ padding: '20px 16px', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 12 }}>
                  Loading pages…
                </div>
              )}
              {rows.map((p, i) => {
                const hue = HUE_PALETTE[i % HUE_PALETTE.length];
                const slug = p.url ? p.url.replace(p.siteUrl, '').replace(/\/$/, '') || '/' : '—';
                return (
                  <div key={p.id || i} className="dt-row" style={{ gridTemplateColumns: '8px 1fr 90px 90px 80px 32px' }}>
                    <div className="dt-site-dot" style={{ background: hue }} />
                    <div>
                      <div className="dt-title">{p.title}</div>
                      <div className="dt-sub mono-sm">{slug}</div>
                    </div>
                    <div className="dt-sub">{p.siteLabel}</div>
                    <div><span className={'pill ' + (p.status === 'published' ? 'pill-teal' : 'pill-dim')}>{p.status}</span></div>
                    <div className="r mono-sm" style={{ color: 'var(--text-3)' }}>{p.updatedAt}</div>
                    <div className="dt-act">
                      {p.url && <a href={p.url} target="_blank" rel="noreferrer"><button className="icon-btn"><I.Ext size={12} /></button></a>}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div className="dt-head" style={{ gridTemplateColumns: '8px 1fr 100px 90px 80px 32px' }}>
                <div /><div>Page · URL</div><div>Site</div><div>Status</div>
                <div className="r">Updated</div><div />
              </div>
              {rows.map((p, i) => {
                const site = SITES.find(s => s.id === p.siteId);
                return (
                  <div key={i} className="dt-row" style={{ gridTemplateColumns: '8px 1fr 100px 90px 80px 32px' }}>
                    <div className="dt-site-dot" style={{ background: site.hue }} />
                    <div>
                      <div className="dt-title">{p.title}</div>
                      <div className="dt-sub mono-sm">{p.url}</div>
                    </div>
                    <div className="dt-sub">{site.initials}</div>
                    <div><span className={'pill ' + (p.status === 'published' ? 'pill-teal' : 'pill-dim')}>{p.status}</span></div>
                    <div className="r mono-sm" style={{ color: 'var(--text-3)' }}>{p.updated}</div>
                    <div className="dt-act"><button className="icon-btn"><I.Ext size={12} /></button></div>
                  </div>
                );
              })}
            </>
          )}
          <div className="dt-foot">
            <span>Showing {rows.length}{!isLive && ' of 47'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280, flexShrink: 0 }}>
          {!isLive && (
            <>
              <div className="widget">
                <div className="widget-title">Recent Activity</div>
                {[
                  { t: 'Privacy Policy', a: 'updated',   s: 'wd', ago: '2h ago' },
                  { t: 'Start Here',     a: 'published', s: 'qm', ago: '1d ago' },
                  { t: 'Coming Soon',    a: 'created',   s: 'ng', ago: '3d ago' },
                ].map((it, i) => {
                  const site = SITES.find(s => s.id === it.s);
                  return (
                    <div key={i} className="act-row">
                      <span className="act-dot" style={{ background: site.hue }} />
                      <div className="act-body">
                        <span className="act-title">{it.t}</span>
                        <span className="act-sub"> was {it.a}</span>
                      </div>
                      <span className="act-time">{it.ago}</span>
                    </div>
                  );
                })}
              </div>
              <div className="widget">
                <div className="widget-title">Storage</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>
                  <span>Database usage</span>
                  <span style={{ fontFamily: 'var(--mono)' }}>74%</span>
                </div>
                <div className="prog-track"><div className="prog-fill" style={{ width: '74%' }} /></div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8, fontFamily: 'var(--mono)' }}>
                  Next backup in 4h 22m
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
