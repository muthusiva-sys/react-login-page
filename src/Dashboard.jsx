import React, { useState } from "react";
import Header from "./Header";
import "./Authpage.css";

const INITIAL_TASKS = [
  { id: 1, title: "Practice controlled inputs", done: false },
  { id: 2, title: "Read localStorage data", done: false },
  { id: 3, title: "Try dashboard todo actions", done: true },
];

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [taskText, setTaskText] = useState("");

  const remainingTasks = tasks.filter((task) => !task.done).length;

  const handleAddTask = () => {
    const title = taskText.trim();

    if (!title) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now(), title, done: false },
    ]);
    setTaskText("");
  };

  const handleTaskListClick = (event) => {
    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) return;

    const taskId = Number(actionButton.dataset.taskId);
    const action = actionButton.dataset.action;

    if (action === "delete-task") {
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
      return;
    }

    if (action === "toggle-task") {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, done: !task.done } : task
        )
      );
    }
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
              <div className="todo-panel-header">
                <div>
                  <h2>Dashboard Todo List</h2>
                  <p className="dashboard-copy">
                    {remainingTasks} pending, {tasks.length - remainingTasks} completed
                  </p>
                </div>
              </div>

              <div className="dashboard-todo-add">
                <input
                  type="text"
                  className="dashboard-todo-input"
                  placeholder="Add a new todo"
                  value={taskText}
                  onChange={(event) => setTaskText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddTask();
                    }
                  }}
                />
                <button type="button" className="dashboard-todo-add-btn" onClick={handleAddTask}>
                  Add
                </button>
              </div>

              <p className="dashboard-copy">
                Todo clicks are handled by one event delegation handler on the list.
              </p>

              {tasks.length > 0 ? (
                <ul className="task-list" onClick={handleTaskListClick}>
                  {tasks.map((task) => (
                    <li className={`task-item${task.done ? " is-done" : ""}`} key={task.id}>
                      <button
                        type="button"
                        className="task-toggle"
                        data-action="toggle-task"
                        data-task-id={task.id}
                        aria-label={task.done ? "Mark todo pending" : "Mark todo complete"}
                      >
                        {task.done ? "Done" : "Todo"}
                      </button>
                      <div className="task-content">
                        <strong>{task.title}</strong>
                        <span>{task.done ? "Completed" : "Pending"}</span>
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
