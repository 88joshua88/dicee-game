import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Navbar — top navigation for EnergeX.
 * Shows different links depending on whether the user is logged in.
 * Collapses to a hamburger menu on mobile.
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu  = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          Energe<span className="navbar__brand-dot">X</span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          <li>
            <NavLink to="/marketplace" className={({ isActive }) => isActive ? 'active' : ''}>
              Marketplace
            </NavLink>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/profile/${user?._id}`}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {user?.name?.split(' ')[0]}
                </NavLink>
              </li>
              <li>
                <button className="navbar__logout" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => `navbar__cta${isActive ? ' active' : ''}`}>
                  Get Started
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Hamburger (mobile) */}
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`navbar__mobile${menuOpen ? ' open' : ''}`}>
        <ul>
          <li><NavLink to="/marketplace" onClick={closeMenu}>Marketplace</NavLink></li>

          {isAuthenticated ? (
            <>
              <li><NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink></li>
              <li>
                <NavLink to={`/profile/${user?._id}`} onClick={closeMenu}>
                  My Profile
                </NavLink>
              </li>
              <li>
                <button className="navbar__mobile-logout" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
              <li><NavLink to="/register" onClick={closeMenu}>Get Started</NavLink></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
