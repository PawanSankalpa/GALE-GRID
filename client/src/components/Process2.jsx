import React, { useState, useEffect, useRef } from 'react';
import './styles/Process2.css';

/**
 * AgencyProcessSection: A luxury-grade interactive process section.
 * Features: Sticky image synchronization, glassmorphic UI, and responsive fluid layouts.
 * Prefix: aps- (Agency Process Section)
 */
const Process2 = () => {

  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef([]);

  // Luxury-grade process steps
  const processSteps = [
    {
      id: 1,
      tag: 'Discovery',
      title: 'Vision & Strategy',
      desc: 'We immerse ourselves in your brand, goals, and audience to craft a strategic blueprint for digital excellence.',
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      icon: '🔍',
    },
    {
      id: 2,
      tag: 'Design',
      title: 'Luxury UI/UX Design',
      desc: 'Our designers create stunning, intuitive interfaces that blend beauty with seamless user experience.',
      img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      icon: '🎨',
    },
    {
      id: 3,
      tag: 'Development',
      title: 'Flawless Engineering',
      desc: 'We build robust, scalable solutions with cutting-edge technology and pixel-perfect code.',
      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      icon: '💻',
    },
    {
      id: 4,
      tag: 'Launch',
      title: 'Seamless Delivery',
      desc: 'Your digital flagship launches with precision, performance, and ongoing support for lasting success.',
      img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      icon: '🚀',
    },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0% -30% 0%',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'));
          setActiveStep(index);
        }
      });
    }, observerOptions);

    stepsRef.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, [processSteps.length]);

  return (
    <section className="aps-section">
      <div className="aps-shell">
        
        {/* Left Side: Sticky Content */}
        <div className="aps-sticky-col">
          <div className="aps-header">
            <span className="aps-badge">HOW IT WORKS</span>
            <h2 className="aps-main-title">Our Simple Processes</h2>
            <p className="aps-main-desc">
              We guide business owners through a frictionless journey from initial concept 
              to a high-performance digital flagship store.
            </p>
            <button className="aps-cta-btn">Get Started →</button>
          </div>

          <div className="aps-image-frame">
            {processSteps.map((step, index) => (
              <img 
                key={step.id}
                src={step.img}
                alt={step.title}
                className={`aps-process-img ${activeStep === index? 'is-active' : ''}`}
              />
            ))}
            <div className="aps-img-overlay">
              <div className="aps-play-info">
                <span className="aps-play-icon">▶</span>
                <div>
                  <p>Process Deep Dive</p>
                  <span>4 min 30 sec</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Scrollable Steps */}
        <div className="aps-scroll-col">
          <div className="aps-timeline-line"></div>
          
          {processSteps.map((step, index) => {
            const isActive = activeStep === index;
            return (
              <div
                key={step.id}
                className={`aps-step-card${isActive ? ' is-focused' : ''}`}
                data-index={index}
                ref={el => stepsRef.current[index] = el}
                tabIndex={0}
                style={{ display: 'flex', gap: 24, alignItems: 'flex-start', position: 'relative', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                {/* Icon Circle, Step Number, and Animated Content */}
                <div className={`aps-step-icon-circle${isActive ? ' active' : ''}`} style={{
                  width: 56, height: 56, minWidth: 56, borderRadius: '50%', background: isActive ? 'var(--aps-brand-orange)' : 'var(--aps-paper-white)', border: `2px solid ${isActive ? 'var(--aps-brand-orange)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.4s ease', boxShadow: isActive ? '0 0 30px #e88e4e' : 'none', marginRight: 24
                }}>
                  <span className="aps-step-icon" style={{ fontSize: 28, color: isActive ? 'white' : '#A0A0A0', transition: 'all 0.4s ease' }}>{step.icon}</span>
                </div>
                <div className="aps-step-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="aps-step-number" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: 'var(--aps-brand-orange)', textTransform: 'uppercase', opacity: isActive ? 0.8 : 0.5 }}>STEP - {String(index + 1).padStart(2, '0')}</span>
                  <h3 className="aps-step-title" style={{ fontSize: 24, fontWeight: 600, color: 'var(--aps-paper-white)', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{step.title}</h3>
                  <p className="aps-step-desc" style={{ fontSize: 16, color: '#A0A0A0', lineHeight: 1.6, margin: 0, opacity: isActive ? 1 : 0, maxHeight: isActive ? 200 : 0, overflow: 'hidden', transition: 'all 0.4s ease', marginTop: isActive ? 8 : 0 }}>{step.desc}</p>
                  <div className="aps-card-footer" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                    <div className="aps-footer-icon" style={{ fontSize: 18 }}>{step.icon}</div>
                    <span className="aps-footer-text" style={{ color: '#A0A0A0', fontSize: 14 }}>Strategic Execution</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Process2;