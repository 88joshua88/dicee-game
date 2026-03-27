import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

/**
 * HomePage — EnergeX landing page.
 * Calls GET /api/health on mount to verify the frontend ↔ backend
 * connection is live, and displays the result clearly.
 */
const HomePage = () => {
  const [healthStatus, setHealthStatus] = useState({ state: 'loading', message: '' });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const { data } = await api.get('/health');
        setHealthStatus({ state: 'ok', message: data.message });
      } catch (err) {
        setHealthStatus({ state: 'error', message: err.message });
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Home</span>
        <h1>One Platform. Every Exchange.</h1>
        <p>
          EnergeX is a unified global marketplace where you can offer or discover
          accommodation, services, goods, digital products, events, and consultations
          — all in one place.
        </p>
        <Link to="/register" className="placeholder-cta">
          Get Started
        </Link>

        {/* ── API Health Check ────────────────────────────────── */}
        <div className="health-check">
          <span className="health-check__label">API Status</span>
          <span className={`health-check__badge health-check__badge--${healthStatus.state}`}>
            {healthStatus.state === 'loading' && 'Checking…'}
            {healthStatus.state === 'ok' && `✓ ${healthStatus.message}`}
            {healthStatus.state === 'error' && `✗ ${healthStatus.message}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
