import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// ═══════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════
const users = [
  {
    id: "u_admin_1",
    name: "Pawan Admin",
    email: "admin@galegrid.com",
    role: "admin",
    passwordHash: bcrypt.hashSync("Admin123!", SALT_ROUNDS),
    createdAt: "2025-01-15",
  },
  {
    id: "u_team_1",
    name: "Tharani Team",
    email: "team@galegrid.com",
    role: "team",
    passwordHash: bcrypt.hashSync("Team123!", SALT_ROUNDS),
    createdAt: "2025-03-10",
  },
  {
    id: "u_client_1",
    name: "Lifecare Client",
    email: "client@galegrid.com",
    role: "client",
    passwordHash: bcrypt.hashSync("Client123!", SALT_ROUNDS),
    createdAt: "2025-06-01",
  },
];

// ═══════════════════════════════════════════════════════════
// CLIENT LIFECYCLE
// Stages: lead → onboarding → active → delivered → subscription
// ═══════════════════════════════════════════════════════════
const clients = [
  {
    id: "cl_1",
    userId: "u_client_1",
    company: "Lifecare Medical",
    stage: "active",            // lead | onboarding | active | delivered | subscription
    assignedTeam: ["u_team_1"],
    notes: "Priority client — medical platform launch Q2 2026",
    createdAt: "2025-06-01",
    updatedAt: "2026-04-14",
  },
  {
    id: "cl_2",
    userId: null,               // lead — not registered yet
    company: "FreshBite Restaurant",
    contactName: "Amal Fernando",
    contactEmail: "amal@freshbite.com",
    stage: "lead",
    assignedTeam: [],
    notes: "Inquiry via website contact form",
    createdAt: "2026-04-10",
    updatedAt: "2026-04-10",
  },
  {
    id: "cl_3",
    userId: null,
    company: "SunMax Energy",
    contactName: "Ravi Perera",
    contactEmail: "ravi@sunmax.lk",
    stage: "onboarding",
    assignedTeam: ["u_team_1"],
    notes: "Signed contract — awaiting brand assets",
    createdAt: "2026-03-20",
    updatedAt: "2026-04-13",
  },
];

// ═══════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════
const projects = [
  {
    id: "p_1001",
    clientId: "cl_1",
    name: "Lifecare Medical Platform",
    teamMemberIds: ["u_team_1"],
    status: "In Progress",
    priority: "high",
    progress: 72,
    deadline: "2026-05-30",
    timeline: [
      { phase: "Discovery", done: true, completedAt: "2025-10-15" },
      { phase: "UI/UX Design", done: true, completedAt: "2026-01-20" },
      { phase: "Development", done: true, completedAt: "2026-03-30" },
      { phase: "QA & Review", done: false, completedAt: null },
      { phase: "Launch", done: false, completedAt: null },
    ],
    nextStep: "Complete QA testing and client review",
    createdAt: "2025-09-01",
    updatedAt: "2026-04-14",
  },
  {
    id: "p_1002",
    clientId: "cl_3",
    name: "SunMax Energy Site Revamp",
    teamMemberIds: ["u_team_1"],
    status: "Planning",
    priority: "medium",
    progress: 28,
    deadline: "2026-08-15",
    timeline: [
      { phase: "Discovery", done: true, completedAt: "2026-04-05" },
      { phase: "UI/UX Design", done: false, completedAt: null },
      { phase: "Development", done: false, completedAt: null },
      { phase: "QA & Review", done: false, completedAt: null },
      { phase: "Launch", done: false, completedAt: null },
    ],
    nextStep: "Start wireframe and design phase",
    createdAt: "2026-03-20",
    updatedAt: "2026-04-13",
  },
];

// ═══════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════
const tasks = [
  {
    id: "t_1",
    projectId: "p_1001",
    assigneeId: "u_team_1",
    title: "Finalize responsive nav behavior",
    priority: "high",
    status: "in-progress",     // todo | in-progress | review | completed
    dueDate: "2026-04-17",
    createdAt: "2026-04-10",
  },
  {
    id: "t_2",
    projectId: "p_1001",
    assigneeId: "u_team_1",
    title: "Integrate API endpoints for timeline",
    priority: "medium",
    status: "completed",
    dueDate: "2026-04-11",
    createdAt: "2026-04-05",
  },
  {
    id: "t_3",
    projectId: "p_1002",
    assigneeId: "u_team_1",
    title: "Build pricing card motion polish",
    priority: "low",
    status: "todo",
    dueDate: "2026-04-21",
    createdAt: "2026-04-12",
  },
  {
    id: "t_4",
    projectId: "p_1001",
    assigneeId: "u_team_1",
    title: "Cross-browser QA testing",
    priority: "high",
    status: "todo",
    dueDate: "2026-04-20",
    createdAt: "2026-04-14",
  },
];

