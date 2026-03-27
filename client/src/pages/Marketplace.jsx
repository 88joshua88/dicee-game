import { useEffect, useState } from 'react';
import { getAllEnergies } from '../services/energyService';
import EnergyCard from '../components/EnergyCard';
import './Marketplace.css';

/**
 * Marketplace — browse all energies from all users.
 * Users can filter by type (give/receive) and search by keyword.
 */
const Marketplace = () => {
  const [energies, setEnergies] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Filter state
  const [typeFilter,   setTypeFilter]   = useState('all');   // 'all' | 'give' | 'receive'
  const [searchQuery,  setSearchQuery]  = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAllEnergies();
        setEnergies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Apply filters
  const filtered = energies.filter((e) => {
    const matchesType  = typeFilter === 'all' || e.type === typeFilter;
    const query        = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query) ||
      e.user?.name?.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

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
          placeholder="Search energies, categories, or people…"
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

      {/* ── Results ────────────────────────────────────────────── */}
      {loading && <p className="state-msg">Loading energies…</p>}
      {error   && <p className="state-msg state-msg--error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__icon">🔍</p>
          <h2>No energies found</h2>
          <p>
            {searchQuery || typeFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'Be the first to create an energy and get the exchange started.'}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="marketplace__count">
            Showing {filtered.length} {filtered.length === 1 ? 'energy' : 'energies'}
          </p>
          <div className="marketplace__grid">
            {filtered.map((energy) => (
              <EnergyCard key={energy._id} energy={energy} showUser />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Marketplace;
