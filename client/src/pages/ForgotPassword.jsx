import { useState } from "react";
import "./auth.css";
import { Lock, CheckCircle } from "@boxicons/react";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
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
      const res = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error("Something went wrong" || result.message);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const canSubmit = email && !isLoading;

  if (submitted) {
  return (
    <div className="auth-page">
      <span className="auth-logo">justPomodoro</span>
      <div className="auth-center">
        <div className="auth-card">
          <h1 className="auth-card__heading">Check your email</h1>
          <div className="auth-success-message">
            <p className="auth-subtitle">
              We sent a reset link to your email.
            </p>
            <CheckCircle color="green" size="20" />
          </div>
          <p className="auth-footer">
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
  }

  return (
    <div className="auth-page">
      <span className="auth-logo">justPomodoro</span>
      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-header">
            <Lock size="xl" style={{ padding: "10px" }} />
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
