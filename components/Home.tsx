
import React, { useMemo } from 'react';
import { Calendar, CheckCircle2, Flame, Trophy, ChevronRight, Dumbbell, Zap, ArrowRight, Star, Activity, Utensils, Newspaper, Sparkles, Brain, TrendingDown, Clock } from 'lucide-react';
import { View, ActiveProtocol } from '../types';

interface HomeProps {
  completedDays: string[];
  toggleDay: (date: string) => void;
  onNavigate: (view: View) => void;
  activeProtocol?: ActiveProtocol | null;
}

const INSIGHTS = [
  {
    id: 1,
    tag: 'Nutrição',
    category: 'nutrition',
    title: 'Creatina: O Mito do Horário',
    desc: 'Estudos recentes confirmam: a consistência diária é mais importante que o horário. O efeito é por saturação, não imediato.',
    icon: <Utensils className="text-emerald-400" size={18} />,
    time: 'Agora mesmo',
    isNew: true
  },
  {
    id: 2,
    tag: 'Mercado',
    category: 'market',
    title: 'Queda no Preço do Whey',
    desc: 'O preço da matéria-prima (WPC) caiu 8% este mês. Fique atento ao Market Elite para promoções da Growth e Max.',
    icon: <TrendingDown className="text-blue-400" size={18} />,
    time: '45 min atrás',
    isNew: true
  },
  {
    id: 3,
    tag: 'Ciência',
    category: 'science',
    title: 'Sono e Hipertrofia',
    desc: 'Dormir menos de 6h reduz a síntese proteica em até 18%. O descanso é onde o músculo realmente cresce.',
    icon: <Brain className="text-amber-400" size={18} />,
    time: '2h atrás'
  },
  {
    id: 4,
    tag: 'Técnica',
    category: 'technique',
    title: 'Tempo sob Tensão (TUT)',
    desc: 'Priorize 3 segundos na fase de descida (excêntrica) para recrutar mais fibras musculares em exercícios de isolamento.',
    icon: <Activity className="text-purple-400" size={18} />,
    time: '5h atrás'
  },
  {
    id: 5,
    tag: 'Gymwear',
    category: 'clothing',
    title: 'Tecnologia Anti-Odor',
    desc: 'Novas regatas com íons de prata estão em alta. Elas impedem a proliferação de bactérias mesmo em treinos intensos.',
    icon: <Sparkles className="text-cyan-400" size={18} />,
    time: 'Ontem'
  }
];

