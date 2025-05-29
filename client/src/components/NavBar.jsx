import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function NavBar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    axios.get("https://gale-grid-1.onrender.com/api/current_user", { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(err => {
        console.error("Error fetching current user:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const closeMenu = () => setIsActive(false);

  const handleLogout = () => {
    axios.post("https://gale-grid-1.onrender.com/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null);
        closeMenu();
      })
      .catch(err => {
        console.error("Logout failed", err);
      });
  };

  return (
    <nav className="navbar" aria-label="Primary navigation">
      {/* Your logo and menu toggle here */}

      <ul className={`nav-links ${isActive ? "active" : ""}`}>
        <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
        {/* ... other links */}
      </ul>

      <div className="login-register-box">
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          <>
            <span>Welcome, {user.first_name}!</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMenu}>Log in</NavLink>
            <NavLink to="/register" onClick={closeMenu}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
