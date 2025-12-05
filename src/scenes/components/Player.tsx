import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerProps {
  position?: [number, number, number];
}

export function Player({ position = [0, 0.5, 5] }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(new THREE.Vector3());
  
  const friction = 0.9;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Apply friction
    velocityRef.current.multiplyScalar(friction);

    // Update position
    meshRef.current.position.add(velocityRef.current.clone().multiplyScalar(delta));

    // Keep player on ground
    meshRef.current.position.y = 0.5;

    // Clamp to play area
    meshRef.current.position.x = THREE.MathUtils.clamp(meshRef.current.position.x, -15, 15);
    meshRef.current.position.z = THREE.MathUtils.clamp(meshRef.current.position.z, -15, 15);
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {/* Simple capsule-like player */}
      <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
      <meshStandardMaterial color="#4ade80" />
      
      {/* Direction indicator */}
      <mesh position={[0, 0.2, -0.4]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </mesh>
  );
}
