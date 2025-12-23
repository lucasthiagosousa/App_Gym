
import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Dumbbell, 
  MessageSquare, 
  TrendingUp, 
  ShoppingBag,
  Zap,
  Activity,
  Share2,
  X,
  Copy,
  Smartphone,
  QrCode
} from 'lucide-react';
import Home from './components/Home';
import ExerciseLibrary from './components/ExerciseLibrary';
import PersonalAI from './components/PersonalAI';
import ProgressTracking from './components/ProgressTracking';
import SupplementDeals from './components/SupplementDeals';
import ProtocolView from './components/ProtocolView';
import { View, ActiveProtocol } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [activeProtocol, setActiveProtocol] = useState<ActiveProtocol | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const savedDays = localStorage.getItem('completedDays');
    if (savedDays) setCompletedDays(JSON.parse(savedDays));
    
    const savedProtocol = localStorage.getItem('activeProtocol');
    if (savedProtocol) setActiveProtocol(JSON.parse(savedProtocol));
  }, []);

  const toggleDay = (date: string) => {
    const newDays = completedDays.includes(date) 
      ? completedDays.filter(d => d !== date)
      : [...completedDays, date];
    setCompletedDays(newDays);
    localStorage.setItem('completedDays', JSON.stringify(newDays));
  };

  const markDateAsCompleted = (date: string) => {
    if (!completedDays.includes(date)) {
      const newDays = [...completedDays, date];
      setCompletedDays(newDays);
      localStorage.setItem('completedDays', JSON.stringify(newDays));
    }
  };

  const startNewProtocol = (protocol: ActiveProtocol) => {
    setActiveProtocol(protocol);
    localStorage.setItem('activeProtocol', JSON.stringify(protocol));
    setCurrentView('protocol');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL copiada! Envie para o seu WhatsApp e abra no celular.");
  };

  const renderView = () => {
    switch(currentView) {
      case 'home': return <Home completedDays={completedDays} toggleDay={toggleDay} onNavigate={setCurrentView} activeProtocol={activeProtocol} />;
      case 'exercises': return <ExerciseLibrary />;
      case 'ai': return <PersonalAI onActivateProtocol={startNewProtocol} />;
      case 'progress': return <ProgressTracking />;
      case 'deals': return <SupplementDeals />;
      case 'protocol': return <ProtocolView 
        onNavigate={setCurrentView}
        protocol={activeProtocol} 
        onMarkDateAsCompleted={markDateAsCompleted}
        setProtocol={(p) => {
          setActiveProtocol(p);
          if (p) localStorage.setItem('activeProtocol', JSON.stringify(p));
          else localStorage.removeItem('activeProtocol');
        }} 
      />;
      default: return <Home completedDays={completedDays} toggleDay={toggleDay} onNavigate={setCurrentView} activeProtocol={activeProtocol} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-black overflow-hidden relative">
      {/* Premium Header */}
      <header className="p-5 flex justify-between items-center shrink-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg animate-mesh flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Activity size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white italic">
              TITAN<span className="text-purple-500">AI</span>
            </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowShareModal(true)}
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-purple-400 hover:text-white transition-all active:scale-90"
          >
            <Share2 size={18} />
          </button>
          <div className="flex flex-col items-end mr-1">
             <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Nível</span>
             <span className="text-xs font-black text-white">PRO</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 p-0.5 shadow-xl">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="rounded-xl" alt="Avatar" />
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32 px-5">
        <div key={currentView} className="animate-slide-up">
            {renderView()}
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowShareModal(false)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setShowShareModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="text-center space-y-6">
              <div className="w-20 h-20 animate-mesh rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30">
                <Smartphone size={40} className="text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">Conectar <span className="text-purple-500">Celular</span></h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-3">Escaneie para treinar agora</p>
              </div>

              <div className="bg-white p-4 rounded-3xl inline-block shadow-[0_0_30px_rgba(168,85,247,0.2)] border-4 border-purple-500/20">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.href)}&bgcolor=ffffff&color=000000&margin=1`} 
                  alt="QR Code do App" 
                  className="w-40 h-40"
                />
              </div>

              <div className="space-y-3">
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Ou copie o link direto:</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-[10px] text-zinc-400 font-medium truncate italic">
                    {window.location.href}
                  </div>
                  <button 
                    onClick={copyUrl}
                    className="p-3 bg-purple-600 rounded-xl text-white shadow-lg active:scale-90 transition-all"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                Após abrir no celular, use a opção <br/> <b>"Adicionar à Tela de Início"</b> para instalar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Island Navigation */}
      <div className="fixed bottom-6 left-5 right-5 max-w-[calc(448px-2.5rem)] mx-auto z-50">
        <nav className="glass rounded-[2rem] p-3 flex justify-around items-center shadow-2xl border border-white/10">
          <NavButton 
            active={currentView === 'home'} 
            onClick={() => setCurrentView('home')} 
            icon={<HomeIcon size={22} />} 
          />
          <NavButton 
            active={currentView === 'exercises'} 
            onClick={() => setCurrentView('exercises')} 
            icon={<Dumbbell size={22} />} 
          />
          <NavButton 
            active={currentView === 'ai'} 
            onClick={() => setCurrentView('ai')} 
            icon={<MessageSquare size={22} />} 
          />
          <NavButton 
            active={currentView === 'protocol'} 
            onClick={() => setCurrentView('protocol')} 
            icon={<Zap size={22} />} 
          />
          <NavButton 
            active={currentView === 'deals'} 
            onClick={() => setCurrentView('deals')} 
            icon={<ShoppingBag size={22} />} 
          />
        </nav>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center relative
      ${active 
        ? 'animate-nav-active text-white nav-item-active' 
        : 'text-zinc-500 hover:text-zinc-300 hover:scale-110 active:scale-90'}`}
  >
    <div className={`transition-all duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
  </button>
);

export default App;
