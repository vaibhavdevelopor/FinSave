import { useState, useEffect } from "react";
import { Bell, Sun, Moon, Search, Menu, Sparkles } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function Topbar({ onMenuToggle }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const showSearch = location.pathname === "/discover";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDark(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    if (notifOpen) {
      axios.get(`${apiBaseUrl}/offers`).then((res) => {
        setOffers(res.data?.offers || []);
      });
    }
  }, [notifOpen]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="theme-hover rounded-2xl p-3"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5 theme-muted" />
        </button>

        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] theme-muted">
            FinSave control room
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              Find the smarter reward path
            </h2>
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-orange-300 sm:inline-flex">
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:ml-6 lg:flex-1 lg:justify-end">
        {showSearch && (
          <div className="theme-input flex min-w-0 flex-1 items-center rounded-2xl px-4 py-3 lg:max-w-xl">
            <Search className="theme-muted h-5 w-5" />
            <input
              type="text"
              placeholder="Search offers, brands, or payment flows"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="theme-input ml-3 w-full min-w-0 border-0 bg-transparent text-sm focus:outline-none"
            />
          </div>
        )}

        <div className="theme-panel hidden items-center gap-2 rounded-2xl px-3 py-2 xl:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] theme-muted">
              Signal
            </p>
            <p className="text-sm font-semibold">Offers synced, intent ready</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="theme-hover relative rounded-2xl p-3 transition"
          >
            <Bell className="h-5 w-5 theme-muted transition" />
            {offers.length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
            )}
          </button>

          {notifOpen && (
            <div className="theme-panel-strong absolute right-0 mt-3 w-80 rounded-2xl p-4">
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] theme-muted">
                Fresh signals
              </p>
              {offers.length === 0 ? (
                <p className="theme-muted text-sm">No new notifications</p>
              ) : (
                offers.slice(0, 5).map((offer) => (
                  <div
                    key={offer.id}
                    className="theme-hover mb-2 cursor-pointer rounded-2xl p-3 text-sm last:mb-0"
                    onClick={() => window.open(offer.link, "_blank")}
                  >
                    <span className="font-medium">{offer.platform}</span>: {offer.title}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setDark(!dark)}
          className="theme-hover rounded-2xl p-3 transition"
        >
          {dark ? (
            <Sun className="h-5 w-5 theme-muted" />
          ) : (
            <Moon className="h-5 w-5 theme-muted" />
          )}
        </button>

        <div className="relative">
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 font-bold text-white shadow-lg shadow-orange-500/20"
          >
            V
          </div>

          {menuOpen && (
            <div className="theme-panel-strong absolute right-0 mt-3 w-44 rounded-2xl p-2">
              <button
                onClick={() => navigate("/profile")}
                className="theme-hover w-full rounded-xl px-3 py-2 text-left text-sm"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="theme-hover w-full rounded-xl px-3 py-2 text-left text-sm"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-400 hover:bg-red-600/20"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
