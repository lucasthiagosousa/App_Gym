
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Scale, 
  Zap, 
  Ruler, 
  TrendingUp, 
  Calendar, 
  Plus, 
  ChevronRight,
  Activity
} from 'lucide-react';

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

const ProgressTracking: React.FC = () => {
  const [period, setPeriod] = useState<Period>('1M');
  const [metric, setMetric] = useState<Metric>('weight');

  const activeData = useMemo(() => MOCK_DATA[period], [period]);

  const currentVal = activeData[activeData.length - 1][metric];
  const startVal = activeData[0][metric];
  const diff = (currentVal - startVal).toFixed(1);
  const isGain = parseFloat(diff) > 0;

  return (
    <div className="py-6 space-y-8 pb-24">
      {/* Header Evolution */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
            Titan <span className="text-purple-500">Analytics</span>
          </h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2">Relatórios de Alta Precisão</p>
        </div>
        <div className="w-12 h-12 glass rounded-[1.2rem] flex items-center justify-center text-purple-400">
          <TrendingUp size={24} />
        </div>
      </div>

      {/* Metric & Period Selectors */}
      <div className="space-y-4">
        <div className="flex bg-zinc-900/50 p-1.5 rounded-[1.5rem] border border-white/5">
          <button 
            onClick={() => setMetric('weight')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${metric === 'weight' ? 'bg-white text-black shadow-xl' : 'text-zinc-500'}`}
          >
            <Scale size={14} /> Peso
          </button>
          <button 
            onClick={() => setMetric('bf')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${metric === 'bf' ? 'bg-white text-black shadow-xl' : 'text-zinc-500'}`}
          >
            <Zap size={14} /> Gordura (%)
          </button>
        </div>

        <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar">
          {(['7D', '1M', '1Y'] as Period[]).map((p) => (
            <button 
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border
                ${period === p 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-transparent text-zinc-500 border-zinc-800'}`}
            >
              {p === '7D' ? '7 Dias' : p === '1M' ? '1 Mês' : '1 Ano'}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Chart Card */}
      <section className="neo-card p-6 rounded-[2.5rem] relative overflow-hidden group border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] rounded-full -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic mb-1">Status Atual</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black italic tracking-tighter">{currentVal}</span>
                    <span className="text-sm font-black text-zinc-500 uppercase">{metric === 'weight' ? 'kg' : '%'}</span>
                </div>
            </div>
            <div className={`px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-black italic ${isGain ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {isGain ? '+' : ''}{diff}{metric === 'weight' ? 'kg' : '%'}
            </div>
        </div>

        <div className="h-64 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeData}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#71717a', fontSize: 10, fontWeight: 700}} 
                dy={10} 
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#71717a', fontSize: 10, fontWeight: 700}} 
                dx={-10} 
              />
              <Tooltip 
                contentStyle={{
                    backgroundColor: '#18181b', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
                itemStyle={{color: '#A855F7', fontWeight: 900, fontSize: '12px'}}
                labelStyle={{color: '#71717a', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px'}}
              />
              <Area 
                type="monotone" 
                dataKey={metric} 
                stroke="#A855F7" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#chartGradient)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Body Stats Redesign */}
      <div className="grid grid-cols-2 gap-4">
        <div className="neo-card p-5 rounded-[2rem] border-white/5 group hover:border-purple-500/20 transition-all">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-blue-400 mb-4">
                <Ruler size={20} />
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1 italic">Braço Dir.</p>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black italic tracking-tighter">42.5</span>
                <span className="text-[10px] font-black text-zinc-600">CM</span>
            </div>
            <p className="text-[10px] text-emerald-500 font-black mt-2 uppercase tracking-tighter">+1.2cm • 30d</p>
        </div>
        
        <div className="neo-card p-5 rounded-[2rem] border-white/5 group hover:border-purple-500/20 transition-all">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-cyan-400 mb-4">
                <Activity size={20} />
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1 italic">Massa Magra</p>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black italic tracking-tighter">68.2</span>
                <span className="text-[10px] font-black text-zinc-600">KG</span>
            </div>
            <p className="text-[10px] text-emerald-500 font-black mt-2 uppercase tracking-tighter">+0.5kg • 30d</p>
        </div>
      </div>

      {/* Visual Progress Journal */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 italic">Diário Visual</h3>
            <button className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Ver Tudo</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
            {[1, 2].map(i => (
                <div key={i} className="aspect-[3/4] rounded-[1.5rem] overflow-hidden relative group border border-white/5">
                    <img 
                        src={`https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&index=${i}`} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                        alt="Progresso" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-3 text-[8px] font-black text-white uppercase tracking-widest">15 Jan</span>
                </div>
            ))}
            <button className="aspect-[3/4] rounded-[1.5rem] bg-zinc-900 border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 group hover:border-purple-500/50 transition-all">
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-zinc-500 group-hover:text-purple-400 transition-all">
                    <Plus size={18} />
                </div>
                <span className="text-[8px] uppercase font-black text-zinc-600 tracking-widest">Add Foto</span>
            </button>
        </div>
      </section>

      {/* Global Call to Action */}
      <button className="w-full btn-primary text-white font-black py-5 rounded-[1.5rem] text-xs uppercase tracking-[0.2em] shadow-2xl shadow-purple-600/30 active:scale-95 transition-all italic">
        Sincronizar Novos Dados
      </button>
    </div>
  );
};

export default ProgressTracking;
