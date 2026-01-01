
import React, { useState, useEffect } from 'react';
import { Agent } from '../types';
import { INITIAL_AGENTS } from '../constants';

const AgentConfig: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');

  useEffect(() => {
    const saved = localStorage.getItem('ARES_AGENTS_CONFIG');
    if (saved) {
      setAgents(JSON.parse(saved));
    } else {
      setAgents(INITIAL_AGENTS);
      localStorage.setItem('ARES_AGENTS_CONFIG', JSON.stringify(INITIAL_AGENTS));
    }
  }, []);

  useEffect(() => {
    if (agents.length > 0 && !selectedAgent) {
      setSelectedAgent(agents[0]);
    }
  }, [agents]);

  const handleUpdate = (updates: Partial<Agent>) => {
    if (!selectedAgent) return;
    const updatedAgents = agents.map(a => 
      a.id === selectedAgent.id ? { ...a, ...updates } : a
    );
    setAgents(updatedAgents);
    setSelectedAgent({ ...selectedAgent, ...updates });
    
    // Autosave logic
    setSaveStatus('SAVING');
    localStorage.setItem('ARES_AGENTS_CONFIG', JSON.stringify(updatedAgents));
    setTimeout(() => setSaveStatus('SAVED'), 500);
    setTimeout(() => setSaveStatus('IDLE'), 2000);
  };

  const modelOptions = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Superior Intelligence)' },
    { id: 'openai/gpt-4o', name: 'GPT-4o (Omni High Speed)' },
    { id: 'meta-llama/llama-3.1-405b', name: 'Llama 3.1 405B (Open State-of-the-Art)' },
    { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B (Cheap/Fast Ingestion)' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Massive Context)' },
    { id: 'mistralai/pixtral-12b', name: 'Pixtral 12B (Vision Specialist)' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">ARES Market Intelligence</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-mono">Personnalisation des Master Prompts & RAG Context</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'SAVING' && <span className="text-[10px] font-mono text-amber-500 animate-pulse">WRITING TO NEON DB...</span>}
          {saveStatus === 'SAVED' && <span className="text-[10px] font-mono text-emerald-500">SYNC COMPLETE</span>}
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-400">
            AUTO-SAVE: ACTIVE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* Navigation des Agents */}
        <div className="lg:col-span-3 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 group ${
                selectedAgent?.id === agent.id
                  ? 'bg-emerald-600/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[9px] font-mono font-bold ${selectedAgent?.id === agent.id ? 'text-emerald-500' : 'text-slate-600'}`}>
                  AGENT_0{agent.id}
                </span>
                <i className={`fa-solid fa-brain text-[10px] ${selectedAgent?.id === agent.id ? 'text-emerald-500' : 'text-slate-700'}`}></i>
              </div>
              <h3 className={`text-xs font-bold uppercase tracking-tight ${selectedAgent?.id === agent.id ? 'text-emerald-400' : 'text-slate-300'}`}>
                {agent.name}
              </h3>
              <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{agent.role}</p>
            </button>
          ))}
        </div>

        {/* Panneau d'Édition */}
        <div className="lg:col-span-9 bg-[#0a0f1d] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          {selectedAgent ? (
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Identification */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Agent Designation</label>
                    <input 
                      type="text" 
                      value={selectedAgent.name}
                      onChange={(e) => handleUpdate({ name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white font-bold outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Operational Role</label>
                    <input 
                      type="text" 
                      value={selectedAgent.role}
                      onChange={(e) => handleUpdate({ role: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-400 outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Modèle & Arbitrage */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">LLM Engine (OpenRouter)</label>
                    <select 
                      value={selectedAgent.model}
                      onChange={(e) => handleUpdate({ model: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-emerald-400 font-mono outline-none focus:border-emerald-500/50 transition-all appearance-none"
                    >
                      {modelOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fa-solid fa-circle-info text-emerald-500 text-[10px]"></i>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Routing Insight</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                      L'Agent 0 utilisera {selectedAgent.model.split('/')[1]} pour optimiser le ratio coût/intelligence de cette tâche.
                    </p>
                  </div>
                </div>
              </div>

              {/* System Prompt (Master Prompt) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Master System Prompt</label>
                  <span className="text-[9px] font-mono text-slate-600">Tokens: ~{Math.round(selectedAgent.systemPrompt.length / 4)}</span>
                </div>
                <textarea 
                  value={selectedAgent.systemPrompt}
                  onChange={(e) => handleUpdate({ systemPrompt: e.target.value })}
                  className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-[12px] text-slate-300 font-mono leading-relaxed outline-none focus:border-emerald-500/50 resize-none transition-all"
                  placeholder="Enter the master instructions for this agent..."
                />
              </div>

              {/* RAG Context */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">RAG Context / Vector knowledge</label>
                <textarea 
                  value={selectedAgent.ragContext}
                  onChange={(e) => handleUpdate({ ragContext: e.target.value })}
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-[12px] text-emerald-500/60 font-mono leading-relaxed outline-none focus:border-emerald-500/50 resize-none transition-all"
                  placeholder="Inject local data, legal texts, or agency-specific rules..."
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
              <i className="fa-solid fa-brain text-5xl opacity-20"></i>
              <p className="font-mono text-sm uppercase tracking-widest">Sélectionnez un agent pour configurer son cerveau</p>
            </div>
          )}

          <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center px-8">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-mono text-slate-400">PostgreSQL Cloud Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-mono text-slate-400">RAG Vector Index Sync</span>
              </div>
            </div>
            <button 
              onClick={() => alert('Configuration push vers production (Simulation)')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase rounded-lg transition-all"
            >
              Push to Production
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConfig;