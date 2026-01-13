import React, { useState, useEffect } from 'react';
import { Phone, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  SiPython, 
  SiHtml5, 
  SiCss3, 
  SiReact, 
  SiJavascript, 
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiStripe,
  SiRedis,
  SiNextdotjs,
  SiGraphql,
  SiDocker,
  SiAmazonwebservices,
  SiTypescript,
  SiFigma,
  SiTailwindcss,
  SiGit,
  SiJest
} from 'react-icons/si';
import { FaGoogle, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import './styles/AchievementsSection.css';

const AchievementsSection = () => {
  const [currentSkillSet, setCurrentSkillSet] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const skills = [
    { icon: <SiHtml5 />, name: 'HTML5', color: '#E34F26' },
    { icon: <SiCss3 />, name: 'CSS3', color: '#1572B6' },
    { icon: <SiJavascript />, name: 'JavaScript', color: '#F7DF1E' },
    { icon: <SiReact />, name: 'React', color: '#61DAFB' },
    { icon: <SiTypescript />, name: 'TypeScript', color: '#3178C6' },
    { icon: <SiNextdotjs />, name: 'Next.js', color: '#000000' },
    { icon: <SiNodedotjs />, name: 'Node.js', color: '#339933' },
    { icon: <SiPython />, name: 'Python', color: '#3776AB' },
    { icon: <SiMongodb />, name: 'MongoDB', color: '#47A248' },
    { icon: <SiPostgresql />, name: 'PostgreSQL', color: '#4169E1' },
    { icon: <SiGraphql />, name: 'GraphQL', color: '#E10098' },
    { icon: <SiStripe />, name: 'Stripe', color: '#008CDD' },
    { icon: <SiRedis />, name: 'Redis', color: '#DC382D' },
    { icon: <SiDocker />, name: 'Docker', color: '#2496ED' },
    { icon: <SiAmazonwebservices />, name: 'AWS', color: '#FF9900' },
    { icon: <SiFigma />, name: 'Figma', color: '#F24E1E' },
    { icon: <SiTailwindcss />, name: 'Tailwind', color: '#06B6D4' },
    { icon: <SiGit />, name: 'Git', color: '#F05032' },
    { icon: <SiJest />, name: 'Jest', color: '#C21325' }
  ];

  const socialIcons = [
    { icon: <FaLinkedinIn />, color: '#0A66C2', label: 'LinkedIn' },
    { icon: <FaInstagram />, color: '#E4405F', label: 'Instagram' },
    { icon: <FaTwitter />, color: '#1DA1F2', label: 'Twitter' },
    { icon: <FaFacebookF />, color: '#1877F2', label: 'Facebook' }
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSkillSet(prev => (prev + 1) % Math.ceil(skills.length / 6));
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, skills.length]);

  const handleSkillNav = (direction) => {
    const maxSets = Math.ceil(skills.length / 6);
    setCurrentSkillSet(prev =>
      direction === 'next'
        ? (prev + 1) % maxSets
        : (prev - 1 + maxSets) % maxSets
    );
  };

  return (
    <section className="achievements-section">
      {/* component JSX unchanged */}
    </section>
  );
};

export default AchievementsSection;
