
import React, { useState } from 'react';
import { ShoppingCart, Tag, ExternalLink, Flame, Search, Loader2, Globe, ArrowRight, Sparkles, Shirt, ShoppingBag, Percent, Ticket } from 'lucide-react';
import { SupplementDeal } from '../types';
import { searchMarketDeals } from '../services/geminiService';

const QUICK_SEARCHES = {
  supplements: ['Creatina Creapure', 'Whey Isolado', 'Pré-Treino', 'Multivitamínico'],
  clothing: ['Camiseta Oversized', 'Shorts Treino', 'Tênis LPO', 'Regata Cavada']
};

const SupplementDeals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'supplements' | 'clothing'>('supplements');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ text: string, sources: any[] } | null>(null);

  const handleSearch = async (queryOverride?: string) => {
    const q = queryOverride || searchQuery;
    if (!q.trim() || isSearching) return;
    
    setIsSearching(true);
    setSearchResult(null);
    try {
      const result = await searchMarketDeals(q, activeTab);
      setSearchResult(result);
    } catch (error) {
      alert("Erro ao rastrear preços. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-6 space-y-8 pb-32">
      {/* Header Premium */}
      <div className="flex justify-between items-start">
        <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none text-white">Titan <br/><span className="text-purple-500">Market</span></h2>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Scanner de Ofertas Real-Time</p>
            </div>
        </div>
        <div className="w-14 h-14 animate-mesh rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <ShoppingBag size={28} />
        </div>
      </div>

      {/* Tabs de Categoria */}
      <div className="flex bg-zinc-900/50 p-1.5 rounded-3xl border border-white/5">
        <button 
          onClick={() => { setActiveTab('supplements'); setSearchResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'supplements' ? 'bg-white text-black shadow-xl scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Percent size={14} /> Suplementos
        </button>
        <button 
          onClick={() => { setActiveTab('clothing'); setSearchResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'clothing' ? 'bg-white text-black shadow-xl scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Shirt size={14} /> Gymwear
        </button>
      </div>

      {/* Barra de Busca Inteligente */}
      <div className="space-y-4">
        <div className="relative group">
          <input 
            type="text" 
            placeholder={activeTab === 'supplements' ? "Qual suplemento você busca?" : "Qual peça de roupa você busca?"}
            className="w-full glass border-white/10 rounded-[2rem] py-6 pl-8 pr-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-bold placeholder:text-zinc-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="absolute right-3 top-3 bottom-3 px-6 btn-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 active:scale-95"
          >
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={22} />}
          </button>
        </div>

        {/* Sugestões Rápidas */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {QUICK_SEARCHES[activeTab].map(tag => (
            <button 
              key={tag}
              onClick={() => { setSearchQuery(tag); handleSearch(tag); }}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black uppercase text-zinc-500 whitespace-nowrap hover:border-purple-500/50 hover:text-purple-400 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados da Busca Real-Time */}
      {searchResult && (
        <section className="animate-slide-up space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-400" size={18} />
              <h3 className="text-sm font-black uppercase text-white tracking-widest italic">Rastreador Titan: <span className="text-purple-500">Resultados</span></h3>
            </div>
          </div>
          
          <div className="neo-card p-8 rounded-[3rem] border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Ticket size={120} className="rotate-12" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
                {searchResult.text}
              </div>
              
              {/* Links de Grounding / Lojas Reais */}
              {searchResult.sources && searchResult.sources.length > 0 && (
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Lojas Verificadas (Clique para ir):</p>
                  <div className="grid grid-cols-1 gap-2">
                    {searchResult.sources.map((source: any, idx: number) => (
                      source.web && (
                        <a 
                          key={idx} 
                          href={source.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 rounded-2xl p-4 transition-all active:scale-95 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                              <Globe size={14} />
                            </div>
                            <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors truncate max-w-[200px]">
                              {source.web.title || 'Ver Oferta Direta'}
                            </span>
                          </div>
                          <ExternalLink size={14} className="text-zinc-600 group-hover:text-purple-400" />
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => { setSearchResult(null); setSearchQuery(''); }}
              className="mt-8 w-full py-4 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-rose-500 hover:border-rose-500/30 transition-all"
            >
              Nova Pesquisa
            </button>
          </div>
        </section>
      )}

      {/* Banner de Cupons Exclusivos */}
      {!searchResult && (
        <section className="space-y-6">
           <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Parceiros Titan</h3>
              <div className="flex items-center gap-1 text-orange-500 text-[10px] font-black uppercase">
                <Flame size={14} className="animate-pulse" /> Descontos do Dia
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <CouponCard brand="Growth Supps" code="TITAN" discount="10% OFF" color="bg-blue-600" />
               <CouponCard brand="Max Titanium" code="MAXTITAN" discount="15% OFF" color="bg-red-600" />
               <CouponCard brand="Nike Fitness" code="APP15" discount="15% OFF" color="bg-zinc-100 text-black" />
            </div>
        </section>
      )}

      {/* Seção Informativa de Marcas */}
      {!searchResult && (
        <div className="bg-zinc-900/30 border border-dashed border-zinc-800 p-8 rounded-[3rem] text-center">
          <Sparkles className="mx-auto text-zinc-700 mb-4" size={32} />
          <h4 className="text-sm font-black text-white uppercase tracking-widest">Onde Buscar?</h4>
          <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
            Pesquise por marcas como **Integralmedica, Dark Lab, Puma ou Insider**. Nosso rastreador filtra os outlets e cupons de primeira compra automaticamente para você.
          </p>
        </div>
      )}
    </div>
  );
};

const CouponCard: React.FC<{ brand: string; code: string; discount: string; color: string }> = ({ brand, code, discount, color }) => (
  <div className="neo-card p-6 rounded-[2.5rem] flex items-center justify-between border-white/5 hover:border-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[10px] ${color} shadow-lg`}>
        {discount}
      </div>
      <div>
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{brand}</p>
        <p className="text-sm font-black text-white tracking-tighter italic uppercase">{code}</p>
      </div>
    </div>
    <button 
      onClick={() => {
        navigator.clipboard.writeText(code);
        alert(`Cupom ${code} copiado!`);
      }}
      className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl transition-all active:scale-90"
    >
      <Ticket size={20} />
    </button>
  </div>
);

export default SupplementDeals;
