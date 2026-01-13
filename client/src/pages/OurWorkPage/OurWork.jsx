import React, { useState } from 'react';
import './OurWork.css';
import NavBar from '../../components/NavBar';

const OurWork = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: 'Meridian Capital',
      category: 'finance',
      tags: ['Branding', 'Web Design', 'Development'],
      description: 'Complete digital transformation for a boutique investment firm, creating a sophisticated online presence.',
      image: 'https://lh3.googleusercontent.com/d/1VqP8xKxK5xZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z=s1000',
      year: '2024'
    },
    {
      id: 2,
      title: 'Verde Botanicals',
      category: 'ecommerce',
      tags: ['E-commerce', 'UI/UX', 'Photography'],
      description: 'Luxury plant boutique with custom shopping experience and immersive product photography.',
      image: 'https://lh3.googleusercontent.com/d/2VqP8xKxK5xZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z=s1000',
      year: '2024'
    },
    {
      id: 3,
      title: 'Atlas Architecture',
      category: 'portfolio',
      tags: ['Portfolio', 'Web Design', 'CMS'],
      description: 'Minimalist showcase for contemporary architecture studio with project management.',
      image: 'https://lh3.googleusercontent.com/d/3VqP8xKxK5xZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z=s1000',
      year: '2023'
    },
    {
      id: 4,
      title: 'Pulse Wellness',
      category: 'healthcare',
      tags: ['Web App', 'UI/UX', 'Development'],
      description: 'Digital health platform with appointment scheduling and patient portal functionality.',
      image: 'https://lh3.googleusercontent.com/d/4VqP8xKxK5xZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z=s1000',
      year: '2023'
    },
    {
      id: 5,
      title: 'Lumina Studios',
      category: 'creative',
      tags: ['Branding', 'Web Design', 'Animation'],
      description: 'Creative agency rebrand with interactive storytelling and motion design.',
      image: 'https://lh3.googleusercontent.com/d/5VqP8xKxK5xZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z=s1000',
      year: '2024'
    },
    {
      id: 6,
      title: 'Nomad Collective',
      category: 'ecommerce',
      tags: ['E-commerce', 'Branding', 'Development'],
      description: 'Sustainable fashion marketplace with editorial content and conscious shopping.',
      image: 'https://lh3.googleusercontent.com/d/6VqP8xKxK5xZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z=s1000',
      year: '2023'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Work' },
    { id: 'finance', label: 'Finance' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'creative', label: 'Creative' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="work-page">
      {/* Navigation matching homepage */}
        <NavBar />

      {/* Hero Section - matching homepage style */}
      <section className="work-hero">
        <div className="work-hero-container">
          <div className="work-hero-badge">OUR PORTFOLIO</div>
          <h1 className="work-hero-title">Selected Work</h1>
          <p className="work-hero-subtitle">
            Explore our latest projects and creative solutions
          </p>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="work-filter-section">
        <div className="work-filter-wrapper">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`work-filter-pill ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="work-projects">
        <div className="work-projects-container">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id}
              className="work-project-item"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="work-project-image-box">
                <div className="work-project-img" style={{
                  background: `linear-gradient(135deg, 
                    ${index % 3 === 0 ? '#f0f0f0' : index % 3 === 1 ? '#e8e8e8' : '#f5f5f5'}, 
                    ${index % 3 === 0 ? '#e0e0e0' : index % 3 === 1 ? '#d8d8d8' : '#e5e5e5'})`
                }}>
                  {hoveredProject === project.id && (
                    <div className="work-project-hover-overlay">
                      <span className="work-view-text">View Case Study →</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="work-project-content">
                <div className="work-project-top">
                  <h3 className="work-project-name">{project.title}</h3>
                  <span className="work-project-year">{project.year}</span>
                </div>
                <p className="work-project-desc">{project.description}</p>
                <div className="work-project-tags-row">
                  {project.tags.map(tag => (
                    <span key={tag} className="work-project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - matching homepage style */}
      <section className="work-cta">
        <div className="work-cta-container">
          <h2 className="work-cta-heading">Let's Work Together</h2>
          <p className="work-cta-text">
            Have a project in mind? Let's create something amazing together.
          </p>
          <button className="work-cta-btn">Start Your Project</button>
        </div>
      </section>

      {/* Footer matching homepage */}
      <footer className="work-footer">
        <div className="work-footer-container">
          <div className="work-footer-main">
            <div className="work-footer-brand">
              <h3>STUDIO</h3>
              <p>Crafting digital experiences</p>
            </div>
            <div className="work-footer-links">
              <div className="work-footer-col">
                <h4>Company</h4>
                <a href="/about">About</a>
                <a href="/work">Work</a>
                <a href="/contact">Contact</a>
              </div>
              <div className="work-footer-col">
                <h4>Services</h4>
                <a href="/services">Web Design</a>
                <a href="/services">Development</a>
                <a href="/services">Branding</a>
              </div>
              <div className="work-footer-col">
                <h4>Connect</h4>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
                <a href="#">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="work-footer-bottom">
            <p>© 2024 Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OurWork;