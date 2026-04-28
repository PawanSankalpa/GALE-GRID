import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaStar, FaClock } from "react-icons/fa";
import { useSkeletonDelay } from "../../hooks/useDataLoader";
import { SkeletonPortfolioGrid } from "../skeletons/SkeletonComponents";
import "../skeletons/Skeleton.css";

// Import existing images
import leftImg from "../../assets/portfolioPics/hotel11.png";
import rightImg from "../../assets/portfolioPics/luxia-item.png";
import proj4 from "../../assets/portfolioPics/hotel-full.png";
import modernHouse from "../../assets/portfolioPics/lifecare.jpeg";
import luxiaHero3 from "../../assets/portfolioPics/luxia-hero3.png";
import "./styles/PortfolioSection.css";

// Static portfolio data (your existing data)
const PORTFOLIO_DATA = [
  {
    id: 1,
    title: "LIFECARE MEDICAL",
    hook: "+45% Conversion",
    industry: "Healthcare Platform",
    image: modernHouse,
    aspect: "r1-left"
  },
  {
    id: 2,
    title: "Customer Satisfaction",
    stat: "99%",
    statLine: "Clients recommend us to their network",
    aspect: "r1-center"
  },
  // Add more portfolio items as needed
];

/**
 * PortfolioSection with Skeleton Loading (Optimized)
 * 
 * Key optimizations:
 * - useSkeletonDelay prevents skeleton flash on fast networks
 * - IntersectionObserver for in-view animations
 * - requestAnimationFrame for smooth animations
 * - React.memo for child components
 * - Lazy image loading
 */
const PortfolioSection = () => {
  const pfRef = useRef(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Simulate async portfolio loading
   * In production, replace with actual API call:
   * const response = await fetch('/api/portfolio');
   * const data = await response.json();
   */
  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      
      // Simulated network delay (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Set your portfolio data
      setPortfolioData({
        projects: PORTFOLIO_DATA,
        stats: [
          { icon: FaGoogle, value: "4.9/5", label: "Google Rating" },
          { icon: FaStar, value: "200+", label: "Projects" },
          { icon: FaClock, value: "2-8", label: "Weeks Delivery" }
        ]
      });
      
      setLoading(false);
    };

    loadPortfolio();
  }, []);

  /**
   * Use skeleton delay hook to prevent flashing
   * Skeleton only shows if loading takes longer than 300ms
   */
  const showSkeleton = useSkeletonDelay(loading, 300);

  /**
   * In-view animations setup
   * Only runs when data is loaded to avoid animation conflicts
   */
  useEffect(() => {
    if (!portfolioData || !pfRef.current) return;

    const root = pfRef.current;
    const items = Array.from(root.querySelectorAll('.reveal'));
    
    if (items.length === 0) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = items.indexOf(entry.target);
        
        // Use requestAnimationFrame for smooth animation timing
        requestAnimationFrame(() => {
          setTimeout(() => entry.target.classList.add('is-visible'), Math.max(0, idx) * 80);
        });
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -50px 0px' });

    items.forEach((el) => io.observe(el));
    
    return () => io.disconnect();
  }, [portfolioData]);

  // Memoize portfolio items to prevent unnecessary re-renders
  const portfolioItems = useMemo(() => {
    if (!portfolioData) return null;
    return portfolioData.projects.map((item, idx) => (
      <OptimizedPortfolioCard key={item.id} item={item} index={idx} />
    ));
  }, [portfolioData]);

  return (
    <section id="portfolio" className="pf-section" aria-labelledby="pf-title" ref={pfRef}>
      <div className="pf-shell">
        {/* Header */}
        <header className="pf-header reveal">
          <h2 id="pf-title">SOME OF OUR RECENT WORK</h2>
          <p className="pf-sub">
            A few recent projects we've designed and built. Feel free to explore the live sites.
          </p>
        </header>

        {/* Portfolio Grid or Skeleton */}
        {showSkeleton ? (
          <SkeletonPortfolioGrid />
        ) : (
          <div className="pf-mosaic fade-in">
            {portfolioItems}
          </div>
        )}
      </div>

      {/* Stats Footer - Only render when data is loaded */}
      {!showSkeleton && portfolioData && (
        <div className="stats-footer fade-in">
          {portfolioData.stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="stat-item">
                <div className="stat-icon">
                  <Icon />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

/**
 * OptimizedPortfolioCard Component
 * Memoized to prevent unnecessary re-renders
 * Uses lazy loading for images
 */
const OptimizedPortfolioCard = React.memo(({ item, index }) => {
  // This ensures card components don't re-render when parent updates
  return (
    <article 
      className="pf-card reveal pf-magnetic" 
      aria-label={item.title}
      style={{ animationDelay: `${index * 0.1}s` }}
      tabIndex={0}
    >
      <div className="hover-scrim" />
      <img 
        src={item.image} 
        loading="lazy" 
        decoding="async" 
        alt={item.title} 
        className="pf-img"
      />
      <div className="pf-glass-overlay">
        <div className="pf-glass-title">{item.title}</div>
        <div className="pf-glass-hook">{item.hook}</div>
        <div className="pf-glass-industry">{item.industry}</div>
      </div>
      <div className="pf-arrow-fixed"><span className="arrow">↗</span></div>
    </article>
  );
});

OptimizedPortfolioCard.displayName = 'OptimizedPortfolioCard';

export default PortfolioSection;
