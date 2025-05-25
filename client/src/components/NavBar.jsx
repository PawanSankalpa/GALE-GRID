import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./styles/NavBar.css"; 
import ThemeToggle from "./ThemeToggle";

function NavBar() {
  const [isActive, setIsActive] = useState(false);

  const closeMenu = () => {
    setIsActive(false);
  };

  // Keyboard handler for hamburger menu toggle
  const handleMenuKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsActive(!isActive);
    }
  };

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="logo">
        <NavLink to="/" onClick={closeMenu} end>
          <img src="images/logo5.png" alt="GaleGrid logo" />
        </NavLink>
      </div>

      {/* Hamburger Menu Toggle */}
      <div
        className={`menu-toggle ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(!isActive)}
        onKeyDown={handleMenuKeyDown}
        aria-label="Toggle navigation menu"
        role="button"
        tabIndex={0}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${isActive ? "active" : ""}`}>
        <li>
          <NavLink to="/" onClick={closeMenu} end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" onClick={closeMenu}>
            Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/team" onClick={closeMenu}>
            Our Team
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
        </li>
      </ul>

      <div className="ThemeToggle">
        <ThemeToggle />
      </div>
      
      <div className="login-register-box">
        <NavLink to="/login" className="nav-login" onClick={closeMenu}>
          Log in
        </NavLink>
        <NavLink to="/register" className="nav-register" onClick={closeMenu}>
          Register
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
