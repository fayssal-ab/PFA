import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import { login } from "../services/auth.service";
import { AuthUser } from "../../../types";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPw, setShowPw] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      const decoded = jwtDecode<AuthUser>(token);
      decoded.role = decoded.role?.toLowerCase();
      setUser(decoded);
      navigate("/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect");
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col lg:flex-row">
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col justify-center px-6 sm:px-10 md:px-16 py-10 md:py-12 relative z-10 min-h-screen lg:min-h-0">
        <div className="mb-8 md:mb-14 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f8f7f4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-[22px] font-bold tracking-tight text-[#1a1a2e]">ReclamaCRM</span>
        </div>
        <div className="mb-8 md:mb-10">
          <h1 className="text-[32px] md:text-[38px] font-bold text-[#1a1a2e] leading-tight tracking-tight">Bon retour</h1>
          <p className="text-[#6b7280] text-[14px] md:text-[15px] mt-2">Connectez-vous pour accéder à votre espace</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="votre@email.com" required className="w-full h-[48px] md:h-[52px] bg-white border-2 border-[#e5e5e5] rounded-2xl px-5 text-[14px] text-[#1a1a2e] placeholder:text-[#b0b0b0] outline-none transition-all focus:border-[#1a1a2e] focus:shadow-[0_0_0_4px_rgba(26,26,46,0.06)]"/>
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Mot de passe</label>
            <div className="relative">
              <input type={showPw?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required className="w-full h-[48px] md:h-[52px] bg-white border-2 border-[#e5e5e5] rounded-2xl px-5 pr-12 text-[14px] text-[#1a1a2e] placeholder:text-[#b0b0b0] outline-none transition-all focus:border-[#1a1a2e] focus:shadow-[0_0_0_4px_rgba(26,26,46,0.06)]"/>
              <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b0b0b0] hover:text-[#1a1a2e] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          {error && <div className="flex items-center gap-2 bg-red-50 text-red-600 text-[13px] font-medium px-4 py-3 rounded-xl border border-red-100">{error}</div>}
          <button type="submit" disabled={loading} className="w-full h-[48px] md:h-[52px] bg-[#1a1a2e] text-white text-[15px] font-semibold rounded-2xl hover:bg-[#2d2d4e] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <>Se connecter <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></>}
          </button>
        </form>
        <p className="text-[12px] text-[#b0b0b0] mt-8 text-center">© 2026 ReclamaCRM · Tous droits réservés</p>
      </div>
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"/>
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#e94560]/10 rounded-full blur-3xl"/>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#533483]/15 rounded-full blur-3xl"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.04] rounded-full"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/[0.07] rounded-full"/>
        <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",backgroundSize:"40px 40px"}}/>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-24">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.08] rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
              <span className="text-white/70 text-[13px]">Système opérationnel</span>
            </div>
            <h2 className="text-white text-[36px] xl:text-[44px] font-bold leading-[1.1] tracking-tight">Gérez vos<br/>réclamations<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e94560] to-[#f5a623]">efficacement.</span></h2>
            <p className="text-white/50 text-[15px] leading-relaxed mt-6 max-w-sm">Une plateforme centralisée pour suivre, assigner et résoudre toutes les réclamations.</p>
            <div className="flex gap-8 mt-12">
              <div><div className="text-white text-[28px] font-bold">98%</div><div className="text-white/40 text-[12px] mt-1">Taux résolution</div></div>
              <div className="w-px bg-white/10"/>
              <div><div className="text-white text-[28px] font-bold">2.4h</div><div className="text-white/40 text-[12px] mt-1">Temps moyen</div></div>
              <div className="w-px bg-white/10"/>
              <div><div className="text-white text-[28px] font-bold">1.2k</div><div className="text-white/40 text-[12px] mt-1">Réclamations/mois</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}