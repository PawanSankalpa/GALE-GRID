import React, { useState } from "react";
import "./Team.css";
import NavBar from "../../components/NavBar";
import WhatsAppButton from "../../components/WhatsAppButton";
import BackToTop from "../../components/BackToTop";

const teamMembers = [
    {
    name: "Yapa",
    title: "( Cybersecurity Engineer )",
    bio: "A cybersecurity engineer with a Bachelor's degree in Information Technology, specialized in Cybersecurity, from (SLIIT).",
    skills: [
      "Vulnerability Assessment",
      "Threat Analysis",
      "PfSense Firewall",
      "Wazuh",
      "Nessus",
      "GRC Principles",
      "ISO 27001 Implementation",
      "Sublist3r",
      "Httrprobe",
      "NMAP",
      "OWASP ZAP",
      "Netspaker",
      "API Security Fundamentals",
      "Ethical Hacking Essentials",
      "Digital Forensics Essentials"
    ]
  },
  {
    name: "Nimal",
    title: "( logo designer )",
    bio: "An artist who does paintings with 40+ years of experience (hand paints).",
    skills: ["Hand paint artist", "sculpturer", "40+ years experience"],
  },
  {
    name: "Tharani",
    title: "( Developer )",
    bio: "A fourth year student of Moratuwa University in Sri Lanka (Faculty of IT).",
    skills: [
      "Marketing",
      "Statistics",
      "Python",
      "Java",
      "JavaScript",
      "HTML",
      "CSS",
      "Node.js",
      "Express",
      "PostgreSQL",
      "API",
      "Axios",
      "React",
      "Passport.js",
      "Authentication & Sessions",
      "OAuth",
      "bcrypt & Salt Rounds",
    ],
  },
  {
    name: "Santhushi",
    title: "( Developer )",
    bio: "A fourth year student of SLIT (Faculty of Computer Science).",
    skills: ["Web development", "Java", "Python"],
  },
  {
    name: "Thushal",
    title: "( Figma Designer )",
    bio: "Figma Designer currently completing a course in Java.",
    skills: ["Figma Designing", "Java"],
  },
];

// Owner data
const owner = {
  name: "Pawan Sanklapa",
  title: "( Founder and the Main Developer )",
  bio: "Passionate web designer and full-stack developer leading this agency.",
  skills: [
    "Python",
    "JavaScript",
    "HTML",
    "CSS",
    "Node.js",
    "Express",
    "PostgreSQL",
    "API",
    "Axios",
    "React",
    "Passport.js",
    "Authentication & Sessions",
    "OAuth",
    "bcrypt & Salt Rounds",
    "Learning Machine Learning",
    "Exploring Web3",
  ],
};

function Team() {
  // State for toggling owner's skills
  const [showOwnerSkills, setShowOwnerSkills] = useState(false);

  // State to toggle each team member's skills individually
  // Keys are team member indices, values are booleans (true if showing all skills)
  const [showMemberSkills, setShowMemberSkills] = useState({});

  // Toggle function for team member skills
  const toggleMemberSkills = (index) => {
    setShowMemberSkills((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div>
      <NavBar />
      <WhatsAppButton />
      <BackToTop />
      <div className="team-page">
        <h1 className="team-title">Meet Our Team</h1>

        {/* Owner Section */}
        <section className="owner-section">
          <h2 className="owner-name">{owner.name}</h2>
          <h4 className="owner-title">{owner.title}</h4>
          <p className="owner-bio">{owner.bio}</p>

          <div className="owner-skills">
            <h4>Skills & Expertise:</h4>
            <ul>
              {(showOwnerSkills ? owner.skills : owner.skills.slice(0, 5)).map(
                (skill, index) => (
                  <li key={index} className="skill-item">
                    {skill}
                  </li>
                )
              )}
            </ul>
            {owner.skills.length > 5 && (
              <button
                className="read-more-btn"
                onClick={() => setShowOwnerSkills(!showOwnerSkills)}
              >
                {showOwnerSkills ? "Read less ▲" : "Read more ▼"}
              </button>
            )}
          </div>
        </section>

        {/* Team Members Section */}
        <div className="team-list">
          {teamMembers.map((member, index) => {
            const isShowingAll = showMemberSkills[index] || false;
            const skillsToShow = isShowingAll
              ? member.skills
              : member.skills.slice(0, 5);

            return (
              <div key={index} className="team-member-card">
                <h2 className="owner-name">{member.name}</h2>
                <h4 className="owner-title">{member.title}</h4>
                <p className="owner-bio">{member.bio}</p>

                <div className="owner-skills">
                  <h4>Skills & Expertise:</h4>
                  <ul>
                    {skillsToShow.map((skill, idx) => (
                      <li key={idx} className="skill-item">
                        {skill}
                      </li>
                    ))}
                  </ul>
                  {member.skills.length > 5 && (
                    <button
                      className="read-more-btn"
                      onClick={() => toggleMemberSkills(index)}
                    >
                      {isShowingAll ? "Read less ▲" : "Read more ▼"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Team;
