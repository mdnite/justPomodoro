import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";
import { Lock, MarginBottom } from "@boxicons/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

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

  const canSubmit = password && confirmPassword && !isLoading;

  return (
    <div className="auth-page">
      <span className="auth-logo">justPomodoro</span>
      <div className="auth-center">
        <div className="auth-card">
          <h1 className="auth-card__heading">Reset Password</h1>

          <form onSubmit={handleSubmit}>
            <p className="auth-label">Enter your new password</p>
            <input
              className="auth-input"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              className="auth-btn auth-btn--primary"
              type="submit"
              disabled={!canSubmit}
            >
              {isLoading ? 'Resetting...' : 'Reset password'}
            </button>
            {error && <p className="auth-error">{error}</p>}
          </form>

          <p className="auth-footer">
            Remember your password? <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
