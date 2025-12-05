import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { NPC, MarketplaceEnvironment } from './components';
import { useDialogueStore } from '../features/dialogue/dialogueStore';
import { playSound } from '../features/audio';

// NPC positions for collision detection
const NPC_POSITIONS = [
  { id: 'vendor-maria', position: new THREE.Vector3(-4.5, 0.5, -5) },
  { id: 'vendor-carlos', position: new THREE.Vector3(-4.5, 0.5, 0) },
  { id: 'teacher-elena', position: new THREE.Vector3(0, 0.5, -6) },
];

const COLLISION_RADIUS = 1.2; // Distance to stop from NPCs
const INTERACTION_RADIUS = 3; // Distance to interact with NPCs

// Player controller with keyboard input
function PlayerController({ 
  onPositionChange,
  onNearNpc,
}: { 
  onPositionChange: (pos: THREE.Vector3) => void;
  onNearNpc: (npcId: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const lastFootstepTime = useRef(0);
  
  const isDialogueActive = useDialogueStore((state) => state.isActive);
  const speed = 5;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || isDialogueActive) return;

    const keys = keysRef.current;
    const velocity = new THREE.Vector3();

    if (keys.forward) velocity.z -= 1;
    if (keys.backward) velocity.z += 1;
    if (keys.left) velocity.x -= 1;
    if (keys.right) velocity.x += 1;

    if (velocity.length() > 0) {
      velocity.normalize().multiplyScalar(speed * delta);
      
      // Calculate new position
      const newPosition = meshRef.current.position.clone().add(velocity);
      
      // Check collision with NPCs
      let canMove = true;
      for (const npc of NPC_POSITIONS) {
        const distance = new THREE.Vector2(
          newPosition.x - npc.position.x,
          newPosition.z - npc.position.z
        ).length();
        
        if (distance < COLLISION_RADIUS) {
          canMove = false;
          break;
        }
      }
      
      // Check collision with market stalls (simplified bounding boxes)
      const stallBounds = [
        { minX: -7.5, maxX: -4.5, minZ: -6.5, maxZ: -3.5 }, // Fruits stall
        { minX: -7.5, maxX: -4.5, minZ: -1.5, maxZ: 1.5 },  // Vegetables stall
        { minX: -7.5, maxX: -4.5, minZ: 3.5, maxZ: 6.5 },   // Bread stall
        { minX: 4.5, maxX: 7.5, minZ: -6.5, maxZ: -3.5 },   // Meat stall
        { minX: 4.5, maxX: 7.5, minZ: -1.5, maxZ: 1.5 },    // More fruits stall
      ];
      
      for (const stall of stallBounds) {
        if (newPosition.x > stall.minX && newPosition.x < stall.maxX &&
            newPosition.z > stall.minZ && newPosition.z < stall.maxZ) {
          canMove = false;
          break;
        }
      }
      
      if (canMove) {
        meshRef.current.position.copy(newPosition);
        
        // Face movement direction
        const angle = Math.atan2(velocity.x, velocity.z);
        meshRef.current.rotation.y = angle;
        
        // Play footstep sound occasionally
        const now = state.clock.elapsedTime;
        if (now - lastFootstepTime.current > 0.35) {
          playSound('footstep');
          lastFootstepTime.current = now;
        }
      }
    }

    // Keep in bounds
    meshRef.current.position.x = THREE.MathUtils.clamp(meshRef.current.position.x, -15, 15);
    meshRef.current.position.z = THREE.MathUtils.clamp(meshRef.current.position.z, -15, 15);
    meshRef.current.position.y = 0.5;

    // Check which NPC is nearby
    let nearestNpc: string | null = null;
    let nearestDistance = INTERACTION_RADIUS;
    
    for (const npc of NPC_POSITIONS) {
      const distance = meshRef.current.position.distanceTo(npc.position);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestNpc = npc.id;
      }
    }
    
    onNearNpc(nearestNpc);
    onPositionChange(meshRef.current.position.clone());
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 8]} castShadow>
      <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
      <meshStandardMaterial color="#4ade80" />
      <mesh position={[0, 0.2, -0.4]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </mesh>
  );
}

// Camera that follows player
function FollowCamera({ target }: { target: THREE.Vector3 }) {
  const { camera } = useThree();
  
  useFrame(() => {
    const targetPosition = new THREE.Vector3(
      target.x,
      target.y + 8,
      target.z + 10
    );
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(target);
  });

  return null;
}

// Main marketplace scene
function MarketplaceContent() {
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0.5, 8));
  const [nearbyNpcId, setNearbyNpcId] = useState<string | null>(null);
  const { initDialogue, isActive: isDialogueActive } = useDialogueStore();

  const handleNpcInteract = useCallback((npcId: string) => {
    console.log('handleNpcInteract called with:', npcId);
    playSound('npc-talk');
    initDialogue('market-vendor-fruits', npcId);
  }, [initDialogue]);

  // Handle E key for interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && nearbyNpcId && !isDialogueActive) {
        handleNpcInteract(nearbyNpcId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearbyNpcId, isDialogueActive, handleNpcInteract]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Sky */}
      <Sky sunPosition={[100, 20, 100]} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 10, 15]} fov={60} />
      <FollowCamera target={playerPosition} />

      {/* Environment */}
      <MarketplaceEnvironment />

      {/* Player */}
      <PlayerController 
        onPositionChange={setPlayerPosition} 
        onNearNpc={setNearbyNpcId}
      />

      {/* NPCs */}
      <NPC
        id="vendor-maria"
        name="María"
        position={[-4.5, 0.5, -5]}
        role="vendor"
        color="#f59e0b"
        onInteract={handleNpcInteract}
        playerPosition={playerPosition}
      />
      <NPC
        id="vendor-carlos"
        name="Carlos"
        position={[-4.5, 0.5, 0]}
        role="vendor"
        color="#3b82f6"
        onInteract={handleNpcInteract}
        playerPosition={playerPosition}
      />
      <NPC
        id="teacher-elena"
        name="Profesora Elena"
        position={[0, 0.5, -6]}
        role="teacher"
        color="#8b5cf6"
        onInteract={handleNpcInteract}
        playerPosition={playerPosition}
      />
    </>
  );
}

export function MarketplaceScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDialogueActive = useDialogueStore((state) => state.isActive);
  
  // Auto-focus canvas when dialogue closes
  useEffect(() => {
    if (!isDialogueActive && canvasRef.current) {
      // Small delay to ensure dialogue UI is fully closed
      const timer = setTimeout(() => {
        canvasRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDialogueActive]);
  
  // Auto-focus canvas on click
  const handleCanvasClick = useCallback(() => {
    canvasRef.current?.focus();
  }, []);

  return (
    <Canvas 
      shadows 
      tabIndex={0}
      ref={canvasRef}
      onClick={handleCanvasClick}
      onPointerDown={handleCanvasClick}
      style={{ outline: 'none' }}
    >
      <MarketplaceContent />
    </Canvas>
  );
}
