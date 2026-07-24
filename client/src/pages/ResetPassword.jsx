import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./auth.css";
import { CheckShield, Lock, MarginBottom } from "@boxicons/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
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
      const res = await fetch(`${backendUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(res.message || "Something went wrong");

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const passwordMatch = password === confirmPassword;
  const canSubmit = password && confirmPassword && passwordMatch && !isLoading;

  if (submitted) {
    return (
      <div className="auth-page">
        <span className="auth-logo">justPomodoro</span>
        <div className="auth-center">
          <div className="auth-card">
            <div className="auth-reset-success">
              <CheckShield color="green" size="2xl" />
              <h1 className="auth-card__heading">Password Reset</h1>
              <p className="auth-subtitle">
                Your password has been reset successfully.
              </p>
            </div>
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
          <h1 className="auth-card__heading">Reset Password</h1>

          <form onSubmit={handleSubmit}>
            <p className="auth-label">Enter your new password</p>
            <input
              className={`auth-input ${
                confirmPassword && !passwordMatch ? "auth-input-error" : ""
              } ${
                confirmPassword && passwordMatch ? "auth-input-success" : ""
              }`}
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="auth-label">Confirm password</p>
            <input
              className={`auth-input ${
                confirmPassword && !passwordMatch ? "auth-input-error" : ""
              } ${
                confirmPassword && passwordMatch ? "auth-input-success" : ""
              }`}
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && !passwordMatch && (
              <p className="auth-error">
                Password and Confirm Password does not match.
              </p>
            )}
            <button
              className="auth-btn auth-btn--primary"
              type="submit"
              disabled={!canSubmit}
            >
              {isLoading ? "Resetting..." : "Reset password"}
            </button>
            {error && <p className="auth-error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
