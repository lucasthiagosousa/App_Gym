
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, Ruler, Info, Trophy, Trash2, 
  Calendar, MessageSquare, Play, ChevronRight, X, Zap,
  PlayCircle, Activity, Weight, Hash, Save, CheckCircle,
  ChevronLeft, ExternalLink, Sparkles, AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ActiveProtocol, View, DayFeedback, Exercise, ExerciseLog } from '../types';
import { EXERCISES } from '../data/exercises';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(-1);
  const [lastCompletedIdx, setLastCompletedIdx] = useState<number | null>(null);
  
  // Feedback states
  const [feedbackDifficulty, setFeedbackDifficulty] = useState(3);
  const [feedbackEnergy, setFeedbackEnergy] = useState(3);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  useEffect(() => {
    if (protocol && protocol.completedDays) {
      const firstIncomplete = Array.from({length: 30}).findIndex((_, i) => !protocol.completedDays.includes(i));
      setSelectedDay(firstIncomplete !== -1 ? firstIncomplete : 0);
    }
  }, []);

  if (!protocol) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] text-center px-8">
        <div className="w-24 h-24 bg-zinc-900 rounded-[32px] flex items-center justify-center mb-6 text-zinc-700 shadow-xl border border-zinc-800">
          <Calendar size={48} />
        </div>
        <h2 className="text-2xl font-black text-white">Nenhum Protocolo Ativo</h2>
        <p className="text-sm text-zinc-500 mt-2 mb-8 leading-relaxed">
          Para ver seu treino aqui, você precisa primeiro falar com o seu Personal AI e pedir para ele montar um plano de 30 dias.
        </p>
        <button 
          onClick={() => onNavigate('ai')}
          className="bg-purple-600 hover:bg-purple-500 text-white font-black px-8 py-4 rounded-3xl flex items-center gap-3 shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
        >
          <MessageSquare size={20} /> FALAR COM PERSONAL
        </button>
      </div>
    );
  }

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
  
  const nextDayExercises = useMemo(() => {
    if (selectedDay < 29) {
      return getDayExercises(selectedDay + 1);
    }
    return [];
  }, [selectedDay, protocol.content]);

  const isDayCompleted = protocol.completedDays.includes(selectedDay);

  // Recupera os logs salvos para o dia selecionado
  const exerciseLogs = useMemo(() => {
    // Se o dia já foi concluído, busca no histórico de feedbacks
    if (isDayCompleted) {
      const feedback = protocol.feedbacks?.find(f => f.day === selectedDay);
      if (feedback?.exerciseLogs) {
        const logs: { [idx: number]: ExerciseLog } = {};
        dailyExercises.forEach((exStr, idx) => {
          const name = exStr.split(':')[0].trim();
          if (feedback.exerciseLogs?.[name]) {
            logs[idx] = feedback.exerciseLogs[name];
          }
        });
        return logs;
      }
    }
    // Caso contrário, busca nos logs temporários do dia atual
    return protocol.currentDayLogs?.[selectedDay] || {};
  }, [selectedDay, protocol.currentDayLogs, protocol.feedbacks, isDayCompleted, dailyExercises]);

  const allExercisesDone = dailyExercises.length > 0 && 
    dailyExercises.every((_, idx) => exerciseLogs[idx]?.completed);

  // Navigation Logic for Modal
  const currentModalIndex = useMemo(() => {
    if (!showExerciseDetail) return -1;
    return dailyExercises.findIndex(exStr => {
      const name = exStr.split(':')[0].trim();
      return name.toLowerCase() === showExerciseDetail.name.toLowerCase();
    });
  }, [showExerciseDetail, dailyExercises]);

  const navigateModal = (direction: 'next' | 'prev') => {
    const newIdx = direction === 'next' ? currentModalIndex + 1 : currentModalIndex - 1;
    if (newIdx >= 0 && newIdx < dailyExercises.length) {
      const name = dailyExercises[newIdx].split(':')[0].trim();
      const exData = findExerciseData(name);
      if (exData) setShowExerciseDetail(exData);
    }
  };

  const handleUpdateLog = (idx: number, field: keyof ExerciseLog, value: any) => {
    const dayLogs = protocol.currentDayLogs?.[selectedDay] || {};
    const updatedLogs = {
      ...(protocol.currentDayLogs || {}),
      [selectedDay]: {
        ...dayLogs,
        [idx]: {
          ...(dayLogs[idx] || { weight: '', sets: '', completed: false }),
          [field]: value
        }
      }
    };
    
    setProtocol({ 
      ...protocol, 
      currentDayLogs: updatedLogs 
    });
  };

  const toggleExerciseDone = (idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const log = exerciseLogs[idx];
    if (!log?.weight || !log?.sets) {
      alert("⚠️ Informe o peso e as séries para registrar seu progresso!");
      return;
    }
    
    const isNowCompleted = !log.completed;
    handleUpdateLog(idx, 'completed', isNowCompleted);
    
    if (isNowCompleted) {
      setLastCompletedIdx(idx);
      // Remove o brilho/animação após 1.5s
      setTimeout(() => setLastCompletedIdx(null), 1500);

      const nextIdx = idx + 1;
      if (nextIdx < dailyExercises.length) {
        setCurrentExerciseIndex(nextIdx);
      } else {
        setCurrentExerciseIndex(-1);
      }
    }
  };

  const handleCompleteDay = () => {
    if (isDayCompleted) return;
    if (!allExercisesDone) {
      alert("⚠️ Você ainda tem exercícios pendentes! Marque todos como concluídos antes de finalizar.");
      return;
    }
    setShowFeedback(true);
  };

  const submitFeedback = () => {
    const finalLogs: { [name: string]: ExerciseLog } = {};
    dailyExercises.forEach((exStr, idx) => {
      const name = exStr.split(':')[0].trim();
      finalLogs[name] = exerciseLogs[idx];
    });

    const feedback: DayFeedback = {
      day: selectedDay,
      difficulty: feedbackDifficulty,
      energy: feedbackEnergy,
      notes: feedbackNotes,
      exerciseLogs: finalLogs
    };

    const newCompleted = [...protocol.completedDays, selectedDay];
    const newFeedbacks = [...(protocol.feedbacks || []), feedback];
    
    const newCurrentLogs = { ...(protocol.currentDayLogs || {}) };
    delete newCurrentLogs[selectedDay];

    setProtocol({ 
      ...protocol, 
      completedDays: newCompleted,
      feedbacks: newFeedbacks,
      currentDayLogs: newCurrentLogs
    });

    // Registra no histórico global de sequencia (streak)
    if (onMarkDateAsCompleted) {
      onMarkDateAsCompleted(new Date().toISOString().split('T')[0]);
    }
    
    setShowFeedback(false);
    setFeedbackNotes('');
    setCurrentExerciseIndex(-1);
  };

  const progress = Math.round((protocol.completedDays.length / 30) * 100);

  return (
    <div className="py-6 space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase font-black text-purple-400 tracking-widest">{protocol.objective}</span>
          <h2 className="text-2xl font-black text-white">{protocol.title}</h2>
        </div>
        <button 
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 text-zinc-600 hover:text-rose-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-zinc-900 border border-white/5 p-6 rounded-[40px] shadow-lg flex items-center gap-6">
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={213.6} strokeDashoffset={213.6 - (213.6 * progress) / 100} className="text-purple-500 transition-all duration-1000" />
            </svg>
            <span className="absolute text-xl font-black">{progress}%</span>
        </div>
        <div className="flex-1">
            <p className="text-[10px] uppercase font-bold text-zinc-500">Progresso do Ciclo</p>
            <p className="text-lg font-bold text-white">{protocol.completedDays.length} / 30 Dias</p>
        </div>
      </div>

      {/* Days Calendar */}
      <section>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {Array.from({ length: 30 }).map((_, i) => {
            const isCompleted = protocol.completedDays.includes(i);
            const isSelected = selectedDay === i;
            return (
              <button 
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`min-w-[54px] h-[64px] rounded-2xl flex flex-col items-center justify-center transition-all shrink-0 border-2 ${
                  isSelected 
                    ? 'bg-purple-500/10 border-purple-500 text-purple-400 scale-105 z-10 shadow-lg shadow-purple-500/20' 
                    : isCompleted
                      ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">Dia</span>
                <span className="text-lg font-black">{i + 1}</span>
                {isCompleted && <CheckCircle2 size={10} className="mt-0.5" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Workout List */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
          {isDayCompleted ? 'Treino' : 'Treino Atual'} <span className="text-purple-400">#Dia{selectedDay + 1}</span>
        </h3>

        {dailyExercises.length > 0 ? (
            <div key={selectedDay} className="space-y-4 animate-slide-up">
                {dailyExercises.map((exStr, idx) => {
                    const [name, rest] = exStr.split(':');
                    const exData = findExerciseData(name);
                    const isCurrent = currentExerciseIndex === idx;
                    const log = exerciseLogs[idx] || { weight: '', sets: '', completed: false };
                    const isRecentlyCompleted = lastCompletedIdx === idx;

                    return (
                        <div 
                            key={idx}
                            onClick={() => !isDayCompleted && !log.completed && setCurrentExerciseIndex(idx)}
                            className={`bg-zinc-900 border-2 rounded-3xl p-5 transition-all relative overflow-hidden flex flex-col cursor-pointer ${
                                log.completed 
                                  ? 'border-emerald-500/30 opacity-60' 
                                  : isCurrent 
                                    ? 'border-purple-500 shadow-xl scale-[1.02] animate-exercise-active' 
                                    : 'border-zinc-800 hover:border-zinc-700'
                            } ${isRecentlyCompleted ? 'animate-success-glow border-emerald-500/60' : ''}`}
                        >
                            {/* Overlay de Animação de Check Centralizado */}
                            {isRecentlyCompleted && (
                              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                                <CheckCircle size={80} className="text-emerald-500 animate-check-pop drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                              </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 h-4">
                                        {log.completed && (
                                            <span className={`flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded-full ${isRecentlyCompleted ? 'animate-bounce' : ''}`}>
                                                <CheckCircle size={10} /> Concluído
                                            </span>
                                        )}
                                        {isCurrent && !log.completed && (
                                          <span className="flex items-center gap-1 text-[8px] font-black text-purple-400 uppercase tracking-widest bg-purple-400/20 px-2 py-0.5 rounded-full animate-pulse">
                                            Foco Agora
                                          </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-black text-white uppercase tracking-tight">
                                          {name}
                                      </h4>
                                      {exData && (
                                          <button 
                                              onClick={(e) => { e.stopPropagation(); setShowExerciseDetail(exData); }}
                                              className="p-1 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                                          >
                                              <PlayCircle size={18} />
                                          </button>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{rest || 'Foco em execução'}</p>
                                </div>

                                {!isDayCompleted && (
                                  <button 
                                      onClick={(e) => toggleExerciseDone(idx, e)}
                                      className={`p-3 rounded-2xl transition-all ${
                                          log.completed 
                                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' 
                                              : (log.weight && log.sets)
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : 'bg-zinc-800 text-zinc-500 hover:text-purple-400'
                                      } ${isRecentlyCompleted ? 'animate-bounce' : ''}`}
                                  >
                                      {log.completed ? (
                                        <div className={isRecentlyCompleted ? 'scale-125 transition-transform duration-300' : ''}>
                                          <CheckCircle2 size={24} />
                                        </div>
                                      ) : (
                                        <Save size={24} />
                                      )}
                                  </button>
                                )}
                            </div>

                            {!isDayCompleted && (
                              <div className={`grid grid-cols-2 gap-3 transition-all duration-300 ${isCurrent ? 'opacity-100 translate-y-0' : 'opacity-60 grayscale'}`}>
                                <div className="relative">
                                  <Weight size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                  <input 
                                    type="number"
                                    placeholder="Carga (kg)"
                                    disabled={log.completed}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all disabled:opacity-50"
                                    value={log.weight}
                                    onChange={(e) => handleUpdateLog(idx, 'weight', e.target.value)}
                                  />
                                </div>
                                <div className="relative">
                                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                  <input 
                                    type="number"
                                    placeholder="Séries"
                                    disabled={log.completed}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all disabled:opacity-50"
                                    value={log.sets}
                                    onChange={(e) => handleUpdateLog(idx, 'sets', e.target.value)}
                                  />
                                </div>
                              </div>
                            )}

                            {(isDayCompleted || log.completed) && log.weight && (
                                <div className="flex gap-4 text-[10px] font-black uppercase text-zinc-400 mt-2 tracking-widest">
                                    <span className="flex items-center gap-1"><Weight size={12}/> {log.weight}kg</span>
                                    <span className="flex items-center gap-1"><Hash size={12}/> {log.sets} séries</span>
                                </div>
                            )}
                        </div>
                    );
                })}

                {!isDayCompleted && (
                    <button 
                        onClick={handleCompleteDay}
                        className={`w-full font-black py-5 rounded-3xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 ${
                          allExercisesDone 
                            ? 'btn-primary text-white shadow-purple-500/30' 
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                    >
                        <Trophy size={20} /> 
                        {allExercisesDone ? 'FINALIZAR TREINO DO DIA' : 'CONCLUIR TREINO'}
                    </button>
                )}
            </div>
        ) : (
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-center">
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Dia de Descanso ou Cardio Livre</p>
            </div>
        )}
      </section>

      {/* Próximo Treino Preview Section */}
      {isDayCompleted && nextDayExercises.length > 0 && (
        <section className="mt-12 space-y-4 animate-slide-up">
           <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
              <h3 className="text-sm font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2 italic">
                Amanhã <ArrowRight size={14} /> <span className="text-white">Dia {selectedDay + 2}</span>
              </h3>
           </div>
           
           <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[40px] rounded-full"></div>
              
              <div className="space-y-4 relative z-10">
                {nextDayExercises.slice(0, 4).map((exStr, idx) => {
                  const name = exStr.split(':')[0].trim();
                  const exData = findExerciseData(name);
                  return (
                    <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-tight">{name}</p>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{exData?.category || 'Hipertrofia'}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-zinc-700" />
                    </div>
                  );
                })}
                {nextDayExercises.length > 4 && (
                  <p className="text-[9px] text-zinc-500 font-bold text-center uppercase tracking-widest pt-2">
                    + {nextDayExercises.length - 4} exercícios planejados
                  </p>
                )}
              </div>

              <button 
                onClick={() => {
                  setSelectedDay(selectedDay + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full mt-6 py-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-400 transition-all active:scale-95"
              >
                Ver Treino Completo de Amanhã
              </button>
           </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-rose-500/20 rounded-[40px] p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">Apagar Protocolo?</h3>
              <p className="text-xs text-zinc-500 font-medium mt-4 leading-relaxed">
                Isso excluirá permanentemente seu plano de 30 dias e todo o progresso registrado. Esta ação não pode ser desfeita.
              </p>
              
              <div className="grid grid-cols-1 gap-3 w-full mt-8">
                <button 
                  onClick={() => { setProtocol(null); setShowDeleteConfirm(false); }}
                  className="w-full bg-rose-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
                >
                  SIM, APAGAR DEFINITIVAMENTE
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full bg-zinc-800 text-zinc-400 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:text-white transition-all active:scale-95"
                >
                  MANTER MEU PLANO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Submission Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center px-4 pb-10">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowFeedback(false)} />
          <div className="relative w-full max-md bg-zinc-900 border border-white/5 rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <h3 className="text-2xl font-black mb-1 text-center italic uppercase tracking-tighter">Treino <span className="text-purple-400">Vencido!</span></h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center mb-8">Relatório de Performance</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 mb-3 block">Percepção de Esforço</label>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setFeedbackDifficulty(v)} className={`flex-1 py-4 rounded-2xl font-black border transition-all ${feedbackDifficulty === v ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 mb-3 block">Nível de Energia</label>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setFeedbackEnergy(v)} className={`flex-1 py-4 rounded-2xl font-black border transition-all ${feedbackEnergy === v ? 'bg-amber-500 border-amber-400 text-white shadow-lg' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{v}</button>
                  ))}
                </div>
              </div>

              <button 
                onClick={submitFeedback}
                className="w-full btn-primary text-white font-black py-5 rounded-3xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest"
              >
                REGISTRAR NA FORJA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal with Navigation */}
      {showExerciseDetail && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowExerciseDetail(null)} />
            <div className="relative w-full max-w-sm bg-zinc-900 border border-white/5 rounded-[40px] p-6 shadow-2xl animate-in zoom-in duration-300">
                <button 
                    onClick={() => setShowExerciseDetail(null)} 
                    className="absolute top-6 right-6 p-2 bg-zinc-800 rounded-full text-zinc-400 z-10 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">{showExerciseDetail.name}</h3>
                  <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mt-1 italic">{showExerciseDetail.category}</p>
                </div>

                <div className="aspect-video bg-black rounded-3xl overflow-hidden mb-6 border border-white/5 relative group">
                    <img src={showExerciseDetail.animationUrl} alt="Execução Animada" className="w-full h-full object-contain" />
                    <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-purple-600/80 backdrop-blur-sm text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                          <Play size={8} fill="white" /> Vídeo Animado Ativo
                        </span>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-purple-400 mb-2 uppercase tracking-widest italic">
                            <Sparkles size={14} /> Dicas Marombas
                        </h4>
                        <ul className="text-[11px] text-zinc-300 space-y-2 font-medium">
                            {showExerciseDetail.tips.map((tip, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-purple-500 font-black">•</span> {tip}
                              </li>
                            ))}
                        </ul>
                    </div>

                    <a 
                      href={showExerciseDetail.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-500/20 transition-all"
                    >
                      <ExternalLink size={14} /> Assistir Vídeo Aula Completa
                    </a>
                </div>

                {/* Modal Navigation Buttons */}
                <div className="flex gap-4">
                  <button 
                    disabled={currentModalIndex <= 0}
                    onClick={() => navigateModal('prev')}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-800 rounded-2xl text-zinc-400 font-black text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all hover:bg-zinc-700 active:scale-95"
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <button 
                    disabled={currentModalIndex >= dailyExercises.length - 1}
                    onClick={() => navigateModal('next')}
                    className="flex-1 flex items-center justify-center gap-2 py-4 btn-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-purple-500/20"
                  >
                    Próximo <ChevronRight size={16} />
                  </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolView;
