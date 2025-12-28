
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Activity, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulando delay de rede para efeito de UX
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        email: email,
        name: isLogin ? 'Atleta Titan' : name
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden px-6 py-12">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full -mt-40"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mb-40"></div>

      {/* Header Logo */}
      <div className="relative z-10 flex flex-col items-center mb-16 animate-slide-up">
        <div className="w-20 h-20 animate-mesh rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-6">
          <Activity size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
          TITAN<span className="text-purple-500">AI</span>
        </h1>
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-3">Elite Performance Protocol</p>
      </div>

      {/* Auth Form */}
      <div className="relative z-10 w-full max-w-sm mx-auto animate-slide-up [animation-delay:200ms]">
        <div className="neo-card rounded-[3rem] p-8 border-white/5 bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
              {isLogin ? 'Entrar na' : 'Criar conta'} <span className="text-purple-500">Forja</span>
            </h2>
            <ShieldCheck className="text-zinc-700" size={24} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Nome Completo"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-500 transition-colors" size={18} />
              <input 
                type="email" 
                required
                placeholder="E-mail"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-500 transition-colors" size={18} />
              <input 
                type="password" 
                required
                placeholder="Senha"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-purple-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'INICIAR PROTOCOLO' : 'REGISTRAR ATLETA'}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] text-zinc-500 font-black uppercase tracking-widest hover:text-purple-400 transition-colors"
            >
              {isLogin ? 'Não tem conta? Comece aqui' : 'Já é um Titan? Entre aqui'}
            </button>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-12 flex flex-col items-center space-y-4 opacity-40">
           <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400">
             <Sparkles size={12} /> Powered by Titan AI Engine
           </div>
           <p className="text-[9px] text-zinc-600 text-center leading-relaxed font-bold">
             Acesso seguro com criptografia de ponta a ponta. <br/> Seus dados de evolução estão protegidos.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
