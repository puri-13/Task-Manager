import { useEffect } from "react";
import { X } from "lucide-react";
import TaskForm from "./TaskForm";

export default function TaskModal({ task, onClose, onSave }) {
  useEffect(() => {
    const handleKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="modal-heading"><div><span className="eyebrow">{task ? "MAKE AN UPDATE" : "A FRESH START"}</span><h2 id="task-modal-title">{task ? "Edit task" : "Create a task"}</h2><p>{task ? "A little progress is still progress." : "What would you like to get done?"}</p></div><button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={19} /></button></div>
        <TaskForm task={task} onSave={onSave} onCancel={onClose} />
      </section>
    </div>
  );
}
