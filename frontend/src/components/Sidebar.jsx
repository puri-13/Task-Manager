import { Check, CheckSquare, LayoutDashboard, ListTodo, CalendarDays, CircleCheck, Layers3 } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/tasks", label: "All tasks", icon: ListTodo },
  { to: "/today", label: "Today", icon: CalendarDays },
  { to: "/upcoming", label: "Upcoming", icon: Layers3 },
  { to: "/completed", label: "Completed", icon: CircleCheck }
];

export default function Sidebar({ open, tasks }) {
  const pending = tasks.filter((task) => task.status !== "COMPLETED").length;
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <NavLink to="/" className="brand" aria-label="Taskflow home">
        <span className="brand-mark"><Check size={19} strokeWidth={3} /></span>
        <span>taskflow<span className="brand-period">.</span></span>
      </NavLink>
      <div className="workspace-picker"><div className="workspace-avatar">P</div><span className="workspace-name">Personal space</span><span className="workspace-chevron">⌄</span></div>
      <div className="nav-section-label">Workspace</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink key={to} to={to} end={exact} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            {label === "All tasks" && pending > 0 && <span className="nav-count">{pending}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <div className="tip-icon"><CheckSquare size={17} /></div>
          <div><strong>Stay in your flow</strong><span>Small steps add up.</span></div>
        </div>
        <div className="profile-row">
          <div className="profile-avatar">P</div>
          <div className="profile-copy"><strong>Personal account</strong><span>Free plan</span></div>
          <button className="icon-button profile-menu" aria-label="Account options">···</button>
        </div>
      </div>
    </aside>
  );
}
