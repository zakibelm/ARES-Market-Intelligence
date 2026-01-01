
import React, { useState } from 'react';
import { analyzePricing } from '../services/geminiService';
import { MOCK_MARKET_EVENTS } from '../constants';

const PricingIntel: React.FC = () => {
  const [property, setProperty] = useState({
    price: 450000,
    surface: 45,
    location: 'Paris 15e'
  });
  const [marketStats] = useState({
    median_price_m2: 9800,
    tension_index: 7.2
  });
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = async () => {
    setIsLoading(true);
    try {
      const analysis = await analyzePricing(property, marketStats, MOCK_MARKET_EVENTS);
      setResult(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500 border border-blue-500/30 shadow-inner">
          <i className="fa-solid fa-chart-pie text-xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Agent 11 : Pricing Intelligence</h1>
          <p className="text-slate-500 text-[11px] uppercase tracking-widest font-mono">Protocol: Market Scoring | Logic: Chiffrée & Auditée</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulaire de saisie */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Données du Bien</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-600 uppercase mb-1.5 ml-1">Prix de vente (€)</label>
                <input 
                  type="number"
                  value={property.price}
                  onChange={(e) => setProperty({...property, price: Number(e.target.value)})}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl p-3 text-sm text-white font-mono outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-600 uppercase mb-1.5 ml-1">Surface (m²)</label>
                <input 
                  type="number"
                  value={property.surface}
                  onChange={(e) => setProperty({...property, surface: Number(e.target.value)})}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl p-3 text-sm text-white font-mono outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-600 uppercase mb-1.5 ml-1">Secteur / Quartier</label>
                <input 
                  type="text"
                  value={property.location}
                  onChange={(e) => setProperty({...property, location: e.target.value})}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl p-3 text-sm text-white font-mono outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
               <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2">
                 <span>Médiane Quartier:</span>
                 <span className="text-slate-300">{marketStats.median_price_m2} €/m²</span>
               </div>
               <div className="flex justify-between text-[10px] font-mono text-slate-500">
                 <span>Tension Marché:</span>
                 <span className="text-amber-500">{marketStats.tension_index}/10</span>
               </div>
            </div>

            <button 
              onClick={handleAnalysis}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isLoading ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
              }`}
            >
              {isLoading ? 'Calcul en cours...' : 'Lancer l\'Analyse Intel'}
            </button>
          </div>
        </div>

        {/* Résultats de l'analyse */}
        <div className="lg:col-span-8 space-y-6">
          {!result ? (
            <div className="h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-12 text-slate-600 opacity-50">
              <i className="fa-solid fa-calculator text-5xl mb-6"></i>
              <p className="text-[11px] font-mono uppercase tracking-widest text-center max-w-xs">
                En attente d'exécution. L'Agent 11 calculera le score de positionnement et la cinétique de vente.
              </p>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
              {/* Score Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Pricing Score</span>
                    <div className="text-4xl font-black text-emerald-400 font-mono">{result.pricing_score}<span className="text-lg opacity-50">/100</span></div>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Positionnement</span>
                    <div className={`text-lg font-black uppercase ${
                      result.positioning_label === 'Sous-prix' ? 'text-blue-400' :
                      result.positioning_label === 'Juste prix' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {result.positioning_label}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">{result.delta_vs_market_percent > 0 ? '+' : ''}{result.delta_vs_market_percent}% vs marché</span>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Confiance Data</span>
                    <div className={`text-lg font-black uppercase ${
                      result.confidence_level === 'High' ? 'text-emerald-400' :
                      result.confidence_level === 'Medium' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {result.confidence_level}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">Multi-sources sync</span>
                 </div>
              </div>

              {/* Summary & Recommended Action */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                 <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Diagnostic Stratégique</h4>
                      <p className="text-[13px] text-slate-300 leading-relaxed font-mono bg-[#0a0f1d] p-5 rounded-2xl border border-slate-800">
                        "{result.analysis_summary}"
                      </p>
                    </div>

                    <div className="bg-emerald-600/10 border border-emerald-500/20 p-5 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <i className="fa-solid fa-bullseye text-emerald-500"></i>
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Action Recommandée Terrain</h4>
                      </div>
                      <p className="text-[12px] text-emerald-200/80 font-bold leading-relaxed">
                        {result.recommended_action}
                      </p>
                    </div>
                 </div>

                 <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center px-6">
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${result.market_tension === 'Forte' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          <span className="text-[9px] font-mono text-slate-500">Tension: {result.market_tension}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <i className="fa-solid fa-calendar-day text-[10px] text-slate-600"></i>
                          <span className="text-[9px] font-mono text-slate-500">Délai estimé: {result.estimated_days_on_market || '--'} jours</span>
                       </div>
                    </div>
                    <button className="text-[9px] font-black uppercase text-blue-400 hover:text-blue-300 transition-all flex items-center gap-2">
                       <i className="fa-solid fa-file-pdf"></i>
                       Générer Rapport Vendeur
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

export default PricingIntel;
