import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  User,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const links = [
  {
    to: "/dashboard",
    label: "Command",
    icon: LayoutDashboard,
    color: "from-orange-400 via-pink-500 to-fuchsia-500",
  },
  {
    to: "/discover",
    label: "Explore",
    icon: Search,
    color: "from-sky-400 to-cyan-500",
  },
  {
    to: "/profile",
    label: "Identity",
    icon: User,
    color: "from-violet-400 to-indigo-500",
  },
  {
    to: "/settings",
    label: "Controls",
    icon: Settings,
    color: "from-amber-300 to-orange-500",
  },
];

export default function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}) {
  return (
    <aside className="flex h-full w-full flex-col justify-between">
      <div className="px-4 py-4">
        <div className="mb-8 flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-fuchsia-600 text-lg font-black text-white shadow-lg shadow-orange-500/20">
              F
            </div>
            {!collapsed && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] theme-muted">
                  Premium savings
                </p>
                <h1 className="text-xl font-black tracking-tight">FinSave</h1>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="theme-hover hidden rounded-2xl p-2 lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5 theme-muted" />
            ) : (
              <PanelLeftClose className="h-5 w-5 theme-muted" />
            )}
          </button>
        </div>

        {!collapsed && (
          <div className="theme-panel mb-6 rounded-[28px] p-5">
            <p className="text-xs uppercase tracking-[0.28em] theme-muted">
              Money intelligence
            </p>
            <h2 className="mt-3 text-2xl font-black leading-tight">
              Cashback, sharper than the checkout screen.
            </h2>
            <p className="mt-3 text-sm leading-6 theme-muted">
              Track live offers, compare reward rates, and move with intent.
            </p>
          </div>
        )}

        <nav className="space-y-2">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition ${
                  isActive
                    ? `text-white bg-gradient-to-r ${link.color} shadow-lg shadow-black/20`
                    : "theme-muted theme-hover"
                }`
              }
              title={collapsed ? link.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${link.color} opacity-25 blur-xl`}
                    />
                  )}
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-black/15 ring-1 ring-white/10">
                    <link.icon className="h-5 w-5" />
                  </div>
                  {!collapsed && (
                    <div className="relative z-10">
                      <p className="text-sm font-semibold">{link.label}</p>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                        Open
                      </p>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={`${collapsed ? "px-2 py-3" : "px-4 py-4"}`}>
        <div className={`theme-panel rounded-[24px] ${collapsed ? "p-2" : "p-4"}`}>
          {!collapsed && (
            <>
              <p className="text-[11px] uppercase tracking-[0.26em] theme-muted">
                Live refresh
              </p>
              <p className="mt-2 text-sm font-semibold">
                Offers sync daily from your ingestion pipeline.
              </p>
            </>
          )}
          {collapsed ? (
            <div className="flex items-center justify-center py-2">
              <span className="text-[11px] font-semibold theme-muted">
                {new Date().getFullYear()}
              </span>
            </div>
          ) : (
            <p className="mt-3 text-xs theme-muted">
              Copyright {new Date().getFullYear()}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
