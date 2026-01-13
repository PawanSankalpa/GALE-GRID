import React, { useState, useEffect, useRef } from "react";
import { 
  FaSearch, 
  FaPalette, 
  FaCode, 
  FaRocket, 
  FaCheckCircle,
  FaChevronRight,
  FaLightbulb,
  FaHandshake
} from "react-icons/fa";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import "./styles/Process.css";

const Process = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  const steps = [
    {
      id: 0,
      icon: <FaSearch />,
      title: "Discovery Call",
      description: "We start by listening to understand your business goals, target audience, and vision. This 30-minute conversation helps us align on what success looks like for you.",
      duration: "30-45 mins",
      accentColor: "#FF6B00"
    },
    {
      id: 1,
      icon: <FaPalette />,
      title: "Design & Planning",
      description: "We create custom designs that match your brand and speak to your customers. You'll see a preview of your website before any coding begins.",
      duration: "3-7 days",
      accentColor: "#3B82F6"
    },
    {
      id: 2,
      icon: <FaCode />,
      title: "Development",
      description: "Our developers build your website with clean, fast code. We focus on speed, security, and making it easy for you to update content.",
      duration: "2-4 weeks",
      accentColor: "#10B981"
    },
    {
      id: 3,
      icon: <FaRocket />,
      title: "Launch & Support",
      description: "We launch your website and provide training. You'll also get 30 days of support to ensure everything runs smoothly.",
      duration: "1-2 days",
      accentColor: "#8B5CF6"
    }
  ];

  const benefits = [
    {
      icon: <FaLightbulb />,
      text: "Clear communication at every step"
    },
    {
      icon: <TbTargetArrow />,
      text: "Focused on your business goals"
    },
    {
      icon: <MdOutlineTipsAndUpdates />,
      text: "Expert guidance throughout"
    },
    {
      icon: <FaHandshake />,
      text: "No surprises, just results"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleStepHover = (index) => {
    setActiveStep(index);
  };

  const handleStepLeave = () => {
    // Keep the last hovered step active, or reset to first step after a delay
    setTimeout(() => {
      setActiveStep(prev => prev);
    }, 100);
  };

  return (
    <section className="process-section" id="process" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className={`process-header ${inView ? "in-view" : ""}`}>
          <div className="header-eyebrow">
            <span className="eyebrow-dot"></span>
            <span className="eyebrow-text">OUR PROCESS</span>
          </div>
          
          <h2 className="process-title">
            A Clear Path to Your
            <span className="title-accent"> Perfect Website</span>
          </h2>
          
          <p className="process-subtitle">
            Simple, transparent, and focused on your success. We guide you through 
            each step with clarity and expertise.
          </p>
        </div>

        {/* Process Steps */}
        <div className="process-steps-container">
          <div className="process-timeline">
            <div className="timeline-line">
              <div 
                className="timeline-progress" 
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            <div className="steps-grid">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`step-card ${activeStep === index ? "active" : ""} ${
                    inView ? "in-view" : ""
                  }`}
                  onMouseEnter={() => handleStepHover(index)}
                  onMouseLeave={handleStepLeave}
                  onClick={() => setActiveStep(index)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="step-header">
                    <div 
                      className="step-icon-wrapper"
                      style={{ 
                        backgroundColor: `${step.accentColor}15`,
                        borderColor: `${step.accentColor}30`
                      }}
                    >
                      <div 
                        className="step-icon"
                        style={{ color: step.accentColor }}
                      >
                        {step.icon}
                      </div>
                    </div>
                    
                    <div className="step-number">
                      <span>0{index + 1}</span>
                    </div>
                  </div>

                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    
                    <div className="step-description-wrapper">
                      <p className="step-description">{step.description}</p>
                    </div>

                    <div className="step-footer">
                      <div className="step-duration">
                        <FaChevronRight className="duration-icon" />
                        <span>{step.duration}</span>
                      </div>
                      
                      <div className="step-status">
                        {activeStep === index ? (
                          <div className="status-active">
                            <FaCheckCircle className="status-icon" />
                            <span>Current Step</span>
                          </div>
                        ) : index < activeStep ? (
                          <div className="status-completed">
                            <FaCheckCircle className="status-icon" />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <div className="status-upcoming">
                            <span>Up Next</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className={`process-benefits ${inView ? "in-view" : ""}`}>
          <div className="benefits-container">
            <div className="benefits-header">
              <h3 className="benefits-title">What Makes Our Process Better</h3>
              <p className="benefits-subtitle">We focus on what matters to you</p>
            </div>
            
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="benefit-card"
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                >
                  <div className="benefit-icon">
                    {benefit.icon}
                  </div>
                  <p className="benefit-text">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`process-cta ${inView ? "in-view" : ""}`}>
          <div className="cta-container">
            <div className="cta-content">
              <h3 className="cta-title">Ready to Start Your Project?</h3>
              <p className="cta-subtitle">
                Book a free 30-minute consultation to discuss your website goals
              </p>
            </div>
            
            <div className="cta-actions">
              <button className="cta-button primary">
                <span>Book Free Consultation</span>
                <FaChevronRight className="button-icon" />
              </button>
              <button className="cta-button secondary">
                <span>View Full Process</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;