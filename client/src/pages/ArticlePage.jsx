import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getArticleById } from '../services/articleService';
import './ArticlePage.css';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

/**
 * ArticlePage — public reading view for a single Article.
 * Renders the latest version's content.
 *
 * Route: /article/:id
 */
const ArticlePage = () => {
  const { id }          = useParams();
  const { user }        = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="article-page-state">
      <p className="state-msg">Loading article…</p>
    </div>
  );

  if (error) return (
    <div className="article-page-state">
      <p className="state-msg state-msg--error">{error}</p>
    </div>
  );

  if (!article) return null;

  const latestVersion = article.versions[article.versions.length - 1];
  const isAuthor      = user?._id === article.author?._id;

  return (
    <div className="article-page">

      {/* ── Hero / header ─────────────────────────────────────────── */}
      <div className="article-hero">
        {article.featuredImage && (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="article-hero__img"
          />
        )}

        <div className="article-hero__overlay">
          <div className="article-hero__inner">
            {/* Breadcrumb tags */}
            <div className="article-meta-tags">
              <span className="article-tag article-tag--sub">Article</span>
              {article.articleCategory && (
                <span className="article-tag article-tag--cat">{article.articleCategory}</span>
              )}
            </div>

            <h1 className="article-hero__title">{article.title}</h1>

            <div className="article-byline">
              <Link to={`/profile/${article.author?._id}`} className="article-byline__author">
                {article.author?.name}
              </Link>
              <span className="article-byline__sep">·</span>
              <span className="article-byline__date">
                {latestVersion ? formatDate(latestVersion.createdAt) : ''}
              </span>
              {article.versions.length > 1 && (
                <>
                  <span className="article-byline__sep">·</span>
                  <span className="article-byline__version">
                    v{latestVersion.versionNumber}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="article-body">

        {/* Main content column */}
        <article className="article-content">
          {/* Lead description */}
          <p className="article-lead">{article.description}</p>

          <div className="article-divider" />

          {/* Full content (latest version) */}
          <div className="article-text">
            {latestVersion?.content ?? 'No content available.'}
          </div>

          {/* Author card */}
          <div className="article-author-card">
            <div className="article-author-card__avatar">
              {article.author?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="article-author-card__info">
              <span className="article-author-card__label">Written by</span>
              <Link
                to={`/profile/${article.author?._id}`}
                className="article-author-card__name"
              >
                {article.author?.name}
              </Link>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="article-sidebar">
          <div className="article-sidebar__card">
            <p className="article-sidebar__label">Price</p>
            <p className="article-sidebar__price">
              {article.price.currency} {Number(article.price.amount).toFixed(2)}
            </p>

            {/* Buy Now — UI only, no payment logic yet */}
            <button className="btn btn--primary article-sidebar__buy" disabled>
              Buy Now
            </button>
            <p className="article-sidebar__coming">
              Payments coming soon
            </p>

            {/* Author manage link */}
            {isAuthor && (
              <Link
                to={`/article/manage/${id}`}
                className="btn btn--ghost article-sidebar__manage"
              >
                Manage Article
              </Link>
            )}
          </div>

          {/* Version info */}
          <div className="article-sidebar__card article-sidebar__versions">
            <p className="article-sidebar__label">Version</p>
            <p className="article-sidebar__ver-num">
              v{latestVersion?.versionNumber}
            </p>
            <p className="article-sidebar__ver-date">
              {latestVersion ? formatDate(latestVersion.createdAt) : ''}
            </p>
            {article.versions.length > 1 && (
              <p className="article-sidebar__ver-total">
                {article.versions.length} versions total
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticlePage;
