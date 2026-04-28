import React, { useState, useEffect, useMemo } from "react";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import { useSkeletonDelay } from "../../hooks/useDataLoader";
import { SkeletonGrid } from "../skeletons/SkeletonComponents";
import "../skeletons/Skeleton.css";
import "./styles/OurTeam.css";

// Your existing team data
const TEAM_MEMBERS = [
  {
    name: "pawan sankalpa",
    desc: "Harvard University — BSc in Computer Science",
    img: require("../../assets/HeroSliderPics/Pawan.png"),
    links: {
      linkedin: "#",
      github: "#",
      website: "#",
    },
  },
  {
    name: "tharani jayathura",
    desc: "Undergraduate, BSc (Hons) IT & Management — University of Moratuwa",
    img: require("../../assets/HeroSliderPics/Tharani.JPG"),
    links: {
      linkedin: "https://www.linkedin.com/in/tharani-jayathura-96235226b/",
      github: "https://github.com/tharanijayathura",
      website: "https://tharani-jayathura.vercel.app/",
    },
  },
];

/**
 * SocialLinks Component
 * Memoized to prevent re-renders
 */
const SocialLinks = React.memo(({ links }) => (
  <div className="team-social">
    <a 
      href={links.linkedin} 
      target="_blank" 
      rel="noreferrer" 
      aria-label="LinkedIn"
      title="Visit LinkedIn profile"
    >
      <FaLinkedin />
    </a>
    <a 
      href={links.github} 
      target="_blank" 
      rel="noreferrer" 
      aria-label="GitHub"
      title="Visit GitHub profile"
    >
      <FaGithub />
    </a>
    <a 
      href={links.website} 
      target="_blank" 
      rel="noreferrer" 
      aria-label="Portfolio"
      title="Visit portfolio website"
    >
      <FaGlobe />
    </a>
  </div>
));

SocialLinks.displayName = 'SocialLinks';

/**
 * TeamCard Component
 * Memoized to prevent unnecessary re-renders
 * Only re-renders when the person prop changes
 */
const TeamCard = React.memo(({ person, index }) => (
  <figure 
    className="team-card"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <img 
      src={person.img} 
      alt={person.name} 
      className="team-photo"
      loading="lazy"
      decoding="async"
    />
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
));

TeamCard.displayName = 'TeamCard';

/**
 * OurTeam Component with Optimized Skeleton Loading
 * 
 * Key optimizations:
 * - useSkeletonDelay prevents skeleton flash
 * - React.memo for card and social components
 * - useMemo for team members layout
 * - Lazy loading for images
 * - Semantic HTML structure
 */
const OurTeam = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load team data
   * In production, replace with actual API call
   */
  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      
      // Simulated network delay (350ms)
      await new Promise(resolve => setTimeout(resolve, 350));
      
      setTeamData({
        members: TEAM_MEMBERS,
        description: {
          title: "Our Team",
          paragraphs: [
            "We are a small, passionate team driven by creativity and dedication. With a strong focus on quality and detail, we work closely together to deliver meaningful and reliable results.",
            "Each member brings unique skills and a shared vision, allowing us to collaborate efficiently and give every project the care it deserves.",
            "Our core values remain constant: trust, professionalism, creativity, and continuous improvement."
          ]
        }
      });
      
      setLoading(false);
    };

    loadTeam();
  }, []);

  /**
   * Use skeleton delay hook
   * Prevents skeleton from flashing on fast networks
   */
  const showSkeleton = useSkeletonDelay(loading, 300);

  /**
   * Memoize team layout
   * Prevents re-renders of team cards
   */
  const teamLayout = useMemo(() => {
    if (!teamData?.members) return null;

    return {
      left: teamData.members[0],
      right: teamData.members[1]
    };
  }, [teamData]);

  /**
   * Show skeleton while loading
   */
  if (showSkeleton) {
    return (
      <section 
        className="team-section" 
        id="our-team" 
        aria-label="Our Team"
        role="region"
      >
        <SkeletonGrid count={2} includeImage={true} lines={2} />
      </section>
    );
  }

  /**
   * Show content when loaded
   */
  if (!teamData) return null;

  return (
    <section 
      className="team-section fade-in" 
      id="our-team" 
      aria-label="Our Team"
      role="region"
    >
      <div className="team-layout">
        {/* Left Team Member */}
        {teamLayout.left && (
          <div className="team-left">
            <TeamCard person={teamLayout.left} index={0} />
          </div>
        )}

        {/* Center Description Panel */}
        <div className="team-center">
          <article className="team-panel">
            <h2 className="panel-title">{teamData.description.title}</h2>
            
            {teamData.description.paragraphs.map((paragraph, idx) => (
              <p key={idx} className="panel-copy">
                {paragraph}
              </p>
            ))}
            
            <div className="panel-note">
              Hover over an image to see more details.
            </div>
          </article>
        </div>

        {/* Right Team Member */}
        {teamLayout.right && (
          <div className="team-right">
            <TeamCard person={teamLayout.right} index={1} />
          </div>
        )}
      </div>
    </section>
  );
};

export default OurTeam;
