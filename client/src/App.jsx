import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
// import Register from "./pages/RegisterPage/register";
import Login from "./pages/LoginPage/Login";

// import Contact from "./pages/ContactPage/ContactPage";
import Dashboard from "./pages/Dashboard/Dashboard";
// import OurWork from "./pages/OurWorkPage/OurWork";
// import PricingPage from "./pages/PricingPage/PricingPage";
// import Services from "./pages/ServicesPage/Services";
// import Team from "./pages/Team/Team";





function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ourWork" element={<OurWork />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/Team" element={<Team />} />
          <Route path="/dashboard" element={<Dashboard />} /> */}
          
        </Routes>
    </>
  );
}

export default App;
