// File: Plan.jsx
import { useState } from 'react';
import './Plan3.css';

export default function Plan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const metrics = [
    { title: 'Active Projects', value: '18', change: '+12%', positive: true, accent: 'blue' },
    { title: 'Total Clients', value: '142', change: '+5%', positive: true, accent: 'green' },
    { title: 'Pending Tasks', value: '34', change: '-8%', positive: false, accent: 'yellow' },
    { title: 'Monthly Revenue', value: '$48,500', change: '+18%', positive: true, accent: 'purple' },
  ];

  const recentProjects = [
    { name: 'Luxury Hotel Website Redesign', client: 'Grand Plaza Hotels', status: 'In Progress', progress: 65, deadline: 'Feb 15, 2026' },
    { name: 'E-Commerce Platform', client: 'Urban Outfit Co', status: 'Pending Review', progress: 90, deadline: 'Jan 20, 2026' },
    { name: 'Corporate Branding Site', client: 'Vertex Tech', status: 'Completed', progress: 100, deadline: 'Jan 10, 2026' },
    { name: 'Portfolio Showcase', client: 'Creative Minds Studio', status: 'In Progress', progress: 40, deadline: 'Mar 01, 2026' },
    { name: 'SaaS Dashboard UI', client: 'Nexus Solutions', status: 'Delayed', progress: 25, deadline: 'Jan 25, 2026' },
  ];

  const upcomingTasks = [
    { task: 'Finalize homepage mockup for Vertex Tech', assigned: 'Sarah', due: 'Jan 18, 2026', priority: 'High' },
    { task: 'Client feedback call – Urban Outfit Co', assigned: 'Mike', due: 'Jan 19, 2026', priority: 'Medium' },
    { task: 'Deploy staging site for Grand Plaza', assigned: 'Alex', due: 'Jan 20, 2026', priority: 'High' },
    { task: 'Update SEO keywords report', assigned: 'Emma', due: 'Jan 22, 2026', priority: 'Low' },
  ];

  const recentActivity = [
    { user: 'Sarah', action: 'completed wireframes', target: 'Luxury Hotel Redesign', time: '2 hours ago' },
    { user: 'Mike', action: 'uploaded new assets', target: 'E-Commerce Platform', time: '4 hours ago' },
    { user: 'Alex', action: 'sent invoice', target: 'Vertex Tech', time: '6 hours ago' },
    { user: 'Emma', action: 'added comments', target: 'Portfolio Showcase', time: '1 day ago' },
  ];

  const revenueData = [28, 32, 38, 35, 42, 48, 45, 52, 58, 55, 60, 68]; // in thousands
  const maxRevenue = Math.max(...revenueData);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const statusData = [
    { label: 'Completed', value: 45, color: '--green-soft' },
    { label: 'In Progress', value: 18, color: '--blue-soft' },
    { label: 'Pending Review', value: 12, color: '--yellow-soft' },
    { label: 'Delayed', value: 5, color: '--pink-soft' },
  ];
  const totalProjects = statusData.reduce((sum, s) => sum + s.value, 0);

  const navItems = [
    { label: 'Dashboard', active: true },
    { label: 'Projects' },
    { label: 'Clients' },
    { label: 'Team' },
    { label: 'Tasks' },
    { label: 'Invoices' },
    { label: 'Calendar' },
    { label: 'Analytics' },
    { label: 'Settings' },
  ];

  return (
    <div className="dashboard">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">Nova Studio</h2>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.label} className={item.active ? 'active' : ''}>
                <a href={`/plan#${item.label.toLowerCase().replace(/\s+/g, '-')}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
            <h1>Dashboard Overview</h1>
          </div>
          <div className="header-right">
            <input type="search" className="search-input" placeholder="Search projects, clients..." />
            <div className="notifications">
              <span className="bell">🔔</span>
              <span className="badge">3</span>
            </div>
            <div className="profile">
              <div className="avatar">AD</div>
              <span>Admin</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          {/* Metrics */}
          <section className="metrics-section">
            <div className="metrics-grid">
              {metrics.map((m) => (
                <div key={m.title} className={`metric-card accent-${m.accent}`}>
                  <p className="metric-title">{m.title}</p>
                  <p className="metric-value">{m.value}</p>
                  <p className={`metric-change ${m.positive ? 'positive' : 'negative'}`}>
                    {m.change} from last month
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Analytics Charts */}
          <section className="charts-section">
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Monthly Revenue (2025)</h3>
                <div className="bar-chart">
                  {revenueData.map((value, i) => (
                    <div className="bar-item" key={i}>
                      <div className="bar" style={{ height: `${(value / maxRevenue) * 100}%` }} />
                      <span className="bar-label">{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <h3>Project Status Overview</h3>
                <div className="status-chart">
                  {statusData.map((s) => (
                    <div className="status-item" key={s.label}>
                      <div className="status-label">
                        {s.label} <span className="status-count">{s.value}</span>
                      </div>
                      <div className="progress-container">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(s.value / totalProjects) * 100}%`,
                            backgroundColor: `var(${s.color})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Recent Projects */}
          <section className="projects-section">
            <h2 className="section-title">Recent Projects</h2>
            <div className="table-wrapper">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((p) => (
                    <tr key={p.name}>
                      <td className="project-name">{p.name}</td>
                      <td>{p.client}</td>
                      <td>
                        <span className={`badge status-${p.status.toLowerCase().replace(' ', '-')}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div className="progress-container">
                          <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="progress-text">{p.progress}%</span>
                      </td>
                      <td>{p.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tasks & Activity */}
          <section className="bottom-grid">
            <div className="tasks-card">
              <h3>Upcoming Tasks</h3>
              <ul className="tasks-list">
                {upcomingTasks.map((t) => (
                  <li key={t.task} className="task-item">
                    <div className="task-info">
                      <p className="task-name">{t.task}</p>
                      <p className="task-meta">
                        Assigned to <strong>{t.assigned}</strong> · Due {t.due}
                      </p>
                    </div>
                    <span className={`priority priority-${t.priority.toLowerCase()}`}>{t.priority}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="activity-card">
              <h3>Recent Activity</h3>
              <ul className="activity-list">
                {recentActivity.map((a) => (
                  <li key={a.action + a.target} className="activity-item">
                    <div className="activity-avatar">{a.user[0]}</div>
                    <div className="activity-text">
                      <strong>{a.user}</strong> {a.action} on <em>{a.target}</em>
                      <span className="activity-time">{a.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}