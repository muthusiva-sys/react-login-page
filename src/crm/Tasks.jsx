import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { addActivity, createRecord, getAll, removeRecord, updateRecord } from "./store";

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [leadId, setLeadId] = useState("");

  useEffect(() => {
    if (!user?.email) {
      setTasks([]);
      setLeads([]);
      return;
    }

    setTasks(getAll(user.email, "tasks", []));
    setLeads(getAll(user.email, "leads", []));
  }, [user?.email]);

  const orderedTasks = useMemo(
    () => [...tasks].sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0)),
    [tasks]
  );

  const refreshTasks = () => setTasks(getAll(user.email, "tasks", []));

  const handleCreateTask = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    createRecord(user.email, "tasks", {
      title: trimmedTitle,
      done: false,
      dueDate: dueDate || new Date().toISOString(),
      leadId: leadId || undefined,
    });

    addActivity(user.email, "task", `Task created: ${trimmedTitle}`);
    setTitle("");
    setDueDate("");
    setLeadId("");
    refreshTasks();
  };

  const handleToggleTask = (task) => {
    const nextDone = !task.done;
    updateRecord(user.email, "tasks", task.id, { done: nextDone, updatedAt: new Date().toISOString() });
    refreshTasks();

    if (nextDone) {
      addActivity(user.email, "task", `Task completed: ${task.title}`);
    }
  };

  const handleDeleteTask = (taskId, taskTitle) => {
    const confirmed = window.confirm(`Delete task "${taskTitle}"?`);
    if (!confirmed) return;

    removeRecord(user.email, "tasks", taskId);
    addActivity(user.email, "task", `Task deleted: ${taskTitle}`);
    refreshTasks();
  };

  return (
    <motion.section
      className="crm-page"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <header className="crm-page-header">
        <div>
          <h1>Tasks</h1>
          <p>Keep your pipeline and follow-ups moving.</p>
        </div>
      </header>

      <div className="crm-panel">
        <form className="crm-toolbar" onSubmit={handleCreateTask}>
          <div style={{ flex: "2 1 200px" }}>
            <label className="crm-form-field">
              <span>Task title</span>
              <input
                className="crm-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Follow up on proposal"
              />
            </label>
          </div>

          <div style={{ flex: "1 1 150px" }}>
            <label className="crm-form-field">
              <span>Due date</span>
              <input
                className="crm-input"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </label>
          </div>

          <div style={{ flex: "1 1 180px" }}>
            <label className="crm-form-field">
              <span>Linked lead</span>
              <select className="crm-select" value={leadId} onChange={(event) => setLeadId(event.target.value)}>
                <option value="">No lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="crm-form-btn" style={{ alignSelf: "flex-end" }}>
            Add Task
          </button>
        </form>
      </div>

      {orderedTasks.length > 0 ? (
        <div className="crm-task-list">
          {orderedTasks.map((task) => {
            const linkedLead = leads.find((lead) => lead.id === task.leadId);

            return (
              <div key={task.id} className={`crm-task-item ${task.done ? "is-done" : ""}`}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggleTask(task)}
                  aria-label={`Toggle task ${task.title}`}
                />

                <div className="crm-task-content">
                  <strong>{task.title}</strong>
                  <div className="crm-task-meta">
                    <span>{task.done ? "Completed" : "Open"}</span>
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                    {linkedLead ? <span>Lead: {linkedLead.name}</span> : null}
                  </div>
                </div>

                <button
                  type="button"
                  className="crm-badge-btn danger"
                  onClick={() => handleDeleteTask(task.id, task.title)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="crm-empty-state">No tasks yet. Add a follow-up to stay on track.</div>
      )}
    </motion.section>
  );
}
