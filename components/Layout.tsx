
import React from 'react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const navItems = [
    { id: 'DASHBOARD', icon: 'fa-gauge-high', label: 'Dashboard' },
    { id: 'AGENT_ORCHESTRATOR', icon: 'fa-terminal', label: 'Live Pipeline' },
    { id: 'PRICING_INTEL', icon: 'fa-chart-pie', label: 'Pricing Intel' },
    { id: 'QA_AUDIT', icon: 'fa-microscope', label: 'QA Audit' },
    { id: 'SETTINGS', icon: 'fa-gears', label: 'Control Center' },
    { id: 'MARKET_HUNTER', icon: 'fa-crosshairs', label: 'Market Delta' },
    { id: 'LEGAL_GATE', icon: 'fa-shield-halved', label: 'Legal Audit' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-900/30">
              A
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter leading-none">ARES</h1>
              <p className="text-[9px] text-emerald-500 font-bold tracking-[0.2em] uppercase">Market Intelligence</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group ${
                  activeView === item.id 
                    ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-inner' 
                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300 border border-transparent'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-sm transition-transform group-hover:scale-110`}></i>
                <span className="font-bold text-[11px] uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-3">
          <div className="bg-slate-900/50 rounded border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-mono">
                <span className="text-slate-600 uppercase">OpenRouter</span>
                <span className="text-emerald-500">READY</span>
              </div>
              <div className="flex justify-between text-[8px] font-mono">
                <span className="text-slate-600 uppercase">RAG Engine</span>
                <span className="text-emerald-500">ACTIVE</span>
              </div>
            </div>
          </div>
          <p className="text-[9px] text-slate-600 text-center uppercase tracking-tighter opacity-50 font-mono">V1.2.5-STABLE</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0f172a]/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-2">
             <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">ARES_ROOT</span>
             <i className="fa-solid fa-chevron-right text-[8px] text-slate-700"></i>
             <span className="text-slate-200 text-[10px] font-bold uppercase tracking-[0.2em]">{navItems.find(i => i.id === activeView)?.label}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-slate-500">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded text-[9px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  CORE-11_CONNECTED
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;