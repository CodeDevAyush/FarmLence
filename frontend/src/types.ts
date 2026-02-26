
export enum Tab {
  HOME = 'home',
  HISTORY = 'history',
  NETWORK = 'network',
  SETTINGS = 'settings'
}

export interface ScanResult {
  id: string;
  timestamp: number;
  image: string;
  cropName: string;
  diseaseName: string;
  scientificName?: string;
  confidence: number;
  treatment: string;
  safety: string;
  estimatedCost: string;
  sustainabilityTip: string;
  proTip: string;
  hasIssue: boolean;
}

export interface AppSettings {
  darkMode: boolean;
  confidenceThreshold: number;
  autoSaveHistory: boolean;
}

export interface NetworkStatus {
  isConnected: boolean;
  modelReady: boolean;
  latency: number | null;
  lastChecked: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface ChatContext {
  crop: string;
  disease: string;
  confidence: number;
  treatment: string;
  safety: string;
  cost_option: string;
  sustainability: string;
}
