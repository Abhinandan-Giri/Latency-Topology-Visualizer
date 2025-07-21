// src/hooks/useLatencyData.ts
import { useState, useEffect, useCallback } from 'react';
import { LatencyConnection } from '@/types/latency';
import { exchangeMarkers } from '@/utils/exchangeData';

export const useLatencyData = () => {
  const [latencyData, setLatencyData] = useState<LatencyConnection[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate realistic latency data based on geographic distance
  const generateLatencyData = useCallback((): LatencyConnection[] => {
    const connections: LatencyConnection[] = [];
    
    for (let i = 0; i < exchangeMarkers.length; i++) {
      for (let j = i + 1; j < exchangeMarkers.length; j++) {
        const from = exchangeMarkers[i];
        const to = exchangeMarkers[j];
        
        // Calculate base latency from geographic distance
        const distance = calculateGeographicDistance(
          from.latitude, from.longitude,
          to.latitude, to.longitude
        );
        
        // Base latency: ~1ms per 100km + network overhead
        const baseLatency = Math.max(20, distance / 100);
        
        // Add random variation and network conditions
        const variation = (Math.random() - 0.5) * 40;
        const networkLoad = Math.random() * 30; // Simulate network congestion
        
        const latency = Math.max(10, baseLatency + variation + networkLoad);
        
        connections.push({
          fromId: from.id,
          toId: to.id,
          latencyMs: Math.round(latency),
          timestamp: Date.now()
        });
      }
    }
    
    return connections;
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    setIsConnected(true);
    
    const updateInterval = setInterval(() => {
      setLatencyData(generateLatencyData());
    }, 5000); // Update every 5 seconds

    // Initial data
    setLatencyData(generateLatencyData());

    return () => {
      clearInterval(updateInterval);
      setIsConnected(false);
    };
  }, [generateLatencyData]);

  return { latencyData, isConnected };
};

function calculateGeographicDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
}
