import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "http://localhost:8000"; //https://gale-grid-1.onrender.com

  function goToHome() {
    navigate("/");
  }

  function goToLogin() {
    navigate("/login");
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
      const response = await axios.post(`${API_URL}/register/user`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("Signup successfully!", response.data);
      goToLogin();
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
    <div className="register-container">
      <div className="register-left">
        <h1 className="register-home" onClick={goToHome}>
          <FiArrowLeft color="#00A389" />
        </h1>
        <h1 className="register-title">GALE GRID</h1>
        <img
          src="/images/register.jpg"
          alt="register"
          className="register-img"
        />
      </div>

      <div className="register-right">

        <button
          className="signup-button-google"
          type="submit"
          onClick={() => {
            window.location.href = "https://gale-grid-1.onrender.com/auth/google";
          }}
        >
          {" "}
          {/* Changed classname */}
          <img src="/images/google.png" alt="google logo" />
          SignUp with google
        </button>

        <button className="signup-button-facebook" type="submit">
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
        <h2 className="register-REGISTER">Register</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
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

          <button className="register-registerButton" type="submit">
            Register
          </button>

          <p className="register-tologin">
            Already have an acc?{" "}
            <a href="/login" className="register-anchor1">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
