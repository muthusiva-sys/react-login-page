import React, { useEffect, useState } from "react";
import "./Authpage.css";

const USERS_KEY = "kreative_users";
const visualAsset = `${import.meta.env.BASE_URL}colorful_3d_cartoon_animated.gif`;

export default function SignupPage({ onSignupSuccess, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }

  useEffect(() => {
    if (!status) return undefined;

    const timeoutId = window.setTimeout(() => setStatus(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      setStatus({ type: "error", message: "An account with this email already exists." });
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    setStatus({ type: "success", message: "Account created successfully!" });
    window.setTimeout(() => {
      if (onSignupSuccess) onSignupSuccess(newUser);
    }, 1800);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Left visual panel */}
        <div className="auth-visual">
          <img
            src={visualAsset}
            alt="Decorative"
            className="auth-visual-img"
          />
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* <div className="auth-logo">
              <span className="logo-icon">▶</span>
              <span className="logo-text">Kreative</span>
            </div> */}

            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Enter Your Details Below</p>

            {status && (
              <div
                className={`auth-status auth-status-${status.type}`}
                role="status"
                aria-live={status.type === "error" ? "assertive" : "polite"}
              >
                {status.message}
              </div>
            )}

            <label className="field-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="field-input"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="field-input"
              placeholder="hello.alex@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="field-label" htmlFor="password">
              Password
            </label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="field-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={7}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            <p className="password-hint">Use at least 7 characters.</p>

            <label className="field-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="field-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={7}
              required
            />

            <button type="submit" className="btn-login">
              Sign Up
            </button>

            <button type="button" className="btn-google">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.6 5.4C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"/>
              </svg>
              Sign up with Google
            </button>

            <p className="switch-text">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSwitchToLogin) onSwitchToLogin();
                }}
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}