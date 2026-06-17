import { LogOut, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { logout } from "../../features/auth/services/auth.service";
import { useState, useEffect } from "react";
import api from "../../lib/axiosInstance";

export default function Navbar() {
  const nav = useNavigate();
  const { user, setUser } = useAuth();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    loadCount();
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadCount = async () => {
    try {
      const res = await api.get(`/notifications/count/${user?.userId}`);
      setNotifCount(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="h-12 bg-white border-b border-slate-200 hidden lg:flex items-center px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <button
          onClick={() => nav("/notifications")}
          className="relative w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={1.5} />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </button>

        <div className="w-px h-5 bg-slate-200 mx-2" />

        <button
          onClick={() => logout(setUser, nav)}
          className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-slate-100 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-semibold">
            {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
          </div>
          <span className="text-[13px] font-medium text-slate-700">
            {user?.nom} {user?.prenom}
          </span>
          <LogOut size={13} className="text-slate-400 ml-1" />
        </button>
      </div>
    </nav>
  );
}
