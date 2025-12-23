
import React, { useState } from 'react';
import { Search, PlayCircle, Info, X, BarChart2, Filter, Activity, Play, Image as ImageIcon } from 'lucide-react';
import { Exercise } from '../types';
import { EXERCISES } from '../data/exercises';

const DifficultyBadge: React.FC<{ difficulty: Exercise['difficulty'] }> = ({ difficulty }) => {
  const colors = {
    'Iniciante': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    'Intermediário': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'Avançado': 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  };
  return (
    <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full border ${colors[difficulty]} tracking-widest`}>
      {difficulty}
    </span>
  );
};

const ExerciseLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [viewMode, setViewMode] = useState<'gif' | 'video'>('gif');

  const filtered = EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || 
                         ex.category.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = filterDifficulty ? ex.difficulty === filterDifficulty : true;
    return matchesSearch && matchesDifficulty;
  });

  const handleOpenExercise = (ex: Exercise) => {
    setSelectedExercise(ex);
    setViewMode('gif');
  };

  return (
    <div className="py-6 space-y-8">
      <div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Elite <span className="text-purple-500">Library</span></h2>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Técnica e Execução Perfeita</p>
      </div>
      
      <div className="space-y-5">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar movimento..." 
            className="w-full glass border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all font-medium text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['Todos', 'Iniciante', 'Intermediário', 'Avançado'].map(diff => (
            <button 
              key={diff}
              onClick={() => setFilterDifficulty(diff === 'Todos' ? null : diff)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                ${(filterDifficulty === diff || (diff === 'Todos' && !filterDifficulty)) 
                  ? 'bg-white text-black border-white' 
                  : 'bg-transparent text-zinc-500 border-zinc-800'}`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-24">
        {filtered.length > 0 ? filtered.map(ex => (
          <div 
            key={ex.id}
            onClick={() => handleOpenExercise(ex)}
            className="neo-card p-4 rounded-3xl flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:border-white/10 group"
          >
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
                    <img src={ex.animationUrl} alt="" className="w-full h-full object-contain opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <div>
                    <h4 className="font-black text-white italic tracking-tight uppercase">{ex.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{ex.category}</span>
                      <DifficultyBadge difficulty={ex.difficulty} />
                    </div>
                </div>
            </div>
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all text-zinc-600">
                <PlayCircle size={22} />
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-zinc-800">
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Nenhum exercício encontrado.</p>
          </div>
        )}
      </div>

      {/* Modern Overlay Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedExercise(null)} />
            <div className="relative w-full max-w-md bg-zinc-900 rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-500 border border-white/5">
                <button 
                    onClick={() => setSelectedExercise(null)}
                    className="absolute top-8 right-8 w-10 h-10 glass rounded-full flex items-center justify-center text-zinc-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <DifficultyBadge difficulty={selectedExercise.difficulty} />
                      <span className="text-[10px] uppercase font-black text-purple-500 tracking-widest italic">{selectedExercise.category}</span>
                    </div>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">{selectedExercise.name}</h3>
                </div>

                <div className="w-full aspect-[4/3] bg-black rounded-[2rem] overflow-hidden mb-6 flex flex-col items-center justify-center border border-white/5 group relative">
                    {viewMode === 'gif' ? (
                      <img src={selectedExercise.animationUrl} alt="Demonstração GIF" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        <PlayCircle size={48} className="text-purple-500 mb-4 animate-pulse" />
                        <p className="text-xs font-black text-white uppercase tracking-widest">Reproduzindo Aula Completa</p>
                        <p className="text-[10px] text-zinc-500 mt-2">Você será redirecionado para o vídeo de alta definição para ver todos os detalhes técnicos.</p>
                        <a 
                          href={selectedExercise.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-6 px-6 py-3 bg-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-purple-600/20"
                        >
                          Abrir Player Externo
                        </a>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                        <button 
                          onClick={() => setViewMode('gif')}
                          className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${viewMode === 'gif' ? 'bg-purple-600 text-white' : 'bg-black/60 text-zinc-400 backdrop-blur-md'}`}
                        >
                          <ImageIcon size={10} /> GIF Animado
                        </button>
                        <button 
                          onClick={() => setViewMode('video')}
                          className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${viewMode === 'video' ? 'bg-purple-600 text-white' : 'bg-black/60 text-zinc-400 backdrop-blur-md'}`}
                        >
                          <Play size={10} fill={viewMode === 'video' ? 'white' : 'none'} /> Vídeo Aula
                        </button>
                    </div>
                </div>

                <div className="space-y-6 mb-10">
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                        <h4 className="flex items-center gap-2 text-xs font-black text-white mb-4 uppercase tracking-widest italic">
                            <Activity size={16} className="text-purple-500" /> Titan Tips
                        </h4>
                        <ul className="text-xs text-zinc-400 space-y-3">
                            {selectedExercise.tips.map((tip, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-purple-500 font-black">•</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex gap-3">
                    <a 
                        href={selectedExercise.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 btn-primary text-white font-black py-5 rounded-[1.5rem] text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20"
                    >
                        Assistir Aula Completa
                    </a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
