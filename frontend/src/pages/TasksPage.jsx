import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, ClipboardList, ListTodo, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import TaskCard from "../components/TaskCard";
import { isOverdue, isThisWeek, isToday } from "../utils";

const PAGE_INFO = {
  "/tasks": { title: "All tasks", subtitle: "Everything you’re working on, in one place.", icon: ClipboardList },
  "/today": { title: "Today", subtitle: "A clear view of what needs your attention today.", icon: CalendarCheck2 },
  "/upcoming": { title: "Upcoming", subtitle: "Plan ahead and see what’s coming up.", icon: Sparkles },
  "/completed": { title: "Completed", subtitle: "Look at everything you’ve accomplished.", icon: ListTodo }
};

export default function TasksPage({ tasks, loading, loadError, onRetry, search, scope = "all", onEdit, onDelete, onStatus }) {
  const [filters, setFilters] = useState({ status: scope === "completed" ? "COMPLETED" : "", priority: "", category: "", due: "" });
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("board");
  const { pathname } = useLocation();
  const info = PAGE_INFO[pathname] || PAGE_INFO["/tasks"];

  useEffect(() => {
    setFilters((current) => ({ ...current, status: scope === "completed" ? "COMPLETED" : "" }));
  }, [scope]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = tasks.filter((task) => {
      if (query && !task.title.toLowerCase().includes(query)) return false;
      if (scope === "completed" && task.status !== "COMPLETED") return false;
      if (scope === "today" && (!task.dueDate || !isToday(task.dueDate))) return false;
      if (scope === "upcoming" && (!task.dueDate || task.status === "COMPLETED" || isOverdue(task) || isToday(task.dueDate))) return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.category && task.category !== filters.category) return false;
      if (filters.due === "TODAY" && !isToday(task.dueDate)) return false;
      if (filters.due === "WEEK" && !isThisWeek(task.dueDate)) return false;
      if (filters.due === "OVERDUE" && !isOverdue(task)) return false;
      return true;
    });
    const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return matches.sort((a, b) => {
      if (sort === "dueDate") return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
      if (sort === "priority") return priorityRank[a.priority] - priorityRank[b.priority];
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [tasks, search, scope, filters, sort]);

  const columns = [
    { status: "TODO", title: "To do", tone: "todo" },
    { status: "IN_PROGRESS", title: "In progress", tone: "progress" },
    { status: "COMPLETED", title: "Completed", tone: "completed" }
  ];

  const handleDrop = (event, status) => {
    event.preventDefault();
    const taskId = Number(event.dataTransfer.getData("text/plain"));
    const task = tasks.find((item) => item.id === taskId);
    if (task && task.status !== status) onStatus(task, status);
  };

  return (
    <div className="tasks-page page-enter">
      <div className="page-title-row"><div className="page-title-icon"><info.icon size={20} /></div><div><h1>{info.title}</h1><p>{info.subtitle}</p></div><span className="task-count-pill">{filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}</span></div>
      <FilterBar filters={filters} onChange={setFilters} view={view} onViewChange={setView} sort={sort} onSortChange={setSort} />
      {loading ? <div className={`task-grid ${view === "list" ? "list-view" : ""}`}>{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="skeleton-card" />)}</div> : loadError ? (
        <div className="empty-state tasks-empty"><div className="empty-icon"><ListTodo size={26} /></div><h3>Couldn’t load your tasks</h3><p>{loadError}. Check your API connection and try again.</p><button className="button button-secondary" onClick={onRetry}>Try again</button></div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state tasks-empty"><div className="empty-icon"><ListTodo size={26} /></div><h3>{search || Object.values(filters).some(Boolean) ? "No tasks match those filters" : "Nothing on your list yet"}</h3><p>{search || Object.values(filters).some(Boolean) ? "Try changing your search or filters to see more tasks." : "Create a task and make space for your next big thing."}</p></div>
      ) : view === "board" ? (
        <div className="kanban-board">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column.status);
            return <section className="kanban-column" key={column.status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, column.status)} aria-label={`${column.title} tasks`}>
              <div className="column-heading"><div className={`column-dot dot-${column.tone}`} /><h2>{column.title}</h2><span>{columnTasks.length}</span></div>
              <div className="column-cards">{columnTasks.length ? columnTasks.map((task) => <div key={task.id} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", String(task.id))}><TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatus={onStatus} compact /></div>) : <div className="column-empty">Drop tasks here</div>}</div>
            </section>;
          })}
        </div>
      ) : <div className="task-list">{filteredTasks.map((task) => <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onStatus={onStatus} />)}</div>}
      {!loading && filteredTasks.length > 0 && <div className="list-footnote">Showing {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} <span>·</span> Drag a card to move it to another status</div>}
    </div>
  );
}
