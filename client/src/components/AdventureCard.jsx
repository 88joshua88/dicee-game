import { Link } from 'react-router-dom';
import './AdventureCard.css';

export const CATEGORY_ICONS = {
  'Motorbike':   '🏍️',
  'Bicycle':     '🚲',
  'Backpacking': '🎒',
  'Car':         '🚗',
  'By Foot':     '👟',
};

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day:   'numeric',
        year:  'numeric',
      })
    : null;

/**
 * AdventureCard — compact card for browse / profile grids.
 *
 * Props:
 *   adventure  — the adventure object
 *   showUser   — show author link (default true)
 *   showEdit   — show "Edit Adventure →" link (default false, for own adventures)
 */
const AdventureCard = ({ adventure, showUser = true, showEdit = false }) => {
  const {
    _id,
    title,
    category,
    featuredImage,
    startLocation,
    endLocation,
    status,
    author,
    moments,
    startDate,
  } = adventure;

  return (
    <article className="adv-card">
      <Link to={`/adventure/${_id}`} className="adv-card__image-link">
        <div className="adv-card__image">
          <img src={featuredImage} alt={title} loading="lazy" />
          <div className="adv-card__badges">
            <span className={`adv-card__status adv-card__status--${status}`}>
              {status === 'active' ? '● Live' : '✓ Done'}
            </span>
            <span className="adv-card__category">
              {CATEGORY_ICONS[category]} {category}
            </span>
          </div>
        </div>
      </Link>

      <div className="adv-card__body">
        <Link to={`/adventure/${_id}`} className="adv-card__title-link">
          <h3 className="adv-card__title">{title}</h3>
        </Link>

        <p className="adv-card__route">
          <span>{startLocation}</span>
          {endLocation && (
            <>
              <span className="adv-card__arrow"> → </span>
              <span>{endLocation}</span>
            </>
          )}
        </p>

        <div className="adv-card__meta">
          {showUser && author && (
            <Link to={`/profile/${author._id}`} className="adv-card__author">
              {author.name}
            </Link>
          )}
          <span className="adv-card__moments">
            {moments?.length || 0} moment{moments?.length !== 1 ? 's' : ''}
          </span>
          {startDate && (
            <span className="adv-card__date">{formatDate(startDate)}</span>
          )}
        </div>

        {showEdit && (
          <Link to={`/adventure/edit/${_id}`} className="adv-card__edit-link">
            Manage →
          </Link>
        )}
      </div>
    </article>
  );
};

export default AdventureCard;
