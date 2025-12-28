
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CheckCircle2, Info, X, Weight, Hash, Save, CheckCircle, 
  TrendingUp, Target, ShieldAlert, Timer as TimerIcon, 
  ChevronRight, PlayCircle, Dumbbell, Activity, HelpCircle,
  ChevronDown, ChevronUp, Sparkles, Plus, Play, Pause, RotateCcw
} from 'lucide-react';
import { ActiveProtocol, View, DayFeedback, Exercise, ExerciseLog } from '../types';
import { EXERCISES } from '../data/exercises';
import RestTimer from './RestTimer';

interface ProtocolViewProps {
  protocol: ActiveProtocol | null;
  setProtocol: (p: ActiveProtocol | null) => void;
  onNavigate: (view: View) => void;
  onMarkDateAsCompleted?: (date: string) => void;
}

const ProtocolView: React.FC<ProtocolViewProps> = ({ protocol, setProtocol, onNavigate, onMarkDateAsCompleted }) => {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showExerciseDetail, setShowExerciseDetail] = useState<Exercise | null>(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showCategoryInfo, setShowCategoryInfo] = useState(true);
  
  // Tension Timer State
  const [activeTimerIdx, setActiveTimerIdx] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<any>(null);

  const [feedbackDifficulty, setFeedbackDifficulty] = useState(3);

  useEffect(() => {
    if (protocol && protocol.completedDays) {
      const firstIncomplete = Array.from({length: 30}).findIndex((_, i) => !protocol.completedDays.includes(i));
      setSelectedDay(firstIncomplete !== -1 ? firstIncomplete : 0);
    }
  }, [protocol?.completedDays]);

  // Handle Tension Timer
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning]);

  const toggleTensionTimer = (idx: number) => {
    if (activeTimerIdx === idx) {
      setIsTimerRunning(!isTimerRunning);
    } else {
      setActiveTimerIdx(idx);
      setTimerSeconds(0);
      setIsTimerRunning(true);
    }
  };

  const finishSet = (idx: number) => {
    setIsTimerRunning(false);
    setActiveTimerIdx(null);
    handleUpdateLog(idx, 'completed', true);
    handleUpdateLog(idx, 'duration', timerSeconds);
    setShowRestTimer(true);
  };

  if (!protocol) return null;

  const findExerciseData = (name: string): Exercise | null => {
    const normalized = name.toLowerCase().trim();
    return EXERCISES.find(ex => normalized.includes(ex.name.toLowerCase().trim())) || null;
  };

  const getDayExercises = (dayIndex: number) => {
    const dayNum = dayIndex + 1;
    const regex = new RegExp(`(?:DIA|Dia|dia)\\s*${dayNum}[\\s\\S]*?(?=(?:DIA|Dia|dia)\\s*${dayNum + 1}|$)`, 'i');
    const match = protocol.content.match(regex);
    if (!match) return [];
    
    return match[0].split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim());
  };

  const dailyExercises = useMemo(() => getDayExercises(selectedDay), [selectedDay, protocol.content]);
  const isDayCompleted = protocol.completedDays.includes(selectedDay);

  const trainingCategory = useMemo(() => {
    const dayContent = protocol.content.match(new RegExp(`(?:DIA|Dia|dia)\\s*${selectedDay + 1}[\\s\\S]*?(?=(?:DIA|Dia|dia)\\s*${selectedDay + 2}|$)`, 'i'))?.[0] || '';
    if (dayContent.toUpperCase().includes('CATEGORIA: SUPERIORES')) return 'SUPERIORES';
    if (dayContent.toUpperCase().includes('CATEGORIA: INFERIORES')) return 'INFERIORES';
    return 'FULL BODY';
  }, [selectedDay, protocol.content]);

  const categoryMetadata = {
    'SUPERIORES': {
      color: 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30',
      text: 'cyan-400',
      desc: 'Foco em tronco e braços. Trabalha peito, costas, ombros, bíceps e tríceps.',
      muscles: ['Peitoral', 'Dorsais', 'Deltoides', 'Bíceps/Tríceps'],
      icon: <Dumbbell size={20} />
    },
    'INFERIORES': {
      color: 'from-amber-500/20 to-orange-500/5 border-amber-500/30',
      text: 'amber-400',
      desc: 'Foco em membros inferiores. Trabalha coxas, glúteos e panturrilhas.',
      muscles: ['Quadríceps', 'Isquiotibiais', 'Glúteo', 'Panturrilha'],
      icon: <Activity size={20} />
    },
    'FULL BODY': {
      color: 'from-purple-500/20 to-indigo-500/5 border-purple-500/30',
      text: 'purple-400',
      desc: 'Treino completo trabalhando grandes cadeias musculares do corpo todo.',
      muscles: ['Corpo Todo', 'Core', 'Multiarticular'],
      icon: <Target size={20} />
    }
  };

  const activeMeta = categoryMetadata[trainingCategory as keyof typeof categoryMetadata] || categoryMetadata['FULL BODY'];

  const exerciseLogs = useMemo(() => {
    if (isDayCompleted) {
      const feedback = protocol.feedbacks?.find(f => f.day === selectedDay);
      if (feedback?.exerciseLogs) return feedback.exerciseLogs;
    }
    return protocol.currentDayLogs?.[selectedDay] || {};
  }, [selectedDay, protocol.currentDayLogs, protocol.feedbacks, isDayCompleted]);

  const handleUpdateLog = (idx: number, field: keyof ExerciseLog, value: any) => {
    const dayLogs = protocol.currentDayLogs?.[selectedDay] || {};
    const updatedLogs = {
      ...(protocol.currentDayLogs || {}),
      [selectedDay]: {
        ...dayLogs,
        [idx]: {
          ...(dayLogs[idx] || { weight: '', sets: '', completed: false }),
          [field]: value,
          timestamp: Date.now()
        }
      }
    };
    const updatedProtocol = { ...protocol, currentDayLogs: updatedLogs };
    setProtocol(updatedProtocol);
    localStorage.setItem('activeProtocol', JSON.stringify(updatedProtocol));
  };

  const submitFeedback = () => {
    const finalLogs: { [name: string]: ExerciseLog } = {};
    dailyExercises.forEach((exStr, idx) => {
      finalLogs[exStr.split(':')[0].trim()] = exerciseLogs[idx];
    });

    const feedback: DayFeedback = {
      day: selectedDay,
      difficulty: feedbackDifficulty,
      energy: 5,
      notes: '',
      exerciseLogs: finalLogs
    };

    const newProtocol = {
      ...protocol,
      completedDays: [...protocol.completedDays, selectedDay],
      feedbacks: [...(protocol.feedbacks || []), feedback],
      currentDayLogs: { ...(protocol.currentDayLogs || {}) }
    };
    delete newProtocol.currentDayLogs[selectedDay];
    
    setProtocol(newProtocol);
    localStorage.setItem('activeProtocol', JSON.stringify(newProtocol));
    if (onMarkDateAsCompleted) onMarkDateAsCompleted(new Date().toISOString().split('T')[0]);
    setShowFeedback(false);
  };

  return (
    <div className="py-6 space-y-6 pb-36">
      {showRestTimer && <RestTimer duration={60} onClose={() => setShowRestTimer(false)} />}

      {/* Mini-Map de Dias */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-4 -mx-5 px-5">
        {Array.from({ length: 30 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`flex-shrink-0 w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center font-bebas text-lg ${
              selectedDay === i 
                ? 'bg-purple-600 border-purple-400 text-white scale-110 shadow-lg' 
                : protocol.completedDays.includes(i)
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500'
                  : 'bg-zinc-950 border-white/5 text-zinc-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Card de Categoria */}
      <section className={`neo-card rounded-[2.5rem] overflow-hidden border transition-all bg-gradient-to-br ${activeMeta.color}`}>
        <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setShowCategoryInfo(!showCategoryInfo)}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-${activeMeta.text}`}>
              {activeMeta.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Foco de Hoje</p>
              <h3 className={`text-2xl font-bebas tracking-widest text-${activeMeta.text}`}>{trainingCategory}</h3>
            </div>
          </div>
          {showCategoryInfo ? <ChevronUp size={20} className="text-zinc-500" /> : <ChevronDown size={20} className="text-zinc-500" />}
        </div>
        {showCategoryInfo && (
          <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-300">
            <p className="text-xs text-zinc-300 italic font-medium leading-relaxed mb-4">{activeMeta.desc}</p>
            <div className="flex flex-wrap gap-2">
              {activeMeta.muscles.map(m => (
                <span key={m} className="px-3 py-1 bg-black/40 rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/5">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Lista de Exercícios */}
      <div className="space-y-4">
        {dailyExercises.map((exStr, idx) => {
          const [name] = exStr.split(':');
          const exData = findExerciseData(name);
          const log = exerciseLogs[idx] || { weight: '', sets: '', completed: false, duration: 0 };
          const isTimerActive = activeTimerIdx === idx;

          return (
            <div 
              key={idx}
              className={`neo-card p-6 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${
                log.completed ? 'border-emerald-500/30 opacity-60 bg-emerald-500/5' : isTimerActive ? 'border-purple-500/50' : 'border-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="flex-1 cursor-pointer" onClick={() => exData && setShowExerciseDetail(exData)}>
                    <h4 className="font-black text-white uppercase italic tracking-tighter text-xl group flex items-center gap-2">
                      {name} <ChevronRight size={14} className="text-zinc-800" />
                    </h4>
                    {exData && (
                      <p className="mt-1 text-[9px] font-black text-purple-400 uppercase tracking-[0.2em] flex items-center gap-1 opacity-70">
                        <Info size={10} /> Toque para Bio-Dicas
                      </p>
                    )}
                 </div>
                 
                 {!isDayCompleted && !log.completed && (
                   <button 
                    onClick={() => toggleTensionTimer(idx)}
                    className={`w-14 h-14 rounded-2xl transition-all flex flex-col items-center justify-center shadow-2xl border ${
                      isTimerActive ? 'bg-purple-600 border-purple-400 text-white animate-pulse' : 'bg-zinc-900 text-zinc-700 border-white/5'
                    }`}
                   >
                    {isTimerActive ? <Pause size={20} /> : <Play size={20} />}
                    <span className="text-[8px] font-black mt-1 uppercase">Série</span>
                   </button>
                 )}
                 {log.completed && (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex flex-col items-center justify-center text-black">
                        <CheckCircle size={20} />
                        <span className="text-[8px] font-black mt-1 uppercase">{log.duration}s</span>
                    </div>
                 )}
              </div>

              {isTimerActive && (
                <div className="bg-black/60 rounded-2xl p-4 mb-6 flex items-center justify-between border border-purple-500/20">
                   <div className="flex items-center gap-3">
                     <TimerIcon size={20} className="text-purple-400 animate-spin" />
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-500 uppercase">Tempo Sob Tensão</span>
                        <span className="text-xl font-bebas text-white tracking-widest">{timerSeconds}s</span>
                     </div>
                   </div>
                   <button 
                    onClick={() => finishSet(idx)}
                    className="px-5 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-xl active:scale-95 transition-all"
                   >
                    Finalizar
                   </button>
                </div>
              )}

              {!isDayCompleted && !log.completed && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative group">
                    <Weight size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input 
                      type="number" 
                      placeholder="CARGA" 
                      className="w-full bg-black border border-white/5 rounded-2xl py-5 pl-10 pr-4 text-xs font-black text-white focus:outline-none"
                      value={log.weight}
                      onChange={(e) => handleUpdateLog(idx, 'weight', e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input 
                      type="number" 
                      placeholder="SÉRIES" 
                      className="w-full bg-black border border-white/5 rounded-2xl py-5 pl-10 pr-4 text-xs font-black text-white focus:outline-none"
                      value={log.sets}
                      onChange={(e) => handleUpdateLog(idx, 'sets', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isDayCompleted && dailyExercises.length > 0 && (
        <button 
          onClick={() => setShowFeedback(true)}
          className="w-full btn-primary py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl active:scale-95 transition-all mt-6"
        >
          REGISTRAR SESSÃO NO BIO-LOG
        </button>
      )}

      {/* Modal de Detalhes */}
      {showExerciseDetail && (
        <div className="fixed inset-0 z-[500] flex items-end justify-center px-4 pb-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setShowExerciseDetail(null)} />
            <div className="relative w-full max-w-md bg-zinc-950 rounded-[4rem] p-8 shadow-2xl animate-in slide-in-from-bottom-20 border border-white/10 max-h-[95vh] overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-500 tracking-widest">{showExerciseDetail.category}</span>
                    <h3 className="text-3xl font-bebas tracking-widest italic text-white leading-none">{showExerciseDetail.name}</h3>
                  </div>
                  <button onClick={() => setShowExerciseDetail(null)} className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 active:scale-90"><X size={24} /></button>
                </div>
                <div className="aspect-square bg-black rounded-[3rem] overflow-hidden mb-10 border border-white/5 shadow-inner">
                  <img src={showExerciseDetail.animationUrl} className="w-full h-full object-contain" alt="Demonstração" />
                </div>
                <div className="space-y-6">
                  <div className="bg-purple-600/5 p-6 rounded-[2.5rem] border border-purple-500/10">
                    <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Target size={16} /> Ajuste Biomecânico
                    </h4>
                    <p className="text-xs text-zinc-300 italic leading-relaxed font-medium">{showExerciseDetail.tips.contraction}</p>
                  </div>
                </div>
            </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-[600] flex items-end justify-center px-4 pb-12">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowFeedback(false)} />
           <div className="relative w-full max-w-sm bg-zinc-950 border border-white/5 rounded-[4rem] p-10 shadow-2xl animate-in slide-in-from-bottom-20">
              <div className="flex flex-col items-center mb-10 text-center">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500 mb-6 shadow-2xl">
                    <Sparkles size={40} />
                 </div>
                 <h3 className="text-3xl font-bebas text-white italic uppercase tracking-tighter">Missão <span className="text-emerald-500">Titan</span> Completa</h3>
                 <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-2">Sincronizando dados nutricionais e de fadiga...</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-zinc-600 text-center block tracking-[0.3em]">Qual sua fadiga pós-treino? (1-5)</label>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button 
                        key={v} 
                        onClick={() => setFeedbackDifficulty(v)} 
                        className={`flex-1 py-5 rounded-2xl border-2 font-bebas text-xl transition-all ${feedbackDifficulty === v ? 'bg-emerald-500 border-emerald-400 text-black scale-110 shadow-lg' : 'bg-black border-white/5 text-zinc-700'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={submitFeedback} 
                  className="w-full bg-emerald-500 text-black py-6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
                >
                  CONSOLIDAR EVOLUÇÃO
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolView;
