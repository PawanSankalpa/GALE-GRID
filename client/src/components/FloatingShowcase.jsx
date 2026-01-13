import React from 'react';
import { Star, Sparkles, Zap, Award, TrendingUp, Users } from 'lucide-react';
import './styles/FloatingShowcase.css';

const FloatingShowcase = () => {
  const skills = [
    { name: 'React', color: '#61DAFB' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'Node.js', color: '#68A063' },
    { name: 'Python', color: '#3776AB' },
    { name: 'HTML5', color: '#E34F26' },
    { name: 'CSS3', color: '#1572B6' },
    { name: 'Tailwind', color: '#06B6D4' },
    { name: 'Next.js', color: '#000000' },
    { name: 'Vue.js', color: '#4FC08D' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'PostgreSQL', color: '#4169E1' },
    { name: 'Redis', color: '#DC382D' },
    { name: 'GraphQL', color: '#E10098' },
    { name: 'Docker', color: '#2496ED' },
    { name: 'AWS', color: '#FF9900' },
    { name: 'Firebase', color: '#FFCA28' },
    { name: 'Stripe', color: '#635BFF' },
    { name: 'OAuth', color: '#EB5424' },
    { name: 'REST API', color: '#009688' },
    { name: 'Figma', color: '#F24E1E' },
    { name: 'Git', color: '#F05032' },
    { name: 'Webpack', color: '#8DD6F9' },
    { name: 'Express', color: '#000000' },
  ];

  const stats = [
    { icon: Award, value: '150+', label: 'Projects Delivered', color: '#FF6B00' },
    { icon: Users, value: '98%', label: 'Client Satisfaction', color: '#3B82F6' },
    { icon: TrendingUp, value: '5+', label: 'Years Experience', color: '#10B981' },
    { icon: Zap, value: '24/7', label: 'Support Available', color: '#8B5CF6' }
  ];

  // Duplicate skills for seamless infinite scroll
  const duplicatedSkills = [...skills, ...skills, ...skills];

  return (
    <section className="floating-showcase">
      <div className="floating-showcase-container">
        {/* Glass Card */}
        <div className="floating-glass-card">
          {/* Top Section - Stats Grid */}
          <div className="stats-grid-section refined">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="stat-card refined"
                  style={{ '--stat-color': stat.color }}
                >
                  <div className="stat-row">
                    <span className="stat-icon-refined">
                      <IconComponent size={22} />
                    </span>
                    <span className="stat-value-refined" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                  <span className="stat-label-refined">{stat.label}</span>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="section-divider"></div>

          {/* Google Review Section */}
          <div className="google-review-section">
            
            <div className="review-header-badge">
              <Sparkles size={16} />
              <span>Client Testimonial</span>
            </div>

            <div className="review-content-wrapper">
              <div className="review-main">
                <div className="review-header">
                  {/* Google Logo */}
                  <div className="google-logo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>

                  {/* Star Rating */}
                  <div className="review-stars">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} size={16} fill="#FBBF24" color="#FBBF24" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="review-text">
                  "Exceptional work! The team transformed our outdated website into a modern, 
                  high-performing platform. Their attention to detail exceeded our expectations."
                </p>

                {/* Reviewer Info */}
                <div className="reviewer-info">
                  <div className="reviewer-avatar">SM</div>
                  <div className="reviewer-details">
                    <span className="reviewer-name">Sarah Mitchell</span>
                    <span className="reviewer-role">CEO, TechVenture Inc.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="section-divider"></div>

          {/* Bottom Section - Skills Carousel */}
          <div className="showcase-bottom-section">
            <div className="skills-header">
              <span className="skills-label">Technologies We Master</span>
            </div>
            <div className="skills-carousel">
              <div className="skills-track">
                {duplicatedSkills.map((skill, index) => (
                  <div 
                    key={`${skill.name}-${index}`} 
                    className="skill-badge"
                    style={{ '--skill-color': skill.color }}
                  >
                    <span className="skill-dot"></span>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                ))}
              </div>
              
              {/* Gradient Overlays for fade effect */}
              <div className="carousel-fade-left"></div>
              <div className="carousel-fade-right"></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FloatingShowcase;