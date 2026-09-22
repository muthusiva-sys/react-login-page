import React, { useEffect, useState, useRef } from "react";
import "./Authpage.css";

const USERS_KEY = "kreative_users";
const GOOGLE_CLIENT_ID = "608268244023-96cpnskijcol74afi7h38mag62k5nfoj.apps.googleusercontent.com";
const visualAsset = `${import.meta.env.BASE_URL}colorful_3d_cartoon_animated.gif`;

// Decode the JWT credential Google sends back
function decodeJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export default function LoginPage({ onLoginSuccess, onSwitchToSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }
  const [loading, setLoading] = useState(false);
  const [todoText, setTodoText] = useState("");
  const [loginTodos, setLoginTodos] = useState([
    { id: 1, text: "Register a new user", done: false },
    { id: 2, text: "Login with saved details", done: false },
    { id: 3, text: "Open the dashboard", done: false },
  ]);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (!status) return undefined;

    const timeoutId = window.setTimeout(() => setStatus(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [status]);

  // Init Google Identity Services once the script has loaded
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      // Renders Google's own styled button into the hidden container
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "signin_with",
      });
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  const handleGoogleResponse = (response) => {
    try {
      const payload = decodeJwt(response.credential);
      // payload contains: email, name, picture, sub (google user id), etc.

      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      let user = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());

      if (!user) {
        user = {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          googleId: payload.sub,
          provider: "google",
        };
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      setStatus({ type: "success", message: "Login successful!" });
      window.setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(user);
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Google sign-in failed." });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setStatus({ type: "error", message: "Please fill all fields." });
      return;
    }

    if (!email.includes("@")) {
      setStatus({ type: "error", message: "Please enter a valid email." });
      return;
    }

    if (password.length < 7) {
      setStatus({ type: "error", message: "Password must be at least 7 characters." });
      return;
    }

    setLoading(true);

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (match) {
      setStatus({ type: "success", message: "Login successful!" });
      window.setTimeout(() => {
        setLoading(false);
        if (onLoginSuccess) onLoginSuccess(match);
      }, 1800);
    } else {
      setLoading(false);
      setStatus({ type: "error", message: "Invalid email or password." });
    }
  };

  const handleAddTodo = () => {
    const text = todoText.trim();

    if (!text) return;

    setLoginTodos((currentTodos) => [
      ...currentTodos,
      { id: Date.now(), text, done: false },
    ]);
    setTodoText("");
  };

  const handleTodoAction = (event) => {
    const button = event.target.closest("[data-todo-action]");

    if (!button) return;

    const todoId = Number(button.dataset.todoId);
    const action = button.dataset.todoAction;

    if (action === "delete") {
      setLoginTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
      return;
    }

    if (action === "toggle") {
      setLoginTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === todoId ? { ...todo, done: !todo.done } : todo
        )
      );
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-visual">
          <img
            src={visualAsset}
            alt="Colorful 3D animated artwork"
            className="auth-visual-img"
          />
        </div>

        <div className="auth-form-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h1 className="auth-title">Welcome Back!</h1>
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

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>

            {/* Google renders its own button inside this div */}
            <div ref={googleButtonRef} className="google-btn-container"></div>

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

            <section className="login-todo-card" aria-labelledby="login-todo-title">
              <div className="login-todo-header">
                <h2 id="login-todo-title">Login Todo</h2>
                <span>{loginTodos.filter((todo) => !todo.done).length} left</span>
              </div>

              <div className="login-todo-add">
                <input
                  type="text"
                  className="login-todo-input"
                  placeholder="Add login task"
                  value={todoText}
                  onChange={(e) => setTodoText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTodo();
                    }
                  }}
                />
                <button type="button" className="login-todo-add-btn" onClick={handleAddTodo}>
                  Add
                </button>
              </div>

              {loginTodos.length > 0 ? (
                <ul className="login-todo-list" onClick={handleTodoAction}>
                  {loginTodos.map((todo) => (
                    <li className={`login-todo-item${todo.done ? " is-done" : ""}`} key={todo.id}>
                      <button
                        type="button"
                        className="login-todo-check"
                        data-todo-action="toggle"
                        data-todo-id={todo.id}
                        aria-label={todo.done ? "Mark todo pending" : "Mark todo done"}
                      >
                        {todo.done ? "Done" : "Todo"}
                      </button>
                      <span>{todo.text}</span>
                      <button
                        type="button"
                        className="login-todo-delete"
                        data-todo-action="delete"
                        data-todo-id={todo.id}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="login-todo-empty">No login tasks now.</p>
              )}
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
