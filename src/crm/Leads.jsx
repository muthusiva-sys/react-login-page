import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addActivity, createRecord, getAll, removeRecord, updateRecord } from "./store";

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  source: "Website",
  status: "new",
  value: "",
  notes: "",
};

const LEAD_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export default function Leads({ user }) {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("updatedAt");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  useEffect(() => {
    if (!user?.email) {
      setLeads([]);
      return;
    }

    setLeads(getAll(user.email, "leads", []));
  }, [user?.email]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...leads]
      .filter((lead) => {
        const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
        const matchesSearch =
          !query ||
          lead.name?.toLowerCase().includes(query) ||
          lead.company?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortKey === "value") {
          return Number(b.value || 0) - Number(a.value || 0);
        }

        if (sortKey === "name") {
          return (a.name || "").localeCompare(b.name || "");
        }

        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
  }, [leads, search, statusFilter, sortKey]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError("");
    setSelectedLeadId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (lead) => {
    setSelectedLeadId(lead.id);
    setForm({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      value: String(lead.value || ""),
      notes: lead.notes || "",
    });
    setIsOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const company = form.company.trim();
    const email = form.email.trim();
    const value = Number(form.value);

    if (!name || !company || !email) {
      setError("Name, company, and email are required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!Number.isFinite(value) || value < 0) {
      setError("Lead value must be a valid number.");
      return;
    }

    if (selectedLeadId) {
      updateRecord(user.email, "leads", selectedLeadId, {
        ...form,
        name,
        company,
        email,
        phone: form.phone.trim(),
        notes: form.notes.trim(),
        value,
        updatedAt: new Date().toISOString(),
      });
      addActivity(user.email, "lead", `Lead updated for ${name}`);
    } else {
      createRecord(user.email, "leads", {
        ...form,
        name,
        company,
        email,
        phone: form.phone.trim(),
        notes: form.notes.trim(),
        value,
        status: form.status,
        source: form.source,
      });
      addActivity(user.email, "lead", `Lead created for ${name}`);
    }

    setLeads(getAll(user.email, "leads", []));
    resetForm();
    setIsOpen(false);
  };

  const handleDelete = (leadId, leadName) => {
    const confirmed = window.confirm(`Delete lead "${leadName}"?`);
    if (!confirmed) return;

    removeRecord(user.email, "leads", leadId);
    setLeads(getAll(user.email, "leads", []));
    addActivity(user.email, "lead", `Lead deleted: ${leadName}`);
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
          <h1>Leads</h1>
          <p>Manage active opportunities and next steps.</p>
        </div>
        <button type="button" className="crm-btn" onClick={handleOpenCreate}>
          Add Lead
        </button>
      </header>

      <div className="crm-panel">
        <div className="crm-filters">
          <input
            className="crm-input"
            type="search"
            placeholder="Search by name, company, or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select className="crm-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {LEAD_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select className="crm-select" value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
            <option value="updatedAt">Sort by updated</option>
            <option value="name">Sort by name</option>
            <option value="value">Sort by value</option>
          </select>
        </div>
      </div>

      {filteredLeads.length > 0 ? (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Source</th>
                <th>Status</th>
                <th>Value</th>
                <th>Updated</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <strong>{lead.name}</strong>
                    <div style={{ color: "#667085", fontSize: "0.8rem" }}>{lead.email}</div>
                  </td>
                  <td>{lead.company}</td>
                  <td>{lead.source}</td>
                  <td>
                    <span className={`crm-status-pill crm-status-${lead.status}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(Number(lead.value || 0))}
                  </td>
                  <td>{new Date(lead.updatedAt || lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="crm-actions">
                      <button type="button" className="crm-icon-btn" onClick={() => handleOpenEdit(lead)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="crm-icon-btn danger"
                        onClick={() => handleDelete(lead.id, lead.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="crm-empty-state">No leads match the current filters.</div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="crm-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="crm-modal"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lead-modal-title"
            >
              <div className="crm-modal-header">
                <h2 id="lead-modal-title">{selectedLeadId ? "Edit lead" : "Add lead"}</h2>
                <button type="button" className="crm-icon-btn" onClick={() => setIsOpen(false)}>
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="crm-modal-grid">
                  <label className="crm-form-field">
                    <span>Name</span>
                    <input className="crm-input" name="name" value={form.name} onChange={handleChange} />
                  </label>

                  <label className="crm-form-field">
                    <span>Company</span>
                    <input className="crm-input" name="company" value={form.company} onChange={handleChange} />
                  </label>

                  <label className="crm-form-field">
                    <span>Email</span>
                    <input className="crm-input" type="email" name="email" value={form.email} onChange={handleChange} />
                  </label>

                  <label className="crm-form-field">
                    <span>Phone</span>
                    <input className="crm-input" name="phone" value={form.phone} onChange={handleChange} />
                  </label>

                  <label className="crm-form-field">
                    <span>Source</span>
                    <input className="crm-input" name="source" value={form.source} onChange={handleChange} />
                  </label>

                  <label className="crm-form-field">
                    <span>Status</span>
                    <select className="crm-select" name="status" value={form.status} onChange={handleChange}>
                      {LEAD_STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="crm-form-field">
                    <span>Value</span>
                    <input className="crm-input" type="number" name="value" value={form.value} onChange={handleChange} />
                  </label>

                  <label className="crm-form-field full">
                    <span>Notes</span>
                    <textarea className="crm-textarea" name="notes" rows="4" value={form.notes} onChange={handleChange} />
                  </label>
                </div>

                {error && <p className="crm-empty-state" style={{ marginTop: "12px" }}>{error}</p>}

                <div className="crm-form-actions">
                  <button type="button" className="crm-secondary-btn" onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="crm-form-btn">
                    {selectedLeadId ? "Save changes" : "Create lead"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
