import { Link } from 'react-router-dom';

/**
 * ForgotPasswordPage — request a password reset
 */
const ForgotPasswordPage = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <span className="page-tag">Forgot Password</span>
        <h1>Lost on the Road?</h1>
        <p>
          No worries — it happens to the best of us. Enter your email and
          we'll send you a link to get back on track.
        </p>
        <span className="placeholder-cta">Send Reset Link</span>
        <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Remembered it?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)' }}>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
