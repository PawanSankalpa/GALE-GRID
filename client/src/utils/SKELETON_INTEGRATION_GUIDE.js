/**
 * SKELETON LOADING INTEGRATION GUIDE
 * 
 * This document shows best practices for integrating skeleton loading
 * into your existing React components without breaking current functionality.
 */

// ============================================
// PATTERN 1: Review/Carousel Component
// ============================================

/**
 * BEFORE: Reviews.jsx structure (existing)
 * 
 * const ReviewsSection = () => {
 *   const [activeReview, setActiveReview] = useState(0);
 *   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
 * 
 *   const reviews = [...]; // Static data
 * 
 *   return (
 *     <section>
 *       {reviews.map((review) => (
 *         <ReviewCard key={review.id} review={review} />
 *       ))}
 *     </section>
 *   );
 * };
 */

/**
 * AFTER: With skeleton loading (async pattern)
 * 
 * Place this code snippet in your Reviews.jsx
 */

// At the top of Reviews.jsx, import the hooks and components:
/**
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSkeletonDelay } from '../../hooks/useDataLoader';
import { SkeletonCarousel } from '../skeletons/SkeletonComponents';
import '../skeletons/Skeleton.css';
*/

// Update your component to use skeleton loading:
/**
const ReviewsSection = () => {
  const [activeReview, setActiveReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate async data fetch (replace with real API call if needed)
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      // Simulated API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set your existing review data
      setReviews([
        {
          id: 1,
          name: 'Sarah Mitchell',
          // ... rest of review data
        },
        // ... more reviews
      ]);
      
      setLoading(false);
    };

    loadReviews();
  }, []);

  // Use skeleton delay to prevent flashing
  const showSkeleton = useSkeletonDelay(loading);

  return (
    <section className="reviews-section">
      {showSkeleton ? (
        <SkeletonCarousel count={3} height="200px" />
      ) : (
        <>
          {reviews.map((review, idx) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              isActive={idx === activeReview}
              className="fade-in"
            />
          ))}
        </>
      )}
    </section>
  );
};
*/

// ============================================
// PATTERN 2: Portfolio/Grid Component
// ============================================

/**
 * Place this code snippet in your PortfolioSection.jsx
 */

/**
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SkeletonPortfolioGrid } from '../skeletons/SkeletonComponents';
import { useSkeletonDelay } from '../../hooks/useDataLoader';

const PortfolioSection = () => {
  const pfRef = useRef(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate async portfolio loading
  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      
      // Replace with real API call:
      // const response = await fetch('/api/portfolio');
      // const data = await response.json();
      
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Your existing portfolio data
      setPortfolioData({
        projects: [...caseStudies],
      });
      
      setLoading(false);
    };

    loadPortfolio();
  }, []);

  const showSkeleton = useSkeletonDelay(loading);

  // In-view animations for header and cards
  useEffect(() => {
    if (!portfolioData || !pfRef.current) return;
    
    const root = pfRef.current;
    const items = Array.from(root.querySelectorAll('.reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = items.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('is-visible'), Math.max(0, idx) * 80);
      });
    }, { threshold: 0.18 });
    
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [portfolioData]);

  return (
    <section id="portfolio" className="pf-section" ref={pfRef}>
      <div className="pf-shell">
        <header className="pf-header reveal">
          <h2 id="pf-title">SOME OF OUR RECENT WORK</h2>
          <p className="pf-sub">
            A few recent projects we've designed and built. Feel free to explore the live sites.
          </p>
        </header>

        {showSkeleton ? (
          <SkeletonPortfolioGrid />
        ) : (
          <div className="pf-mosaic fade-in">
            {portfolioData?.projects.map((project) => (
              // Your existing portfolio card JSX
              <article key={project.id} className="pf-card reveal">
                {/* ... existing card content ... */}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
*/

// ============================================
// PATTERN 3: Card-based Component (OurTeam)
// ============================================

/**
 * Place this code snippet in your OurTeam.jsx
 */

