import React, { useState, useEffect, useCallback } from 'react';
import './OurWork.css';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

// Import images from assets
import luxiaScreenshot from '../../assets/OurWork/screencapture-luxia-clothing-vercel-app-2026-01-16-19_39_34.png';
import sunmaxScreenshot from '../../assets/OurWork/screencapture-sunmaxenergy-lk-2026-01-16-19_36_25.png';
import galegridScreenshot from '../../assets/OurWork/screencapture-galegrid-2026-01-16-19_40_58.png';
// Using same screenshots for before/after - replace with actual before images when available
import luxiaBefore from '../../assets/OurWork/Screenshot 2026-01-16 at 19.41.52.png';
import luxiaAfter from '../../assets/OurWork/screencapture-luxia-clothing-vercel-app-2026-01-16-19_39_34.png';
import sunmaxBefore from '../../assets/OurWork/Screenshot 2026-01-16 at 19.42.37.png';
import sunmaxAfter from '../../assets/OurWork/screencapture-sunmaxenergy-lk-2026-01-16-19_36_25.png';
import galegridBefore from '../../assets/OurWork/Screenshot 2026-01-16 at 19.43.45.png';
import galegridAfter from '../../assets/OurWork/screencapture-galegrid-2026-01-16-19_40_58.png';

// Icons
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const LightbulbIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
  </svg>
);

// Case Studies Data
const caseStudies = [
  {
    id: 1,
    title: "Luxia Interiors",
    industry: "Interior Design",
    type: "Website Redesign",
    problem: "Outdated website failing to capture the luxury brand essence, resulting in 80% bounce rate and zero online leads.",
    image: luxiaScreenshot,
    beforeImage: luxiaBefore,
    afterImage: luxiaAfter,
    metricValue: "+340%",
    metricLabel: "Lead Generation",
    tags: ["UX Design", "Development", "SEO"],
    category: "design",
    problems: [
      "Website looked outdated and didn't reflect premium brand positioning",
      "No clear call-to-action leading to missed conversion opportunities",
      "Mobile experience was broken, losing 60% of potential clients",
      "Page load time over 8 seconds causing high abandonment"
    ],
    solutions: [
      "Redesigned with luxury-focused aesthetics and modern glass morphism",
      "Implemented strategic CTA placement based on heat map analysis",
      "Built mobile-first responsive design for seamless experience",
      "Optimized performance achieving sub-2-second load times"
    ],
    results: [
      { value: "+340%", label: "Lead Generation" },
      { value: "2.1s", label: "Load Time" },
      { value: "-65%", label: "Bounce Rate" },
      { value: "+180%", label: "Time on Site" }
    ],
    decisions: [
      "Chose subtle animations over flashy effects to maintain elegance",
      "Prioritized portfolio imagery over text-heavy descriptions",
      "Integrated booking system directly into homepage flow"
    ]
  },
  {
    id: 2,
    title: "SunMax Solar",
    industry: "Renewable Energy",
    type: "Full Brand & Web",
    problem: "New solar company struggling to establish credibility in competitive market with zero online presence.",
    image: sunmaxScreenshot,
    beforeImage: sunmaxBefore,
    afterImage: sunmaxAfter,
    metricValue: "+520%",
    metricLabel: "Quote Requests",
    tags: ["Branding", "Web Design", "Marketing"],
    category: "branding",
    problems: [
      "No established brand identity or market differentiation",
      "Competitors dominated search results for local solar queries",
      "No system to capture and nurture potential leads",
      "Complex pricing confused potential customers"
    ],
    solutions: [
      "Created distinctive brand identity emphasizing trust and innovation",
      "Developed SEO-optimized content strategy targeting local keywords",
      "Built automated lead capture with instant quote calculator",
      "Designed transparent pricing section with comparison tools"
    ],
    results: [
      { value: "+520%", label: "Quote Requests" },
      { value: "#1", label: "Local SEO Rank" },
      { value: "45%", label: "Conversion Rate" },
      { value: "$2.4M", label: "Revenue Year 1" }
    ],
    decisions: [
      "Chose green/orange color palette to balance eco-friendly with energy",
      "Prioritized trust signals over aggressive sales messaging",
      "Built ROI calculator as primary conversion mechanism"
    ]
  },
  {
    id: 3,
    title: "GaleGrid Tech",
    industry: "SaaS",
    type: "Product Landing",
    problem: "Tech startup with powerful product but confusing messaging that failed to convert trial users.",
    image: galegridScreenshot,
    beforeImage: galegridBefore,
    afterImage: galegridAfter,
    metricValue: "+280%",
    metricLabel: "Trial Sign-ups",
    tags: ["UI/UX", "Conversion", "Development"],
    category: "development",
    problems: [
      "Technical jargon alienated non-technical decision makers",
      "Trial sign-up process had 7 steps causing 90% drop-off",
      "No clear demonstration of product value proposition",
      "Pricing page confusion led to support ticket overload"
    ],
    solutions: [
      "Rewrote all copy focusing on benefits, not features",
      "Reduced sign-up to 2 steps with progressive disclosure",
      "Created interactive product demo embedded in homepage",
      "Redesigned pricing with clear tier comparisons"
    ],
    results: [
      { value: "+280%", label: "Trial Sign-ups" },
      { value: "+150%", label: "Paid Conversions" },
      { value: "-70%", label: "Support Tickets" },
      { value: "4.8★", label: "User Rating" }
    ],
    decisions: [
      "Chose conversational tone over corporate speak",
      "Prioritized interactive demo over static screenshots",
      "Added comparison section addressing competitor concerns"
    ]
  }
];

