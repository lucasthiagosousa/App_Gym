
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets personalized fitness advice from the FitMaster AI.
 * Uses gemini-3-pro-preview for complex reasoning and PhD-level persona.
 */
export const getAIPersonalAdvice = async (userPrompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: `Você é o 'FitMaster AI', um personal trainer de elite com PhD em Biomecânica.
        
        PROTOCOLO DE 30 DIAS - REGRAS ESTRITAS:
        1. Comece SEMPRE com: "AQUI ESTÁ SEU PROTOCOLO DE 30 DIAS".
        2. Formato por dia: "### DIA [X]: [Foco do Treino] | CATEGORIA: [SUPERIORES ou INFERIORES ou FULL BODY]".
        3. Explique brevemente o que a CATEGORIA significa (ex: "SUPERIORES: Foco em tronco e braços").
        4. Exercícios devem seguir o padrão: "- [Nome do Exercício]: [Séries]x[Repetições] - [Observação Técnica]".
        5. Inclua seções obrigatórias no final: 
           - "### RESUMO NUTRICIONAL": Macros sugeridos e timing.
           - "### MENTALIDADE TITAN": Instrução psicológica para a fase atual.
        
        DIRETRIZES TÉCNICAS:
        - Use termos como RPE (Esforço Percebido), Tempo (cadência) e Descanso Ativo.
        - Se o objetivo for Hipertrofia, foque em Tensão Mecânica.
        - Se for Emagrecimento, foque em Densidade Metabólica.
        - Responda de forma motivadora, porém extremamente técnica e profissional.`,
        temperature: 0.6,
      }
    });

    // Access the .text property directly as per the latest SDK guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Conexão neural interrompida. Mantenha o foco no treino e tente novamente em instantes.";
  }
};

/**
 * Searches for market deals using Google Search grounding.
 */
export const searchMarketDeals = async (query: string, category: 'supplements' | 'clothing') => {
  try {
    const prompt = category === 'supplements' 
      ? `Encontre ofertas reais para: ${query}. Liste marca, preço e loja confiável.`
      : `Encontre promoções de vestuário fitness para: ${query}. Foque em qualidade e preço.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      // Extracting URLs from groundingChunks as required by the guidelines.
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};
