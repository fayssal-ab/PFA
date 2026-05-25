import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { useAuth } from "../../auth/hooks/useAuth";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { Client } from "../../../types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    telephone: "",
    adresse: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Récupérer les infos du client
      const res = await api.get<Client>("/clients/profile");
      setClient(res.data);
      setFormData({
        telephone: res.data.telephone || "",
        adresse: res.data.adresse || ""
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/clients/update-profile", formData);
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Mon profil">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Mon profil"
      subtitle="Informations personnelles"
      actions={
        !editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium flex items-center gap-2 hover:bg-indigo-600 transition-colors"
          >
            <Edit2 size={14} />
            Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <X size={14} />
              Annuler
            </button>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium flex items-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={14} />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        )
      }
    >
      <div className="max-w-2xl mx-auto">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-indigo-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Informations personnelles</h3>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Nom</label>
                  <p className="text-gray-900 dark:text-white font-medium">{user?.nom}</p>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Prénom</label>
                  <p className="text-gray-900 dark:text-white font-medium">{user?.prenom}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Phone size={20} className="text-indigo-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Contact</h3>
            </div>
            {editing ? (
              <div className="space-y-3">
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  placeholder="Téléphone"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <textarea
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  placeholder="Adresse"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Téléphone</label>
                  <p className="text-gray-900 dark:text-white">{client?.telephone || "Non renseigné"}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Adresse</label>
                  <p className="text-gray-900 dark:text-white">{client?.adresse || "Non renseignée"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}