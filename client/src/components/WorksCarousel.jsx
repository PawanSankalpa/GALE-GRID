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
    title: 'Connect & Post: Share Your Thoughts',
    image: '/images/blogHomePage.png',
    description: "Connect & Post: Your platform to register, log in, and easily publish your blog posts. Share your thoughts publicly with titles and descriptions, knowing only you can edit or delete your content from your private user page. It's the perfect tool for showcasing your ideas.",
    links: {
      site: 'https://blogproject-xm1p.onrender.com/',
      source: 'https://github.com/PawanSankalpa/blogProject',
    },
  },
  {
    title: 'Travel Tracker: Map Your Adventures',
    image: '/images/travelTracker.png',
    description: "Travel Tracker lets you easily log the countries you've visited and see them marked directly on an interactive world map. It's the perfect way to visualize your global journeys and keep a digital record of all your adventures.",
    links: {
      site: 'https://travel-tracker-z3kz.onrender.com/',
      source: 'https://github.com/PawanSankalpa/travel_tracker',
    },
  },
  {
    title: 'Keeper App: Your Smart Notebook',
    image: '/images/KeeperApp.png',
    description: "Keeper App is a sleek, intuitive tool designed to save your ideas effortlessly. You can customize your experience with both dark and light themes, and even adjust the font size to your preference. It's the perfect place to jot down and organize all your thoughts, ensuring your brilliant ideas are always at your fingertips.",
    links: {
      site: 'https://keeper-app-woad-kappa.vercel.app/',
      source: 'https://github.com/PawanSankalpa/keeper-app',
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
