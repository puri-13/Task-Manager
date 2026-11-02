export const STATUSES = ["TODO", "IN_PROGRESS", "COMPLETED"];
export const CATEGORIES = ["WORK", "PERSONAL", "STUDY", "HEALTH", "OTHER"];
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export const statusLabel = (status) => ({
  TODO: "To do",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed"
}[status] || status);

export const formatDate = (date) => {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })
    .format(new Date(`${date}T00:00:00`));
};

export const isOverdue = (task) =>
  task.dueDate && task.status !== "COMPLETED" && task.dueDate < new Date().toISOString().slice(0, 10);

export const isToday = (date) => date === new Date().toISOString().slice(0, 10);

export const isThisWeek = (date) => {
  if (!date) return false;
  const parsed = new Date(`${date}T00:00:00`);
  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + (7 - (start.getDay() || 7)));
  return parsed >= start && parsed <= end;
};
