import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import api from "../../lib/axiosInstance";
import { useAuth } from "../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area,
} from "recharts";
import {
  AlertTriangle, Users, Clock, ChevronRight, TrendingUp,
  ClipboardList, CheckCircle2, Activity, Target, RefreshCw,
} from "lucide-react";
import { Skeleton } from "../../components/Skeleton";

interface DashboardStatsAvancees {
  parStatut: { [key: string]: number };
  parPriorite: { [key: string]: number };
  total: number;
  tauxResolution: number;
}

interface EvolutionData { label: string; count: number; resolved: number }
interface TopCategory { name: string; count: number }
interface TempsResolution { moyenneHeures: number; parPriorite: { [key: string]: number } }
interface AgentPerformance { id: number; nom: string; prenom: string; reclamationsResolues: number; tempsMoyenResolution: number }
interface MesStats { total: number; enCours: number; resolues: number; enAttente: number }

const COLORS = ["#0d9488", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

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

  useEffect(() => { loadAllData(); }, [period, role]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      if (role === "admin" || role === "manager") await loadAdminData();
      else if (role === "agent") await loadAgentData();
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAllData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const loadAdminData = async () => {
    const [statsRes, evoRes, catRes, tempsRes, agentsRes] = await Promise.all([
      api.get("/reclamations/statistiques/avancees"),
      api.get("/reclamations/statistiques/evolution", { params: { periode: period, jours: period === "day" ? 7 : period === "week" ? 8 : 6 } }),
      api.get("/reclamations/statistiques/top-categories", { params: { limit: 5 } }),
      api.get("/reclamations/statistiques/temps-moyen-resolution").catch(() => ({ data: null })),
      api.get("/users/statistiques/agents-performance").catch(() => ({ data: [] })),
    ]);
    setStats(statsRes.data);
    setEvolution(evoRes.data);
    setTopCategories(catRes.data);
    setTempsResolution(tempsRes.data);
    setAgentsPerformance(agentsRes.data || []);
  };

  const loadAgentData = async () => {
    const [affRes, evoRes] = await Promise.all([
      api.get("/affectations/mes-affectations", { params: { page: 0, size: 100 } }),
      api.get("/reclamations/statistiques/evolution", { params: { periode: period, jours: 7 } }),
    ]);
    const affectations = affRes.data?.content || [];
    setMesAffectations(affectations);
    setMesStats({
      total: affectations.length,
      enCours: affectations.filter((a: any) => a.reclamation?.status?.status === "en cours").length,
      resolues: affectations.filter((a: any) => a.reclamation?.status?.status === "résolu").length,
      enAttente: affectations.filter((a: any) => a.reclamation?.status?.status === "en attente").length,
    });
    setEvolution(evoRes.data);
  };

  const statutData = stats ? [
    { name: "En attente", value: stats.parStatut.enAttente || 0, color: "#f59e0b" },
    { name: "En cours", value: stats.parStatut.enCours || 0, color: "#3b82f6" },
    { name: "Resolu", value: stats.parStatut.resolu || 0, color: "#10b981" },
  ] : [];

  const prioriteData = stats ? Object.entries(stats.parPriorite).map(([name, value], idx) => ({
    name, value, color: COLORS[idx % COLORS.length],
  })) : [];

  const tooltipStyle = { backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" };

  const StatCard = ({ label, value, icon: Icon, color, bg }: { label: string; value: string | number; icon: any; color: string; bg: string }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={`w-7 h-7 rounded-md ${bg} flex items-center justify-center`}>
          <Icon size={14} className={color} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );

  const PeriodToggle = () => (
    <div className="flex gap-1 bg-slate-100 rounded-md p-0.5">
      {(["day", "week", "month"] as const).map((p) => (
        <button key={p} onClick={() => setPeriod(p)}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${period === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
          {p === "day" ? "Jour" : p === "week" ? "Sem." : "Mois"}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout title="Tableau de bord">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
              <Skeleton className="h-3 w-16 mb-3" />
              <Skeleton className="h-7 w-12" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-5">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-[280px] w-full rounded-md" />
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (role === "agent") {
    const mesStatutData = [
      { name: "En attente", value: mesStats.enAttente, color: "#f59e0b" },
      { name: "En cours", value: mesStats.enCours, color: "#3b82f6" },
      { name: "Resolu", value: mesStats.resolues, color: "#10b981" },
    ];

    return (
      <DashboardLayout title={`Bonjour, ${user?.prenom}`} subtitle="Agent"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={refreshData} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-colors">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            </button>
            <button onClick={() => navigate("/mes-affectations")} className="h-8 px-3 rounded-md bg-teal-600 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-teal-700 transition-colors">
              <ClipboardList size={14} /> Mes affectations
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total affectations" value={mesStats.total} icon={ClipboardList} color="text-slate-900" bg="bg-slate-100" />
          <StatCard label="En attente" value={mesStats.enAttente} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
          <StatCard label="En cours" value={mesStats.enCours} icon={Activity} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Resolues" value={mesStats.resolues} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-900">Evolution</h3>
              <PeriodToggle />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={evolution}>
                <defs>
                  <linearGradient id="agentArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="count" name="Reclamations" stroke="#0d9488" fill="url(#agentArea)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Repartition</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={mesStatutData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {mesStatutData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <h3 className="text-sm font-medium text-slate-900">Activites recentes</h3>
            <button onClick={() => navigate("/mes-affectations")} className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-0.5">
              Tout voir <ChevronRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {mesAffectations.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  a.reclamation?.status?.status === "résolu" ? "bg-emerald-500" :
                  a.reclamation?.status?.status === "en cours" ? "bg-blue-500" : "bg-amber-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{a.reclamation?.titre}</p>
                  <p className="text-[11px] text-slate-400">{a.dateAffectation ? new Date(a.dateAffectation).toLocaleDateString("fr-FR") : ""}</p>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                  a.reclamation?.status?.status === "résolu" ? "bg-emerald-50 text-emerald-700" :
                  a.reclamation?.status?.status === "en cours" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                }`}>{a.reclamation?.status?.status || "—"}</span>
              </div>
            ))}
            {mesAffectations.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">Aucune activite recente</div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tableau de bord" subtitle={role === "admin" ? "Administrateur" : "Manager"}
      actions={
        <div className="flex items-center gap-2">
          <button onClick={refreshData} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-colors">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          </button>
          <button onClick={() => navigate("/reclamations")} className="h-8 px-3 rounded-md bg-teal-600 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-teal-700 transition-colors">
            <AlertTriangle size={14} /> Reclamations <ChevronRight size={14} />
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total reclamations" value={stats?.total || 0} icon={AlertTriangle} color="text-slate-900" bg="bg-slate-100" />
        <StatCard label="Taux resolution" value={`${Math.round(stats?.tauxResolution || 0)}%`} icon={Target} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Temps moyen" value={`${Math.round(tempsResolution?.moyenneHeures || 0)}h`} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        <StatCard label="Agents actifs" value={agentsPerformance.length} icon={Users} color="text-blue-600" bg="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-900">Evolution des reclamations</h3>
            <PeriodToggle />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="count" name="Nouvelles" stroke="#0d9488" strokeWidth={2} dot={{ fill: "#0d9488", r: 3 }} />
              <Line type="monotone" dataKey="resolved" name="Resolues" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Top categories</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topCategories} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={80} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Nombre" radius={[0, 4, 4, 0]}>
                {topCategories.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Repartition par statut</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statutData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {statutData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Repartition par priorite</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={prioriteData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {prioriteData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h3 className="text-sm font-medium text-slate-900">Performance des agents</h3>
          <TrendingUp size={14} className="text-slate-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/60">
                <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-5 py-2.5">Agent</th>
                <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-5 py-2.5">Resolues</th>
                <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-5 py-2.5">Temps moyen</th>
                <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-5 py-2.5">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {agentsPerformance.map((agent, idx) => {
                const maxR = Math.max(...agentsPerformance.map((a) => a.reclamationsResolues), 1);
                const pct = Math.round((agent.reclamationsResolues / maxR) * 100);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-semibold">
                          {agent.nom?.charAt(0)}{agent.prenom?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{agent.nom} {agent.prenom}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-700">{agent.reclamationsResolues}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">{agent.tempsMoyenResolution.toFixed(1)}h</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {agentsPerformance.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-slate-400 text-sm">Aucun agent</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
