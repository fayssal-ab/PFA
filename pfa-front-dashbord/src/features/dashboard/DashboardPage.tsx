import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import api from "../../lib/axiosInstance";
import { useAuth } from "../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, 
  AreaChart, Area
} from "recharts";
import { 
  AlertTriangle, Users, Clock, ArrowUpRight, TrendingUp, 
  UserCheck, ClipboardList, CheckCircle2, Activity,
  Zap, Shield, Target, Eye, MessageCircle,
  BarChart3, PieChart as PieChartIcon, RefreshCw
} from "lucide-react";

interface DashboardStatsAvancees {
  parStatut: { [key: string]: number };
  parPriorite: { [key: string]: number };
  total: number;
  tauxResolution: number;
}

interface EvolutionData {
  label: string;
  count: number;
  resolved: number;
}

interface TopCategory {
  name: string;
  count: number;
}

interface TempsResolution {
  moyenneHeures: number;
  parPriorite: { [key: string]: number };
}

interface AgentPerformance {
  id: number;
  nom: string;
  prenom: string;
  reclamationsResolues: number;
  tempsMoyenResolution: number;
}

interface MesStats {
  total: number;
  enCours: number;
  resolues: number;
  enAttente: number;
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#8b5cf6", "#06b6d4"];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "";
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [stats, setStats] = useState<DashboardStatsAvancees | null>(null);
  const [evolution, setEvolution] = useState<EvolutionData[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [tempsResolution, setTempsResolution] = useState<TempsResolution | null>(null);
  const [agentsPerformance, setAgentsPerformance] = useState<AgentPerformance[]>([]);
  
  const [mesStats, setMesStats] = useState<MesStats>({ total: 0, enCours: 0, resolues: 0, enAttente: 0 });
  const [mesAffectations, setMesAffectations] = useState<any[]>([]);
  
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");

  useEffect(() => {
    loadAllData();
  }, [period, role]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      if (role === "admin" || role === "manager") {
        await loadAdminData();
      } else if (role === "agent") {
        await loadAgentData();
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAllData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const loadAdminData = async () => {
    const statsRes = await api.get("/reclamations/statistiques/avancees");
    setStats(statsRes.data);
    
    const evolutionRes = await api.get("/reclamations/statistiques/evolution", { 
      params: { periode: period, jours: period === "day" ? 7 : period === "week" ? 8 : 6 } 
    });
    setEvolution(evolutionRes.data);
    
    const categoriesRes = await api.get("/reclamations/statistiques/top-categories", { params: { limit: 5 } });
    setTopCategories(categoriesRes.data);
    
    const tempsRes = await api.get("/reclamations/statistiques/temps-moyen-resolution");
    setTempsResolution(tempsRes.data);
    
    const agentsRes = await api.get("/users/statistiques/agents-performance");
    setAgentsPerformance(agentsRes.data);
  };

  const loadAgentData = async () => {
    const affectationsRes = await api.get("/affectations/mes-affectations", { params: { page: 0, size: 100 } });
    const affectations = affectationsRes.data?.content || [];
    setMesAffectations(affectations);
    
    const enCours = affectations.filter((a: any) => a.reclamation?.status?.status === "en cours").length;
    const resolues = affectations.filter((a: any) => a.reclamation?.status?.status === "résolu").length;
    const enAttente = affectations.filter((a: any) => a.reclamation?.status?.status === "en attente").length;
    
    setMesStats({ total: affectations.length, enCours, resolues, enAttente });
    
    const evolutionRes = await api.get("/reclamations/statistiques/evolution", { params: { periode: period, jours: 7 } });
    setEvolution(evolutionRes.data);
  };

  const statutData = stats ? [
    { name: "En attente", value: stats.parStatut.enAttente || 0, color: "#f59e0b" },
    { name: "En cours", value: stats.parStatut.enCours || 0, color: "#6366f1" },
    { name: "Résolu", value: stats.parStatut.resolu || 0, color: "#10b981" },
  ] : [];

  const prioriteData = stats ? Object.entries(stats.parPriorite).map(([name, value], idx) => ({ 
    name, value, color: COLORS[idx % COLORS.length] 
  })) : [];

  if (loading) {
    return (
      <DashboardLayout title="Tableau de bord">
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={20} className="text-indigo-500 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Chargement des données...</p>
        </div>
      </DashboardLayout>
    );
  }

  // ==================== AGENT DASHBOARD ====================
  if (role === "agent") {
    const mesStatutData = [
      { name: "En attente", value: mesStats.enAttente, color: "#f59e0b" },
      { name: "En cours", value: mesStats.enCours, color: "#6366f1" },
      { name: "Résolu", value: mesStats.resolues, color: "#10b981" },
    ];

    return (
      <DashboardLayout
        title="Mon espace"
        subtitle="Agent"
        actions={
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData}
              className="h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-indigo-500 transition-all"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={() => navigate("/mes-affectations")}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium flex items-center gap-2 hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              <ClipboardList size={16} />
              Mes affectations
              <ArrowUpRight size={14} />
            </button>
          </div>
        }
      >
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <UserCheck size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Bienvenue, {user?.prenom} {user?.nom}</h2>
                <p className="text-white/70 text-sm">Voici votre activité récente</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total affectations</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{mesStats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <ClipboardList size={22} className="text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">En cours</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{mesStats.enCours}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Activity size={22} className="text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Résolues</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{mesStats.resolues}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Taux réussite</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {mesStats.total > 0 ? Math.round((mesStats.resolues / mesStats.total) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Target size={22} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Évolution</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Suivi de vos réclamations</p>
              </div>
              <div className="flex gap-2">
                {["day", "week", "month"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p as any)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      period === p 
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {p === "day" ? "Jour" : p === "week" ? "Semaine" : "Mois"}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evolution}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                <Legend />
                <Area type="monotone" dataKey="count" name="Nouvelles" stroke="#6366f1" fill="url(#colorCount)" />
                <Area type="monotone" dataKey="resolved" name="Résolues" stroke="#10b981" fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Mes statistiques</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mesStatutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => {
                    const pct = percent ?? 0;
                    return `${name}: ${(pct * 100).toFixed(0)}%`;
                  }}
                >
                  {mesStatutData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Activités récentes</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Vos dernières affectations</p>
            </div>
            <button onClick={() => navigate("/mes-affectations")} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              Voir tout <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
            {mesAffectations.slice(0, 5).map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.reclamation?.status?.status === "résolu" ? "bg-emerald-500" :
                    activity.reclamation?.status?.status === "en cours" ? "bg-amber-500" : "bg-indigo-500"
                  }`} />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{activity.reclamation?.titre}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activity.dateAffectation ? new Date(activity.dateAffectation).toLocaleDateString("fr-FR") : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.reclamation?.status?.status === "résolu" ? "bg-emerald-100 text-emerald-700" :
                    activity.reclamation?.status?.status === "en cours" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                  }`}>
                    {activity.reclamation?.status?.status || "—"}
                  </span>
                </div>
              </div>
            ))}
            {mesAffectations.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-500">
                <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
                <p>Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==================== ADMIN / MANAGER DASHBOARD ====================
  return (
    <DashboardLayout
      title="Tableau de bord"
      subtitle={role === "admin" ? "Administrateur" : "Manager"}
      actions={
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshData}
            className="h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-indigo-500 transition-all"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => navigate("/reclamations")}
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium flex items-center gap-2 hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
          >
            <AlertTriangle size={16} />
            Toutes les réclamations
            <ArrowUpRight size={14} />
          </button>
        </div>
      }
    >
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={28} className="text-white" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Vue d'ensemble</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Bonjour, {user?.prenom} {user?.nom}
          </h2>
          <p className="text-white/70 text-sm lg:text-base max-w-2xl">
            Voici les performances de votre plateforme de gestion des réclamations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total réclamations</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.total || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <AlertTriangle size={22} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Taux résolution</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{Math.round(stats?.tauxResolution || 0)}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Target size={22} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Temps moyen résolution</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{Math.round(tempsResolution?.moyenneHeures || 0)}h</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock size={22} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Agents actifs</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{agentsPerformance.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Users size={22} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Évolution des réclamations</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Données réelles du système</p>
            </div>
            <div className="flex gap-2">
              {["day", "week", "month"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    period === p 
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {p === "day" ? "Jour" : p === "week" ? "Semaine" : "Mois"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
              <Legend />
              <Line type="monotone" dataKey="count" name="Nouvelles" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} />
              <Line type="monotone" dataKey="resolved" name="Résolues" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top catégories</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Les plus réclamées</p>
            </div>
            <BarChart3 size={20} className="text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topCategories} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={100} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
              <Bar dataKey="count" name="Nombre" fill="#8b5cf6" radius={[0, 8, 8, 0]}>
                {topCategories.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Répartition par statut</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Données réelles</p>
            </div>
            <PieChartIcon size={20} className="text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => {
                  const pct = percent ?? 0;
                  return `${name}: ${(pct * 100).toFixed(0)}%`;
                }}
              >
                {statutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Répartition par priorité</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Données réelles</p>
            </div>
            <Zap size={20} className="text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prioriteData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => {
                  const pct = percent ?? 0;
                  return `${name}: ${(pct * 100).toFixed(0)}%`;
                }}
              >
                {prioriteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance des agents</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Classement par efficacité (données réelles)</p>
          </div>
          <Eye size={20} className="text-slate-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Agent</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Réclamations résolues</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Temps moyen</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
              {agentsPerformance.map((agent, idx) => {
                const maxResolues = Math.max(...agentsPerformance.map(a => a.reclamationsResolues), 1);
                const performancePercent = Math.round((agent.reclamationsResolues / maxResolues) * 100);
                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {agent.nom?.charAt(0)}{agent.prenom?.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{agent.nom} {agent.prenom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300">{agent.reclamationsResolues}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-amber-500" />
                        <span className="text-slate-700 dark:text-slate-300">{agent.tempsMoyenResolution.toFixed(1)}h</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${performancePercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {performancePercent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {agentsPerformance.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-500">
                    <Users size={32} className="mx-auto mb-3 opacity-30" />
                    <p>Aucun agent trouvé</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}