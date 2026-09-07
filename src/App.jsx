import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

export default function App() {
  const [view, setView] = useState("login"); // "login" | "signup"
  const [user, setUser] = useState(null);

  if (user) {
    return (
      <main className="welcome-page">
        <section className="welcome-card">
          <span className="welcome-mark">✓</span>
          <p className="welcome-eyebrow">KREATIVE SPACE</p>
          <h1>Welcome, {user.name || user.email.split("@")[0]}.</h1>
          <p className="welcome-copy">Your account is ready. This is your new inside page.</p>
          <button type="button" className="btn-login" onClick={() => setUser(null)}>
            Log out
          </button>
        </section>
      </main>
    );
  }

  return view === "login" ? (
    <LoginPage
      onSwitchToSignup={() => setView("signup")}
      onLoginSuccess={setUser}
    />
  ) : (
    <SignupPage
      onSwitchToLogin={() => setView("login")}
      onSignupSuccess={() => setView("login")}
    />
  );
}