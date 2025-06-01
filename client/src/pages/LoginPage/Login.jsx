import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setUser, setLoggedIn } = useAuth(); // Access AuthContext functions

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://gale-grid-1.onrender.com";

  function goToHome() {
    navigate("/");
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/login/user`,
        {
          username: formData.email, // ✅ backend expects 'username' (not 'email')
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      const userData = response.data.user;
      setUser(userData);
      setLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-home" onClick={goToHome}>
          <FiArrowLeft color="#00A389" />
        </h1>
        <h1 className="login-title">GALE GRID</h1>
        <img src="/images/login.jpg" alt="login" className="login-img" />
      </div>

      <div className="login-right">
        <button
          className="signup-button-google"
          onClick={() => {
            window.location.href = `${API_URL}/auth/google`;
          }}
        >
          <img src="/images/google.png" alt="google logo" />
          SignUp with Google
        </button>

        <button className="signup-button-facebook">
          <img src="/images/facebook.png" alt="facebook logo" />
          SignUp with Facebook
        </button>

        <div className="or-divider">
          <span>OR</span>
        </div>

        <h2 className="login-LOGIN">Log in</h2>

        {message && (
          <p className="error-message" style={{ color: "red" }}>
            {message}
          </p>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            autoComplete="off"
          />

          <button className="login-loginButton" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="login-toregister">
            New Here?{" "}
            <a href="/register" className="login-anchor1">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
