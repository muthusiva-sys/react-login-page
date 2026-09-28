export function createSeedData() {
  const now = Date.now();

  const iso = (daysAgo = 0, hoursAgo = 0) => {
    const date = new Date(now - (daysAgo * 24 * 60 * 60 * 1000 + hoursAgo * 60 * 60 * 1000));
    return date.toISOString();
  };

  const leads = [
    {
      id: "lead-1",
      name: "Ava Thompson",
      company: "Northwind Energy",
      email: "ava@northwindenergy.com",
      phone: "+1 (415) 550-1022",
      source: "Referral",
      status: "proposal",
      value: 48000,
      notes: "Interested in a 12-month supply contract with installation support.",
      createdAt: iso(12, 5),
      updatedAt: iso(2, 6),
    },
    {
      id: "lead-2",
      name: "Marcus Lee",
      company: "Summit Labs",
      email: "marcus@summitlabs.io",
      phone: "+1 (646) 907-3372",
      source: "Website",
      status: "contacted",
      value: 26500,
      notes: "Requested a demo for the reporting dashboard and pricing options.",
      createdAt: iso(9, 3),
      updatedAt: iso(1, 8),
    },
    {
      id: "lead-3",
      name: "Priya Shah",
      company: "Harbor Retail",
      email: "priya@harborretail.co",
      phone: "+1 (310) 841-7701",
      source: "Outbound",
      status: "new",
      value: 92000,
      notes: "Need a multi-location rollout plan and onboarding timeline.",
      createdAt: iso(3, 11),
      updatedAt: iso(0, 18),
    },
    {
      id: "lead-4",
      name: "Liam Brooks",
      company: "BluePeak Freight",
      email: "liam@bluepeakfreight.com",
      phone: "+1 (503) 294-4401",
      source: "Conference",
      status: "won",
      value: 120000,
      notes: "Closed after a strong pilot and procurement review.",
      createdAt: iso(26, 4),
      updatedAt: iso(6, 2),
    },
    {
      id: "lead-5",
      name: "Sofia Gomez",
      company: "Brightline Health",
      email: "sofia@brightlinehealth.com",
      phone: "+1 (212) 989-2842",
      source: "Campaign",
      status: "lost",
      value: 55000,
      notes: "Budget moved to an internal build; follow up next quarter.",
      createdAt: iso(18, 9),
      updatedAt: iso(5, 4),
    },
  ];

  const contacts = [
    {
      id: "contact-1",
      name: "Ava Thompson",
      company: "Northwind Energy",
      email: "ava@northwindenergy.com",
      phone: "+1 (415) 550-1022",
      role: "Operations Director",
      createdAt: iso(12, 5),
    },
    {
      id: "contact-2",
      name: "Marcus Lee",
      company: "Summit Labs",
      email: "marcus@summitlabs.io",
      phone: "+1 (646) 907-3372",
      role: "VP of Finance",
      createdAt: iso(9, 3),
    },
    {
      id: "contact-3",
      name: "Priya Shah",
      company: "Harbor Retail",
      email: "priya@harborretail.co",
      phone: "+1 (310) 841-7701",
      role: "Store Network Manager",
      createdAt: iso(3, 11),
    },
  ];

  const tasks = [
    {
      id: "task-1",
      title: "Send revised proposal to Northwind",
      done: false,
      dueDate: iso(2, 4),
      leadId: "lead-1",
      createdAt: iso(3, 7),
    },
    {
      id: "task-2",
      title: "Follow up with Summit Labs on pricing",
      done: false,
      dueDate: iso(1, 2),
      leadId: "lead-2",
      createdAt: iso(2, 9),
    },
    {
      id: "task-3",
      title: "Review final onboarding checklist",
      done: true,
      dueDate: iso(0, 2),
      leadId: "lead-4",
      createdAt: iso(6, 5),
    },
  ];

  const activities = [
    {
      id: "activity-1",
      type: "lead",
      message: "Lead created for Northwind Energy",
      createdAt: iso(12, 5),
    },
    {
      id: "activity-2",
      type: "status",
      message: "Lead moved to Proposal for Summit Labs",
      createdAt: iso(1, 8),
    },
    {
      id: "activity-3",
      type: "task",
      message: "Task completed: Review final onboarding checklist",
      createdAt: iso(0, 2),
    },
  ];

  return { leads, contacts, tasks, activities };
}
