import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { Bell, Trash2, CheckCheck, Clock } from "lucide-react";
import { Notification } from "../../../types";
import { useAuth } from "../../../features/auth/hooks/useAuth";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const r = await api.get<Notification[]>(`/notifications/get-notifications-by-client/${user?.userId}`).catch(() => ({ data: [] }));
      setNotifs(Array.isArray(r.data) ? r.data : []);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const markRead = async (id: number) => {
    try { 
      await api.post(`/notifications/mark-as-read/${id}`); 
      load(); 
    } catch (e) { 
      console.error(e); 
    }
  };

  const del = async (id: number) => {
    setDeleting(id);
    try { 
      await api.delete(`/notifications/delete-notification/${id}`); 
      load(); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setDeleting(null); 
    }
  };

  const unread = notifs.filter(n => !n.lue).length;

  const timeAgo = (d?: string): string => {
    if (!d) return "";
    const date = new Date(d);
    const now = Date.now();
    const diff = Math.floor((now - date.getTime()) / 1000);
    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return `Il y a ${Math.floor(diff / 86400)}j`;
  };

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
        <p className="text-[13px] text-gray-400 font-medium uppercase tracking-wider mb-1">Centre</p>
        <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-tight">Notifications</h1>
        {unread > 0 && <p className="text-indigo-600 text-[13px] font-semibold mt-1">{unread} non lue{unread > 1 ? "s" : ""}</p>}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <Bell size={36} className="mb-3 text-gray-200" />
            <p className="text-[14px] text-gray-400">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50/80">
            {notifs.map(n => (
              <div key={n.id} className={`flex items-start gap-4 px-6 py-4 hover:bg-indigo-50/20 transition-colors ${!n.lue ? "bg-indigo-50/30" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${!n.lue ? "bg-indigo-100" : "bg-gray-100"}`}>
                  <Bell size={16} className={!n.lue ? "text-indigo-600" : "text-gray-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] leading-relaxed ${!n.lue ? "text-[#1a1a2e] font-semibold" : "text-gray-600"}`}>
                    {n.message || "Notification"}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Clock size={11} className="text-gray-400" />
                    <span className="text-[11px] text-gray-400">{timeAgo(n.dateEnvoi)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!n.lue && (
                    <button 
                      onClick={() => markRead(n.id)} 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-emerald-50 hover:text-emerald-500 transition-all" 
                      title="Marquer lu"
                    >
                      <CheckCheck size={15} />
                    </button>
                  )}
                  <button 
                    onClick={() => del(n.id)} 
                    disabled={deleting === n.id} 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    {deleting === n.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}