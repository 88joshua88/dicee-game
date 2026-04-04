import { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadAvatar, updateProfile } from '../../services/userService';

/**
 * DashboardProfile — view and edit the logged-in user's personal details.
 * Profile picture upload goes via Cloudinary.
 */
const DashboardProfile = () => {
  const { user, updateUser } = useAuth();
  const avatarInputRef = useRef(null);

  const [form, setForm] = useState({
    name:     user?.name     || '',
    bio:      user?.bio      || '',
    location: user?.location || '',
  });
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.profilePicture || '');
  const [saving,        setSaving]        = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [error,         setError]         = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
  };

  const handleAvatarClick = () => avatarInputRef.current?.click();

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required.');
    setError(null);
    setSaving(true);

    try {
      let profilePicture = user?.profilePicture;
      if (avatarFile) {
        const result = await uploadAvatar(avatarFile);
        profilePicture = result.url;
      }

      const updated = await updateProfile({
        name:           form.name.trim(),
        bio:            form.bio.trim(),
        location:       form.location.trim(),
        profilePicture,
      });

      updateUser(updated);
      setAvatarFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || '?')[0].toUpperCase();

  return (
    <div className="db-section">
      <h1 className="db-section__title">My Profile</h1>
      <p className="db-section__subtitle">
        Update your personal information and profile photo.
      </p>

      <form className="db-profile" onSubmit={handleSubmit} noValidate>

        {/* ── Avatar ── */}
        <div className="db-profile__avatar-wrap">
          <button
            type="button"
            className="db-profile__avatar"
            onClick={handleAvatarClick}
            title="Change profile photo"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" />
            ) : (
              <span className="db-profile__avatar-initials">{initials}</span>
            )}
            <div className="db-profile__avatar-overlay">
              <span>📷</span>
            </div>
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleAvatarSelect}
          />
          <div>
            <p className="db-profile__avatar-hint">Click to upload a new photo</p>
            <p className="db-profile__avatar-hint db-profile__avatar-hint--muted">
              JPG, PNG or WebP recommended
            </p>
          </div>
        </div>

        {/* ── Fields ── */}
        <div className="db-profile__fields">
          <div className="db-profile__row">
            <div className="db-form__group">
              <label className="db-form__label" htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="db-form__input"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div className="db-form__group">
              <label className="db-form__label">Email Address</label>
              <input
                type="email"
                className="db-form__input db-form__input--readonly"
                value={user?.email || ''}
                readOnly
                title="Email cannot be changed"
              />
            </div>
          </div>

          <div className="db-form__group">
            <label className="db-form__label" htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              className="db-form__input"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Chiang Mai, Thailand"
            />
          </div>

          <div className="db-form__group">
            <label className="db-form__label" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              className="db-form__textarea"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell the world a little about yourself and your travels…"
              rows={4}
              maxLength={500}
            />
            <span className="db-form__char-count">{form.bio.length}/500</span>
          </div>
        </div>

        {/* ── Footer ── */}
        {error   && <p className="db-form__error">{error}</p>}
        {success  && <p className="db-form__success">✓ Profile saved successfully</p>}

        <div className="db-form__actions">
          <button type="submit" className="db-btn db-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardProfile;
