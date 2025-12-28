
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Scale, Zap, Ruler, TrendingUp, Calendar, Plus, ChevronRight, Activity, Trophy, Medal, Star } from 'lucide-react';

type Period = '7D' | '1M' | '1Y';
type Metric = 'weight' | 'bf';

const MOCK_DATA = {
  '7D': [
    { name: 'Seg', weight: 80.2, bf: 14.5 },
    { name: 'Ter', weight: 80.0, bf: 14.4 },
    { name: 'Qua', weight: 79.8, bf: 14.4 },
    { name: 'Qui', weight: 80.1, bf: 14.3 },
    { name: 'Sex', weight: 79.5, bf: 14.2 },
    { name: 'Sáb', weight: 79.3, bf: 14.2 },
    { name: 'Dom', weight: 79.0, bf: 14.1 },
  ],
  '1M': [
    { name: 'Sem 1', weight: 82.0, bf: 15.2 },
    { name: 'Sem 2', weight: 81.2, bf: 14.8 },
    { name: 'Sem 3', weight: 80.5, bf: 14.5 },
    { name: 'Sem 4', weight: 79.0, bf: 14.1 },
  ],
  '1Y': [
    { name: 'Set', weight: 88.0, bf: 18.5 },
    { name: 'Out', weight: 86.5, bf: 17.2 },
    { name: 'Nov', weight: 84.0, bf: 16.5 },
    { name: 'Dez', weight: 83.2, bf: 16.0 },
    { name: 'Jan', weight: 81.5, bf: 15.2 },
    { name: 'Fev', weight: 79.0, bf: 14.1 },
  ]
};

const PR_DATA = [
  { id: '1', name: 'Supino Reto', weight: 110, icon: <Zap size={16} /> },
  { id: '2', name: 'Agachamento', weight: 145, icon: <Activity size={16} /> },
  { id: '3', name: 'Lev. Terra', weight: 180, icon: <Trophy size={16} /> },
  { id: '4', name: 'Rosca Direta', weight: 55, icon: <Star size={16} /> },
];

const ProgressTracking: React.FC = () => {
  const [period, setPeriod] = useState<Period>('1M');
  const [metric, setMetric] = useState<Metric>('weight');

  const activeData = useMemo(() => MOCK_DATA[period], [period]);

  const currentVal = activeData[activeData.length - 1][metric];
  const startVal = activeData[0][metric];
  const diff = (currentVal - startVal).toFixed(1);
  const isGain = parseFloat(diff) > 0;

  return (
    <div className="py-6 space-y-8 pb-32">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Analytics <span className="text-purple-500">Titan</span>
        </h2>
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Sua evolução em tempo real</p>
      </div>

      {/* Period Selection */}
      <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
        {(['7D', '1M', '1Y'] as Period[]).map(p => (
          <button 
            key={p} 
            onClick={() => setPeriod(p)}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${period === p ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <section className="neo-card p-6 rounded-[2.5rem] border-white/5 bg-zinc-900/20">
        <div className="flex justify-between items-end mb-8">
           <div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic">Métrica Atual</p>
              <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black italic text-white tracking-tighter">{currentVal}</span>
                  <span className="text-xs font-bold text-zinc-600 uppercase">{metric === 'weight' ? 'kg' : '%'}</span>
              </div>
           </div>
           <div className={`px-3 py-1 rounded-full text-[10px] font-black italic ${isGain ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {isGain ? '+' : ''}{diff}{metric === 'weight' ? 'kg' : '%'}
           </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeData}>
              <defs>
                <linearGradient id="chartG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} dy={10} />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px'}}
                itemStyle={{color: '#A855F7', fontSize: '12px', fontWeight: 'bold'}}
                labelStyle={{color: '#71717a', fontSize: '10px'}}
              />
              <Area type="monotone" dataKey={metric} stroke="#A855F7" strokeWidth={3} fill="url(#chartG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* PR Wall (Hall of Fame) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Hall da Fama (PRs)</h3>
          <Medal size={16} className="text-amber-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
           {PR_DATA.map(pr => (
             <div key={pr.id} className="neo-card p-5 rounded-[2rem] border-white/5 bg-gradient-to-br from-zinc-900 to-black group hover:border-amber-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                    {pr.icon}
                  </div>
                  <div className="text-[8px] font-black text-amber-500 uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10">PR</div>
                </div>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{pr.name}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-white italic tracking-tighter">{pr.weight}</span>
                  <span className="text-[10px] font-black text-zinc-700 uppercase">KG</span>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Treinos', val: '42', color: 'text-purple-500' },
          { label: 'Volume', val: '1.2t', color: 'text-blue-500' },
          { label: 'Semanas', val: '12', color: 'text-emerald-500' }
        ].map(s => (
          <div key={s.label} className="neo-card p-4 rounded-3xl text-center border-white/5">
             <p className="text-lg font-black text-white italic tracking-tighter leading-none">{s.val}</p>
             <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracking;
