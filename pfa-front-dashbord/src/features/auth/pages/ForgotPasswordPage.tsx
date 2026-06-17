import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/axiosInstance";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [reponse, setReponse] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ resetToken: string }>("/auth/forgot-password", { email, reponse });
      setResetToken(res.data.resetToken);
      setStep(2);
    } catch {
      setError("Email ou réponse incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { resetToken, newPassword });
      setSuccess(true);
    } catch {
      setError("Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 p-5 text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Mot de passe réinitialisé</h2>
          <p className="text-slate-500 text-sm mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
          <button onClick={() => navigate("/")} className="w-full h-8 bg-teal-600 text-white rounded-md text-xs font-medium hover:bg-teal-700 transition-colors">
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 p-5">
        <div className="mb-6">
          <button onClick={() => navigate("/")} className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-6 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Retour
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Mot de passe oublié</h1>
          <p className="text-slate-500 text-sm mt-1">
            {step === 1 ? "Répondez à votre question de sécurité" : "Choisissez un nouveau mot de passe"}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com"
                className="w-full h-11 border border-slate-200 rounded-md px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Question de sécurité</label>
              <p className="text-xs text-slate-400 mb-2">Quelle est votre ville de naissance ?</p>
              <input type="text" value={reponse} onChange={(e) => setReponse(e.target.value)} required placeholder="Votre réponse"
                className="w-full h-11 border border-slate-200 rounded-md px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-colors" />
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-md border border-red-100">{error}</p>}
            <button type="submit" disabled={loading} className="w-full h-8 bg-teal-600 text-white rounded-md text-xs font-medium hover:bg-teal-700 transition-colors disabled:opacity-60">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "Vérifier"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nouveau mot de passe</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min. 6 caractères"
                className="w-full h-11 border border-slate-200 rounded-md px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Confirmer le mot de passe</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Confirmez le mot de passe"
                className="w-full h-11 border border-slate-200 rounded-md px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-colors" />
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-md border border-red-100">{error}</p>}
            <button type="submit" disabled={loading} className="w-full h-8 bg-teal-600 text-white rounded-md text-xs font-medium hover:bg-teal-700 transition-colors disabled:opacity-60">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "Réinitialiser"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
