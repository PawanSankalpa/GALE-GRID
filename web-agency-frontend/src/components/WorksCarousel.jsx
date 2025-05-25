import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/WorksCarousel.css';

import Aos from 'aos';
import "aos/dist/aos.css";

// Project data for the carousel
const projects = [
  {
    title: 'School Website',
    image: '/images/schoolWeb/HomePage.png',
    description: 'A modern website for a local cafe with an online menu and booking system.',
    links: {
      site: 'https://cafedelights.com',
      demo: 'https://cafedelights.com/demo',
      source: 'https://github.com/cafedelights',
    },
  },
  {
    title: 'Class Website',
    image: '/images/classWeb/HomePage.png',
    description: 'Personal trainer portfolio with custom video workout sections.',
    links: {
      site: 'https://fitnesspro.com',
      demo: 'https://fitnesspro.com/demo',
      source: 'https://github.com/fitnesspro',
    },
  },
  {
    title: 'Blog',
    image: '/images/blogHomePage.png',
    description: 'E-commerce site for a bookstore with easy navigation and search.',
    links: {
      site: 'https://bookhaven.com',
      demo: 'https://bookhaven.com/demo',
      source: 'https://github.com/bookhaven',
    },
  },
];

// WorksCarousel component for displaying project cards in a swiper carousel
const WorksCarousel = () => {
  return (
    <div className='MainContainer-carousel'>
    <div className="works-carousel-container">
      {/* Carousel title */}
      <h2 className="carousel-title">Our Recent Work</h2>

      {/* Swiper carousel with navigation and pagination */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {projects.map((project, index) => (
          <SwiperSlide key={index}>
            {/* Project card */}
            <div className="project-card" data-aos="fade-right">
              <img src={project.image} alt={project.title} />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {/* Button container for multiple action links */}
              <div className="button-container">
                <a href={project.links.site} className="button button-primary" target="_blank" rel="noreferrer">
                  View Site
                </a>
                <a href={project.links.demo} className="button button-secondary" target="_blank" rel="noreferrer">
                  Live Demo
                </a>
                <a href={project.links.source} className="button button-tertiary" target="_blank" rel="noreferrer">
                  Source Code
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </div>
  );
};

export default WorksCarousel;