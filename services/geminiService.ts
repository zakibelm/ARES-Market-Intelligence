
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeListingCompliance = async (listingText: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this real estate listing for French legal compliance (Loi Alur / Hoguet). 
    Identify missing mandatory information (Surface Carrez, DPE, GES, Fees). 
    Return a FAIL-CLOSED decision.
    
    Listing: ${listingText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING, description: 'PASS or FAIL' },
          reason: { type: Type.STRING },
          missingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidence: { type: Type.NUMBER }
        },
        required: ['decision', 'reason', 'missingElements']
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const runQAAudit = async (agentId: string, systemPrompt: string, payload: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Exécute ton rôle de QA Audit pour l'agent ${agentId}. 
    Données à auditer : ${JSON.stringify(payload)}`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      // Generic schema that covers all QA agents roughly
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          is_valid: { type: Type.BOOLEAN },
          passed: { type: Type.BOOLEAN },
          drift_detected: { type: Type.BOOLEAN },
          is_consistent: { type: Type.BOOLEAN },
          budget_respected: { type: Type.BOOLEAN },
          scenario_passed: { type: Type.BOOLEAN },
          issues: { type: Type.ARRAY, items: { type: Type.STRING } },
          severity: { type: Type.STRING },
          confidence: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        }
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const analyzePricing = async (propertyData: any, marketStats: any, marketEvents: any[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es l'Agent 11 - Pricing Intel. Réalise une analyse de positionnement prix pour ce bien.
    
    DONNÉES BIEN: ${JSON.stringify(propertyData)}
    STATS MARCHÉ: ${JSON.stringify(marketStats)}
    EVENTS RÉCENTS: ${JSON.stringify(marketEvents)}`,
    config: {
      systemInstruction: `Tu es un analyste pricing immobilier senior. Ta mission est de produire un diagnostic de positionnement prix clair, chiffré et exploitable.
      
LOGIQUE DE CALCUL:
1. prix_m2_client = prix_bien / surface_bien
2. delta_vs_mediane (%) = ((prix_m2_client - mediane_prix_m2_quartier) / mediane_prix_m2_quartier) * 100
3. Score de 0 à 100.

Tu préfères ne pas conclure plutôt que conclure faux.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pricing_score: { type: Type.INTEGER },
          positioning_label: { type: Type.STRING },
          delta_vs_market_percent: { type: Type.NUMBER },
          market_tension: { type: Type.STRING },
          estimated_days_on_market: { type: Type.NUMBER, nullable: true },
          confidence_level: { type: Type.STRING },
          analysis_summary: { type: Type.STRING },
          recommended_action: { type: Type.STRING },
          data_sources_used: {
            type: Type.OBJECT,
            properties: {
              market_stats: { type: Type.BOOLEAN },
              market_events: { type: Type.BOOLEAN }
            }
          }
        },
        required: ['pricing_score', 'positioning_label', 'delta_vs_market_percent', 'market_tension', 'confidence_level', 'analysis_summary', 'recommended_action']
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const getMarketSummary = async (events: any[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Synthesize these real estate market events into a high-level strategic summary for an agent.
    Events: ${JSON.stringify(events)}`,
    config: {
      systemInstruction: "You are the ARES Orchestrator. Be concise, authoritative, and data-driven."
    }
  });
  
  return response.text;
};
