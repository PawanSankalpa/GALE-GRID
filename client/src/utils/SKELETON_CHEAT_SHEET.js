/**
 * SKELETON LOADING SYSTEM - QUICK REFERENCE CHEAT SHEET
 * 
 * Copy-paste snippets for quick implementation
 */

// ============================================
// 1. MINIMAL SETUP (Copy-Paste Ready)
// ============================================

/**
 * Minimum code to add skeleton to any component
 * Just replace "COMPONENT_NAME" and import paths
 */

/*
import React, { useState, useEffect } from 'react';
import { SkeletonGrid } from '../components/skeletons/SkeletonComponents';
import { useSkeletonDelay } from '../hooks/useDataLoader';
import '../components/skeletons/Skeleton.css';

function COMPONENT_NAME() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // REPLACE WITH YOUR DATA LOADING CODE
      await new Promise(resolve => setTimeout(resolve, 300));
      setData(yourData);
      setLoading(false);
    };
    load();
  }, []);

  const showSkeleton = useSkeletonDelay(loading);

  return (
    <section>
      {showSkeleton ? (
        <SkeletonGrid count={3} />
      ) : (
        <div className="fade-in">
          {/* YOUR EXISTING JSX */}
        </div>
      )}
    </section>
  );
}

export default COMPONENT_NAME;
*/

// ============================================
// 2. COMPONENT TEMPLATES
// ============================================

/**
 * A. Simple List/Grid Component
 */
const TemplateSimpleGrid = `
import React, { useState, useEffect } from 'react';
import { SkeletonGrid } from '../components/skeletons/SkeletonComponents';
import { useSkeletonDelay } from '../hooks/useDataLoader';

function Portfolio() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  const showSkeleton = useSkeletonDelay(loading);

  return (
    <>
      {showSkeleton ? (
        <SkeletonGrid count={3} />
      ) : (
        <div className="fade-in">
          {items.map(item => <Card key={item.id} item={item} />)}
        </div>
      )}
    </>
  );
}
`;

/**
 * B. Carousel Component
 */
const TemplateCarousel = `
import React, { useState, useEffect } from 'react';
import { SkeletonCarousel } from '../components/skeletons/SkeletonComponents';
import { useSkeletonDelay } from '../hooks/useDataLoader';

function Reviews() {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      });
  }, []);

  const showSkeleton = useSkeletonDelay(loading);

  return (
    <>
      {showSkeleton ? (
        <SkeletonCarousel count={3} height="250px" />
      ) : (
        <div className="fade-in">
          {reviews && <ReviewCard review={reviews[active]} />}
        </div>
      )}
    </>
  );
}
`;

/**
 * C. Individual Image Loading
 */
const TemplateImage = `
import React from 'react';
import { useImageLoader } from '../hooks/useDataLoader';
import { SkeletonImage } from '../components/skeletons/SkeletonComponents';

function ProjectCard({ project }) {
  const { loaded, error, src } = useImageLoader(project.image, '/fallback.jpg');

  return (
    <article>
      {!loaded && !error ? (
        <SkeletonImage aspect="landscape" />
      ) : (
        <img src={src} alt={project.name} className={loaded ? 'fade-in' : ''} />
      )}
      <h3>{project.name}</h3>
    </article>
  );
}
`;

/**
 * D. Multiple Sections (Different Loading States)
 */
const TemplateMultipleSections = `
import React, { useState, useEffect } from 'react';
import { SkeletonGrid, SkeletonCarousel } from '../components/skeletons/SkeletonComponents';
import { useSkeletonDelay } from '../hooks/useDataLoader';

function HomePage() {
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  
  const [reviews, setReviews] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(data => {
        setPortfolio(data);
        setPortfolioLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        setReviews(data);
        setReviewsLoading(false);
      });
  }, []);

  const showPortfolioSkeleton = useSkeletonDelay(portfolioLoading);
  const showReviewsSkeleton = useSkeletonDelay(reviewsLoading);

  return (
    <>
      <section className="portfolio">
        {showPortfolioSkeleton ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="fade-in">
            {portfolio?.map(item => <Card key={item.id} item={item} />)}
          </div>
        )}
      </section>

      <section className="reviews">
        {showReviewsSkeleton ? (
          <SkeletonCarousel count={3} height="250px" />
        ) : (
          <div className="fade-in">
            {reviews?.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        )}
      </section>
    </>
  );
}
`;

