import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

/**
 * LoginPage — sign in to EnergeX
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    clearError();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="page-tag">Login</span>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">
          Sign in to manage your energies and connect with the marketplace.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          New to EnergeX?{' '}
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
