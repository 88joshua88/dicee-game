import { useState } from 'react';
import './VersionSection.css';

const THIRTY_DAYS = 30;

/** Milliseconds → whole days elapsed */
const daysSince = (dateStr) =>
  Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

/**
 * VersionSection — displays an article's version history and allows
 * creating a new version when the 30-day cooldown has elapsed.
 *
 * Props:
 *   versions      — array of version objects from the article
 *   onNewVersion  — async (content: string) => void
 */
const VersionSection = ({ versions = [], onNewVersion }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);

  const latestVersion = versions[versions.length - 1];
  const elapsed       = latestVersion ? daysSince(latestVersion.createdAt) : 0;
  const daysRemaining = Math.max(0, THIRTY_DAYS - elapsed);
  const canCreate     = daysRemaining === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newContent.trim().length < 500) {
      setError('Content must be at least 500 characters');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onNewVersion(newContent.trim());
      setShowEditor(false);
      setNewContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="version-section">
      <h3 className="version-section__heading">Version History</h3>

      {/* Current version summary */}
      {latestVersion && (
        <div className="version-current">
          <div className="version-current__badge">
            v{latestVersion.versionNumber}
          </div>
          <div className="version-current__info">
            <span className="version-current__label">Current version</span>
            <span className="version-current__date">
              Published {formatDate(latestVersion.createdAt)}
            </span>
          </div>
        </div>
      )}

      {/* All versions list */}
      {versions.length > 1 && (
        <div className="version-list">
          {[...versions].reverse().map((v) => (
            <div key={v._id} className="version-item">
              <span className="version-item__num">v{v.versionNumber}</span>
              <span className="version-item__date">{formatDate(v.createdAt)}</span>
            </div>
          ))}
        </div>
      )}

      {/* 30-day rule notice */}
      <div className={`version-status${canCreate ? ' version-status--ready' : ''}`}>
        {canCreate ? (
          <span>✓ You can publish a new version</span>
        ) : (
          <span>
            🕐 New version available in <strong>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</strong>
          </span>
        )}
      </div>

      {/* New version button / editor */}
      {!showEditor ? (
        <button
          className={`btn btn--primary version-section__btn${!canCreate ? ' disabled' : ''}`}
          onClick={() => canCreate && setShowEditor(true)}
          disabled={!canCreate}
          title={!canCreate ? `Available in ${daysRemaining} day(s)` : ''}
        >
          + Create New Version
        </button>
      ) : (
        <form className="version-editor" onSubmit={handleSubmit}>
          <label className="version-editor__label">
            New Version Content
            <span className="version-editor__chars">
              {newContent.length} / 50,000 {newContent.length < 500 && '(min 500)'}
            </span>
          </label>
          <textarea
            className="version-editor__textarea"
            value={newContent}
            onChange={(e) => { setError(null); setNewContent(e.target.value); }}
            rows={14}
            placeholder="Write the new version of your article content here…"
            maxLength={50000}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <div className="version-editor__actions">
            <button type="button" className="btn btn--ghost" onClick={() => { setShowEditor(false); setError(null); }}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Publishing…' : 'Publish Version'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VersionSection;
