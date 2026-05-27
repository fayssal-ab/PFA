import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import api from "../../lib/axiosInstance";
import { useAuth } from "../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, Clock, CheckCircle2, TrendingUp, 
  ArrowUpRight, Eye, MessageCircle, Calendar ,Paperclip
} from "lucide-react";
import { Reclamation, ApiResponse } from "../../types";

interface ClientStats {
  total: number;
  enCours: number;
  resolues: number;
  enAttente: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [stats, setStats] = useState<ClientStats>({ total: 0, enCours: 0, resolues: 0, enAttente: 0 });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<Reclamation>>("/reclamations/mes-reclamations", {
        params: { page: 0, size: 10 }
      });
      const data = res.data?.content || [];
      setReclamations(data);
      
      const enCours = data.filter((r: Reclamation) => r.status?.status === "en cours").length;
      const resolues = data.filter((r: Reclamation) => r.status?.status === "résolu").length;
      const enAttente = data.filter((r: Reclamation) => r.status?.status === "en attente").length;
      
      setStats({
        total: data.length,
        enCours,
        resolues,
        enAttente
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };
const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>,id :number) => {

    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    setUploading(true);

    try {

      await api.post(`/piece-jointes/upload/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );


    } catch (e) {

      console.error(e);

    } finally {

      setUploading(false);
    }
  };
  const statusColor = (status?: string) => {
    if (status === "résolu") return "bg-emerald-100 text-emerald-700";
    if (status === "en cours") return "bg-amber-100 text-amber-700";
    return "bg-indigo-100 text-indigo-700";
  };

  if (loading) {
    return (
      <DashboardLayout title="Tableau de bord">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Mon espace client"
      subtitle="Client"
      actions={
        <button
          onClick={() => navigate("/mes-reclamations")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium flex items-center gap-2 hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          Nouvelle réclamation
          <ArrowUpRight size={16} />
        </button>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total réclamations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <AlertTriangle size={20} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">En cours</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.enCours}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Résolues</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.resolues}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Taux résolution</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {stats.total > 0 ? Math.round((stats.resolues / stats.total) * 100) : 0}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reclamations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mes réclamations récentes</h3>
          <button onClick={() => navigate("/mes-reclamations")} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
            Voir tout <Eye size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {reclamations.slice(0, 5).map((rec) => (
            <div key={rec.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-400">#{rec.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(rec.status?.status)}`}>
                      {rec.status?.status || "—"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {rec.priority?.priority || "Normal"}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{rec.titre}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-1">{rec.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {rec.dateDepot ? new Date(rec.dateDepot).toLocaleDateString("fr-FR") : "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      {rec.categorie?.categorie || "—"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/mes-reclamations/${rec.id}`)}
                  className="px-3 py-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors text-sm"
                >
                  Détails
                </button>
                              <label className="h-10 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium cursor-pointer hover:bg-indigo-700 transition-all flex items-center gap-2">

                <Paperclip size={15} />

                {uploading
                  ? "Upload..."
                  : "Ajouter"}

                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => uploadFile(e, rec.id)}
                />
              </label>
              </div>
            </div>
          ))}

          {reclamations.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
              <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Aucune réclamation pour le moment</p>
              <button
                onClick={() => navigate("/mes-reclamations")}
                className="mt-4 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition-colors"
              >
                Créer une réclamation
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}