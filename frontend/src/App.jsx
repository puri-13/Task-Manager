import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { taskApi, getErrorMessage } from "./api/taskApi";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import TaskModal from "./components/TaskModal";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import { isOverdue } from "./utils";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [modalTask, setModalTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("taskflow-theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("taskflow-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      setTasks(await taskApi.getAll());
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error);
      setLoadError(message);
      notify(`Could not load tasks: ${message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const saveTask = async (values) => {
    try {
      if (modalTask?.id) {
        const updated = await taskApi.update(modalTask.id, values);
        setTasks((current) => current.map((task) => task.id === updated.id ? updated : task));
        notify("Task updated successfully");
      } else {
        const created = await taskApi.create(values);
        setTasks((current) => [created, ...current]);
        notify("Task created successfully");
      }
      setFormOpen(false);
      setModalTask(null);
    } catch (error) {
      notify(`Could not save task: ${getErrorMessage(error)}`, "error");
      throw error;
    }
  };

  const removeTask = async () => {
    if (!deleteTask) return;
    try {
      await taskApi.remove(deleteTask.id);
      setTasks((current) => current.filter((task) => task.id !== deleteTask.id));
      setDeleteTask(null);
      notify("Task deleted");
    } catch (error) {
      notify(`Could not delete task: ${getErrorMessage(error)}`, "error");
    }
  };

  const changeStatus = async (task, status) => {
    try {
      const updated = await taskApi.updateStatus(task.id, status);
      setTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
      notify(status === "COMPLETED" ? "Task completed — nice work!" : "Task status updated");
    } catch (error) {
      notify(`Could not update status: ${getErrorMessage(error)}`, "error");
    }
  };

  const openNewTask = () => { setModalTask(null); setFormOpen(true); };
  const openEditTask = (task) => { setModalTask(task); setFormOpen(true); };

  const metrics = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "COMPLETED").length;
    return {
      total: tasks.length,
      completed,
      pending: tasks.filter((task) => task.status !== "COMPLETED").length,
      overdue: tasks.filter(isOverdue).length,
      percent: tasks.length ? Math.round((completed / tasks.length) * 100) : 0
    };
  }, [tasks]);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} tasks={tasks} />
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <main className="main-shell">
        <Navbar
          search={search}
          onSearch={setSearch}
          onNewTask={openNewTask}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((value) => !value)}
          onMenu={() => setSidebarOpen((value) => !value)}
        />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage tasks={tasks} loading={loading} loadError={loadError} onRetry={loadTasks} search={search} metrics={metrics} onNewTask={openNewTask} onEdit={openEditTask} onDelete={setDeleteTask} onStatus={changeStatus} />} />
            <Route path="/tasks" element={<TasksPage tasks={tasks} loading={loading} loadError={loadError} onRetry={loadTasks} search={search} onEdit={openEditTask} onDelete={setDeleteTask} onStatus={changeStatus} />} />
            <Route path="/today" element={<TasksPage tasks={tasks} loading={loading} loadError={loadError} onRetry={loadTasks} search={search} scope="today" onEdit={openEditTask} onDelete={setDeleteTask} onStatus={changeStatus} />} />
            <Route path="/upcoming" element={<TasksPage tasks={tasks} loading={loading} loadError={loadError} onRetry={loadTasks} search={search} scope="upcoming" onEdit={openEditTask} onDelete={setDeleteTask} onStatus={changeStatus} />} />
            <Route path="/completed" element={<TasksPage tasks={tasks} loading={loading} loadError={loadError} onRetry={loadTasks} search={search} scope="completed" onEdit={openEditTask} onDelete={setDeleteTask} onStatus={changeStatus} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      {formOpen && <TaskModal task={modalTask} onClose={() => { setFormOpen(false); setModalTask(null); }} onSave={saveTask} />}
      {deleteTask && <ConfirmModal title="Delete task?" message={`“${deleteTask.title}” will be permanently removed.`} onCancel={() => setDeleteTask(null)} onConfirm={removeTask} />}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
