import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadImage, createArticle } from '../services/articleService';
import { ARTICLE_CATEGORIES, CURRENCIES } from '../config/categories';
import './CreateArticle.css';

/**
 * CreateArticle — creation form for a Content → Article energy.
 *
 * Flow:
 *  1. User fills the form (title, description, image, price, content)
 *  2. On submit: upload image → create article (with version 1) → redirect to manage page
 *
 * Route: /create/article
 */
const CreateArticle = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title:           '',
    description:     '',
    articleCategory: '',
    priceAmount:     '',
    priceCurrency:   'USD',
    content:         '',
  });

  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState(null);

  const handleChange = (e) => {
    setError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!imageFile && !imagePreview) {
      return setError('Please select a featured image');
    }
    if (form.content.trim().length < 500) {
      return setError(`Content must be at least 500 characters (currently ${form.content.trim().length})`);
    }
    if (!form.priceAmount || isNaN(Number(form.priceAmount)) || Number(form.priceAmount) < 0) {
      return setError('Please enter a valid price');
    }

    try {
      // Step 1: upload image to Cloudinary
      setUploading(true);
      const { url: featuredImage } = await uploadImage(imageFile);
      setUploading(false);

      // Step 2: create article
      setSubmitting(true);
      const article = await createArticle({
        title:           form.title,
        description:     form.description,
        featuredImage,
        articleCategory: form.articleCategory || undefined,
        price: {
          amount:   Number(form.priceAmount),
          currency: form.priceCurrency,
        },
        content: form.content.trim(),
      });

      navigate(`/article/manage/${article._id}`);
    } catch (err) {
      setUploading(false);
      setSubmitting(false);
      setError(err.message);
    }
  };

  const contentLength = form.content.trim().length;
  const isSubmitting  = uploading || submitting;

  return (
    <div className="create-article-page">
      {/* Sidebar info */}
      <aside className="create-article-info">
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
        <span className="page-tag">Content › Article</span>
        <h1>Write an Article</h1>
        <p>
          Publish long-form content with version control. Your first draft
          becomes version 1. You can publish a new version every 30 days.
        </p>

        <div className="create-article-rules">
          <div className="rule-item">
            <span className="rule-icon">📝</span>
            <span>Minimum 500 characters</span>
          </div>
          <div className="rule-item">
            <span className="rule-icon">🔒</span>
            <span>Content cannot be edited — only new versions</span>
          </div>
          <div className="rule-item">
            <span className="rule-icon">⏱️</span>
            <span>New versions allowed every 30 days</span>
          </div>
        </div>
      </aside>

      {/* Main form */}
      <form className="create-article-form" onSubmit={handleSubmit}>

        {/* Featured image upload */}
        <div className="form-group">
          <label>Featured Image <span className="required">*</span></label>
          <div
            className={`image-upload-area${imagePreview ? ' has-image' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-upload-preview" />
            ) : (
              <div className="image-upload-placeholder">
                <span className="image-upload-icon">🖼️</span>
                <span className="image-upload-label">Click to upload featured image</span>
                <span className="image-upload-hint">JPG, PNG, WEBP — recommended 1200×630</span>
              </div>
            )}
            {imagePreview && (
              <div className="image-upload-overlay">
                <span>Click to change</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title <span className="required">*</span></label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Give your article a compelling title"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Short Description <span className="required">*</span></label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="A brief summary shown in listings (1-3 sentences)"
            required
          />
        </div>

        {/* Article category + price row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="articleCategory">Topic Category</label>
            <select
              id="articleCategory"
              name="articleCategory"
              value={form.articleCategory}
              onChange={handleChange}
            >
              <option value="">Select topic…</option>
              {ARTICLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group form-group--price">
            <label>Price <span className="required">*</span></label>
            <div className="price-input">
              <select
                name="priceCurrency"
                value={form.priceCurrency}
                onChange={handleChange}
                className="price-currency"
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="number"
                name="priceAmount"
                value={form.priceAmount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="price-amount"
                required
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="form-group">
          <label htmlFor="content">
            Article Content <span className="required">*</span>
            <span className={`char-count${contentLength < 500 ? ' char-count--warn' : ''}`}>
              {contentLength.toLocaleString()} / 50,000
              {contentLength < 500 && ` — need ${500 - contentLength} more`}
            </span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={20}
            value={form.content}
            onChange={handleChange}
            placeholder="Write your full article here. This will become Version 1. Minimum 500 characters."
            maxLength={50000}
            required
          />
        </div>

        {/* Versioning notice */}
        <div className="version-notice">
          <span>📌</span>
          <p>
            Once published, <strong>you cannot edit this content directly</strong>.
            Future updates will create a new version. New versions can only be
            published 30 days after the previous one.
          </p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          {uploading   ? 'Uploading image…'  :
           submitting  ? 'Publishing…'       :
                        'Publish Article'}
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;
