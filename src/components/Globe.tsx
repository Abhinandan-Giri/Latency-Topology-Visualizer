// src/components/Globe.tsx
'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import ExchangeMarker from './ExchangeMarker';
import LatencyLine from './LatencyLine';
import { exchangeMarkers } from '@/utils/exchangeData';
import { latLngToVec3 } from '@/utils/coordinates';
import { useLatencyData } from '@/hooks/useLatencyData';

interface GlobeProps {
  filteredProviders: string[];
  latencyRange: [number, number];
  searchQuery: string;
  enabledLayers: {
    realtime: boolean;
    regions: boolean;
    heatmap: boolean;
  };
}

const Globe: React.FC<GlobeProps> = ({
  filteredProviders,
  latencyRange,
  searchQuery,
  enabledLayers
}) => {
  const { latencyData, isConnected } = useLatencyData();
  
  // Load Earth texture
  const earthTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/earth-texture.jpg');
  }, []);

  const markerPositions = useMemo(
    () => Object.fromEntries(
      exchangeMarkers.map((m) => [m.id, latLngToVec3(m.latitude, m.longitude)])
    ),
    []
  );

  // Filter markers based on search query and providers
  const filteredMarkers = useMemo(() => {
    return exchangeMarkers.filter(marker => {
      const matchesSearch = searchQuery 
        ? marker.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesProvider = filteredProviders.includes(marker.cloudProvider);
      return matchesSearch && matchesProvider;
    });
  }, [searchQuery, filteredProviders]);

  // Filter latency connections based on range and enabled layers
  const filteredLatencyData = useMemo(() => {
    if (!enabledLayers.realtime) return [];
    
    return latencyData.filter(connection => {
      const withinRange = connection.latencyMs >= latencyRange[0] && 
                         connection.latencyMs <= latencyRange[1];
      
      // Check if both endpoints are in filtered markers
      const fromMarker = exchangeMarkers.find(m => m.id === connection.fromId);
      const toMarker = exchangeMarkers.find(m => m.id === connection.toId);
      
      const endpointsVisible = fromMarker && toMarker &&
        filteredProviders.includes(fromMarker.cloudProvider) &&
        filteredProviders.includes(toMarker.cloudProvider);
      
      return withinRange && endpointsVisible;
    });
  }, [latencyData, latencyRange, filteredProviders, enabledLayers.realtime]);

  return (
    <div className="relative h-full w-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4fc3f7" />

        {/* Globe Sphere */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            map={earthTexture}
            roughness={0.6}
            metalness={0.4}
            envMapIntensity={0.8}
          />
        </mesh>

        {/* Atmosphere glow effect */}
        <mesh scale={[2.1, 2.1, 2.1]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial
            color="#4fc3f7"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Exchange Markers */}
        {filteredMarkers.map((marker) => (
          <ExchangeMarker
            key={marker.id}
            position={latLngToVec3(marker.latitude, marker.longitude)}
            marker={marker}
          />
        ))}

        {/* Latency Lines */}
        {filteredLatencyData.map((connection) => {
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
        <Stars radius={100} depth={50} count={5000} factor={4} fade />

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

    </div>
  );
};

export default Globe;
