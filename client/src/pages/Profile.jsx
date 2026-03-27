import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEnergiesByUser } from '../services/energyService';
import { getArticlesByUser } from '../services/articleService';
import EnergyCard from '../components/EnergyCard';
import ArticleCard from '../components/ArticleCard';
import './Profile.css';

/**
 * Profile — displays a user's public profile with their Giving and Receiving energies.
 * Works for both the logged-in user's own profile and other users' profiles.
 * Route: /profile/:userId
 */
const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();

  const [energies,    setEnergies]    = useState([]);
  const [articles,    setArticles]    = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [energyData, articleData] = await Promise.all([
          getEnergiesByUser(userId),
          getArticlesByUser(userId),
        ]);
        setEnergies(energyData);
        setArticles(articleData);
        // Derive user info from the first energy's populated user field
        if (energyData.length > 0) setProfileUser(energyData[0].user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Split energies by type
  const giving    = energies.filter((e) => e.type === 'give');
  const receiving = energies.filter((e) => e.type === 'receive');
  const totalItems = energies.length + articles.length;

  const displayName = profileUser?.name || (isOwnProfile ? currentUser?.name : 'User');

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
        <h1 className="profile__name">{displayName}</h1>

        {isOwnProfile && (
          <div className="profile__own-actions">
            <Link to="/dashboard" className="btn btn--ghost btn--sm">
              Dashboard
            </Link>
            <Link to="/create-energy" className="btn btn--primary btn--sm">
              + Create Energy
            </Link>
          </div>
        )}
      </div>

      {/* ── States ─────────────────────────────────────────────── */}
      {loading && <p className="state-msg profile__state">Loading profile…</p>}
      {error   && <p className="state-msg state-msg--error profile__state">{error}</p>}

      {!loading && !error && totalItems === 0 && (
        <div className="empty-state profile__empty">
          <p className="empty-state__icon">✨</p>
          <h2>No energies yet</h2>
          <p>
            {isOwnProfile
              ? 'Create your first energy to let the world know what you offer or need.'
              : 'This user hasn\'t created any energies yet.'}
          </p>
          {isOwnProfile && (
            <Link to="/dashboard" className="btn btn--primary">
              Go to Dashboard
            </Link>
          )}
        </div>
      )}

      {/* ── Energy sections ────────────────────────────────────── */}
      {!loading && !error && totalItems > 0 && (
        <div className="profile__sections">

          {/* Giving — articles + give-type energies */}
          {(articles.length > 0 || giving.length > 0) && (
            <section className="profile__section">
              <div className="profile__section-header profile__section-header--give">
                <h2>❤️ Giving</h2>
                <span>
                  {articles.length + giving.length}{' '}
                  {articles.length + giving.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Articles subsection */}
              {articles.length > 0 && (
                <div className="profile__grid profile__grid--articles">
                  {articles.map((a) => (
                    <ArticleCard
                      key={a._id}
                      article={a}
                      showUser={false}
                      showManage={isOwnProfile}
                    />
                  ))}
                </div>
              )}

              {/* Give-type energies */}
              {giving.length > 0 && (
                <div className="profile__grid">
                  {giving.map((e) => (
                    <EnergyCard key={e._id} energy={e} showUser={false} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Receiving */}
          {receiving.length > 0 && (
            <section className="profile__section">
              <div className="profile__section-header profile__section-header--receive">
                <h2>↩️ Receiving</h2>
                <span>{receiving.length} {receiving.length === 1 ? 'energy' : 'energies'}</span>
              </div>
              <div className="profile__grid">
                {receiving.map((e) => (
                  <EnergyCard key={e._id} energy={e} showUser={false} />
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
