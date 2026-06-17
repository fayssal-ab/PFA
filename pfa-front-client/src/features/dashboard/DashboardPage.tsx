import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import api from "../../lib/axiosInstance";
import { useAuth } from "../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  FileText, Clock, CheckCircle2, TrendingUp,
  Plus, ChevronRight, Calendar, Paperclip,
} from "lucide-react";
import { Reclamation, ApiResponse } from "../../types";
import { Skeleton } from "../../components/Skeleton";
import { useToast } from "../../context/ToastContext";

interface ClientStats {
  total: number;
  enCours: number;
  resolues: number;
  enAttente: number;
}

const statCards = [
  { key: "total", label: "Total", icon: FileText, color: "text-gray-900", bg: "bg-gray-100" },
  { key: "enAttente", label: "En attente", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "enCours", label: "En cours", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "resolues", label: "Resolues", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
] as const;

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [stats, setStats] = useState<ClientStats>({ total: 0, enCours: 0, resolues: 0, enAttente: 0 });
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<Reclamation>>("/reclamations/mes-reclamations", {
        params: { page: 0, size: 10 },
      });
      const data = res.data?.content || [];
      setReclamations(data);
      setStats({
        total: data.length,
        enCours: data.filter((r) => r.status?.status === "en cours").length,
        resolues: data.filter((r) => r.status?.status === "résolu").length,
        enAttente: data.filter((r) => r.status?.status === "en attente").length,
      });
    } catch {
      showToast("Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploadingId(id);
    try {
      await api.post(`/piece-jointes/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Fichier envoye", "success");
    } catch {
      showToast("Erreur lors de l'envoi du fichier", "error");
    } finally {
      setUploadingId(null);
    }
  };

  const statusStyle = (status?: string) => {
    if (status === "résolu") return "bg-emerald-50 text-emerald-700";
    if (status === "en cours") return "bg-blue-50 text-blue-700";
    return "bg-amber-50 text-amber-700";
  };

  return (
    <DashboardLayout title={`Bonjour, ${user?.prenom || ""}`} subtitle="Tableau de bord">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <Skeleton className="h-3 w-16 mb-3" />
                <Skeleton className="h-7 w-10" />
              </div>
            ))
          : statCards.map((card) => (
              <div key={card.key} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">{card.label}</span>
                  <div className={`w-7 h-7 rounded-md ${card.bg} flex items-center justify-center`}>
                    <card.icon size={14} className={card.color} />
                  </div>
                </div>
                <p className={`text-2xl font-semibold ${card.color}`}>
                  {stats[card.key as keyof ClientStats]}
                </p>
              </div>
            ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900">Reclamations recentes</h3>
          <button
            onClick={() => navigate("/mes-reclamations")}
            className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-0.5 transition-colors"
          >
            Tout voir <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="p-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            ))}
          </div>
        ) : reclamations.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="mx-auto mb-3 text-gray-200" strokeWidth={1.5} />
            <p className="text-sm text-gray-500 mb-4">Aucune reclamation pour le moment</p>
            <button
              onClick={() => navigate("/mes-reclamations")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 transition-colors"
            >
              <Plus size={14} />
              Nouvelle reclamation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reclamations.slice(0, 5).map((rec) => (
              <div
                key={rec.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors group"
              >
                <span className="text-xs font-mono text-gray-400 w-6 flex-shrink-0">
                  {rec.id}
                </span>

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/mes-reclamations/${rec.id}`)}
                >
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-teal-600 transition-colors">
                    {rec.titre}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {rec.dateDepot ? new Date(rec.dateDepot).toLocaleDateString("fr-FR") : ""}
                    </span>
                    {rec.categorie?.categorie && (
                      <span className="text-[11px] text-gray-400">
                        {rec.categorie.categorie}
                      </span>
                    )}
                  </div>
                </div>

                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 ${statusStyle(rec.status?.status)}`}>
                  {rec.status?.status || "en attente"}
                </span>

                <label className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-gray-300 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer">
                  {uploadingId === rec.id ? (
                    <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
                  ) : (
                    <Paperclip size={14} />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => uploadFile(e, rec.id)}
                  />
                </label>

                <button
                  onClick={() => navigate(`/mes-reclamations/${rec.id}`)}
                  className="flex-shrink-0 text-gray-300 group-hover:text-gray-400 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
