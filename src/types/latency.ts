// src/types/latency.ts
export interface LatencyConnection {
  fromId: string;
  toId: string;
  latencyMs: number;
  timestamp: number;
}

export interface LatencyDataPoint {
  timestamp: string;
  latencyMs: number;
}
