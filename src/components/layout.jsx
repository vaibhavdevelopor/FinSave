import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const syncSidebar = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    syncSidebar();
    window.addEventListener("resize", syncSidebar);

    return () => window.removeEventListener("resize", syncSidebar);
  }, []);

  return (
    <div className="theme-shell premium-grid relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute right-[-6%] top-[18%] h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[26%] h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`theme-sidebar fixed inset-y-4 left-4 z-40 flex transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-[120%]"
        } ${sidebarCollapsed ? "w-24" : "w-72"}`}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
          onNavigate={() => {
            if (window.innerWidth < 1024) {
              setSidebarOpen(false);
            }
          }}
        />
      </aside>

      <div
        className={`relative z-10 flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? (sidebarCollapsed ? "lg:pl-32" : "lg:pl-80") : "lg:pl-8"
        }`}
      >
        <div className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="theme-panel-strong ambient-glow relative z-30 rounded-[28px] border px-4 py-4 sm:px-6">
            <Topbar onMenuToggle={() => setSidebarOpen((value) => !value)} />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
