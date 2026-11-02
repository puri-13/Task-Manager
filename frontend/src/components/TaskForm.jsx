import { useEffect, useState } from "react";
import { CATEGORIES, PRIORITIES, STATUSES, statusLabel } from "../utils";

const emptyTask = { title: "", description: "", category: "WORK", priority: "MEDIUM", dueDate: "", status: "TODO" };

export default function TaskForm({ task, onSave, onCancel }) {
  const [values, setValues] = useState(emptyTask);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(task ? {
      title: task.title || "", description: task.description || "", category: task.category || "WORK",
      priority: task.priority || "MEDIUM", dueDate: task.dueDate || "", status: task.status || "TODO"
    } : emptyTask);
  }, [task]);

  const update = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setErrors((current) => ({ ...current, [event.target.name]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = "Please enter a task title.";
    else if (values.title.trim().length > 120) nextErrors.title = "Keep the title under 120 characters.";
    if (values.description.length > 2000) nextErrors.description = "Keep the description under 2,000 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      await onSave({ ...values, title: values.title.trim(), description: values.description.trim() });
    } catch {
      // The parent displays the API error; keep the form open so the user can retry.
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="task-form" onSubmit={submit} noValidate>
      <div className="form-field">
        <label htmlFor="task-title">Task name <span className="required">*</span></label>
        <input id="task-title" name="title" value={values.title} onChange={update} placeholder="e.g. Prepare project proposal" maxLength="120" autoFocus aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "title-error" : undefined} />
        {errors.title && <span className="field-error" id="title-error">{errors.title}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="task-description">Description <span className="optional">Optional</span></label>
        <textarea id="task-description" name="description" value={values.description} onChange={update} placeholder="Add a few details to help you get started..." rows="3" maxLength="2000" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined} />
        {errors.description && <span className="field-error" id="description-error">{errors.description}</span>}
      </div>
      <div className="form-grid">
        <div className="form-field"><label htmlFor="task-category">Category</label><select id="task-category" name="category" value={values.category} onChange={update}>{CATEGORIES.map((item) => <option key={item} value={item}>{item[0] + item.slice(1).toLowerCase()}</option>)}</select></div>
        <div className="form-field"><label htmlFor="task-priority">Priority</label><select id="task-priority" name="priority" value={values.priority} onChange={update}>{PRIORITIES.map((item) => <option key={item} value={item}>{item[0] + item.slice(1).toLowerCase()}</option>)}</select></div>
      </div>
      <div className="form-grid">
        <div className="form-field"><label htmlFor="task-due-date">Due date <span className="optional">Optional</span></label><input id="task-due-date" type="date" name="dueDate" value={values.dueDate} onChange={update} /></div>
        {task && <div className="form-field"><label htmlFor="task-status">Status</label><select id="task-status" name="status" value={values.status} onChange={update}>{STATUSES.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></div>}
      </div>
      <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? "Saving..." : task ? "Save changes" : "Create task"}</button></div>
    </form>
  );
}
