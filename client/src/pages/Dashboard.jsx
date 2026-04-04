import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdventuresByUser } from '../services/adventureService';
import AdventureCard from '../components/AdventureCard';
import './Dashboard.css';

/**
 * Dashboard — main hub after login.
 * Shows the user's active and completed adventures.
 */
const Dashboard = () => {
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [adventures, setAdventures] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    getAdventuresByUser(user._id)
      .then(setAdventures)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const active    = adventures.filter((a) => a.status === 'active');
  const completed = adventures.filter((a) => a.status === 'completed');

  return (
    <div className="dashboard">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__greeting">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="dashboard__subtitle">
            Track your adventures and document every moment.
          </p>
        </div>

        <div className="dashboard__actions">
          <Link to="/create/adventure" className="btn btn--primary">
            + New Adventure
          </Link>
          <Link to="/explore" className="btn btn--ghost">
            Explore
          </Link>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="dashboard__content">
        {loading && <p className="state-msg">Loading your adventures…</p>}
        {error   && <p className="state-msg state-msg--error">{error}</p>}

        {/* Empty state */}
        {!loading && !error && adventures.length === 0 && (
          <div className="empty-state">
            <p className="empty-state__icon">🌍</p>
            <h2>No adventures yet</h2>
            <p>
              Start your first adventure log and document every moment of your journey —
              from departure to destination.
            </p>
            <Link to="/create/adventure" className="btn btn--primary">
              Start Your First Adventure
            </Link>
          </div>
        )}

        {/* ── Active adventures ── */}
        {!loading && !error && active.length > 0 && (
          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">
                <span className="dashboard-section__live">●</span> Active
              </h2>
              <span className="dashboard-section__count">{active.length}</span>
            </div>
            <div className="dashboard-adventures-grid">
              {active.map((adv) => (
                <AdventureCard
                  key={adv._id}
                  adventure={adv}
                  showUser={false}
                  showEdit
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Completed adventures ── */}
        {!loading && !error && completed.length > 0 && (
          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">Completed</h2>
              <span className="dashboard-section__count">{completed.length}</span>
            </div>
            <div className="dashboard-adventures-grid">
              {completed.map((adv) => (
                <AdventureCard
                  key={adv._id}
                  adventure={adv}
                  showUser={false}
                  showEdit
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
