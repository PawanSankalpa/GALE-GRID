import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import "./styles/NavBar.css";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext"; // make sure this path is correct
import axios from "axios";

const API_BASE_URL = "https://gale-grid-1.onrender.com";

function NavBar() {
  const [isActive, setIsActive] = useState(false);
  const { user, loading, refreshUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
      refreshUser(); // refresh user state after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const closeMenu = () => setIsActive(false);
  const handleMenuKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsActive(!isActive);
    }
  };

  if (loading) return <div>Loading...</div>; // optional loading state UI

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

      {!loading && (
        <div className="login-register-box">
          {user ? (
            <>
              <span className="nav-welcome">Welcome, {user.first_name}!</span>
              <button onClick={handleLogout} className="nav-logout">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-login" onClick={closeMenu}>
                Log in
              </NavLink>
              <NavLink to="/register" className="nav-register" onClick={closeMenu}>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
