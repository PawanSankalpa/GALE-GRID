import React from "react";
import "./styles/AboutMe.css";
import { FaUser } from "react-icons/fa";

import Aos from "aos";
import "aos/dist/aos.css";

function AboutMe() {
  return (
    <div className="about-me-container">
      <div className="features">
        <div className="text-column">
          <h2 data-aos="zoom-in">
            About Me
            <span className="subheading" data-aos="zoom-in">( The main developer of GALE GRID )</span>
          </h2>
          <p className="lead" data-aos="zoom-in">
            Hi! I'm Pawan — a developer passionate about crafting modern, responsive websites. I handle both front-end visuals and back-end functionality to ensure fast, seamless experiences. From hosting to domains, I make getting online hassle-free. Currently, I'm exploring AI and machine learning to push my skills further.
          </p>
          <div className="button-container">
            <a href="#contact" className="button button-primary" data-aos="zoom-in">Contact Me</a>
          </div>
        </div>
        <div className="image-column" data-aos="zoom-in">
          <FaUser className="about-icon" />
        </div>   
      </div>
    </div>
  );
}

export default AboutMe;