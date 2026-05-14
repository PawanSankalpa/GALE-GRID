import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Users, Briefcase, DollarSign, FileText,
  Calendar, MessageCircle, Settings, Clock,
  CheckCircle, Plus, Search, Download,
  MoreVertical, Eye, Edit, Trash2, Send, Target,
  BarChart3, Bell,
  ChevronDown, ChevronUp, X, Menu, User, Map,
  Phone, Mail, MapPin, Linkedin,
  Twitter, Instagram, HelpCircle, Sun, Moon,
  CheckSquare, Square, Video, Paperclip, Smile, SendHorizontal,
  ArrowUpRight, Rocket,
  UserPlus, ExternalLink, Share2, Upload,
  Building, Train, Monitor
} from 'lucide-react';
import './Plan1.css';

const Plan = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Project Inquiry', message: 'TechCorp wants a quote for $25,000 project', time: '10 min ago', read: false, type: 'project' },
    { id: 2, title: 'Invoice Paid', message: 'Payment received for Project X - $15,000', time: '2 hours ago', read: true, type: 'finance' },
    { id: 3, title: 'Meeting Reminder', message: 'Client call with Global Corp at 3 PM', time: '1 day ago', read: false, type: 'meeting' },
    { id: 4, title: 'Project Deadline', message: 'E-commerce Platform due in 3 days', time: '2 days ago', read: false, type: 'deadline' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'client', message: 'Hi, can we move the deadline to next week?', time: '10:30 AM' },
    { id: 2, sender: 'you', message: 'Let me check the schedule and get back to you.', time: '10:32 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [projectForm, setProjectForm] = useState({
    name: '',
    client: '',
    budget: '',
    deadline: '',
    description: '',
    priority: 'medium'
  });
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: ''
  });

  // Sidebar auto-hide functionality
  const sidebarRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Show sidebar when mouse is near left edge
      if (e.clientX < 50 && !isSidebarOpen) {
        setIsSidebarOpen(true);
        setIsSidebarHovered(true);
      }

      // Reset inactivity timer
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        if (isSidebarHovered && screenSize !== 'mobile') {
          setIsSidebarHovered(false);
          setIsSidebarOpen(false);
        }
      }, 3000); // 3 seconds of inactivity
    };

    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        if (isSidebarOpen && screenSize !== 'mobile') {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(inactivityTimerRef.current);
    };
  }, [isSidebarOpen, isSidebarHovered, screenSize]);

  // Projects with comprehensive data
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'E-commerce Platform', 
      client: 'TechCorp Inc', 
      status: 'in-progress', 
      progress: 65, 
      budget: 15000, 
      actualCost: 12000,
      deadline: '2024-02-15', 
      priority: 'high',
      team: ['Alex Johnson', 'Sarah Miller'],
      lastUpdated: '2024-01-15',
      description: 'Modern e-commerce solution with AI recommendations',
      tasks: [
        { id: 1, name: 'Design Homepage', completed: true },
        { id: 2, name: 'Product Page Design', completed: true },
        { id: 3, name: 'Cart & Checkout Flow', completed: false },
        { id: 4, name: 'Payment Integration', completed: false }
      ]
    },
    { 
      id: 2, 
      name: 'Portfolio Website', 
      client: 'Jane Design', 
      status: 'review', 
      progress: 90, 
      budget: 3500,
      actualCost: 3200,
      deadline: '2024-01-25', 
      priority: 'medium',
      team: ['Emma Davis'],
      lastUpdated: '2024-01-20',
      description: 'Creative portfolio showcasing design work',
      tasks: [
        { id: 1, name: 'Wireframes', completed: true },
        { id: 2, name: 'Visual Design', completed: true },
        { id: 3, name: 'Development', completed: false },
        { id: 4, name: 'Testing', completed: false }
      ]
    },
    { 
      id: 3, 
      name: 'Mobile App Landing', 
      client: 'StartupXYZ', 
      status: 'completed', 
      progress: 100, 
      budget: 8000,
      actualCost: 8500,
      deadline: '2024-01-10', 
      priority: 'low',
      team: ['Mike Chen', 'Alex Johnson'],
      lastUpdated: '2024-01-08',
      description: 'Landing page for mobile application launch',
      tasks: [
        { id: 1, name: 'Design', completed: true },
        { id: 2, name: 'Development', completed: true },
        { id: 3, name: 'SEO Optimization', completed: true },
        { id: 4, name: 'Analytics Setup', completed: true }
      ]
    },
    { 
      id: 4, 
      name: 'Corporate Rebrand', 
      client: 'Global Corp', 
      status: 'planning', 
      progress: 20, 
      budget: 25000,
      actualCost: 5000,
      deadline: '2024-03-01', 
      priority: 'high',
      team: ['Alex Johnson', 'Sarah Miller', 'Mike Chen', 'Emma Davis'],
      lastUpdated: '2024-01-18',
      description: 'Complete brand redesign and website overhaul',
      tasks: [
        { id: 1, name: 'Brand Discovery', completed: true },
        { id: 2, name: 'Logo Design', completed: false },
        { id: 3, name: 'Brand Guidelines', completed: false },
        { id: 4, name: 'Website Design', completed: false }
      ]
    },
  ]);

  // Clients with detailed information
  const [clients, setClients] = useState([
    { 
      id: 1, 
      name: 'TechCorp Inc', 
      email: 'contact@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Inc',
      industry: 'Technology',
      projects: 3, 
      revenue: 45000, 
      status: 'active', 
      lastContact: '2024-01-10',
      contractType: 'Retainer',
      contactPerson: 'John Smith',
      location: 'San Francisco, CA',
      notes: 'Very responsive, pays on time',
      avatarColor: 'blue'
    },
    { 
      id: 2, 
      name: 'Jane Design', 
      email: 'jane@janedesign.com',
      phone: '+1 (555) 987-6543',
      company: 'Jane Design Studio',
      industry: 'Creative',
      projects: 2, 
      revenue: 7000, 
      status: 'active', 
      lastContact: '2024-01-12',
      contractType: 'Project-based',
      contactPerson: 'Jane Wilson',
      location: 'New York, NY',
      notes: 'Creative director, has clear vision',
      avatarColor: 'pink'
    },
    { 
      id: 3, 
      name: 'StartupXYZ', 
      email: 'hello@startupxyz.com',
      phone: '+1 (555) 456-7890',
      company: 'StartupXYZ LLC',
      industry: 'Startup',
      projects: 1, 
      revenue: 8000, 
      status: 'completed', 
      lastContact: '2024-01-05',
      contractType: 'One-time',
      contactPerson: 'Mike Johnson',
      location: 'Austin, TX',
      notes: 'Fast-paced startup, good potential for more work',
      avatarColor: 'green'
    },
    { 
      id: 4, 
      name: 'Global Corp', 
      email: 'info@globalcorp.com',
      phone: '+1 (555) 234-5678',
      company: 'Global Corporation',
      industry: 'Enterprise',
      projects: 4, 
      revenue: 85000, 
      status: 'active', 
      lastContact: '2024-01-14',
      contractType: 'Enterprise',
      contactPerson: 'Sarah Davis',
      location: 'Chicago, IL',
      notes: 'Large corporation, longer approval process',
      avatarColor: 'purple'
    },
  ]);

  // Enhanced Stats
  const [stats, setStats] = useState([
    { id: 1, label: 'Active Projects', value: '12', change: '+3', trend: 'up', icon: <Briefcase />, color: 'blue', detail: '3 in review, 9 in progress' },
    { id: 2, label: 'Total Revenue', value: '$145K', change: '+12%', trend: 'up', icon: <DollarSign />, color: 'green', detail: 'Q1: $145K, Target: $160K' },
    { id: 3, label: 'Active Clients', value: '28', change: '+5', trend: 'up', icon: <Users />, color: 'purple', detail: '24 active, 4 pending' },
    { id: 4, label: 'Completion Rate', value: '94%', change: '+2%', trend: 'up', icon: <Target />, color: 'pink', detail: 'On track for 95% target' },
    { id: 5, label: 'Team Capacity', value: '78%', change: '-5%', trend: 'down', icon: <Users />, color: 'yellow', detail: 'Optimal: 85%' },
    { id: 6, label: 'Avg. Response', value: '2.4h', change: '-0.3h', trend: 'up', icon: <Clock />, color: 'cyan', detail: 'Goal: Under 3 hours' },
  ]);

  // Recent Activity with more details
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'New project started', project: 'E-commerce Platform', time: '2 hours ago', type: 'project', user: 'Alex Johnson' },
    { id: 2, action: 'Invoice sent', client: 'TechCorp Inc', time: '4 hours ago', type: 'finance', amount: '$15,000' },
    { id: 3, action: 'Client meeting scheduled', client: 'Global Corp', time: '1 day ago', type: 'meeting', duration: '1 hour' },
    { id: 4, action: 'Project delivered', project: 'Mobile App Landing', time: '2 days ago', type: 'delivery', rating: '★★★★★' },
    { id: 5, action: 'Contract signed', client: 'New Client LLC', time: '3 days ago', type: 'contract', value: '$25,000' },
  ]);

  // Financial Data
  const [financialData, setFinancialData] = useState({
    monthlyRevenue: [65000, 72000, 85000, 92000, 105000, 145000],
    expenses: [45000, 48000, 52000, 55000, 60000, 62000],
    profitMargin: [30, 33, 35, 38, 40, 42],
    months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  });

  // Team Members
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alex Johnson', role: 'Lead Designer', avatar: 'AJ', status: 'active', projects: 5, capacity: 85, email: 'alex@agency.com' },
    { id: 2, name: 'Sarah Miller', role: 'Frontend Developer', avatar: 'SM', status: 'active', projects: 4, capacity: 90, email: 'sarah@agency.com' },
    { id: 3, name: 'Mike Chen', role: 'Project Manager', avatar: 'MC', status: 'busy', projects: 6, capacity: 95, email: 'mike@agency.com' },
    { id: 4, name: 'Emma Davis', role: 'UI/UX Designer', avatar: 'ED', status: 'away', projects: 3, capacity: 70, email: 'emma@agency.com' },
  ]);

  // Business Roadmap Data - Creative & Comprehensive
  const [businessRoadmap, setBusinessRoadmap] = useState([
    {
      id: 1,
      phase: "Phase 1: Foundation",
      title: "Identity & Setup",
      weeks: "Week 1",
      date: "July 1-7, 2024",
      tasks: [
        { id: 1, title: "Niche Selection", description: "Research and select target niche", completed: true, time: "1.5 hours", deliverable: "Niche + positioning statement" },
        { id: 2, title: "Domain & Branding", description: "Purchase domain and setup branding", completed: true, time: "1 hour", deliverable: "Domain purchased" },
        { id: 3, title: "Professional Email", description: "Setup business email", completed: true, time: "45 min", deliverable: "hello@yourdomain.com working" },
        { id: 4, title: "Booking System", description: "Setup Calendly for consultations", completed: true, time: "45 min", deliverable: "Booking page ready" },
        { id: 5, title: "Template Setup", description: "Purchase and setup website template", completed: true, time: "1 hour", deliverable: "Template ready" }
      ],
      color: "blue",
      progress: 100
    },
    {
      id: 2,
      phase: "Phase 1: Foundation",
      title: "Website Development",
      weeks: "Week 2",
      date: "July 8-14, 2024",
      tasks: [
        { id: 1, title: "Homepage Content", description: "Write all homepage content", completed: true, time: "2 hours", deliverable: "Homepage text ready" },
        { id: 2, title: "Homepage Styling", description: "Customize template with branding", completed: true, time: "2 hours", deliverable: "Custom homepage" },
        { id: 3, title: "Interior Pages", description: "Create About, Services, Portfolio pages", completed: true, time: "2 hours", deliverable: "All pages complete" },
        { id: 4, title: "Deployment", description: "Deploy website live", completed: true, time: "1.5 hours", deliverable: "Site live at yourdomain.com" },
        { id: 5, title: "Analytics & SEO", description: "Setup Google Analytics and SEO", completed: true, time: "1 hour", deliverable: "Analytics tracking" }
      ],
      color: "green",
      progress: 100
    },
    {
      id: 3,
      phase: "Phase 2: Sales Systems",
      title: "Client Systems Setup",
      weeks: "Week 3",
      date: "July 15-21, 2024",
      tasks: [
        { id: 1, title: "Proposal Template", description: "Create professional proposal template", completed: true, time: "1.5 hours", deliverable: "Proposal_Template.pdf" },
        { id: 2, title: "Contract System", description: "Setup HelloSign for contracts", completed: true, time: "1 hour", deliverable: "Contract template ready" },
        { id: 3, title: "Invoicing System", description: "Setup Wave Apps for invoicing", completed: true, time: "45 min", deliverable: "Invoice system ready" },
        { id: 4, title: "Project Management", description: "Setup Trello boards", completed: true, time: "45 min", deliverable: "Trello board ready" },
        { id: 5, title: "Content Checklist", description: "Create client onboarding checklist", completed: true, time: "30 min", deliverable: "Checklist ready" }
      ],
      color: "purple",
      progress: 100
    },
    {
      id: 4,
      phase: "Phase 2: Sales Systems",
      title: "Outreach & Sales",
      weeks: "Week 4",
      date: "July 22-31, 2024",
      tasks: [
        { id: 1, title: "Lead List Building", description: "Build list of 30 potential clients", completed: false, time: "2 hours", deliverable: "30 leads in spreadsheet" },
        { id: 2, title: "Email Templates", description: "Create cold email sequences", completed: false, time: "1 hour", deliverable: "3 email templates" },
        { id: 3, title: "Call Script", description: "Write sales call script", completed: false, time: "45 min", deliverable: "Call script ready" },
        { id: 4, title: "First Outreach", description: "Send first batch of 5 emails", completed: false, time: "1 hour", deliverable: "5 emails sent" },
        { id: 5, title: "Daily System", description: "Setup daily outreach routine", completed: false, time: "30 min", deliverable: "Recurring reminders set" }
      ],
      color: "pink",
      progress: 40
    },
    {
      id: 5,
      phase: "Phase 3: First Client",
      title: "Client Onboarding",
      weeks: "Week 5",
      date: "August 1-7, 2024",
      tasks: [
        { id: 1, title: "Client Signing", description: "Send contract and invoice", completed: false, time: "1 hour", deliverable: "Contract signed, deposit paid" },
        { id: 2, title: "Kickoff Call", description: "Conduct project kickoff meeting", completed: false, time: "1 hour", deliverable: "Project scope confirmed" },
        { id: 3, title: "Content Collection", description: "Gather all client content", completed: false, time: "1 hour", deliverable: "All content received" },
        { id: 4, title: "Design Phase Start", description: "Begin homepage design", completed: false, time: "2 hours", deliverable: "Homepage design started" },
        { id: 5, title: "Client Review", description: "Present design for feedback", completed: false, time: "30 min", deliverable: "Client feedback received" }
      ],
      color: "yellow",
      progress: 0
    },
    {
      id: 6,
      phase: "Phase 3: First Client",
      title: "Design & Development",
      weeks: "Week 6-7",
      date: "August 8-21, 2024",
      tasks: [
        { id: 1, title: "Design Revisions", description: "Implement client feedback", completed: false, time: "1.5 hours", deliverable: "Final approved design" },
        { id: 2, title: "Inner Pages Design", description: "Design all inner pages", completed: false, time: "2 hours", deliverable: "All page designs approved" },
        { id: 3, title: "Development Setup", description: "Setup Next.js and CMS", completed: false, time: "1.5 hours", deliverable: "Dev environment ready" },
        { id: 4, title: "Website Build", description: "Code all website pages", completed: false, time: "4 hours", deliverable: "All pages coded" },
        { id: 5, title: "CMS Integration", description: "Connect Strapi CMS", completed: false, time: "2 hours", deliverable: "Client can edit content" }
      ],
      color: "cyan",
      progress: 0
    },
    {
      id: 7,
      phase: "Phase 3: First Client",
      title: "Launch & Handoff",
      weeks: "Week 8",
      date: "August 22-31, 2024",
      tasks: [
        { id: 1, title: "Testing & Polish", description: "Mobile and browser testing", completed: false, time: "2 hours", deliverable: "Site works perfectly" },
        { id: 2, title: "Client Review", description: "Final client review", completed: false, time: "1 hour", deliverable: "Final approval" },
        { id: 3, title: "Pre-launch Setup", description: "Setup hosting and domain", completed: false, time: "1.5 hours", deliverable: "Hosting ready" },
        { id: 4, title: "Launch Website", description: "Go live with client site", completed: false, time: "1 hour", deliverable: "Site live at clientdomain.com" },
        { id: 5, title: "Training & Handoff", description: "Train client on CMS", completed: false, time: "1 hour", deliverable: "Client trained" }
      ],
      color: "orange",
      progress: 0
    },
    {
      id: 8,
      phase: "Phase 4: Scaling",
      title: "Growth & Optimization",
      weeks: "September 2024",
      date: "September 1-30, 2024",
      tasks: [
        { id: 1, title: "Maintenance Offers", description: "Setup recurring maintenance plans", completed: false, time: "30 min", deliverable: "$99/month plans ready" },
        { id: 2, title: "Reviews & Testimonials", description: "Collect client reviews", completed: false, time: "15 min", deliverable: "5-star reviews" },
        { id: 3, title: "Case Study Creation", description: "Create detailed case study", completed: false, time: "2 hours", deliverable: "Portfolio piece ready" },
        { id: 4, title: "Price Increase", description: "Increase rates for new clients", completed: false, time: "15 min", deliverable: "Higher pricing live" },
        { id: 5, title: "Scaling Systems", description: "Optimize all systems for scale", completed: false, time: "2 hours", deliverable: "Scalable processes" }
      ],
      color: "indigo",
      progress: 0
    }
  ]);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('mobile');
      else if (width < 768) setScreenSize('tablet-sm');
      else if (width < 1024) setScreenSize('tablet');
      else if (width < 1280) setScreenSize('laptop');
      else if (width < 1536) setScreenSize('desktop');
      else setScreenSize('large-screen');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Utility Functions
  const getStatusColor = (status) => {
    const colors = {
      'in-progress': 'blue',
      'review': 'yellow',
      'completed': 'green',
      'planning': 'purple',
      'on-hold': 'gray'
    };
    return colors[status] || 'gray';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'red',
      'medium': 'yellow',
      'low': 'green',
      'urgent': 'pink'
    };
    return colors[priority] || 'gray';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProfit = (budget, actual) => {
    return budget - actual;
  };

  // CRUD Operations
  const addProject = () => {
    if (!projectForm.name || !projectForm.client || !projectForm.budget) {
      alert('Please fill in all required fields');
      return;
    }

    const newProject = {
      id: projects.length + 1,
      name: projectForm.name,
      client: projectForm.client,
      status: 'planning',
      progress: 0,
      budget: parseInt(projectForm.budget),
      actualCost: 0,
      deadline: projectForm.deadline,
      priority: projectForm.priority,
      team: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      description: projectForm.description,
      tasks: []
    };

    setProjects([...projects, newProject]);
    setProjectForm({
      name: '',
      client: '',
      budget: '',
      deadline: '',
      description: '',
      priority: 'medium'
    });
    setShowNewProjectModal(false);
    alert('Project added successfully!');
  };

  const updateProject = (id, updates) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
      alert('Project deleted successfully!');
    }
  };

  const addClient = () => {
    if (!clientForm.name || !clientForm.email || !clientForm.company) {
      alert('Please fill in all required fields');
      return;
    }

    const newClient = {
      id: clients.length + 1,
      name: clientForm.name,
      email: clientForm.email,
      phone: clientForm.phone,
      company: clientForm.company,
      industry: clientForm.industry,
      projects: 0,
      revenue: 0,
      status: 'active',
      lastContact: new Date().toISOString().split('T')[0],
      contractType: 'New',
      contactPerson: clientForm.name,
      location: '',
      notes: 'New client added via dashboard',
      avatarColor: ['blue', 'green', 'purple', 'pink'][Math.floor(Math.random() * 4)]
    };

    setClients([...clients, newClient]);
    setClientForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      industry: ''
    });
    setShowNewClientModal(false);
    alert('Client added successfully!');
  };

  const sendInvoice = (clientId, amount) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      alert(`Invoice sent to ${client.name} for ${formatCurrency(amount)}`);
      // In a real app, this would connect to your invoicing system
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'you',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const toggleTaskCompletion = (projectId, taskId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const completedTasks = updatedTasks.filter(t => t.completed).length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);
        return { 
          ...project, 
          tasks: updatedTasks, 
          progress: progress,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return project;
    }));
  };

  const handleExport = (type) => {
    let data, filename, content;
    
    switch(type) {
      case 'projects':
        data = projects.map(p => ({
          'Project Name': p.name,
          'Client': p.client,
          'Status': p.status,
          'Progress': `${p.progress}%`,
          'Budget': formatCurrency(p.budget),
          'Profit': formatCurrency(calculateProfit(p.budget, p.actualCost)),
          'Deadline': p.deadline,
          'Priority': p.priority
        }));
        filename = 'projects_export.csv';
        break;
      case 'clients':
        data = clients.map(c => ({
          'Client Name': c.name,
          'Company': c.company,
          'Email': c.email,
          'Phone': c.phone,
          'Projects': c.projects,
          'Revenue': formatCurrency(c.revenue),
          'Status': c.status,
          'Last Contact': c.lastContact
        }));
        filename = 'clients_export.csv';
        break;
      default:
        return;
    }
    
    // Convert to CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(','));
    content = [headers, ...rows].join('\n');
    
    // Download file
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert(`${type} exported successfully!`);
  };

  const getFilteredProjects = () => {
    let filtered = projects;
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.status === activeFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getFilteredClients = () => {
    let filtered = clients;
    
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Modal Components
  const NewProjectModal = () => (
    <div className="plan-modal-overlay" onClick={() => setShowNewProjectModal(false)}>
      <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="plan-modal-header">
          <h3>Create New Project</h3>
          <button className="plan-modal-close" onClick={() => setShowNewProjectModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="plan-modal-body">
          <div className="plan-form-group">
            <label>Project Name *</label>
            <input 
              type="text" 
              value={projectForm.name}
              onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
              placeholder="E.g., E-commerce Website"
            />
          </div>
          <div className="plan-form-group">
            <label>Client *</label>
            <input 
              type="text" 
              value={projectForm.client}
              onChange={(e) => setProjectForm({...projectForm, client: e.target.value})}
              placeholder="Client or Company Name"
            />
          </div>
          <div className="plan-form-row">
            <div className="plan-form-group">
              <label>Budget ($) *</label>
              <input 
                type="number" 
                value={projectForm.budget}
                onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
                placeholder="5000"
              />
            </div>
            <div className="plan-form-group">
              <label>Deadline</label>
              <input 
                type="date" 
                value={projectForm.deadline}
                onChange={(e) => setProjectForm({...projectForm, deadline: e.target.value})}
              />
            </div>
          </div>
          <div className="plan-form-group">
            <label>Priority</label>
            <select 
              value={projectForm.priority}
              onChange={(e) => setProjectForm({...projectForm, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="plan-form-group">
            <label>Description</label>
            <textarea 
              value={projectForm.description}
              onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
              placeholder="Project description and requirements..."
              rows={3}
            />
          </div>
        </div>
        <div className="plan-modal-footer">
          <button className="plan-btn-secondary" onClick={() => setShowNewProjectModal(false)}>
            Cancel
          </button>
          <button className="plan-btn-primary" onClick={addProject}>
            <Plus size={18} />
            Create Project
          </button>
        </div>
      </div>
    </div>
  );

  const NewClientModal = () => (
    <div className="plan-modal-overlay" onClick={() => setShowNewClientModal(false)}>
      <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="plan-modal-header">
          <h3>Add New Client</h3>
          <button className="plan-modal-close" onClick={() => setShowNewClientModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="plan-modal-body">
          <div className="plan-form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              value={clientForm.name}
              onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
              placeholder="John Smith"
            />
          </div>
          <div className="plan-form-group">
            <label>Email *</label>
            <input 
              type="email" 
              value={clientForm.email}
              onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
              placeholder="john@company.com"
            />
          </div>
          <div className="plan-form-group">
            <label>Phone</label>
            <input 
              type="tel" 
              value={clientForm.phone}
              onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="plan-form-group">
            <label>Company *</label>
            <input 
              type="text" 
              value={clientForm.company}
              onChange={(e) => setClientForm({...clientForm, company: e.target.value})}
              placeholder="Company Name"
            />
          </div>
          <div className="plan-form-group">
            <label>Industry</label>
            <input 
              type="text" 
              value={clientForm.industry}
              onChange={(e) => setClientForm({...clientForm, industry: e.target.value})}
              placeholder="Technology, Healthcare, etc."
            />
          </div>
        </div>
        <div className="plan-modal-footer">
          <button className="plan-btn-secondary" onClick={() => setShowNewClientModal(false)}>
            Cancel
          </button>
          <button className="plan-btn-primary" onClick={addClient}>
            <UserPlus size={18} />
            Add Client
          </button>
        </div>
      </div>
    </div>
  );

  const ProjectDetailModal = () => {
    if (!selectedProject) return null;
    
    const project = projects.find(p => p.id === selectedProject);
    
    return (
      <div className="plan-modal-overlay" onClick={() => setSelectedProject(null)}>
        <div className="plan-modal plan-modal-large" onClick={(e) => e.stopPropagation()}>
          <div className="plan-modal-header">
            <h3>{project.name}</h3>
            <button className="plan-modal-close" onClick={() => setSelectedProject(null)}>
              <X size={20} />
            </button>
          </div>
          <div className="plan-modal-body">
            <div className="plan-project-detail-header">
              <div className="plan-project-detail-info">
                <div className="plan-project-detail-client">
                  <span className="plan-detail-label">Client:</span>
                  <span className="plan-detail-value">{project.client}</span>
                </div>
                <div className="plan-project-detail-budget">
                  <span className="plan-detail-label">Budget:</span>
                  <span className="plan-detail-value">{formatCurrency(project.budget)}</span>
                </div>
                <div className="plan-project-detail-deadline">
                  <span className="plan-detail-label">Deadline:</span>
                  <span className="plan-detail-value">{project.deadline}</span>
                </div>
              </div>
              <div className="plan-project-detail-status">
                <span className={`plan-status-badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`plan-priority-badge ${getPriorityColor(project.priority)}`}>
                  {project.priority} priority
                </span>
              </div>
            </div>
            
            <div className="plan-project-detail-description">
              <h4>Description</h4>
              <p>{project.description}</p>
            </div>
            
            <div className="plan-project-detail-progress">
              <h4>Progress</h4>
              <div className="plan-progress-bar-large">
                <div 
                  className={`plan-progress-fill ${getStatusColor(project.status)}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="plan-progress-text-large">{project.progress}% Complete</div>
            </div>
            
            <div className="plan-project-detail-tasks">
              <h4>Tasks</h4>
              <div className="plan-tasks-list">
                {project.tasks.map(task => (
                  <div key={task.id} className="plan-task-item">
                    <button 
                      className="plan-task-checkbox"
                      onClick={() => toggleTaskCompletion(project.id, task.id)}
                    >
                      {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                    <span className={`plan-task-text ${task.completed ? 'completed' : ''}`}>
                      {task.name}
                    </span>
                    <span className="plan-task-status">
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="plan-project-detail-actions">
              <button className="plan-btn-primary" onClick={() => updateProject(project.id, { progress: 100, status: 'completed' })}>
                <CheckCircle size={18} />
                Mark Complete
              </button>
              <button className="plan-btn-secondary" onClick={() => sendInvoice(clients.find(c => c.name === project.client)?.id, project.budget)}>
                <Send size={18} />
                Send Invoice
              </button>
              <button className="plan-btn-ghost" onClick={() => deleteProject(project.id)}>
                <Trash2 size={18} />
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NotificationPanel = () => (
    <div className={`plan-notification-panel ${showNotifications ? 'show' : ''}`}>
      <div className="plan-notification-header">
        <h3>Notifications</h3>
        <div className="plan-notification-actions">
          <button 
            className="plan-btn-ghost-sm"
            onClick={markAllNotificationsAsRead}
          >
            Mark all read
          </button>
          <button 
            className="plan-icon-btn-sm" 
            onClick={() => setShowNotifications(false)}
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="plan-notification-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`plan-notification-item ${!notification.read ? 'unread' : ''}`}
            onClick={() => markNotificationAsRead(notification.id)}
          >
            <div className={`plan-notification-icon ${notification.type}`}>
              {notification.type === 'project' && <Briefcase size={16} />}
              {notification.type === 'finance' && <DollarSign size={16} />}
              {notification.type === 'meeting' && <Calendar size={16} />}
              {notification.type === 'deadline' && <Clock size={16} />}
            </div>
            <div className="plan-notification-content">
              <div className="plan-notification-title">{notification.title}</div>
              <div className="plan-notification-message">{notification.message}</div>
              <div className="plan-notification-time">{notification.time}</div>
            </div>
            {!notification.read && <div className="plan-notification-dot"></div>}
          </div>
        ))}
      </div>
      <div className="plan-notification-footer">
        <button className="plan-btn-ghost">View all notifications</button>
      </div>
    </div>
  );

  const MobileMenuToggle = () => (
    <button 
      className="plan-mobile-menu-toggle"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <Menu size={24} />
    </button>
  );

  const SidebarHoverTrigger = () => (
    <div 
      className="plan-sidebar-hover-trigger"
      onMouseEnter={() => {
        if (screenSize !== 'mobile') {
          setIsSidebarHovered(true);
          setIsSidebarOpen(true);
        }
      }}
    />
  );

  // Determine expanded state for sidebar
  const isSidebarExpanded = isSidebarOpen || isSidebarHovered;

  // Sidebar drag/click handle for manual expand/collapse
  const SidebarHandle = () => (
    <div
      className="plan-sidebar-handle"
      onClick={() => setIsSidebarOpen((prev) => !prev)}
      title={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      style={{ cursor: 'ew-resize', width: 12, height: '100vh', position: 'fixed', left: isSidebarExpanded ? 300 : 64, top: 0, zIndex: 51, background: 'transparent' }}
    />
  );

  return (
    <div className={`plan-dashboard ${isDarkMode ? 'dark-mode' : ''} ${screenSize}`}>
      {/* Sidebar Hover Trigger */}
      <SidebarHoverTrigger />
      {/* Sidebar Drag/Click Handle */}
      <SidebarHandle />

      {/* Mobile Menu Toggle */}
      <MobileMenuToggle />
      
      {/* Modals */}
      {showNewProjectModal && <NewProjectModal />}
      {showNewClientModal && <NewClientModal />}
      {selectedProject && <ProjectDetailModal />}
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`plan-sidebar${isSidebarExpanded ? ' expanded' : ''}`}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => {
          if (screenSize !== 'mobile') {
            setIsSidebarHovered(false);
            setTimeout(() => {
              if (!isSidebarHovered) setIsSidebarOpen(false);
            }, 300);
          }
        }}
      >
        <div className="plan-sidebar-header">
          <div className="plan-logo">
            <div className="plan-logo-icon">
              <Rocket size={24} />
            </div>
            <div className="plan-logo-text">
              <div className="plan-logo-title">DesignFlow Pro</div>
              <div className="plan-logo-subtitle">Agency Dashboard</div>
            </div>
            <button 
              className="plan-sidebar-close"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="plan-sidebar-search">
          <div className="plan-search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="plan-nav">
          <button 
            className={`plan-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`plan-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <Briefcase size={20} />
            <span>Projects</span>
            <span className="plan-badge">{projects.length}</span>
          </button>
          <button 
            className={`plan-nav-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <Users size={20} />
            <span>Clients</span>
            <span className="plan-badge">{clients.length}</span>
          </button>
          <button 
            className={`plan-nav-item ${activeTab === 'finance' ? 'active' : ''}`}
            onClick={() => setActiveTab('finance')}
          >
            <DollarSign size={20} />
            <span>Finance</span>
          </button>
          <button 
            className={`plan-nav-item ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users size={20} />
            <span>Team</span>
          </button>
          <button 
            className={`plan-nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('roadmap')}
          >
            <Map size={20} />
            <span>Business Roadmap</span>
            <span className="plan-badge">8</span>
          </button>
          <button 
            className={`plan-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={20} />
            <span>Calendar</span>
          </button>
          <button 
            className={`plan-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageCircle size={20} />
            <span>Messages</span>
            <span className="plan-badge">3</span>
          </button>
          <button 
            className={`plan-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart3 size={20} />
            <span>Reports</span>
          </button>
          <button 
            className={`plan-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="plan-sidebar-footer">
          <div className="plan-user-profile">
            <div className="plan-user-avatar">
              <User size={20} />
            </div>
            <div className="plan-user-info">
              <div className="plan-user-name">John Doe</div>
              <div className="plan-user-role">Creative Director</div>
              <div className="plan-user-status">Online</div>
            </div>
            <button 
              className="plan-icon-btn-sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="plan-main">
        {/* Header */}
        <header className="plan-header">
          <div className="plan-header-left">
            <h1 className="plan-page-title">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'projects' && 'Project Management'}
              {activeTab === 'clients' && 'Client Management'}
              {activeTab === 'finance' && 'Financial Analytics'}
              {activeTab === 'team' && 'Team Management'}
              {activeTab === 'roadmap' && 'Business Roadmap'}
              {activeTab === 'calendar' && 'Calendar & Schedule'}
              {activeTab === 'messages' && 'Messages'}
              {activeTab === 'reports' && 'Reports & Analytics'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="plan-page-subtitle">
              {activeTab === 'dashboard' && 'Monitor your agency performance in real-time'}
              {activeTab === 'projects' && 'Track and manage all ongoing projects'}
              {activeTab === 'clients' && 'Manage client relationships and communications'}
              {activeTab === 'finance' && 'Track revenue, expenses, and profitability'}
              {activeTab === 'team' && 'Manage team members and capacity'}
              {activeTab === 'roadmap' && 'Your 90-day agency launch plan'}
              {activeTab === 'calendar' && 'View and manage agency schedule'}
              {activeTab === 'messages' && 'Communicate with team and clients'}
              {activeTab === 'reports' && 'Generate insights and analytics'}
              {activeTab === 'settings' && 'Configure your agency settings'}
            </p>
          </div>
          
          <div className="plan-header-right">
            <div className="plan-header-actions">
              <button 
                className="plan-btn-ghost"
                onClick={() => handleExport('projects')}
                title="Export Projects"
              >
                <Download size={18} />
                <span>Export</span>
              </button>
              <button 
                className="plan-btn-ghost"
                onClick={() => window.open('https://help.agency.com', '_blank')}
              >
                <HelpCircle size={18} />
                <span>Help</span>
              </button>
              <button 
                className="plan-icon-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="plan-notification-count">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              {activeTab === 'projects' && (
                <button 
                  className="plan-btn-primary"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <Plus size={18} />
                  <span>New Project</span>
                </button>
              )}
              {activeTab === 'clients' && (
                <button 
                  className="plan-btn-primary"
                  onClick={() => setShowNewClientModal(true)}
                >
                  <Plus size={18} />
                  <span>New Client</span>
                </button>
              )}
              {activeTab === 'dashboard' && (
                <button 
                  className="plan-btn-primary"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <Plus size={18} />
                  <span>Quick Add</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Notification Panel */}
        <NotificationPanel />

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="plan-content">
            {/* Stats Grid */}
            <div className="plan-stats-grid">
              {stats.map((stat) => (
                <div key={stat.id} className={`plan-stat-card ${stat.color}`}>
                  <div className="plan-stat-icon">{stat.icon}</div>
                  <div className="plan-stat-content">
                    <div className="plan-stat-label">{stat.label}</div>
                    <div className="plan-stat-value">{stat.value}</div>
                    <div className={`plan-stat-change ${stat.trend}`}>
                      {stat.trend === 'up' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      <span>{stat.change}</span>
                    </div>
                    <div className="plan-stat-detail">{stat.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="plan-main-grid">
              {/* Projects Overview */}
              <div className="plan-card plan-card-large">
                <div className="plan-card-header">
                  <h3 className="plan-card-title">Active Projects</h3>
                  <div className="plan-card-actions">
                    <button 
                      className="plan-btn-ghost"
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className="plan-btn-ghost"
                      onClick={() => setShowNewProjectModal(true)}
                    >
                      <Plus size={16} />
                      <span>Add Project</span>
                    </button>
                  </div>
                </div>
                <div className="plan-projects-list">
                  {projects.slice(0, 4).map(project => (
                    <div key={project.id} className="plan-project-item">
                      <div className="plan-project-main">
                        <div className="plan-project-info">
                          <div className="plan-project-name">{project.name}</div>
                          <div className="plan-project-meta">
                            <span className="plan-project-client">{project.client}</span>
                            <span className="plan-project-team">{project.team?.join(', ')}</span>
                          </div>
                        </div>
                        <div className="project-stats">
                          <div className="plan-project-budget">
                            <span className="plan-budget-label">Budget:</span>
                            <span className="plan-budget-value">{formatCurrency(project.budget)}</span>
                          </div>
                          <div className="plan-project-profit">
                            <span className="plan-profit-label">Profit:</span>
                            <span className={`plan-profit-value ${calculateProfit(project.budget, project.actualCost) >= 0 ? 'positive' : 'negative'}`}>
                              {formatCurrency(calculateProfit(project.budget, project.actualCost))}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="plan-project-progress-section">
                        <div className="plan-project-progress">
                          <div className="plan-progress-bar">
                            <div 
                              className={`plan-progress-fill ${getStatusColor(project.status)}`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <div className="plan-progress-info">
                            <span className="plan-progress-text">{project.progress}%</span>
                            <span className="plan-progress-deadline">Due: {project.deadline}</span>
                          </div>
                        </div>
                        <div className="plan-project-actions">
                          <div className={`plan-status-badge ${getStatusColor(project.status)}`}>
                            {project.status}
                          </div>
                          <div className={`plan-priority-badge ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </div>
                          <div className="plan-project-action-buttons">
                            <button 
                              className="plan-icon-btn-sm" 
                              onClick={() => updateProject(project.id, { progress: Math.min(100, project.progress + 10) })}
                              title="Increase Progress"
                            >
                              <ArrowUpRight size={16} />
                            </button>
                            <button 
                              className="plan-icon-btn-sm"
                              onClick={() => setSelectedProject(project.id)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="plan-icon-btn-sm"
                              onClick={() => updateProject(project.id, { status: 'completed', progress: 100 })}
                              title="Mark Complete"
                            >
                              <CheckCircle size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side Grid */}
              <div className="plan-side-grid">
                {/* Recent Activity */}
                <div className="plan-card">
                  <div className="plan-card-header">
                    <h3 className="plan-card-title">Recent Activity</h3>
                    <button className="plan-btn-ghost-sm">View All</button>
                  </div>
                  <div className="plan-activity-list">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="plan-activity-item">
                        <div className={`plan-activity-icon ${activity.type}`}>
                          {activity.type === 'project' && <Briefcase size={16} />}
                          {activity.type === 'finance' && <DollarSign size={16} />}
                          {activity.type === 'meeting' && <Calendar size={16} />}
                          {activity.type === 'delivery' && <CheckCircle size={16} />}
                          {activity.type === 'contract' && <FileText size={16} />}
                        </div>
                        <div className="plan-activity-content">
                          <div className="plan-activity-text">{activity.action}</div>
                          <div className="plan-activity-details">
                            <span className="plan-activity-source">{activity.project || activity.client}</span>
                            {activity.amount && <span className="plan-activity-amount">{activity.amount}</span>}
                            {activity.rating && <span className="plan-activity-rating">{activity.rating}</span>}
                          </div>
                          <div className="plan-activity-meta">
                            <span className="plan-activity-time">{activity.time}</span>
                            <span className="plan-activity-user">{activity.user || 'System'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Availability */}
                <div className="plan-card">
                  <div className="plan-card-header">
                    <h3 className="plan-card-title">Team Availability</h3>
                    <div className="plan-team-stats">Avg: 85%</div>
                  </div>
                  <div className="plan-team-list">
                    {teamMembers.map(member => (
                      <div key={member.id} className="plan-team-member">
                        <div className="plan-team-avatar">{member.avatar}</div>
                        <div className="plan-team-info">
                          <div className="plan-team-name">{member.name}</div>
                          <div className="plan-team-role">{member.role}</div>
                        </div>
                        <div className="plan-team-capacity">
                          <div className="plan-capacity-bar">
                            <div 
                              className={`plan-capacity-fill ${member.capacity > 90 ? 'high' : member.capacity > 75 ? 'medium' : 'low'}`}
                              style={{ width: `${member.capacity}%` }}
                            />
                          </div>
                          <span className="plan-capacity-value">{member.capacity}%</span>
                        </div>
                        <div className={`plan-team-status ${member.status}`}>
                          <div className="plan-status-dot"></div>
                          <span>{member.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="plan-bottom-grid">
              {/* Financial Overview */}
              <div className="plan-card">
                <div className="plan-card-header">
                  <h3 className="plan-card-title">Financial Overview</h3>
                  <select className="plan-select-sm" defaultValue="last-30-days">
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="last-3-months">Last 3 Months</option>
                  </select>
                </div>
                <div className="plan-financial-chart">
                  <div className="plan-chart-header">
                    <div className="plan-chart-stat">
                      <span className="plan-chart-stat-label">Total Revenue</span>
                      <span className="plan-chart-stat-value">$145,000</span>
                    </div>
                    <div className="plan-chart-stat">
                      <span className="plan-chart-stat-label">Avg. Profit Margin</span>
                      <span className="plan-chart-stat-value positive">38%</span>
                    </div>
                  </div>
                  <div className="plan-chart-bars">
                    {financialData.monthlyRevenue.map((revenue, index) => (
                      <div key={index} className="plan-chart-bar-group">
                        <div className="plan-chart-bar-label">{financialData.months[index]}</div>
                        <div className="plan-chart-bars-container">
                          <div 
                            className="plan-chart-bar revenue" 
                            style={{ height: `${(revenue / 150000) * 100}%` }}
                            title={`Revenue: ${formatCurrency(revenue)}`}
                          />
                          <div 
                            className="plan-chart-bar expense" 
                            style={{ height: `${(financialData.expenses[index] / 150000) * 100}%` }}
                            title={`Expenses: ${formatCurrency(financialData.expenses[index])}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="plan-chart-legend">
                    <div className="plan-legend-item">
                      <div className="plan-legend-color revenue"></div>
                      <span>Revenue</span>
                    </div>
                    <div className="plan-legend-item">
                      <div className="plan-legend-color expense"></div>
                      <span>Expenses</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="plan-card">
                <div className="plan-card-header">
                  <h3 className="plan-card-title">Quick Actions</h3>
                </div>
                <div className="plan-quick-actions">
                  <button 
                    className="plan-action-btn blue"
                    onClick={() => setShowNewProjectModal(true)}
                  >
                    <Plus size={20} />
                    <span>New Project</span>
                  </button>
                  <button 
                    className="plan-action-btn green"
                    onClick={() => sendInvoice(1, 15000)}
                  >
                    <Send size={20} />
                    <span>Send Invoice</span>
                  </button>
                  <button 
                    className="plan-action-btn purple"
                    onClick={() => window.open('https://calendly.com', '_blank')}
                  >
                    <Calendar size={20} />
                    <span>Schedule Meeting</span>
                  </button>
                  <button 
                    className="plan-action-btn pink"
                    onClick={() => handleExport('projects')}
                  >
                    <Download size={20} />
                    <span>Export Report</span>
                  </button>
                </div>
                <div className="plan-quick-stats">
                  <div className="plan-quick-stat">
                    <span className="plan-quick-stat-label">Today's Tasks</span>
                    <span className="plan-quick-stat-value">8/12</span>
                  </div>
                  <div className="plan-quick-stat">
                    <span className="plan-quick-stat-label">Overdue</span>
                    <span className="plan-quick-stat-value">2</span>
                  </div>
                  <div className="plan-quick-stat">
                    <span className="plan-quick-stat-label">Upcoming</span>
                    <span className="plan-quick-stat-value">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="plan-content">
            <div className="plan-toolbar">
              <div className="plan-search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="plan-toolbar-actions">
                <div className="plan-filter-buttons">
                  <button 
                    className={`plan-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`plan-filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('in-progress')}
                  >
                    In Progress
                  </button>
                  <button 
                    className={`plan-filter-btn ${activeFilter === 'review' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('review')}
                  >
                    Review
                  </button>
                  <button 
                    className={`plan-filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('completed')}
                  >
                    Completed
                  </button>
                </div>
                <button 
                  className="plan-btn-ghost"
                  onClick={() => handleExport('projects')}
                >
                  <Download size={18} />
                  <span>Export</span>
                </button>
                <button 
                  className="plan-btn-primary"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <Plus size={18} />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            <div className="plan-table-card">
              <table className="plan-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Budget</th>
                    <th>Profit</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredProjects().map(project => (
                    <tr key={project.id}>
                      <td className="plan-table-primary">
                        <div className="plan-table-project">
                          <div className="plan-table-project-name">{project.name}</div>
                          <div className="plan-table-project-description">{project.description}</div>
                        </div>
                      </td>
                      <td>
                        <div className="plan-table-client">
                          <div className="plan-table-client-name">{project.client}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`plan-status-badge ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <div className="plan-progress-cell">
                          <div className="plan-progress-bar-small">
                            <div 
                              className={`plan-progress-fill ${getStatusColor(project.status)}`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="plan-progress-text-small">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="plan-table-money">{formatCurrency(project.budget)}</td>
                      <td className={`plan-table-money ${calculateProfit(project.budget, project.actualCost) >= 0 ? 'positive' : 'negative'}`}>
                        {formatCurrency(calculateProfit(project.budget, project.actualCost))}
                      </td>
                      <td>
                        <div className="plan-table-deadline">
                          <span>{project.deadline}</span>
                          <span className="plan-deadline-days">
                            {Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`plan-priority-badge ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </td>
                      <td>
                        <div className="plan-table-actions">
                          <button 
                            className="plan-icon-btn-sm" 
                            title="View Details"
                            onClick={() => setSelectedProject(project.id)}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="plan-icon-btn-sm" 
                            title="Edit Project"
                            onClick={() => updateProject(project.id, { status: 'in-progress' })}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="plan-icon-btn-sm" 
                            title="Send Invoice"
                            onClick={() => sendInvoice(clients.find(c => c.name === project.client)?.id, project.budget)}
                          >
                            <Send size={16} />
                          </button>
                          <button 
                            className="plan-icon-btn-sm" 
                            title="Delete Project"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="plan-project-cards">
              <h3 className="plan-section-title">Project Overview</h3>
              <div className="plan-cards-grid">
                {getFilteredProjects().map(project => (
                  <div key={project.id} className="plan-project-card">
                    <div className="plan-project-card-header">
                      <h4>{project.name}</h4>
                      <button 
                        className="plan-icon-btn-sm"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className="plan-project-card-client">{project.client}</div>
                    <div className="plan-project-card-progress">
                      <div className="plan-progress-bar">
                        <div 
                          className={`plan-progress-fill ${getStatusColor(project.status)}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="plan-project-card-footer">
                      <div className="plan-project-card-budget">{formatCurrency(project.budget)}</div>
                      <div className="plan-project-card-actions">
                        <button 
                          className="plan-btn-sm"
                          onClick={() => updateProject(project.id, { progress: Math.min(100, project.progress + 10) })}
                        >
                          +10%
                        </button>
                        <button 
                          className="plan-btn-sm success"
                          onClick={() => updateProject(project.id, { status: 'completed', progress: 100 })}
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="plan-content">
            <div className="plan-toolbar">
              <div className="plan-search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search clients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="plan-toolbar-actions">
                <button 
                  className="plan-btn-ghost"
                  onClick={() => handleExport('clients')}
                >
                  <Download size={18} />
                  <span>Export</span>
                </button>
                <button 
                  className="plan-btn-primary"
                  onClick={() => setShowNewClientModal(true)}
                >
                  <Plus size={18} />
                  <span>Add Client</span>
                </button>
              </div>
            </div>

            <div className="plan-clients-grid">
              {getFilteredClients().map(client => (
                <div key={client.id} className="plan-client-card">
                  <div className="plan-client-header">
                    <div className={`plan-client-avatar ${client.avatarColor}`}>
                      {client.name.charAt(0)}
                    </div>
                    <div className="plan-client-actions">
                      <button 
                        className="plan-icon-btn-sm"
                        onClick={() => window.open(`mailto:${client.email}`, '_blank')}
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </button>
                      <button 
                        className="plan-icon-btn-sm"
                        onClick={() => window.open(`tel:${client.phone}`, '_blank')}
                        title="Call Client"
                      >
                        <Phone size={16} />
                      </button>
                      <button className="plan-icon-btn-sm">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="plan-client-info">
                    <h4 className="plan-client-name">{client.name}</h4>
                    <div className="plan-client-company">{client.company}</div>
                    <div className={`plan-client-status ${client.status}`}>
                      <div className="plan-status-dot"></div>
                      <span>{client.status}</span>
                    </div>
                  </div>
                  <div className="plan-client-contact">
                    <div className="plan-contact-item">
                      <Mail size={14} />
                      <span>{client.email}</span>
                    </div>
                    <div className="plan-contact-item">
                      <Phone size={14} />
                      <span>{client.phone}</span>
                    </div>
                    <div className="plan-contact-item">
                      <MapPin size={14} />
                      <span>{client.location}</span>
                    </div>
                  </div>
                  <div className="plan-client-stats">
                    <div className="plan-client-stat">
                      <span className="plan-stat-label-sm">Projects</span>
                      <span className="plan-stat-value-sm">{client.projects}</span>
                    </div>
                    <div className="plan-client-stat">
                      <span className="plan-stat-label-sm">Revenue</span>
                      <span className="plan-stat-value-sm">{formatCurrency(client.revenue)}</span>
                    </div>
                    <div className="plan-client-stat">
                      <span className="plan-stat-label-sm">Type</span>
                      <span className="plan-stat-value-sm">{client.contractType}</span>
                    </div>
                  </div>
                  <div className="plan-client-footer">
                    <span className="plan-last-contact">
                      <Clock size={12} />
                      Last contact: {client.lastContact}
                    </span>
                    <div className="plan-client-footer-actions">
                      <button 
                        className="plan-btn-ghost-sm"
                        onClick={() => sendInvoice(client.id, 5000)}
                      >
                        Invoice
                      </button>
                      <button className="plan-btn-ghost-sm">Profile</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="plan-content">
            <div className="plan-roadmap-header">
              <h2>90-Day Agency Launch Plan</h2>
              <p className="plan-roadmap-subtitle">
                Your step-by-step guide to building a successful web design agency
              </p>
              <div className="plan-roadmap-stats">
                <div className="plan-roadmap-stat">
                  <span className="plan-roadmap-stat-label">Total Progress</span>
                  <span className="plan-roadmap-stat-value">48%</span>
                </div>
                <div className="plan-roadmap-stat">
                  <span className="plan-roadmap-stat-label">Phases Completed</span>
                  <span className="plan-roadmap-stat-value">3/8</span>
                </div>
                <div className="plan-roadmap-stat">
                  <span className="plan-roadmap-stat-label">Days Remaining</span>
                  <span className="plan-roadmap-stat-value">42</span>
                </div>
              </div>
            </div>

            <div className="plan-roadmap-container">
              {businessRoadmap.map((phase, index) => (
                <div key={phase.id} className="plan-roadmap-phase">
                  <div className="plan-phase-header">
                    <div className="plan-phase-marker">
                      <div className={`plan-phase-icon ${phase.color}`}>
                        {index + 1}
                      </div>
                      <div className="plan-phase-line"></div>
                    </div>
                    <div className="plan-phase-info">
                      <div className="plan-phase-title-group">
                        <span className="plan-phase-category">{phase.phase}</span>
                        <h3 className="plan-phase-title">{phase.title}</h3>
                      </div>
                      <div className="plan-phase-meta">
                        <span className="plan-phase-weeks">{phase.weeks}</span>
                        <span className="plan-phase-date">{phase.date}</span>
                        <div className="plan-phase-progress">
                          <div className="plan-progress-bar-small">
                            <div 
                              className={`plan-progress-fill ${phase.color}`}
                              style={{ width: `${phase.progress}%` }}
                            />
                          </div>
                          <span className="plan-progress-text-small">{phase.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="plan-phase-tasks">
                    {phase.tasks.map(task => (
                      <div key={task.id} className="plan-task-card">
                        <div className="plan-task-header">
                          <div className="plan-task-checkbox">
                            <button 
                              className={`plan-task-check ${task.completed ? 'completed' : ''}`}
                              onClick={() => {
                                const updatedRoadmap = [...businessRoadmap];
                                updatedRoadmap[index].tasks = updatedRoadmap[index].tasks.map(t =>
                                  t.id === task.id ? { ...t, completed: !t.completed } : t
                                );
                                setBusinessRoadmap(updatedRoadmap);
                              }}
                            >
                              {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                            </button>
                            <h4 className="plan-task-title">{task.title}</h4>
                          </div>
                          <div className="plan-task-time">{task.time}</div>
                        </div>
                        <p className="plan-task-description">{task.description}</p>
                        <div className="plan-task-footer">
                          <span className="plan-task-deliverable">
                            <FileText size={14} />
                            {task.deliverable}
                          </span>
                          <div className="plan-task-actions">
                            {task.title.includes('Template') && (
                              <button 
                                className="plan-btn-ghost-sm"
                                onClick={() => window.open('https://docs.google.com', '_blank')}
                              >
                                View Template
                              </button>
                            )}
                            {task.title.includes('Email') && (
                              <button 
                                className="plan-btn-ghost-sm"
                                onClick={() => window.open('https://mail.google.com', '_blank')}
                              >
                                Open Email
                              </button>
                            )}
                            {task.title.includes('Website') && (
                              <button 
                                className="plan-btn-ghost-sm"
                                onClick={() => window.open('https://vercel.com', '_blank')}
                              >
                                View Site
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="plan-phase-actions">
                    <button className="plan-btn-primary">
                      {phase.progress === 100 ? 'Phase Completed' : 'Start Phase'}
                    </button>
                    <button className="plan-btn-ghost">
                      View Detailed Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="plan-roadmap-tools">
              <h3 className="plan-section-title">Roadmap Tools</h3>
              <div className="plan-tools-grid">
                <div className="plan-tool-card">
                  <div className="plan-tool-icon">
                    <Calendar size={24} />
                  </div>
                  <h4>Calendar Integration</h4>
                  <p>Sync tasks with Google Calendar</p>
                  <button 
                    className="plan-btn-sm"
                    onClick={() => window.open('https://calendar.google.com', '_blank')}
                  >
                    Connect
                  </button>
                </div>
                <div className="plan-tool-card">
                  <div className="plan-tool-icon">
                    <Download size={24} />
                  </div>
                  <h4>Export Plan</h4>
                  <p>Download full roadmap as PDF</p>
                  <button 
                    className="plan-btn-sm"
                    onClick={() => alert('Roadmap exported successfully!')}
                  >
                    Export PDF
                  </button>
                </div>
                <div className="plan-tool-card">
                  <div className="plan-tool-icon">
                    <Share2 size={24} />
                  </div>
                  <h4>Share Progress</h4>
                  <p>Share roadmap with team</p>
                  <button 
                    className="plan-btn-sm"
                    onClick={() => alert('Share link copied to clipboard!')}
                  >
                    Share
                  </button>
                </div>
                <div className="plan-tool-card">
                  <div className="plan-tool-icon">
                    <BarChart3 size={24} />
                  </div>
                  <h4>Progress Analytics</h4>
                  <p>View detailed progress reports</p>
                  <button 
                    className="plan-btn-sm"
                    onClick={() => setActiveTab('reports')}
                  >
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="plan-content">
            <div className="plan-messages-container">
              <div className="plan-messages-sidebar">
                <div className="plan-messages-search">
                  <Search size={18} />
                  <input type="text" placeholder="Search messages..." />
                </div>
                <div className="plan-conversations-list">
                  {clients.map(client => (
                    <div key={client.id} className="plan-conversation-item">
                      <div className={`plan-conversation-avatar ${client.avatarColor}`}>
                        {client.name.charAt(0)}
                      </div>
                      <div className="plan-conversation-info">
                        <div className="plan-conversation-name">{client.name}</div>
                        <div className="plan-conversation-preview">
                          {client.notes.substring(0, 30)}...
                        </div>
                      </div>
                      <div className="plan-conversation-time">2 min ago</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="plan-messages-main">
                <div className="plan-messages-header">
                  <div className="plan-messages-client">
                    <div className={`plan-client-avatar-small blue`}>
                      JD
                    </div>
                    <div className="plan-client-info-small">
                      <div className="plan-client-name-small">John Doe</div>
                      <div className="plan-client-status-small">Online</div>
                    </div>
                  </div>
                  <div className="plan-messages-actions">
                    <button className="plan-icon-btn-sm">
                      <Phone size={16} />
                    </button>
                    <button className="plan-icon-btn-sm">
                      <Video size={16} />
                    </button>
                    <button className="plan-icon-btn-sm">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
                <div className="plan-messages-list">
                  {chatMessages.map(message => (
                    <div key={message.id} className={`plan-message-item ${message.sender}`}>
                      <div className="plan-message-content">
                        <div className="plan-message-text">{message.message}</div>
                        <div className="plan-message-time">{message.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="plan-messages-input">
                  <button className="plan-icon-btn">
                    <Paperclip size={20} />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button className="plan-icon-btn">
                    <Smile size={20} />
                  </button>
                  <button 
                    className="plan-btn-primary"
                    onClick={sendMessage}
                  >
                    <SendHorizontal size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {!['dashboard', 'projects', 'clients', 'roadmap', 'messages'].includes(activeTab) && (
          <div className="plan-content">
            <div className="plan-placeholder">
              <div className="plan-placeholder-icon">
                {activeTab === 'finance' && <DollarSign size={48} />}
                {activeTab === 'team' && <Users size={48} />}
                {activeTab === 'calendar' && <Calendar size={48} />}
                {activeTab === 'reports' && <BarChart3 size={48} />}
                {activeTab === 'settings' && <Settings size={48} />}
              </div>
              <h3 className="plan-placeholder-title">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
              </h3>
              <p className="plan-placeholder-text">
                This section is under active development. Advanced features coming soon!
              </p>
              <button 
                className="plan-btn-primary"
                onClick={() => alert('Feature coming soon!')}
              >
                <Plus size={18} />
                <span>Get Early Access</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="plan-footer">
          <div className="plan-footer-content">
            <div className="plan-footer-left">
              <span>© 2024 DesignFlow Pro. All rights reserved.</span>
              <div className="plan-footer-links">
                <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Support</a>
              </div>
            </div>
            <div className="plan-footer-right">
              <div className="plan-footer-social">
                <button 
                  className="plan-icon-btn-sm"
                  onClick={() => window.open('https://twitter.com', '_blank')}
                >
                  <Twitter size={16} />
                </button>
                <button 
                  className="plan-icon-btn-sm"
                  onClick={() => window.open('https://linkedin.com', '_blank')}
                >
                  <Linkedin size={16} />
                </button>
                <button 
                  className="plan-icon-btn-sm"
                  onClick={() => window.open('https://instagram.com', '_blank')}
                >
                  <Instagram size={16} />
                </button>
              </div>
              <div className="plan-footer-version">v3.0.0</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Plan;