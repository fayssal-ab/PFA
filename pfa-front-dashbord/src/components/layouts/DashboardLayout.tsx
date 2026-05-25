import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { DashboardLayoutProps } from "../../types";

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  actions, 
  tabs, 
  activeTab, 
  onTabChange, 
  secondaryPanel 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0 dark:from-[#0a0a0f] dark:via-[#0f0f17] dark:to-[#0a0a0f]">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Header section with gradient */}
              {(title || tabs) && (
                <div className="mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-pink-500 rounded-full" />
                        {subtitle && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                            {subtitle}
                          </span>
                        )}
                      </div>
                      {title && (
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                          {title}
                        </h1>
                      )}
                    </div>
                    {actions && <div className="flex items-center gap-3">{actions}</div>}
                  </div>

                  {tabs && (
                    <div className="flex flex-wrap items-center gap-1 mt-6 border-b border-slate-200 dark:border-slate-800">
                      {tabs.map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => onTabChange?.(tab.key)}
                          className={`px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg ${
                            activeTab === tab.key
                              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Main content with glass effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-pink-500/5 rounded-3xl blur-3xl" />
                <div className="relative">
                  {secondaryPanel ? (
                    <div className="flex gap-6">
                      <div className="flex-1">{children}</div>
                      <div className="w-80 shrink-0">
                        <div className="sticky top-6">
                          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-5">
                            {secondaryPanel}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    children
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}