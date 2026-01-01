
import React, { useState, useEffect, useRef } from 'react';
import { Agent, AgentStatus } from '../types';
import { INITIAL_AGENTS, QA_AGENTS } from '../constants';

const AgentTerminal: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [pipelineMetrics, setPipelineMetrics] = useState({ 
    totalLatency: 0, 
    totalCost: 0, 
    status: 'IDLE',
    jobId: ''
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ARES_AGENTS_CONFIG');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAgents(parsed);
      setSelectedAgent(parsed[0]);
    } else {
      setSelectedAgent(INITIAL_AGENTS[0]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedAgent?.logs, agents]);

  const runPipeline = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    const jobId = `JOB_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setPipelineMetrics({ totalLatency: 0, totalCost: 0, status: 'RUNNING', jobId });
    
    // Reset status and logs
    setAgents(prev => prev.map(a => ({ 
      ...a, 
      status: AgentStatus.IDLE, 
      logs: [`[ORCHESTRATOR] Job ${jobId} initialized. Routing to ${a.model}.`] 
    })));

    let latencyCounter = 0;
    let costCounter = 0;

    // Orchestrator starts the sequence
    const sequence = [1, 2, 3, 11, 4, 6, 5]; // Main functional agents
    
    for (const agentId of sequence) {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) continue;

      const agentLatency = Math.floor(Math.random() * 1500) + 500;
      const agentCost = (Math.random() * 0.008) + 0.002;

      setAgents(prev => prev.map(a => a.id === agentId ? { 
        ...a, 
        status: AgentStatus.RUNNING, 
        logs: [
          ...a.logs, 
          `[SLA] Target Latency: ${a.id === 6 ? '40s' : '20s'}`,
          `[ROUTING] Execution via OpenRouter: ${a.model}`,
          `[PROCESS] Executing functional logic...`
        ] 
      } : a));
      
      await new Promise(r => setTimeout(r, 800));

      latencyCounter += agentLatency;
      costCounter += agentCost;
      setPipelineMetrics(prev => ({ ...prev, totalLatency: latencyCounter, totalCost: costCounter }));

      let finalStatus = AgentStatus.SUCCESS;
      let finalLogs = [`[SUCCESS] Task completed in ${agentLatency}ms.`];

      if (agentId === 6 && Math.random() > 0.8) {
        finalStatus = AgentStatus.BLOCKED;
        finalLogs = [`[CRITICAL] FAIL-CLOSED Triggered by Legal Auditor.`];
      }

      setAgents(prev => prev.map(a => a.id === agentId ? { 
        ...a, 
        status: finalStatus, 
        logs: [...a.logs, ...finalLogs]
      } : a));

      if (finalStatus === AgentStatus.BLOCKED) {
        setPipelineMetrics(prev => ({ ...prev, status: 'BLOCKED' }));
        setIsSimulating(false);
        return;
      }
    }

    // QA PHASE
    setPipelineMetrics(prev => ({ ...prev, status: 'QA_AUDIT' }));
    const qaSeq = ['QA-1', 'QA-2', 'QA-4']; // Core QA checks
    
    for (const qaId of qaSeq) {
       const qaAgent = QA_AGENTS.find(q => q.id === qaId);
       if (!qaAgent) continue;
       
       latencyCounter += 400;
       setPipelineMetrics(prev => ({ ...prev, totalLatency: latencyCounter }));
       
       // Log QA activity in Orchestrator
       setAgents(prev => prev.map(a => a.id === 0 ? {
         ...a,
         logs: [...a.logs, `[QA-ORCHESTRATOR] Launching ${qaId} (${qaAgent.name})...`]
       } : a));
       
       await new Promise(r => setTimeout(r, 600));
       
       setAgents(prev => prev.map(a => a.id === 0 ? {
         ...a,
         logs: [...a.logs, `[QA-ORCHESTRATOR] ${qaId} PASSED. Integrity score: 0.99`]
       } : a));
    }
    
    setPipelineMetrics(prev => ({ ...prev, status: 'COMPLETED' }));
    setIsSimulating(false);
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Metrics Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Job Identity</span>
            <span className="text-xs font-mono text-emerald-400">{pipelineMetrics.jobId || 'N/A'}</span>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Accumulated Latency</span>
            <span className="text-xs font-mono text-white">{(pipelineMetrics.totalLatency / 1000).toFixed(2)}s</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Current Cost</span>
            <span className="text-xs font-mono text-blue-400">${pipelineMetrics.totalCost.toFixed(4)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
            pipelineMetrics.status === 'RUNNING' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
            pipelineMetrics.status === 'QA_AUDIT' ? 'bg-purple-500/10 text-purple-500 animate-pulse' :
            pipelineMetrics.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
            pipelineMetrics.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-500'
          }`}>
            Status: {pipelineMetrics.status}
          </div>
          <button 
            onClick={runPipeline}
            disabled={isSimulating}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              isSimulating ? 'bg-slate-800 text-slate-600' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
            }`}
          >
            {isSimulating ? 'Executing...' : 'Start Pipeline'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Sidebar: Agent Status */}
        <div className="lg:col-span-4 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                selectedAgent?.id === agent.id
                  ? 'bg-slate-800 border-slate-600 shadow-lg'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  agent.status === AgentStatus.RUNNING ? 'bg-amber-500 animate-pulse' :
                  agent.status === AgentStatus.SUCCESS ? 'bg-emerald-500' :
                  agent.status === AgentStatus.BLOCKED ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-700'
                }`}></div>
                <div className="overflow-hidden">
                  <h4 className="text-[11px] font-black text-slate-200 uppercase tracking-tight truncate">{agent.name}</h4>
                  <p className="text-[9px] text-slate-500 font-mono truncate">{agent.model.split('/')[1] || agent.model}</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-[8px] text-slate-700"></i>
            </button>
          ))}
          
          <div className="pt-4 border-t border-slate-800 mt-4">
             <h5 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 px-2">QA Monitors</h5>
             {QA_AGENTS.map(qa => (
               <div key={qa.id} className="flex items-center gap-3 p-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{qa.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Terminal Window */}
        <div className="lg:col-span-8 bg-[#0a0f1d] border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                {selectedAgent?.name} / EXEC_LOG_STREAM
              </span>
            </div>
            <div className="text-[9px] font-mono text-slate-600">v1.2.5-STABLE</div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed space-y-2 custom-scrollbar"
          >
            {selectedAgent?.logs.map((log, i) => (
              <div key={i} className="flex gap-4 group">
                <span className="text-slate-700 select-none">{String(i + 1).padStart(3, '0')}</span>
                <span className={`
                  ${log.includes('[ERROR]') || log.includes('[CRITICAL]') || log.includes('[FAIL-CLOSED]') ? 'text-red-400' : 
                    log.includes('[SUCCESS]') ? 'text-emerald-400' : 
                    log.includes('[QA-ORCHESTRATOR]') ? 'text-purple-400' :
                    log.includes('[ORCHESTRATOR]') ? 'text-blue-400' : 'text-slate-400'}
                `}>
                  {log}
                </span>
              </div>
            ))}
            {selectedAgent?.status === AgentStatus.RUNNING && (
              <div className="flex gap-4 animate-pulse">
                <span className="text-slate-700">...</span>
                <span className="text-emerald-500">_EXECUTING_THREAD_</span>
              </div>
            )}
            {selectedAgent?.logs.length === 0 && (
              <div className="text-slate-700 italic">No execution data in current buffer.</div>
            )}
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center px-6 shrink-0">
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-slate-600 uppercase">Context Info:</span>
                <span className="text-[9px] font-mono text-slate-400">RAG_READY | QA_SYNC_OK</span>
             </div>
             <div className="flex items-center gap-2">
                <i className="fa-solid fa-microchip text-[10px] text-emerald-500/50"></i>
                <span className="text-[9px] font-mono text-slate-500">{selectedAgent?.model}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentTerminal;
