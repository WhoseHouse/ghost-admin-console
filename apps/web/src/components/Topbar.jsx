import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { I } from './icons.jsx';
import useSiteStore from '../store/siteStore.js';
import { SITES as MOCK_SITES } from '../data/mockData.js';

// Deterministic palette — cycles through these for any number of real sites
const HUE_PALETTE = [
  'oklch(0.66 0.13 35)',
  'oklch(0.74 0.11 180)',
  'oklch(0.62 0.10 260)',
  'oklch(0.74 0.13 80)',
  'oklch(0.55 0.10 320)',
  'oklch(0.66 0.15 25)',
  'oklch(0.70 0.12 140)',
  'oklch(0.65 0.12 300)',
];

function initials(label) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

async function fetchSites() {
  const res = await fetch('/api/sites');
  if (!res.ok) throw new Error('Failed to fetch sites');
  return res.json();
}

function enrichSites(apiSites) {
  return apiSites.map((s, i) => ({
    id: s.id,
    label: s.label,
    url: s.url,
    initials: initials(s.label),
    hue: HUE_PALETTE[i % HUE_PALETTE.length],
  }));
}

export default function Topbar() {
  const { selectedSiteId, setSelectedSiteId, ddOpen, setDdOpen, dataSource, setDataSource } = useSiteStore();
  const ddRef = useRef(null);
  const isLive = dataSource === 'live';

  const { data: rawSites = [], isError, isFetching } = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
    staleTime: 60_000,
    enabled: isLive,
  });

  // Unified site list — live fetches from API, mock uses hardcoded demo data
  const sites = isLive
    ? enrichSites(rawSites)
    : MOCK_SITES.map(s => ({ id: s.id, label: s.name, url: s.url, initials: s.initials, hue: s.hue }));

  const isAll = !selectedSiteId || selectedSiteId === 'all';
  const activeSite = sites.find(s => s.id === selectedSiteId);

  useEffect(() => {
    const onDoc = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [setDdOpen]);

  const dotStyle = !isAll && activeSite
    ? { background: activeSite.hue, boxShadow: `0 0 0 2px ${activeSite.hue.replace(')', ' / 0.18)')}` }
    : undefined;

  let siteWord;
  if (isLive && isError) siteWord = 'API unavailable';
  else if (isLive && isFetching && rawSites.length === 0) siteWord = 'loading…';
  else siteWord = `${sites.length} site${sites.length !== 1 ? 's' : ''}`;

  function handleToggle() {
    setDataSource(isLive ? 'mock' : 'live');
    setSelectedSiteId('all');
  }

  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark">G</div>
        <div className="brand-word">Ghost Console</div>
      </div>

      <div className="topbar-tools">
        {/* Site selector dropdown */}
        <div ref={ddRef} style={{ position: 'relative' }}>
          <div className="site-select" onClick={() => setDdOpen(!ddOpen)}>
            <span className={'dot' + (isAll ? ' all' : '')} style={dotStyle} />
            {isAll ? (
              <>
                <span className="name">All Sites</span>
                <span className="url">{siteWord}</span>
              </>
            ) : activeSite ? (
              <>
                <span className="name">{activeSite.label}</span>
                <span className="url">{activeSite.url}</span>
              </>
            ) : (
              <span className="name" style={{ color: 'var(--text-3)' }}>Select site…</span>
            )}
            <I.Chevron size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          </div>

          {ddOpen && (
            <div className="dropdown">
              <div className="dd-search">
                <I.Search size={14} />
                <input placeholder="Switch site…" autoFocus />
                <kbd>⌘K</kbd>
              </div>

              <div
                className={'dd-item' + (isAll ? ' active' : '')}
                onClick={() => { setSelectedSiteId('all'); setDdOpen(false); }}
              >
                <span className="sw" style={{ background: 'var(--accent)' }} />
                <span className="nm">
                  <div className="pr">All Sites</div>
                  <div className="sec">aggregate · {siteWord}</div>
                </span>
                {isAll && <I.Check size={14} style={{ color: 'var(--accent)' }} />}
              </div>

              {sites.length > 0 && <div className="dd-divider" />}

              {sites.map(s => (
                <div
                  key={s.id}
                  className={'dd-item' + (selectedSiteId === s.id ? ' active' : '')}
                  onClick={() => { setSelectedSiteId(s.id); setDdOpen(false); }}
                >
                  <span className="sw" style={{ background: s.hue }} />
                  <span className="nm">
                    <div className="pr">{s.label}</div>
                    <div className="sec">{s.url}</div>
                  </span>
                  {selectedSiteId === s.id && <I.Check size={14} style={{ color: 'var(--accent)' }} />}
                </div>
              ))}

              <div className="dd-divider" />
              <div className="dd-foot">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
              </div>
            </div>
          )}
        </div>

        {/* MOCK / LIVE data source toggle */}
        <button
          onClick={handleToggle}
          title={isLive ? 'Switch to mock data' : 'Switch to live data (sites.json)'}
          style={{
            height: 24,
            padding: '0 9px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            borderRadius: 4,
            border: `1px solid ${isLive ? 'oklch(0.74 0.11 180 / 0.4)' : 'var(--border-2)'}`,
            background: isLive ? 'oklch(0.74 0.11 180 / 0.1)' : 'var(--surface)',
            color: isLive ? 'var(--teal)' : 'var(--text-3)',
            fontFamily: 'var(--mono)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: isLive ? 'var(--teal)' : 'var(--text-3)',
            flexShrink: 0,
          }} />
          {isLive ? 'Live' : 'Mock'}
        </button>

        <div className="topbar-spacer" />

        <button className="icon-btn" title="Search"><I.Search size={15} /></button>
        <button className="icon-btn" title="Notifications">
          <I.Bell size={15} />
          <span className="badge" />
        </button>
        <div className="avatar" title="Chris">CH</div>
      </div>
    </div>
  );
}
