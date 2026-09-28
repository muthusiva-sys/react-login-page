import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { addActivity, getAll, updateRecord } from "./store";

const PIPELINE_ORDER = ["new", "contacted", "proposal", "won", "lost"];
const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export default function Pipeline({ user }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (!user?.email) {
      setLeads([]);
      return;
    }

    setLeads(getAll(user.email, "leads", []));
  }, [user?.email]);

  const groupedLeads = useMemo(
    () =>
      PIPELINE_ORDER.reduce((groups, status) => {
        groups[status] = leads.filter((lead) => lead.status === status);
        return groups;
      }, {}),
    [leads]
  );

  const handleDrop = (event, status) => {
    event.preventDefault();
    const leadId = event.dataTransfer.getData("text/plain");
    if (!leadId) return;

    const previousLead = leads.find((lead) => lead.id === leadId);
    if (!previousLead || previousLead.status === status) return;

    updateRecord(user.email, "leads", leadId, { status, updatedAt: new Date().toISOString() });
    setLeads(getAll(user.email, "leads", []));
    addActivity(user.email, "status", `Lead moved to ${STATUS_LABELS[status]} for ${previousLead.name}`);
  };

  const handleStatusSelect = (leadId, event) => {
    const nextStatus = event.target.value;
    const currentLead = leads.find((lead) => lead.id === leadId);
    if (!currentLead || currentLead.status === nextStatus) return;

    updateRecord(user.email, "leads", leadId, {
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    });
    setLeads(getAll(user.email, "leads", []));
    addActivity(user.email, "status", `Lead moved to ${STATUS_LABELS[nextStatus]} for ${currentLead.name}`);
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
          <h1>Pipeline</h1>
          <p>Track every lead through the sales cycle.</p>
        </div>
      </header>

      <div className="crm-kanban">
        {PIPELINE_ORDER.map((status) => (
          <div
            key={status}
            className="crm-kanban-column"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, status)}
          >
            <div className="crm-kanban-header">
              <h3>{STATUS_LABELS[status]}</h3>
              <span>{groupedLeads[status].length}</span>
            </div>

            <div className="crm-kanban-cards">
              {groupedLeads[status].length > 0 ? (
                groupedLeads[status].map((lead) => (
                  <div
                    key={lead.id}
                    className="crm-kanban-card"
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", lead.id)}
                  >
                    <strong>{lead.name}</strong>
                    <small>{lead.company}</small>
                    <small>{lead.email}</small>
                    <span className={`crm-status-pill crm-status-${lead.status}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                    <small>{new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(Number(lead.value || 0))}</small>

                    <label className="crm-form-field" style={{ marginTop: "12px" }}>
                      <span>Change status</span>
                      <select
                        className="crm-select"
                        value={lead.status}
                        onChange={(event) => handleStatusSelect(lead.id, event)}
                      >
                        {PIPELINE_ORDER.map((option) => (
                          <option key={option} value={option}>
                            {STATUS_LABELS[option]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))
              ) : (
                <div className="crm-empty-state">No leads here.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
