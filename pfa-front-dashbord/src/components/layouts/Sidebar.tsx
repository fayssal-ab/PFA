import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Settings,
  UserCog,
  Briefcase,
  Bell,
  ClipboardList,
  LogOut,
  ChevronLeft,
  History,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../lib/axiosInstance";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "agent"], label: "Tableau de bord" },
  { to: "/users", icon: Users, roles: ["admin"], label: "Utilisateurs" },
  { to: "/agents", icon: UserCog, roles: ["admin", "manager"], label: "Agents" },
  { to: "/managers", icon: Briefcase, roles: ["admin"], label: "Managers" },
  { to: "/reclamations", icon: AlertTriangle, roles: ["admin", "manager"], label: "Reclamations" },
  { to: "/mes-affectations", icon: ClipboardList, roles: ["agent"], label: "Mes affectations" },
  { to: "/notifications", icon: Bell, roles: ["admin", "manager", "agent"], label: "Notifications" },
  { to: "/historique", icon: History, roles: ["admin"], label: "Historique" },
  { to: "/settings", icon: Settings, roles: ["admin"], label: "Parametres" },
];

export default function Sidebar() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const items = nav.filter((n) => n.roles.includes(user?.role || ""));

  useEffect(() => {
    loadNotificationCount();
    const interval = setInterval(loadNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const loadNotificationCount = async () => {
    try {
      const res = await api.get(`/notifications/count/${user?.userId}`);
      setNotificationCount(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    window.location.href = "/";
  };

  const roleBadge = (role?: string) => {
    if (role === "admin") return "Admin";
    if (role === "manager") return "Manager";
    if (role === "agent") return "Agent";
    return "";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className={`h-12 flex items-center ${collapsed ? "justify-center px-2" : "px-4"} border-b border-white/[0.06]`}>
        {collapsed ? (
          <img src="/logo.png" alt="ReclamaCRM" className="w-8 h-8 object-cover object-left rounded" />
        ) : (
          <img src="/logo.png" alt="ReclamaCRM" className="h-9 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
        )}
      </div>

      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.to ||
            (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-2.5 py-[7px] rounded-md transition-colors text-[13px] font-medium relative group ${
                isActive
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-teal-500 rounded-r-full" />
              )}
              <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              {!collapsed && <span>{item.label}</span>}
              {item.to === "/notifications" && notificationCount > 0 && !collapsed && (
                <span className="ml-auto text-[10px] bg-red-500 text-white px-1.5 py-px rounded-full min-w-[18px] text-center font-semibold">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
              {item.to === "/notifications" && notificationCount > 0 && collapsed && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-2 border-t border-white/[0.06]">
        {!collapsed && (
          <div className="px-2.5 py-2 mb-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-white truncate">
                {user?.nom} {user?.prenom}
              </p>
              <span className="text-[9px] bg-teal-600/20 text-teal-400 px-1.5 py-px rounded font-medium">
                {roleBadge(user?.role)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-2.5 py-[7px] rounded-md text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-[13px] font-medium ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Deconnexion" : undefined}
        >
          <LogOut size={16} strokeWidth={1.5} />
          {!collapsed && <span>Deconnexion</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-14 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white transition-colors z-10 hidden md:flex shadow-sm"
      >
        <ChevronLeft size={12} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
      </button>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden md:flex relative bg-[#0c1222] transition-all duration-200 ${
          collapsed ? "w-[56px]" : "w-[210px]"
        } flex-shrink-0 h-screen`}
      >
        <SidebarContent />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-2 left-2 z-50 w-9 h-9 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600"
        aria-label="Menu"
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="md:hidden fixed left-0 top-0 bottom-0 w-[240px] bg-[#0c1222] z-50 shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-2 right-2 w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
