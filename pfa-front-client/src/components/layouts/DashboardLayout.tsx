import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { LayoutDashboard, FileText, Bell, User, LogOut, Menu, X } from "lucide-react";
import { DashboardLayoutProps } from "../../types";
import { useState, useEffect } from "react";
import api from "../../lib/axiosInstance";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/mes-reclamations", icon: FileText, label: "Mes reclamations" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/profile", icon: User, label: "Mon profil" },
];

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    loadNotifCount();
    const interval = setInterval(loadNotifCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const loadNotifCount = async () => {
    try {
      const res = await api.get(`/notifications/count/${user?.userId}`);
      setNotifCount(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <img
                src="/logo.png"
                alt="ReclamaCRM"
                className="h-8 object-contain cursor-pointer"
                onClick={() => navigate("/dashboard")}
              />

              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to ||
                    (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors relative ${
                        isActive
                          ? "text-teal-700 bg-teal-50"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <item.icon size={15} strokeWidth={isActive ? 2 : 1.5} />
                      {item.label}
                      {item.to === "/notifications" && notifCount > 0 && (
                        <span className="ml-1 text-[9px] bg-red-500 text-white px-1.5 py-px rounded-full font-semibold">
                          {notifCount > 9 ? "9+" : notifCount}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/profile")}
                className="hidden sm:flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-semibold">
                  {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
                </div>
                <span className="text-[13px] font-medium text-slate-700">{user?.prenom}</span>
              </button>

              <button
                onClick={handleLogout}
                className="hidden sm:flex w-8 h-8 rounded-md items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Deconnexion"
              >
                <LogOut size={15} />
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-slate-100 py-2 pb-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to ||
                  (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-teal-700 bg-teal-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                    {item.to === "/notifications" && notifCount > 0 && (
                      <span className="ml-auto text-[10px] bg-red-500 text-white px-1.5 py-px rounded-full font-semibold">
                        {notifCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}
              <div className="border-t border-slate-100 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors"
                >
                  <LogOut size={16} />
                  Deconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {(title || subtitle || actions) && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                {subtitle && (
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                    {subtitle}
                  </p>
                )}
                {title && (
                  <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
