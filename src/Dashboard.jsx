import React, { useState } from "react";
import Header from "./Header";
import "./Authpage.css";

const INITIAL_TASKS = [
  { id: 1, title: "Practice controlled inputs", owner: "Muthu" },
  { id: 2, title: "Read localStorage data", owner: "React Auth" },
  { id: 3, title: "Try event delegation delete", owner: "Dashboard" },
];

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleTaskListClick = (event) => {
    const deleteButton = event.target.closest("[data-action='delete-task']");

    if (!deleteButton) return;

    const taskId = Number(deleteButton.dataset.taskId);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  return (
    <main className="portfolio-page">
      <Header />

      <section className="dashboard-shell">
        <div className="dashboard-card">
          <div className="dashboard-topbar">
            <div>
              <p className="dashboard-eyebrow">React Auth Practice</p>
              <h1>Welcome, {user?.name || "User"}!</h1>
            </div>

            <button type="button" className="btn-login dashboard-logout" onClick={onLogout}>
              Logout
            </button>
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-panel">
              <h2>Your Session</h2>
              <p className="dashboard-copy">
                You are logged in using sessionStorage. Closing the tab/session clears this
                practice login.
              </p>

              <div className="user-box">
                <span>Name</span>
                <strong>{user?.name || "Not available"}</strong>
              </div>
              <div className="user-box">
                <span>Email</span>
                <strong>{user?.email}</strong>
              </div>
            </section>

            <section className="dashboard-panel">
              <h2>Practice Tasks</h2>
              <p className="dashboard-copy">
                Delete buttons are handled by one click handler on the list.
              </p>

              {tasks.length > 0 ? (
                <ul className="task-list" onClick={handleTaskListClick}>
                  {tasks.map((task) => (
                    <li className="task-item" key={task.id}>
                      <div>
                        <strong>{task.title}</strong>
                        <span>{task.owner}</span>
                      </div>
                      <button
                        type="button"
                        className="task-delete"
                        data-action="delete-task"
                        data-task-id={task.id}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">All tasks deleted. Nice.</p>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
