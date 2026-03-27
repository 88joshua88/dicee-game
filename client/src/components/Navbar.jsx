import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar — top navigation for EnergeX
 * - Brand on the left
 * - Nav links on the right
 * - Collapses to a hamburger menu on mobile
 */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          Energe<span className="navbar__brand-dot">X</span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink></li>
          <li>
            <NavLink to="/register" className={({ isActive }) => `navbar__cta${isActive ? ' active' : ''}`}>
              Get Started
            </NavLink>
          </li>
        </ul>

        {/* Hamburger button (mobile) */}
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`navbar__mobile${menuOpen ? ' open' : ''}`}>
        <ul>
          <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
          <li><NavLink to="/register" onClick={closeMenu}>Get Started</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
