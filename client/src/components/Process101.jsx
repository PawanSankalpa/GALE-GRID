import React from "react";
import { motion } from "framer-motion";
import { Phone, Palette, Code, CheckCircle, Rocket } from "lucide-react";
import "./styles/Process.css";

const Process = () => {
  const processSteps = [
    {
      step: "1",
      title: "Strategy Call",
      description: "We align on your goals. Short call to understand your business, audience, and needs. We define the scope, timeline, and next steps.",
      icon: <Phone size={24} aria-hidden="true" />,
      highlight: "✔ Clear plan before anything starts"
    },
    {
      step: "2",
      title: "Design Direction & Kickoff",
      description: "You approve the direction. We propose the layout and visual style. You approve the design approach.",
      icon: <Palette size={24} aria-hidden="true" />,
      highlight: "💳 50% upfront to begin development"
    },
    {
      step: "3",
      title: "Build & Review",
      description: "We bring it to life. Website is developed and shared via a live preview. You review and provide structured feedback. Refinements are handled by our team.",
      icon: <Code size={24} aria-hidden="true" />,
      highlight: ""
    },
    {
      step: "4",
      title: "Finalization & Setup",
      description: "Everything gets polished. Final checks and optimizations. Domain, hosting, and technical setup completed. Website prepared for launch.",
      icon: <CheckCircle size={24} aria-hidden="true" />,
      highlight: ""
    },
    {
      step: "5",
      title: "Launch & Handover",
      description: "Your site goes live. Remaining 50% payment. Website published. Full access and handover provided.",
      icon: <Rocket size={24} aria-hidden="true" />,
      highlight: "✔ Support available after launch"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 0.61, 0.36, 1],
      },
    },
  };

  return (
    <section className="process-section">
      <div className="process-container">
        <motion.header
          className="process-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <h2 className="process-title">Our Process</h2>
          <p className="process-subtitle">
            From strategy to launch, we guide you through every step with transparency and expertise.
          </p>
        </motion.header>

        <motion.div
          className="timeline"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              variants={itemVariants}
            >
              <div className="timeline-content">
                <div className="timeline-badge">Step {step.step}</div>
                <div className="timeline-icon">
                  {step.icon}
                </div>
                <div className="timeline-text">
                  <h3 className="timeline-title">{step.title}</h3>
                  <p className="timeline-description">{step.description}</p>
                  {step.highlight && <p className="timeline-highlight">{step.highlight}</p>}
                </div>
              </div>
              <div className="timeline-connector">
                <div className="timeline-dot"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
