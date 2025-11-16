import React, { useState, useContext } from "react";

import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../contexts/MyContext";
import apiClient from "../utils/axiosConfig";
import { API_CONFIG } from "../config/api";
import { setToken } from "../utils/tokenUtils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useContext(MyContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Input validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Send login request
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.USER.LOGIN, {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.status === 200) {
        const userData = response.data;

        // Save JWT token
        if (userData.token) {
          setToken(userData.token);
        }

        // Save user details in context (exclude password and token)
        setUser({
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
          id: userData.id,
        });

        // Clear form
        setEmail("");
        setPassword("");
        // Navigate to home page
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          "Invalid credentials. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && (
          <div style={{
            color: "red",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #ffcccc"
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label style={{ color: "black", display: "block", textAlign: "left" }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", boxSizing: "border-box", height: "40px" }}
            />
          </label>
          <label style={{ color: "black", display: "block", textAlign: "left" }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", boxSizing: "border-box", height: "40px" }}
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              height: "40px",
              boxSizing: "border-box",
              marginTop: "10px",
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="register-link">
          <span>Don't have an account? </span>
          <Link to="/register"><button type="button">
            Register as new user
          </button></Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
