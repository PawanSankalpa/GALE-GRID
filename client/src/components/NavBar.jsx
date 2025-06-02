import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./styles/NavBar.css";
import ThemeToggle from "./ThemeToggle";
import axios from "axios"; // Make sure you have axios installed: npm install axios
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

function NavBar() {
  const [isActive, setIsActive] = useState(false);

  const { loggedIn, username } = useContext(AuthContext);
  const { setLoggedIn, setUsername } = useContext(AuthContext);

  const closeMenu = () => setIsActive(false);

  const handleMenuKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsActive(!isActive);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://gale-grid-1.onrender.com/logout/logout", {}, { withCredentials: true }); //https://gale-grid-1.onrender.com/logout
      setLoggedIn(null);
      setUsername("");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
        <li>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" onClick={closeMenu}>
            Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/ourWork" onClick={closeMenu}>
            Portfolio
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
        <li>
          <NavLink to="/dashboard" onClick={closeMenu}>
            Dashboard
          </NavLink>
        </li>
      </ul>

      <div className="ThemeToggle">
        <ThemeToggle />
      </div>

      {/* <div className="login-register-box">
        {loggedIn ? (
          <div className="nav-logged-in">
            <div className="nav-loading-placeholder" />
            <span className="nav-welcome">Welcome, {username}!</span>
            <button onClick={handleLogout} className="nav-logout">
              Log out
            </button>
          </div>
        ) : (
          <>
            <NavLink to="/login" className="nav-login" onClick={closeMenu}>
              Log in
            </NavLink>
            <NavLink
              to="/register"
              className="nav-register"
              onClick={closeMenu}
            >
              Register
            </NavLink>
          </>
        )}
      </div> */}
    </nav>
  );
}

export default NavBar;
