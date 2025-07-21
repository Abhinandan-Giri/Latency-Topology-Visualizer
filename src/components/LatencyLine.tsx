// src/components/LatencyLine.tsx
'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LatencyLineProps {
  from: [number, number, number];
  to: [number, number, number];
  latencyMs: number;
}

const getLatencyColor = (latency: number): string => {
  if (latency < 50) return '#10b981'; // Green - good
  if (latency < 100) return '#f59e0b'; // Yellow - medium
  return '#ef4444'; // Red - high
};

const LatencyLine: React.FC<LatencyLineProps> = ({ from, to, latencyMs }) => {
  const lineRef = useRef<THREE.Line>(null);
  
  const points = useMemo(() => {
    // Create curved path for more realistic network routing
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    
    // Add curve height based on distance
    const distance = start.distanceTo(end);
    const curveHeight = Math.max(0.5, distance * 0.3);
    mid.normalize().multiplyScalar(2 + curveHeight);
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(50);
  }, [from, to]);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: getLatencyColor(latencyMs),
      linewidth: 2,
      transparent: true,
      opacity: 0.7
    });
  }, [latencyMs]);

  // Animate line opacity based on data flow
  useFrame((state) => {
    if (lineRef.current?.material) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.8;
      material.opacity = pulse * 0.7;
    }
  });

  return (
    <line ref={lineRef} geometry={geometry} material={material} />
  );
};

export default LatencyLine;
