
import React, { useState } from 'react';
import { Search, PlayCircle, Info, X, BarChart2, Filter, Activity, Play, Image as ImageIcon, ChevronDown, ChevronUp, Sparkles, Star, AlertTriangle, CheckCircle2, Target, Wind, Maximize2, ShieldAlert, Zap, BookOpen, ExternalLink } from 'lucide-react';
import { Exercise } from '../types';
import { EXERCISES } from '../data/exercises';

const DifficultyStars: React.FC<{ difficulty: Exercise['difficulty'] }> = ({ difficulty }) => {
  const count = difficulty === 'Iniciante' ? 1 : difficulty === 'Intermediário' ? 2 : 3;
  const colorClass = difficulty === 'Iniciante' ? 'text-cyan-400' : difficulty === 'Intermediário' ? 'text-purple-400' : 'text-rose-400';
  
  return (
    <div className="flex gap-0.5">
      {[...Array(3)].map((_, i) => (
        <Star 
          key={i} 
          size={8} 
          className={`${i < count ? colorClass + ' fill-current' : 'text-zinc-800'}`} 
        />
      ))}
    </div>
  );
};

const DifficultyBadge: React.FC<{ difficulty: Exercise['difficulty'] }> = ({ difficulty }) => {
  const colors = {
    'Iniciante': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    'Intermediário': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'Avançado': 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  };
  return (
    <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full border ${colors[difficulty]} tracking-widest flex items-center gap-1`}>
      {difficulty}
    </span>
  );
};

const ExerciseLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [viewMode, setViewMode] = useState<'gif' | 'video'>('gif');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filtered = EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || 
                         ex.category.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = filterDifficulty ? ex.difficulty === filterDifficulty : true;
    return matchesSearch && matchesDifficulty;
  });

  const handleOpenExercise = (ex: Exercise) => {
    setSelectedExercise(ex);
    setViewMode('gif');
    setShowAdvanced(false);
  };

  return (
    <div className="py-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Elite <span className="text-purple-500">Library</span></h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">Manual de Performance Titan</p>
        </div>
        <BookOpen size={24} className="text-zinc-800 mb-2" />
      </div>
      
      <div className="space-y-5">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar movimento ou músculo..." 
            className="w-full glass border-white/5 rounded-2xl py-5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-bold text-sm placeholder:text-zinc-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['Todos', 'Iniciante', 'Intermediário', 'Avançado'].map(diff => (
            <button 
              key={diff}
              onClick={() => setFilterDifficulty(diff === 'Todos' ? null : diff)}
              className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                ${(filterDifficulty === diff || (diff === 'Todos' && !filterDifficulty)) 
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20' 
                  : 'bg-transparent text-zinc-600 border-zinc-900 hover:border-zinc-700'}`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-32">
        {filtered.length > 0 ? filtered.map(ex => (
          <div 
            key={ex.id}
            onClick={() => handleOpenExercise(ex)}
            className="neo-card p-5 rounded-[2.5rem] flex items-center justify-between transition-all duration-500 ease-out cursor-pointer border-white/5 hover:border-purple-500/30 hover:scale-[1.02] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-[0.98] group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full -mr-12 -mt-12 transition-all duration-700 group-hover:bg-purple-500/10 group-hover:scale-150"></div>
            <div className="flex items-center gap-5 relative z-10">
                <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center overflow-hidden border border-white/5 shadow-inner transition-transform duration-500 group-hover:border-purple-500/20">
                    <img src={ex.animationUrl} alt="" className="w-full h-full object-contain opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                </div>
                <div>
                    <h4 className="font-black text-white italic tracking-tight uppercase text-lg leading-none mb-2 transition-colors duration-500 group-hover:text-purple-400">{ex.name}</h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <DifficultyBadge difficulty={ex.difficulty} />
                        <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{ex.category}</span>
                      </div>
                      <DifficultyStars difficulty={ex.difficulty} />
                    </div>
                </div>
            </div>
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 text-zinc-700 shadow-lg border border-white/5 relative z-10">
                <Play size={18} fill="currentColor" className="ml-1" />
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-zinc-900/10 rounded-[3rem] border border-dashed border-zinc-800">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Nenhum movimento mapeado.</p>
          </div>
        )}
      </div>

      {/* Modern Overlay Modal - DETALHAMENTO DE DICAS */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={() => setSelectedExercise(null)} />
            <div className="relative w-full max-w-md bg-zinc-950 rounded-[4rem] p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-500 border border-white/10 max-h-[95vh] overflow-y-auto no-scrollbar">
                
                {/* Close & Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <DifficultyBadge difficulty={selectedExercise.difficulty} />
                      <span className="text-[10px] uppercase font-black text-purple-500 tracking-[0.2em] italic">{selectedExercise.category}</span>
                    </div>
                    <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">{selectedExercise.name}</h3>
                  </div>
                  <button 
                      onClick={() => setSelectedExercise(null)}
                      className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white active:scale-90 transition-all border border-white/5"
                  >
                      <X size={24} />
                  </button>
                </div>

                {/* Main Media Visualizer */}
                <div className="w-full aspect-square bg-black rounded-[3rem] overflow-hidden mb-10 border border-white/10 relative group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none"></div>
                    {viewMode === 'gif' ? (
                      <img src={selectedExercise.animationUrl} alt="Demonstração" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-zinc-900/60">
                        <PlayCircle size={80} className="text-purple-500 mb-6 animate-pulse" />
                        <p className="text-lg font-black text-white uppercase tracking-tighter mb-2">Masterclass Técnica</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-8">Vídeo Aula em Alta Definição</p>
                        <a 
                          href={selectedExercise.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-10 py-5 bg-white text-black rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center gap-2"
                        >
                          <ExternalLink size={14} /> Abrir Player
                        </a>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
                        <button 
                          onClick={() => setViewMode('gif')}
                          className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${viewMode === 'gif' ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/40' : 'bg-black/90 text-zinc-500'}`}
                        >
                          <ImageIcon size={14} /> GIF LOOP
                        </button>
                        <button 
                          onClick={() => setViewMode('video')}
                          className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${viewMode === 'video' ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/40' : 'bg-black/90 text-zinc-500'}`}
                        >
                          <Play size={14} fill={viewMode === 'video' ? 'white' : 'none'} /> VÍDEO AULA
                        </button>
                    </div>
                </div>

                {/* PLAYBOOK DE DICAS ESTRUTURADAS */}
                <div className="space-y-8">
                    
                    {/* Bio-Mechanics Insight (DESTAQUE) */}
                    {selectedExercise.biomechanics && (
                      <div className="bg-cyan-500/10 border border-cyan-500/20 p-8 rounded-[3rem] relative overflow-hidden animate-in fade-in zoom-in duration-700">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                          <Zap size={100} className="text-cyan-400" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center text-white">
                              <Sparkles size={16} />
                           </div>
                           <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest italic">Ajuste de Especialista</h4>
                        </div>
                        <p className="text-[13px] text-zinc-200 font-bold leading-relaxed italic pl-2 border-l-2 border-cyan-500/30">
                           "{selectedExercise.biomechanics}"
                        </p>
                      </div>
                    )}

                    {/* Dicas de Execução em Cards Coloridos */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-zinc-900/40 p-6 rounded-[2.5rem] border border-white/5 flex gap-5 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 shrink-0">
                                <Target size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Postura & Base</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">{selectedExercise.tips.posture}</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/40 p-6 rounded-[2.5rem] border border-white/5 flex gap-5 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 shrink-0">
                                <Activity size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Pico de Contração</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">{selectedExercise.tips.contraction}</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/40 p-6 rounded-[2.5rem] border border-white/5 flex gap-5 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 flex items-center justify-center text-cyan-400 shrink-0">
                                <Wind size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Rhythm & Breathing</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">{selectedExercise.tips.breathing}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alerta de Erros Críticos (Sinalização Forte) */}
                    <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[3rem] space-y-5 shadow-2xl">
                        <div className="flex items-center gap-3 text-rose-500">
                            <ShieldAlert size={22} />
                            <h4 className="text-sm font-black uppercase tracking-widest italic leading-none">Safe Guard: Erros Comuns</h4>
                        </div>
                        <div className="space-y-4">
                            {selectedExercise.commonErrors.map((error, i) => (
                                <div key={i} className="flex gap-4 items-start bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-[10px] font-black shrink-0">✕</span>
                                    <p className="text-[11px] text-zinc-300 font-bold italic leading-tight">{error}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Dropdown (Expandable) */}
                    {selectedExercise.advancedTips && (
                        <div className="space-y-4">
                            <button 
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full flex items-center justify-between p-8 bg-white/5 rounded-[3rem] border border-white/10 hover:border-purple-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                  <Sparkles size={20} className="text-purple-500" />
                                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Coach's Secrets</span>
                                </div>
                                {showAdvanced ? <ChevronUp size={24} className="text-purple-500" /> : <ChevronDown size={24} className="text-zinc-600 group-hover:text-purple-400" />}
                            </button>
                            {showAdvanced && (
                                <div className="p-8 bg-purple-500/5 rounded-[3rem] border border-purple-500/10 animate-slide-up space-y-6">
                                    {selectedExercise.advancedTips.map((tip, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5 shadow-lg shadow-purple-600/20">{i+1}</div>
                                            <p className="text-xs text-zinc-300 italic font-bold leading-relaxed">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Action */}
                <div className="mt-12 pb-6">
                    <button 
                        onClick={() => setSelectedExercise(null)}
                        className="w-full py-6 bg-white text-black rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all hover:bg-purple-50"
                    >
                        Entendido, Coach!
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
