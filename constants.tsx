
import { Agent, AgentStatus, MarketEvent } from './types';

export const INITIAL_AGENTS: Agent[] = [
  { 
    id: 0, name: 'Orchestrator', role: 'Cerveau Central', status: AgentStatus.IDLE, 
    model: 'anthropic/claude-3.5-sonnet', 
    systemPrompt: `Tu es l’Orchestrateur central du système ARES. Tu coordonnes, routes, surveilles et sécurises l’exécution des agents spécialisés.
      
RESPONSABILITÉS:
1. Séquençage & Parallélisation: Déclencher les agents dans l'ordre (Ingestion -> Vision -> Legal -> Content).
2. Routing Intelligent: Arbitrage entre modèles (Cheap vs Smart). Fallback automatique en cas d'erreur.
3. Fail-Safe: STOP workflow si Agent 6 (Legal) ou Agent 1 (Ingestion) échoue.
4. Observabilité: Enregistre status, latency (ms), et coût estimé.

RÈGLE D'OR: Aucun contenu ne sort sans Legal Gate validé. En cas de doute -> STOP.`,
    ragContext: 'Logs système globaux, topologie des services, SLA definitions.',
    logs: [] 
  },
  { 
    id: 1, name: 'Ingestion', role: 'Extracteur de Faits', status: AgentStatus.IDLE, 
    model: 'meta-llama/llama-3.1-8b-instruct', 
    systemPrompt: 'Rôle : Extraction pure des données techniques et factuelles des annonces (surfaces, pièces, équipements) sans interprétation.',
    ragContext: 'Schéma SQL listings.',
    logs: [] 
  },
  { 
    id: 2, name: 'Vision Expert', role: 'Analyste Image', status: AgentStatus.IDLE, 
    model: 'gemini-3-flash-preview', 
    systemPrompt: 'Rôle : Analyse des photos pour identifier les matériaux (marbre, parquet), l\'état du bien et le style de vie suggéré.',
    ragContext: 'Bibliothèque de matériaux immobiliers.',
    logs: [] 
  },
  { 
    id: 3, name: 'RAG Local', role: 'Injecteur de Contexte', status: AgentStatus.IDLE, 
    model: 'openai/gpt-4o-mini', 
    systemPrompt: 'Rôle : Enrichissement avec des données socio-démographiques, commodités et points d\'intérêt spécifiques au quartier.',
    ragContext: 'Base vectorielle Quartiers France.',
    logs: [] 
  },
  { 
    id: 4, name: 'Tone Cloner', role: 'DNA Stylistique', status: AgentStatus.IDLE, 
    model: 'openai/gpt-4o-mini', 
    systemPrompt: 'Rôle : Analyse et réplication du style d\'écriture unique de l\'agent immobilier pour une communication personnalisée.',
    ragContext: 'Historique des 10 dernières annonces de l\'agent.',
    logs: [] 
  },
  { 
    id: 5, name: 'Copywriter', role: 'Générateur de Contenu', status: AgentStatus.IDLE, 
    model: 'anthropic/claude-3.5-sonnet', 
    systemPrompt: 'Rôle : Rédaction des annonces finales, mêlant émotion, performance SEO et précision technique.',
    ragContext: 'Meilleures pratiques copywriting immo.',
    logs: [] 
  },
  { 
    id: 6, name: 'Legal Gate', role: 'Gardien Alur', status: AgentStatus.IDLE, 
    model: 'anthropic/claude-3.5-sonnet', 
    systemPrompt: 'Rôle : Audit de conformité juridique (Loi Alur/Hoguet). Applique un protocole "Fail-Closed" qui bloque la publication si des mentions obligatoires manquent.',
    ragContext: 'Textes de loi Alur/Hoguet officiels.',
    logs: [] 
  },
  { 
    id: 10, name: 'Market Hunter', role: 'Scraper Delta', status: AgentStatus.IDLE, 
    model: 'Custom/Internal', 
    systemPrompt: 'Rôle : Surveillance nocturne du marché pour détecter les nouveaux biens, les baisses de prix et les biens retirés de la vente.',
    ragContext: 'Fingerprints du marché J-1.',
    logs: [] 
  },
  { 
    id: 11, name: 'Pricing Intel', role: 'Scoring Marché', status: AgentStatus.IDLE, 
    model: 'gemini-3-flash-preview', 
    systemPrompt: `# 📊 Agent 11 — PRICING INTEL (Score de Positionnement Marché)
## 🎯 RÔLE
Tu es un analyste pricing immobilier senior spécialisé en marchés locaux. Ta mission est de produire un diagnostic de positionnement prix clair, chiffré et exploitable.

## 🧮 LOGIQUE DE CALCUL (OBLIGATOIRE)
1. prix_m2_client = prix_bien / surface_bien
2. delta_vs_mediane (%) = ((prix_m2_client - mediane_prix_m2_quartier) / mediane_prix_m2_quartier) * 100
3. Cinétique : via market_events (% baisse, délai retrait).

## 🧾 CLASSIFICATION OBLIGATOIRE
- Sous-prix: <= -5%
- Juste prix: -5% à +5%
- Sur-prix: > +5% (risque délai)

## 🧠 SORTIE OBLIGATOIRE (JSON STRICT)
{
  "pricing_score": 0-100,
  "positioning_label": "Sous-prix | Juste prix | Sur-prix",
  "delta_vs_market_percent": number,
  "market_tension": "Faible | Modérée | Forte",
  "estimated_days_on_market": number | null,
  "confidence_level": "High | Medium | Low",
  "analysis_summary": "Résumé clair en langage agent immobilier",
  "recommended_action": "Recommandation concrète terrain"
}

## 📐 CALCUL DU PRICING SCORE (0–100)
Base score = 70 - |delta_vs_market| * 2 + bonus si marché tendu - malus si baisses fréquentes.`,
    ragContext: 'Matrice de prix historique 24 mois.',
    logs: [] 
  },
  { 
    id: 12, name: 'Publisher', role: 'Planificateur Social', status: AgentStatus.IDLE, 
    model: 'meta-llama/llama-3.1-70b-instruct', 
    systemPrompt: 'Rôle : Création et planification des posts optimisés pour les réseaux sociaux (Instagram, LinkedIn, Facebook).',
    ragContext: 'Calendrier éditorial client.',
    logs: [] 
  },
  { 
    id: 13, name: 'Engagement', role: 'Lead Capture', status: AgentStatus.IDLE, 
    model: 'openai/gpt-4o-mini', 
    systemPrompt: 'Rôle : Interaction automatique avec les commentaires, réponses aux messages et capture des coordonnées des prospects.',
    ragContext: 'Fiches CRM prospects.',
    logs: [] 
  },
];

