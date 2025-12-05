import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../core/stores';
import { getTranslation } from '../../core/translations';

interface MarketStallProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  stallType: 'fruits' | 'vegetables' | 'bread' | 'meat' | 'moreFruits';
  label?: string;
}

export function MarketStall({ 
  position, 
  rotation = [0, 0, 0], 
  stallType,
  label 
}: MarketStallProps) {
  const getStallColor = () => {
    switch (stallType) {
      case 'fruits': return '#ef4444';
      case 'vegetables': return '#22c55e';
      case 'bread': return '#f59e0b';
      case 'meat': return '#dc2626';
      default: return '#6366f1';
    }
  };

  const getAwningColor = () => {
    switch (stallType) {
      case 'fruits': return '#fca5a5';
      case 'vegetables': return '#86efac';
      case 'bread': return '#fcd34d';
      case 'meat': return '#fca5a5';
      default: return '#a5b4fc';
    }
  };

  return (
    <group position={position} rotation={rotation as unknown as THREE.Euler}>
      {/* Counter/Table */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>

      {/* Display items (simplified as colored boxes) */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[-1 + (i % 3) * 1, 1.15, -0.3 + Math.floor(i / 3) * 0.6]}
          castShadow
        >
          <boxGeometry args={[0.4, 0.3, 0.4]} />
          <meshStandardMaterial color={getStallColor()} />
        </mesh>
      ))}

      {/* Awning poles */}
      <mesh position={[-1.3, 1.5, 0.7]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      <mesh position={[1.3, 1.5, 0.7]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>

      {/* Awning */}
      <mesh position={[0, 2.5, 0.2]} castShadow>
        <boxGeometry args={[3.2, 0.1, 2]} />
        <meshStandardMaterial color={getAwningColor()} />
      </mesh>

      {/* Sign */}
      {label && (
        <Text
          position={[0, 2.8, 0.5]}
          fontSize={0.3}
          color="#1a1a2e"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

export function Ground() {
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#d4a574" />
    </mesh>
  );
}

export function MarketplaceEnvironment() {
  const { targetLanguage } = useGameStore();
  const t = getTranslation(targetLanguage.code);

  return (
    <group>
      {/* Ground */}
      <Ground />

      {/* Cobblestone path (simplified) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[6, 30]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      {/* Market stalls arranged in a U-shape */}
      <MarketStall 
        position={[-6, 0, -5]} 
        rotation={[0, Math.PI / 2, 0]} 
        stallType="fruits" 
        label={t.fruits}
      />
      <MarketStall 
        position={[-6, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        stallType="vegetables" 
        label={t.vegetables}
      />
      <MarketStall 
        position={[-6, 0, 5]} 
        rotation={[0, Math.PI / 2, 0]} 
        stallType="bread" 
        label={t.bakery}
      />

      <MarketStall 
        position={[6, 0, -5]} 
        rotation={[0, -Math.PI / 2, 0]} 
        stallType="meat" 
        label={t.butcher}
      />
      <MarketStall 
        position={[6, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        stallType="fruits" 
        label={t.moreFruits}
      />

      {/* Decorative elements */}
      {/* Fountain in center */}
      <mesh position={[0, 0.3, -8]} castShadow>
        <cylinderGeometry args={[1.5, 2, 0.6, 16]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[0, 0.8, -8]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* Ambient trees/decorations at edges */}
      {[
        [-12, 0, -12],
        [12, 0, -12],
        [-12, 0, 12],
        [12, 0, 12],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
            <meshStandardMaterial color="#5c4033" />
          </mesh>
          <mesh position={[0, 4, 0]} castShadow>
            <coneGeometry args={[2, 4, 8]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
