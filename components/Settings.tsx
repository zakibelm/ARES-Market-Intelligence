
import React, { useState, useEffect } from 'react';
import { Agent, RagFile } from '../types';
import { INITIAL_AGENTS } from '../constants';

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('ARES_OPENROUTER_KEY');
    if (savedKey) setApiKey(savedKey);

    const savedAgents = localStorage.getItem('ARES_AGENTS_CONFIG');
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    } else {
      setAgents(INITIAL_AGENTS);
    }
  }, []);

  const saveKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem('ARES_OPENROUTER_KEY', val);
  };

  const openAgentModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const updateAgent = (updates: Partial<Agent>) => {
    if (!selectedAgent) return;
    const updated = agents.map(a => a.id === selectedAgent.id ? { ...a, ...updates } : a);
    setAgents(updated);
    setSelectedAgent({ ...selectedAgent, ...updates });
    localStorage.setItem('ARES_AGENTS_CONFIG', JSON.stringify(updated));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && selectedAgent) {
      // Fix: Explicitly type the mapped element as 'File' to resolve 'unknown' property access errors (name, type, size)
      const filesArray = Array.from(e.target.files).map((f: File) => ({
        name: f.name,
        type: f.type,
        size: (f.size / 1024).toFixed(1) + ' KB'
      }));
      const currentFiles = selectedAgent.ragFiles || [];
      updateAgent({ ragFiles: [...currentFiles, ...filesArray] });
    }
  };

  const modelOptions = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Expert)' },
    { id: 'openai/gpt-4o', name: 'GPT-4o (High Speed)' },
    { id: 'meta-llama/llama-3.1-405b', name: 'Llama 3.1 405B (Heavy)' },
    // Fix: Updated from prohibited google/gemini-pro-1.5 to gemini-3-pro-preview
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Context)' },
    { id: 'mistralai/pixtral-12b', name: 'Pixtral 12B (Vision)' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (Cheap)' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* HEADER & API KEY */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
        <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-all duration-700">
          <i className="fa-solid fa-server text-[200px]"></i>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
              <i className="fa-solid fa-bolt-lightning text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">CENTRE DE CONTRÔLE ARES</h1>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Configuration Master & Orchestration Core-11</p>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">OpenRouter Master API Key</label>
            <div className="relative group/input">
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => saveKey(e.target.value)}
                placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-12 text-sm text-emerald-400 font-mono outline-none focus:border-emerald-500 transition-all shadow-inner" 
              />
              <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-emerald-500"></i>
            </div>
            <p className="text-[10px] text-slate-600 font-mono italic">Cette clé est unique et sécurisée. Elle pilote l'ensemble des 11 agents ci-dessous.</p>
          </div>
        </div>
      </div>

      {/* AGENTS GRID */}
      <div className="space-y-6">
        <div className="flex justify-between items-end px-2">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Gestion du Core-11</h2>
          <span className="text-[10px] font-mono text-emerald-500/50">Cliquez sur un agent pour le configurer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => openAgentModal(agent)}
              className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl text-left hover:border-emerald-500/30 hover:bg-slate-900 transition-all duration-300 group shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-mono text-slate-500 uppercase">
                  Agent_{String(agent.id).padStart(2, '0')}
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-brain text-xs"></i>
                </div>
              </div>
              <h3 className="font-bold text-slate-200 uppercase tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">{agent.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono line-clamp-1 italic">{agent.role}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                 <span className="text-[9px] font-mono text-slate-600 truncate max-w-[120px]">{agent.model.split('/')[1]}</span>
                 <div className="flex -space-x-1">
                   {(agent.ragFiles || []).length > 0 && (
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500 text-[8px]">
                        <i className="fa-solid fa-file"></i>
                      </div>
                   )}
                 </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL POPUP */}
      {isModalOpen && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                   <i className="fa-solid fa-microchip text-xl"></i>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold uppercase tracking-tight">Config: {selectedAgent.name}</h3>
                   <p className="text-xs text-slate-500 font-mono italic">{selectedAgent.role}</p>
                 </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* AI MODEL SELECTOR */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Choix du Modèle OpenRouter</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {modelOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateAgent({ model: opt.id })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedAgent.model === opt.id 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase">{opt.name.split('(')[0]}</p>
                      <p className="text-[8px] font-mono opacity-60 truncate">{opt.id}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* SYSTEM PROMPT */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">System Prompt (Instructions)</label>
                  <span className="text-[9px] font-mono text-slate-700">Markdown supporté</span>
                </div>
                <textarea 
                  value={selectedAgent.systemPrompt}
                  onChange={(e) => updateAgent({ systemPrompt: e.target.value })}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[13px] text-slate-300 font-mono leading-relaxed outline-none focus:border-emerald-500 transition-all resize-none shadow-inner"
                  placeholder="Définissez les règles de comportement de l'agent..."
                />
              </div>

              {/* RAG UPLOAD SECTION */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Base de Connaissance RAG (PDF, CSV, Image, Doc)</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Dropzone */}
                   <label className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-pointer group">
                      <input type="file" multiple className="hidden" onChange={handleFileUpload} accept=".pdf,.csv,.doc,.docx,.jpg,.png" />
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-400">Cliquez pour uploader</p>
                        <p className="text-[9px] text-slate-600 font-mono mt-1">PDF, DOC, CSV ou Images</p>
                      </div>
                   </label>

                   {/* File List */}
                   <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[140px] overflow-y-auto">
                      {(selectedAgent.ragFiles || []).length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-[10px] font-mono text-slate-700 italic">Aucun document chargé</p>
                        </div>
                      ) : (
                        selectedAgent.ragFiles?.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                             <div className="flex items-center gap-3">
                               <i className={`fa-solid ${file.name.endsWith('.pdf') ? 'fa-file-pdf text-red-400' : 'fa-file-lines text-blue-400'} text-xs`}></i>
                               <div>
                                 <p className="text-[10px] font-bold text-slate-300 truncate max-w-[120px]">{file.name}</p>
                                 <p className="text-[8px] text-slate-600">{file.size}</p>
                               </div>
                             </div>
                             <button 
                               onClick={() => {
                                 const updatedFiles = selectedAgent.ragFiles?.filter((_, i) => i !== idx);
                                 updateAgent({ ragFiles: updatedFiles });
                               }}
                               className="text-slate-700 hover:text-red-400 transition-colors"
                             >
                               <i className="fa-solid fa-trash-can text-[10px]"></i>
                             </button>
                          </div>
                        ))
                      )}
                   </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Synchronisation NeonDB Ready</span>
               </div>
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-900/40"
               >
                 Enregistrer
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
