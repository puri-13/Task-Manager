import { useEffect, useRef } from "react";
import { Menu, Moon, Plus, Search, Sun } from "lucide-react";

export default function Navbar({ search, onSearch, onNewTask, darkMode, onToggleTheme, onMenu }) {
  const searchInput = useRef(null);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
      <label className="search-box">
        <Search size={17} />
        <input ref={searchInput} aria-label="Search tasks" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search tasks..." />
        <span className="search-shortcut">⌘ K</span>
      </label>
      <div className="topbar-actions">
        <button className="icon-button theme-button" onClick={onToggleTheme} aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="button button-primary new-task-button" onClick={onNewTask}><Plus size={17} /><span>New task</span></button>
      </div>
    </header>
  );
}
