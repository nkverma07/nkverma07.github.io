import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AnimatedCharacterProps {
  position: [number, number, number];
  isMoving?: boolean;
  isBoosting?: boolean;
  rotation?: number;
}

// Animation states
type AnimationState = 'idle' | 'walk' | 'run';

export default function AnimatedCharacter({ 
  position, 
  isMoving = false, 
  isBoosting = false,
  rotation = 0 
}: AnimatedCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Character body parts for animation
  const headRef = useRef<THREE.Mesh>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  
  // Animation state
  const animationRef = useRef({ 
    time: 0,
    walkCycle: 0,
    currentState: 'idle' as AnimationState
  });

  // Update animation state based on movement
  useEffect(() => {
    if (isBoosting) {
      animationRef.current.currentState = 'run';
    } else if (isMoving) {
      animationRef.current.currentState = 'walk';
    } else {
      animationRef.current.currentState = 'idle';
    }
  }, [isMoving, isBoosting]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    
    animationRef.current.time += delta;
    const time = animationRef.current.time;
    
    // Update character rotation
    groupRef.current.rotation.y = rotation;
    
    // Get animation parameters based on state
    const state = animationRef.current.currentState;
    let walkSpeed = 0;
    let armSwing = 0;
    let legSwing = 0;
    let bobAmount = 0;
    
    switch (state) {
      case 'idle':
        // Gentle breathing animation
        if (torsoRef.current) {
          torsoRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02;
        }
        if (headRef.current) {
          headRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
          headRef.current.position.y = 1.6 + Math.sin(time * 2) * 0.02;
        }
        // Subtle arm movement
        if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(time) * 0.1;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(time) * 0.1;
        break;
        
      case 'walk':
        walkSpeed = 6;
        armSwing = 0.4;
        legSwing = 0.6;
        bobAmount = 0.05;
        break;
        
      case 'run':
        walkSpeed = 10;
        armSwing = 0.8;
        legSwing = 1.0;
        bobAmount = 0.1;
        break;
    }
    
    // Walking/Running animation
    if (state !== 'idle') {
      animationRef.current.walkCycle = Math.sin(time * walkSpeed);
      
      // Leg animation
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = animationRef.current.walkCycle * legSwing;
        rightLegRef.current.rotation.x = -animationRef.current.walkCycle * legSwing;
      }
      
      // Arm animation (opposite of legs)
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -animationRef.current.walkCycle * armSwing;
        rightArmRef.current.rotation.x = animationRef.current.walkCycle * armSwing;
      }
      
      // Head bob
      if (headRef.current) {
        headRef.current.position.y = 1.6 + Math.abs(Math.sin(time * walkSpeed)) * bobAmount;
        headRef.current.rotation.z = animationRef.current.walkCycle * 0.05;
      }
      
      // Torso bob and lean
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.9 + Math.abs(Math.sin(time * walkSpeed)) * bobAmount * 0.5;
        torsoRef.current.rotation.z = animationRef.current.walkCycle * 0.03;
      }
    }
  });

  // Character colors (anime style)
  const skinColor = '#ffd1a3';
  const hairColor = '#2a2a2a';
  const shirtColor = isBoosting ? '#ff4444' : '#4466ff';
  const pantsColor = '#333333';
  const shoeColor = '#1a1a1a';
  const eyeColor = isBoosting ? '#ff0000' : '#0066ff';

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
        
        {/* Eyes */}
        <mesh position={[-0.08, 0.05, 0.15]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={isBoosting ? 0.8 : 0.2} />
        </mesh>
        <mesh position={[0.08, 0.05, 0.15]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={isBoosting ? 0.8 : 0.2} />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.22, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
        
        {/* Hair spikes */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh 
              key={i}
              position={[
                Math.cos(angle) * 0.15,
                0.2 + Math.random() * 0.1,
                Math.sin(angle) * 0.15
              ]}
              rotation={[0, angle, Math.PI / 6]}
            >
              <coneGeometry args={[0.03, 0.15, 8]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          );
        })}
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Torso */}
      <mesh ref={torsoRef} position={[0, 0.9, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.25]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      
      {/* Left Arm */}
      <group position={[-0.25, 1.15, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.25, 0]}>
          {/* Upper arm */}
          <cylinderGeometry args={[0.06, 0.06, 0.35, 16]} />
          <meshStandardMaterial color={shirtColor} />
          
          {/* Lower arm (hand) */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group position={[0.25, 1.15, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.25, 0]}>
          {/* Upper arm */}
          <cylinderGeometry args={[0.06, 0.06, 0.35, 16]} />
          <meshStandardMaterial color={shirtColor} />
          
          {/* Lower arm (hand) */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </mesh>
      </group>
      
      {/* Left Leg */}
      <group position={[-0.12, 0.6, 0]}>
        <mesh ref={leftLegRef} position={[0, -0.3, 0]}>
          {/* Upper leg */}
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color={pantsColor} />
          
          {/* Lower leg */}
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.4, 16]} />
            <meshStandardMaterial color={pantsColor} />
            
            {/* Shoe */}
            <mesh position={[0, -0.25, 0.05]}>
              <boxGeometry args={[0.12, 0.1, 0.2]} />
              <meshStandardMaterial color={shoeColor} />
            </mesh>
          </mesh>
        </mesh>
      </group>
      
      {/* Right Leg */}
      <group position={[0.12, 0.6, 0]}>
        <mesh ref={rightLegRef} position={[0, -0.3, 0]}>
          {/* Upper leg */}
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color={pantsColor} />
          
          {/* Lower leg */}
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.4, 16]} />
            <meshStandardMaterial color={pantsColor} />
            
            {/* Shoe */}
            <mesh position={[0, -0.25, 0.05]}>
              <boxGeometry args={[0.12, 0.1, 0.2]} />
              <meshStandardMaterial color={shoeColor} />
            </mesh>
          </mesh>
        </mesh>
      </group>
      
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
      
      {/* Boost effects */}
      {isBoosting && (
        <>
          {/* Aura */}
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshBasicMaterial 
              color={shirtColor} 
              transparent 
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>
          
          {/* Speed lines particles */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return (
              <mesh 
                key={i}
                position={[
                  Math.cos(angle) * 0.8,
                  0.9 + Math.sin((i / 12) * Math.PI * 2) * 0.3,
                  Math.sin(angle) * 0.8
                ]}
              >
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial 
                  color={i % 2 === 0 ? '#ff4444' : '#ffaa00'}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            );
          })}
        </>
      )}
      
      {/* Point lights for eyes when boosting */}
      {isBoosting && (
        <>
          <pointLight position={[-0.08, 1.65, 0.3]} intensity={0.5} color={eyeColor} distance={2} />
          <pointLight position={[0.08, 1.65, 0.3]} intensity={0.5} color={eyeColor} distance={2} />
        </>
      )}
    </group>
  );
}
