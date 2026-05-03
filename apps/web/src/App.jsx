import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Posts from './pages/Posts.jsx';
import Pages from './pages/Pages.jsx';
import Members from './pages/Members.jsx';
import Newsletters from './pages/Newsletters.jsx';
import TiersOffers from './pages/TiersOffers.jsx';
import Settings from './pages/Settings.jsx';
import useSiteStore from './store/siteStore.js';

const ACCENT_MAP = {
  coral: { hue: 35,  c: 0.15 },
  amber: { hue: 70,  c: 0.13 },
  blush: { hue: 15,  c: 0.14 },
  teal:  { hue: 180, c: 0.11 },
};

export default function App() {
  const { sidebarCollapsed, accent, density } = useSiteStore();

  useEffect(() => {
    const p = ACCENT_MAP[accent] || ACCENT_MAP.coral;
    const root = document.documentElement;
    root.style.setProperty('--accent', `oklch(0.74 ${p.c} ${p.hue})`);
    root.style.setProperty('--accent-soft', `oklch(0.74 ${p.c} ${p.hue} / 0.12)`);
    root.style.setProperty('--accent-line', `oklch(0.74 ${p.c} ${p.hue} / 0.45)`);
  }, [accent]);

  useEffect(() => {
    document.documentElement.style.setProperty('--row', density === 'dense' ? '30px' : '36px');
  }, [density]);

  return (
    <BrowserRouter>
      <div className="app" data-collapsed={String(sidebarCollapsed)}>
        <Topbar />
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/posts"       element={<Posts />} />
            <Route path="/pages"       element={<Pages />} />
            <Route path="/members"     element={<Members />} />
            <Route path="/newsletters" element={<Newsletters />} />
            <Route path="/tiers"       element={<TiersOffers />} />
            <Route path="/settings"    element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
