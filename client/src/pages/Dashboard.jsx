import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEnergiesByUser, groupByCategory } from '../services/energyService';
import { getArticlesByUser } from '../services/articleService';
import CategorySection from '../components/CategorySection';
import ArticleCard from '../components/ArticleCard';
import CategoryModal from '../components/CategoryModal';
import './Dashboard.css';

/**
 * Dashboard — main hub after login.
 *
 * - "Create Energy" button opens CategoryModal (structured type selection)
 * - Shows user's Articles section
 * - Shows user's generic Energies grouped by category
 */
const Dashboard = () => {
  const { user } = useAuth();

  const [energies, setEnergies] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [energyData, articleData] = await Promise.all([
          getEnergiesByUser(user._id),
          getArticlesByUser(user._id),
        ]);
        setEnergies(energyData);
        setArticles(articleData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchAll();
  }, [user]);

  const grouped    = groupByCategory(energies);
  const categories = Object.keys(grouped);
  const isEmpty    = energies.length === 0 && articles.length === 0;

  return (
    <div className="dashboard">
      {/* ── Header ──────────────────────────────────────────────── */}
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
          <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
            + Create Energy
          </button>
          <Link to="/marketplace" className="btn btn--ghost">
            Explore Marketplace
          </Link>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="dashboard__content">
        {loading && <p className="state-msg">Loading your energies…</p>}
        {error   && <p className="state-msg state-msg--error">{error}</p>}

        {/* Empty state */}
        {!loading && !error && isEmpty && (
          <div className="empty-state">
            <p className="empty-state__icon">⚡</p>
            <h2>You haven't created any energy yet</h2>
            <p>
              Start by clicking "Create Energy" to select a type and publish
              your first offering to the world.
            </p>
            <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
              Create Your First Energy
            </button>
          </div>
        )}

        {/* ── Articles section ── */}
        {!loading && !error && articles.length > 0 && (
          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <h2 className="dashboard-section__title">Your Articles</h2>
              <span className="dashboard-section__count">{articles.length}</span>
            </div>
            <div className="dashboard-articles-grid">
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  showUser={false}
                  showManage
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Generic energies grouped by category ── */}
        {!loading && !error && categories.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            energies={grouped[cat]}
            showUser={false}
          />
        ))}
      </div>

      {/* ── Category selection modal ── */}
      <CategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
