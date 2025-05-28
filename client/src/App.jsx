import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Register from "./pages/RegisterPage/register";
import Login from "./pages/LoginPage/Login";
import Services from "./pages/ServicesPage/Services";
import Contact from "./pages/ContactPage/ContactPage";
import Team from "./pages/TeamPage/Team";
import Dashboard from "./pages/Dashboard/Dashboard";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </>
  );
}

export default App;
