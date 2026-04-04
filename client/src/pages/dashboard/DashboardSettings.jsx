import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updatePassword } from '../../services/userService';

/**
 * DashboardSettings — account management.
 * Sections: Change Password, Email Preferences, Subscription, Account Management.
 */
const DashboardSettings = () => {
  const { user, logout } = useAuth();

  // ── Change password state ──────────────────────────────────
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [pwSaving,  setPwSaving]  = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError,   setPwError]   = useState(null);

  const handlePwChange = (e) =>
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (!pwForm.currentPassword || !pwForm.newPassword) {
      return setPwError('All fields are required.');
    }
    if (pwForm.newPassword.length < 6) {
      return setPwError('New password must be at least 6 characters.');
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return setPwError('New passwords do not match.');
    }

    setPwSaving(true);
    try {
      await updatePassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="db-section">
      <h1 className="db-section__title">Settings</h1>
      <p className="db-section__subtitle">Manage your account and preferences.</p>

      <div className="db-settings">

        {/* ── Change Password ── */}
        <div className="db-settings__card">
          <h2 className="db-settings__card-title">Change Password</h2>
          <form onSubmit={handlePwSubmit} className="db-settings__form" noValidate>
            <div className="db-form__group">
              <label className="db-form__label" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                className="db-form__input"
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                autoComplete="current-password"
              />
            </div>
            <div className="db-settings__pw-row">
              <div className="db-form__group">
                <label className="db-form__label" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="db-form__input"
                  value={pwForm.newPassword}
                  onChange={handlePwChange}
                  autoComplete="new-password"
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="db-form__group">
                <label className="db-form__label" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="db-form__input"
                  value={pwForm.confirmPassword}
                  onChange={handlePwChange}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {pwError   && <p className="db-form__error">{pwError}</p>}
            {pwSuccess  && <p className="db-form__success">✓ Password updated successfully</p>}

            <div className="db-form__actions">
              <button
                type="submit"
                className="db-btn db-btn--primary"
                disabled={pwSaving}
              >
                {pwSaving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Email Preferences ── */}
        <div className="db-settings__card">
          <h2 className="db-settings__card-title">Email Preferences</h2>
          <p className="db-settings__card-desc">
            Choose which emails you'd like to receive.
          </p>
          <div className="db-settings__prefs">
            {[
              { id: 'pref-updates',   label: 'Adventure updates from people you follow' },
              { id: 'pref-comments',  label: 'Comments on your adventures' },
              { id: 'pref-digest',    label: 'Weekly digest of top adventures' },
              { id: 'pref-marketing', label: 'Product announcements and news' },
            ].map(({ id, label }) => (
              <label key={id} className="db-settings__pref-item">
                <input type="checkbox" className="db-settings__checkbox" disabled />
                <span>{label}</span>
                <span className="db-settings__coming-soon">Coming soon</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Subscription ── */}
        <div className="db-settings__card db-settings__card--soon">
          <div className="db-settings__soon-badge">Coming Soon</div>
          <h2 className="db-settings__card-title">Subscription</h2>
          <p className="db-settings__card-desc">
            Premium plans with unlimited adventure storage, custom domains, and
            priority support are in development. Stay tuned.
          </p>
        </div>

        {/* ── Account Management ── */}
        <div className="db-settings__card db-settings__card--danger">
          <h2 className="db-settings__card-title db-settings__card-title--danger">
            Account Management
          </h2>
          <p className="db-settings__card-desc">
            Permanently delete your account and all associated adventures.
            This action cannot be undone.
          </p>
          <div className="db-form__actions">
            <button
              type="button"
              className="db-btn db-btn--danger"
              disabled
              title="Coming soon"
            >
              Delete Account
            </button>
            <span className="db-settings__disabled-note">
              Account deletion coming soon
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardSettings;
