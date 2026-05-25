import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { Search, Pencil, X, Briefcase } from "lucide-react";
import { Manager, ApiResponse } from "../../../types";

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [editing, setEditing] = useState<Manager | null>(null);
  const [editVal, setEditVal] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { 
      const r = await api.get<ApiResponse<Manager>>("/managers/get-managers", { params: { page: 0, size: 100 } }); 
      setManagers(r.data?.content || []); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    try { 
      await api.put(`/managers/${editing.id}`, { ...editing, departement: editVal }); 
      setEditing(null); 
      load(); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setSaving(false); 
    }
  };

  const filtered = managers.filter(m => 
    m.user?.nom?.toLowerCase().includes(search.toLowerCase()) || 
    m.departement?.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-tight">Managers</h1>
      </div>
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="w-full sm:w-[360px] h-10 bg-white border border-gray-100 rounded-xl pl-10 pr-4 text-[13px] outline-none focus:border-indigo-300 transition-all shadow-sm" 
        />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60">
                {["Nom", "Prénom", "Email", "Département", ""].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
               </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400 text-[14px]">Aucun manager</td></tr>
              ) : (
                filtered.map(m => (
                  <tr key={m.id} className="border-t border-gray-50/80 hover:bg-indigo-50/20 transition-colors">
                    <td className="px-6 py-3.5 text-[14px] text-[#1a1a2e] font-semibold">{m.user?.nom || "—"}</td>
                    <td className="px-6 py-3.5 text-[14px] text-gray-600">{m.user?.prenom || "—"}</td>
                    <td className="px-6 py-3.5 text-[13px] text-gray-500">{m.user?.email || "—"}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold bg-purple-50 text-purple-700 ring-1 ring-purple-100">
                        <Briefcase size={12} />{m.departement || "Non défini"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <button 
                        onClick={() => { setEditing(m); setEditVal(m.departement || ""); }} 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-blue-50 hover:text-blue-500 transition-all"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[400px] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-[#1a1a2e]">Modifier département</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <X size={16} />
              </button>
            </div>
            <p className="text-[13px] text-gray-500 mb-4">
              Manager: <span className="font-semibold text-[#1a1a2e]">{editing.user?.nom} {editing.user?.prenom}</span>
            </p>
            <input 
              value={editVal} 
              onChange={e => setEditVal(e.target.value)} 
              placeholder="Département" 
              className="w-full h-11 border border-gray-200 rounded-xl px-4 text-[14px] outline-none focus:border-indigo-400 transition-colors mb-4" 
            />
            <div className="flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 h-10 border border-gray-200 text-gray-600 text-[14px] rounded-xl hover:bg-gray-50">
                Annuler
              </button>
              <button 
                onClick={handleUpdate} 
                disabled={saving} 
                className="flex-1 h-10 bg-[#1a1a2e] text-white text-[14px] font-semibold rounded-xl hover:bg-[#2d2d4e] disabled:opacity-60 flex items-center justify-center"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}