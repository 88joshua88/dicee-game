import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEnergiesByUser, groupByCategory } from '../services/energyService';
import CategorySection from '../components/CategorySection';
import './Dashboard.css';

/**
 * Dashboard — main hub after login.
 * Shows the user's own energies grouped by category.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [energies,   setEnergies]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    const fetchMyEnergies = async () => {
      try {
        const data = await getEnergiesByUser(user._id);
        setEnergies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchMyEnergies();
  }, [user]);

  const grouped = groupByCategory(energies);
  const categories = Object.keys(grouped);

  return (
    <div className="dashboard">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__greeting">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="dashboard__subtitle">
            Manage your energies and connect with the marketplace.
          </p>
        </div>

        <div className="dashboard__actions">
          <Link to="/create-energy" className="btn btn--primary">
            + Create Energy
          </Link>
          <Link to="/marketplace" className="btn btn--ghost">
            Explore Marketplace
          </Link>
        </div>
      </div>

      {/* ── Energy list ────────────────────────────────────────── */}
      <div className="dashboard__content">
        {loading && <p className="state-msg">Loading your energies…</p>}

        {error && <p className="state-msg state-msg--error">{error}</p>}

        {!loading && !error && energies.length === 0 && (
          <div className="empty-state">
            <p className="empty-state__icon">⚡</p>
            <h2>You haven't created any energy yet</h2>
            <p>
              Start by creating your first energy — something you want to give
              or receive from the world.
            </p>
            <Link to="/create-energy" className="btn btn--primary">
              Create Your First Energy
            </Link>
          </div>
        )}

        {!loading && !error && categories.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            energies={grouped[cat]}
            showUser={false}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
