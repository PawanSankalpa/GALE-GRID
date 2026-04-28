import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth.js";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, loggedIn } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log("[DEBUG] Login component mounted");

  React.useEffect(() => {
    if (loggedIn) {
      console.log("[DEBUG] User already logged in, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [loggedIn, navigate]);

  // Email validation regex (RFC 5322 simplified)
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(trimmedEmail)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!trimmedPassword) {
      newErrors.password = "Password is required";
    } else if (trimmedPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    console.log("[DEBUG] Login form submitted");

    if (!validateForm()) {
      console.log("[DEBUG] Form validation failed", errors);
      return;
    }

    setIsLoading(true);
    const trimmedEmail = formData.email.trim();

    try {
      console.log(`[DEBUG] Attempting login for: ${trimmedEmail}`);
      await login(trimmedEmail, formData.password);
      console.log("[DEBUG] Login successful");
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to login. Please check your credentials.";
      console.error("[DEBUG] Login error:", errorMsg);
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setMessage("Google login remains available in the legacy auth flow.");
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
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              autoComplete="current-password"
              disabled={isLoading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button className="login-loginButton" type="submit" disabled={isLoading || Object.keys(errors).length > 0}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="login-toregister">
            New here?{" "}
            <a href="/register" className="login-anchor1">Register</a>
          </p>
          <p className="login-forgot">
            <a href="#" className="login-anchor1" onClick={(e) => { e.preventDefault(); setMessage("Password reset functionality coming soon"); }}>Forgot password?</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
