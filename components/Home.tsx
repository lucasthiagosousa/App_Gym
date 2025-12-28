
import React, { useMemo, useState, useEffect } from 'react';
import { 
  Flame, Zap, ArrowRight, Activity, Clock, BatteryFull, BatteryMedium, 
  BatteryLow, Fingerprint, Target, TrendingUp, AlertTriangle, 
  ShieldCheck, ChevronDown, Sparkles, Brain, PlusCircle, Check, 
  X, Info, Droplets, Utensils, Users, Globe, Plus
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { View, ActiveProtocol, Exercise, HydrationLog, MacroLog } from '../types';
import { EXERCISES } from '../data/exercises';

interface HomeProps {
  completedDays: string[];
  toggleDay: (date: string) => void;
  onNavigate: (view: View) => void;
  activeProtocol?: ActiveProtocol | null;
  setProtocol?: (p: ActiveProtocol | null) => void;
}

const BIO_SCAN_DATA = [
  { subject: 'PEITO', A: 65, full: 100 },
  { subject: 'COSTAS', A: 85, full: 100 },
  { subject: 'PERNAS', A: 50, full: 100 },
  { subject: 'BRAÇOS', A: 90, full: 100 },
  { subject: 'OMBROS', A: 75, full: 100 },
];

const NEWS_FEED = [
  { id: 1, user: "Alex_Titan", action: "bateu novo PR no Supino!", icon: <TrendingUp size={12}/>, time: "2 min ago" },
  { id: 2, user: "Coach_AI", action: "atualizou o guia de Biomecânica.", icon: <Sparkles size={12}/>, time: "15 min ago" },
  { id: 3, user: "Sara_Fitness", action: "completou 15 dias seguidos!", icon: <Flame size={12}/>, time: "1h ago" },
];

const Home: React.FC<HomeProps> = ({ completedDays, toggleDay, onNavigate, activeProtocol, setProtocol }) => {
  const [energyLevel, setEnergyLevel] = useState<number | null>(() => {
    const saved = localStorage.getItem('daily_energy');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [hydration, setHydration] = useState<HydrationLog>(() => {
    const saved = localStorage.getItem('titan_hydration');
    return saved ? JSON.parse(saved) : { goal: 3500, current: 0, lastUpdate: Date.now() };
  });

  const [macros, setMacros] = useState<MacroLog>(() => {
    const saved = localStorage.getItem('titan_macros');
    return saved ? JSON.parse(saved) : { 
      protein: { goal: 180, current: 0 },
      carbs: { goal: 250, current: 0 },
      fats: { goal: 70, current: 0 }
    };
  });

  const [showWeaknessFix, setShowWeaknessFix] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [weakPointCategory, setWeakPointCategory] = useState<'Pernas' | 'Peitoral' | 'Costas' | 'Bíceps'>('Pernas');

  useEffect(() => {
    localStorage.setItem('titan_hydration', JSON.stringify(hydration));
  }, [hydration]);

  useEffect(() => {
    localStorage.setItem('titan_macros', JSON.stringify(macros));
  }, [macros]);

  const addWater = (amount: number) => {
    setHydration(prev => ({ ...prev, current: Math.min(prev.goal, prev.current + amount) }));
  };

  const handleSetEnergy = (val: number) => {
    setEnergyLevel(val);
    localStorage.setItem('daily_energy', JSON.stringify(val));
  };
  
  const streak = completedDays.length;

  const handleInjectFix = (exercise: Exercise) => {
    if (!activeProtocol || !setProtocol) return;
    setIsFixing(true);
    const newContent = activeProtocol.content + `\n- ${exercise.name}: 3x12 - [REFORÇO CORRETIVO: ELO FRACO]`;
    const updatedProtocol = { ...activeProtocol, content: newContent };
    setProtocol(updatedProtocol);
    localStorage.setItem('activeProtocol', JSON.stringify(updatedProtocol));
    setTimeout(() => {
      setIsFixing(false);
      setShowWeaknessFix(false);
      onNavigate('protocol');
    }, 1200);
  };

  const hydrationProgress = (hydration.current / hydration.goal) * 100;

  return (
    <div className="py-6 space-y-8">
      {/* Header Profile Section */}
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-bebas tracking-tight text-white leading-none">
            STATUS <span className="text-zinc-700">TITAN</span>
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Sincronismo Biométrico: 98%</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 neo-card rounded-2xl flex items-center justify-center border-purple-500/20 relative overflow-hidden group">
             <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Flame className={streak > 0 ? "text-orange-500" : "text-zinc-800"} size={28} />
          </div>
        </div>
      </section>

      {/* NOVIDADE: GLOBAL PULSE - COMMUNITY FEED */}
      <section className="bg-zinc-950/40 rounded-[2.5rem] border border-white/5 p-5 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Globe size={14} className="text-purple-500" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Global Pulse</h4>
        </div>
        <div className="space-y-4">
          {NEWS_FEED.map(news => (
            <div key={news.id} className="flex items-center justify-between animate-in fade-in slide-in-from-left-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-purple-400">
                  {news.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white uppercase italic tracking-tighter">
                    <span className="text-purple-500">{news.user}</span> {news.action}
                  </p>
                </div>
              </div>
              <span className="text-[8px] font-black text-zinc-700 uppercase">{news.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* NOVIDADE: BIO-FUEL & HYDRATION WIDGETS */}
      <div className="grid grid-cols-2 gap-4">
        {/* Hidratação */}
        <section className="neo-card p-6 rounded-[2.5rem] relative overflow-hidden group border-blue-500/10">
           <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform">
             <Droplets size={60} className="text-blue-500" />
           </div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Droplets size={20} />
                </div>
                <button onClick={() => addWater(250)} className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-blue-500 active:scale-90 transition-all border border-blue-500/20">
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Hidratação</p>
              <h3 className="text-xl font-bebas text-white italic tracking-widest">{hydration.current}ml <span className="text-[10px] text-zinc-700">/ {hydration.goal}ml</span></h3>
              <div className="mt-4 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${hydrationProgress}%` }}></div>
              </div>
           </div>
        </section>

        {/* Macros Simplificado */}
        <section className="neo-card p-6 rounded-[2.5rem] relative overflow-hidden group border-emerald-500/10">
           <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform">
             <Utensils size={60} className="text-emerald-500" />
           </div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Utensils size={20} />
                </div>
                <button className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-emerald-500 active:scale-90 transition-all border border-emerald-500/20">
                  <Activity size={14} />
                </button>
              </div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Proteínas</p>
              <h3 className="text-xl font-bebas text-white italic tracking-widest">{macros.protein.current}g <span className="text-[10px] text-zinc-700">/ {macros.protein.goal}g</span></h3>
              <div className="mt-4 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(macros.protein.current / macros.protein.goal) * 100}%` }}></div>
              </div>
           </div>
        </section>
      </div>

      {/* TITAN BIO-SCAN: ANALISE DE CORPO INTEIRO */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-2">
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Titan Diagnostic</h3>
                <h4 className="text-xl font-bebas text-white tracking-widest mt-1">SIMETRIA & FADIGA</h4>
            </div>
            <Sparkles size={18} className="text-purple-500 animate-pulse" />
        </div>

        <div className="neo-card p-6 rounded-[3.5rem] border-white/5 relative overflow-hidden bg-gradient-to-b from-zinc-900/40 to-black">
            {/* Radar Chart Visualizer */}
            <div className="h-64 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={BIO_SCAN_DATA}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: '#71717a', fontSize: 9, fontWeight: 900 }} 
                        />
                        <Radar
                            name="Titan"
                            dataKey="A"
                            stroke="#A855F7"
                            fill="#A855F7"
                            fillOpacity={0.3}
                            strokeWidth={3}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Relatório de Análise */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-[2rem] space-y-2">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <ShieldCheck size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Ponto Dominante</span>
                    </div>
                    <p className="text-lg font-bebas text-white leading-none uppercase">Braços (Dominante)</p>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-[2rem] space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-rose-500">
                            <AlertTriangle size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Elo Fraco</span>
                        </div>
                        <p className="text-lg font-bebas text-white leading-none uppercase">Pernas (Déficit)</p>
                    </div>
                    {activeProtocol && (
                        <button 
                            onClick={() => {
                              setWeakPointCategory('Pernas');
                              setShowWeaknessFix(true);
                            }}
                            className="w-full py-2 bg-rose-500 text-black font-black text-[9px] uppercase rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-rose-500/20"
                        >
                            <PlusCircle size={12} /> Corrigir Agora
                        </button>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* Protocol Dashboard */}
      {activeProtocol ? (
        <section 
          onClick={() => onNavigate('protocol')}
          className="neo-card p-8 rounded-[3.5rem] relative overflow-hidden group cursor-pointer border-white/5 hover:border-purple-500/20 transition-all active:scale-[0.98] bg-gradient-to-r from-zinc-900 to-black"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-purple-600/10 transition-all"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <div className="px-2 py-1 bg-purple-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md">TREINO ATIVO</div>
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">{activeProtocol.objective}</span>
            </div>
            <h3 className="text-4xl font-bebas text-white tracking-tight leading-none mb-6">{activeProtocol.title}</h3>
            
            <div className="flex items-center justify-between mb-2 px-1">
               <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Consistência: {activeProtocol.completedDays.length}/30</span>
               <span className="text-xs font-black text-purple-500 italic">{Math.round((activeProtocol.completedDays.length / 30) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden mb-8 border border-white/5">
              <div 
                className="h-full animate-mesh rounded-full transition-all duration-1000" 
                style={{ width: `${(activeProtocol.completedDays.length / 30) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-white font-black text-xs uppercase italic group-hover:gap-4 transition-all">
              RETOMAR PROTOCOLO <ArrowRight size={16} className="text-purple-500" />
            </div>
          </div>
        </section>
      ) : (
        <button 
          onClick={() => onNavigate('ai')}
          className="w-full bg-zinc-950/50 border-2 border-dashed border-zinc-900 p-12 rounded-[3.5rem] flex flex-col items-center gap-6 group hover:border-purple-500/20 transition-all"
        >
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-800 group-hover:text-purple-500 group-hover:scale-110 transition-all shadow-2xl">
            <Target size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bebas text-white tracking-widest">INICIAR NOVA FORJA</h3>
            <p className="text-zinc-600 text-[9px] uppercase font-bold tracking-[0.2em] mt-2 italic">Análise de IA Pendente</p>
          </div>
        </button>
      )}

      {/* Quick Metrics */}
      <section className="pb-28 grid grid-cols-2 gap-4">
        <div className="neo-card p-6 rounded-[2.5rem] border-emerald-500/10 flex flex-col gap-3">
           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
           </div>
           <div>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Carga Elevada</p>
              <p className="text-xl font-bebas text-white italic">4.2 TON</p>
           </div>
        </div>
        <div className="neo-card p-6 rounded-[2.5rem] border-blue-500/10 flex flex-col gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Clock size={20} />
           </div>
           <div>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Volume Atual</p>
              <p className="text-xl font-bebas text-white italic">120 MIN</p>
           </div>
        </div>
      </section>

      {/* Weakness Modal Overlay */}
      {showWeaknessFix && (
        <div className="fixed inset-0 z-[500] flex items-end justify-center px-4 pb-12">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-xl" onClick={() => setShowWeaknessFix(false)} />
           <div className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bebas text-white italic uppercase leading-none">Ajuste de <span className="text-rose-500">Simetria</span></h3>
                <button onClick={() => setShowWeaknessFix(false)} className="text-zinc-600"><X size={24} /></button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar py-4">
                {EXERCISES.filter(ex => ex.category === weakPointCategory).map(ex => (
                    <button 
                        key={ex.id}
                        onClick={() => handleInjectFix(ex)}
                        className="w-full p-4 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-rose-500/50 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 bg-black rounded-xl overflow-hidden border border-white/5">
                                <img src={ex.animationUrl} className="w-full h-full object-contain opacity-50" alt="" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-white uppercase italic block leading-none mb-1">{ex.name}</span>
                              <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">{ex.category}</span>
                            </div>
                        </div>
                        <PlusCircle size={18} className="text-zinc-700 group-hover:text-rose-500" />
                    </button>
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Home;
