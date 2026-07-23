import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import AnimatedCharacter from "./AnimatedCharacter";
import { useState } from "react";

export default function AvatarScene() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#4466ff" />
        
        <AnimatedCharacter 
          position={[0, 0, 0]} 
          isMoving={isAnimating}
          isBoosting={isBoosting}
          rotation={0}
        />
        
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />
        
        <Environment preset="sunset" />
        <OrbitControls 
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Control buttons */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 10
      }}>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: isAnimating ? '#4466ff' : '#333',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isAnimating ? '⏸ Stop' : '▶ Walk'}
        </button>
        <button
          onClick={() => setIsBoosting(!isBoosting)}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: isBoosting ? '#ff4444' : '#333',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isBoosting ? '🔥 Boost ON' : '⚡ Boost'}
        </button>
      </div>
    </div>
  );
}
