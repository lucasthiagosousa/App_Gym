
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Scale, 
  Ruler, 
  Target, 
  Activity, 
  Calendar, 
  Save, 
  ChevronLeft,
  Zap,
  ShieldCheck,
  CheckCircle,
  Hash
} from 'lucide-react';
import { User, View } from '../types';

interface UserProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigate: (view: View) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [formData, setFormData] = useState<User>(user);
  const [showSaveFeedback, setShowSaveFeedback] = useState(false);

  const handleSave = () => {
    onUpdateUser(formData);
    setShowSaveFeedback(true);
    setTimeout(() => setShowSaveFeedback(false), 2000);
  };

  return (
    <div className="py-6 space-y-8 animate-slide-up pb-32">
      {/* Header com Navegação */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 active:scale-90 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Athlete <span className="text-purple-500">Bio</span></h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">Configuração Biométrica</p>
        </div>
      </div>

      {/* Profile Image & Basic Info */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-[2.5rem] animate-mesh p-1 shadow-2xl shadow-purple-500/20">
            <div className="w-full h-full bg-zinc-900 rounded-[2.3rem] overflow-hidden p-1 border-4 border-black">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full object-cover" alt="Avatar" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center border-4 border-black text-white">
            <ShieldCheck size={14} />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{user.name}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user.email}</p>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Dados Biométricos */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 px-2 flex items-center gap-2">
            <Scale size={14} /> Dados Biométricos
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="neo-card p-5 rounded-[2rem] border-white/5 space-y-3">
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest italic">Peso Atual</p>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className="bg-transparent text-2xl font-black text-white italic tracking-tighter focus:outline-none w-full"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
                  placeholder="00"
                />
                <span className="text-xs font-black text-zinc-600 uppercase">KG</span>
              </div>
            </div>
            <div className="neo-card p-5 rounded-[2rem] border-white/5 space-y-3">
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest italic">Altura</p>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className="bg-transparent text-2xl font-black text-white italic tracking-tighter focus:outline-none w-full"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({...formData, height: Number(e.target.value)})}
                  placeholder="000"
                />
                <span className="text-xs font-black text-zinc-600 uppercase">CM</span>
              </div>
            </div>
          </div>
          <div className="neo-card p-5 rounded-[2rem] border-white/5 space-y-3">
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest italic">Idade</p>
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-purple-500" />
                <input 
                  type="number" 
                  className="bg-transparent text-xl font-black text-white italic tracking-tighter focus:outline-none w-full"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                  placeholder="Qual sua idade?"
                />
              </div>
            </div>
        </div>

        {/* Gênero */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 px-2">Gênero Bio</h4>
          <div className="flex gap-2">
            {['Homem', 'Mulher', 'Outro'].map((g) => (
              <button 
                key={g}
                onClick={() => setFormData({...formData, gender: g as any})}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.gender === g ? 'bg-purple-600 border-purple-500 text-white shadow-lg' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Configurações de Treino */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 px-2 flex items-center gap-2">
            <Target size={14} /> Perfil do Protocolo
          </h4>
          <div className="neo-card p-6 rounded-[2.5rem] border-white/5 space-y-6">
            <div className="space-y-3">
              <label className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Objetivo Principal</label>
              <div className="grid grid-cols-1 gap-2">
                {['Hipertrofia', 'Emagrecimento', 'Força'].map((goal) => (
                  <button 
                    key={goal}
                    onClick={() => setFormData({...formData, goal: goal as any})}
                    className={`w-full py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left flex justify-between items-center transition-all ${formData.goal === goal ? 'bg-white text-black' : 'bg-black/40 text-zinc-500 border border-white/5'}`}
                  >
                    {goal}
                    {formData.goal === goal && <CheckCircle size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Nível de Forja</label>
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                {['Iniciante', 'Intermediário', 'Avançado'].map((lvl) => (
                  <button 
                    key={lvl}
                    onClick={() => setFormData({...formData, level: lvl as any})}
                    className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${formData.level === lvl ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-600'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Frequência Semanal</label>
              <div className="flex justify-between items-center bg-black/40 rounded-2xl p-4 border border-white/5">
                <span className="text-xl font-black text-white italic">{formData.trainingFrequency || 0} <span className="text-[10px] uppercase text-zinc-500">Dias</span></span>
                <div className="flex gap-2">
                  <button onClick={() => setFormData({...formData, trainingFrequency: Math.max(1, (formData.trainingFrequency || 0) - 1)})} className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-white active:scale-90">-</button>
                  <button onClick={() => setFormData({...formData, trainingFrequency: Math.min(7, (formData.trainingFrequency || 0) + 1)})} className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-white active:scale-90">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Salvar Flutuante ou Fixo */}
      <div className="pt-4">
        <button 
          onClick={handleSave}
          className="w-full btn-primary py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {showSaveFeedback ? (
            <>
              <CheckCircle size={18} /> BIO ATUALIZADA
            </>
          ) : (
            <>
              <Save size={18} /> SALVAR ALTERAÇÕES
            </>
          )}
        </button>
      </div>

      {/* Logout Option */}
      <div className="text-center pt-8">
        <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest leading-loose">
          Suas alterações são salvas localmente <br/> para máxima privacidade.
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
