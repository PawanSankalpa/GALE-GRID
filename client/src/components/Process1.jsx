import React, { useState } from 'react';
import { MessageCircle, Palette, Code, Rocket } from 'lucide-react';
import './styles/Process1.css';

const Process = () => {
  const [activeStep, setActiveStep] = useState(0);

  const processSteps = [
    {
      number: '01',
      title: 'Discover',
      description: 'Deep dive into your vision, goals, and target audience to create the perfect foundation for your project',
      Icon: MessageCircle,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
    },
    {
      number: '02',
      title: 'Design',
      description: 'Transform ideas into stunning visual experiences with strategic planning and creative excellence',
      Icon: Palette,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80'
    },
    {
      number: '03',
      title: 'Develop',
      description: 'Craft pixel-perfect code that performs flawlessly across all devices and platforms',
      Icon: Code,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'
    },
    {
      number: '04',
      title: 'Deliver',
      description: 'Launch your website to the world and watch your business grow exponentially',
      Icon: Rocket,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'
    }
  ];

  return (
    <section className="process-section">
      {/* Top Header Section */}
      <div className="process-header">
        <button className="header-badge">
          HOW IT WORKS
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="main-title">Our Simple Process</h1>
        <p className="main-description">
          A clear, step-by-step approach to take your ideas from concept to live website, designed for business owners like you.
        </p>
        <button className="get-started-btn">
          Get Started
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 13L13 7M13 7H7M13 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Main Process Container */}
      <div className="process-container">
        {/* Left Side: Image */}
        <div className="left-content">
          <div className="image-container">
            <img 
              src={processSteps[activeStep].image} 
              alt={processSteps[activeStep].title}
              className="step-image"
            />
          </div>
        </div>

        {/* Right Side: Step Cards compressed to image height */}
        <div className="right-content">
          <div className="timeline-line"></div>
          {processSteps.map((step, index) => {
            const Icon = step.Icon;
            return (
              <div 
                key={index}
                className={`step-card ${activeStep === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="step-icon-circle">
                  <Icon className="step-icon" strokeWidth={1.5} />
                </div>
                
                <div className="step-content">
                  <span className="step-number">STEP - {step.number}</span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
