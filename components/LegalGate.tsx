
import React, { useState } from 'react';
import { analyzeListingCompliance } from '../services/geminiService';

const LegalGate: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAudit = async () => {
    if (!inputText) return;
    setIsLoading(true);
    try {
      const audit = await analyzeListingCompliance(inputText);
      setResult(audit);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded bg-red-600/20 flex items-center justify-center text-red-500 border border-red-500/30">
          <i className="fa-solid fa-shield-halved text-lg"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold">Agent 6 : Legal Compliance Gate</h1>
          <p className="text-slate-500 text-[11px] uppercase tracking-widest font-mono">Rule: FAIL-CLOSED | Protocol: Loi Alur/Hoguet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded p-5 shadow-2xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-tighter">Raw Payload for Analysis</h3>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste content for Agent 6 review..."
              className="w-full h-72 bg-[#0a0f1d] border border-slate-800 rounded p-4 text-[12px] text-slate-300 font-mono focus:border-emerald-500 outline-none resize-none"
            />
            <button 
              onClick={handleAudit}
              disabled={isLoading || !inputText}
              className={`w-full mt-4 py-3 rounded text-[11px] font-bold uppercase tracking-widest transition-all ${
                isLoading ? 'bg-slate-800 text-slate-600' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40'
              }`}
            >
              {isLoading ? 'Processing Audit...' : 'Execute Fail-Closed Check'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="h-full border-2 border-dashed border-slate-800 rounded flex flex-col items-center justify-center p-12 text-slate-600 opacity-50">
              <i className="fa-solid fa-lock text-4xl mb-4"></i>
              <p className="text-[10px] font-mono">Waiting for validation execution.</p>
            </div>
          ) : (
            <div className={`bg-slate-900 border-2 rounded shadow-2xl overflow-hidden animate-in zoom-in-95 ${
              result.decision === 'PASS' ? 'border-emerald-500/50' : 'border-red-500/50'
            }`}>
              <div className={`p-4 flex justify-between items-center ${
                result.decision === 'PASS' ? 'bg-emerald-500/10' : 'bg-red-500/10'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${
                  result.decision === 'PASS' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  Decision: {result.decision}
                </span>
                <span className="text-[10px] font-mono text-slate-500">Hash: 0x{Math.random().toString(16).substr(2, 8)}</span>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Audit Rationale</h4>
                  <p className="text-[12px] text-slate-300 leading-relaxed font-mono bg-[#0a0f1d] p-3 rounded border border-slate-800">
                    {result.reason}
                  </p>
                </div>

                {result.missingElements.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-red-500 uppercase mb-3">Mandatory Deficiencies Found</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {result.missingElements.map((el: string, i: number) => (
                        <div key={i} className="px-2 py-1.5 bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-mono flex items-center gap-2">
                          <i className="fa-solid fa-triangle-exclamation"></i>
                          {el}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                   <div className="text-[9px] text-slate-500 font-mono">
                     Confidence: {(result.confidence * 100).toFixed(1)}%
                   </div>
                   <button className="text-[9px] font-bold uppercase text-slate-400 hover:text-white transition-all underline">
                     View Full Audit Log
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalGate;
