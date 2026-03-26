import { Link } from 'react-router-dom';

/**
 * CreateAdventurePage — start a new adventure log
 */
const CreateAdventurePage = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Create Adventure</span>
        <h1>Start Your Adventure Log</h1>
        <p>
          Give your journey a name, a cover photo, and a brief intro. You'll
          add posts and updates as you go — one road at a time.
        </p>
        <span className="placeholder-cta">Launch Adventure</span>
      </div>
    </div>
  );
};

export default CreateAdventurePage;
