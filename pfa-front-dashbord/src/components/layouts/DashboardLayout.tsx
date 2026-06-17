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
  secondaryPanel,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-6">
            {(title || tabs) && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    {subtitle && (
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                        {subtitle}
                      </p>
                    )}
                    {title && (
                      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
                    )}
                  </div>
                  {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>

                {tabs && (
                  <div className="flex items-center gap-0.5 mt-4 border-b border-slate-200">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => onTabChange?.(tab.key)}
                        className={`px-3 py-2 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                          activeTab === tab.key
                            ? "border-teal-600 text-teal-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {secondaryPanel ? (
              <div className="flex gap-6">
                <div className="flex-1 min-w-0">{children}</div>
                <div className="w-72 shrink-0 hidden xl:block">
                  <div className="sticky top-6 bg-white border border-slate-200 rounded-lg p-4">
                    {secondaryPanel}
                  </div>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
