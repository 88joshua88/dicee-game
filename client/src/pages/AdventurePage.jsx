import { useParams } from 'react-router-dom';

/**
 * AdventurePage — view a single adventure and all its posts
 */
const AdventurePage = () => {
  const { id } = useParams();

  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Adventure</span>
        <h1>The Open Road Awaits</h1>
        <p>
          This is where a full adventure unfolds — entry by entry, photo by
          photo. Posts, maps, and the raw story from the road.
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Adventure ID: <code style={{ color: 'var(--color-accent)' }}>{id}</code>
        </p>
      </div>
    </div>
  );
};

export default AdventurePage;
