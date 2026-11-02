import { ArrowRight, CheckCircle2, CircleAlert, ClipboardList, Clock3, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import { isOverdue } from "../utils";

export default function DashboardPage({ tasks, loading, loadError, onRetry, search, metrics, onNewTask, onEdit, onDelete, onStatus }) {
  const query = search.trim().toLowerCase();
  const active = tasks.filter((task) => task.status !== "COMPLETED" && (!query || task.title.toLowerCase().includes(query))).sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  }).slice(0, 3);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const todayLabel = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase();
  return (
    <div className="dashboard-page page-enter">
      <section className="welcome-row">
        <div><div className="eyebrow"><Sparkles size={14} /> {todayLabel}</div><h1>{greeting}<span className="wave">✦</span></h1><p>Here’s what’s happening with your tasks today.</p></div>
        <button className="button button-primary welcome-new" onClick={onNewTask}><Plus size={17} /> New task</button>
      </section>
      <section className="stats-grid" aria-label="Task statistics">
        <StatsCard label="Total tasks" value={metrics.total} caption="Across your workspace" icon={ClipboardList} tone="violet" />
        <StatsCard label="Completed" value={metrics.completed} caption="Tasks checked off" icon={CheckCircle2} tone="green" />
        <StatsCard label="Pending" value={metrics.pending} caption="Ready when you are" icon={Clock3} tone="blue" />
        <StatsCard label="Overdue" value={metrics.overdue} caption="Needs a little attention" icon={CircleAlert} tone="amber" />
      </section>
      <section className="progress-panel">
        <div className="progress-copy"><div><span className="progress-kicker">YOUR MOMENTUM</span><h2>You’re making progress</h2><p>{metrics.completed} of {metrics.total} tasks completed. Keep it up!</p></div><div className="progress-percent">{metrics.percent}<span>%</span></div></div>
        <div className="progress-track" role="progressbar" aria-label="Task completion" aria-valuenow={metrics.percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${metrics.percent}%` }} /></div>
      </section>
      <section className="task-section">
        <div className="section-heading"><div><h2>Up next</h2><p>A few things to focus on</p></div><Link to="/tasks" className="text-link">View all <ArrowRight size={15} /></Link></div>
        {loading ? <div className="task-grid">{[1, 2, 3].map((item) => <div key={item} className="skeleton-card" />)}</div> : loadError ? (
          <div className="empty-state"><div className="empty-icon"><CircleAlert size={25} /></div><h3>Couldn’t load your tasks</h3><p>{loadError}. Check your API connection and try again.</p><button className="button button-secondary" onClick={onRetry}>Try again</button></div>
        ) : active.length ? <div className="task-grid">{active.map((task) => <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onStatus={onStatus} />)}</div> : (
          <div className="empty-state"><div className="empty-icon"><CheckCircle2 size={26} /></div><h3>{query ? "No tasks match your search" : "All caught up"}</h3><p>{query ? "Try a different title or open All tasks to review completed items." : tasks.length ? "You’ve completed everything on your list. Enjoy the breathing room." : "Your task list is a blank canvas. Add your first task to get started."}</p>{!query && <button className="button button-primary" onClick={onNewTask}><Plus size={16} /> Create a task</button>}</div>
        )}
      </section>
      {metrics.overdue > 0 && <div className="overdue-note"><CircleAlert size={16} /><span>You have <strong>{metrics.overdue} overdue {metrics.overdue === 1 ? "task" : "tasks"}</strong> that may need your attention.</span><Link to="/tasks">Review tasks</Link></div>}
      <footer className="page-footnote">Made for a little more focus <span>·</span> <span className="footnote-icon">✳</span> one task at a time</footer>
    </div>
  );
}
