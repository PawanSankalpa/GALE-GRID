import React, { useState, useEffect, useRef } from "react";
import { 
  FaChevronDown, 
  FaWhatsapp, 
  FaPhone, 
  FaEnvelope,
  FaClock,
  FaShieldAlt,
  FaMobileAlt,
  FaCreditCard,
  FaSearch,
  FaMagic,
  FaStar,
  FaQuestionCircle,
  FaGoogle
} from "react-icons/fa";
import { MdTimeline, MdSupportAgent, MdExpandMore } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import "./styles/FAQ.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const faqRefs = useRef([]);

  const faqs = [
    {
      question: "How long does website development take?",
      answer: "Typically 2-8 weeks. Simple sites take 2-3 weeks, complex projects 5-8 weeks. We provide exact timelines during consultation.",
      icon: <FaClock />,
      category: "timeline",
      color: "#3B82F6"
    },
    {
      question: "Who owns the completed website?",
      answer: "You own everything—domain, design, and code. We transfer full rights upon completion with no hidden fees.",
      icon: <FaShieldAlt />,
      category: "legal",
      color: "#10B981"
    },
    {
      question: "Is mobile optimization included?",
      answer: "Yes! All websites are fully responsive and tested across all device sizes. Mobile-first approach ensures perfect performance.",
      icon: <FaMobileAlt />,
      category: "technical",
      color: "#8B5CF6"
    },
    {
      question: "Can I edit the website myself?",
      answer: "Absolutely! We provide a user-friendly CMS for easy updates without coding. Training included.",
      icon: <FaMagic />,
      category: "technical",
      color: "#EC4899"
    },
    {
      question: "What payment options do you offer?",
      answer: "Flexible plans: 50% upfront, 25% at design approval, 25% at launch. Custom schedules available.",
      icon: <FaCreditCard />,
      category: "pricing",
      color: "#F59E0B"
    },
    {
      question: "Is SEO optimization included?",
      answer: "Yes, basic SEO is standard. Advanced optimization available for competitive industries to boost rankings.",
      icon: <FaSearch />,
      category: "technical",
      color: "#06B6D4"
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes! We offer maintenance plans, security updates, and 24/7 technical support for peace of mind.",
      icon: <MdSupportAgent />,
      category: "support",
      color: "#3B82F6"
    },
    {
      question: "Can you help with content creation?",
      answer: "Absolutely. We offer copywriting, image sourcing, and content strategy as part of our packages.",
      icon: <FaQuestionCircle />,
      category: "content",
      color: "#8B5CF6"
    }
  ];

  const categories = [
    { id: "all", label: "All Questions", count: faqs.length },
    { id: "technical", label: "Technical", count: faqs.filter(f => f.category === "technical").length },
    { id: "pricing", label: "Pricing", count: faqs.filter(f => f.category === "pricing").length },
    { id: "timeline", label: "Timeline", count: faqs.filter(f => f.category === "timeline").length },
    { id: "support", label: "Support", count: faqs.filter(f => f.category === "support").length }
  ];

  const filteredFaqs = activeCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  // Handle hover expand
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth > 768) { // Desktop only
        const faqElements = document.querySelectorAll('.faq-item');
        faqElements.forEach((faq, index) => {
          const rect = faq.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            setHoveredIndex(index);
          }
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="faq-clean" aria-labelledby="faq-heading">
      <div className="faq-container">
        {/* Floating Stats */}
        <div className="floating-stats">
          <div className="floating-stat">
            <span className="floating-number">24/7</span>
            <span className="floating-label">Support</span>
          </div>
          <div className="floating-stat">
            <span className="floating-number">100%</span>
            <span className="floating-label">Satisfaction</span>
          </div>
          <div className="floating-stat">
            <span className="floating-number">15min</span>
            <span className="floating-label">Avg Reply</span>
          </div>
        </div>

        {/* Header */}
        <div className="faq-header">
          {/* <div className="faq-badge">
            <span className="badge-dot"></span>
            <span className="badge-text">Frequently Asked</span>
          </div> */}
          <h1 id="faq-heading" className="faq-title">
            - Frequently Asked Questions -
            <span className="title-underline"></span>
          </h1>
          <p className="faq-subtitle">
            Get instant answers to common questions about our services and process.
          </p>
        </div>

        <div className="faq-main">
          {/* Categories Sidebar */}
          <div className="faq-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-icon-wrapper">
                <FaQuestionCircle className="sidebar-icon" />
              </div>
              <h3>Browse Topics</h3>
              <p className="sidebar-subtitle">Filter by category</p>
            </div>
            
            <div className="category-list">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className="category-content">
                    <span className="category-label">{cat.label}</span>
                    <span className="category-count">{cat.count}</span>
                  </div>
                  <IoIosArrowDown className="category-arrow" />
                </button>
              ))}
            </div>

            {/* Quick Contact */}
            <div className="quick-contact">
              <div className="contact-header">
                <MdSupportAgent className="support-icon" />
                <div className="contact-text">
                  <h4>Need Help?</h4>
                  <p>Contact us directly</p>
                </div>
              </div>
              <div className="contact-buttons">
                <button className="contact-button whatsapp">
                  <FaWhatsapp />
                  <span>WhatsApp</span>
                  
                </button>
                
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="faq-content">
            <div className="faq-grid">
              {filteredFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`faq-item ${hoveredIndex === index ? 'hovered' : ''} ${openIndex === index ? 'expanded' : ''}`}
                  ref={el => faqRefs.current[index] = el}
                  onMouseEnter={() => window.innerWidth > 768 && setHoveredIndex(index)}
                  onMouseLeave={() => window.innerWidth > 768 && setHoveredIndex(null)}
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      setOpenIndex(openIndex === index ? null : index);
                    }
                  }}
                  style={{ '--faq-color': faq.color }}
                >
                  <div className="faq-glow"></div>
                  
                  <div className="faq-item-content">
                    <div className="faq-header-row">
                      <div className="faq-icon-wrapper" style={{ background: `${faq.color}15` }}>
                        <div className="faq-icon" style={{ color: faq.color }}>
                          {faq.icon}
                        </div>
                      </div>
                      
                      <div className="faq-text-content">
                        <h3 className="faq-question">
                          {faq.question}
                          <span className="question-category">{faq.category}</span>
                        </h3>
                        
                        <div className="faq-answer-container">
                          <div className="faq-answer">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="faq-indicator">
                        <MdExpandMore className="expand-icon" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="progress-line"></div>
                </div>
              ))}
            </div>


          </div>
        </div>

        {/* Contact Banner */}
        <div className="contact-banner">
          <div className="banner-content">
            <div className="banner-icon">
              <FaEnvelope />
            </div>
            <div className="banner-text">
              <h3>Still have questions?</h3>
              <p>Email us for a detailed response within 24 hours</p>
            </div>
            <button className="banner-button">
              <FaEnvelope />
              <span>Send Email</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;