import React from "react";
import "./styles/AboutMe.css";
import { FaUser } from "react-icons/fa";

import "aos/dist/aos.css";

function AboutMe() {
  return (
    <div className="aboutMe-container">
    <section className="about-me-container" aria-labelledby="aboutme-title">
      <div className="features">
        <div className="text-column">
          <h2 id="aboutme-title" data-aos="zoom-in">
            About Me
            <span className="subheading" data-aos="zoom-in" aria-label="The main developer of GALE GRID">
              {" "} (The main developer of GALE GRID)
            </span>
          </h2>
          <p className="lead" data-aos="zoom-in">
            Hi! I'm Pawan — a developer passionate about crafting modern, responsive websites. I handle both front-end visuals and back-end functionality to ensure fast, seamless experiences. From hosting to domains, I make getting online hassle-free. Currently, I'm exploring AI and machine learning to push my skills further.
          </p>
          <div className="button-container">
            <a 
            href={`https://wa.me/${94776868537}?text=${encodeURIComponent("Hi Pawan, I just visited galgegrid.com and I'm interested in discussing a web design project. I'd love to learn more about your services!")}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary" 
            data-aos="zoom-in" 
            aria-label="Contact Pawan">
              Contact Me
            </a>
          </div>
        </div>
        <div className="image-column" data-aos="zoom-in" aria-hidden="true">
          <FaUser className="about-icon" aria-hidden="true" />
        </div>   
      </div>
    </section>
    </div>
  );
}

export default AboutMe;
