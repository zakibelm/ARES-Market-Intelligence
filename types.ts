
export enum AgentStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  BLOCKED = 'BLOCKED'
}

export interface RagFile {
  name: string;
  type: string;
  size: string;
}

export interface Agent {
  id: number | string;
  name: string;
  role: string;
  status: AgentStatus;
  model: string;
  systemPrompt: string;
  ragContext: string;
  ragFiles?: RagFile[];
  costEstimate?: number;
  logs: string[];
  lastPayload?: any;
}

export interface MarketEvent {
  id: string;
  type: 'NEW' | 'UPDATED' | 'REMOVED';
  price: number;
  previousPrice?: number;
  location: string;
  fingerprint: string;
  timestamp: string;
  score: number;
}

export type ViewType = 'DASHBOARD' | 'MARKET_HUNTER' | 'LEGAL_GATE' | 'AGENT_ORCHESTRATOR' | 'SETTINGS' | 'AGENT_CONFIG' | 'PRICING_INTEL' | 'QA_AUDIT';
