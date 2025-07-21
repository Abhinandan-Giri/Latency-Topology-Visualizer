// src/components/Globe.tsx
'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import ExchangeMarker from './ExchangeMarker';
import LatencyLine from './LatencyLine';
import { exchangeMarkers } from '@/utils/exchangeData';
import { latLngToVec3 } from '@/utils/coordinates';
import { useLatencyData } from '@/hooks/useLatencyData';

const Globe: React.FC = () => {
  const { latencyData, isConnected } = useLatencyData();
  
  const markerPositions = useMemo(
    () => Object.fromEntries(
      exchangeMarkers.map((m) => [m.id, latLngToVec3(m.latitude, m.longitude)])
    ),
    []
  );

  return (
    <div className="relative h-full w-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} />

        {/* Globe Sphere */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial 
            color="#1a365d" 
            roughness={0.3}
            metalness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Exchange Markers */}
        {exchangeMarkers.map((marker) => (
          <ExchangeMarker
            key={marker.id}
            position={latLngToVec3(marker.latitude, marker.longitude)}
            marker={marker}
          />
        ))}

        {/* Latency Lines */}
        {latencyData.map((connection) => {
          const from = markerPositions[connection.fromId];
          const to = markerPositions[connection.toId];
          
          if (!from || !to) return null;
          
          return (
            <LatencyLine
              key={`${connection.fromId}-${connection.toId}`}
              from={from}
              to={to}
              latencyMs={connection.latencyMs}
            />
          );
        })}

        {/* Background Stars */}
        <Stars radius={50} depth={50} count={3000} factor={4} fade />

        {/* Camera Controls */}
        <OrbitControls 
          enableZoom 
          enablePan 
          enableRotate
          minDistance={3}
          maxDistance={10}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Connection Status Indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {isConnected ? 'Live Data' : 'Disconnected'}
        </div>
      </div>
    </div>
  );
};

export default Globe;
