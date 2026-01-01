
import React, { useState } from 'react';
import { QA_AGENTS } from '../constants';
import { AgentStatus } from '../types';
import { runQAAudit } from '../services/geminiService';

const QAAudit: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [activeTests, setActiveTests] = useState<Set<string>>(new Set());

  const runTest = async (agent: typeof QA_AGENTS[0]) => {
    setActiveTests(prev => new Set(prev).add(agent.id as string));
    try {
      // Mock data to audit
      const mockPayload = {
        source_data: { price: 450000, surface: 45 },
        generated_content: "Magnifique T2 de 45m2 à 450000€...",
        pricing_logic: { delta: 2.5, score: 88 }
      };
      
      const result = await runQAAudit(agent.id as string, agent.systemPrompt, mockPayload);
      setTestResults(prev => ({ ...prev, [agent.id]: result }));
    } catch (e) {
      console.error(e);
      setTestResults(prev => ({ ...prev, [agent.id]: { error: "Execution failed" } }));
    } finally {
      setActiveTests(prev => {
        const next = new Set(prev);
        next.delete(agent.id as string);
        return next;
      });
    }
  };

  const getStatusColor = (id: string) => {
    const res = testResults[id];
    if (!res) return 'text-slate-600';
    if (res.error) return 'text-red-500';
    
    // Check various boolean success flags from different QA agents
    const success = res.is_valid !== false && res.passed !== false && res.is_consistent !== false && res.scenario_passed !== false && res.budget_respected !== false && !res.drift_detected;
    
    return success ? 'text-emerald-500' : 'text-amber-500';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-500 border border-purple-500/30 shadow-inner">
            <i className="fa-solid fa-microscope text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">ARES QA Suite</h1>
            <p className="text-slate-500 text-[11px] uppercase tracking-widest font-mono">Agentic Testing & Regression Protocols</p>
          </div>
        </div>
        <button 
          onClick={() => QA_AGENTS.forEach(runTest)}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-purple-900/40"
        >
          Run Full Suite
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {QA_AGENTS.map((agent) => (
          <div key={agent.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
            <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-purple-400 font-mono">{agent.id}</span>
                <h3 className="text-[11px] font-bold uppercase tracking-tight text-slate-200">{agent.name}</h3>
              </div>
              <button 
                onClick={() => runTest(agent)}
                disabled={activeTests.has(agent.id as string)}
                className="text-[10px] text-slate-500 hover:text-white transition-colors"
              >
                {activeTests.has(agent.id as string) ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-play"></i>}
              </button>
            </div>
            
            <div className="p-5 flex-1 space-y-4">
              <p className="text-[10px] text-slate-500 italic leading-relaxed">{agent.role}</p>
              
              {testResults[agent.id] ? (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                  <div className={`text-[11px] font-mono flex items-center gap-2 ${getStatusColor(agent.id as string)}`}>
                    <i className={`fa-solid ${getStatusColor(agent.id as string).includes('emerald') ? 'fa-check-circle' : 'fa-triangle-exclamation'}`}></i>
                    {getStatusColor(agent.id as string).includes('emerald') ? 'AUDIT PASSED' : 'AUDIT FAILED / WARNING'}
                  </div>
                  
                  {testResults[agent.id].issues?.length > 0 && (
                    <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                      <h4 className="text-[9px] font-black text-red-500 uppercase mb-2">Anomalies Detected</h4>
                      <ul className="space-y-1">
                        {testResults[agent.id].issues.map((issue: string, i: number) => (
                          <li key={i} className="text-[9px] text-red-400 font-mono flex items-start gap-1">
                            <span className="opacity-50">•</span> {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-[#0a0f1d] p-3 rounded-xl border border-slate-800">
                    <pre className="text-[9px] text-slate-500 font-mono overflow-x-auto">
                      {JSON.stringify(testResults[agent.id], null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-24 flex flex-col items-center justify-center text-slate-700 opacity-40">
                  <i className="fa-solid fa-flask-vial text-2xl mb-2"></i>
                  <span className="text-[9px] font-mono uppercase">Idle Protocol</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAAudit;
