import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "http://localhost:8000";

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

    try {
      const response = await axios.post(
        `${API_URL}/login/user`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Signin successfully!", response.data);
      goToHome();
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
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
            window.location.href = "http://localhost:8000/auth/google";
          }}
        >
          {" "}
          {/* Changed classname */}
          <img src="/images/google.png" alt="google logo" />
          SignUp with google
        </button>
        <button className="signup-button-facebook">
          {" "}
          {/* Changed classname */}
          <img src="/images/facebook.png" alt="facebook logo" />
          SignUp with facebook
        </button>
        <br />

        <div className="or-divider">
          <span>OR</span>
        </div>

        <br />
        <h2 className="login-LOGIN">Log in</h2>

        {message && (
          <p className="error-message" style={{ color: "red" }}>
            {message}
          </p>
        )}
        <br />
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

          <button className="login-loginButton" type="submit">
            Login
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