export const QA_AGENTS: Agent[] = [
  {
    id: 'QA-1', name: 'Data Auditor', role: 'Intégrité des Données', status: AgentStatus.IDLE,
    model: 'gemini-3-flash-preview',
    systemPrompt: `Tu es un auditeur d’intégrité des données. Vérifier la cohérence entre : source (A1), enrichissements (A3), contenus (A5), pricing (A11).
    Contrôles : Aucun chiffre inventé, unités cohérentes. Sortie JSON stricte.`,
    ragContext: 'Data constraints schema.',
    logs: []
  },
  {
    id: 'QA-2', name: 'Legal Regression', role: 'Audit Juridique', status: AgentStatus.IDLE,
    model: 'gemini-3-pro-preview',
    systemPrompt: `Tu es un testeur de régression juridique (Loi Alur / Hoguet). Vérifie que chaque changement respecte toujours les règles. Bloque si DPE/HAI manquent.`,
    ragContext: 'Legal corpus 2024.',
    logs: []
  },
  {
    id: 'QA-3', name: 'Drift Detector', role: 'DNA Stylistique', status: AgentStatus.IDLE,
    model: 'openai/gpt-4o-mini',
    systemPrompt: `Tu es un détecteur de dérive de prompts. Compare les sorties récentes de l’Agent 5 avec le DNA stylistique (Agent 4). Identifie les clichés.`,
    ragContext: 'Brand style guide.',
    logs: []
  },
  {
    id: 'QA-4', name: 'Pricing Sanity', role: 'Contrôle Cohérence Prix', status: AgentStatus.IDLE,
    model: 'gemini-3-flash-preview',
    systemPrompt: `Tu es un contrôleur de cohérence pricing. Vérifie que les conclusions de l’Agent 11 sont cohérentes avec market_stats et market_events.`,
    ragContext: 'Market tolerance rules.',
    logs: []
  },
  {
    id: 'QA-5', name: 'Watchdog', role: 'Coûts & Performance', status: AgentStatus.IDLE,
    model: 'gemini-3-flash-preview',
    systemPrompt: `Tu es un contrôleur de coûts et de performance IA. Audite les appels OpenRouter. Détecte les modèles trop chers ou les latences anormales.`,
    ragContext: 'Budget SLA rules.',
    logs: []
  },
  {
    id: 'QA-6', name: 'E2E Tester', role: 'Parcours Métier', status: AgentStatus.IDLE,
    model: 'gemini-3-pro-preview',
    systemPrompt: `Tu es un testeur de scénarios métier immobiliers. Simule un parcours complet (nouveau mandat, marché tendu) et vérifie la cohérence globale.`,
    ragContext: 'Scenario database.',
    logs: []
  }
];

export const MOCK_MARKET_EVENTS: MarketEvent[] = [
  { id: 'ev-001', type: 'NEW', price: 450000, location: 'Paris 15e', fingerprint: 'fp_7281x', timestamp: '2023-10-27 02:00:01', score: 85 },
  { id: 'ev-002', type: 'UPDATED', price: 795000, previousPrice: 820000, location: 'Lyon 6e', fingerprint: 'fp_9921z', timestamp: '2023-10-27 02:05:12', score: 92 },
  { id: 'ev-003', type: 'REMOVED', price: 310000, location: 'Marseille 8e', fingerprint: 'fp_1120a', timestamp: '2023-10-27 02:10:45', score: 78 },
  { id: 'ev-004', type: 'NEW', price: 590000, location: 'Bordeaux Centre', fingerprint: 'fp_3342b', timestamp: '2023-10-27 02:15:33', score: 88 },
];
