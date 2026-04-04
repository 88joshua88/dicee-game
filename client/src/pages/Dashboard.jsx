import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardProfile      from './dashboard/DashboardProfile';
import DashboardMyAdventures from './dashboard/DashboardMyAdventures';
import DashboardFind         from './dashboard/DashboardFind';
import DashboardSettings     from './dashboard/DashboardSettings';
import './Dashboard.css';

const NAV_ITEMS = [
  { id: 'profile',    icon: '👤', label: 'My Profile' },
  { id: 'adventures', icon: '🧭', label: 'My Adventures' },
  { id: 'find',       icon: '🌍', label: 'Find Adventures' },
  { id: 'settings',   icon: '⚙️',  label: 'Settings' },
];

const SECTION_MAP = {
  profile:    DashboardProfile,
  adventures: DashboardMyAdventures,
  find:       DashboardFind,
  settings:   DashboardSettings,
};

/**
 * Dashboard — main hub for logged-in users.
 *
 * Two-column layout:
 *   Left sidebar  (260px) — dark, logo + nav + user info
 *   Right content (flex 1) — warm white, one section at a time
 *
 * On mobile: sidebar collapses; bottom navigation bar appears instead.
 */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const [active, setActive] = useState('adventures');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const ActiveSection = SECTION_MAP[active];

  const initials = (user?.name || '?')[0].toUpperCase();

  return (
    <div className="db">

      {/* ══ Sidebar ══════════════════════════════════════════════ */}
      <aside className="db__sidebar">
        <div className="db__sidebar-inner">

          {/* Logo */}
          <Link to="/" className="db__logo">
            Stray&nbsp;Dog
            <span className="db__logo-accent">&nbsp;Blog</span>
          </Link>

          {/* Navigation */}
          <nav className="db__nav" aria-label="Dashboard navigation">
            {NAV_ITEMS.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`db__nav-item${active === id ? ' db__nav-item--active' : ''}`}
                onClick={() => setActive(id)}
              >
                <span className="db__nav-icon" aria-hidden="true">{icon}</span>
                <span className="db__nav-label">{label}</span>
              </button>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="db__sidebar-footer">
            <div className="db__user">
              <div className="db__user-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} />
                ) : (
                  initials
                )}
              </div>
              <div className="db__user-info">
                <span className="db__user-name">{user?.name}</span>
                <span className="db__user-email">{user?.email}</span>
              </div>
            </div>
            <button className="db__logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* ══ Main content ══════════════════════════════════════════ */}
      <main className="db__main">
        <ActiveSection />
      </main>

      {/* ══ Mobile bottom navigation ══════════════════════════════ */}
      <nav className="db__bottom-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map(({ id, icon, label }) => (
          <button
            key={id}
            className={`db__bottom-nav-item${active === id ? ' db__bottom-nav-item--active' : ''}`}
            onClick={() => setActive(id)}
          >
            <span className="db__bottom-nav-icon" aria-hidden="true">{icon}</span>
            <span className="db__bottom-nav-label">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Dashboard;