// ═══════════════════════════════════════════════════════════
// SUBSCRIPTIONS & PLANS
// ═══════════════════════════════════════════════════════════
const plans = [
  { id: "plan_starter", name: "Starter", priceMonthly: 49, priceYearly: 470, features: ["1 active project", "Email support", "Monthly report"] },
  { id: "plan_growth", name: "Growth", priceMonthly: 149, priceYearly: 1430, features: ["3 active projects", "Priority support", "Weekly reports", "Revision rounds (3/mo)"] },
  { id: "plan_scale", name: "Scale", priceMonthly: 349, priceYearly: 3350, features: ["Unlimited projects", "Dedicated team", "Daily standups", "Unlimited revisions", "24/7 support"] },
];

const subscriptions = [
  {
    id: "sub_1",
    clientId: "cl_1",
    planId: "plan_growth",
    billing: "monthly",         // monthly | yearly
    status: "active",           // active | past_due | cancelled | paused
    startDate: "2025-09-01",
    nextBillingDate: "2026-05-01",
    cancelledAt: null,
  },
];

// ═══════════════════════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════════════════════
const invoices = [
  {
    id: "inv_1001",
    clientId: "cl_1",
    subscriptionId: "sub_1",
    amount: 149,
    status: "paid",             // paid | due | overdue
    issuedAt: "2026-03-01",
    paidAt: "2026-03-02",
    dueDate: "2026-03-15",
    description: "Growth Plan — March 2026",
  },
  {
    id: "inv_1002",
    clientId: "cl_1",
    subscriptionId: "sub_1",
    amount: 149,
    status: "paid",
    issuedAt: "2026-04-01",
    paidAt: "2026-04-03",
    dueDate: "2026-04-15",
    description: "Growth Plan — April 2026",
  },
  {
    id: "inv_1003",
    clientId: "cl_1",
    subscriptionId: "sub_1",
    amount: 149,
    status: "due",
    issuedAt: "2026-05-01",
    paidAt: null,
    dueDate: "2026-05-15",
    description: "Growth Plan — May 2026",
  },
];

// ═══════════════════════════════════════════════════════════
// MESSAGES (simple communication)
// ═══════════════════════════════════════════════════════════
const messages = [
  {
    id: "msg_1",
    projectId: "p_1001",
    senderId: "u_client_1",
    recipientId: "u_admin_1",
    text: "Can we get an update on the QA timeline?",
    createdAt: "2026-04-13T10:30:00",
    read: true,
  },
  {
    id: "msg_2",
    projectId: "p_1001",
    senderId: "u_admin_1",
    recipientId: "u_client_1",
    text: "QA starts this week. You'll be able to review by Friday.",
    createdAt: "2026-04-13T11:15:00",
    read: true,
  },
  {
    id: "msg_3",
    projectId: "p_1001",
    senderId: "u_client_1",
    recipientId: "u_admin_1",
    text: "Great — also need to discuss the mobile nav design.",
    createdAt: "2026-04-14T09:00:00",
    read: false,
  },
];

// ═══════════════════════════════════════════════════════════
// CLIENT REQUESTS (change requests, file uploads, approvals)
// ═══════════════════════════════════════════════════════════
const clientRequests = [
  {
    id: "req_1",
    clientId: "cl_1",
    projectId: "p_1001",
    type: "change",             // change | upload | approval
    title: "Update hero section copy",
    description: "Please replace the hero headline with 'Your Health, Our Priority'",
    status: "pending",          // pending | in-progress | completed | rejected
    createdAt: "2026-04-12",
    resolvedAt: null,
  },
  {
    id: "req_2",
    clientId: "cl_1",
    projectId: "p_1001",
    type: "approval",
    title: "Approve homepage design v3",
    description: "Final homepage design ready for client sign-off",
    status: "pending",
    createdAt: "2026-04-14",
    resolvedAt: null,
  },
];

// ═══════════════════════════════════════════════════════════
// ACTIVITY LOG
// ═══════════════════════════════════════════════════════════
const activityLog = [
  { id: "act_1", userId: "u_team_1", action: "completed task 'Integrate API endpoints'", timestamp: "2026-04-14T16:00:00" },
  { id: "act_2", userId: "u_admin_1", action: "moved SunMax Energy to onboarding", timestamp: "2026-04-13T14:30:00" },
  { id: "act_3", userId: "u_client_1", action: "submitted change request for Lifecare", timestamp: "2026-04-12T11:00:00" },
  { id: "act_4", userId: "u_admin_1", action: "created project SunMax Energy Site Revamp", timestamp: "2026-04-13T10:00:00" },
  { id: "act_5", userId: "u_team_1", action: "started task 'Finalize responsive nav'", timestamp: "2026-04-14T09:00:00" },
];

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// BOOKINGS
// status: pending | confirmed | cancelled | no_show
// ═══════════════════════════════════════════════════════════
const bookings = [];

export const mockDb = {
  users,
  clients,
  projects,
  tasks,
  plans,
  subscriptions,
  invoices,
  messages,
  clientRequests,
  activityLog,
  bookings,
};
