import { Link } from 'react-router-dom';
import './ArticleCard.css';

/**
 * ArticleCard — compact card for displaying an Article in lists (Dashboard, Marketplace, Profile).
 *
 * Props:
 *   article   — Article object (from API, versions.content omitted in list views)
 *   showUser  — whether to show the author link (default true)
 *   showManage — whether to show a "Manage" link (for dashboard, author only)
 */
const ArticleCard = ({ article, showUser = true, showManage = false }) => {
  const { _id, title, description, featuredImage, articleCategory, price, versions, author } = article;

  const versionCount   = versions?.length ?? 0;
  const latestVersion  = versionCount > 0 ? versions[versions.length - 1] : null;
  const latestDate     = latestVersion?.createdAt
    ? new Date(latestVersion.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="article-card">
      {/* Featured image */}
      <Link to={`/article/${_id}`} className="article-card__img-wrap">
        {featuredImage
          ? <img src={featuredImage} alt={title} className="article-card__img" />
          : <div className="article-card__img-placeholder">📝</div>
        }
      </Link>

      {/* Body */}
      <div className="article-card__body">
        {/* Tags row */}
        <div className="article-card__tags">
          <span className="article-card__subcategory">Article</span>
          {articleCategory && (
            <span className="article-card__category">{articleCategory}</span>
          )}
        </div>

        <Link to={`/article/${_id}`}>
          <h3 className="article-card__title">{title}</h3>
        </Link>

        <p className="article-card__desc">{description}</p>

        {/* Footer */}
        <div className="article-card__footer">
          <div className="article-card__meta">
            {showUser && author && (
              <Link to={`/profile/${author._id}`} className="article-card__author">
                {author.name}
              </Link>
            )}
            {latestDate && (
              <span className="article-card__date">v{versionCount} · {latestDate}</span>
            )}
          </div>

          <div className="article-card__right">
            {price && (
              <span className="article-card__price">
                {price.currency} {Number(price.amount).toFixed(2)}
              </span>
            )}
            {showManage && (
              <Link to={`/article/manage/${_id}`} className="article-card__manage">
                Manage
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
