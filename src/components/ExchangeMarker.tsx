// src/components/ExchangeMarker.tsx
'use client';

import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ExchangeMarker as ExchangeMarkerType } from '@/types/exchange';

interface ExchangeMarkerProps {
  position: [number, number, number];
  marker: ExchangeMarkerType;
}

const getProviderColor = (provider: string): string => {
  switch (provider) {
    case 'AWS': return '#ff9900';
    case 'GCP': return '#4285f4';
    case 'Azure': return '#0078d4';
    default: return '#666666';
  }
};

const ExchangeMarker: React.FC<ExchangeMarkerProps> = ({ position, marker }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial 
        color={getProviderColor(marker.cloudProvider)}
        emissive={getProviderColor(marker.cloudProvider)}
        emissiveIntensity={hovered ? 0.3 : 0.1}
      />
      
      {hovered && (
        <Html center>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]">
            <h3 className="font-bold text-gray-900 mb-1">{marker.name}</h3>
            <p className="text-sm text-gray-600">{marker.region}</p>
            <p className="text-sm text-gray-600">{marker.cloudProvider}</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
              marker.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : marker.status === 'maintenance'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {marker.status}
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
};

export default ExchangeMarker;
