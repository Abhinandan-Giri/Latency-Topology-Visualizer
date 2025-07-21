// src/types/exchange.ts
export interface ExchangeMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cloudProvider: 'AWS' | 'GCP' | 'Azure';
  region: string;
  status: 'active' | 'maintenance' | 'offline';
}

