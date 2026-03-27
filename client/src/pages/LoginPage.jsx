import { Link } from 'react-router-dom';

/**
 * LoginPage — sign in to EnergeX
 */
const LoginPage = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Login</span>
        <h1>Welcome Back</h1>
        <p>
          Sign in to your EnergeX account to manage your listings, messages,
          and transactions across every category.
        </p>
        <span className="placeholder-cta">Sign In</span>
        <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          New to EnergeX?{' '}
          <Link to="/register" style={{ color: 'var(--color-accent)' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
