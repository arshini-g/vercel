import React, { useState } from "react";
import Axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegister type="login" />} />
        <Route path="/register" element={<LoginRegister type="register" />} />
        <Route path="/dashboard/:username" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

// Landing page component
function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Welcome to the Task Management System</h1>
      <div>
        <button onClick={() => window.location.href = "/login"}>Login</button>
      </div>
      <div>
        <button onClick={() => window.location.href = "/register"}>Register</button>
      </div>
    </div>
  );
}

function LoginRegister({ type }) {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Registration function
  const register = () => {
    Axios.post("http://localhost:5000/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      if (response.data.message) {
        // Redirect to login after successful registration
        window.location.href = "/login";
      } else {
        setErrorMessage("Registration failed.");
      }
    }).catch((err) => {
      if (err.response) {
        setErrorMessage(err.response.data.error || "Registration failed.");
      } else {
        setErrorMessage("Error connecting to the backend or Express server.");
      }
    });
  };

  // Login function
  const login = () => {
    Axios.post("http://localhost:5000/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.tasks) {
        // Store user information in session
        navigate(`/dashboard/${username}`);
      } else {
        setErrorMessage("Invalid username or password.");
      }
    }).catch((err) => {
      if (err.response) {
        setErrorMessage(err.response.data.error || "Login failed.");
      } else {
        setErrorMessage("Error connecting to the backend or Express server.");
      }
    });
  };

  // Logout function
  const logout = () => {
    Axios.get("http://localhost:5000/logout").then(() => {
      navigate("/"); // Redirect to landing page after logout
    });
  };

  return (
    <div className="App app-container">
      {type === "register" ? (
        <div className="registration">
          <h1>Registration</h1>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username..."
            onChange={(e) => setUsernameReg(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password..."
            onChange={(e) => setPasswordReg(e.target.value)}
          />
          <button onClick={register}>Register</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      ) : (
        <div className="login">
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Username..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      )}

      {/* Logout Button */}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default App;
