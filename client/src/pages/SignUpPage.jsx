import { Link } from 'react-router-dom';

/**
 * SignUpPage — create a new Stray Dog account
 */
const SignUpPage = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Sign Up</span>
        <h1>Become a Stray Dog</h1>
        <p>
          Create your account and start building your adventure log. Share your
          journey — post by post, road by road.
        </p>
        <span className="placeholder-cta">Create Account</span>
        <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Already a Stray Dog?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
