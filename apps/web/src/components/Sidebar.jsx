import { NavLink } from 'react-router-dom';
import { I } from './icons.jsx';
import useSiteStore from '../store/siteStore.js';

const NAV = [
  { to: '/dashboard',   label: 'Dashboard',     icon: 'Dashboard' },
  { to: '/posts',       label: 'Posts',          icon: 'Posts',      count: '1,391' },
  { to: '/pages',       label: 'Pages',          icon: 'Pages',      count: '47' },
  { to: '/members',     label: 'Members',        icon: 'Members',    count: '26.5k' },
  { to: '/newsletters', label: 'Newsletters',    icon: 'Newsletter', count: '6' },
  { to: '/tiers',       label: 'Tiers & Offers', icon: 'Tiers',      count: '3' },
];

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useSiteStore();

  return (
    <aside className="sidebar">
      <div className="nav-section-label">Workspace</div>

      {NAV.map(({ to, label, icon, count }) => {
        const Ic = I[icon];
        return (
          <NavLink
            key={to}
            to={to}
            title={sidebarCollapsed ? label : undefined}
            className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
          >
            <Ic size={15} />
            <span className="label">{label}</span>
            {count && <span className="count">{count}</span>}
          </NavLink>
        );
      })}

      <div className="nav-section-label">System</div>
      <NavLink
        to="/settings"
        className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        title={sidebarCollapsed ? 'Settings' : undefined}
      >
        <I.Settings size={15} />
        <span className="label">Settings</span>
      </NavLink>

      <div
        className="sidebar-footer"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="pulse" />
        <span className="ftxt">all systems nominal · v0.1.0</span>
      </div>
    </aside>
  );
}
