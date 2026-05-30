import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { 
  LayoutDashboard, Users, AlertTriangle, Settings, UserCog, 
  Briefcase, Bell, ClipboardList, LogOut, ChevronLeft, ChevronRight,
  Sparkles, TrendingUp, Activity, Shield,History
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../lib/axiosInstance";
import { Categorie } from "../../types";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "agent"], label: "Tableau de bord" },
  { to: "/users", icon: Users, roles: ["admin"], label: "Utilisateurs" },
  { to: "/agents", icon: UserCog, roles: ["admin", "manager"], label: "Agents" },
  { to: "/managers", icon: Briefcase, roles: ["admin"], label: "Managers" },
  { to: "/reclamations", icon: AlertTriangle, roles: ["admin", "manager"], label: "Réclamations" },
  { to: "/mes-affectations", icon: ClipboardList, roles: ["agent"], label: "Mes affectations" },
  { to: "/notifications", icon: Bell, roles: ["admin", "manager", "agent"], label: "Notifications" },
  { to: "/settings", icon: Settings, roles: ["admin"], label: "Paramètres" },
  { to: "/historique", icon: History, roles: ["admin"], label: "historique" },

];

export default function Sidebar() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState<Categorie[]>([]);

  const items = nav.filter(n => n.roles.includes(user?.role || ""));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categorie/get-categorie");
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <aside className={`relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} flex-shrink-0`}>
      {/* Logo section */}
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-white/10`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-white font-bold text-lg tracking-tight">Reclama</span>
              <span className="text-indigo-400 font-bold text-lg">CRM</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {items.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? "bg-white/10 text-white shadow-lg"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              title={collapsed ? item.label : ""}
            >
              <item.icon size={20} className={isActive ? "text-indigo-400" : ""} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}

        {/* Categories section */}
        {(user?.role === "admin" || user?.role === "manager") && categories.length > 0 && (
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className={`px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider ${collapsed ? 'text-center' : ''}`}>
              {!collapsed ? "Catégories" : "📁"}
            </div>
            <div className="space-y-1 mt-2">
              {categories.slice(0, collapsed ? 3 : 10).map((cat) => (
                <button
                  key={cat.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm"
                  title={collapsed ? cat.categorie : ""}
                >
                  <Activity size={16} />
                  {!collapsed && <span className="truncate">{cat.categorie}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? "Déconnexion" : ""}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
        </button>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-white hover:bg-indigo-500 transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}