import { useEffect, useState } from "react";
import { Moon, Sun, RefreshCcw, SearchX } from "lucide-react";
import { useSearch } from "../context/SearchContext";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  const { setSearchTerm } = useSearch();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  function applyTheme(nextTheme) {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function clearSearch() {
    setSearchTerm("");
  }

  function refreshApp() {
    window.location.reload();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-extrabold">Settings</h1>
        <p className="theme-muted">
          Manage your FinSave preferences and quick app actions.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="theme-panel rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="theme-muted text-sm mt-1">
              Choose how FinSave looks for you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => applyTheme("light")}
              className={`rounded-xl px-4 py-3 border transition text-left ${
                theme === "light"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent"
                  : "theme-input"
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                <Sun className="w-4 h-4" />
                Light
              </span>
            </button>
            <button
              onClick={() => applyTheme("dark")}
              className={`rounded-xl px-4 py-3 border transition text-left ${
                theme === "dark"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent"
                  : "theme-input"
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                <Moon className="w-4 h-4" />
                Dark
              </span>
            </button>
          </div>
        </div>

        <div className="theme-panel rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <p className="theme-muted text-sm mt-1">
              Small utilities to reset the current UI state.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={clearSearch}
              className="theme-input w-full rounded-xl px-4 py-3 text-left flex items-center gap-3"
            >
              <SearchX className="w-4 h-4" />
              Clear global search
            </button>
            <button
              onClick={refreshApp}
              className="theme-input w-full rounded-xl px-4 py-3 text-left flex items-center gap-3"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh app
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
