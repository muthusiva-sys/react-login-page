import React, { useEffect, useRef, useState } from "react";
import "./Authpage.css";

const USERS_KEY = "kreative_users";
const GOOGLE_CLIENT_ID = "608268244023-96cpnskijcol74afi7h38mag62k5nfoj.apps.googleusercontent.com";
const visualAsset = `${import.meta.env.BASE_URL}colorful_3d_cartoon_animated.gif`;

function decodeJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((character) => `%${("00" + character.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export default function SignupPage({ onSignupSuccess, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (!status) return undefined;

    const timeoutId = window.setTimeout(() => setStatus(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [status]);

  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "signup_with",
      });
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = window.setInterval(() => {
        if (window.google) {
          window.clearInterval(interval);
          initGoogle();
        }
      }, 100);
      return () => window.clearInterval(interval);
    }
  }, []);

  const handleGoogleResponse = (response) => {
    try {
      const payload = decodeJwt(response.credential);
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const user = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub,
        provider: "google",
      };
      const existingIndex = users.findIndex(
        (item) => item.email.toLowerCase() === payload.email.toLowerCase()
      );

      if (existingIndex >= 0) users[existingIndex] = { ...users[existingIndex], ...user };
      else users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      setStatus({ type: "success", message: "Google account connected!" });
      window.setTimeout(() => {
        if (onSignupSuccess) onSignupSuccess(user);
      }, 1200);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Google sign-up failed." });
    }
  };

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

            <div ref={googleButtonRef} className="google-btn-container"></div>

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