import { List, LayoutGrid, SlidersHorizontal } from "lucide-react";

export default function FilterBar({ filters, onChange, view, onViewChange, sort, onSortChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="filter-toolbar">
      <div className="filters-group">
        <span className="filter-label"><SlidersHorizontal size={15} /> Filter</span>
        <select aria-label="Filter by status" value={filters.status} onChange={(event) => set("status", event.target.value)}>
          <option value="">All statuses</option><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option>
        </select>
        <select aria-label="Filter by priority" value={filters.priority} onChange={(event) => set("priority", event.target.value)}>
          <option value="">All priorities</option><option value="HIGH">High priority</option><option value="MEDIUM">Medium priority</option><option value="LOW">Low priority</option>
        </select>
        <select aria-label="Filter by category" value={filters.category} onChange={(event) => set("category", event.target.value)}>
          <option value="">All categories</option><option value="WORK">Work</option><option value="PERSONAL">Personal</option><option value="STUDY">Study</option><option value="HEALTH">Health</option><option value="OTHER">Other</option>
        </select>
        <select aria-label="Filter by due date" value={filters.due} onChange={(event) => set("due", event.target.value)}>
          <option value="">Any due date</option><option value="TODAY">Today</option><option value="WEEK">This week</option><option value="OVERDUE">Overdue</option>
        </select>
      </div>
      <div className="view-controls">
        <select aria-label="Sort tasks" value={sort} onChange={(event) => onSortChange(event.target.value)}>
          <option value="newest">Newest</option><option value="dueDate">Due date</option><option value="priority">Priority</option>
        </select>
        <div className="view-toggle" role="group" aria-label="Task view">
          <button className={view === "board" ? "selected" : ""} onClick={() => onViewChange("board")} aria-label="Board view"><LayoutGrid size={16} /></button>
          <button className={view === "list" ? "selected" : ""} onClick={() => onViewChange("list")} aria-label="List view"><List size={17} /></button>
        </div>
      </div>
    </div>
  );
}
