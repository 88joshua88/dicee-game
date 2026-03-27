import { Link } from 'react-router-dom';

/**
 * RegisterPage — create a new EnergeX account
 */
const RegisterPage = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Register</span>
        <h1>Join EnergeX</h1>
        <p>
          Create your account to start buying, selling, or exchanging on the
          unified global marketplace — accommodation, services, goods, events,
          and more.
        </p>
        <span className="placeholder-cta">Create Account</span>
        <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Already a member?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
