import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../utils/axiosConfig";
import { API_CONFIG } from "../config/api";
import { getStates, getDistricts } from "../data/locations";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  
    const [customState, setCustomState] = useState("");
    const [customDistrict, setCustomDistrict] = useState("");
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const states = getStates();

  useEffect(() => {
        if (selectedState && selectedState !== "Other") {
            setAvailableDistricts(getDistricts(selectedState));
            setSelectedDistrict("");
        } else {
            setAvailableDistricts([]);
            setSelectedDistrict("");
        }
  }, [selectedState]);

    // no city handling required per request

  const getFinalState = () => selectedState === "Other" ? customState : selectedState;
  const getFinalDistrict = () => selectedDistrict === "Other" ? customDistrict : selectedDistrict;
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Input validation
    if (!firstname.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }
    
    if (password !== rePassword) {
      setError("Passwords do not match!");
      return;
    }
    
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
    
    setIsLoading(true);
    
    try {
      // API call to backend
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.USER.ADD, {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        password,
    state: getFinalState().trim(),
    district: getFinalDistrict().trim(),
      });

      if (response.status === 200 || response.status === 201) {
        alert("Registration successful! Please login with your credentials.");
        // Clear form
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setRePassword("");
    setSelectedState("");
    setSelectedDistrict("");
    setCustomState("");
    setCustomDistrict("");
        // Navigate to login page
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

return (
    <div className="login-container">
        <div className="login-box">
            <h2>Register</h2>
            {error && (
                <div style={{
                    color: "red",
                    backgroundColor: "#ffe6e6",
                    borderRadius: "5px",
                    marginBottom: "20px",
                }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <label style={{ color: "black", flex: 1, textAlign: "left" }}>
                        First Name
                        <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                            style={{ width: "100%", boxSizing: "border-box", height: "40px" }}
                        />
                    </label>
                    <label style={{ color: "black", flex: 1, textAlign: "left" }}>
                        Last Name
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                            style={{ width: "100%", boxSizing: "border-box", height: "40px" }}
                        />
                    </label>
                </div>
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
                <label style={{ color: "black", display: "block", textAlign: "left" }}>
                    Re-enter Password
                    <input
                        type="password"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        required
                        style={{ width: "100%", boxSizing: "border-box", height: "40px" }}
                    />
                </label>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <label style={{ color: "black", flex: 1, textAlign: "left" }}>
                        State
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            style={{ width: "100%", boxSizing: "border-box", height: "40px" }}
                        >
                            <option value="">Select State</option>
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        {selectedState === "Other" && (
                            <input
                                type="text"
                                value={customState}
                                onChange={(e) => setCustomState(e.target.value)}
                                placeholder="Enter your state"
                                style={{ width: "100%", boxSizing: "border-box", height: "40px", marginTop: "5px" }}
                            />
                        )}
                    </label>
                    <label style={{ color: "black", flex: 1, textAlign: "left" }}>
                        District
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            disabled={!selectedState}
                            style={{ width: "100%", boxSizing: "border-box", height: "40px" }}
                        >
                            <option value="">Select District</option>
                            {availableDistricts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        {selectedDistrict === "Other" && (
                            <input
                                type="text"
                                value={customDistrict}
                                onChange={(e) => setCustomDistrict(e.target.value)}
                                placeholder="Enter your district"
                                style={{ width: "100%", boxSizing: "border-box", height: "40px", marginTop: "5px" }}
                            />
                        )}
                    </label>
                </div>
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
                    {isLoading ? "Registering..." : "Register"}
                </button>
            </form>
            <div className="register-link">
                <span>Already have an account? </span>
                <Link to="/login">
                <button > 
                    Login
                 </button> 
                </Link>
            </div>
        </div>
    </div>
);
};

export default Register;
