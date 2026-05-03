import { useState, useMemo } from 'react';
import { I } from '../components/icons.jsx';
import { SITES, ACTIVITY, SPARKS, sparkPath, fmtNum, compactDate, relTime } from '../data/mockData.js';
import { useLiveStats, useLivePosts } from '../hooks/useLiveData.js';
import useSiteStore from '../store/siteStore.js';

// ── Metric card ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, icon, delta, sparkKey }) {
  const Ic = I[icon];
  const pts = SPARKS[sparkKey];
  const { line, area } = sparkPath(pts);
  const cls = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
  return (
    <div className="metric">
      <div className="metric-label">{Ic && <Ic size={12} />}{label}</div>
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

function LiveMetricCard({ label, value, icon }) {
  const Ic = I[icon];
  return (
    <div className="metric">
      <div className="metric-label">{Ic && <Ic size={12} />}{label}</div>
      <div className="metric-value">{value === null ? '—' : fmtNum(value)}</div>
    </div>
  );
}

// ── Site card ────────────────────────────────────────────────────────────────

const HUE_PALETTE = [
  'oklch(0.66 0.13 35)', 'oklch(0.74 0.11 180)', 'oklch(0.62 0.10 260)',
  'oklch(0.74 0.13 80)', 'oklch(0.55 0.10 320)', 'oklch(0.66 0.15 25)',
];

function siteHue(index) { return HUE_PALETTE[index % HUE_PALETTE.length]; }

function initials(label = '') {
  return label.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function MockSiteCard({ site }) {
  const bg = site.hue.replace(')', ' / 0.18)');
  const border = site.hue.replace(')', ' / 0.35)');
  return (
    <div className="site">
      <div className="site-head">
        <div className="site-fav" style={{ background: bg, color: site.hue, borderColor: border }}>
          {site.initials}
        </div>
        <div className="site-id">
          <div className="site-name">{site.name}<I.Ext size={11} style={{ color: 'var(--text-3)' }} /></div>
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
          <div className="stat-v">{fmtNum(site.members)}<span className="sub">· {fmtNum(site.paidMembers)} paid</span></div>
        </div>
        <div className="stat">
          <div className="stat-l">Posts</div>
          <div className="stat-v">{fmtNum(site.published)}<span className="sub">/ {fmtNum(site.posts)}</span></div>
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

function LiveSiteCard({ site, index }) {
  const hue = siteHue(index);
  const bg = hue.replace(')', ' / 0.18)');
  const border = hue.replace(')', ' / 0.35)');
  const ini = initials(site.label);
  const lastDate = site.lastPost?.date ? new Date(site.lastPost.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;
  return (
    <div className="site">
      <div className="site-head">
        <div className="site-fav" style={{ background: bg, color: hue, borderColor: border }}>{ini}</div>
        <div className="site-id">
          <div className="site-name">
            {site.label}
            <a href={site.url} target="_blank" rel="noreferrer">
              <I.Ext size={11} style={{ color: 'var(--text-3)' }} />
            </a>
          </div>
          <div className="site-url">{site.url.replace(/^https?:\/\//, '')}</div>
        </div>
        <div className={'status ' + site.status}>
          <span className="d" />
          {site.status}
        </div>
      </div>
      <div className="site-stats">
        <div className="stat">
          <div className="stat-l">Members</div>
          <div className="stat-v">{fmtNum(site.members)}<span className="sub">· {fmtNum(site.paidMembers)} paid</span></div>
        </div>
        <div className="stat">
          <div className="stat-l">Posts</div>
          <div className="stat-v">{fmtNum(site.published)}<span className="sub">/ {fmtNum(site.posts)}</span></div>
        </div>
      </div>
      {site.lastPost && (
        <div className="last-post">
          <div className="last-post-label">Last published</div>
          <div className="last-post-title">{site.lastPost.title}</div>
          <div className="last-post-meta">{lastDate}</div>
        </div>
      )}
    </div>
  );
}

// ── Activity feed ────────────────────────────────────────────────────────────

function MockActivityFeed() {
  return (
    <div className="activity">
      <div className="feed-head">
        <div>Site</div><div>Title</div>
        <div className="right">Author</div><div className="right">Published</div>
      </div>
      {ACTIVITY.map((it, i) => {
        const site = SITES.find(s => s.id === it.siteId);
        return (
          <div key={i} className="feed-row">
            <span className="badge"><span className="sw" style={{ background: site.hue }} />{site.initials}</span>
            <div className="ttl">{it.title}<span className="tag">{it.tag}</span></div>
            <div className="auth"><div className="av">CH</div>{it.author}</div>
            <div className="meta">{relTime(it.date)}</div>
          </div>
        );
      })}
    </div>
  );
}

function LiveActivityFeed({ posts }) {
  if (!posts?.length) return (
    <div className="activity" style={{ padding: '24px 16px', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 12 }}>
      No published posts found.
    </div>
  );
  return (
    <div className="activity">
      <div className="feed-head">
        <div>Site</div><div>Title</div>
        <div className="right">Status</div><div className="right">Published</div>
      </div>
      {posts.map((p, i) => {
        const hue = siteHue(i % HUE_PALETTE.length);
        const ini = initials(p.siteLabel);
        const dateStr = p.date && p.date !== '—'
          ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : '—';
        return (
          <div key={p.id || i} className="feed-row">
            <span className="badge"><span className="sw" style={{ background: hue }} />{ini}</span>
            <div className="ttl">{p.title}{p.tag && <span className="tag">{p.tag}</span>}</div>
            <div className="auth">{p.siteLabel}</div>
            <div className="meta">{dateStr}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [range, setRange] = useState('30d');
  const { dataSource } = useSiteStore();
  const isLive = dataSource === 'live';

  const { data: statsData, isLoading: statsLoading, error: statsError } = useLiveStats();
  const { data: livePosts, isLoading: postsLoading } = useLivePosts({ status: 'published', limit: 10 });

  const mockTotals = useMemo(() => {
    const t = { posts: 0, published: 0, members: 0, paid: 0 };
    SITES.forEach(s => { t.posts += s.posts; t.published += s.published; t.members += s.members; t.paid += s.paidMembers; });
    return t;
  }, []);

  const liveTotals = statsData?.totals;
  const liveSites  = statsData?.sites ?? [];

  const siteCount = isLive ? liveSites.length : SITES.length;
  const loading   = isLive && (statsLoading || postsLoading);

  return (
    <div className="main-inner view-enter">
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">
            {isLive
              ? (statsError ? <span style={{ color: 'var(--red)' }}>API error: {statsError.message}</span>
                : `Live data · ${siteCount} site${siteCount !== 1 ? 's' : ''}`)
              : <>Aggregate across <span className="mono">6 sites</span> · <span className="mono">demo data</span></>
            }
          </p>
        </div>
        <div className="head-tools">
          {!isLive && (
            <div className="seg">
              {['7d', '30d', '90d', 'ytd'].map(r => (
                <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>{r}</button>
              ))}
            </div>
          )}
          <button className="btn" disabled={loading}>
            <I.Refresh size={13} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} /> Sync
          </button>
          <button className="btn primary"><I.Plus size={13} /> New post</button>
        </div>
      </div>

      {/* Metric cards */}
      {isLive ? (
        <div className="metrics">
          <LiveMetricCard label="Total Posts"   value={statsLoading ? null : liveTotals?.posts}       icon="Doc" />
          <LiveMetricCard label="Published"     value={statsLoading ? null : liveTotals?.published}   icon="Send" />
          <LiveMetricCard label="Total Members" value={statsLoading ? null : liveTotals?.members}     icon="Members" />
          <LiveMetricCard label="Paid Members"  value={statsLoading ? null : liveTotals?.paidMembers} icon="User" />
        </div>
      ) : (
        <div className="metrics">
          <MetricCard label="Total Posts"   value={mockTotals.posts}     icon="Doc"     delta={11}  sparkKey="posts" />
          <MetricCard label="Published"     value={mockTotals.published} icon="Send"    delta={11}  sparkKey="published" />
          <MetricCard label="Total Members" value={mockTotals.members}   icon="Members" delta={500} sparkKey="members" />
          <MetricCard label="Paid Members"  value={mockTotals.paid}      icon="User"    delta={26}  sparkKey="paidMembers" />
        </div>
      )}

      {/* Site cards */}
      <div className="sec-head">
        <div className="sec-title">Sites <span className="sec-count">{siteCount}</span></div>
        {!isLive && <div className="sec-actions"><span>sorted by activity</span><span>·</span><span>↻ 30s</span></div>}
      </div>
      <div className="sites">
        {isLive
          ? (statsLoading
            ? Array.from({ length: 1 }, (_, i) => <SkeletonCard key={i} />)
            : liveSites.map((s, i) => <LiveSiteCard key={s.id} site={s} index={i} />)
          )
          : SITES.map(s => <MockSiteCard key={s.id} site={s} />)
        }
      </div>

      {/* Activity feed */}
      <div className="sec-head">
        <div className="sec-title">
          Recent Activity <span className="sec-count">{isLive ? 'live' : 'last 10'}</span>
        </div>
        {!isLive && <div className="sec-actions"><span>across all sites</span></div>}
      </div>
      {isLive
        ? <LiveActivityFeed posts={postsLoading ? [] : livePosts} />
        : <MockActivityFeed />
      }
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="site" style={{ opacity: 0.4 }}>
      <div className="site-head">
        <div className="site-fav" style={{ background: 'var(--border)' }} />
        <div className="site-id">
          <div style={{ height: 14, width: 120, background: 'var(--border)', borderRadius: 4 }} />
          <div style={{ height: 11, width: 80, background: 'var(--border)', borderRadius: 4, marginTop: 6 }} />
        </div>
      </div>
    </div>
  );
}
