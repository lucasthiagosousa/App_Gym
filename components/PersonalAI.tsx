
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, Loader2, Trash2, Dumbbell, Clock, ChevronRight, X, Play, AlertCircle, Cpu, Utensils, Apple } from 'lucide-react';
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
  
  // Questionnaire States
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
    POR FAVOR, inclua também um RESUMO NUTRICIONAL ao final do plano com dicas de alimentação estratégica para meu objetivo de ${objective}.`;
    
    handleSend(prompt);
    setShowPlanBuilder(false);
    setStep(1);
  };

  const isProtocolMessage = (text: string) => {
    const upperText = text.toUpperCase();
    return upperText.includes('30 DIAS') || upperText.includes('### DIA 1') || upperText.includes('DIA 1:');
  };

  const extractNutritionTips = (text: string) => {
    const searchStrings = ["### RESUMO NUTRICIONAL", "### DICAS NUTRICIONAIS", "Resumo Nutricional:", "Dicas de Alimentação:"];
    for (const search of searchStrings) {
      const index = text.toUpperCase().indexOf(search);
      if (index !== -1) {
        return text.substring(index + search.length).trim();
      }
    }
    return null;
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar space-y-6 px-1">
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
          const nutritionTips = m.role === 'model' ? extractNutritionTips(m.parts[0].text) : null;
          const cleanText = m.role === 'model' && nutritionTips 
            ? m.parts[0].text.substring(0, m.parts[0].text.toUpperCase().indexOf("### RESUMO NUTRICIONAL")).trim() 
            : m.parts[0].text;

          return (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-slide-up`}>
              <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none shadow-xl shadow-purple-600/10' 
                  : 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-tl-none shadow-lg whitespace-pre-wrap'
              }`}>
                {cleanText}
              </div>
              
              {m.role === 'model' && nutritionTips && (
                <div className="mt-4 w-[85%] bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-5 shadow-lg animate-in slide-in-from-left-5 duration-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <Apple size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest italic">Dicas de Nutrição Elite</h4>
                      <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">Baseado no seu objetivo</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap italic">
                    {nutritionTips}
                  </div>
                </div>
              )}

              {m.role === 'model' && isProtocolMessage(m.parts[0].text) && (
                <button 
                  onClick={() => activateCurrentPlan(m.parts[0].text)}
                  className="mt-4 btn-primary text-white font-black px-6 py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Play size={12} fill="white" /> ATIVAR ESTE PROTOCOLO
                </button>
              )}
            </div>
          );
        })}
        {isLoading && (
            <div className="flex justify-start animate-slide-up">
                <div className="bg-zinc-900 border border-white/5 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Input Section */}
      <div className="mt-6 relative">
        <input 
          type="text" 
          placeholder="Dúvida ou comando..."
          className="w-full glass border-white/10 rounded-[1.5rem] py-5 pl-6 pr-16 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={() => handleSend()}
          className="absolute right-2 top-2 w-12 h-12 btn-primary text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all disabled:opacity-30"
          disabled={!input.trim() || isLoading}
        >
          <Send size={20} />
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
