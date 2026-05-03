import { useState } from 'react';
import { I } from '../components/icons.jsx';
import { SITES, fmtNum } from '../data/mockData.js';

const MEMBERS_DATA = [
  { initials:"EJ", name:"Elena J. Rodriguez", email:"elena.j@proton.me",     siteId:"qm", tier:"paid",  joined:"2026-01-12", lastSeen:"2m ago" },
  { initials:"MS", name:"Marcus Smith",       email:"marcus_smith@gmail.com", siteId:"wd", tier:"free",  joined:"2025-09-28", lastSeen:"1h ago" },
  { initials:"SK", name:"Sarah K.",           email:"s.chen@futurecorp.io",   siteId:"fl", tier:"paid",  joined:"2025-08-04", lastSeen:"yesterday" },
  { initials:"KL", name:"Kasper Larsen",      email:"k.larsen@nordic.com",    siteId:"wd", tier:"free",  joined:"2025-07-19", lastSeen:"3d ago" },
  { initials:"AO", name:"Anita Owens",        email:"a.owens@outlook.com",    siteId:"rh", tier:"paid",  joined:"2025-06-30", lastSeen:"Apr 24" },
  { initials:"JD", name:"James Dalton",       email:"james@dalton.io",        siteId:"qm", tier:"paid",  joined:"2026-02-01", lastSeen:"4h ago" },
  { initials:"MT", name:"Mark Thompson",      email:"mark@thompson.net",      siteId:"wd", tier:"free",  joined:"2025-11-15", lastSeen:"6d ago" },
  { initials:"PR", name:"Priya Rao",          email:"priya@rao.dev",          siteId:"qm", tier:"paid",  joined:"2026-03-10", lastSeen:"1h ago" },
];

export default function Members() {
  const [tierFilter, setTierFilter] = useState('all');
  const shown = MEMBERS_DATA.filter(m => tierFilter === 'all' || m.tier === tierFilter);

  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-sub">
            <span className="mono">26,506</span> total · <span className="mono">2,187 paid</span> across 6 sites
          </p>
        </div>
        <div className="head-tools">
          <div className="v-filter">
            {['all', 'paid', 'free'].map(f => (
              <button key={f} className={tierFilter === f ? 'on' : ''} onClick={() => setTierFilter(f)}>{f}</button>
            ))}
          </div>
          <button className="btn"><I.Filter size={13} /> Filter</button>
          <button className="btn primary"><I.Plus size={13} /> Add member</button>
        </div>
      </div>

      <div className="metrics" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Members',    val: '26,506', sub: '↑ 500 this week', cls: 'up' },
          { label: 'Paid Subscribers', val: '2,187',  sub: '↑ 26 this week',  cls: 'up' },
          { label: 'Monthly Revenue',  val: '$42.1k', sub: '↑ 18% MoM',       cls: 'up' },
          { label: 'Retention Rate',   val: '94.2%',  sub: '↑ vs 91.4% avg',  cls: 'up' },
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

      <div className="tw-col" style={{ gap: 16 }}>
        <div className="data-table" style={{ flex: '1 1 0' }}>
          <div className="dt-head" style={{ gridTemplateColumns: '8px 1fr 90px 70px 90px 80px 32px' }}>
            <div /><div>Member</div><div>Site</div><div>Tier</div>
            <div>Joined</div><div className="r">Last seen</div><div />
          </div>
          {shown.map((m, i) => {
            const site = SITES.find(s => s.id === m.siteId);
            return (
              <div key={i} className="dt-row" style={{ gridTemplateColumns: '8px 1fr 90px 70px 90px 80px 32px' }}>
                <div className="dt-site-dot" style={{ background: site.hue }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="m-av" style={{
                    background: site.hue.replace(')', '/0.18)'),
                    color: site.hue,
                    borderColor: site.hue.replace(')', '/0.3)'),
                  }}>{m.initials}</div>
                  <div>
                    <div className="dt-title" style={{ fontWeight: 500 }}>{m.name}</div>
                    <div className="dt-sub">{m.email}</div>
                  </div>
                </div>
                <div className="dt-sub">{site.initials}</div>
                <div><span className={'pill ' + (m.tier === 'paid' ? 'pill-teal' : 'pill-dim')}>{m.tier}</span></div>
                <div className="mono-sm" style={{ color: 'var(--text-3)' }}>{m.joined}</div>
                <div className="r mono-sm" style={{ color: 'var(--text-2)' }}>{m.lastSeen}</div>
                <div className="dt-act"><button className="icon-btn"><I.Ext size={12} /></button></div>
              </div>
            );
          })}
          <div className="dt-foot">
            <span>Showing {shown.length} of 26,506</span>
            <div className="pg">
              <button className="pg-btn">‹</button>
              <button className="pg-btn on">1</button>
              <button className="pg-btn">2</button>
              <button className="pg-btn">›</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 260, flexShrink: 0 }}>
          <div className="widget">
            <div className="widget-title">Member Health</div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="7" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--teal)" strokeWidth="7"
                    strokeDasharray="251.2" strokeDashoffset="37.7" strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>85</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>excellent</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
              Engagement is <span style={{ color: 'var(--teal)', fontWeight: 600 }}>12% higher</span> than publishing platform avg.
            </p>
          </div>

          <div className="widget">
            <div className="widget-title">Recent Events</div>
            {[
              { t: 'Elena J. Rodriguez', a: 'upgraded to Annual Pro',          s: 'qm', ago: '2m ago',  dot: 'var(--teal)' },
              { t: 'New member',         a: 'joined from organic search',      s: 'fl', ago: '14m ago', dot: 'var(--text-3)' },
              { t: 'Subscription',       a: 'cancelled — d.miller@web.com',   s: 'wd', ago: '1h ago',  dot: 'var(--red)' },
            ].map((ev, i) => (
              <div key={i} className="act-row">
                <span className="act-dot" style={{ background: ev.dot }} />
                <div className="act-body">
                  <span className="act-title">{ev.t}</span>
                  <span className="act-sub"> {ev.a}</span>
                </div>
                <span className="act-time">{ev.ago}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
