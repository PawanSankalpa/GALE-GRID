import React, { useState, useEffect } from 'react';
import './styles/BackToTop.css';
import { FaArrowUp } from 'react-icons/fa';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const toggleVisibility = () => {
      if (!isMobile && window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Check on mount
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [isMobile]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isMobile) return null;

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''} ${hovered ? 'hover' : ''}`}
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Back to top"
    >
      <span className="back-to-top-icon"><FaArrowUp /></span>
      <span className="back-to-top-glow"></span>
      <span className="back-to-top-pulse"></span>
    </button>
  );
};

export default BackToTop;