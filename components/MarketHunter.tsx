
import React from 'react';
import { MOCK_MARKET_EVENTS } from '../constants';

const MarketHunter: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold mb-1">Agent 10: Market Hunter</h1>
          <p className="text-slate-500 text-xs">Incremental delta scraping & fingerprinting journal.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-300">Harvester Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Delta Journal */}
          <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden shadow-xl">
            <div className="p-3 bg-slate-800/40 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Incremental Event Journal</h3>
              <span className="text-[10px] text-slate-500 font-mono">Total Events: {MOCK_MARKET_EVENTS.length}</span>
            </div>
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-bold">TYPE</th>
                  <th className="p-3 font-bold">FINGERPRINT</th>
                  <th className="p-3 font-bold">LOCATION</th>
                  <th className="p-3 font-bold">DELTA PRICE</th>
                  <th className="p-3 font-bold text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_MARKET_EVENTS.map(ev => (
                  <tr key={ev.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        ev.type === 'NEW' ? 'bg-emerald-500/10 text-emerald-500' :
                        ev.type === 'UPDATED' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {ev.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{ev.fingerprint}</td>
                    <td className="p-3 text-slate-200">{ev.location}</td>
                    <td className="p-3">
                      {ev.previousPrice ? (
                        <div className="flex flex-col">
                          <span className="text-red-400 line-through text-[9px]">{ev.previousPrice.toLocaleString()} €</span>
                          <span className="text-emerald-400">{ev.price.toLocaleString()} €</span>
                        </div>
                      ) : (
                        <span className="text-slate-300">{ev.price.toLocaleString()} €</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-slate-600">{ev.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          {/* Agent 11: Pricing Intel Card */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-blue-600/20 flex items-center justify-center text-blue-500">
                <i className="fa-solid fa-calculator text-[10px]"></i>
              </div>
              <h3 className="text-xs font-bold uppercase text-slate-400">Agent 11 Intelligence</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-[#0a0f1d] rounded border border-slate-800">
                <p className="text-[10px] text-slate-500 mb-1">Market Position Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">82.4</span>
                  <span className="text-[10px] text-emerald-500 mb-1">+1.2% vs yesterday</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 italic leading-relaxed">
                "Basé sur les market_events des dernières 48h, nous observons une correction de prix moyenne de 2.1% sur le secteur Paris 15e."
              </div>
            </div>
          </div>

          <div className="bg-emerald-600/10 border border-emerald-500/20 p-4 rounded">
            <h4 className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Night Harvest Schedule</h4>
            <p className="text-[10px] text-slate-400 mb-3">Next run at 02:00 UTC (Incrémental uniquement)</p>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketHunter;
