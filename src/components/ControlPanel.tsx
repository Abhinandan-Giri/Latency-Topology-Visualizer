// src/components/ControlPanel.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface ControlPanelProps {
  onProviderFilter: (providers: string[]) => void;
  onLatencyFilter: (range: [number, number]) => void;
  onExchangeSearch: (query: string) => void;
  onToggleLayer: (layer: string, enabled: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onProviderFilter,
  onLatencyFilter,
  onExchangeSearch,
  onToggleLayer
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['AWS', 'GCP', 'Azure']);
  const [latencyRange, setLatencyRange] = useState<[number, number]>([0, 500]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProviderToggle = (provider: string) => {
    const updated = selectedProviders.includes(provider)
      ? selectedProviders.filter(p => p !== provider)
      : [...selectedProviders, provider];
    
    setSelectedProviders(updated);
    onProviderFilter(updated);
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-80 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-gray-900 flex items-center">
          <FunnelIcon className="w-5 h-5 mr-2" />
          Controls
        </h3>
        <ChevronDownIcon 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Exchanges
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onExchangeSearch(e.target.value);
              }}
              placeholder="Type exchange name..."
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cloud Provider Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cloud Providers
            </label>
            <div className="space-y-2">
              {['AWS', 'GCP', 'Azure'].map(provider => (
                <label key={provider} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProviders.includes(provider)}
                    onChange={() => handleProviderToggle(provider)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`ml-2 text-sm ${
                    provider === 'AWS' ? 'text-orange-600' :
                    provider === 'GCP' ? 'text-blue-600' :
                    'text-cyan-600'
                  }`}>
                    {provider}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Latency Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latency Range (ms): {latencyRange[0]} - {latencyRange[1]}
            </label>
            <div className="flex space-x-2">
              <input
                type="range"
                min={0}
                max={500}
                value={latencyRange[1]}
                onChange={(e) => {
                  const newRange: [number, number] = [latencyRange[0], parseInt(e.target.value)];
                  setLatencyRange(newRange);
                  onLatencyFilter(newRange);
                }}
                className="flex-1"
              />
            </div>
          </div>

          {/* Layer Toggles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visualization Layers
            </label>
            <div className="space-y-2">
              {[
                { key: 'realtime', label: 'Real-time Connections' },
                { key: 'regions', label: 'Cloud Regions' },
                { key: 'heatmap', label: 'Latency Heatmap' }
              ].map(layer => (
                <label key={layer.key} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    onChange={(e) => onToggleLayer(layer.key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {layer.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
