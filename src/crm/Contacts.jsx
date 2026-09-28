import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addActivity, createRecord, getAll, removeRecord } from "./store";

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  role: "",
};

export default function Contacts({ user }) {
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) {
      setContacts([]);
      setLeads([]);
      return;
    }

    setContacts(getAll(user.email, "contacts", []));
    setLeads(getAll(user.email, "leads", []));
  }, [user?.email]);

  const contactRows = useMemo(() => {
    return contacts.map((contact) => ({
      ...contact,
      linkedLeads: leads.filter(
        (lead) =>
          lead.company?.toLowerCase() === contact.company?.toLowerCase() ||
          lead.email?.toLowerCase() === contact.email?.toLowerCase()
      ).length,
    }));
  }, [contacts, leads]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const company = form.company.trim();
    const phone = form.phone.trim();

    if (!name || !company || !email) {
      setError("Name, company, and email are required.");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    createRecord(user.email, "contacts", {
      ...form,
      name,
      company,
      email,
      phone,
      role: form.role.trim(),
    });

    addActivity(user.email, "contact", `Contact added for ${name}`);
    setContacts(getAll(user.email, "contacts", []));
    setForm(EMPTY_FORM);
    setError("");
    setIsOpen(false);
  };

  const handleDelete = (contactId, contactName) => {
    const confirmed = window.confirm(`Delete ${contactName} from contacts?`);
    if (!confirmed) return;

    removeRecord(user.email, "contacts", contactId);
    setContacts(getAll(user.email, "contacts", []));
    addActivity(user.email, "contact", `Contact deleted: ${contactName}`);
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
          <h1>Contacts</h1>
          <p>Build the relationship map around each opportunity.</p>
        </div>
        <button type="button" className="crm-btn" onClick={() => setIsOpen(true)}>
          Add Contact
        </button>
      </header>

      {contactRows.length > 0 ? (
        <div className="crm-card-grid">
          {contactRows.map((contact) => (
            <div key={contact.id} className="crm-card">
              <h3>{contact.name}</h3>
              <div className="crm-card-meta">
                <div><strong>Company:</strong> {contact.company}</div>
                <div><strong>Role:</strong> {contact.role || "—"}</div>
                <div><strong>Email:</strong> {contact.email}</div>
                <div><strong>Phone:</strong> {contact.phone || "—"}</div>
                <div><strong>Linked leads:</strong> {contact.linkedLeads}</div>
              </div>
              <div className="crm-form-actions" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="crm-badge-btn danger"
                  onClick={() => handleDelete(contact.id, contact.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="crm-empty-state">No contacts yet. Add the first relationship.</div>
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
              transition={{ duration: 0.18 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
            >
              <div className="crm-modal-header">
                <h2 id="contact-modal-title">Add contact</h2>
                <button type="button" className="crm-icon-btn" onClick={() => setIsOpen(false)}>
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="crm-modal-grid">
                  <label className="crm-form-field">
                    <span>Name</span>
                    <input
                      className="crm-input"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                    />
                  </label>

                  <label className="crm-form-field">
                    <span>Company</span>
                    <input
                      className="crm-input"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Northwind"
                    />
                  </label>

                  <label className="crm-form-field">
                    <span>Email</span>
                    <input
                      className="crm-input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                    />
                  </label>

                  <label className="crm-form-field">
                    <span>Phone</span>
                    <input
                      className="crm-input"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </label>

                  <label className="crm-form-field full">
                    <span>Role</span>
                    <input
                      className="crm-input"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      placeholder="Operations Director"
                    />
                  </label>
                </div>

                {error && <p className="crm-empty-state" style={{ marginTop: "12px" }}>{error}</p>}

                <div className="crm-form-actions">
                  <button type="button" className="crm-secondary-btn" onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="crm-form-btn">
                    Save Contact
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
