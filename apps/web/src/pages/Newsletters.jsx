import { I } from '../components/icons.jsx';
import { SITES, fmtNum } from '../data/mockData.js';

const NEWSLETTERS = [
  { siteId:"qm", name:"Quiet Machines Weekly",   subs:12380, openRate:"52.4%", clickRate:"14.1%", lastSent:"2026-05-02", cadence:"Weekly",    status:"active"  },
  { siteId:"wd", name:"Wavelength Daily Digest",  subs:8420,  openRate:"48.7%", clickRate:"11.8%", lastSent:"2026-05-02", cadence:"Daily",     status:"active"  },
  { siteId:"fl", name:"Field Notes",              subs:1942,  openRate:"61.2%", clickRate:"18.4%", lastSent:"2026-05-01", cadence:"Weekly",    status:"active"  },
  { siteId:"rh", name:"Roomhouse Signal",         subs:3140,  openRate:"44.9%", clickRate:"9.2%",  lastSent:"2026-04-30", cadence:"Bi-weekly", status:"active"  },
  { siteId:"tn", name:"Tide & Nail Updates",      subs:624,   openRate:"38.1%", clickRate:"6.7%",  lastSent:"2026-04-28", cadence:"Monthly",   status:"warn"    },
  { siteId:"ng", name:"Nightgrade — TBD",         subs:0,     openRate:"—",     clickRate:"—",     lastSent:"—",          cadence:"—",         status:"offline" },
];

export default function Newsletters() {
  const totalSubs = NEWSLETTERS.reduce((a, n) => a + n.subs, 0);

  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Newsletters</h1>
          <p className="page-sub">
            <span className="mono">6 newsletters</span> · <span className="mono">{fmtNum(totalSubs)} total subscribers</span>
          </p>
        </div>
        <div className="head-tools">
          <button className="btn primary"><I.Plus size={13} /> New newsletter</button>
        </div>
      </div>

      <div className="metrics" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Subscribers', val: fmtNum(totalSubs), sub: '↑ 500 this week',   cls: 'up' },
          { label: 'Avg Open Rate',     val: '48.2%',            sub: '↑ 2.1% MoM',        cls: 'up' },
          { label: 'Avg Click Rate',    val: '12.5%',            sub: '↓ 0.8% MoM',        cls: 'down' },
          { label: 'Campaigns Sent',    val: '284',              sub: '↑ 5.6% this month', cls: 'up' },
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

      <div className="nl-grid">
        {NEWSLETTERS.map((nl, i) => {
          const site = SITES.find(s => s.id === nl.siteId);
          const openNum = nl.openRate !== '—' ? parseFloat(nl.openRate) : 0;
          const statusCls = nl.status === 'active' ? 'online' : nl.status === 'warn' ? 'warn' : 'offline';
          const statusLabel = nl.status === 'active' ? 'active' : nl.status === 'warn' ? 'stale' : 'setup';
          return (
            <div key={i} className="nl-card">
              <div className="nl-head">
                <div className="site-fav" style={{
                  background: site.hue.replace(')', '/0.15)'),
                  color: site.hue,
                  borderColor: site.hue.replace(')', '/0.3)'),
                  width: 32, height: 32, fontSize: 12,
                }}>
                  {site.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.005em' }}>{nl.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--text-3)' }}>{site.url}</div>
                </div>
                <div className={'status ' + statusCls}>
                  <span className="d" />{statusLabel}
                </div>
              </div>

              <div className="nl-stats">
                <div className="nl-stat">
                  <div className="nl-stat-l">Subscribers</div>
                  <div className="nl-stat-v">{fmtNum(nl.subs)}</div>
                </div>
                <div className="nl-stat">
                  <div className="nl-stat-l">Open Rate</div>
                  <div className="nl-stat-v" style={{ color: openNum > 50 ? 'var(--teal)' : openNum > 0 ? 'var(--text)' : 'var(--text-3)' }}>
                    {nl.openRate}
                  </div>
                </div>
                <div className="nl-stat">
                  <div className="nl-stat-l">Click Rate</div>
                  <div className="nl-stat-v">{nl.clickRate}</div>
                </div>
                <div className="nl-stat">
                  <div className="nl-stat-l">Cadence</div>
                  <div className="nl-stat-v" style={{ fontSize: 12 }}>{nl.cadence}</div>
                </div>
              </div>

              {nl.openRate !== '—' && (
                <div style={{ padding: '10px 12px 0', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--text-3)', marginBottom: 4, fontFamily: 'var(--mono)' }}>
                    <span>open rate</span><span>{nl.openRate}</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{
                      width: nl.openRate,
                      background: `color-mix(in srgb, var(--teal) ${openNum > 50 ? 100 : 70}%, var(--accent))`,
                    }} />
                  </div>
                </div>
              )}

              <div className="nl-foot">
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--text-3)' }}>
                  Last sent {nl.lastSent === '—' ? 'never' : nl.lastSent}
                </span>
                <button className="btn" style={{ height: 24, padding: '0 10px', fontSize: 11 }}>
                  <I.Send size={11} /> Compose
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
