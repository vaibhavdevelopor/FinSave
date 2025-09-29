import { NavLink } from "react-router-dom";
import { LayoutDashboard, Search, User } from "lucide-react";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "from-pink-500 to-purple-500",
  },
  {
    to: "/discover",
    label: "Discover",
    icon: Search,
    color: "from-green-400 to-emerald-500",
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
    color: "from-blue-400 to-indigo-500",
  },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 flex flex-col justify-between bg-gray-900/50 backdrop-blur-lg border-r border-white/10 sticky top-0">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-10">
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold">FinSave</h1>
        </div>

        {/* Nav Links */}
        <nav className="space-y-2">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition
                 ${
                   isActive
                     ? `text-white bg-gradient-to-r ${link.color} shadow-lg`
                     : "text-gray-400 hover:text-white hover:bg-white/10"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Soft glow behind active link */}
                  {isActive && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${link.color} blur-lg opacity-30 rounded-xl`}
                    />
                  )}
                  <link.icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} FinSave
      </div>
    </aside>
  );
}