// ============================================
// 3. IMPORTS QUICK REFERENCE
// ============================================

const ImportsReference = `
// Core Skeleton Components
import {
  SkeletonText,
  SkeletonImage,
  SkeletonCard,
  SkeletonGrid,
  SkeletonCarousel,
  SkeletonPortfolioGrid
} from '../components/skeletons/SkeletonComponents';

// CSS
import '../components/skeletons/Skeleton.css';

// Hooks
import {
  useSkeletonDelay,
  useDataLoader,
  usePaginatedDataLoader,
  useImageLoader
} from '../hooks/useDataLoader';

// React utilities
import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import React from 'react';
`;

// ============================================
// 4. KEY CSS CLASSES
// ============================================

const CSSClasses = `
.skeleton                    - Base skeleton styling
.skeleton-text              - Text placeholder
.skeleton-image             - Image placeholder
.skeleton-card              - Card placeholder
.skeleton-grid              - Grid of items
.skeleton-carousel          - Carousel items
.fade-in                    - Smooth content reveal (add to main content div)
.fade-out                   - Smooth fade out (optional)

Aspect ratios for SkeletonImage:
- aspect="landscape"        - 16:9 ratio (for hero/project images)
- aspect="portrait"         - 9:16 ratio (for tall images)
- aspect="square"           - 1:1 ratio (for avatars/thumbnails)
- aspect="circular"         - Circle (for avatars)

Size variants for SkeletonText:
- size="small"              - 12px height
- size="medium"             - 16px height (default)
- size="large"              - 24px height
- size="heading"            - 32px height
`;

// ============================================
// 5. COMMON PATTERNS
// ============================================

const PatternMinimumDelay = `
// Prevent skeleton from flashing on fast loads
const showSkeleton = useSkeletonDelay(loading, 300);
// ✓ If load time < 300ms: Shows content immediately (no skeleton)
// ✓ If load time > 300ms: Shows skeleton after 300ms delay
`;

const PatternMemoization = `
// Memoize child components to prevent unnecessary re-renders
const CardItem = React.memo(({ item }) => (
  <div className="card">{item.title}</div>
));

// Memoize event handlers
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);

// Memoize computed values
const filtered = useMemo(() => {
  return items.filter(item => item.active);
}, [items]);
`;

const PatternConditionalRender = `
// Always follow this structure
{showSkeleton ? (
  <SkeletonComponent />
) : (
  <div className="fade-in">
    {/* Your actual content */}
  </div>
)}

// Why?
// 1. showSkeleton prevents flash on fast loads
// 2. fade-in class smoothly animates content
// 3. No layout shift (skeleton matches exact dimensions)
`;

const PatternErrorStates = `
const { data, loading, error } = useDataLoader(
  async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed to load');
    return response.json();
  },
  []
);

const showSkeleton = useSkeletonDelay(loading);

return (
  <>
    {showSkeleton && <SkeletonGrid />}
    {error && <ErrorMessage error={error} />}
    {data && <Content data={data} />}
  </>
);
`;

// ============================================
// 6. PERFORMANCE CHECKLIST
// ============================================

const PerformanceChecklist = `
Before merging your changes, ensure:

□ Skeleton shows only on slow networks (test with DevTools throttle)
□ No skeleton flash on fast networks
□ Images use loading="lazy" attribute
□ Images use decoding="async" attribute
□ Child components are memoized (React.memo)
□ Event handlers use useCallback
□ Computed values use useMemo
□ No console warnings or errors
□ Responsive on mobile devices
□ Accessibility: test with screen reader
□ Accessibility: check prefers-reduced-motion
□ Performance: check DevTools Profiler for unnecessary re-renders
□ Bundle size: verify <5KB impact

Test command:
npm run build && npm run analyze  # Check bundle size
`;

