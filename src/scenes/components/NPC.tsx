import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface NPCProps {
  id: string;
  name: string;
  position: [number, number, number];
  color?: string;
  role: 'vendor' | 'teacher' | 'questgiver' | 'citizen';
  onInteract?: (id: string) => void;
  playerPosition?: THREE.Vector3;
}

export function NPC({ 
  id, 
  name, 
  position, 
  color = '#f59e0b', 
  role,
  onInteract,
  playerPosition 
}: NPCProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isNearby, setIsNearby] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current || !playerPosition) return;

    // Check distance to player
    const npcPos = new THREE.Vector3(...position);
    const distance = npcPos.distanceTo(playerPosition);
    setIsNearby(distance < 3);

    // Face towards player when nearby
    if (distance < 5) {
      const direction = new THREE.Vector3()
        .subVectors(playerPosition, npcPos)
        .normalize();
      const angle = Math.atan2(direction.x, direction.z);
      meshRef.current.rotation.y = angle;
    }
  });

  const handleClick = () => {
    if (isNearby && onInteract) {
      onInteract(id);
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'vendor': return '🛒';
      case 'teacher': return '📚';
      case 'questgiver': return '❗';
      default: return '💬';
    }
  };

  return (
    <group ref={meshRef} position={position}>
      {/* NPC Body */}
      <mesh 
        castShadow
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <capsuleGeometry args={[0.35, 0.7, 4, 8]} />
        <meshStandardMaterial 
          color={hovered ? '#fbbf24' : color} 
          emissive={isNearby ? color : '#000000'}
          emissiveIntensity={isNearby ? 0.3 : 0}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>

      {/* Name tag */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>

      {/* Role icon */}
      <Html position={[0, 1.8, 0]} center>
        <div style={{ fontSize: '24px' }}>{getRoleIcon()}</div>
      </Html>

      {/* Interaction prompt */}
      {isNearby && (
        <Html position={[0, 2.2, 0]} center>
          <div 
            style={{
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              border: '2px solid #4ade80',
            }}
          >
            Press E or Click to talk
          </div>
        </Html>
      )}
    </group>
  );
}
