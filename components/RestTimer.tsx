
import React, { useState, useEffect } from 'react';
import { Timer, X, Play, Pause, RotateCcw, BellRing } from 'lucide-react';

interface RestTimerProps {
  duration: number; // segundos
  onClose: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ duration, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      // Aqui poderia ter um feedback sonoro
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="fixed bottom-28 right-6 z-[200] animate-in zoom-in duration-300">
      <div className="relative w-24 h-24 glass rounded-full flex items-center justify-center shadow-2xl border-purple-500/30">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle 
            cx="48" cy="48" r="42" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="transparent" 
            className="text-white/5" 
          />
          <circle 
            cx="48" cy="48" r="42" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="transparent" 
            strokeDasharray={263.8} 
            strokeDashoffset={263.8 - (263.8 * percentage) / 100} 
            className={`${timeLeft === 0 ? 'text-emerald-500 animate-pulse' : 'text-purple-500'} transition-all duration-1000`} 
          />
        </svg>

        <div className="relative flex flex-col items-center">
          {timeLeft > 0 ? (
            <>
              <span className="text-xl font-black text-white italic leading-none">{timeLeft}</span>
              <span className="text-[8px] font-black uppercase text-zinc-500 tracking-tighter">Descanso</span>
            </>
          ) : (
            <BellRing size={24} className="text-emerald-500 animate-bounce" />
          )}
        </div>

        <button 
          onClick={onClose}
          className="absolute -top-1 -right-1 w-6 h-6 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-white"
        >
          <X size={12} />
        </button>
        
        <button 
          onClick={() => setIsActive(!isActive)}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90"
        >
          {isActive ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
        </button>
      </div>
    </div>
  );
};

export default RestTimer;