// ============================================
// 7. DEBUGGING TIPS
// ============================================

const DebugTips = `
Problem: Skeleton flashing even on slow network
Solution: Check useSkeletonDelay threshold is not too high
  const showSkeleton = useSkeletonDelay(loading, 300); // Max 500ms

Problem: Content appears in wrong place
Solution: Ensure skeleton dimensions match content dimensions
  Check: SkeletonGrid count matches your grid items

Problem: Images not loading from lazy="lazy"
Solution: Use in combination with decoding="async":
  <img src={url} alt={alt} loading="lazy" decoding="async" />

Problem: Skeleton CSS not applying
Solution: Ensure CSS is imported at top of component or main file:
  import '../components/skeletons/Skeleton.css';

Problem: Memory leak warning in console
Solution: useDataLoader already handles cleanup, but check your code:
  useEffect(() => {
    let isMounted = true;
    // ... async work ...
    if (isMounted) setData(result);
    return () => { isMounted = false; }; // Cleanup
  }, []);

Problem: Too many re-renders
Solution: Use React.memo and useCallback:
  - Wrap components with React.memo()
  - Wrap handlers with useCallback()
  - Wrap computed values with useMemo()
`;

// ============================================
// 8. COMMON QUESTIONS
// ============================================

const FAQ = `
Q: How long should skeleton show?
A: Typically 300-500ms. Use useSkeletonDelay hook to auto-manage.

Q: Should I show skeleton or spinner?
A: Skeleton when you know the layout. Spinner for unknown layouts.

Q: What if data loads in 100ms?
A: useSkeletonDelay prevents display. Just shows content (no flash).

Q: Can I use custom colors?
A: Yes. Edit CSS variables in Skeleton.css:
   --skeleton-bg: #e0e0e0;
   --skeleton-highlight: #f0f0f0;

Q: Does it work with server-side rendering?
A: Yes. Just ensure CSS is imported and components render normally on server.

Q: How do I handle pagination?
A: Use usePaginatedDataLoader hook for infinite scroll/load more.

Q: Should I memoize all components?
A: Only child components passed to map(). Cards within grids, items in lists, etc.

Q: Is memoization free?
A: No, it has a small cost. Use only on frequently updated parent-child relationships.

Q: What about accessibility?
A: Built-in. Respects prefers-reduced-motion and has semantic HTML.
`;

// ============================================
// 9. FILE LOCATIONS
// ============================================

const FileLocations = `
Components:
  src/components/skeletons/SkeletonComponents.jsx
  src/components/skeletons/Skeleton.css

Hooks:
  src/hooks/useDataLoader.js

Guides:
  src/utils/SKELETON_INTEGRATION_GUIDE.js
  SKELETON_LOADING_README.md (root)

Examples:
  src/components/PortfolioSection_OPTIMIZED.jsx
  src/components/Reviews_OPTIMIZED.jsx
  src/components/OurTeam_OPTIMIZED.jsx
`;

// ============================================
// 10. 30-SECOND INTEGRATION
// ============================================

const Integration30Seconds = `
Step 1: Import
  import { SkeletonGrid } from '../components/skeletons/SkeletonComponents';
  import { useSkeletonDelay } from '../hooks/useDataLoader';
  import '../components/skeletons/Skeleton.css';

Step 2: Add State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

Step 3: Load Data
  useEffect(() => {
    // Fetch your data and setLoading(false)
  }, []);

Step 4: Use Hook
  const showSkeleton = useSkeletonDelay(loading);

Step 5: Render
  return showSkeleton ? <SkeletonGrid /> : <div className="fade-in">{/* content */}</div>;

Done! 🎉
`;

// ============================================
// EXPORT ALL REFERENCES
// ============================================

export {
  TemplateSimpleGrid,
  TemplateCarousel,
  TemplateImage,
  TemplateMultipleSections,
  ImportsReference,
  CSSClasses,
  PatternMinimumDelay,
  PatternMemoization,
  PatternConditionalRender,
  PatternErrorStates,
  PerformanceChecklist,
  DebugTips,
  FAQ,
  FileLocations,
  Integration30Seconds
};
