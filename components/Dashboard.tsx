
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 280 },
  { name: 'Fri', value: 590 },
  { name: 'Sat', value: 120 },
  { name: 'Sun', value: 450 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Listings', value: '1,482', change: '+12%', icon: 'fa-house', color: 'text-blue-400' },
          { label: 'Active Agents', value: '11/11', change: 'Stable', icon: 'fa-robot', color: 'text-emerald-400' },
          { label: 'Legal Blocks', value: '23', change: '-5%', icon: 'fa-shield-halved', color: 'text-red-400' },
          { label: 'Market Deltas (7d)', value: '312', change: '+18%', icon: 'fa-chart-line', color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${stat.color}`}>
                <i className={`fa-solid ${stat.icon} text-lg`}></i>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold">Market Hunting Activity</h2>
              <p className="text-sm text-slate-500">Incremental scrapers performance across platforms</p>
            </div>
            <select className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Logs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Live Execution</h2>
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2">
            {[
              { time: '02:00:01', msg: 'Market Hunter initiated Night Harvest', type: 'SYS' },
              { time: '02:05:12', msg: 'Agent 10 identified 12 new listings', type: 'DATA' },
              { time: '02:08:44', msg: 'Pricing Intel updated rolling 7j stats', type: 'INTEL' },
              { time: '02:10:00', msg: 'Legal Gate blocked 1 suspicious listing', type: 'BLOCK' },
              { time: '02:12:31', msg: 'RAG Local context update completed', type: 'DATA' },
              { time: '02:15:00', msg: 'System integrity check: PASSED', type: 'SYS' },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 text-xs mono leading-relaxed border-b border-slate-800 pb-3 last:border-0">
                <span className="text-slate-500 shrink-0">{log.time}</span>
                <span className={`px-1.5 py-0.5 rounded uppercase text-[10px] h-fit font-bold ${
                  log.type === 'BLOCK' ? 'bg-red-500/10 text-red-500' : 
                  log.type === 'DATA' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-slate-400'
                }`}>
                  {log.type}
                </span>
                <p className="text-slate-300">{log.msg}</p>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors">
            View Full System Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
