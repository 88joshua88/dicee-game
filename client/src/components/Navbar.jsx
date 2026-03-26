import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar — top navigation for straydog.blog
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
          straydog<span className="navbar__brand-dot">.blog</span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/find-adventures" className={({ isActive }) => isActive ? 'active' : ''}>Find Adventures</NavLink></li>
          <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink></li>
          <li>
            <NavLink to="/signup" className={({ isActive }) => `navbar__cta${isActive ? ' active' : ''}`}>
              Sign Up
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
          <li><NavLink to="/find-adventures" onClick={closeMenu}>Find Adventures</NavLink></li>
          <li><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
          <li><NavLink to="/signup" onClick={closeMenu}>Sign Up</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
