import React from "react";
import robotImg from "../assets/HeroSliderPics/robotee.png";
import "./styles/RobotServices.css";

const Bubble = ({ side, id, title, text }) => (
  <div className={`rs-bubble ${side}`}>
    <div className="rs-bubble-inner">
      <span className="rs-index">{id}</span>
      <h4 className="rs-title">{title}</h4>
      <p className="rs-text">{text}</p>
    </div>
  </div>
);

export default function RobotServices() {
  const leftServices = [
    {
      id: "01",
      title: "Website Design & Development",
      text: "Modern, responsive websites designed to help your business grow online.",
    },
    {
      id: "03",
      title: "UI / UX Design",
      text: "Clean and user-friendly designs that improve user experience and engagement.",
    },
    {
      id: "05",
      title: "E-Commerce Solutions",
      text: "Online stores with secure payment integration and smooth checkout experiences.",
    },
  ];

  const rightServices = [
    {
      id: "02",
      title: "Small Business Websites",
      text: "Affordable, professional websites for shops, startups, and local businesses.",
    },
    {
      id: "04",
      title: "Custom Web Applications",
      text: "Custom dashboards and web systems built to match your business needs.",
    },
    {
      id: "06",
      title: "Website Maintenance & Support",
      text: "Ongoing updates, security checks, and technical support you can rely on.",
    },
  ];

  return (
    <section className="robot-services-section" id="our-services">
      <div className="rs-container">
        <div className="rs-column left">
          {leftServices.map((s) => (
            <Bubble key={s.id} side="left" {...s} />
          ))}
        </div>

        <div className="rs-column center">
          <div className="rs-robot-wrap">
            <img
              src={robotImg}
              alt="Robotee"
              className="rs-robot-img"
              loading="lazy"
            />
          </div>
          <h2 className="rs-heading">Our Services</h2>
        </div>

        <div className="rs-column right">
          {rightServices.map((s) => (
            <Bubble key={s.id} side="right" {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
