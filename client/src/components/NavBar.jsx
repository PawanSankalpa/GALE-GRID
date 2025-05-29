import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./styles/NavBar.css";
import ThemeToggle from "./ThemeToggle";
import axios from "axios"; // Make sure you have axios installed: npm install axios

function NavBar() {
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const closeMenu = () => setIsActive(false);
  
  const handleMenuKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsActive(!isActive);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://gale-grid-1.onrender.com/logout", {}, { withCredentials: true });
      setUser(null);
      closeMenu();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("https://gale-grid-1.onrender.com/api/current_user", {
          withCredentials: true, // very important for cookies
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching current user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="logo">
        <NavLink to="/" onClick={closeMenu}>
          <img src="/images/logo5.png" alt="GaleGrid logo" />
        </NavLink>
      </div>

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

      <ul className={`nav-links ${isActive ? "active" : ""}`}>
        <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
        <li><NavLink to="/services" onClick={closeMenu}>Services</NavLink></li>
        <li><NavLink to="/team" onClick={closeMenu}>Our Team</NavLink></li>
        <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
        <li><NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink></li>
      </ul>

      <div className="ThemeToggle">
        <ThemeToggle />
      </div>

      {/* <div className="login-register-box">
        {loading ? (
          <div className="nav-loading-placeholder" />
        ) : user ? (
          <>
            <span className="nav-welcome">Welcome, {user.first_name}!</span>
            <button onClick={handleLogout} className="nav-logout">Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-login" onClick={closeMenu}>Log in</NavLink>
            <NavLink to="/register" className="nav-register" onClick={closeMenu}>Register</NavLink>
          </>
        )}
      </div> */}
    </nav>
  );
}

export default NavBar;
