import React, { useEffect } from 'react';
import './styles/Service.css';
import { SiCssdesignawards } from "react-icons/si";
import { RiReactjsFill } from "react-icons/ri";
import { FaSearch, FaServer, FaGlobe } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import AOS from "aos";
import "aos/dist/aos.css";

const servicesData = [
  {
    id: "web-design",
    icon: <SiCssdesignawards size={32} color="#00A389" />,
    title: "Web Design",
    description: "We build attractive websites that work great on all devices and help your business grow."
  },
  {
    id: "frontend-development",
    icon: <RiReactjsFill size={32} color="#00A389" />,
    title: "Frontend Development",
    description: "Building fast, easy-to-use websites and interfaces that make browsing simple and enjoyable."
  },
  {
    id: "seo-optimization",
    icon: <FaSearch size={32} color="#00A389" />,
    title: "SEO Optimization",
    description: "Improving your site’s visibility on Google with effective, customized SEO strategies."
  },
  {
    id: "backend-development",
    icon: <FaServer size={32} color="#00A389" />,
    title: "Backend Development",
    description: "We handle the hidden parts of your website — logins, data, and security — so everything runs safely and smoothly."
  },
  {
    id: "hosting-domain",
    icon: <FaGlobe size={32} color="#00A389" />,
    title: "Hosting & Domain Setup",
    description: "Taking care of your website’s hosting and domain so you don’t have to worry about technical details."
  },
  {
    id: "website-maintenance",
    icon: <MdSettings size={40} color="#00A389" />,
    title: "Website Management & Maintenance",
    description: "We handle updates, security, backups, and performance to keep your website running smoothly and worry-free."
  }
];



const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = queryString.parse(location.search);
    const serviceId = query.service;
    if (serviceId) {
      const element = document.getElementById(serviceId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight');
        setTimeout(() => {
          element.classList.remove('highlight');
        }, 2000);
      }
    }
  }, [location]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  function goToService(serviceId) {
    // Navigate to /services with hash #service-{id} for consistency with the services page IDs
    navigate(`/services#service-${serviceId}`);
  }

  return (
    <section className="sp-services-section">
      <div className="sp-services-section__bg-overlay"></div>
      <h2 className="sp-services__title">Our Services</h2>
      <div className="sp-services-grid">
        {servicesData.map((service, index) => (
          <div
            className="sp-service-card"
            key={index}
            id={service.id}
            onClick={() => goToService(service.id)}
            data-aos="fade-up"
          >
            <div className="sp-service-card__bg"></div>
            <div className="sp-service-card__hover-effect"></div>
            <div className="sp-service-card__icon" style={{ fontSize: '2.5rem' }}>{service.icon}</div>
            <h3 className="sp-service-card__heading">{service.title}</h3>
            <p className="sp-service-card__description">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
