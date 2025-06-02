import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:8000"; ////https://gale-grid-1.onrender.com

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/login/user`,
        {
          username: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      console.log("User logged in:", res.data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const goToHome = () => navigate("/");

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="login-left">
        <h1 className="login-home" onClick={goToHome}>
          <FiArrowLeft color="#00A389" />
        </h1>
        <h1 className="login-title">GALE GRID</h1>
        <img src="/images/login.jpg" alt="login" className="login-img" />
      </div>

      {/* Right Side */}
      <div className="login-right">
        {/* OAuth Buttons */}
        <button className="signup-button-google" onClick={handleGoogleLogin}>
          <img src="/images/google.png" alt="Google" />
          Sign Up with Google
        </button>

        <button className="signup-button-facebook">
          <img src="/images/facebook.png" alt="Facebook" />
          Sign Up with Facebook
        </button>

        <div className="or-divider"><span>OR</span></div>

        <h2 className="login-LOGIN">Log in</h2>

        {/* Error Message */}
        {message && <p className="error-message" style={{ color: "red" }}>{message}</p>}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="off"
          />

          <button className="login-loginButton" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="login-toregister">
            New here?{" "}
            <a href="/register" className="login-anchor1">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
