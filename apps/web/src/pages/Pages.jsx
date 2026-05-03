import { I } from '../components/icons.jsx';
import { SITES } from '../data/mockData.js';

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
  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Pages</h1>
          <p className="page-sub"><span className="mono">47 pages</span> across <span className="mono">6 sites</span></p>
        </div>
        <div className="head-tools">
          <button className="btn primary"><I.Plus size={13} /> New page</button>
        </div>
      </div>

      <div className="metrics" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Pages',     val: '47', sub: 'across 6 sites' },
          { label: 'Published',       val: '40', sub: '85% ratio' },
          { label: 'Drafts',          val: '7',  sub: 'needs review',    cls: 'warn' },
          { label: 'Avg Perf Score',  val: '92', sub: '↑ vs last audit', cls: 'up' },
        ].map(m => (
          <div key={m.label} className="metric" style={{ padding: '14px 16px' }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ fontSize: 28, marginTop: 10 }}>{m.val}</div>
            <div className="metric-foot">
              <span className={'delta ' + (m.cls || 'flat')}>{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="tw-col">
        <div className="data-table" style={{ flex: '1 1 0' }}>
          <div className="dt-head" style={{ gridTemplateColumns: '8px 1fr 100px 90px 80px 32px' }}>
            <div /><div>Page · URL</div><div>Site</div><div>Status</div>
            <div className="r">Updated</div><div />
          </div>
          {PAGES_DATA.map((p, i) => {
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
          <div className="dt-foot"><span>Showing {PAGES_DATA.length} of 47</span></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280, flexShrink: 0 }}>
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
        </div>
      </div>
    </div>
  );
}
