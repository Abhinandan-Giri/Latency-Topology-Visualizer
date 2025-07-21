// src/app/page.tsx
'use client';

import React, { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ControlPanel from '@/components/ControlPanel';
import LatencyChart from '@/components/LatencyChart';
import { useLatencyData } from '@/hooks/useLatencyData';

// Dynamically import heavy 3D components for better performance
const Globe = dynamic(() => import('@/components/Globe'), {
  ssr: false,
  loading: () => <LoadingSpinner message="Loading 3D Visualization..." />
});

export default function Home() {
  const { latencyData, isConnected } = useLatencyData();
  const [showChart, setShowChart] = useState(false);
  const [filteredProviders, setFilteredProviders] = useState<string[]>(['AWS', 'GCP', 'Azure']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative z-20 px-6 py-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Latency Topology Visualizer
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowChart(!showChart)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </button>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConnected 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {isConnected ? '● Live' : '● Offline'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative h-screen overflow-hidden">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner message="Initializing 3D Globe..." />}>
            <Globe />
          </Suspense>
        </ErrorBoundary>

        {/* Control Panel */}
        <ControlPanel
          onProviderFilter={setFilteredProviders}
          onLatencyFilter={(range) => console.log('Latency filter:', range)}
          onExchangeSearch={(query) => console.log('Search:', query)}
          onToggleLayer={(layer, enabled) => console.log('Toggle layer:', layer, enabled)}
        />

        {/* Historical Chart Panel */}
        {showChart && (
          <div className="absolute bottom-4 right-4 w-96 max-w-[90vw]">
            <LatencyChart 
              data={[
                { timestamp: new Date(Date.now() - 3600000).toISOString(), latencyMs: 45 },
                { timestamp: new Date(Date.now() - 1800000).toISOString(), latencyMs: 67 },
                { timestamp: new Date().toISOString(), latencyMs: 52 }
              ]}
              title="Exchange Latency Trends"
            />
          </div>
        )}
      </main>
    </div>
  );
}
