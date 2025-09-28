import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 backdrop-blur-lg border-r border-white/10">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar aligned with content */}
        <div className="px-8 py-4 border-b border-white/10">
          <Topbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
