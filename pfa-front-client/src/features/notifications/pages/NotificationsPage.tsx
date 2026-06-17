import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { Bell, CheckCheck, Trash2, Clock } from "lucide-react";
import { Notification } from "../../../types";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useToast } from "../../../context/ToastContext";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { Skeleton } from "../../../components/Skeleton";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get<Notification[]>(`/notifications/get-notifications-by-client/${user?.userId}`);
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/notifications/mark-as-read/${id}`);
      loadNotifications();
    } catch {
      showToast("Erreur", "error");
    }
  };

  const deleteNotification = async (id: number) => {
    setDeleting(id);
    setConfirmDelete(null);
    try {
      await api.delete(`/notifications/delete-notification/${id}`);
      showToast("Notification supprimee", "success");
      loadNotifications();
    } catch {
      showToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(null);
    }
  };

  const timeAgo = (date?: string) => {
    if (!date) return "";
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return "A l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return `Il y a ${Math.floor(diff / 86400)}j`;
  };

  const unreadCount = notifications.filter((n) => !n.lue).length;

  return (
    <DashboardLayout
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Toutes lues"}
    >
      <div className="bg-white border border-gray-200 rounded-lg">
        {loading ? (
          <div className="p-5 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={32} className="mx-auto mb-3 text-gray-200" strokeWidth={1.5} />
            <p className="text-sm text-gray-500">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 px-5 py-3.5 transition-colors ${
                  !notif.lue ? "bg-teal-50/30" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                  !notif.lue ? "bg-teal-100" : "bg-gray-100"
                }`}>
                  <Bell size={14} className={!notif.lue ? "text-teal-600" : "text-gray-400"} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${!notif.lue ? "font-medium text-gray-900" : "text-gray-600"}`}>
                    {notif.message}
                  </p>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                    <Clock size={10} />
                    {timeAgo(notif.dateEnvoi)}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {!notif.lue && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Marquer comme lu"
                    >
                      <CheckCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmDelete(notif.id)}
                    disabled={deleting === notif.id}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    {deleting === notif.id ? (
                      <div className="w-3 h-3 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Supprimer la notification"
        message="Cette action est irreversible."
        onConfirm={() => confirmDelete && deleteNotification(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        confirmLabel="Supprimer"
        danger
      />
    </DashboardLayout>
  );
}
