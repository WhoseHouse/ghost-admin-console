import { useState, useMemo } from 'react';
import { I } from '../components/icons.jsx';
import { SITES, ACTIVITY, SPARKS, sparkPath, fmtNum, compactDate, relTime } from '../data/mockData.js';

function MetricCard({ label, value, icon, delta, sparkKey }) {
  const Ic = I[icon];
  const pts = SPARKS[sparkKey];
  const { line, area } = sparkPath(pts);
  const cls = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
  return (
    <div className="metric">
      <div className="metric-label">
        {Ic && <Ic size={12} />}
        {label}
      </div>
      <div className="metric-value">{fmtNum(value)}</div>
      <div className="metric-foot">
        <span className={'delta ' + cls}>
          {arrow} {delta > 0 ? '+' : ''}{fmtNum(Math.abs(delta))} this wk
        </span>
        <svg className="spark" viewBox="0 0 64 18">
          <path className="area" d={area} />
          <path d={line} />
        </svg>
      </div>
    </div>
  );
}

function SiteCard({ site }) {
  const bg = site.hue.replace(')', ' / 0.18)');
  const border = site.hue.replace(')', ' / 0.35)');
  return (
    <div className="site">
      <div className="site-head">
        <div className="site-fav" style={{ background: bg, color: site.hue, borderColor: border }}>
          {site.initials}
        </div>
        <div className="site-id">
          <div className="site-name">
            {site.name}
            <I.Ext size={11} style={{ color: 'var(--text-3)' }} />
          </div>
          <div className="site-url">{site.url}</div>
        </div>
        <div className={'status ' + site.status}>
          <span className="d" />
          {site.status === 'online' ? 'online' : site.status === 'warn' ? 'stale' : 'offline'}
        </div>
      </div>

      <div className="site-stats">
        <div className="stat">
          <div className="stat-l">Members</div>
          <div className="stat-v">
            {fmtNum(site.members)}
            <span className="sub">· {fmtNum(site.paidMembers)} paid</span>
          </div>
        </div>
        <div className="stat">
          <div className="stat-l">Posts</div>
          <div className="stat-v">
            {fmtNum(site.published)}
            <span className="sub">/ {fmtNum(site.posts)}</span>
          </div>
        </div>
      </div>

      <div className="last-post">
        <div className="last-post-label">Last published</div>
        <div className="last-post-title">{site.last.title}</div>
        <div className="last-post-meta">{compactDate(site.last.date)} · {relTime(site.last.date)}</div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  return (
    <div className="activity">
      <div className="feed-head">
        <div>Site</div>
        <div>Title</div>
        <div className="right">Author</div>
        <div className="right">Published</div>
      </div>
      {ACTIVITY.map((it, i) => {
        const site = SITES.find(s => s.id === it.siteId);
        return (
          <div key={i} className="feed-row">
            <span className="badge">
              <span className="sw" style={{ background: site.hue }} />
              {site.initials}
            </span>
            <div className="ttl">
              {it.title}
              <span className="tag">{it.tag}</span>
            </div>
            <div className="auth">
              <div className="av">CH</div>
              {it.author}
            </div>
            <div className="meta">{relTime(it.date)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState('30d');

  const totals = useMemo(() => {
    const t = { posts: 0, published: 0, members: 0, paid: 0 };
    SITES.forEach(s => {
      t.posts += s.posts;
      t.published += s.published;
      t.members += s.members;
      t.paid += s.paidMembers;
    });
    return t;
  }, []);

  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">
            Aggregate across <span className="mono">6 sites</span> · <span className="mono">May 3, 2026 · 11:00</span>
          </p>
        </div>
        <div className="head-tools">
          <div className="seg">
            {['7d', '30d', '90d', 'ytd'].map(r => (
              <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>
          <button className="btn"><I.Refresh size={13} /> Sync</button>
          <button className="btn primary"><I.Plus size={13} /> New post</button>
        </div>
      </div>

      <div className="metrics">
        <MetricCard label="Total Posts"   value={totals.posts}     icon="Doc"     delta={11}  sparkKey="posts" />
        <MetricCard label="Published"     value={totals.published} icon="Send"    delta={11}  sparkKey="published" />
        <MetricCard label="Total Members" value={totals.members}   icon="Members" delta={500} sparkKey="members" />
        <MetricCard label="Paid Members"  value={totals.paid}      icon="User"    delta={26}  sparkKey="paidMembers" />
      </div>

      <div className="sec-head">
        <div className="sec-title">
          Sites <span className="sec-count">{SITES.length}</span>
        </div>
        <div className="sec-actions">
          <span>sorted by activity</span><span>·</span><span>↻ 30s</span>
        </div>
      </div>
      <div className="sites">
        {SITES.map(s => <SiteCard key={s.id} site={s} />)}
      </div>

      <div className="sec-head">
        <div className="sec-title">
          Recent Activity <span className="sec-count">last 10</span>
        </div>
        <div className="sec-actions"><span>across all sites</span></div>
      </div>
      <ActivityFeed />
    </div>
  );
}
