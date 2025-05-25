import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./styles/NavBar.css"; 
import { useNavigate } from "react-router-dom";

function NavBar() {

  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);

  const closeMenu = () => {
    setIsActive(false);
  };

  function goToRegister(){
    navigate("/register")
  }

  function goToLogin(){
    navigate("/login")
  }

  function goToServices(){
    navigate("/services")
  }

  function goToTeam(){
    navigate("/Team")
  }

  function goToContact(){
    navigate("/contact")
  }

  return (
    <nav className="navbar">
      <div className="logo">
        {/* Using NavLink for consistency, though Link would also work here */}
        <NavLink to="/" onClick={closeMenu}>
          <img src="images/logo5.png" alt="GaleGrid" />
        </NavLink>
      </div>

      {/* Hamburger Menu Toggle */}
      <div
        className={`menu-toggle ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(!isActive)}
        aria-label="Toggle navigation menu" // Accessibility improvement
        role="button" // Indicate it's an interactive element
        tabIndex="0" // Make it focusable
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${isActive ? "active" : ""}`}>
        <li>
          {/* NavLink automatically applies 'active' class when path matches */}
          <NavLink to="/" onClick={closeMenu} end> {/* 'end' prop for exact match on '/' */}
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" onClick={goToServices}>
            Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/team" onClick={goToTeam}>
            Our Team
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={goToContact}>
            Contact
          </NavLink>
        </li>
      </ul>

      <div className="login-register-boc">
        <button className="nav-login" onClick={goToLogin}>Log in</button>
        <button className="nav-register" onClick={goToRegister}>Register</button>
      </div>
      
    </nav>
  );
}

export default NavBar;
