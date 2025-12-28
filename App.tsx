
import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Dumbbell, 
  MessageSquare, 
  ShoppingBag,
  Zap,
  Activity,
  Plus,
  User as UserIcon,
  X,
  Smartphone
} from 'lucide-react';
import Home from './components/Home';
import ExerciseLibrary from './components/ExerciseLibrary';
import PersonalAI from './components/PersonalAI';
import ProgressTracking from './components/ProgressTracking';
import SupplementDeals from './components/SupplementDeals';
import ProtocolView from './components/ProtocolView';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { View, ActiveProtocol, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [activeProtocol, setActiveProtocol] = useState<ActiveProtocol | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('titan_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedDays = localStorage.getItem('completedDays');
    if (savedDays) setCompletedDays(JSON.parse(savedDays));
    
    const savedProtocol = localStorage.getItem('activeProtocol');
    if (savedProtocol) setActiveProtocol(JSON.parse(savedProtocol));

    setIsAppReady(true);
    
    const preventDefault = (e: TouchEvent) => {
        if ((e as any).scale !== 1) e.preventDefault();
    };
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, []);

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('titan_user', JSON.stringify(updatedUser));
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('titan_user', JSON.stringify(newUser));
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

  if (!isAppReady) return null;

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch(currentView) {
      case 'home': return <Home 
        completedDays={completedDays} 
        toggleDay={() => {}} 
        onNavigate={setCurrentView} 
        activeProtocol={activeProtocol} 
        setProtocol={setActiveProtocol}
      />;
      case 'exercises': return <ExerciseLibrary />;
      case 'ai': return <PersonalAI onActivateProtocol={startNewProtocol} />;
      case 'progress': return <ProgressTracking />;
      case 'deals': return <SupplementDeals />;
      case 'profile': return <UserProfile user={user} onUpdateUser={handleUpdateUser} onNavigate={setCurrentView} />;
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
      default: return <Home completedDays={completedDays} toggleDay={() => {}} onNavigate={setCurrentView} activeProtocol={activeProtocol} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-black overflow-hidden relative">
      {/* Header Premium - Industrial Design */}
      <header className="px-6 py-6 pt-10 flex justify-between items-center shrink-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
            <div 
              onClick={() => setCurrentView('home')}
              className="w-10 h-10 rounded-2xl animate-mesh flex items-center justify-center shadow-2xl shadow-purple-500/20 cursor-pointer active:scale-90 transition-all"
            >
                <Activity size={22} className="text-white" />
            </div>
            <h1 
              onClick={() => setCurrentView('home')}
              className="text-3xl font-bebas tracking-widest text-white cursor-pointer italic"
            >
              TITAN <span className="text-zinc-700">AI</span>
            </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowShareModal(true)}
            className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-500 active:scale-90 transition-all hover:text-white"
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={() => setCurrentView('profile')}
            className={`w-11 h-11 rounded-2xl p-0.5 transition-all active:scale-90 ${currentView === 'profile' ? 'bg-purple-500 ring-2 ring-purple-500 shadow-xl' : 'bg-zinc-900 border border-white/10'}`}
          >
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="rounded-xl w-full h-full" alt="Avatar" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-36 px-6 pt-6">
        <div key={currentView} className="animate-slide-up">
            {renderView()}
        </div>
      </main>

      {/* Floating Safe-Island Navigation */}
      <div className="fixed bottom-10 left-6 right-6 max-w-[calc(448px-3rem)] mx-auto z-[100]">
        <nav className="glass rounded-[3rem] p-5 flex justify-around items-center shadow-2xl border border-white/10 ring-1 ring-white/5">
          <NavButton 
            active={currentView === 'home'} 
            onClick={() => setCurrentView('home')} 
            icon={<HomeIcon size={26} />} 
          />
          <NavButton 
            active={currentView === 'exercises'} 
            onClick={() => setCurrentView('exercises')} 
            icon={<Dumbbell size={26} />} 
          />
          <NavButton 
            active={currentView === 'ai'} 
            onClick={() => setCurrentView('ai')} 
            icon={<MessageSquare size={26} />} 
          />
          <NavButton 
            active={currentView === 'protocol'} 
            onClick={() => setCurrentView('protocol')} 
            icon={<Zap size={26} />} 
          />
          <NavButton 
            active={currentView === 'deals'} 
            onClick={() => setCurrentView('deals')} 
            icon={<ShoppingBag size={26} />} 
          />
        </nav>
      </div>

      {/* Installation Sheet */}
      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center px-4 pb-12">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={() => setShowShareModal(false)} />
          <div className="relative w-full max-w-sm bg-zinc-950 border border-white/5 rounded-[4rem] p-10 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <button onClick={() => setShowShareModal(false)} className="absolute top-10 right-10 text-zinc-700 active:scale-90">
              <X size={28} />
            </button>
            
            <div className="text-center">
              <div className="w-24 h-24 animate-mesh rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30 mb-8">
                <Smartphone size={44} className="text-white" />
              </div>
              
              <h3 className="text-3xl font-bebas text-white italic tracking-wider mb-2 leading-none uppercase">INSTALAR <span className="text-purple-500">APP</span></h3>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-10">Titan Mobile Protocol</p>

              <div className="space-y-4 mb-10 text-left">
                {[
                  "No iPhone, toque no botão 'Compartilhar'",
                  "Role e selecione 'Adicionar à Tela de Início'",
                  "Confirme e inicie sua transformação"
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-5 bg-zinc-900/50 p-5 rounded-[2rem] border border-white/5">
                     <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-black shrink-0">{i+1}</span>
                     <p className="text-xs font-bold text-zinc-400 leading-tight">{step}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full btn-primary text-white font-black py-6 rounded-[2rem] text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
              >
                VAMOS TREINAR!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-3xl transition-all duration-500 flex flex-col items-center justify-center relative
      ${active 
        ? 'scale-125 text-white nav-item-active' 
        : 'text-zinc-700 active:scale-90 opacity-60'}`}
  >
    {icon}
    {active && <div className="absolute -bottom-1 w-1.5 h-1.5 bg-purple-500 rounded-full blur-[2px]"></div>}
  </button>
);

export default App;
