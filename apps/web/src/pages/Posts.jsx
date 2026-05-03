import { useState } from 'react';
import { I } from '../components/icons.jsx';
import { SITES, fmtNum } from '../data/mockData.js';
import { useLivePosts } from '../hooks/useLiveData.js';
import useSiteStore from '../store/siteStore.js';

const HUE_PALETTE = [
  'oklch(0.66 0.13 35)', 'oklch(0.74 0.11 180)', 'oklch(0.62 0.10 260)',
  'oklch(0.74 0.13 80)', 'oklch(0.55 0.10 320)', 'oklch(0.66 0.15 25)',
];

const MOCK_POSTS = [
  { siteId:"qm", title:"Why I'm betting on small models for the long tail", tag:"essay",   status:"published", views:"12.4k", reads:"8.2k",  date:"2026-05-02" },
  { siteId:"wd", title:"The slow internet is winning again",                 tag:"weekly",  status:"published", views:"9.1k",  reads:"6.7k",  date:"2026-05-02" },
  { siteId:"fl", title:"What soil temperature actually tells you",            tag:"field",   status:"published", views:"3.8k",  reads:"3.1k",  date:"2026-05-01" },
  { siteId:"rh", title:"Mixtape 47 — late lamp light",                       tag:"mix",     status:"published", views:"5.2k",  reads:"4.9k",  date:"2026-04-30" },
  { siteId:"qm", title:"Three weeks with the new evals stack",               tag:"log",     status:"published", views:"18.7k", reads:"11.2k", date:"2026-04-29" },
  { siteId:"tn", title:"Spring restock: a small note on returns",            tag:"shop",    status:"published", views:"1.2k",  reads:"0.9k",  date:"2026-04-28" },
  { siteId:"wd", title:"Found objects, vol. 12",                             tag:"links",   status:"published", views:"7.4k",  reads:"5.8k",  date:"2026-04-27" },
  { siteId:"qm", title:"Inference cost is a UX problem now",                 tag:"essay",   status:"draft",     views:"—",     reads:"—",     date:"2026-04-26" },
  { siteId:"fl", title:"Compost bin temperatures, week 16",                  tag:"data",    status:"published", views:"2.1k",  reads:"1.8k",  date:"2026-04-25" },
  { siteId:"ng", title:"Opening night — what this site is for",              tag:"intro",   status:"draft",     views:"—",     reads:"—",     date:"2026-04-22" },
];

