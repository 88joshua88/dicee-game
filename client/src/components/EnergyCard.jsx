import { Link } from 'react-router-dom';
import './EnergyCard.css';

/**
 * EnergyCard — reusable card for displaying a single Energy.
 *
 * Props:
 *   energy   — the Energy object
 *   showUser — whether to show the owner's name (default true)
 */
const EnergyCard = ({ energy, showUser = true }) => {
  const { _id, title, description, category, type, user } = energy;

  return (
    <div className={`energy-card energy-card--${type}`}>
      {/* Type badge */}
      <span className={`energy-card__type energy-card__type--${type}`}>
        {type === 'give' ? '❤️ Giving' : '↩️ Receiving'}
      </span>

      <h3 className="energy-card__title">{title}</h3>
      <p className="energy-card__desc">{description}</p>

      <div className="energy-card__footer">
        <span className="energy-card__category">{category}</span>

        {showUser && user && (
          <Link
            to={`/profile/${user._id}`}
            className="energy-card__user"
            onClick={(e) => e.stopPropagation()}
          >
            {user.name}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EnergyCard;
