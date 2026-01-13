import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Palette, Code, Rocket } from "lucide-react";
import "./styles/Process3.css";

const steps = [
  {
    step: "01",
    label: "Discover",
    title: "Understand Your Business & Audience",
    description: "We study your business and customers to know what works best for your website.",
    icon: Sparkles,
    color: "#3B82F6",
    image: require("../assets/processPics/vitaly-gariev-BXLy_lXu5j0-unsplash.jpg"),
  },
  {
    step: "02",
    label: "Plan & Design",
    title: "Create a clear, professional design",
    description: "We create a clear plan and professional design that looks good and guides visitors.",
    icon: Palette,
    color: "#10B981",
    image: require("../assets/processPics/faizur-rehman-dJpupM4LiS4-unsplash.jpg"),
  },
  {
    step: "03",
    label: "Build & Test",
    title: "Make your website fast and reliables",
    description: "We build your website to work fast, look great, and run smoothly on all devices.",
    icon: Code,
    color: "#FF6B00",
    image: require("../assets/processPics/futon-li70jrXbCCE-unsplash.jpg"),
  },
  {
    step: "04",
    label: "Launch and grow",
    title: "Go live and attract more customers",
    description: "We help your site go live and give support to improve performance and attract visitors.",
    icon: Rocket,
    color: "#8B5CF6",
    image: require("../assets/processPics/markus-winkler-j2tExQL-OyA-unsplash.jpg"),
  },
];

const Process3 = () => {
  return (
    <section className="process-section">
      
      {/* Section Header */}
      <div className="process-header">
        {/* <span className="process-eyebrow">Our Process</span> */}
        <h2 className="process-title">
          - OUR PROCESS -
        </h2>
        <p className="process-subtitle">
         You’ll always understand what we’re doing, why it matters, and how it improves your website.
        </p>
      </div>

      {/* Process Steps Grid */}
      <div className="process-steps-container">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          
          return (
            <div 
              key={index} 
              className="process-step-card"
              style={{ '--step-color': step.color }}
            >
              
              {/* Card Header with Image */}
              <div className="process-card-header">
                <div className="process-image-container">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="process-image"
                  />
                  <div className="process-image-overlay">
                    <div className="process-icon-wrapper">
                      <IconComponent size={28} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="process-card-content">
                
                {/* Step Number & Label */}
                <div className="process-step-header">
                  <span className="process-step-number">{step.step}</span>
                  <span className="process-step-label">{step.label}</span>
                </div>

                {/* Title */}
                <h3 className="process-card-title">{step.title}</h3>

                {/* Description */}
                <p className="process-card-description">{step.description}</p>

                {/* Learn More Link */}
                <Link to="/pricing" className="process-learn-more">
                  <span>Learn more</span>
                  <ArrowUpRight size={16} />
                </Link>

              </div>

              {/* Connecting Line */}
              {index < steps.length - 0 && (
                <div className="process-connector-line">
                  <div className="connector-dot connector-dot-start"></div>
                  <div className="connector-dot connector-dot-end"></div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="process-bottom-cta">
        <p className="process-cta-text">
          Ready to transform your digital presence?
        </p>
        <Link to="/contact" className="process-cta-button">
          <span>Start Your Project</span>
          <ArrowUpRight size={18} />
        </Link>
      </div>

    </section>
  );
};

export default Process3;