import React from "react";
import "./HomePage.css";
import Hero from "../../components/Hero.jsx";

import Footer from "../../components/Footer.jsx";
import PortfolioSection from "../../components/PortfolioSection.jsx";
import PricingSection from "../../components/PricingSection.jsx";
import FAQ from "../../components/FAQ.jsx";
import CTA from "../../components/CTA.jsx";
import Process3 from "../../components/Process3.jsx";
import FloatingShowcase from "../../components/FloatingShowcase.jsx";
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
                  <PricingSection />
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