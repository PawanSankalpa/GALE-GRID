import React from 'react';
import './Skeleton.css';

/**
 * SkeletonText Component
 * Renders a loading placeholder for text content
 * 
 * @param {number} lines - Number of text lines (default: 1)
 * @param {string} size - Size variant: 'small' | 'medium' | 'large' | 'heading' (default: 'medium')
 */
export const SkeletonText = React.memo(({ lines = 1, size = 'medium' }) => {
  if (lines > 1) {
    return (
      <div className="skeleton-text-lines">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="line"
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return <div className={`skeleton-text ${size}`} />;
});

SkeletonText.displayName = 'SkeletonText';

/**
 * SkeletonImage Component
 * Renders a loading placeholder for images
 * 
 * @param {string} aspect - Aspect ratio: 'landscape' | 'portrait' | 'square' | 'circular' (default: 'square')
 * @param {string} className - Additional CSS classes
 */
export const SkeletonImage = React.memo(({ aspect = 'square', className = '' }) => (
  <div className={`skeleton-image ${aspect} ${className}`} />
));

SkeletonImage.displayName = 'SkeletonImage';

/**
 * SkeletonCard Component
 * Renders a loading placeholder for card-like content
 * 
 * @param {boolean} showAvatar - Show avatar placeholder (default: false)
 * @param {number} lines - Number of text lines in content (default: 2)
 */
export const SkeletonCard = React.memo(({ showAvatar = false, lines = 2 }) => (
  <div className="skeleton-card">
    {showAvatar ? (
      <div className="skeleton-card-header">
        <div className="skeleton-card-avatar" />
        <div className="skeleton-card-content" style={{ flex: 1 }}>
          <div className="skeleton-card-title" />
          <div style={{ height: 12 }} className="skeleton-text" />
        </div>
      </div>
    ) : (
      <div className="skeleton-card-title" />
    )}

    <div className="skeleton-card-content">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-card-text"
          style={{
            animationDelay: `${i * 0.1}s`,
            width: i === lines - 1 ? '85%' : '100%',
          }}
        />
      ))}
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

/**
 * SkeletonGrid Component
 * Renders a grid of loading placeholders
 * 
 * @param {number} count - Number of grid items (default: 3)
 * @param {boolean} includeImage - Show image placeholder (default: true)
 * @param {number} lines - Number of text lines per item (default: 2)
 */
export const SkeletonGrid = React.memo(({ count = 3, includeImage = true, lines = 2 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="skeleton-grid-item" style={{ animationDelay: `${idx * 0.1}s` }}>
        {includeImage && <div className="skeleton-grid-image" />}
        <div className="skeleton-grid-content">
          <div className="skeleton-grid-title" />
          <div className="skeleton-grid-description">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className="line"
                style={{
                  animationDelay: `${(idx * 0.1) + (i * 0.05)}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
));

SkeletonGrid.displayName = 'SkeletonGrid';

/**
 * SkeletonCarousel Component
 * Renders a carousel of loading placeholders
 * 
 * @param {number} count - Number of carousel items (default: 3)
 * @param {string} height - Height of carousel items in px (default: '300px')
 */
export const SkeletonCarousel = React.memo(({ count = 3, height = '300px' }) => (
  <div className="skeleton-carousel">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="skeleton-carousel-item"
        style={{
          height,
          animationDelay: `${idx * 0.1}s`,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            background: '#e0e0e0',
            backgroundImage: `linear-gradient(
              90deg,
              #e0e0e0 0%,
              #f0f0f0 50%,
              #e0e0e0 100%
            )`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      </div>
    ))}
  </div>
));

SkeletonCarousel.displayName = 'SkeletonCarousel';

/**
 * SkeletonPortfolioGrid Component
 * Renders a portfolio/mosaic-style loading grid
 * Matches the exact layout of PortfolioSection
 */
export const SkeletonPortfolioGrid = React.memo(() => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '32px' }}>
    {/* ROW 1 */}
    <div style={{ gridColumn: 'span 1' }}>
      <div className="skeleton-image landscape" />
    </div>
    <div style={{ gridColumn: 'span 1' }}>
      <div className="skeleton-image landscape" />
    </div>
    <div style={{ gridColumn: 'span 1' }}>
      <div className="skeleton-image landscape" />
    </div>

    {/* ROW 2 */}
    <div style={{ gridColumn: 'span 2' }}>
      <div className="skeleton-image landscape" />
    </div>
    <div style={{ gridColumn: 'span 1' }}>
      <div className="skeleton-image landscape" />
    </div>
  </div>
));

SkeletonPortfolioGrid.displayName = 'SkeletonPortfolioGrid';
