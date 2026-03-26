import { Link } from 'react-router-dom';

/**
 * DashboardPage — logged-in user's home base
 */
const DashboardPage = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Dashboard</span>
        <h1>Your Base Camp</h1>
        <p>
          Manage your adventures, track your posts, and see who's following
          your journey. This is where the stories begin.
        </p>
        <Link to="/create-adventure" className="placeholder-cta">
          Start a New Adventure
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