/**
import React, { useState, useEffect, useCallback } from 'react';
import { useSkeletonDelay } from '../../hooks/useDataLoader';
import { SkeletonGrid } from '../skeletons/SkeletonComponents';

const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate async team data loading
  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      
      // Replace with real API call:
      // const response = await fetch('/api/team');
      // const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setTeamMembers([
        {
          name: "pawan sankalpa",
          desc: "Harvard University — BSc in Computer Science",
          img: PawanImg,
          links: { linkedin: "#", github: "#", website: "#" },
        },
        // ... more members
      ]);
      
      setLoading(false);
    };

    loadTeam();
  }, []);

  const showSkeleton = useSkeletonDelay(loading);

  if (showSkeleton) {
    return (
      <section className="team-section">
        <SkeletonGrid count={2} includeImage={true} lines={2} />
      </section>
    );
  }

  return (
    <section className="team-section fade-in">
      {teamMembers?.map((member) => (
        <TeamCard key={member.name} person={member} />
      ))}
    </section>
  );
};
*/

// ============================================
// PATTERN 4: Pricing Section
// ============================================

/**
 * Place this code snippet in your PricingSection.jsx
 */

/**
import React, { useState, useEffect } from 'react';
import { useSkeletonDelay } from '../../hooks/useDataLoader';
import { SkeletonGrid } from '../skeletons/SkeletonComponents';

const PricingSection = () => {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPricing = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setPricingData({
        plans: [...plans],
        hireTeamOptions: [...hireTeamOptions],
      });
      
      setLoading(false);
    };

    loadPricing();
  }, []);

  const showSkeleton = useSkeletonDelay(loading);

  if (showSkeleton) {
    return (
      <section className="pricing-section">
        <SkeletonGrid count={3} includeImage={false} lines={5} />
      </section>
    );
  }

  return (
    <section className="pricing-section fade-in">
      {pricingData?.plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </section>
  );
};
*/

// ============================================
// PATTERN 5: Image Loading with Fallback
// ============================================

/**
 * For individual images, use this pattern with the useImageLoader hook:
 */

/**
import { useImageLoader } from '../../hooks/useDataLoader';
import { SkeletonImage } from '../skeletons/SkeletonComponents';

const PortfolioCard = ({ project }) => {
  const { loaded, error, src } = useImageLoader(project.imageUrl, '/fallback-image.png');

  return (
    <article className="portfolio-card">
      {!loaded && !error ? (
        <SkeletonImage aspect="landscape" />
      ) : (
        <img 
          src={src} 
          alt={project.title}
          className="fade-in"
          loading="lazy"
          decoding="async"
        />
      )}
      <h3>{project.title}</h3>
    </article>
  );
};
*/

// ============================================
// PERFORMANCE OPTIMIZATION TIPS
// ============================================

/**
 * 1. MEMOIZATION
 *    - Use React.memo() for skeleton and content components
 *    - Use useCallback() for event handlers
 *    - Use useMemo() for expensive computations
 * 
 * 2. IMAGE OPTIMIZATION
 *    - Always use loading="lazy" attribute
 *    - Use decoding="async" for non-critical images
 *    - Preload critical images in head
 * 
 * 3. TIMING
 *    - Set minShowTime to ~300ms to prevent skeleton flash
 *    - Use useSkeletonDelay() hook to manage this
 * 
 * 4. ANIMATIONS
 *    - Keep animations GPU-friendly (transform, opacity only)
 *    - Use will-change: background-position for shimmer
 *    - Respect prefers-reduced-motion
 * 
 * 5. STAGGER EFFECTS
 *    - Use CSS animation-delay for staggered loads
 *    - Provides visual feedback of async loading
 *    - 50-100ms delay between items
 * 
 * 6. ERROR HANDLING
 *    - Always show error state as fallback
 *    - Use graceful error boundaries
 *    - Implement retry logic
 * 
 * 7. BUNDLE SIZE
 *    - Skeleton CSS is ~4KB (gzipped: ~1KB)
 *    - Skeleton components are all memoized
 *    - Hooks are tree-shakeable
 *    - Total bundle impact: <5KB
 */

// ============================================
// MIGRATION CHECKLIST
// ============================================

/**
 * When adding skeleton loading to a component:
 * 
 * ✓ Import SkeletonComponent and hook at top
 * ✓ Import Skeleton.css
 * ✓ Add loading state (useState)
 * ✓ Add useEffect to trigger loading
 * ✓ Use useSkeletonDelay to prevent flashing
 * ✓ Add conditional rendering: showSkeleton ? <Skeleton /> : <Content />
 * ✓ Add fade-in class to content div
 * ✓ Test on slow 3G network
 * ✓ Test on fast network (should not see skeleton flash)
 * ✓ Check accessibility (reduced motion)
 */

export default {};
