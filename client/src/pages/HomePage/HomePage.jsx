import React from "react";
import "./HomePage.css";
// import NavBar from "../../components/NavBar.jsx";
import Hero from "../../components/Hero.jsx";
import Stats from "../../components/Stats.jsx";
import Services from "../../components/Service.jsx";
import WorksCarousel from "../../components/WorksCarousel.jsx";
import AboutMe from "../../components/AboutMe.jsx";
import WhatsAppButton from "../../components/WhatsAppButton.jsx";
import BackToTop from "../../components/BackToTop.jsx";
import Footer from "../../components/Footer.jsx";
import IntroText from "../../components/IntroText.jsx";
import PortfolioSection from "../../components/PortfolioSection.jsx";
import OurTeam from "../../components/OurTeam.jsx";
import RobotServices from "../../components/RobotServices.jsx";
// import Process from "../../components/Process.jsx";
import PricingSection from "../../components/PricingSection.jsx";
import ServicesSection from "../../components/ServicesSection.jsx";
import FAQ from "../../components/FAQ.jsx";
import CTA from "../../components/CTA.jsx";
import Process from "../../components/Process1.jsx";
import Process2 from "../../components/Process2.jsx";
import Process3 from "../../components/Process3.jsx";
import FloatingShowcase from "../../components/FloatingShowcase.jsx";
// import AchievementsSection from "../../components/AchievementsSection.jsx";
import ReviewsSection from "../../components/Reviews.jsx";
import WhyUs from "../../components/WhyUs.jsx";




function HomePage() {
    return (
        <div className="HomePage">
            <div className="home-container">
                <Hero />
                <div className="main-content-bg">
                  <FloatingShowcase />
                  {/* <AchievementsSection /> */}
                  <PortfolioSection />
                  
                  <WhyUs />
                  
                  <Process3 />
                  <IntroText />
                  <PricingSection />
                  <Stats />
                    <ReviewsSection />
                  
                  {/* <ServicesSection /> */}
                  <FAQ />
                  <CTA />
                  <Footer />
                </div>
            </div>
        </div>
    )
}

export default HomePage;