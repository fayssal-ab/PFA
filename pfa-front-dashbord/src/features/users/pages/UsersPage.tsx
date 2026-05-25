import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { Plus, Trash2, Search, X } from "lucide-react";
import { User, Role } from "../../../types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    roleId: ""
  });
  const [formErr, setFormErr] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => { 
    fetchUsers(); 
    fetchRoles(); 
  }, []);

  const fetchUsers = async () => {
    try { 
      const r = await api.get<User[]>("/users/get-user"); 
      setUsers(Array.isArray(r.data) ? r.data : []); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchRoles = async () => {
    try { 
      const r = await api.get<Role[]>("/roles/get-roles"); 
      setRoles(Array.isArray(r.data) ? r.data : []); 
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleCreate = async () => {
    if (!form.nom || !form.email || !form.password || !form.roleId) {
      setFormErr("Remplir tous les champs");
      return;
    }
    setSaving(true);
    setFormErr("");
    try {
      await api.post("/users/create-user", { 
        nom: form.nom, 
        prenom: form.prenom, 
        email: form.email, 
        password: form.password, 
        role: { id: Number(form.roleId) } 
      });
      setModal(false);
      setForm({ nom: "", prenom: "", email: "", password: "", roleId: "" });
      fetchUsers();
    } catch (e: any) {
      const msg = e.response?.data;
      setFormErr(typeof msg === "string" ? msg : msg?.message || "Erreur");
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try { 
      await api.delete(`/users/delete-user/${id}`); 
      fetchUsers(); 
      if (selected?.id === id) setSelected(null);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setDeleting(null); 
    }
  };

  const roleColor = (n?: string): string => {
    const r = n?.toLowerCase() || "";
    if (r === "admin") return "bg-red-100 text-red-600 dark:bg-red-900/30";
    if (r === "manager") return "bg-purple-100 text-purple-600 dark:bg-purple-900/30";
    if (r === "agent") return "bg-blue-100 text-blue-500 dark:bg-blue-900/30";
    return "bg-green-100 text-green-600 dark:bg-green-900/30";
  };

  const filtered = users.filter(u => 
    u.nom?.toLowerCase().includes(search.toLowerCase()) || 
    u.prenom?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const userPanel = (
    <>
      <div className="text-xs text-gray-400 tracking-wider uppercase font-semibold">Utilisateurs</div>
      <div className="relative mt-2">
        <input 
          type="text" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="pl-8 h-9 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white w-full rounded-md text-sm" 
          placeholder="Rechercher"
        />
        <Search size={14} className="w-4 absolute text-gray-400 top-1/2 -translate-y-1/2 left-2.5" />
      </div>
      <div className="space-y-3 mt-3">
        {filtered.map(u => (
          <button 
            key={u.id} 
            onClick={() => setSelected(u)} 
            className={`bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow ${selected?.id === u.id ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
          >
            <div className="flex items-center font-medium text-gray-900 dark:text-white pb-2 mb-2 border-b border-gray-200 dark:border-gray-700 w-full text-left">
              <div className="w-7 h-7 mr-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                {u.nom?.charAt(0)}{u.prenom?.charAt(0)}
              </div>
              <span className="truncate">{u.nom} {u.prenom}</span>
            </div>
            <div className="flex items-center w-full">
              <span className={`text-xs py-1 px-2 leading-none rounded-md ${roleColor(u.role?.name)}`}>
                {u.role?.name || "—"}
              </span>
              <span className="ml-auto text-xs text-gray-400 truncate max-w-[100px]">{u.email}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );

  if (loading) return (
    <DashboardLayout title="Utilisateurs">
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-[3px] border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout
      title={selected ? `${selected.nom} ${selected.prenom}` : "Utilisateurs"}
      subtitle={selected ? selected.role?.name : `${users.length} total`}
      actions={
        <button onClick={() => setModal(true)} className="h-8 px-3 rounded-md shadow text-white bg-blue-500 text-xs font-medium flex items-center gap-1">
          <Plus size={14} /> Nouveau
        </button>
      }
      secondaryPanel={userPanel}
    >
      {selected ? (
        <div>
          <div className="flex items-center mb-7">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold mr-4">
              {selected.nom?.charAt(0)}{selected.prenom?.charAt(0)}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{selected.nom} {selected.prenom}</div>
              <div className="text-sm text-gray-400">{selected.email}</div>
            </div>
            <button 
              onClick={() => handleDelete(selected.id!)} 
              disabled={deleting === selected.id} 
              className="ml-auto h-8 px-3 rounded-md border border-gray-200 dark:border-gray-700 text-red-500 text-xs flex items-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {deleting === selected.id ? (
                <div className="w-3 h-3 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
              ) : (
                <><Trash2 size={13} /> Supprimer</>
              )}
            </button>
          </div>
          <table className="w-full text-left">
            <tbody className="text-gray-600 dark:text-gray-300">
              {[
                ["Nom", selected.nom],
                ["Prénom", selected.prenom],
                ["Email", selected.email],
                ["Rôle", selected.role?.name],
                ["ID", `#${selected.id}`]
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="py-3 px-1 border-b border-gray-200 dark:border-gray-800 text-gray-400 w-32">{k}</td>
                  <td className="py-3 px-3 border-b border-gray-200 dark:border-gray-800 font-medium text-gray-900 dark:text-white">{v || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              {["Nom", "Prénom", "Email", "Rôle", ""].map(h => (
                <th key={h} className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-100">
            {filtered.map(u => (
              <tr key={u.id} onClick={() => setSelected(u)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800 font-medium text-gray-900 dark:text-white">{u.nom}</td>
                <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">{u.prenom}</td>
                <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800 text-gray-400">{u.email}</td>
                <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
                  <span className={`text-xs py-1 px-2 rounded-md ${roleColor(u.role?.name)}`}>{u.role?.name || "—"}</span>
                </td>
                <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(u.id!); }} 
                    disabled={deleting === u.id} 
                    className="w-8 h-8 inline-flex items-center justify-center text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {deleting === u.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Nouvel utilisateur</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  value={form.nom} 
                  onChange={e => setForm({ ...form, nom: e.target.value })} 
                  placeholder="Nom" 
                  className="h-9 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 text-sm" 
                />
                <input 
                  value={form.prenom} 
                  onChange={e => setForm({ ...form, prenom: e.target.value })} 
                  placeholder="Prénom" 
                  className="h-9 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 text-sm" 
                />
              </div>
              <input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                placeholder="Email" 
                className="h-9 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 text-sm" 
              />
              <input 
                type="password" 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                placeholder="Mot de passe" 
                className="h-9 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 text-sm" 
              />
              <select 
                value={form.roleId} 
                onChange={e => setForm({ ...form, roleId: e.target.value })} 
                className="h-9 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 text-sm bg-white"
              >
                <option value="">Rôle</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {formErr && <p className="text-red-500 text-xs">{formErr}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(false)} className="flex-1 h-9 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                  Annuler
                </button>
                <button 
                  onClick={handleCreate} 
                  disabled={saving} 
                  className="flex-1 h-9 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-60 flex items-center justify-center"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Créer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}