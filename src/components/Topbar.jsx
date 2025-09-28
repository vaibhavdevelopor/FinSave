import { useState, useEffect } from "react";
import { Bell, Sun, Moon, Search } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Topbar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  // ✅ Theme toggle effect with persistence
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

  // ✅ Fetch latest offers for notifications
  useEffect(() => {
    if (notifOpen) {
      axios.get("http://localhost:5000/offers").then((res) => {
        setOffers(res.data || []);
      });
    }
  }, [notifOpen]);

  // ✅ Handle logout (clear session + redirect)
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // adjust based on your auth setup
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between relative">
      {/* Search Bar */}
      <div
        className="flex items-center flex-1 max-w-xl bg-gray-900/50 border border-white/10 
                   backdrop-blur-lg rounded-xl px-4 py-2"
      >
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search: 'electricity bill', 'Amazon', 'recharge'..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-2 bg-transparent focus:outline-none w-full text-sm text-white placeholder-gray-400"
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6 ml-6 relative">
        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full hover:bg-gray-800/50 transition"
          >
            <Bell className="w-6 h-6 text-gray-300 hover:text-white transition" />
            {offers.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-white/10 rounded-xl shadow-lg p-4">
              {offers.length === 0 ? (
                <p className="text-sm text-gray-400">No new notifications</p>
              ) : (
                offers.slice(0, 5).map((offer) => (
                  <div
                    key={offer.id}
                    className="mb-2 last:mb-0 text-sm text-gray-200 hover:bg-gray-800 p-2 rounded-lg cursor-pointer"
                    onClick={() => window.open(offer.link, "_blank")}
                  >
                    <span className="font-medium">{offer.platform}</span>:{" "}
                    {offer.title}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ☀️ / 🌙 Theme Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full hover:bg-gray-800/50 transition"
        >
          {dark ? (
            <Sun className="w-6 h-6 text-gray-300 hover:text-white" />
          ) : (
            <Moon className="w-6 h-6 text-gray-300 hover:text-white" />
          )}
        </button>

        {/* 👤 Avatar Menu */}
        <div className="relative">
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 
                       flex items-center justify-center font-bold text-white shadow-lg cursor-pointer"
          >
            V
          </div>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-white/10 rounded-xl shadow-lg p-2">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-lg"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-lg"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-600/20 rounded-lg"
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