const Home: React.FC<HomeProps> = ({ completedDays, toggleDay, onNavigate, activeProtocol }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const daysOfWeek = [];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    daysOfWeek.push(d.toISOString().split('T')[0]);
  }

  const currentStreak = useMemo(() => {
    if (completedDays.length === 0) return 0;
    const sortedDates = [...new Set(completedDays)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    let checkDate = new Date();
    if (!completedDays.includes(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    const checkStr = () => checkDate.toISOString().split('T')[0];
    while (completedDays.includes(checkStr())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  }, [completedDays, todayStr]);

  const getTagStyle = (category: string) => {
    switch(category) {
      case 'nutrition': return 'text-emerald-400 bg-emerald-400/10';
      case 'market': return 'text-blue-400 bg-blue-400/10';
      case 'science': return 'text-amber-400 bg-amber-400/10';
      case 'technique': return 'text-purple-400 bg-purple-400/10';
      case 'clothing': return 'text-cyan-400 bg-cyan-400/10';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  return (
    <div className="py-6 space-y-10">
      {/* Hero Welcome */}
      <section className="relative">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-black tracking-tight leading-none uppercase italic">
                    Forja <br/><span className="text-zinc-500">Titan.</span>
                </h2>
                <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_#A855F7]"></span>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Sessão: {activeProtocol?.objective || 'Aguardando Objetivo'}</p>
                </div>
            </div>
            <div className="p-3 glass rounded-2xl flex flex-col items-center min-w-[56px] transition-all hover:scale-105 active:scale-95 border-white/10">
                <Flame className={currentStreak > 0 ? "text-orange-500 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" : "text-zinc-700"} size={20} />
                <span className="text-lg font-black mt-1 leading-none">{currentStreak}</span>
            </div>
        </div>
      </section>

      {/* Active Protocol Premium Card */}
      {activeProtocol ? (
        <section 
          onClick={() => onNavigate('protocol')}
          className="neo-card p-6 rounded-[2.5rem] relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all border-white/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[60px] rounded-full -mr-10 -mt-10"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div className="bg-purple-500/10 text-purple-400 text-[10px] font-black px-3 py-1 rounded-full border border-purple-500/20 tracking-widest uppercase">
                    Protocolo em Curso
                </div>
                <div className="text-zinc-500 group-hover:text-white transition-colors">
                    <Zap size={18} />
                </div>
            </div>
            
            <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter italic">
              {activeProtocol.title}
            </h3>
            
            <div className="mt-8">
              <div className="flex justify-between text-[11px] text-zinc-500 font-black mb-2 uppercase tracking-widest">
                <span>Evolução do Ciclo</span>
                <span className="text-white">{Math.round((activeProtocol.completedDays.length / 30) * 100)}%</span>
              </div>
              <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full animate-mesh rounded-full transition-all duration-1000" 
                  style={{ width: `${(activeProtocol.completedDays.length / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-zinc-900/50 border border-dashed border-zinc-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
            <Dumbbell className="text-zinc-700 mb-4" size={40} />
            <h3 className="font-black text-lg uppercase tracking-tighter">Nenhum protocolo ativo</h3>
            <p className="text-zinc-500 text-xs mt-1 font-medium">Sincronize sua mente com o Personal AI.</p>
            <button 
                onClick={() => onNavigate('ai')}
                className="mt-6 btn-primary px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-purple-500/20 active:scale-95"
            >
                Iniciar Construção
            </button>
        </section>
      )}

      {/* Weekly Checklist */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Disciplina Semanal</h3>
            <div className="flex items-center gap-1">
               <span className="text-[9px] font-black text-white uppercase">{completedDays.length} / 7</span>
               <Star size={14} className="text-yellow-500" />
            </div>
        </div>
        <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
          {daysOfWeek.map((date) => {
            const d = new Date(date);
            const isCompleted = completedDays.includes(date);
            const isToday = date === todayStr;
            return (
              <button 
                key={date}
                onClick={() => toggleDay(date)}
                className={`flex-1 min-w-[50px] aspect-[4/5] rounded-2xl flex flex-col items-center justify-center border-2 transition-all active:scale-90
                  ${isCompleted 
                    ? 'bg-purple-600 border-purple-500 shadow-lg shadow-purple-500/20 text-white' 
                    : isToday 
                        ? 'bg-zinc-900 border-white/20 text-white scale-105 shadow-xl' 
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'}`}
              >
                <span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0)}</span>
                <span className="text-sm font-black italic">{d.getDate()}</span>
                {isCompleted && <CheckCircle2 size={12} className="mt-1" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Insights Titan - Feed de Novidades e Dicas */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-1">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Insights <span className="text-purple-500">Titan</span></h3>
            <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Recentes</button>
        </div>
        
        {/* Urgent/High Priority Insight */}
        <div 
          onClick={() => onNavigate('deals')}
          className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-[2.5rem] flex items-center gap-4 animate-pulse cursor-pointer hover:bg-emerald-500/10 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <TrendingDown size={20} />
          </div>
          <div className="flex-1">
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Oportunidade de Mercado</span>
            <h4 className="text-xs font-black text-white uppercase leading-tight">Whey Protein com 20% OFF detectado!</h4>
          </div>
          <ChevronRight size={16} className="text-emerald-500" />
        </div>

        <div className="space-y-4">
            {INSIGHTS.map((insight) => (
              <div 
                key={insight.id} 
                className="neo-card p-6 rounded-[2.5rem] flex items-start gap-5 group hover:border-purple-500/40 transition-all cursor-pointer border-white/5 active:scale-[0.98]"
              >
                <div className="w-14 h-14 glass rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 border-white/10 shadow-lg">
                    {insight.icon}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/5 ${getTagStyle(insight.category)}`}>
                        {insight.tag}
                      </span>
                      <div className="flex items-center gap-1.5 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                        <Clock size={10} /> {insight.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white tracking-tight uppercase group-hover:text-purple-400 transition-colors italic">{insight.title}</h4>
                      {insight.isNew && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></span>}
                    </div>
                    <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed group-hover:text-zinc-300 transition-colors">{insight.desc}</p>
                </div>
                <div className="self-center">
                  <ChevronRight size={18} className="text-zinc-800 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
        </div>

        <button 
          onClick={() => onNavigate('ai')}
          className="w-full py-5 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-purple-400 hover:border-purple-500/20 transition-all"
        >
          Carregar Mais Inteligência
        </button>
      </section>

      {/* Quick Action Banner */}
      {!activeProtocol && (
        <section className="relative h-56 rounded-[3rem] overflow-hidden group active:scale-95 transition-all cursor-pointer shadow-2xl" onClick={() => onNavigate('ai')}>
           <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
           <div className="absolute inset-x-8 bottom-8 flex flex-col items-start">
               <div className="bg-purple-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3">Sugerido para você</div>
               <h4 className="text-3xl font-black italic text-white uppercase leading-none tracking-tighter">Foco em <br/> Bíceps Elite</h4>
               <p className="text-[10px] text-zinc-400 font-bold mt-3 uppercase tracking-widest flex items-center gap-2">
                 Protocolo 30 Dias <ArrowRight size={12} /> Começar Agora
               </p>
           </div>
        </section>
      )}
    </div>
  );
};

export default Home;
