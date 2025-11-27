import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/WorksCarousel.css';

import Aos from 'aos';
import "aos/dist/aos.css";

const projects = [
  {
    title: 'Sun Max Energy (Pvt.) Ltd. official website',
    image: '/images/sunmax-energy.png',
    description: "The official website of the Sun Max Energy (Pvt.) Ltd. solar company located in Matara Sri Lanka ",
    links: {
      site: 'https://www.sunmaxenergy.lk/',
      source: 'https://github.com/PawanSankalpa?tab=repositories',
    },
  },
  {
    title: 'Luxia',
    image: '/images/luxia-clothing.png',
    description: "A official website of the luxia clothing brand",
    links: {
      site: 'https://travel-tracker-z3kz.onrender.com/',
      source: 'https://github.com/PawanSankalpa?tab=repositories',
    },
  },
  {
    title: 'Keeper App: Your Smart Notebook',
    image: '/images/gym.png',
    description: "The official website of the 'Premium Fitness' Gym Located in Kirinda Puhulwella, Matara.",
    links: {
      site: 'https://gym-premium-fitness.vercel.app/',
      source: 'https://github.com/PawanSankalpa?tab=repositories',
    },
  },
  
  
];

const WorksCarousel = () => {
  useEffect(() => {
    Aos.init({ duration: 800, once: true });
  }, []);

  // JSON-LD structured data for Projects
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Recent Work Portfolio",
    "itemListElement": projects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": project.title,
        "description": project.description,
        "image": project.image,
        "url": project.links.site
      }
    }))
  };

  return (
    <>
      {/* JSON-LD structured data script */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <section
        className='MainContainer-carousel'
        aria-label="Recent projects portfolio carousel"
      >
        <div className="works-carousel-container">
          <h2 className="carousel-title">Our Recent Work</h2>

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
                <article className="project-card" data-aos="fade-right">
                  <img
                    src={project.image}
                    alt={`Screenshot of ${project.title}`}
                    loading="lazy"
                  />
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="button-container">
                    <a
                      href={project.links.site}
                      className="button button-primary"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit the live site of ${project.title}`}
                    >
                      View Site
                    </a>
                    <a
                      href={project.links.source}
                      className="button button-tertiary"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View source code of ${project.title}`}
                    >
                      Source Code
                    </a>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default WorksCarousel;
