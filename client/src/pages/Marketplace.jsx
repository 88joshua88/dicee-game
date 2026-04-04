import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAdventures } from '../services/adventureService';
import AdventureCard, { CATEGORY_ICONS } from '../components/AdventureCard';
import './Marketplace.css';

const CATEGORIES = ['Motorbike', 'Bicycle', 'Backpacking', 'Car', 'By Foot'];
const STATUS_FILTERS = [
  { value: 'all',       label: 'All' },
  { value: 'active',    label: '● Live' },
  { value: 'completed', label: '✓ Completed' },
];

/**
 * Marketplace (Explore) — /explore
 * Browse all adventures from all users.
 * Filterable by category, status, and keyword search.
 */
const Marketplace = () => {
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
    <div className="marketplace">
      {/* ── Hero header ─────────────────────────────────────────── */}
      <div className="marketplace__header">
        <h1>Explore Adventures</h1>
        <p>Follow travellers around the world — moment by moment.</p>
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="marketplace__filters">
        <input
          className="marketplace__search"
          type="text"
          placeholder="Search by title, location, category, or traveller…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="marketplace__filter-row">
          {/* Status tabs */}
          <div className="marketplace__type-tabs">
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                className={`type-tab${statusFilter === value ? ' active' : ''}`}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="marketplace__cat-pills">
            <button
              className={`cat-pill${catFilter === 'all' ? ' active' : ''}`}
              onClick={() => setCatFilter('all')}
            >
              All Types
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-pill${catFilter === cat ? ' active' : ''}`}
                onClick={() => setCatFilter(cat)}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── States ─────────────────────────────────────────────── */}
      {loading && <p className="state-msg">Loading adventures…</p>}
      {error   && <p className="state-msg state-msg--error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__icon">🗺</p>
          <h2>No adventures found</h2>
          <p>
            {search || catFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Be the first to document a journey.'}
          </p>
          <Link to="/create/adventure" className="btn btn--primary">
            Start an Adventure
          </Link>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="marketplace__count">
            {filtered.length} adventure{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="marketplace__grid">
            {filtered.map((adv) => (
              <AdventureCard key={adv._id} adventure={adv} showUser />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Marketplace;
