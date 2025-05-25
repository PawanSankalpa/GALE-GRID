import React, { useEffect, useRef } from "react";
import "./Services.css";
import { SiCssdesignawards } from "react-icons/si";
import { RiReactjsFill } from "react-icons/ri";
import { FaSearch, FaServer, FaGlobe } from "react-icons/fa";
import { MdSettings, MdSecurity } from "react-icons/md";
import { FaHandshake, FaCubes, FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlineLockClosed } from "react-icons/hi";
import { RiCustomerService2Fill } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";
import WhatsAppButton from "../../components/WhatsAppButton";
import BackToTop from "../../components/BackToTop";

import Aos from "aos";
import "aos/dist/aos.css";

const coreServices = [
  {
    id: "web-design",
    icon: <SiCssdesignawards size={36} color="#00A389" />,
    title: "Web Design & User Experience",
    details:
      "We craft stunning, modern websites that not only look incredible but are also super easy for your visitors to use. We focus on creating a smooth journey for everyone, making sure your site is beautiful and works perfectly on any device, from phones to desktops.",
  },
  {
    id: "frontend-development",
    icon: <RiReactjsFill size={36} color="#00A389" />,
    title: "Lightning-Fast Frontend Development",
    details:
      "Using cutting-edge technologies like React.js, we build the interactive parts of your website that users see and click. This means your site will load quickly, feel snappy, and provide a delightful experience without any frustrating delays.",
  },
  {
    id: "backend-development",
    icon: <FaServer size={36} color="#00A389" />,
    title: "Robust Backend & API Development",
    details:
      "Behind every great website is a powerful engine. We build the secure and efficient 'brain' of your site, handling everything from storing your data safely to making sure all the complex features work flawlessly. Think of it as the invisible infrastructure that keeps your business running smoothly online.",
  },
  {
    id: "seo-optimization",
    icon: <FaSearch size={36} color="#00A389" />,
    title: "Google-Friendly SEO Optimization",
    details:
      "Want your business to show up at the top of Google searches? We'll optimize your website so more people can find you. This involves smart strategies, using the right keywords, and making sure your site is technically sound, giving you a real boost in online visibility.",
  },
  {
    id: "website-maintenance",
    icon: <MdSettings size={36} color="#00A389" />,
    title: "Hassle-Free Website Maintenance",
    details:
      "Your website needs ongoing care to stay healthy and secure. We provide regular updates, secure backups, quick bug fixes, and continuous performance checks. This ensures your site remains fast, safe from threats, and always up-to-date with the latest web standards.",
  },
];

const additionalServices = [
  {
    id: "hosting-domain",
    icon: <FaGlobe size={36} color="#00A389" />,
    title: "Simple Domain & Hosting Setup",
    details:
      "Getting your website online can seem complicated, but we make it easy. We'll help you pick the perfect web address (domain) and set up reliable hosting, so your site is always available to your customers, without any technical headaches for you.",
  },
  {
    id: "cybersecurity-consultation",
    icon: <MdSecurity size={36} color="#00A389" />,
    title: "Expert Cybersecurity Consultation (On Request)",
    details:
      "In today's digital world, security is paramount. With a dedicated cybersecurity expert on our team, we offer specialized protection plans, identify potential weaknesses, and create custom security solutions to keep your website and data safe from online threats.",
  },
];

const Services = () => {
  const location = useLocation();
  const coreServiceRefs = useRef(coreServices.map(() => React.createRef()));
  const additionalServiceRefs = useRef(
    additionalServices.map(() => React.createRef())
  );

  useEffect(() => {
    Aos.init({ duration: 1000 }); // Initialize AOS
  }, []);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      // Remove 'service-' prefix to find core or additional service id
      const serviceId = hash.startsWith("service-")
        ? hash.replace("service-", "")
        : hash;

      // Check core services
      const coreServiceIndex = coreServices.findIndex(
        (service) => service.id === serviceId
      );
      if (
        coreServiceIndex !== -1 &&
        coreServiceRefs.current[coreServiceIndex]?.current
      ) {
        const element = coreServiceRefs.current[coreServiceIndex].current;
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlight");
        setTimeout(() => {
          element.classList.remove("highlight");
        }, 2000);
        return; // exit after found
      }
      // Check additional services
      const additionalServiceIndex = additionalServices.findIndex(
        (service) => service.id === serviceId
      );
      if (
        additionalServiceIndex !== -1 &&
        additionalServiceRefs.current[additionalServiceIndex]?.current
      ) {
        const element =
          additionalServiceRefs.current[additionalServiceIndex].current;
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlight");
        setTimeout(() => {
          element.classList.remove("highlight");
        }, 2000);
      }
    }
  }, [location]);

  return (
    <div>
      <NavBar />
      <WhatsAppButton />
      <BackToTop />
      <section className="services-page">
        {/* Intro */}
        <header className="services-intro">
          <h1>Our Web Solutions & Services</h1>
          <p>
            At our agency, we blend creativity, code, and care to deliver
            end-to-end web solutions that help you grow online. Whether you’re
            just starting or scaling up, we’ve got the skills to build and
            support your digital presence.
          </p>
        </header>

        {/* Core Services */}
        <section className="services-section">
          <h2>Core Services</h2>
          <div className="services-grid">
            {coreServices.map((service, index) => (
              <div
                key={index}
                className="service-card"
                ref={coreServiceRefs.current[index]}
                id={`service-${service.id}`}
                data-aos="zoom-in-up" // Add AOS animation
              >
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="services-section">
          <h2>Additional Services</h2>
          <div className="services-grid">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="service-card"
                ref={additionalServiceRefs.current[index]}
                id={`service-${service.id}`}
                data-aos="zoom-in-up" // Add AOS animation
              >
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* New Section: Why GALE GRID */}
        <section className="contact-action-section" data-aos="fade-up">
          <h2>Ready to Elevate Your Online Presence?</h2>
          <p>
            Let's connect and craft a powerful digital strategy for your
            business.
          </p>
          <a href="/contact" className="contact-button">
            Tell Us What You Need <FaArrowRight className="button-icon" />
          </a>
        </section>
      </section>
    </div>
  );
};

export default Services;
