import React, { useState } from "react";
import "./Authpage.css";

const USERS_KEY = "kreative_users";
const visualAsset = `${import.meta.env.BASE_URL}colorful_3d_cartoon_animated.gif`;

export default function LoginPage({ onLoginSuccess, onSwitchToSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (match) {
      setStatus({ type: "success", message: "Login successful!" });
      if (onLoginSuccess) onLoginSuccess(match);
    } else {
      setStatus({ type: "error", message: "Invalid email or password." });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Left visual panel */}
        <div className="auth-visual">
          <img
            src={visualAsset}
            alt="Colorful 3D animated artwork"
            className="auth-visual-img"
          />
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* <div className="auth-logo">
              <span className="logo-icon">▶</span>
              <span className="logo-text"></span>
            </div> */}

            <h1 className="auth-title">Welcome Back!</h1>
            <p className="auth-subtitle">Enter Your Details Below</p>

            {status && (
              <div
                className={`auth-status auth-status-${status.type}`}
                role={status.type === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {status.message}
              </div>
            )}

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

            <div className="form-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-login">
              Log in
            </button>

            <button type="button" className="btn-google">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.6 5.4C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"/>
              </svg>
              Log in with Google
            </button>

            <p className="switch-text">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSwitchToSignup) onSwitchToSignup();
                }}
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}