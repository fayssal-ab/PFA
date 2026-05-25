import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { Bell, CheckCheck, Trash2, Clock } from "lucide-react";
import { Notification } from "../../../types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get<Notification[]>("/notifications/get-notifications-by-client/0");
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/notifications/mark-as-read/${id}`);
      loadNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    setDeleting(id);
    try {
      await api.delete(`/notifications/delete-notification/${id}`);
      loadNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    } finally {
      setDeleting(null);
    }
  };

  const timeAgo = (date?: string) => {
    if (!date) return "";
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return `Il y a ${Math.floor(diff / 86400)}j`;
  };

  const unreadCount = notifications.filter(n => !n.lue).length;

  if (loading) {
    return (
      <DashboardLayout title="Notifications">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Toutes lues"}
    >
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
            <Bell size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white dark:bg-slate-800 rounded-xl p-4 border transition-all ${
                !notif.lue
                  ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/20"
                  : "border-gray-100 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !notif.lue ? "bg-indigo-100 dark:bg-indigo-900/50" : "bg-gray-100 dark:bg-gray-700"
                }`}>
                  <Bell size={18} className={!notif.lue ? "text-indigo-600" : "text-gray-400"} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${!notif.lue ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{timeAgo(notif.dateEnvoi)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!notif.lue && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
                      title="Marquer comme lu"
                    >
                      <CheckCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    disabled={deleting === notif.id}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    {deleting === notif.id ? (
                      <div className="w-4 h-4 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}