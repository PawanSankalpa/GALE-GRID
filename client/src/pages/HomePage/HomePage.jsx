import React from "react";
import "./HomePage.css";
// import NavBar from "../../components/NavBar.jsx";
import Hero from "../../components/Hero.jsx";
import Stats from "../../components/Stats.jsx";
import Services from "../../components/Service.jsx";
import WorksCarousel from "../../components/WorksCarousel.jsx";
import AboutMe from "../../components/AboutMe.jsx";
import Pricing from "../../components/Pricing.jsx";
import WhatsAppButton from "../../components/WhatsAppButton.jsx";
import BackToTop from "../../components/BackToTop.jsx";
import Footer from "../../components/Footer.jsx";
import IntroText from "../../components/IntroText.jsx";
import PortfolioSection from "../../components/PortfolioSection.jsx";
import OurTeam from "../../components/OurTeam.jsx";
import RobotServices from "../../components/RobotServices.jsx";

function HomePage() {
    return (
        <div className="HomePage">
            <div className="home-container">
                {/* <NavBar /> */}
                {/* <WhatsAppButton /> */}
                <Hero />
                <Stats />
                <Services />
                <PortfolioSection />
                <IntroText />
                <OurTeam />
                <RobotServices />
                <BackToTop />
                <WorksCarousel />
                <AboutMe />
                <Pricing />
                <Footer />
            </div>
        </div>
    )
}

export default HomePage;