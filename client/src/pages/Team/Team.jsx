import React from 'react';
import './Team.css';

import OurTeam from '../../components/OurTeam';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const Team = () => {
  return (
    <section className="team-page-section">
        <NavBar />
      <OurTeam />
      <Footer />
      
    </section>
  );
};

export default Team;
