import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../config/categories';
import './CategoryModal.css';

/**
 * CategoryModal — two-step energy type selector.
 *
 * Step 1: choose a Category (Content / Services / Consultation / Event)
 * Step 2: choose a Subcategory within that category
 *
 * On confirmation it navigates to the creation page for the selected type.
 * Reads entirely from categories.js config — no hardcoded types here.
 *
 * Props:
 *   isOpen  — boolean
 *   onClose — callback to close
 */
const CategoryModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [selectedCategory,    setSelectedCategory]    = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Reset selections whenever the modal re-opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }
  }, [isOpen]);

  // Close on ESC key
  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );
  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleCategoryClick = (cat) => {
    if (cat.comingSoon) return; // coming-soon categories are not selectable
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (sub) => {
    if (!sub.implemented) return;
    setSelectedSubcategory(sub);
  };

  const handleContinue = () => {
    if (!selectedSubcategory?.route) return;
    onClose();
    navigate(selectedSubcategory.route);
  };

  return (
    /* Backdrop */
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create Energy</h2>
            <p className="modal-subtitle">
              {selectedCategory
                ? `Select a type under ${selectedCategory.label}`
                : 'Choose a category to get started'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Step 1 — Category grid */}
        <div className="modal-body">
          <div className="modal-section">
            <p className="modal-section__label">Category</p>
            <div className="cat-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-card${selectedCategory?.id === cat.id ? ' selected' : ''}${cat.comingSoon ? ' coming-soon' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                  disabled={cat.comingSoon}
                >
                  <span className="cat-card__icon">{cat.icon}</span>
                  <span className="cat-card__label">{cat.label}</span>
                  {cat.comingSoon && (
                    <span className="badge badge--soon">Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 — Subcategory grid (only when a category is selected) */}
          {selectedCategory && (
            <div className="modal-section modal-section--sub">
              <p className="modal-section__label">Type</p>
              <div className="sub-grid">
                {selectedCategory.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    className={`sub-card${selectedSubcategory?.id === sub.id ? ' selected' : ''}${!sub.implemented ? ' coming-soon' : ''}`}
                    onClick={() => handleSubcategoryClick(sub)}
                    disabled={!sub.implemented}
                  >
                    <span className="sub-card__icon">{sub.icon}</span>
                    <div className="sub-card__text">
                      <span className="sub-card__label">{sub.label}</span>
                      <span className="sub-card__desc">{sub.description}</span>
                    </div>
                    {!sub.implemented && (
                      <span className="badge badge--soon">Soon</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer — Continue */}
        <div className="modal-footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn--primary"
            disabled={!selectedSubcategory}
            onClick={handleContinue}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
