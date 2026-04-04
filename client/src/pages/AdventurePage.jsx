import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdventureById } from '../services/adventureService';
import { CATEGORY_ICONS } from '../components/AdventureCard';
import './AdventurePage.css';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', {
        weekday: 'long',
        month:   'long',
        day:     'numeric',
        year:    'numeric',
      })
    : null;

const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-US', {
        month:  'short',
        day:    'numeric',
        year:   'numeric',
        hour:   'numeric',
        minute: '2-digit',
      })
    : null;

const getVideoEmbedUrl = (url) => {
  if (!url) return null;
  if (/youtu\.?be/.test(url)) {
    const id = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (/vimeo\.com/.test(url)) {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
};

/**
 * AdventurePage — /adventure/:id
 * Public-facing editorial view of a single adventure with its moment timeline.
 */
const AdventurePage = () => {
  const { id }   = useParams();
  const { user } = useAuth();

  const [adventure, setAdventure] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    getAdventureById(id)
      .then(setAdventure)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="state-msg adv-page__state">Loading adventure…</p>;
  if (error)   return <p className="state-msg state-msg--error adv-page__state">{error}</p>;
  if (!adventure) return null;

  const isAuthor = user?._id === adventure.author?._id?.toString();

  const {
    title,
    category,
    featuredImage,
    startLocation,
    endLocation,
    startDate,
    endDate,
    status,
    author,
    moments,
  } = adventure;

  return (
    <article className="adv-page">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="adv-page__hero">
        <img src={featuredImage} alt={title} className="adv-page__hero-img" />
        <div className="adv-page__hero-overlay" />
        <div className="adv-page__hero-content">
          <div className="adv-page__hero-badges">
            <span className={`adv-page__status adv-page__status--${status}`}>
              {status === 'active' ? '● Live Adventure' : '✓ Completed'}
            </span>
            <span className="adv-page__category-badge">
              {CATEGORY_ICONS[category]} {category}
            </span>
          </div>
          <h1 className="adv-page__title">{title}</h1>
          <p className="adv-page__route">
            {startLocation}
            {endLocation && (
              <><span className="adv-page__route-arrow"> → </span>{endLocation}</>
            )}
          </p>
        </div>
      </header>

      {/* ── Meta bar ─────────────────────────────────────────────── */}
      <div className="adv-page__meta-bar">
        <div className="adv-page__meta-inner">
          <div className="adv-page__meta-group">
            <span className="adv-page__meta-label">By</span>
            <Link to={`/profile/${author?._id}`} className="adv-page__meta-author">
              {author?.name}
            </Link>
          </div>
          <div className="adv-page__meta-group">
            <span className="adv-page__meta-label">Started</span>
            <span>{formatDate(startDate)}</span>
          </div>
          {endDate && (
            <div className="adv-page__meta-group">
              <span className="adv-page__meta-label">Ended</span>
              <span>{formatDate(endDate)}</span>
            </div>
          )}
          <div className="adv-page__meta-group">
            <span className="adv-page__meta-label">Moments</span>
            <span>{moments.length}</span>
          </div>
          {isAuthor && (
            <Link to={`/adventure/edit/${adventure._id}`} className="adv-page__edit-btn">
              Edit Adventure →
            </Link>
          )}
        </div>
      </div>

      {/* ── Moments timeline ─────────────────────────────────────── */}
      <div className="adv-page__body">
        {moments.length === 0 ? (
          <div className="adv-page__no-moments">
            <p className="adv-page__no-moments-icon">📍</p>
            <p>No moments added yet — check back soon.</p>
          </div>
        ) : (
          <ol className="adv-page__timeline">
            {moments.map((moment, idx) => {
              const embedUrl = getVideoEmbedUrl(moment.videoUrl);
              return (
                <li key={moment._id} className="adv-page__moment">
                  <div className="adv-page__moment-marker">
                    <span className="adv-page__moment-num">{idx + 1}</span>
                    {idx < moments.length - 1 && (
                      <span className="adv-page__moment-line" />
                    )}
                  </div>

                  <div className="adv-page__moment-content">
                    <time className="adv-page__moment-time">
                      {formatDateTime(moment.createdAt)}
                    </time>
                    <h2 className="adv-page__moment-title">{moment.title}</h2>
                    <p className="adv-page__moment-desc">{moment.description}</p>

                    {moment.photo && (
                      <img
                        src={moment.photo}
                        alt={moment.title}
                        className="adv-page__moment-photo"
                        loading="lazy"
                      />
                    )}

                    {moment.videoUrl && (
                      embedUrl ? (
                        <div className="adv-page__moment-video-wrap">
                          <iframe
                            src={embedUrl}
                            title={moment.title}
                            className="adv-page__moment-video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <a
                          href={moment.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="adv-page__moment-video-link"
                        >
                          ▶ Watch Video
                        </a>
                      )
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {status === 'completed' && moments.length > 0 && (
          <div className="adv-page__end-note">
            <span className="adv-page__end-icon">🏁</span>
            <p>
              Adventure completed
              {endDate ? ` on ${formatDate(endDate)}` : ''}.
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default AdventurePage;
