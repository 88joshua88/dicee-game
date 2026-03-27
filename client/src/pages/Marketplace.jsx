import { useEffect, useState } from 'react';
import { getAllEnergies } from '../services/energyService';
import { getAllArticles } from '../services/articleService';
import EnergyCard from '../components/EnergyCard';
import ArticleCard from '../components/ArticleCard';
import './Marketplace.css';

/**
 * Marketplace — browse all energies and articles from all users.
 * Articles and generic energies are shown in separate labelled sections.
 * Both support keyword search and type filtering.
 */
const Marketplace = () => {
  const [energies, setEnergies] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Shared filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter,  setTypeFilter]  = useState('all'); // 'all' | 'give' | 'receive'

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [energyData, articleData] = await Promise.all([
          getAllEnergies(),
          getAllArticles(),
        ]);
        setEnergies(energyData);
        setArticles(articleData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter energies
  const filteredEnergies = energies.filter((e) => {
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      e.title?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      e.user?.name?.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  // Filter articles (articles are always "give" type)
  const filteredArticles = (typeFilter === 'receive') ? [] : articles.filter((a) => {
    const q = searchQuery.toLowerCase();
    return !q ||
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.articleCategory?.toLowerCase().includes(q) ||
      a.author?.name?.toLowerCase().includes(q);
  });

  const totalResults = filteredEnergies.length + filteredArticles.length;

  return (
    <div className="marketplace">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="marketplace__header">
        <div>
          <h1>Marketplace</h1>
          <p>Discover what people are giving and receiving across the globe.</p>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="marketplace__filters">
        <input
          className="marketplace__search"
          type="text"
          placeholder="Search energies, articles, categories, or people…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="marketplace__type-tabs">
          {['all', 'give', 'receive'].map((t) => (
            <button
              key={t}
              className={`type-tab${typeFilter === t ? ' active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t === 'all' ? 'All' : t === 'give' ? '❤️ Giving' : '↩️ Receiving'}
            </button>
          ))}
        </div>
      </div>

      {/* ── States ─────────────────────────────────────────────── */}
      {loading && <p className="state-msg">Loading marketplace…</p>}
      {error   && <p className="state-msg state-msg--error">{error}</p>}

      {!loading && !error && totalResults === 0 && (
        <div className="empty-state">
          <p className="empty-state__icon">🔍</p>
          <h2>No results found</h2>
          <p>
            {searchQuery || typeFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Be the first to create an energy and get the exchange started.'}
          </p>
        </div>
      )}

      {!loading && !error && totalResults > 0 && (
        <p className="marketplace__count">
          {totalResults} result{totalResults !== 1 ? 's' : ''}
        </p>
      )}

      {/* ── Articles section ── */}
      {!loading && !error && filteredArticles.length > 0 && (
        <section className="marketplace__section">
          <div className="marketplace__section-header">
            <h2>Articles</h2>
            <span>{filteredArticles.length}</span>
          </div>
          <div className="marketplace__articles-grid">
            {filteredArticles.map((article) => (
              <ArticleCard key={article._id} article={article} showUser />
            ))}
          </div>
        </section>
      )}

      {/* ── Energies section ── */}
      {!loading && !error && filteredEnergies.length > 0 && (
        <section className="marketplace__section">
          {filteredArticles.length > 0 && (
            <div className="marketplace__section-header">
              <h2>Energies</h2>
              <span>{filteredEnergies.length}</span>
            </div>
          )}
          <div className="marketplace__grid">
            {filteredEnergies.map((energy) => (
              <EnergyCard key={energy._id} energy={energy} showUser />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Marketplace;
