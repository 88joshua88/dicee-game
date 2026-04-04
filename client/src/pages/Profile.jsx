import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdventuresByUser } from '../services/adventureService';
import AdventureCard from '../components/AdventureCard';
import './Profile.css';

/**
 * Profile — public profile showing a user's adventures.
 * Works for both the logged-in user and other users' profiles.
 * Route: /profile/:userId
 */
const Profile = () => {
  const { userId }          = useParams();
  const { user: currentUser } = useAuth();

  const [adventures,   setAdventures]   = useState([]);
  const [profileUser,  setProfileUser]  = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    getAdventuresByUser(userId)
      .then((data) => {
        setAdventures(data);
        if (data.length > 0) setProfileUser(data[0].author);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const active    = adventures.filter((a) => a.status === 'active');
  const completed = adventures.filter((a) => a.status === 'completed');

  const displayName =
    profileUser?.name || (isOwnProfile ? currentUser?.name : 'Traveller');

  return (
    <div className="profile">
      {/* ── Cover + avatar ─────────────────────────────────────── */}
      <div className="profile__cover">
        <div className="profile__cover-bg" />
        <div className="profile__avatar-wrap">
          <div className="profile__avatar">
            {displayName?.[0]?.toUpperCase() || '?'}
          </div>
        </div>
      </div>

      {/* ── Meta ───────────────────────────────────────────────── */}
      <div className="profile__meta">
        <div>
          <h1 className="profile__name">{displayName}</h1>
          <p className="profile__stats">
            {adventures.length} adventure{adventures.length !== 1 ? 's' : ''}
            {active.length > 0 && (
              <span className="profile__stats-live"> · {active.length} live</span>
            )}
          </p>
        </div>

        {isOwnProfile && (
          <div className="profile__own-actions">
            <Link to="/dashboard" className="btn btn--ghost btn--sm">
              Dashboard
            </Link>
            <Link to="/create/adventure" className="btn btn--primary btn--sm">
              + New Adventure
            </Link>
          </div>
        )}
      </div>

      {/* ── States ─────────────────────────────────────────────── */}
      {loading && <p className="state-msg profile__state">Loading profile…</p>}
      {error   && <p className="state-msg state-msg--error profile__state">{error}</p>}

      {!loading && !error && adventures.length === 0 && (
        <div className="empty-state profile__empty">
          <p className="empty-state__icon">🌍</p>
          <h2>No adventures yet</h2>
          <p>
            {isOwnProfile
              ? 'Start your first adventure and share it with the world.'
              : 'This traveller hasn\'t started any adventures yet.'}
          </p>
          {isOwnProfile && (
            <Link to="/create/adventure" className="btn btn--primary">
              Start an Adventure
            </Link>
          )}
        </div>
      )}

      {/* ── Adventures ─────────────────────────────────────────── */}
      {!loading && !error && adventures.length > 0 && (
        <div className="profile__sections">

          {/* Active */}
          {active.length > 0 && (
            <section className="profile__section">
              <div className="profile__section-header profile__section-header--active">
                <h2>● Live Adventures</h2>
                <span>{active.length}</span>
              </div>
              <div className="profile__grid">
                {active.map((adv) => (
                  <AdventureCard
                    key={adv._id}
                    adventure={adv}
                    showUser={false}
                    showEdit={isOwnProfile}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <section className="profile__section">
              <div className="profile__section-header profile__section-header--completed">
                <h2>✓ Completed</h2>
                <span>{completed.length}</span>
              </div>
              <div className="profile__grid">
                {completed.map((adv) => (
                  <AdventureCard
                    key={adv._id}
                    adventure={adv}
                    showUser={false}
                    showEdit={isOwnProfile}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
