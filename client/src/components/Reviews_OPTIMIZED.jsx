import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Star, Quote, ArrowLeft, ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useSkeletonDelay } from '../../hooks/useDataLoader';
import { SkeletonCarousel } from '../skeletons/SkeletonComponents';
import '../skeletons/Skeleton.css';
import './styles/Reviews.css';

// Your existing reviews data
const REVIEWS_DATA = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'CEO, TechVenture Inc.',
    avatar: 'SM',
    rating: 5,
    text: 'Exceptional work! The team transformed our outdated website into a modern, high-performing platform. Their attention to detail and creative approach exceeded our expectations. Response time was incredible.',
    project: 'E-commerce Platform',
    metric: '250% increase in conversions',
    color: '#74aed4ff'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Founder, StartupHub',
    avatar: 'MC',
    rating: 5,
    text: 'Working with GALE GRID was a game-changer for our startup. They delivered a stunning website that perfectly captures our brand. The performance optimization they implemented resulted in lightning-fast load times.',
    project: 'SaaS Landing Page',
    metric: '3x faster page speed',
    color: '#8aa2dfff'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Marketing Director, GrowthCo',
    avatar: 'ER',
    rating: 5,
    text: 'The level of professionalism and expertise displayed by the team was outstanding. They took the time to understand our business goals and delivered a solution that exceeded all expectations. Highly recommend!',
    project: 'Corporate Website',
    metric: '180% more leads generated',
    color: '#8cd3bbff'
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Owner, Boutique Fashion',
    avatar: 'DP',
    rating: 5,
    text: 'Our new e-commerce site is beautiful and functional. Sales have doubled since launch. The team was patient with our requests and delivered exactly what we envisioned. Best investment we\'ve made.',
    project: 'Fashion E-commerce',
    metric: '2x sales increase',
    color: '#aa90ddff'
  },
  {
    id: 5,
    name: 'Jessica Thompson',
    role: 'Director, Creative Agency',
    avatar: 'JT',
    rating: 5,
    text: 'As a creative agency ourselves, we have high standards. GALE GRID not only met but exceeded them. The design is modern, the code is clean, and the final product is simply stunning. A true partnership.',
    project: 'Portfolio Website',
    metric: '95% client satisfaction',
    color: '#e2c478ff'
  },
  {
    id: 6,
    name: 'Robert Kim',
    role: 'CTO, DataFlow Systems',
    avatar: 'RK',
    rating: 5,
    text: 'Technical excellence combined with creative design. They built a complex web application that handles our data visualization needs perfectly. The performance and scalability are impressive.',
    project: 'Web Application',
    metric: '99.9% uptime achieved',
    color: '#dd82aaff'
  }
];

const STATS = [
  { icon: Star, value: '5.0', label: 'Average Rating', color: '#FBBF24' },
  { icon: TrendingUp, value: '150+', label: 'Happy Clients', color: '#10B981' },
  { icon: Award, value: '98%', label: 'Satisfaction Rate', color: '#FF6B00' }
];

/**
 * ReviewsSection with Optimized Skeleton Loading
 * 
 * Key optimizations:
 * - useCallback for event handlers to prevent unnecessary re-renders
 * - useSkeletonDelay to prevent skeleton flash
 * - useMemo for computed values
 * - Memoized review card components
 * - Auto-play carousel with pause on interaction
 */
const ReviewsSection = () => {
  const [activeReview, setActiveReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const autoPlayIntervalRef = useRef(null);

  /**
   * Load reviews data
   * In production, replace with actual API call
   */
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      
      // Simulated network delay (400ms)
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setReviews(REVIEWS_DATA);
      setLoading(false);
    };

    loadReviews();
  }, []);

  /**
   * Use skeleton delay to prevent flashing
   * Only show skeleton if loading takes >300ms
   */
  const showSkeleton = useSkeletonDelay(loading, 300);

  /**
   * Auto-play carousel
   * Only runs when data is loaded and auto-play is enabled
   */
  useEffect(() => {
    if (!reviews || !isAutoPlaying) return;

    autoPlayIntervalRef.current = setInterval(() => {
      setActiveReview(prev => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(autoPlayIntervalRef.current);
  }, [isAutoPlaying, reviews]);

  /**
   * Memoized event handlers using useCallback
   * Prevents unnecessary re-renders of child components
   */
  const handlePrevious = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveReview(prev => (prev - 1 + (reviews?.length || 1)) % (reviews?.length || 1));
  }, [reviews?.length]);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveReview(prev => (prev + 1) % (reviews?.length || 1));
  }, [reviews?.length]);

  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  /**
   * Memoize stats JSX to prevent unnecessary re-renders
   */
  const statsElements = useMemo(() => {
    return STATS.map((stat, idx) => {
      const Icon = stat.icon;
      return (
        <div key={idx} className="review-stat-item" style={{ '--stat-color': stat.color }}>
          <div className="stat-icon-wrapper">
            <Icon className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      );
    });
  }, []);

  /**
   * Render skeleton or content
   */
  if (showSkeleton) {
    return (
      <section className="reviews-section">
        <div className="reviews-container">
          <SkeletonCarousel count={3} height="320px" />
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="reviews-section fade-in">
      <div className="reviews-container">
        {/* Header */}
        <div className="reviews-header">
          <div className="header-content">
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">
              Real feedback from real clients who've transformed their business with us
            </p>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div 
          className="reviews-carousel"
          ref={scrollContainerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="region"
          aria-label="Client testimonials"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Active Review Display */}
          <div className="active-review-wrapper">
            <OptimizedReviewCard 
              review={reviews[activeReview]} 
              isActive={true}
            />
          </div>

          {/* Navigation Controls */}
          <div className="carousel-controls">
            <button 
              onClick={handlePrevious}
              className="nav-button prev"
              aria-label="Previous review"
              disabled={reviews.length <= 1}
            >
              <ArrowLeft size={20} />
            </button>

            {/* Dot Indicators */}
            <div className="dot-indicators">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${idx === activeReview ? 'active' : ''}`}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveReview(idx);
                  }}
                  aria-label={`Go to review ${idx + 1}`}
                  aria-current={idx === activeReview}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="nav-button next"
              aria-label="Next review"
              disabled={reviews.length <= 1}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="reviews-stats">
          {statsElements}
        </div>

        {/* Quote Icon */}
        <div className="quote-decoration">
          <Quote size={40} opacity={0.1} />
        </div>
      </div>
    </section>
  );
};

/**
 * OptimizedReviewCard Component
 * Memoized to prevent re-renders when parent updates
 * Only re-renders when the review data changes
 */
const OptimizedReviewCard = React.memo(({ review, isActive }) => {
  return (
    <article 
      className={`review-card ${isActive ? 'active' : ''}`}
      style={{ '--accent-color': review.color }}
    >
      {/* Card Header with Avatar */}
      <div className="review-header">
        <div className="avatar" style={{ backgroundColor: review.color }}>
          {review.avatar}
        </div>
        <div className="header-info">
          <h3 className="reviewer-name">{review.name}</h3>
          <p className="reviewer-role">{review.role}</p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="rating" aria-label={`${review.rating} stars`}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>

      {/* Review Text */}
      <blockquote className="review-text">
        "{review.text}"
      </blockquote>

      {/* Project Info */}
      <div className="review-footer">
        <div className="project-info">
          <div className="project-name">{review.project}</div>
          <div className="project-metric">
            <Sparkles size={14} />
            {review.metric}
          </div>
        </div>
      </div>
    </article>
  );
});

OptimizedReviewCard.displayName = 'OptimizedReviewCard';

export default ReviewsSection;
