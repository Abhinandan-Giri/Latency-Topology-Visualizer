// src/components/LatencyChart.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LatencyDataPoint } from '@/types/latency';

interface LatencyChartProps {
  data: LatencyDataPoint[];
  title?: string;
}

const LatencyChart: React.FC<LatencyChartProps> = ({ data, title = "Historical Latency" }) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const filteredData = useMemo(() => {
    const now = Date.now();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - ranges[timeRange];
    return data.filter(point => new Date(point.timestamp).getTime() > cutoff);
  }, [data, timeRange]);

  const statistics = useMemo(() => {
    if (filteredData.length === 0) return { min: 0, max: 0, avg: 0 };

    const latencies = filteredData.map(d => d.latencyMs);
    return {
      min: Math.min(...latencies),
      max: Math.max(...latencies),
      avg: Math.round(latencies.reduce((sum, val) => sum + val, 0) / latencies.length)
    };
  }, [filteredData]);

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        
        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['1h', '24h', '7d', '30d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500">Min</div>
          <div className="text-lg font-semibold text-green-600">{statistics.min}ms</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Avg</div>
          <div className="text-lg font-semibold text-blue-600">{statistics.avg}ms</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Max</div>
          <div className="text-lg font-semibold text-red-600">{statistics.max}ms</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']}
              tick={{ fontSize: 12 }}
              label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number) => [`${value}ms`, 'Latency']}
            />
            <Line 
              type="monotone" 
              dataKey="latencyMs" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LatencyChart;
