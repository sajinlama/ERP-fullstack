import React from "react";
import { useNavigate } from "react-router-dom";

export interface AppLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: any) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeView, onViewChange }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "REQUESTER";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col justify-between p-5">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
              S
            </div>
            <span className="font-bold tracking-tight text-base">SuppliTrack</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => onViewChange("DIRECTORY")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeView === "DIRECTORY"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Global Registry
            </button>

            {userRole === "REQUESTER" && (
              <button
                onClick={() => onViewChange("MY_SUBMISSIONS")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === "MY_SUBMISSIONS"
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                My Submissions
              </button>
            )}

            {userRole === "APPROVER" && (
              <button
                onClick={() => onViewChange("APPROVALS")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === "APPROVALS"
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Verification Queue
              </button>
            )}
          </nav>
        </div>

        {/* User Profile Capsule */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="px-2">
            <p className="text-xs font-bold text-slate-200 truncate">{userName}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-900/60 text-blue-300 border border-blue-700/50 uppercase tracking-wider">
              {userRole}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200/80 bg-white px-8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>SuppliTrack</span>
            <span>/</span>
            <span className="text-slate-900 capitalize font-semibold">
              {activeView.toLowerCase().replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-600">PostgreSQL Live Sync</span>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full flex-1">{children}</main>
      </div>
    </div>
  );
};