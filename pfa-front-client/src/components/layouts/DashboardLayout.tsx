import { useAuth } from "../../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, User, Home } from "lucide-react";
import { logout } from "../../features/auth/services/auth.service";
import { DashboardLayoutProps } from "../../types";

export default function DashboardLayout({ children, title, subtitle, actions }: DashboardLayoutProps) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ReclamaCRM
              </span>
              <span className="text-xs text-gray-400 ml-2">Client</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Bell size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
                </div>
                <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">
                  {user?.nom} {user?.prenom}
                </span>
              </button>
              <button
                onClick={() => logout(setUser, navigate)}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Déconnexion"
              >
                <LogOut size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {(title || subtitle || actions) && (
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                {subtitle && (
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {subtitle}
                  </p>
                )}
                {title && (
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {title}
                  </h1>
                )}
              </div>
              {actions && <div>{actions}</div>}
            </div>
          </div>
        )}

        {/* Children */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}