function initials(label = '') {
  return label.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

export default function Posts() {
  const { dataSource } = useSiteStore();
  const isLive = dataSource === 'live';

  const [filter, setFilter] = useState('all');
  const [siteFilter, setSiteFilter] = useState('all');

  const { data: livePosts = [], isLoading, error } = useLivePosts({ status: filter, limit: 50 });

  // ── mock path ──
  const mockFiltered = MOCK_POSTS.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (siteFilter !== 'all' && p.siteId !== siteFilter) return false;
    return true;
  });

  // ── live path ──
  const liveFiltered = livePosts.filter(p => {
    if (siteFilter !== 'all' && p.siteId !== siteFilter) return false;
    return true;
  });

  const rows    = isLive ? liveFiltered : mockFiltered;
  const total   = isLive ? livePosts.length : 1391;

  const liveTotal = isLive ? livePosts.length : null;

  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Posts</h1>
          <p className="page-sub">
            {isLive
              ? (error ? <span style={{ color: 'var(--red)' }}>API error: {error.message}</span>
                : <><span className="mono">{liveTotal ?? '…'} posts</span> from your sites</>)
              : <><span className="mono">1,391 posts</span> across <span className="mono">6 sites</span></>
            }
          </p>
        </div>
        <div className="head-tools">
          <div className="v-filter">
            {['all', 'published', 'draft'].map(f => (
              <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          {!isLive && (
            <select className="select-sm" value={siteFilter} onChange={e => setSiteFilter(e.target.value)}>
              <option value="all">All Sites</option>
              {SITES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
          <button className="btn primary"><I.Plus size={13} /> New post</button>
        </div>
      </div>

      {/* metrics row */}
      {isLive ? (
        <div className="metrics" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Posts',  val: isLoading ? '…' : fmtNum(livePosts.length), sub: 'fetched live' },
            { label: 'Published',    val: isLoading ? '…' : fmtNum(livePosts.filter(p => p.status === 'published').length), sub: '', cls: 'up' },
            { label: 'Drafts',       val: isLoading ? '…' : fmtNum(livePosts.filter(p => p.status === 'draft').length), sub: 'in progress', cls: 'flat' },
            { label: 'Sites',        val: isLoading ? '…' : String([...new Set(livePosts.map(p => p.siteId))].length), sub: 'contributing' },
          ].map(m => (
            <div key={m.label} className="metric" style={{ padding: '14px 16px' }}>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value" style={{ fontSize: 28, marginTop: 10 }}>{m.val}</div>
              <div className="metric-foot"><span className={'delta ' + (m.cls || 'flat')}>{m.sub}</span></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="metrics" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Posts',    val: '1,391', sub: 'across 6 sites' },
            { label: 'Published',      val: '1,274', sub: '↑ 11 this week', cls: 'up' },
            { label: 'Drafts',         val: '117',   sub: 'needs review',   cls: 'warn' },
            { label: 'Avg Engagement', val: '4.8%',  sub: '↑ vs 3.1% last mo', cls: 'up' },
          ].map(m => (
            <div key={m.label} className="metric" style={{ padding: '14px 16px' }}>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value" style={{ fontSize: 28, marginTop: 10 }}>{m.val}</div>
              <div className="metric-foot"><span className={'delta ' + (m.cls || 'flat')}>{m.sub}</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="data-table">
        {isLive ? (
          <>
            <div className="dt-head" style={{ gridTemplateColumns: '8px 1fr 90px 90px 80px 32px' }}>
              <div style={{ gridColumn: '1/3' }}>Post · Site</div>
              <div>Status</div>
              <div>Tags</div>
              <div className="r">Date</div>
              <div />
            </div>
            {isLoading && (
              <div style={{ padding: '20px 16px', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 12 }}>
                Loading posts…
              </div>
            )}
            {rows.map((p, i) => {
              const hue = HUE_PALETTE[i % HUE_PALETTE.length];
              return (
                <div key={p.id || i} className="dt-row" style={{ gridTemplateColumns: '8px 1fr 90px 90px 80px 32px' }}>
                  <div className="dt-site-dot" style={{ background: hue }} />
                  <div className="dt-main">
                    <div className="dt-title">{p.title}</div>
                    <div className="dt-sub">{p.siteLabel} · {p.siteUrl?.replace(/^https?:\/\//, '')}</div>
                  </div>
                  <div><span className={'pill ' + (p.status === 'published' ? 'pill-teal' : 'pill-dim')}>{p.status}</span></div>
                  <div className="mono-sm" style={{ color: 'var(--text-3)' }}>{p.tag || '—'}</div>
                  <div className="r mono-sm" style={{ color: 'var(--text-2)' }}>{p.date}</div>
                  <div className="dt-act">
                    {p.url && <a href={p.url} target="_blank" rel="noreferrer"><button className="icon-btn"><I.Ext size={12} /></button></a>}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <div className="dt-head">
              <div style={{ gridColumn: '1/3' }}>Post · Site</div>
              <div>Status</div>
              <div className="r">Views / Reads</div>
              <div className="r">Published</div>
              <div />
            </div>
            {rows.map((p, i) => {
              const site = SITES.find(s => s.id === p.siteId);
              return (
                <div key={i} className="dt-row">
                  <div className="dt-site-dot" style={{ background: site.hue }} />
                  <div className="dt-main">
                    <div className="dt-title">{p.title}<span className="tag">{p.tag}</span></div>
                    <div className="dt-sub">{site.name} · {site.url}</div>
                  </div>
                  <div><span className={'pill ' + (p.status === 'published' ? 'pill-teal' : 'pill-dim')}>{p.status}</span></div>
                  <div className="r mono-sm">
                    <span style={{ color: 'var(--text)' }}>{p.views}</span>
                    <span style={{ color: 'var(--text-3)' }}> / {p.reads}</span>
                  </div>
                  <div className="r mono-sm" style={{ color: 'var(--text-2)' }}>{p.date}</div>
                  <div className="dt-act"><button className="icon-btn"><I.Ext size={12} /></button></div>
                </div>
              );
            })}
          </>
        )}
        <div className="dt-foot">
          <span>Showing {rows.length} of {fmtNum(total)}</span>
          {!isLive && (
            <div className="pg">
              <button className="pg-btn">‹</button>
              <button className="pg-btn on">1</button>
              <button className="pg-btn">2</button>
              <button className="pg-btn">3</button>
              <button className="pg-btn">›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
