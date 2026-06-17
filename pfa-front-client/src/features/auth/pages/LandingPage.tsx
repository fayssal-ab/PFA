import { useNavigate } from "react-router-dom";
import { Shield, Clock, MessageCircle, ChevronRight, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Suivi en temps reel",
    desc: "Suivez l'etat de vos reclamations a chaque etape du traitement.",
  },
  {
    icon: Clock,
    title: "Reponse rapide",
    desc: "Temps moyen de resolution inferieur a 24h pour les cas prioritaires.",
  },
  {
    icon: MessageCircle,
    title: "Echanges directs",
    desc: "Communiquez directement avec l'agent en charge de votre dossier.",
  },
];

const steps = [
  { num: "01", title: "Deposez", desc: "Soumettez votre reclamation en quelques clics" },
  { num: "02", title: "Suivez", desc: "Consultez l'avancement en temps reel" },
  { num: "03", title: "Resolu", desc: "Recevez la resolution et confirmez" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/logo.png" alt="ReclamaCRM" className="h-10 object-contain" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="h-9 px-4 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Se connecter
            </button>
            <button
              onClick={() => navigate("/login")}
              className="h-9 px-5 rounded-lg bg-[#0c1222] text-white text-sm font-medium hover:bg-[#161f33] transition-colors"
            >
              Espace client
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
            Plateforme operationnelle
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 leading-[1.15] tracking-tight">
            Vos reclamations,{" "}
            <span className="text-teal-600">simplifiees.</span>
          </h1>
          <p className="text-lg text-slate-500 mt-5 leading-relaxed max-w-xl">
            Deposez, suivez et echangez autour de vos reclamations depuis un seul espace securise.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={() => navigate("/login")}
              className="h-11 px-6 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              Acceder a mon espace
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-11 px-5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              En savoir plus
            </button>
          </div>
          <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-100">
            <div>
              <div className="text-2xl font-semibold text-slate-900">98%</div>
              <div className="text-xs text-slate-500 mt-0.5">Taux de resolution</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-2xl font-semibold text-slate-900">2.4h</div>
              <div className="text-xs text-slate-500 mt-0.5">Temps moyen</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-2xl font-semibold text-slate-900">24/7</div>
              <div className="text-xs text-slate-500 mt-0.5">Disponibilite</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-semibold text-slate-900">Comment ca fonctionne</h2>
            <p className="text-sm text-slate-500 mt-2">Un processus simple et transparent</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {steps.map((step) => (
              <div key={step.num} className="bg-white border border-slate-200 rounded-lg p-6 relative">
                <span className="text-3xl font-bold text-slate-100">{step.num}</span>
                <h3 className="text-base font-semibold text-slate-900 mt-2">{step.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-teal-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[#0c1222] rounded-xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Pret a deposer une reclamation ?</h2>
              <p className="text-sm text-slate-400 mt-1">Connectez-vous a votre espace client pour commencer.</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="h-11 px-6 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2 shrink-0"
            >
              Se connecter
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/logo.png" alt="ReclamaCRM" className="h-7 object-contain opacity-60" />
          <p className="text-xs text-slate-400">ReclamaCRM - Tous droits reserves</p>
        </div>
      </footer>
    </div>
  );
}
