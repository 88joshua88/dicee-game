import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdventuresByUser } from '../../services/adventureService';
import { CATEGORY_ICONS } from '../../components/AdventureCard';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day:   'numeric',
        year:  'numeric',
      })
    : '';

/**
 * DashboardMyAdventures — shows all adventures created by the logged-in user.
 * Active adventures show "Continue" + "Edit" buttons.
 * Completed adventures show "View" + "Edit" buttons.
 */
const DashboardMyAdventures = () => {
  const { user } = useAuth();

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
    <div className="db-section">
      <div className="db-section__head">
        <div>
          <h1 className="db-section__title">My Adventures</h1>
          <p className="db-section__subtitle">
            {adventures.length} adventure{adventures.length !== 1 ? 's' : ''} in your log
          </p>
        </div>
        <Link to="/create/adventure" className="db-btn db-btn--primary">
          + New Adventure
        </Link>
      </div>

      {loading && <p className="db-state">Loading your adventures…</p>}
      {error   && <p className="db-state db-state--error">{error}</p>}

      {!loading && !error && adventures.length === 0 && (
        <div className="db-empty">
          <span className="db-empty__icon">🌍</span>
          <h2>No adventures yet</h2>
          <p>Start documenting your travels, one moment at a time.</p>
          <Link to="/create/adventure" className="db-btn db-btn--primary">
            Start Your First Adventure
          </Link>
        </div>
      )}

      {/* ── Active adventures ── */}
      {active.length > 0 && (
        <section className="db-adv-section">
          <h2 className="db-adv-section__title">
            <span className="db-live-dot" />
            Active
            <span className="db-adv-section__count">{active.length}</span>
          </h2>
          <div className="db-adv-list">
            {active.map((adv) => (
              <AdventureListItem key={adv._id} adventure={adv} isActive />
            ))}
          </div>
        </section>
      )}

      {/* ── Completed adventures ── */}
      {completed.length > 0 && (
        <section className="db-adv-section">
          <h2 className="db-adv-section__title">
            Completed
            <span className="db-adv-section__count">{completed.length}</span>
          </h2>
          <div className="db-adv-list">
            {completed.map((adv) => (
              <AdventureListItem key={adv._id} adventure={adv} isActive={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const AdventureListItem = ({ adventure, isActive }) => {
  const { _id, title, category, featuredImage, startLocation, endLocation, startDate, moments } = adventure;

  return (
    <div className="db-adv-item">
      <Link to={`/adventure/${_id}`} className="db-adv-item__img-link">
        <img src={featuredImage} alt={title} className="db-adv-item__img" loading="lazy" />
      </Link>

      <div className="db-adv-item__body">
        <div className="db-adv-item__badges">
          <span className={`db-adv-item__status db-adv-item__status--${isActive ? 'active' : 'completed'}`}>
            {isActive ? '● Live' : '✓ Done'}
          </span>
          <span className="db-adv-item__category">
            {CATEGORY_ICONS[category]} {category}
          </span>
        </div>

        <Link to={`/adventure/${_id}`} className="db-adv-item__title-link">
          <h3 className="db-adv-item__title">{title}</h3>
        </Link>

        <p className="db-adv-item__meta">
          <span>📍 {startLocation}{endLocation ? ` → ${endLocation}` : ''}</span>
          <span className="db-adv-item__sep">·</span>
          <span>📅 {formatDate(startDate)}</span>
          <span className="db-adv-item__sep">·</span>
          <span>{moments?.length || 0} moment{moments?.length !== 1 ? 's' : ''}</span>
        </p>
      </div>

      <div className="db-adv-item__actions">
        {isActive ? (
          <>
            <Link to={`/adventure/edit/${_id}`} className="db-btn db-btn--accent">
              Continue
            </Link>
            <Link to={`/adventure/edit/${_id}`} className="db-btn db-btn--outline">
              Edit
            </Link>
          </>
        ) : (
          <>
            <Link to={`/adventure/${_id}`} className="db-btn db-btn--outline">
              View
            </Link>
            <Link to={`/adventure/edit/${_id}`} className="db-btn db-btn--outline">
              Edit
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardMyAdventures;
