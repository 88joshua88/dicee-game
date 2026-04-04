import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAdventureById,
  updateAdventure,
  endAdventure,
  addMoment,
  updateMoment,
  deleteMoment,
  uploadImage,
} from '../services/adventureService';
import { CATEGORY_ICONS } from '../components/AdventureCard';
import './EditAdventure.css';

const CATEGORIES = ['Motorbike', 'Bicycle', 'Backpacking', 'Car', 'By Foot'];

const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-US', {
        month:  'short',
        day:    'numeric',
        year:   'numeric',
        hour:   'numeric',
        minute: '2-digit',
      })
    : '';

const emptyMomentForm = () => ({
  title:       '',
  description: '',
  videoUrl:    '',
});

/**
 * EditAdventure — /adventure/edit/:id
 * Protected page — only the adventure's author can access this.
 * Allows editing adventure details, adding/editing/deleting moments,
 * and ending the adventure.
 */
const EditAdventure = () => {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  // Adventure state
  const [adventure,       setAdventure]       = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  // Details form
  const [details,         setDetails]         = useState({});
  const [detailsImage,    setDetailsImage]    = useState(null);
  const [detailsPreview,  setDetailsPreview]  = useState('');
  const [detailsSaving,   setDetailsSaving]   = useState(false);
  const [detailsSuccess,  setDetailsSuccess]  = useState(false);
  const detailsImgRef = useRef(null);

  // End adventure
  const [ending,          setEnding]          = useState(false);
  const [endConfirm,      setEndConfirm]      = useState(false);

  // Add moment
  const [showAddMoment,   setShowAddMoment]   = useState(false);
  const [momentForm,      setMomentForm]      = useState(emptyMomentForm());
  const [momentPhoto,     setMomentPhoto]     = useState(null);
  const [momentPreview,   setMomentPreview]   = useState('');
  const [momentSaving,    setMomentSaving]    = useState(false);
  const [momentError,     setMomentError]     = useState(null);
  const momentPhotoRef = useRef(null);

  // Edit moment
  const [editingId,       setEditingId]       = useState(null);
  const [editForm,        setEditForm]        = useState(emptyMomentForm());
  const [editPhoto,       setEditPhoto]       = useState(null);
  const [editPreview,     setEditPreview]     = useState('');
  const [editSaving,      setEditSaving]      = useState(false);
  const [editError,       setEditError]       = useState(null);
  const editPhotoRef = useRef(null);

  // Load adventure
  useEffect(() => {
    getAdventureById(id)
      .then((adv) => {
        // Redirect if not the author
        if (adv.author?._id?.toString() !== user?._id) {
          navigate('/dashboard');
          return;
        }
        setAdventure(adv);
        setDetails({
          title:         adv.title,
          category:      adv.category,
          startLocation: adv.startLocation,
          endLocation:   adv.endLocation || '',
        });
        setDetailsPreview(adv.featuredImage);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  // ── Details ────────────────────────────────────────────────

  const handleDetailChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setDetailsSuccess(false);
  };

  const handleDetailsImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDetailsImage(file);
    setDetailsPreview(URL.createObjectURL(file));
    setDetailsSuccess(false);
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setDetailsSaving(true);
    try {
      let featuredImage = adventure.featuredImage;
      if (detailsImage) {
        const result = await uploadImage(detailsImage);
        featuredImage = result.url;
      }
      const updated = await updateAdventure(id, {
        ...details,
        endLocation: details.endLocation.trim() || undefined,
        featuredImage,
      });
      setAdventure(updated);
      setDetailsImage(null);
      setDetailsSuccess(true);
      setTimeout(() => setDetailsSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsSaving(false);
    }
  };

  // ── End Adventure ──────────────────────────────────────────

  const handleEndAdventure = async () => {
    setEnding(true);
    try {
      const updated = await endAdventure(id);
      setAdventure(updated);
      setEndConfirm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnding(false);
    }
  };

  // ── Add Moment ─────────────────────────────────────────────

  const handleMomentChange = (e) => {
    setMomentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMomentPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMomentPhoto(file);
    setMomentPreview(URL.createObjectURL(file));
  };

  const handleAddMoment = async (e) => {
    e.preventDefault();
    setMomentError(null);
    if (!momentForm.title.trim())       return setMomentError('Title is required.');
    if (!momentForm.description.trim()) return setMomentError('Description is required.');
    setMomentSaving(true);
    try {
      let photoUrl;
      if (momentPhoto) {
        const result = await uploadImage(momentPhoto);
        photoUrl = result.url;
      }
      const updated = await addMoment(id, {
        title:       momentForm.title.trim(),
        description: momentForm.description.trim(),
        photo:       photoUrl,
        videoUrl:    momentForm.videoUrl.trim() || undefined,
      });
      setAdventure(updated);
      setMomentForm(emptyMomentForm());
      setMomentPhoto(null);
      setMomentPreview('');
      setShowAddMoment(false);
    } catch (err) {
      setMomentError(err.message);
    } finally {
      setMomentSaving(false);
    }
  };

  // ── Edit Moment ────────────────────────────────────────────

  const startEditMoment = (moment) => {
    setEditingId(moment._id);
    setEditForm({
      title:       moment.title,
      description: moment.description,
      videoUrl:    moment.videoUrl || '',
    });
    setEditPreview(moment.photo || '');
    setEditPhoto(null);
    setEditError(null);
  };

  const cancelEditMoment = () => {
    setEditingId(null);
    setEditPhoto(null);
    setEditPreview('');
    setEditError(null);
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditPhoto(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const handleSaveMoment = async (e) => {
    e.preventDefault();
    setEditError(null);
    if (!editForm.title.trim())       return setEditError('Title is required.');
    if (!editForm.description.trim()) return setEditError('Description is required.');
    setEditSaving(true);
    try {
      let photo = adventure.moments.find((m) => m._id === editingId)?.photo;
      if (editPhoto) {
        const result = await uploadImage(editPhoto);
        photo = result.url;
      }
      const updated = await updateMoment(id, editingId, {
        title:       editForm.title.trim(),
        description: editForm.description.trim(),
        photo,
        videoUrl:    editForm.videoUrl.trim() || undefined,
      });
      setAdventure(updated);
      cancelEditMoment();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteMoment = async (momentId) => {
    if (!window.confirm('Delete this moment? This cannot be undone.')) return;
    try {
      const updated = await deleteMoment(id, momentId);
      // The API returns { message } on delete, so refetch
      setAdventure((prev) => ({
        ...prev,
        moments: prev.moments.filter((m) => m._id !== momentId),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Render ─────────────────────────────────────────────────

  if (loading) return <p className="state-msg edit-adv__state">Loading…</p>;
  if (error)   return <p className="state-msg state-msg--error edit-adv__state">{error}</p>;
  if (!adventure) return null;

  const isCompleted = adventure.status === 'completed';

  return (
    <div className="edit-adv">

      {/* ── Page header ── */}
      <div className="edit-adv__header">
        <div>
          <Link to={`/adventure/${id}`} className="edit-adv__back-link">
            ← View Adventure
          </Link>
          <h1 className="edit-adv__heading">{adventure.title}</h1>
          <span className={`edit-adv__status-badge edit-adv__status-badge--${adventure.status}`}>
            {adventure.status === 'active' ? '● Active' : '✓ Completed'}
          </span>
        </div>

        {!isCompleted && (
          <div className="edit-adv__header-actions">
            {!endConfirm ? (
              <button
                className="btn btn--ghost edit-adv__end-btn"
                onClick={() => setEndConfirm(true)}
              >
                🏁 End Adventure
              </button>
            ) : (
              <div className="edit-adv__end-confirm">
                <span>Are you sure?</span>
                <button
                  className="btn btn--danger"
                  onClick={handleEndAdventure}
                  disabled={ending}
                >
                  {ending ? 'Ending…' : 'Yes, End It'}
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() => setEndConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="edit-adv__grid">

        {/* ── Left: adventure details ── */}
        <section className="edit-adv__card">
          <h2 className="edit-adv__card-title">Adventure Details</h2>

          <form onSubmit={handleSaveDetails} className="edit-adv__form">

            {/* Featured image */}
            <div className="edit-adv__field">
              <label className="edit-adv__label">Featured Image</label>
              <div
                className="edit-adv__img-area"
                onClick={() => detailsImgRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && detailsImgRef.current?.click()}
              >
                {detailsPreview && (
                  <img src={detailsPreview} alt="Featured" className="edit-adv__img-preview" />
                )}
                <div className="edit-adv__img-overlay">
                  <span>Click to change</span>
                </div>
              </div>
              <input
                ref={detailsImgRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleDetailsImageSelect}
              />
            </div>

            {/* Title */}
            <div className="edit-adv__field">
              <label className="edit-adv__label" htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                className="edit-adv__input"
                value={details.title || ''}
                onChange={handleDetailChange}
              />
            </div>

            {/* Category */}
            <div className="edit-adv__field">
              <label className="edit-adv__label">Category</label>
              <div className="edit-adv__cat-grid">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`edit-adv__cat-btn${details.category === cat ? ' selected' : ''}`}
                    onClick={() =>
                      setDetails((prev) => ({ ...prev, category: cat }))
                    }
                  >
                    {CATEGORY_ICONS[cat]} {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="edit-adv__field">
              <label className="edit-adv__label" htmlFor="startLocation">Start Location</label>
              <input
                id="startLocation"
                name="startLocation"
                type="text"
                className="edit-adv__input"
                value={details.startLocation || ''}
                onChange={handleDetailChange}
              />
            </div>
            <div className="edit-adv__field">
              <label className="edit-adv__label" htmlFor="endLocation">
                End Location <span className="edit-adv__optional">(optional)</span>
              </label>
              <input
                id="endLocation"
                name="endLocation"
                type="text"
                className="edit-adv__input"
                value={details.endLocation || ''}
                onChange={handleDetailChange}
              />
            </div>

            <div className="edit-adv__form-footer">
              {detailsSuccess && (
                <span className="edit-adv__success">✓ Saved</span>
              )}
              <button
                type="submit"
                className="btn btn--primary"
                disabled={detailsSaving}
              >
                {detailsSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>

        {/* ── Right: moments ── */}
        <section className="edit-adv__card edit-adv__moments-card">
          <div className="edit-adv__moments-header">
            <h2 className="edit-adv__card-title">
              Moments
              <span className="edit-adv__moments-count">{adventure.moments.length}</span>
            </h2>
            {!isCompleted && !showAddMoment && (
              <button
                className="btn btn--primary edit-adv__add-btn"
                onClick={() => setShowAddMoment(true)}
              >
                + Add Moment
              </button>
            )}
          </div>

          {/* Add moment form */}
          {showAddMoment && (
            <form className="edit-adv__moment-form" onSubmit={handleAddMoment} noValidate>
              <h3 className="edit-adv__moment-form-title">New Moment</h3>

              <div className="edit-adv__field">
                <label className="edit-adv__label">Title *</label>
                <input
                  name="title"
                  type="text"
                  className="edit-adv__input"
                  placeholder="What happened?"
                  value={momentForm.title}
                  onChange={handleMomentChange}
                />
              </div>

              <div className="edit-adv__field">
                <label className="edit-adv__label">Description *</label>
                <textarea
                  name="description"
                  className="edit-adv__textarea"
                  placeholder="Tell the story of this moment…"
                  rows={5}
                  value={momentForm.description}
                  onChange={handleMomentChange}
                />
              </div>

              <div className="edit-adv__field">
                <label className="edit-adv__label">
                  Photo <span className="edit-adv__optional">(optional)</span>
                </label>
                {momentPreview && (
                  <img src={momentPreview} alt="Moment" className="edit-adv__moment-img-preview" />
                )}
                <button
                  type="button"
                  className="btn btn--ghost edit-adv__upload-btn"
                  onClick={() => momentPhotoRef.current?.click()}
                >
                  {momentPreview ? '📷 Change Photo' : '📷 Upload Photo'}
                </button>
                <input
                  ref={momentPhotoRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleMomentPhotoSelect}
                />
              </div>

              <div className="edit-adv__field">
                <label className="edit-adv__label">
                  Video URL <span className="edit-adv__optional">(YouTube / Vimeo)</span>
                </label>
                <input
                  name="videoUrl"
                  type="url"
                  className="edit-adv__input"
                  placeholder="https://youtube.com/watch?v=..."
                  value={momentForm.videoUrl}
                  onChange={handleMomentChange}
                />
              </div>

              {momentError && (
                <p className="edit-adv__error">{momentError}</p>
              )}

              <div className="edit-adv__moment-form-actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setShowAddMoment(false);
                    setMomentForm(emptyMomentForm());
                    setMomentPhoto(null);
                    setMomentPreview('');
                    setMomentError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={momentSaving}
                >
                  {momentSaving ? 'Saving…' : 'Add Moment'}
                </button>
              </div>
            </form>
          )}

          {/* Moments list */}
          {adventure.moments.length === 0 && !showAddMoment ? (
            <div className="edit-adv__no-moments">
              <p>No moments yet.</p>
              <p>Click "Add Moment" to log your first entry.</p>
            </div>
          ) : (
            <ol className="edit-adv__moments-list">
              {adventure.moments.map((moment, idx) => (
                <li key={moment._id} className="edit-adv__moment-item">
                  {editingId === moment._id ? (
                    /* ── Inline edit form ── */
                    <form className="edit-adv__moment-form edit-adv__moment-form--inline" onSubmit={handleSaveMoment} noValidate>
                      <div className="edit-adv__field">
                        <label className="edit-adv__label">Title *</label>
                        <input
                          name="title"
                          type="text"
                          className="edit-adv__input"
                          value={editForm.title}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="edit-adv__field">
                        <label className="edit-adv__label">Description *</label>
                        <textarea
                          name="description"
                          className="edit-adv__textarea"
                          rows={4}
                          value={editForm.description}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="edit-adv__field">
                        <label className="edit-adv__label">
                          Photo <span className="edit-adv__optional">(optional)</span>
                        </label>
                        {editPreview && (
                          <img src={editPreview} alt="Moment" className="edit-adv__moment-img-preview" />
                        )}
                        <button
                          type="button"
                          className="btn btn--ghost edit-adv__upload-btn"
                          onClick={() => editPhotoRef.current?.click()}
                        >
                          📷 {editPreview ? 'Change Photo' : 'Upload Photo'}
                        </button>
                        <input
                          ref={editPhotoRef}
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleEditPhotoSelect}
                        />
                      </div>
                      <div className="edit-adv__field">
                        <label className="edit-adv__label">
                          Video URL <span className="edit-adv__optional">(YouTube / Vimeo)</span>
                        </label>
                        <input
                          name="videoUrl"
                          type="url"
                          className="edit-adv__input"
                          value={editForm.videoUrl}
                          onChange={handleEditChange}
                        />
                      </div>
                      {editError && <p className="edit-adv__error">{editError}</p>}
                      <div className="edit-adv__moment-form-actions">
                        <button type="button" className="btn btn--ghost" onClick={cancelEditMoment}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={editSaving}>
                          {editSaving ? 'Saving…' : 'Save Moment'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ── Moment display ── */
                    <div className="edit-adv__moment-display">
                      <div className="edit-adv__moment-display-header">
                        <span className="edit-adv__moment-num">{idx + 1}</span>
                        <div className="edit-adv__moment-display-meta">
                          <strong className="edit-adv__moment-display-title">
                            {moment.title}
                          </strong>
                          <time className="edit-adv__moment-display-time">
                            {formatDateTime(moment.createdAt)}
                          </time>
                        </div>
                        <div className="edit-adv__moment-display-actions">
                          <button
                            className="edit-adv__icon-btn"
                            onClick={() => startEditMoment(moment)}
                            title="Edit moment"
                          >
                            ✏️
                          </button>
                          <button
                            className="edit-adv__icon-btn edit-adv__icon-btn--delete"
                            onClick={() => handleDeleteMoment(moment._id)}
                            title="Delete moment"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                      <p className="edit-adv__moment-display-desc">{moment.description}</p>
                      {moment.photo && (
                        <img
                          src={moment.photo}
                          alt={moment.title}
                          className="edit-adv__moment-display-photo"
                          loading="lazy"
                        />
                      )}
                      {moment.videoUrl && (
                        <a
                          href={moment.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="edit-adv__moment-video-link"
                        >
                          ▶ Video
                        </a>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}

          {!isCompleted && adventure.moments.length > 0 && !showAddMoment && (
            <button
              className="btn btn--ghost edit-adv__add-more-btn"
              onClick={() => setShowAddMoment(true)}
            >
              + Add Another Moment
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default EditAdventure;
