import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEnergy } from '../services/energyService';
import './CreateEnergy.css';

// Suggested categories — users can also type a custom one
const CATEGORY_OPTIONS = [
  'Services',
  'Products',
  'Accommodation',
  'Events',
  'Digital Content',
  'Consultations',
  'Other',
];

/**
 * CreateEnergy — form to create a new energy listing.
 * On success, redirects to the Dashboard.
 */
const CreateEnergy = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    type: 'give',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);

  const handleChange = (e) => {
    setError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createEnergy(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-energy-page">
      <div className="create-energy-card">
        {/* Back link */}
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

        <span className="page-tag">New Energy</span>
        <h1>Create an Energy</h1>
        <p className="create-energy-subtitle">
          Share something you want to give or receive — a service, product,
          consultation, and more.
        </p>

        <form className="create-energy-form" onSubmit={handleSubmit}>

          {/* Type selector */}
          <div className="type-selector">
            <button
              type="button"
              className={`type-btn type-btn--give${form.type === 'give' ? ' active' : ''}`}
              onClick={() => setForm((p) => ({ ...p, type: 'give' }))}
            >
              ❤️ Giving
              <span>Something I offer</span>
            </button>
            <button
              type="button"
              className={`type-btn type-btn--receive${form.type === 'receive' ? ' active' : ''}`}
              onClick={() => setForm((p) => ({ ...p, type: 'receive' }))}
            >
              ↩️ Receiving
              <span>Something I need</span>
            </button>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder='e.g. "Freelance logo design" or "Looking for a room in Lisbon"'
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a category…</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you're offering or looking for in detail…"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? 'Publishing…' : 'Publish Energy'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEnergy;