const filters = [
  { id: 'all', label: 'All Projects', count: caseStudies.length },
  { id: 'design', label: 'Design', count: caseStudies.filter(c => c.category === 'design').length },
  { id: 'branding', label: 'Branding', count: caseStudies.filter(c => c.category === 'branding').length },
  { id: 'development', label: 'Development', count: caseStudies.filter(c => c.category === 'development').length },
];

const OurWork = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCases = activeFilter === 'all' 
    ? caseStudies 
    : caseStudies.filter(c => c.category === activeFilter);

  const openCaseStudy = useCallback((caseItem) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeCaseStudy = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => setSelectedCase(null), 300);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeCaseStudy();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen, closeCaseStudy]);

  return (
    <div className="portfolio-page">
      <NavBar />
      {/* SECTION 1: Hero with Dark Overlay */}
      <section className="work-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="work-hero-container">
          <h1 className="work-hero-title">
            Systems That <span className="title-highlight">Make Money</span>,<br />
            Not Just Websites
          </h1>
          <p className="work-hero-subtitle">
            Every project below delivered measurable ROI. Real results, real businesses, real growth.
          </p>
        </div>
      </section>

      {/* Filter Pills - Below Hero */}
      <section className="work-filters-hero">
        <div className="filters-hero-container">
          <div className="filter-pills">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-pill ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Differentiators */}
      <section className="work-differentiators">
        <div className="differentiators-container">
          <div className="diff-grid">
            <div className="diff-card">
              <div className="diff-icon-wrapper">
                <TargetIcon />
              </div>
              <h3>Results-First Approach</h3>
              <p>Every design decision is backed by data. We don't guess—we test, measure, and optimize until your metrics move in the right direction.</p>
            </div>
            <div className="diff-card">
              <div className="diff-icon-wrapper">
                <LightbulbIcon />
              </div>
              <h3>Strategic Partnership</h3>
              <p>We're not just vendors—we're invested partners. Your success is our success, which is why we offer performance-based pricing.</p>
            </div>
            <div className="diff-card">
              <div className="diff-icon-wrapper">
                <CheckIcon />
              </div>
              <h3>Transparent Process</h3>
              <p>No surprises, no hidden costs. You'll always know exactly where your project stands with weekly updates and real-time dashboards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Sticky Filters - Shows on scroll */}
      <section className="work-filters">
        <div className="filters-container">
          <div className="filter-pills">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-pill ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Case Studies Grid */}
      <section className="work-cases">
        <div className="cases-container">
          <div className="cases-grid">
            {filteredCases.map(caseItem => (
              <article key={caseItem.id} className="case-card">
                <div className="case-image-wrapper">
                  <img 
                    src={caseItem.image} 
                    alt={`${caseItem.title} project screenshot`}
                    className="case-image"
                    loading="lazy"
                  />
                  <div className="case-overlay">
                    <div className="case-metric-badge">
                      <span className="metric-value">{caseItem.metricValue}</span>
                      <span className="metric-label">{caseItem.metricLabel}</span>
                    </div>
                  </div>
                </div>
                <div className="case-content">
                  <div className="case-meta">
                    <span className="case-industry">{caseItem.industry}</span>
                    <span className="case-type">{caseItem.type}</span>
                  </div>
                  <h3 className="case-title">{caseItem.title}</h3>
                  <p className="case-problem">{caseItem.problem}</p>
                  <div className="case-tags">
                    {caseItem.tags.map(tag => (
                      <span key={tag} className="case-tag">{tag}</span>
                    ))}
                  </div>
                  <button 
                    className="filter-pill view-case-btn"
                    onClick={() => openCaseStudy(caseItem)}
                  >
                    View Case Study
                    <ArrowRightIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Confidence Builder */}
      <section className="work-confidence">
        <div className="confidence-container">
          <span className="confidence-badge">Why We're Selective</span>
          <h2 className="confidence-title">We Say No to 60% of Inquiries</h2>
          <p className="confidence-subtitle">
            Not because we don't need the work—but because we only take projects where we can guarantee results.
          </p>
          <div className="confidence-story">
            <div className="story-scenario">
              <h3>Recent Example:</h3>
              <p className="story-request">
                "A well-funded startup approached us for a complete rebrand. Budget: $50K. Timeline: 3 weeks."
              </p>
            </div>
            <div className="story-analysis">
              <div className="story-point">
                <strong>The Problem:</strong>
                <p>Their timeline made it impossible to do proper user research, which meant we'd be guessing—not designing based on data.</p>
              </div>
              <div className="story-point">
                <strong>Our Response:</strong>
                <p>We declined the project but offered a phased approach: 6-week discovery + 4-week execution. They went elsewhere.</p>
              </div>
            </div>
            <div className="story-outcome">
              <strong>3 months later?</strong>
              <p>They came back. The rushed rebrand failed. We did it right, and they're now one of our happiest clients with +180% user engagement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="work-cta">
        <div className="work-cta-container">
          <div className="cta-card">
            <span className="cta-badge">
              <span className="badge-pulse"></span>
              Limited Availability
            </span>
            <h2 className="cta-title">Ready to Be Our Next Success Story?</h2>
            <p className="cta-subtitle">
              We take on just 3-4 new projects per quarter to ensure every client gets our full attention. 
              Let's see if we're the right fit.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="cta-button primary">
                Start a Conversation
                <ArrowRightIcon />
              </a>
              <a href="/process" className="cta-button secondary">
                See Our Process
              </a>
            </div>
            <div className="cta-trust">
              <span className="trust-item">
                <CheckIcon className="trust-icon" />
                Free Strategy Call
              </span>
              <span className="trust-item">
                <CheckIcon className="trust-icon" />
                No Commitment
              </span>
              <span className="trust-item">
                <CheckIcon className="trust-icon" />
                Response in 24hrs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDY MODAL */}
      <div 
        className={`case-modal-overlay ${isModalOpen ? 'active' : ''}`}
        onClick={closeCaseStudy}
      >
        <div 
          className={`case-modal ${isModalOpen ? 'active' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedCase && (
            <>
              <button className="modal-close" onClick={closeCaseStudy}>
                <CloseIcon />
              </button>
              
              <div className="modal-header">
                <div className="modal-meta">
                  <span className="case-industry">{selectedCase.industry}</span>
                  <span className="case-type">{selectedCase.type}</span>
                </div>
                <h2 className="modal-title">{selectedCase.title}</h2>
                <p className="modal-subtitle">{selectedCase.problem}</p>
              </div>

              <div className="modal-content">
                {/* Before/After Comparison */}
                <div className="case-comparison">
                  <h3 className="comparison-title">Visual Transformation</h3>
                  <div className="comparison-grid">
                    <div className="comparison-item">
                      <span className="comparison-label before">Before</span>
                      <img 
                        src={selectedCase.beforeImage} 
                        alt="Before redesign"
                        className="comparison-image"
                      />
                    </div>
                    <div className="comparison-item">
                      <span className="comparison-label after">After</span>
                      <img 
                        src={selectedCase.afterImage} 
                        alt="After redesign"
                        className="comparison-image"
                      />
                    </div>
                  </div>
                </div>

                {/* Problems Section */}
                <div className="case-problem-section">
                  <h3 className="problem-section-title">
                    <XIcon />
                    The Challenges
                  </h3>
                  <ul className="problem-list">
                    {selectedCase.problems.map((problem, idx) => (
                      <li key={idx} className="problem-item">
                        <span className="problem-icon"><XIcon /></span>
                        {problem}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solutions Section */}
                <div className="case-solution-section">
                  <h3 className="solution-section-title">
                    <LightbulbIcon />
                    Our Solutions
                  </h3>
                  <div className="solution-grid">
                    {selectedCase.solutions.map((solution, idx) => (
                      <div key={idx} className="solution-item">
                        <span className="solution-number">{idx + 1}</span>
                        <p>{solution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results Section */}
                <div className="case-results-section">
                  {selectedCase.results.map((result, idx) => (
                    <div key={idx} className="result-card">
                      <span className="result-value">{result.value}</span>
                      <span className="result-label">{result.label}</span>
                    </div>
                  ))}
                </div>

                {/* Key Decisions */}
                <div className="case-decisions-section">
                  <h3 className="decisions-title">
                    <TargetIcon />
                    Key Strategic Decisions
                  </h3>
                  <ul className="decisions-list">
                    {selectedCase.decisions.map((decision, idx) => (
                      <li key={idx} className="decision-item">
                        <CheckIcon />
                        {decision}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="modal-footer">
                <a href="/contact" className="cta-button primary">
                  Start Your Project
                  <ArrowRightIcon />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OurWork;
