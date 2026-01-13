import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, ArrowLeft, ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react';
import './styles/Reviews.css';

const ReviewsSection = () => {
  const [activeReview, setActiveReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef(null);

  const reviews = [
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

  const stats = [
    { icon: Star, value: '5.0', label: 'Average Rating', color: '#FBBF24' },
    { icon: TrendingUp, value: '150+', label: 'Happy Clients', color: '#10B981' },
    { icon: Award, value: '98%', label: 'Satisfaction Rate', color: '#FF6B00' }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveReview((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveReview((prev) => (prev + 1) % reviews.length);
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setActiveReview(index);
  };

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        
        {/* Section Header */}
        <div className="reviews-header">
          {/* <div className="reviews-badge"> */}
            {/* <Sparkles size={16} /> */}
            {/* <span>Reviews</span> */}
          {/* </div> */}
          <h2 className="reviews-title">
            What Our Clients Say
          </h2>
          <p className="reviews-subtitle">
            Real feedback from real businesses. Discover why companies trust us 
            to transform their digital presence.
          </p>
        </div>

        {/* Main Review Carousel */}
        <div className="reviews-carousel-wrapper">
            {/* Thumbnail Gallery */}
        <div className="reviews-thumbnail-gallery" ref={scrollContainerRef}>
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`review-thumbnail ${activeReview === index ? 'active-thumbnail' : ''}`}
              onClick={() => handleDotClick(index)}
              style={{ '--thumb-color': review.color }}
            >
              <div className="thumbnail-avatar" style={{ background: review.color }}>
                {review.avatar}
              </div>
              <div className="thumbnail-info">
                <span className="thumbnail-name">{review.name}</span>
                <div className="thumbnail-stars">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} size={12} fill="#FBBF24" color="#FBBF24" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
          
          {/* Featured Review Card */}
          <div className="featured-review-container">
            <div 
              className="featured-review-card"
              style={{ '--review-color': reviews[activeReview].color }}
            >
              
              {/* Floating Quote Icon */}
              <div className="floating-quote-icon">
                <Quote size={48} />
              </div>

              {/* Review Header */}
              <div className="review-card-header">
                <div className="reviewer-avatar-large" style={{ background: reviews[activeReview].color }}>
                  {reviews[activeReview].avatar}
                </div>
                <div className="reviewer-info-main">
                  <h3 className="reviewer-name-large">{reviews[activeReview].name}</h3>
                  <p className="reviewer-role-large">{reviews[activeReview].role}</p>
                  <div className="review-stars-large">
                    {[...Array(reviews[activeReview].rating)].map((_, idx) => (
                      <Star key={idx} size={18} fill="#FBBF24" color="#FBBF24" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="review-text-large">{reviews[activeReview].text}</p>

              {/* Project Info */}
              <div className="review-project-info">
                <div className="project-detail">
                  <span className="project-label">Project</span>
                  <span className="project-value">{reviews[activeReview].project}</span>
                </div>
                <div className="project-detail">
                  <span className="project-label">Result</span>
                  <span className="project-value metric-value">{reviews[activeReview].metric}</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="review-decoration review-decoration-1"></div>
              <div className="review-decoration review-decoration-2"></div>
              <div className="review-decoration review-decoration-3"></div>

            </div>
          </div>

          {/* Navigation Controls */}
          <div className="carousel-controls">
            <button 
              className="carousel-control-btn prev-btn"
              onClick={handlePrevious}
              aria-label="Previous review"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Dots Indicator */}
            <div className="carousel-dots">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${activeReview === index ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to review ${index + 1}`}
                  style={{ '--dot-color': reviews[index].color }}
                />
              ))}
            </div>

            <button 
              className="carousel-control-btn next-btn"
              onClick={handleNext}
              aria-label="Next review"
            >
              <ArrowRight size={20} />
            </button>
          </div>

        </div>

        

        {/* Stats Grid */}
        <div className="reviews-stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="review-stat-card"
                style={{ '--stat-color': stat.color }}
              >
                <div className="stat-icon-wrapper">
                  <IconComponent size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;