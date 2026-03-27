import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getArticleById,
  updateArticleMetadata,
  createNewVersion,
  uploadImage,
} from '../services/articleService';
import { ARTICLE_CATEGORIES, CURRENCIES } from '../config/categories';
import VersionSection from '../components/VersionSection';
import './ArticleManage.css';

/**
 * ArticleManage — author-only management dashboard for a single article.
 *
 * Section A: Editable metadata (title, description, image, price)
 * Section B: Version history + new version creation
 *
 * Route: /article/manage/:id
 */
const ArticleManage = () => {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);

  const [article,  setArticle]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Metadata form state (initialised once article loads)
  const [meta, setMeta] = useState({
    title: '', description: '', articleCategory: '',
    priceAmount: '', priceCurrency: 'USD',
  });
  const [newImageFile,    setNewImageFile]    = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [saving,          setSaving]          = useState(false);
  const [saveMsg,         setSaveMsg]         = useState(null);
  const [metaError,       setMetaError]       = useState(null);

  // ── Fetch article ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getArticleById(id);
        // Redirect if not the author
        if (data.author._id !== user?._id) {
          navigate('/dashboard', { replace: true });
          return;
        }
        setArticle(data);
        setMeta({
          title:           data.title,
          description:     data.description,
          articleCategory: data.articleCategory || '',
          priceAmount:     String(data.price.amount),
          priceCurrency:   data.price.currency,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetch();
  }, [id, user, navigate]);

  // ── Metadata handlers ───────────────────────────────────────────────────────
  const handleMetaChange = (e) => {
    setMetaError(null);
    setSaveMsg(null);
    setMeta((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const handleSaveMetadata = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMetaError(null);
    setSaveMsg(null);

    try {
      let featuredImage = article.featuredImage;
      if (newImageFile) {
        const { url } = await uploadImage(newImageFile);
        featuredImage = url;
      }

      const updated = await updateArticleMetadata(id, {
        title:           meta.title,
        description:     meta.description,
        featuredImage,
        articleCategory: meta.articleCategory || undefined,
        price: {
          amount:   Number(meta.priceAmount),
          currency: meta.priceCurrency,
        },
      });

      setArticle(updated);
      setNewImageFile(null);
      setNewImagePreview(null);
      setSaveMsg('Changes saved successfully');
    } catch (err) {
      setMetaError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Version handler ─────────────────────────────────────────────────────────
  const handleNewVersion = async (content) => {
    const updated = await createNewVersion(id, content);
    setArticle(updated);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) return <div className="manage-state"><p className="state-msg">Loading…</p></div>;
  if (error)   return <div className="manage-state"><p className="state-msg state-msg--error">{error}</p></div>;
  if (!article) return null;

  const currentImage = newImagePreview || article.featuredImage;

  return (
    <div className="article-manage">

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="manage-header">
        <div>
          <Link to="/dashboard" className="back-link">← Dashboard</Link>
          <h1 className="manage-title">Manage Article</h1>
          <p className="manage-subtitle">{article.title}</p>
        </div>
        <Link to={`/article/${id}`} className="btn btn--ghost btn--sm" target="_blank">
          View Public Page ↗
        </Link>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────── */}
      <div className="manage-grid">

        {/* ── Section A: Metadata form ──────────────────────────────── */}
        <section className="manage-card">
          <h2 className="manage-card__heading">Edit Details</h2>

          <form className="manage-meta-form" onSubmit={handleSaveMetadata}>

            {/* Image */}
            <div className="form-group">
              <label>Featured Image</label>
              <div
                className="image-upload-area has-image"
                onClick={() => fileInputRef.current?.click()}
              >
                <img src={currentImage} alt="Featured" className="image-upload-preview" />
                <div className="image-upload-overlay"><span>Click to change</span></div>
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
              <label htmlFor="m-title">Title</label>
              <input
                id="m-title"
                name="title"
                type="text"
                value={meta.title}
                onChange={handleMetaChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="m-desc">Short Description</label>
              <textarea
                id="m-desc"
                name="description"
                rows={3}
                value={meta.description}
                onChange={handleMetaChange}
                required
              />
            </div>

            {/* Category + Price row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="m-cat">Topic Category</label>
                <select
                  id="m-cat"
                  name="articleCategory"
                  value={meta.articleCategory}
                  onChange={handleMetaChange}
                >
                  <option value="">Select topic…</option>
                  {ARTICLE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group--price">
                <label>Price</label>
                <div className="price-input">
                  <select
                    name="priceCurrency"
                    value={meta.priceCurrency}
                    onChange={handleMetaChange}
                    className="price-currency"
                  >
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="number"
                    name="priceAmount"
                    value={meta.priceAmount}
                    onChange={handleMetaChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="price-amount"
                    required
                  />
                </div>
              </div>
            </div>

            {metaError && <p className="auth-error">{metaError}</p>}
            {saveMsg   && <p className="save-success">{saveMsg}</p>}

            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* ── Section B: Version management ────────────────────────── */}
        <section className="manage-card">
          <h2 className="manage-card__heading">Versions</h2>
          <VersionSection
            versions={article.versions}
            onNewVersion={handleNewVersion}
          />
        </section>
      </div>
    </div>
  );
};

export default ArticleManage;
