import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import Dashboard from "./Dashboard";
import Overview from "./crm/Overview";
import Leads from "./crm/Leads";
import Contacts from "./crm/Contacts";
import Pipeline from "./crm/Pipeline";
import Tasks from "./crm/Tasks";

const SESSION_KEY = "kreative_session";

function getSavedUser() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const [user, setUser] = useState(getSavedUser);
  const navigate = useNavigate();

  const handleLoginSuccess = (loggedInUser) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage
              onSwitchToSignup={() => navigate("/register")}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          <SignupPage
            onSwitchToLogin={() => navigate("/login")}
            onSignupSuccess={() => navigate("/login")}
          />
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview user={user} />} />
        <Route path="leads" element={<Leads user={user} />} />
        <Route path="contacts" element={<Contacts user={user} />} />
        <Route path="pipeline" element={<Pipeline user={user} />} />
        <Route path="tasks" element={<Tasks user={user} />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  );
}
