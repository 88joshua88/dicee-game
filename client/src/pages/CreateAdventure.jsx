import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage, createAdventure } from '../services/adventureService';
import { CATEGORY_ICONS } from '../components/AdventureCard';
import './CreateAdventure.css';

const CATEGORIES = ['Motorbike', 'Bicycle', 'Backpacking', 'Car', 'By Foot'];

/**
 * CreateAdventure — /create/adventure
 * Start a new adventure: fill in details and upload a featured image.
 * On submit, creates the adventure and redirects to the edit/manage page.
 */
const CreateAdventure = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title:         '',
    category:      '',
    startLocation: '',
    endLocation:   '',
  });
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) return setError('Adventure title is required.');
    if (!form.category)     return setError('Please choose a category.');
    if (!form.startLocation.trim()) return setError('Start location is required.');
    if (!imageFile)         return setError('Please upload a featured image.');

    try {
      setSubmitting(true);

      // 1. Upload featured image to Cloudinary
      const uploadResult = await uploadImage(imageFile);

      // 2. Create the adventure
      const adventure = await createAdventure({
        title:         form.title.trim(),
        category:      form.category,
        featuredImage: uploadResult.url,
        startLocation: form.startLocation.trim(),
        endLocation:   form.endLocation.trim() || undefined,
      });

      // 3. Redirect to manage page to start adding moments
      navigate(`/adventure/edit/${adventure._id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-adv">
      <div className="create-adv__hero">
        <span className="create-adv__tag">New Adventure</span>
        <h1 className="create-adv__heading">Where are you headed?</h1>
        <p className="create-adv__sub">
          Every great journey starts with a single step. Set the scene, choose
          your mode of travel, and start your adventure log.
        </p>
      </div>

      <form className="create-adv__form" onSubmit={handleSubmit} noValidate>

        {/* ── Featured image ── */}
        <div className="create-adv__section">
          <label className="create-adv__label">Featured Image *</label>
          <div
            className={`create-adv__dropzone${imagePreview ? ' has-image' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="create-adv__preview" />
                <div className="create-adv__dropzone-overlay">
                  <span>Click to change</span>
                </div>
              </>
            ) : (
              <div className="create-adv__dropzone-placeholder">
                <span className="create-adv__dropzone-icon">🖼</span>
                <span>Drag & drop or click to upload</span>
                <span className="create-adv__dropzone-hint">JPG, PNG, WebP — becomes your cover photo</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageSelect}
          />
        </div>

        {/* ── Title ── */}
        <div className="create-adv__section">
          <label className="create-adv__label" htmlFor="title">Adventure Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            className="create-adv__input"
            placeholder="e.g. Riding the Ho Chi Minh Trail"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
          />
        </div>

        {/* ── Category ── */}
        <div className="create-adv__section">
          <label className="create-adv__label">Category *</label>
          <div className="create-adv__categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`create-adv__cat-btn${form.category === cat ? ' selected' : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
              >
                <span className="create-adv__cat-icon">{CATEGORY_ICONS[cat]}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Locations ── */}
        <div className="create-adv__row">
          <div className="create-adv__section">
            <label className="create-adv__label" htmlFor="startLocation">
              Start Location *
            </label>
            <input
              id="startLocation"
              name="startLocation"
              type="text"
              className="create-adv__input"
              placeholder="e.g. Hanoi, Vietnam"
              value={form.startLocation}
              onChange={handleChange}
            />
          </div>
          <div className="create-adv__section">
            <label className="create-adv__label" htmlFor="endLocation">
              End Location <span className="create-adv__optional">(optional)</span>
            </label>
            <input
              id="endLocation"
              name="endLocation"
              type="text"
              className="create-adv__input"
              placeholder="e.g. Ho Chi Minh City"
              value={form.endLocation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ── Error ── */}
        {error && <p className="create-adv__error">{error}</p>}

        {/* ── Submit ── */}
        <div className="create-adv__footer">
          <p className="create-adv__footer-note">
            Your adventure will be set to <strong>Active</strong> — start adding moments straight away.
          </p>
          <button
            type="submit"
            className="btn btn--primary create-adv__submit"
            disabled={submitting}
          >
            {submitting ? 'Creating…' : 'Begin Adventure →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdventure;
