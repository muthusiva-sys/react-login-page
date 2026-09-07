import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

export default function App() {
  const [view, setView] = useState("login"); // "login" | "signup"

  return view === "login" ? (
    <LoginPage
      onSwitchToSignup={() => setView("signup")}
      onLoginSuccess={(user) => console.log("Logged in:", user)}
    />
  ) : (
    <SignupPage
      onSwitchToLogin={() => setView("login")}
      onSignupSuccess={() => setView("login")}
    />
  );
}