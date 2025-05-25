import React, { useContext } from 'react';
import  ThemeContext  from '../ThemeContext';
import './styles/ThemeToggle.css';
import { MdLightMode, MdDarkMode } from "react-icons/md";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="toggle-switch">
      <label htmlFor="theme-toggle">
        <input
          type="checkbox"
          id="theme-toggle"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          style={{ display: 'none' }}
          aria-label="Toggle dark mode"
        />
        <span className="slider">
          <MdLightMode className="icon light-icon" />
          <MdDarkMode className="icon dark-icon" />
          <span className="handle"></span>
          <span className="glow"></span>
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;