import { CalendarDays, Check, Pencil, Trash2 } from "lucide-react";
import { formatDate, isOverdue, statusLabel } from "../utils";

export default function TaskCard({ task, onEdit, onDelete, onStatus, compact = false }) {
  const done = task.status === "COMPLETED";
  return (
    <article className={`task-card priority-border-${task.priority?.toLowerCase()} ${done ? "task-done" : ""} ${isOverdue(task) ? "task-overdue" : ""} ${compact ? "task-card-compact" : ""}`}>
      <div className="task-card-top">
        <span className={`category-tag category-${task.category?.toLowerCase()}`}>{task.category?.toLowerCase()}</span>
        <div className="task-actions">
          <button className="icon-button task-menu-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Pencil size={14} /></button>
          <button className="icon-button task-menu-button delete-task-button" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}><Trash2 size={15} /></button>
        </div>
      </div>
      <button className={`task-check ${done ? "task-check-done" : ""}`} onClick={() => onStatus(task, done ? "TODO" : "COMPLETED")} aria-label={done ? "Mark as incomplete" : "Mark as complete"}>
        {done && <Check size={13} strokeWidth={3} />}
      </button>
      <button className="task-title-button" onClick={() => onEdit(task)}><h3>{task.title}</h3></button>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-card-footer">
        <span className={`priority-label priority-${task.priority?.toLowerCase()}`}><i />{task.priority?.toLowerCase()}</span>
        <span className={`due-date ${isOverdue(task) ? "due-overdue" : ""}`}><CalendarDays size={14} />{formatDate(task.dueDate)}</span>
      </div>
      <span className="sr-only">Status: {statusLabel(task.status)}</span>
    </article>
  );
}
