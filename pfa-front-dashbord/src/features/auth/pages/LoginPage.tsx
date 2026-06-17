import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, ArrowRight, ChevronLeft, Shield, Users, BarChart3 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { login } from "../services/auth.service";
import { AuthUser } from "../../../types";

export default function LoginPage() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { accessToken, refreshToken } = await login(email, password);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const decoded = jwtDecode<AuthUser>(accessToken);
      decoded.role = decoded.role?.toLowerCase();
      setUser(decoded);
      navigate("/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1222] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-[15%] -right-[5%] w-[600px] h-[600px] bg-teal-600/[0.05] rounded-full blur-[140px]" />
      <div className="absolute bottom-[5%] -left-[10%] w-[400px] h-[400px] bg-teal-600/[0.03] rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-[440px]">
        {!showForm ? (
          <div className="text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
            <div className="mb-10">
              <img src="/logo.png" alt="ReclamaCRM" className="h-14 object-contain mx-auto" style={{ filter: "brightness(0) invert(1)" }} />
            </div>

            <h1 className="text-3xl font-semibold text-white tracking-tight leading-tight">
              Tableau de bord<br />d'administration
            </h1>
            <p className="text-slate-400 text-[15px] mt-4 leading-relaxed max-w-sm mx-auto">
              Gerez les reclamations, suivez les performances et administrez votre plateforme.
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Shield size={14} className="text-teal-500" /> Admin
              </div>
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Users size={14} className="text-teal-500" /> Manager
              </div>
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <BarChart3 size={14} className="text-teal-500" /> Agent
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="mt-10 h-12 px-8 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-all flex items-center gap-2 mx-auto"
            >
              Acceder au tableau de bord
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-8 mt-14 pt-8 border-t border-white/[0.06]">
              <div>
                <div className="text-white text-lg font-semibold">98%</div>
                <div className="text-slate-500 text-[10px]">Resolution</div>
              </div>
              <div className="w-px h-6 bg-white/[0.06]" />
              <div>
                <div className="text-white text-lg font-semibold">2.4h</div>
                <div className="text-slate-500 text-[10px]">Temps moyen</div>
              </div>
              <div className="w-px h-6 bg-white/[0.06]" />
              <div>
                <div className="text-white text-lg font-semibold">24/7</div>
                <div className="text-slate-500 text-[10px]">Disponible</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ animation: "slideUp 0.35s ease-out" }}>
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs mb-8 transition-colors"
            >
              <ChevronLeft size={14} />
              Retour
            </button>

            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-7">
              <div className="mb-6">
                <img src="/logo.png" alt="ReclamaCRM" className="h-9 object-contain mb-6" style={{ filter: "brightness(0) invert(1)" }} />
                <h2 className="text-xl font-semibold text-white">Connexion</h2>
                <p className="text-sm text-slate-400 mt-1">Accedez a votre espace d'administration</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@reclamacrm.com"
                    required
                    autoComplete="email"
                    autoFocus
                    className="w-full h-11 px-3.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-slate-600 outline-none transition-colors focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-400">Mot de passe</label>
                    <Link to="/forgot-password" className="text-[11px] text-teal-500 hover:text-teal-400 transition-colors">
                      Mot de passe oublie ?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full h-11 px-3.5 pr-10 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white text-sm outline-none transition-colors focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>
            </div>

            <p className="text-[11px] text-slate-600 text-center mt-6">
              ReclamaCRM - Tous droits reserves
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
