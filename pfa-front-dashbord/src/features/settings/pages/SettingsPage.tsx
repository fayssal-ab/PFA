import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { Plus, Trash2, X } from "lucide-react";
import { Status, Priority, Categorie } from "../../../types";

interface SectionProps {
  title: string;
  items: (Status | Priority | Categorie)[];
  loading: boolean;
  fieldKey: string;
  createEndpoint: string;
  deleteEndpoint: string;
  createPayload: (val: string) => any;
  onRefresh: () => void;
  color: string;
}

function Section({
  title,
  items,
  loading,
  fieldKey,
  createEndpoint,
  deleteEndpoint,
  createPayload,
  onRefresh,
  color
}: SectionProps) {
  const [modal, setModal] = useState<boolean>(false);
  const [val, setVal] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!val.trim()) return;
    setCreating(true);
    try {
      await api.post(createEndpoint, createPayload(val));
      setVal("");
      setModal(false);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await api.delete(`${deleteEndpoint}/${id}`);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-5 rounded-full ${color}`} />
          <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
          <span className="text-[11px] text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded-md">{items.length}</span>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 h-8 px-3 bg-slate-50 text-slate-700 text-[12px] font-semibold rounded-md hover:bg-slate-100 transition-colors border border-slate-200">
          <Plus size={13} /> Ajouter
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-[13px]">Aucun élément</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
              <span className="text-[14px] text-slate-900 font-medium">{item[fieldKey as keyof typeof item]}</span>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleting === item.id}
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                {deleting === item.id ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-[380px] p-5 border border-slate-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-slate-900">Ajouter</h3>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-400">
                <X size={16} />
              </button>
            </div>
            <input
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder="Nom..."
              className="w-full h-11 border border-slate-200 rounded-md px-4 text-[14px] outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 mb-4"
              onKeyDown={e => e.key === "Enter" && handleCreate()}
            />
            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 h-8 border border-slate-200 text-slate-700 text-xs rounded-md hover:bg-slate-50">
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 h-8 bg-teal-600 text-white text-xs font-semibold rounded-md hover:bg-teal-700 disabled:opacity-60 flex items-center justify-center"
              >
                {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [s, p, c] = await Promise.all([
        api.get<Status[]>("/status/get-status").catch(() => ({ data: [] })),
        api.get<Priority[]>("/priorities/get-priority").catch(() => ({ data: [] })),
        api.get<Categorie[]>("/categorie/get-categorie").catch(() => ({ data: [] })),
      ]);
      setStatuses(s.data || []);
      setPriorities(p.data || []);
      setCategories(c.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-[13px] text-slate-400 font-medium uppercase tracking-wider mb-1">Configuration</p>
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-slate-500 text-[14px] mt-1">Gérez les statuts, priorités et catégories des réclamations</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <Section
          title="Statuts"
          items={statuses}
          loading={loading}
          fieldKey="status"
          color="bg-blue-500"
          createEndpoint="/status/create-status"
          deleteEndpoint="/status/delete-status"
          createPayload={(v: string) => ({ status: v })}
          onRefresh={loadAll}
        />
        <Section
          title="Priorités"
          items={priorities}
          loading={loading}
          fieldKey="priority"
          color="bg-amber-500"
          createEndpoint="/priorities/create-priority"
          deleteEndpoint="/priorities/delete-priority"
          createPayload={(v: string) => ({ priority: v })}
          onRefresh={loadAll}
        />
        <Section
          title="Catégories"
          items={categories}
          loading={loading}
          fieldKey="categorie"
          color="bg-emerald-500"
          createEndpoint="/categorie/create-categorie"
          deleteEndpoint="/categorie/delete-categorie"
          createPayload={(v: string) => ({ categorie: v })}
          onRefresh={loadAll}
        />
      </div>
    </DashboardLayout>
  );
}
