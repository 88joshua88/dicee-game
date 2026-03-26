import { Link } from 'react-router-dom';

/**
 * LoginPage — sign in to your Stray Dog account
 */
const LoginPage = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Login</span>
        <h1>Welcome Back, Stray Dog</h1>
        <p>
          Sign in to continue your adventure log, pick up where you left off,
          and keep the road rolling.
        </p>
        <span className="placeholder-cta">Sign In</span>
        <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          No account yet?{' '}
          <Link to="/signup" style={{ color: 'var(--color-accent)' }}>
            Join the pack
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
