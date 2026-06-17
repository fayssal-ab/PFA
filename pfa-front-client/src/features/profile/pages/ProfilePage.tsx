import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { useAuth } from "../../auth/hooks/useAuth";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { Client } from "../../../types";
import { useToast } from "../../../context/ToastContext";
import { Skeleton } from "../../../components/Skeleton";

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ telephone: "", adresse: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get<Client>("/clients/profile");
      setClient(res.data);
      setFormData({
        telephone: res.data.telephone || "",
        adresse: res.data.adresse || "",
      });
    } catch {
      showToast("Erreur lors du chargement du profil", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/clients/update-profile", formData);
      setEditing(false);
      showToast("Profil mis a jour", "success");
      loadProfile();
    } catch {
      showToast("Erreur lors de la mise a jour", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Mon profil"
      subtitle="Informations personnelles"
      actions={
        !editing ? (
          <button
            onClick={() => setEditing(true)}
            className="h-8 px-3 rounded-md bg-teal-600 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-teal-700 transition-colors"
          >
            <Edit2 size={13} />
            Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="h-8 px-3 rounded-md border border-gray-200 text-gray-600 text-xs font-medium flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              <X size={13} />
              Annuler
            </button>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="h-8 px-3 rounded-md bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={13} />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        )
      }
    >
      <div className="max-w-xl">
        {loading ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-teal-600 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">{user?.nom} {user?.prenom}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User size={15} className="text-teal-600" />
                  <h3 className="text-sm font-medium text-gray-900">Identite</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Nom</p>
                    <p className="text-sm font-medium text-gray-900">{user?.nom}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Prenom</p>
                    <p className="text-sm font-medium text-gray-900">{user?.prenom}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <div className="flex items-center gap-1.5 text-sm text-gray-900">
                    <Mail size={13} className="text-gray-400" />
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Phone size={15} className="text-teal-600" />
                  <h3 className="text-sm font-medium text-gray-900">Contact</h3>
                </div>
                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Telephone</label>
                      <input
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        placeholder="06 00 00 00 00"
                        className="w-full h-9 px-3 rounded-md border border-gray-300 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Adresse</label>
                      <textarea
                        value={formData.adresse}
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                        placeholder="Votre adresse"
                        rows={2}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm outline-none resize-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Telephone</p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-900">
                        <Phone size={13} className="text-gray-400" />
                        {client?.telephone || <span className="text-gray-400">Non renseigne</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Adresse</p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-900">
                        <MapPin size={13} className="text-gray-400" />
                        {client?.adresse || <span className="text-gray-400">Non renseignee</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
