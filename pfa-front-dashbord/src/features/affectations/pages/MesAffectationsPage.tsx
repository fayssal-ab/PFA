import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { ClipboardList, Clock, MessageSquare, User } from "lucide-react";
import { Affectation, ApiResponse } from "../../../types";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MesAffectationsPage() {
  const [affectations, setAffectations] = useState<Affectation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => { load(); }, [page]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get<ApiResponse<Affectation>>("/affectations/mes-affectations", { params: { page, size: 10 } });
      setAffectations(r.data?.content || []);
      setTotalPages(r.data?.totalPages || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const statusColor = (s?: string): string => {
    const n = s?.toLowerCase() || "";
    if (n.includes("résolu") || n.includes("resolu") || n.includes("fermé")) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (n.includes("cours") || n.includes("traitement")) return "bg-amber-50 text-amber-700 ring-amber-200";
    if (n.includes("ouvert") || n.includes("nouveau")) return "bg-blue-50 text-blue-700 ring-blue-200";
    return "bg-gray-100 text-gray-700 ring-gray-200";
  };

  const priorityColor = (p?: string): string => {
    const n = p?.toLowerCase() || "";
    if (n.includes("haute") || n.includes("high") || n.includes("urgent")) return "bg-red-50 text-red-700 ring-red-200";
    if (n.includes("moyenne") || n.includes("medium")) return "bg-amber-50 text-amber-700 ring-amber-200";
    return "bg-gray-50 text-gray-600 ring-gray-200";
  };

  if (loading && affectations.length === 0) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-[13px] text-gray-400 font-medium uppercase tracking-wider mb-1">Espace agent</p>
        <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-tight">Mes Affectations</h1>
        <p className="text-gray-500 text-[14px] mt-1">Les réclamations qui vous ont été assignées</p>
      </div>

      {affectations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20">
          <ClipboardList size={40} className="text-gray-200 mb-4" />
          <p className="text-[16px] font-semibold text-gray-400">Aucune affectation</p>
          <p className="text-[13px] text-gray-400 mt-1">Vous n'avez pas encore de réclamations assignées</p>
        </div>
      ) : (
        <div className="space-y-4">
          {affectations.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-100 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] font-mono font-bold text-gray-400">#{a.reclamation?.id}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold ring-1 ${statusColor(a.reclamation?.status?.status)}`}>
                      {a.reclamation?.status?.status || "—"}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold ring-1 ${priorityColor(a.reclamation?.priority?.priority)}`}>
                      {a.reclamation?.priority?.priority || "—"}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-[#1a1a2e] mb-1">
                    {a.reclamation?.titre || "Sans titre"}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
                    {a.reclamation?.description || "Pas de description"}
                  </p>

                  {a.commentaire && (
                    <div className="flex items-start gap-2 mt-3 bg-indigo-50/50 rounded-xl px-3 py-2.5">
                      <MessageSquare size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                      <p className="text-[12px] text-indigo-700 font-medium">{a.commentaire}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col gap-3 md:gap-2 shrink-0 md:items-end">
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                    <Clock size={13} />
                    {a.dateAffectation ? new Date(a.dateAffectation).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </div>
                  {a.reclamation?.client?.user && (
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                      <User size={13} />
                      {a.reclamation.client.user.nom} {a.reclamation.client.user.prenom}
                    </div>
                  )}
                  <div className="text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    {a.reclamation?.categorie?.categorie || "—"}
                  </div>
                  <div className="text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    <button
                      onClick={() =>
                         navigate(
                          `/agent/affectations/${a.reclamation?.id}`
                             )
                          }
                      className="h-9 px-4 rounded-xl bg-indigo-600 text-white text-[13px] font-medium hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                        <Eye size={14} />
                         Détails
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="h-9 px-4 rounded-xl text-[13px] font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <span className="text-[13px] text-gray-500 font-medium px-3">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="h-9 px-4 rounded-xl text-[13px] font-medium bg-[#1a1a2e] text-white hover:bg-[#2d2d4e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}