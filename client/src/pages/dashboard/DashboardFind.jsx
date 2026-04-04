import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAdventures } from '../../services/adventureService';
import AdventureCard, { CATEGORY_ICONS } from '../../components/AdventureCard';

const CATEGORIES = ['Motorbike', 'Bicycle', 'Backpacking', 'Car', 'By Foot'];

/**
 * DashboardFind — browse all adventures from all users.
 * Travel magazine grid view with search and category filter.
 */
const DashboardFind = () => {
  const [adventures,  setAdventures]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    getAllAdventures()
      .then(setAdventures)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = adventures.filter((adv) => {
    const matchesCat    = catFilter === 'all' || adv.category === catFilter;
    const matchesStatus = statusFilter === 'all' || adv.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      adv.title?.toLowerCase().includes(q) ||
      adv.startLocation?.toLowerCase().includes(q) ||
      adv.endLocation?.toLowerCase().includes(q) ||
      adv.category?.toLowerCase().includes(q) ||
      adv.author?.name?.toLowerCase().includes(q);
    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="db-section">
      <h1 className="db-section__title">Find Adventures</h1>
      <p className="db-section__subtitle">
        Explore the journeys of travellers from around the world.
      </p>

      {/* ── Filters ── */}
      <div className="db-find__filters">
        <input
          type="text"
          className="db-find__search"
          placeholder="Search by title, location, category, or traveller…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="db-find__pills">
          {/* Status filter */}
          <div className="db-find__pill-group">
            {[
              { value: 'all',       label: 'All' },
              { value: 'active',    label: '● Live' },
              { value: 'completed', label: '✓ Done' },
            ].map(({ value, label }) => (
              <button
                key={value}
                className={`db-find__pill${statusFilter === value ? ' db-find__pill--active' : ''}`}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="db-find__pill-group">
            <button
              className={`db-find__pill${catFilter === 'all' ? ' db-find__pill--active' : ''}`}
              onClick={() => setCatFilter('all')}
            >
              All Types
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`db-find__pill${catFilter === cat ? ' db-find__pill--active' : ''}`}
                onClick={() => setCatFilter(cat)}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <p className="db-state">Loading adventures…</p>}
      {error   && <p className="db-state db-state--error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="db-empty">
          <span className="db-empty__icon">🗺</span>
          <h2>No adventures found</h2>
          <p>
            {search || catFilter !== 'all' || statusFilter !== 'all'
              ? 'Try different search terms or filters.'
              : 'No adventures have been published yet. Be the first!'}
          </p>
          <Link to="/create/adventure" className="db-btn db-btn--primary">
            Start an Adventure
          </Link>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="db-find__count">
            {filtered.length} adventure{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="db-find__grid">
            {filtered.map((adv) => (
              <AdventureCard key={adv._id} adventure={adv} showUser />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardFind;
