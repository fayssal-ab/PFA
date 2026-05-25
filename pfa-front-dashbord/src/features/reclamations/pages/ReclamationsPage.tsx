import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { Search, AlertTriangle, Trash2, Filter, X } from "lucide-react";
import { Reclamation, Status, Priority, Categorie, ApiResponse } from "../../../types";

export default function ReclamationsPage() {
  const [recs, setRecs] = useState<Reclamation[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterCategorie, setFilterCategorie] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null);

  useEffect(() => { 
    load(); 
    loadFilters();
    
    // Écouter les changements de catégorie depuis la sidebar
    const handleCategorieChange = (event: CustomEvent) => {
      const categorie = event.detail;
      setSelectedCategorie(categorie);
      if (categorie) {
        setFilterCategorie(categorie);
        setShowFilters(true);
      } else {
        setFilterCategorie("");
      }
    };
    
    window.addEventListener('categorieChange', handleCategorieChange as EventListener);
    return () => {
      window.removeEventListener('categorieChange', handleCategorieChange as EventListener);
    };
  }, []);

  const load = async () => {
    setLoading(true);
    try { 
      const r = await api.get<ApiResponse<Reclamation>>("/reclamations/get-reclamations", { params: { page: 0, size: 200 } }); 
      setRecs(r.data?.content || []); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const loadFilters = async () => {
    const [s, p, c] = await Promise.all([
      api.get<Status[]>("/status/get-status").catch(() => ({ data: [] })),
      api.get<Priority[]>("/priorities/get-priority").catch(() => ({ data: [] })),
      api.get<Categorie[]>("/categorie/get-categorie").catch(() => ({ data: [] })),
    ]);
    setStatuses(s.data || []);
    setPriorities(p.data || []);
    setCategories(c.data || []);
  };

  const changeStatus = async (recId: number, statusId: string) => {
    try { 
      await api.put(`/reclamations/reclamation/${recId}/status/${statusId}`); 
      load(); 
    } catch (e) { 
      console.error(e); 
    }
  };

  const changePriority = async (recId: number, priorityId: string) => {
    try { 
      await api.put(`/reclamations/reclamation/${recId}/priority/${priorityId}`); 
      load(); 
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try { 
      await api.delete(`/reclamations/delete-reclamation/${id}`); 
      load(); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setDeleting(null); 
    }
  };

  const clearFilters = () => {
    setFilterStatus("");
    setFilterPriority("");
    setFilterCategorie("");
    setSelectedCategorie(null);
    setSearch("");
  };

  const statusColor = (s?: string): string => {
    const n = s?.toLowerCase() || "";
    if (n.includes("résolu") || n.includes("resolu") || n.includes("fermé")) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (n.includes("cours") || n.includes("traitement")) return "bg-amber-50 text-amber-700 ring-amber-200";
    if (n.includes("ouvert") || n.includes("nouveau") || n.includes("attente")) return "bg-blue-50 text-blue-700 ring-blue-200";
    return "bg-gray-100 text-gray-700 ring-gray-200";
  };

  const priorityColor = (p?: string): string => {
    const n = p?.toLowerCase() || "";
    if (n.includes("haute") || n.includes("high") || n.includes("urgent")) return "bg-red-50 text-red-700 ring-red-200";
    if (n.includes("moyenne") || n.includes("medium")) return "bg-amber-50 text-amber-700 ring-amber-200";
    if (n.includes("basse") || n.includes("low")) return "bg-green-50 text-green-700 ring-green-200";
    return "bg-gray-100 text-gray-600 ring-gray-200";
  };

  // Filtrer les réclamations
  let filtered = recs.filter(r => 
    r.titre?.toLowerCase().includes(search.toLowerCase()) || 
    r.description?.toLowerCase().includes(search.toLowerCase()) ||
    r.client?.user?.nom?.toLowerCase().includes(search.toLowerCase()) ||
    r.client?.user?.prenom?.toLowerCase().includes(search.toLowerCase())
  );
  
  if (filterStatus) {
    filtered = filtered.filter(r => String(r.status?.id) === filterStatus);
  }
  if (filterPriority) {
    filtered = filtered.filter(r => String(r.priority?.id) === filterPriority);
  }
  if (filterCategorie) {
    filtered = filtered.filter(r => r.categorie?.categorie === filterCategorie);
  }

  const activeFiltersCount = [filterStatus, filterPriority, filterCategorie].filter(Boolean).length;

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-[13px] text-gray-400 font-medium uppercase tracking-wider mb-1">Gestion</p>
        <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-tight">Réclamations</h1>
        <p className="text-gray-500 text-[14px] mt-1">Gérez et suivez toutes les réclamations des clients</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:max-w-[360px]">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input 
              type="text" 
              placeholder="Rechercher par titre, description ou client..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full h-10 bg-white border border-gray-100 rounded-xl pl-10 pr-4 text-[13px] outline-none focus:border-indigo-300 transition-all shadow-sm" 
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`h-10 px-4 rounded-xl text-[13px] font-medium flex items-center gap-2 transition-all ${
              showFilters || activeFiltersCount > 0 
                ? "bg-indigo-50 text-indigo-600 border border-indigo-200" 
                : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter size={14} />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
          {activeFiltersCount > 0 && (
            <button 
              onClick={clearFilters} 
              className="h-10 px-3 rounded-xl text-[12px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <X size={13} />
              Effacer
            </button>
          )}
        </div>

        {/* Panneau des filtres */}
        {showFilters && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Statut</label>
                <select 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value)} 
                  className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-[13px] outline-none focus:border-indigo-300"
                >
                  <option value="">Tous les statuts</option>
                  {statuses.map(s => <option key={s.id} value={s.id}>{s.status}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Priorité</label>
                <select 
                  value={filterPriority} 
                  onChange={e => setFilterPriority(e.target.value)} 
                  className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-[13px] outline-none focus:border-indigo-300"
                >
                  <option value="">Toutes les priorités</option>
                  {priorities.map(p => <option key={p.id} value={p.id}>{p.priority}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Catégorie</label>
                <select 
                  value={filterCategorie} 
                  onChange={e => setFilterCategorie(e.target.value)} 
                  className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-[13px] outline-none focus:border-indigo-300"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(c => <option key={c.id} value={c.categorie}>{c.categorie}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
          <div className="text-[12px] text-gray-400">
            {filtered.length} réclamation{filtered.length > 1 ? "s" : ""}
            {filterCategorie && (
              <span className="ml-2 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px]">
                {filterCategorie}
              </span>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60">
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">ID</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Titre</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Client</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Catégorie</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Statut</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Priorité</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <AlertTriangle size={32} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-[14px] text-gray-400">Aucune réclamation trouvée</p>
                    {(search || filterStatus || filterPriority || filterCategorie) && (
                      <button onClick={clearFilters} className="mt-3 text-indigo-500 text-[12px] hover:underline">
                        Effacer les filtres
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-t border-gray-50/80 hover:bg-indigo-50/20 transition-colors">
                    <td className="px-5 py-3 text-[12px] text-gray-400 font-mono font-bold">#{r.id}</td>
                    <td className="px-5 py-3 text-[13px] text-[#1a1a2e] font-semibold max-w-[200px] truncate" title={r.titre}>
                      {r.titre || "—"}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">
                      {r.client?.user?.nom} {r.client?.user?.prenom}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                        {r.categorie?.categorie || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <select 
                        value={r.status?.id || ""} 
                        onChange={e => changeStatus(r.id, e.target.value)} 
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border-0 outline-none cursor-pointer ${statusColor(r.status?.status)}`}
                      >
                        {statuses.map(s => <option key={s.id} value={s.id}>{s.status}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <select 
                        value={r.priority?.id || ""} 
                        onChange={e => changePriority(r.id, e.target.value)} 
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border-0 outline-none cursor-pointer ${priorityColor(r.priority?.priority)}`}
                      >
                        {priorities.map(p => <option key={p.id} value={p.id}>{p.priority}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-gray-400">
                      {r.dateDepot ? new Date(r.dateDepot).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <button 
                        onClick={() => handleDelete(r.id)} 
                        disabled={deleting === r.id} 
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        {deleting === r.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}