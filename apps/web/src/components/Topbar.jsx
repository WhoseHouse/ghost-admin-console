import { useEffect, useRef } from 'react';
import { I } from './icons.jsx';
import useSiteStore from '../store/siteStore.js';
import { SITES } from '../data/mockData.js';

export default function Topbar() {
  const { selectedSiteId, setSelectedSiteId, ddOpen, setDdOpen } = useSiteStore();
  const ddRef = useRef(null);
  const isAll = selectedSiteId === 'all' || !selectedSiteId;
  const activeSite = SITES.find(s => s.id === selectedSiteId);

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

  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark">G</div>
        <div className="brand-word">Ghost Console</div>
      </div>

      <div className="topbar-tools">
        <div ref={ddRef} style={{ position: 'relative' }}>
          <div className="site-select" onClick={() => setDdOpen(!ddOpen)}>
            <span className={'dot' + (isAll ? ' all' : '')} style={dotStyle} />
            {isAll ? (
              <>
                <span className="name">All Sites</span>
                <span className="url">{SITES.length} active</span>
              </>
            ) : (
              <>
                <span className="name">{activeSite?.name}</span>
                <span className="url">{activeSite?.url}</span>
              </>
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
                  <div className="sec">aggregate · {SITES.length} active</div>
                </span>
                {isAll && <I.Check size={14} style={{ color: 'var(--accent)' }} />}
              </div>
              <div className="dd-divider" />
              {SITES.map(s => (
                <div
                  key={s.id}
                  className={'dd-item' + (selectedSiteId === s.id ? ' active' : '')}
                  onClick={() => { setSelectedSiteId(s.id); setDdOpen(false); }}
                >
                  <span className="sw" style={{ background: s.hue }} />
                  <span className="nm">
                    <div className="pr">{s.name}</div>
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

        <div className="topbar-spacer" />

        <button className="icon-btn" title="Search">
          <I.Search size={15} />
        </button>
        <button className="icon-btn" title="Notifications">
          <I.Bell size={15} />
          <span className="badge" />
        </button>
        <div className="avatar" title="Chris">CH</div>
      </div>
    </div>
  );
}
