
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, Loader2, Trash2, Dumbbell, Clock, ChevronRight, X, Play, AlertCircle, Cpu, Utensils, Apple, Flame, BrainCircuit, Zap, CheckCircle2 } from 'lucide-react';
import { getAIPersonalAdvice } from '../services/geminiService';
import { EXERCISES } from '../data/exercises';
import { ActiveProtocol } from '../types';

interface PersonalAIProps {
  onActivateProtocol?: (protocol: ActiveProtocol) => void;
}

const PersonalAI: React.FC<PersonalAIProps> = ({ onActivateProtocol }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', parts: {text: string}[]}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPlanBuilder, setShowPlanBuilder] = useState(false);
  
  const [objective, setObjective] = useState<'Hipertrofia' | 'Emagrecimento' | 'Força'>('Hipertrofia');
  const [duration, setDuration] = useState('60');
  const [level, setLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [gender, setGender] = useState<'Homem' | 'Mulher'>('Homem');
  const [injuries, setInjuries] = useState('');
  const [step, setStep] = useState(1);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) setMessages(JSON.parse(savedChat));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, parts: [{ text: textToSend }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getAIPersonalAdvice(textToSend, messages);
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    setIsLoading(false);
  };

  const generatePlan = () => {
    const exercisesList = EXERCISES.map(e => `${e.name}`).join(', ');
    const prompt = `Gere meu PROTOCOLO PERSONALIZADO DE 30 DIAS agora. 
    MEU PERFIL: ${gender}, Objetivo principal: ${objective}, Nível atual: ${level}, Disponibilidade: ${duration} minutos por treino.
    Foco adicional/Restrições: ${injuries || 'Nenhuma'}.
    Lembre-se de usar os exercícios: ${exercisesList}.
    POR FAVOR, inclua obrigatoriamente as seções "### RESUMO NUTRICIONAL" e "### MENTALIDADE TITAN" com orientações específicas para o objetivo de ${objective}.`;
    
    handleSend(prompt);
    setShowPlanBuilder(false);
    setStep(1);
  };

  const isProtocolMessage = (text: string) => {
    const upperText = text.toUpperCase();
    return upperText.includes('30 DIAS') || upperText.includes('### DIA 1') || upperText.includes('DIA 1:');
  };

  const extractSection = (text: string, sectionTitle: string) => {
    const upperText = text.toUpperCase();
    const index = upperText.indexOf(sectionTitle.toUpperCase());
    if (index === -1) return null;

    const nextSectionIndex = upperText.indexOf("###", index + sectionTitle.length);
    const content = nextSectionIndex === -1 
      ? text.substring(index + sectionTitle.length) 
      : text.substring(index + sectionTitle.length, nextSectionIndex);
    
    return content.trim();
  };

  const activateCurrentPlan = (text: string) => {
    if (!onActivateProtocol) return;

    const newProtocol: ActiveProtocol = {
      title: `Titan Elite: ${objective}`,
      objective: objective,
      startDate: new Date().toISOString(),
      content: text,
      completedDays: []
    };

    onActivateProtocol(newProtocol);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] py-4">
      {/* AI Status Header */}
      <div className="shrink-0 mb-6 glass p-4 rounded-[2rem] flex justify-between items-center border-white/5">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl animate-mesh flex items-center justify-center relative shadow-lg shadow-purple-500/20">
                <Cpu size={24} className="text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></div>
            </div>
            <div>
                <h2 className="text-lg font-black italic tracking-tighter uppercase leading-none">Personal <span className="text-purple-500">AI</span></h2>
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1 block">Sincronizado • Online</span>
            </div>
        </div>
        <button 
          onClick={() => setShowPlanBuilder(true)}
          className="btn-primary p-3 rounded-2xl text-white shadow-xl shadow-purple-600/20"
        >
          <Dumbbell size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar space-y-8 px-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-30">
             <Bot size={60} className="text-zinc-800" />
             <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-widest">Aguardando comando...</p>
                <p className="text-xs font-bold text-zinc-600">Peça para gerar um treino ou clique no halter acima.</p>
             </div>
          </div>
        )}
        {messages.map((m, i) => {
          const nutritionTips = m.role === 'model' ? extractSection(m.parts[0].text, "### RESUMO NUTRICIONAL") : null;
          const motivationTips = m.role === 'model' ? extractSection(m.parts[0].text, "### MENTALIDADE TITAN") : null;
          
          let cleanText = m.parts[0].text;
          const sections = ["### RESUMO NUTRICIONAL", "### MENTALIDADE TITAN"];
          sections.forEach(s => {
            const idx = cleanText.toUpperCase().indexOf(s);
            if (idx !== -1) cleanText = cleanText.substring(0, idx).trim();
          });

          return (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-slide-up`}>
              <div className={`max-w-[85%] p-6 rounded-[2.5rem] text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none shadow-xl shadow-purple-600/10 font-medium' 
                  : 'bg-zinc-900 border border-white/10 text-zinc-300 rounded-tl-none shadow-lg whitespace-pre-wrap'
              }`}>
                {cleanText}
              </div>
              
              {/* Seção de Nutrição Personalizada - ESTILO PRO CARD */}
              {m.role === 'model' && nutritionTips && (
                <div className="mt-4 w-[90%] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                    <Utensils size={100} />
                  </div>
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40">
                      <Apple size={22} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] italic">Bio-Nutrição</h4>
                      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">Ajuste Metabólico: {objective}</p>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-300 font-bold leading-relaxed whitespace-pre-wrap italic pl-2 border-l-2 border-emerald-500/30">
                    {nutritionTips}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-emerald-500/10 rounded-full text-[8px] font-black text-emerald-500 uppercase">Proteína Alta</span>
                    <span className="px-3 py-1 bg-emerald-500/10 rounded-full text-[8px] font-black text-emerald-500 uppercase">Hidratação 4L</span>
                  </div>
                </div>
              )}

              {/* Seção de Motivação - ESTILO TITAN MINDSET */}
              {m.role === 'model' && motivationTips && (
                <div className="mt-4 w-[90%] bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:scale-125 transition-all duration-700">
                    <Zap size={100} />
                  </div>
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/40">
                      <BrainCircuit size={22} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] italic">Titan Mindset</h4>
                      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">Drive Neural de Performance</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 font-black leading-relaxed whitespace-pre-wrap italic uppercase tracking-tight">
                    "{motivationTips}"
                  </p>
                </div>
              )}

              {m.role === 'model' && isProtocolMessage(m.parts[0].text) && (
                <button 
                  onClick={() => activateCurrentPlan(m.parts[0].text)}
                  className="mt-8 btn-primary text-white font-black px-10 py-5 rounded-[2rem] text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl shadow-purple-500/40 transition-all hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 size={16} /> ATIVAR PROTOCOLO
                </button>
              )}
            </div>
          );
        })}
        {isLoading && (
            <div className="flex justify-start animate-slide-up">
                <div className="bg-zinc-900 border border-white/5 p-6 rounded-[2.5rem] rounded-tl-none flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Calculando...</span>
                </div>
            </div>
        )}
      </div>

      {/* Input Section */}
      <div className="mt-8 relative px-1">
        <input 
          type="text" 
          placeholder="Dúvida ou comando..."
          className="w-full glass border-white/10 rounded-[2rem] py-6 pl-8 pr-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-bold placeholder:text-zinc-600"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={() => handleSend()}
          className="absolute right-3 top-3 bottom-3 w-14 btn-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all disabled:opacity-30"
          disabled={!input.trim() || isLoading}
        >
          <Send size={22} />
        </button>
      </div>

      {/* Modern Plan Builder Overlay */}
      {showPlanBuilder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowPlanBuilder(false)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/5 rounded-[3rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setShowPlanBuilder(false)} className="absolute top-8 right-8 w-10 h-10 glass rounded-full flex items-center justify-center text-zinc-500">
              <X size={18} />
            </button>
            
            <div className="mb-8 text-center">
              <div className="w-16 h-16 animate-mesh rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/20">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">Configurar <br/><span className="text-purple-500">Protocolo</span></h3>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mt-2">Etapa {step}/3</p>
            </div>

            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                  <div className="grid grid-cols-2 gap-3">
                    {['Homem', 'Mulher'].map(g => (
                      <button key={g} onClick={() => setGender(g as any)} className={`py-4 rounded-[1.2rem] text-xs font-black uppercase tracking-widest border transition-all ${gender === g ? 'bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-500/20' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{g}</button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {['Iniciante', 'Intermediário', 'Avançado'].map(l => (
                      <button key={l} onClick={() => setLevel(l as any)} className={`w-full py-4 rounded-[1.2rem] text-xs font-black uppercase tracking-widest border transition-all ${level === l ? 'bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-500/20' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{l}</button>
                    ))}
                  </div>
                  <button onClick={() => setStep(2)} className="w-full btn-primary text-white font-black py-5 rounded-[1.5rem] text-xs uppercase tracking-widest shadow-xl shadow-purple-500/30">Próximo</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                   <div className="space-y-2">
                    {['Hipertrofia', 'Emagrecimento', 'Força'].map(o => (
                      <button key={o} onClick={() => setObjective(o as any)} className={`w-full py-4 rounded-[1.2rem] text-xs font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${objective === o ? 'bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-500/20' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                        {o}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(1)} className="flex-1 bg-zinc-800 text-zinc-500 font-black py-5 rounded-[1.5rem] text-[10px] uppercase">Voltar</button>
                    <button onClick={() => setStep(3)} className="flex-[2] btn-primary text-white font-black py-5 rounded-[1.5rem] text-[10px] uppercase">Próximo</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                  <textarea 
                    placeholder="Alguma restrição ou foco específico (ex: braços)?"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-[1.5rem] p-5 text-xs text-white h-32 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    value={injuries}
                    onChange={(e) => setInjuries(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setStep(2)} className="flex-1 bg-zinc-800 text-zinc-500 font-black py-5 rounded-[1.5rem] text-[10px] uppercase tracking-widest">Voltar</button>
                    <button 
                      onClick={generatePlan}
                      className="flex-[2] btn-primary text-white font-black py-5 rounded-[1.5rem] text-[10px] uppercase tracking-widest shadow-xl shadow-purple-500/30"
                    >
                      Gerar Agora
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalAI;
