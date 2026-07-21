import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";
import { Lock, MarginBottom } from "@boxicons/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setEmailValid(e.target.validity.valid);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
        
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const canSubmit = email && !isLoading;

  return (
    <div className="auth-page">
      <span className="auth-logo">justPomodoro</span>
      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-header">
            <Lock size="xl" style={{padding : "10px"}}/>
            <h1 className="auth-card__heading">Forgot Your Password?</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <p className="auth-label">Enter your email address</p>
            <input
              className="auth-input"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <button
              className="auth-btn auth-btn--primary"
              type="submit"
              disabled={!canSubmit}
            >
              {isLoading ? "Sending..." : "Reset"}
            </button>
            {error && <p className="auth-error">{error}</p>}
          </form>

          <p className="auth-footer">
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
