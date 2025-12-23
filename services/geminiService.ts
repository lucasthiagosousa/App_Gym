
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIPersonalAdvice = async (userPrompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: `Você é o 'FitMaster AI', um personal trainer de elite focado em resultados reais. 
        
        REGRAS PARA PROTOCOLOS:
        1. Sempre comece planos de treino com a frase "AQUI ESTÁ SEU PROTOCOLO DE 30 DIAS".
        2. Use obrigatoriamente o formato "### DIA [Número]" para cada dia ou bloco de treino.
        3. Liste exercícios com marcadores "-" ou "*".
        4. No final do protocolo, inclua obrigatoriamente uma seção intitulada "### RESUMO NUTRICIONAL" com 3 a 4 dicas práticas e específicas baseadas no objetivo do usuário (Hipertrofia, Emagrecimento ou Força).
        
        REGRAS GERAIS:
        - Seja motivador, técnico e direto.
        - Se o usuário quiser "crescer braço", foque em volume para bíceps e tríceps.
        - Se quiser emagrecer, foque em treinos metabólicos e dicas de déficit.
        - Sempre responda em Português do Brasil.`,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, mestre. Tive um problema de conexão. Vamos focar no treino enquanto eu me recupero! Tente enviar sua mensagem novamente.";
  }
};

export const searchMarketDeals = async (query: string, category: 'supplements' | 'clothing') => {
  try {
    const prompt = category === 'supplements' 
      ? `Encontre os preços REAIS mais baixos hoje para o suplemento: ${query}. 
         Foque em marcas famosas (Growth, Max, Integral, Optimun). 
         Liste: 1. Loja e Preço atual, 2. Cupons de desconto ativos (ex: cupom de influenciadores), 3. Onde está o frete mais barato. 
         Seja direto e organizado.`
      : `Encontre ofertas de roupas de academia/gymwear: ${query}. 
         Busque marcas como Nike, Adidas, Under Armour, e marcas fitness nacionais famosas. 
         Destaque promoções de outlets e cupons de primeira compra ativos. 
         Liste preços reais e links de lojas confiáveis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Market Search Error:", error);
    throw error;
  }
};
