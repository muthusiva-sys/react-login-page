import { useMemo } from "react";
import { motion } from "framer-motion";
import { readUserData } from "./store";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function Overview({ user }) {
  const { leads = [], tasks = [], activities = [] } = readUserData(user?.email || "");

  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const won = leads.filter((lead) => lead.status === "won").length;
    const lost = leads.filter((lead) => lead.status === "lost").length;
    const openTasks = tasks.filter((task) => !task.done).length;
    const pipelineValue = leads
      .filter((lead) => !["won", "lost"].includes(lead.status))
      .reduce((sum, lead) => sum + Number(lead.value || 0), 0);

    return { totalLeads, won, lost, openTasks, pipelineValue };
  }, [leads, tasks]);

  return (
    <motion.section
      className="crm-page"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <header className="crm-page-header">
        <div>
          <h1>Overview</h1>
          <p>Sales performance and recent team activity.</p>
        </div>
      </header>

      <div className="crm-stat-grid">
        <div className="crm-stat-card">
          <div className="label">
            <span>Total Leads</span>
            <strong>All</strong>
          </div>
          <div className="value">{stats.totalLeads}</div>
        </div>

        <div className="crm-stat-card">
          <div className="label">
            <span>Won</span>
            <strong>Closed</strong>
          </div>
          <div className="value">{stats.won}</div>
        </div>

        <div className="crm-stat-card">
          <div className="label">
            <span>Lost</span>
            <strong>Missed</strong>
          </div>
          <div className="value">{stats.lost}</div>
        </div>

        <div className="crm-stat-card">
          <div className="label">
            <span>Open Tasks</span>
            <strong>Active</strong>
          </div>
          <div className="value">{stats.openTasks}</div>
        </div>

        <div className="crm-stat-card">
          <div className="label">
            <span>Pipeline Value</span>
            <strong>Open</strong>
          </div>
          <div className="value">{currency.format(stats.pipelineValue)}</div>
        </div>
      </div>

      <div className="crm-panel">
        <div className="crm-panel-header">
          <h2>Recent Activity</h2>
        </div>

        {activities.length > 0 ? (
          <div className="crm-activity-list">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="crm-activity-item">
                <span className="crm-activity-dot" />
                <div>
                  <strong>{activity.message}</strong>
                  <time>{new Date(activity.createdAt).toLocaleString()}</time>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="crm-empty-state">No recent activity yet.</div>
        )}
      </div>
    </motion.section>
  );
}
