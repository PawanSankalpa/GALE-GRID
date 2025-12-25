import React from "react";
import PawanImg from "../assets/HeroSliderPics/Pawan.png";
import TharaniImg from "../assets/HeroSliderPics/Tharani.JPG";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import "./styles/OurTeam.css";

const members = [ 
  {
    name: "pawan sankalpa",
    desc: "Harvard University — BSc in Computer Science",
    img: PawanImg,
    links: {
      linkedin: "#",
      github: "#",
      website: "#",
    },
  },
  {
    name: "tharani jayathura",
    desc: "Undergraduate, BSc (Hons) IT & Management — University of Moratuwa",
    img: TharaniImg,
    links: {
      linkedin: "https://www.linkedin.com/in/tharani-jayathura-96235226b/",
      github: "https://github.com/tharanijayathura",
      website: "https://tharani-jayathura.vercel.app/",
    },
  },
];

const SocialLinks = ({ links }) => (
  <div className="team-social">
    <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
      <FaLinkedin />
    </a>
    <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
      <FaGithub />
    </a>
    <a href={links.website} target="_blank" rel="noreferrer" aria-label="Portfolio">
      <FaGlobe />
    </a>
  </div>
);

const TeamCard = ({ person }) => (
  <figure className="team-card">
    <img src={person.img} alt={person.name} className="team-photo" />
    <figcaption className="team-overlay">
      <div className="name-row">
        <h3 className="member-name">{person.name}</h3>
      </div>
      <div className="hover-reveal">
        <p className="member-desc">{person.desc}</p>
        <SocialLinks links={person.links} />
      </div>
    </figcaption>
  </figure>
);
const OurTeam = () => {
  return (
    <section className="team-section" id="our-team" aria-label="Our Team">
      <div className="team-layout">
        {/* Left image */}
        <div className="team-left">
          <TeamCard person={members[0]} />
        </div>

        {/* Center description panel */}
        <div className="team-center">
          <div className="team-panel">
            <h2 className="panel-title">Our Team</h2>
            <p className="panel-copy">
              We are a small, passionate team driven by creativity and dedication. With a strong
              focus on quality and detail, we work closely together to deliver meaningful and
              reliable results.
            </p>
            <p className="panel-copy">
              Each member brings unique skills and a shared vision, allowing us to collaborate
              efficiently and give every project the care it deserves.
            </p>
            <p className="panel-copy">
              Our core values remain constant: trust, professionalism, creativity, and continuous
              improvement.
            </p>
            <div className="panel-note">Hover over an image to see more details.</div>
          </div>
        </div>

        {/* Right image */}
        <div className="team-right">
          <TeamCard person={members[1]} />
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
