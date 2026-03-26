import { Link } from 'react-router-dom';

/**
 * HomePage — landing page for straydog.blog
 */
const HomePage = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Home</span>
        <h1>Every Road Has a Story</h1>
        <p>
          Welcome to straydog.blog — a living journal for adventurers on the move.
          Follow motorbike riders, road trippers, cyclists and backpackers as they
          document their journeys in real time.
        </p>
        <Link to="/find-adventures" className="placeholder-cta">
          Find an Adventure
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
