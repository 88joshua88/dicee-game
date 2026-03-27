import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

/**
 * RegisterPage — create a new EnergeX account
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    clearError();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="page-tag">Register</span>
        <h1>Join EnergeX</h1>
        <p className="auth-subtitle">
          Create your account and start exchanging energy with the world.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

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
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already a member?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
