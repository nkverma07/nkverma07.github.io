import { useRef, useState, useEffect, useMemo, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Sky, 
  Html, 
  Cloud,
  Environment,
  PerspectiveCamera,
  Text
} from '@react-three/drei'
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  Chip, 
  Stack, 
  Button,
  Fade,
  Divider,
  CircularProgress
} from '@mui/material'
import { 
  Close, 
  School, 
  Work, 
  EmojiEvents, 
  Code, 
  CardMembership,
  Speed,
  MyLocation,
  GitHub,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material'
import * as THREE from 'three'
import { useTheme } from '@mui/material/styles'
import { portfolioData } from '../data/portfolioData'
import AnimatedCharacter from './AnimatedCharacter'

// Device detection utility
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768
}

// Performance levels based on device
const getPerformanceLevel = () => {
  if (isMobile()) {
    return 'low' // Mobile devices
  } else if (window.innerWidth < 1280) {
    return 'medium' // Tablets/small laptops
  }
  return 'high' // Desktop
}

// Structure types
interface Structure {
  id: string
  type: 'house' | 'tree' | 'rock' | 'fence' | 'well' | 'barn' | 'playground' | 'contact' | 'github' | 'stats'
  position: [number, number, number]
  rotation?: number
  scale?: number
  color?: string
  roofColor?: string
  label?: string
  icon?: any
  content?: any
  houseStyle?: 'modern' | 'cottage' | 'villa' | 'college' | 'tech-lab' | 'design-studio'
}

// Animal NPC
interface Animal {
  id: string
  type: 'chicken' | 'bird' | 'rabbit'
  position: THREE.Vector3
  velocity: THREE.Vector3
  targetPosition: THREE.Vector3
  wanderTimer: number
}

// Human NPC
interface Villager {
  id: string
  name: string
  role: string
  position: THREE.Vector3
  rotation: number
  path: [number, number, number][]
  pathIndex: number
  color: string
}

// Avatar Controller with Mobile Support and Physics
function AvatarController({ 
  position, 
  onPositionUpdate,
  mobileControls,
  structures,
  trees,
  rocks
}: { 
  position: [number, number, number]
  onPositionUpdate: (pos: THREE.Vector3, speed: number) => void
  mobileControls?: { forward: boolean; backward: boolean; left: boolean; right: boolean }
  structures: Structure[]
  trees: Structure[]
  rocks: Structure[]
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const { camera } = useThree()
  
  const velocity = useRef(new THREE.Vector3())
  const rotation = useRef(0)
  const verticalVelocity = useRef(0)
  
  // Enhanced physics constants
  const maxSpeed = 0.4
  const accelerationForce = 0.02
  const friction = 0.88
  const rotationSpeed = 0.08
  const gravity = -0.015
  const jumpForce = 0.3
  const groundLevel = position[1]
  
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
    jump: false
  })

  // Sync mobile controls with keys
  useEffect(() => {
    if (mobileControls) {
      keys.current.forward = mobileControls.forward
      keys.current.backward = mobileControls.backward
      keys.current.left = mobileControls.left
      keys.current.right = mobileControls.right
    }
  }, [mobileControls])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': keys.current.forward = true; break
        case 's': case 'arrowdown': keys.current.backward = true; break
        case 'a': case 'arrowleft': keys.current.left = true; break
        case 'd': case 'arrowright': keys.current.right = true; break
        case 'shift': keys.current.boost = true; break
        case ' ': 
          if (Math.abs(groupRef.current?.position.y - groundLevel) < 0.1) {
            keys.current.jump = true
            verticalVelocity.current = jumpForce
          }
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': keys.current.forward = false; break
        case 's': case 'arrowdown': keys.current.backward = false; break
        case 'a': case 'arrowleft': keys.current.left = false; break
        case 'd': case 'arrowright': keys.current.right = false; break
        case 'shift': keys.current.boost = false; break
        case ' ': keys.current.jump = false; break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    if (!groupRef.current) return

    // Rotation with smooth interpolation
    if (keys.current.left) rotation.current += rotationSpeed
    if (keys.current.right) rotation.current -= rotationSpeed

    // Enhanced movement with physics
    const speedMultiplier = keys.current.boost ? 1.8 : 1.0
    if (keys.current.forward) {
      velocity.current.x += Math.sin(rotation.current) * accelerationForce * speedMultiplier
      velocity.current.z += Math.cos(rotation.current) * accelerationForce * speedMultiplier
    }
    if (keys.current.backward) {
      velocity.current.x -= Math.sin(rotation.current) * accelerationForce * 0.6
      velocity.current.z -= Math.cos(rotation.current) * accelerationForce * 0.6
    }

    // Apply friction
    velocity.current.multiplyScalar(friction)
    const currentSpeed = velocity.current.length()
    
    // Speed limit
    if (currentSpeed > maxSpeed * speedMultiplier) {
      velocity.current.normalize().multiplyScalar(maxSpeed * speedMultiplier)
    }

    // Apply horizontal velocity
    groupRef.current.position.add(velocity.current)

    // Collision detection with all objects
    const characterRadius = 1.2 // Character collision radius
    const allCollidables = [
      ...structures.map(s => ({ ...s, radius: getCollisionRadius(s.type) })),
      ...trees.map(t => ({ ...t, radius: 1.5 })), // Tree trunk collision
      ...rocks.map(r => ({ ...r, radius: (r.scale || 1) * 1.2 })) // Rock collision based on scale
    ]
    
    allCollidables.forEach(obj => {
      const objPos = new THREE.Vector3(...obj.position)
      const distance = groupRef.current.position.distanceTo(objPos)
      
      if (distance < obj.radius + characterRadius) {
        // Push character away from object
        const pushDirection = groupRef.current.position.clone()
          .sub(objPos)
          .normalize()
        
        // Don't divide by zero
        if (pushDirection.length() > 0) {
          groupRef.current.position.copy(
            objPos.clone().add(
              pushDirection.multiplyScalar(obj.radius + characterRadius)
            )
          )
          
          // Reduce velocity on collision
          velocity.current.multiplyScalar(0.2)
        }
      }
    })
    
    // Helper function to get collision radius by type
    function getCollisionRadius(type: string): number {
      switch(type) {
        case 'house': return 5
        case 'contact': return 6
        case 'well': return 2
        case 'barn': return 7
        case 'playground': return 8
        case 'github': return 4
        case 'stats': return 4
        default: return 3
      }
    }

    // Apply gravity
    verticalVelocity.current += gravity
    groupRef.current.position.y += verticalVelocity.current

    // Ground collision
    if (groupRef.current.position.y <= groundLevel) {
      groupRef.current.position.y = groundLevel
      verticalVelocity.current = 0
      keys.current.jump = false
    }

    // Boundary limits with smooth bounce
    const distFromCenter = Math.sqrt(
      groupRef.current.position.x * groupRef.current.position.x +
      groupRef.current.position.z * groupRef.current.position.z
    )
    if (distFromCenter > 82) {
      const angle = Math.atan2(groupRef.current.position.z, groupRef.current.position.x)
      groupRef.current.position.x = Math.cos(angle) * 82
      groupRef.current.position.z = Math.sin(angle) * 82
      // Bounce back
      velocity.current.multiplyScalar(-0.5)
    }

    const cameraOffset = new THREE.Vector3(0, 3, -6)
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current)
    camera.position.lerp(
      new THREE.Vector3(
        groupRef.current.position.x + cameraOffset.x,
        groupRef.current.position.y + cameraOffset.y,
        groupRef.current.position.z + cameraOffset.z
      ),
      0.1
    )
    camera.lookAt(groupRef.current.position)

    onPositionUpdate(groupRef.current.position, currentSpeed)
  })

  return (
    <group ref={groupRef} position={position}>
      <AnimatedCharacter
        position={[0, 0, 0]}
        rotation={rotation.current}
        isMoving={keys.current.forward || keys.current.backward}
        isBoosting={keys.current.boost}
      />
    </group>
  )
}

// Cached shared geometries and materials for better performance
// (Currently not in use but available for optimization)

// Animated Chicken with memoization
const Chicken = memo(({ position: initialPos }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Group>(null)
  const [animal] = useState<Animal>({
    id: 'chicken',
    type: 'chicken',
    position: new THREE.Vector3(...initialPos),
    velocity: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(...initialPos),
    wanderTimer: 0
  })

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    animal.wanderTimer -= delta
    if (animal.wanderTimer <= 0) {
      animal.targetPosition.set(
        animal.position.x + (Math.random() - 0.5) * 10,
        0,
        animal.position.z + (Math.random() - 0.5) * 10
      )
      animal.wanderTimer = 3 + Math.random() * 3
    }

    const direction = animal.targetPosition.clone().sub(animal.position)
    if (direction.length() > 0.5) {
      direction.y = 0 // Keep on ground
      direction.normalize().multiplyScalar(0.5 * delta)
      animal.position.add(direction)
      meshRef.current.rotation.y = Math.atan2(direction.x, direction.z)
    }

    // Ground position with bobbing animation
    animal.position.y = 0
    meshRef.current.position.copy(animal.position)
    meshRef.current.position.y = 0.3 + Math.abs(Math.sin(Date.now() * 0.01)) * 0.05
  })

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.2, 0.15]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.18, 0.24]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.04, 0.08, 4]} />
        <meshStandardMaterial color="#ffa000" />
      </mesh>
      {/* Comb */}
      <mesh position={[0, 0.28, 0.15]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    </group>
  )
})

// Cow with memoization
const Cow = memo(({ position: initialPos }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Group>(null)
  const [animal] = useState<Animal>({
    id: 'cow',
    type: 'chicken',
    position: new THREE.Vector3(...initialPos),
    velocity: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(...initialPos),
    wanderTimer: 0
  })

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    animal.wanderTimer -= delta
    if (animal.wanderTimer <= 0) {
      animal.targetPosition.set(
        animal.position.x + (Math.random() - 0.5) * 8,
        0,
        animal.position.z + (Math.random() - 0.5) * 8
      )
      animal.wanderTimer = 5 + Math.random() * 5
    }

    const direction = animal.targetPosition.clone().sub(animal.position)
    if (direction.length() > 0.5) {
      direction.y = 0 // Keep on ground
      direction.normalize().multiplyScalar(0.3 * delta)
      animal.position.add(direction)
      meshRef.current.rotation.y = Math.atan2(direction.x, direction.z)
    }

    // Keep on ground
    animal.position.y = 0
    meshRef.current.position.copy(animal.position)
  })

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1.2]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1, 0.8]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.5]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Horns */}
      <mesh position={[-0.15, 1.3, 0.8]} castShadow rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.03, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      <mesh position={[0.15, 1.3, 0.8]} castShadow rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.03, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      {/* Spots */}
      <mesh position={[0.2, 0.9, 0.2]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      <mesh position={[-0.2, 0.8, -0.3]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.3, 0.3, 0.4]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0.3, 0.3, 0.4]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[-0.3, 0.3, -0.4]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0.3, 0.3, -0.4]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </group>
  )
})

// Dog with memoization
const Dog = memo(({ position: initialPos }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Group>(null)
  const [animal] = useState<Animal>({
    id: 'dog',
    type: 'chicken',
    position: new THREE.Vector3(...initialPos),
    velocity: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(...initialPos),
    wanderTimer: 0
  })

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    animal.wanderTimer -= delta
    if (animal.wanderTimer <= 0) {
      animal.targetPosition.set(
        animal.position.x + (Math.random() - 0.5) * 15,
        0,
        animal.position.z + (Math.random() - 0.5) * 15
      )
      animal.wanderTimer = 2 + Math.random() * 3
    }

    const direction = animal.targetPosition.clone().sub(animal.position)
    if (direction.length() > 0.5) {
      direction.y = 0 // Keep on ground
      direction.normalize().multiplyScalar(1.2 * delta)
      animal.position.add(direction)
      meshRef.current.rotation.y = Math.atan2(direction.x, direction.z)
    }

    // Keep on ground
    animal.position.y = 0
    meshRef.current.position.copy(animal.position)
  })

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.6]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.5, 0.4]} castShadow>
        <boxGeometry args={[0.25, 0.25, 0.3]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.5, 0.58]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#212121" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.12, 0.65, 0.35]} castShadow rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.15, 0.2, 0.05]} />
        <meshStandardMaterial color="#6d4c41" />
      </mesh>
      <mesh position={[0.12, 0.65, 0.35]} castShadow rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.15, 0.2, 0.05]} />
        <meshStandardMaterial color="#6d4c41" />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.6, -0.35]} castShadow rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.15, 0.15, 0.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      <mesh position={[0.15, 0.15, 0.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      <mesh position={[-0.15, 0.15, -0.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      <mesh position={[0.15, 0.15, -0.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
    </group>
  )
})

// Elephant with memoization
const Elephant = memo(({ position: initialPos }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Group>(null)
  const trunkRef = useRef<THREE.Mesh>(null)
  const [animal] = useState<Animal>({
    id: 'elephant',
    type: 'chicken',
    position: new THREE.Vector3(...initialPos),
    velocity: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(...initialPos),
    wanderTimer: 0
  })

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    animal.wanderTimer -= delta
    if (animal.wanderTimer <= 0) {
      animal.targetPosition.set(
        animal.position.x + (Math.random() - 0.5) * 12,
        0,
        animal.position.z + (Math.random() - 0.5) * 12
      )
      animal.wanderTimer = 6 + Math.random() * 6
    }

    const direction = animal.targetPosition.clone().sub(animal.position)
    if (direction.length() > 0.5) {
      direction.y = 0 // Keep on ground
      direction.normalize().multiplyScalar(0.4 * delta)
      animal.position.add(direction)
      meshRef.current.rotation.y = Math.atan2(direction.x, direction.z)
    }

    // Keep on ground
    animal.position.y = 0
    meshRef.current.position.copy(animal.position)

    // Trunk animation
    if (trunkRef.current) {
      trunkRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.3
    }
  })

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1.2, 1.4, 1.8]} />
        <meshStandardMaterial color="#9e9e9e" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2, 1.2]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#9e9e9e" />
      </mesh>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, 1.6, 1.8]} castShadow rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 1.2, 12]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.55, 2, 1]} castShadow rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.4, 0.6, 0.05]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      <mesh position={[0.55, 2, 1]} castShadow rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.4, 0.6, 0.05]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      {/* Tusks */}
      <mesh position={[-0.2, 1.7, 2]} castShadow rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.5, 8]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      <mesh position={[0.2, 1.7, 2]} castShadow rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.5, 8]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.4, 0.6, 0.6]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 12]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      <mesh position={[0.4, 0.6, 0.6]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 12]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      <mesh position={[-0.4, 0.6, -0.6]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 12]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      <mesh position={[0.4, 0.6, -0.6]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 12]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 1.4, -1]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
    </group>
  )
})

// Flying Bird with memoization
const Bird = memo(({ position: initialPos }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Group>(null)
  const time = useRef(0)

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    time.current += delta

    meshRef.current.position.x = initialPos[0] + Math.sin(time.current * 0.5) * 20
    meshRef.current.position.y = initialPos[1] + Math.sin(time.current * 2) * 2
    meshRef.current.position.z = initialPos[2] + Math.cos(time.current * 0.5) * 20
    
    meshRef.current.rotation.y = Math.atan2(
      Math.cos(time.current * 0.5),
      Math.sin(time.current * 0.5)
    )

    const wingFlap = Math.sin(time.current * 15) * 0.5
    if (meshRef.current.children[1]) {
      (meshRef.current.children[1] as THREE.Mesh).rotation.z = wingFlap
    }
    if (meshRef.current.children[2]) {
      (meshRef.current.children[2] as THREE.Mesh).rotation.z = -wingFlap
    }
  })

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      {/* Left wing */}
      <mesh position={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.15]} />
        <meshStandardMaterial color="#6d4c41" />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.15]} />
        <meshStandardMaterial color="#6d4c41" />
      </mesh>
    </group>
  )
})

// Villager NPC
function VillagerNPC({ villager: initialVillager }: { villager: Villager }) {
  const meshRef = useRef<THREE.Group>(null)
  const [villager] = useState(initialVillager)

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    const target = new THREE.Vector3(...villager.path[villager.pathIndex])
    const direction = target.clone().sub(villager.position)

    if (direction.length() > 0.5) {
      direction.normalize().multiplyScalar(0.5 * delta)
      villager.position.add(direction)
      villager.rotation = Math.atan2(direction.x, direction.z)
    } else {
      villager.pathIndex = (villager.pathIndex + 1) % villager.path.length
    }

    meshRef.current.position.copy(villager.position)
    meshRef.current.rotation.y = villager.rotation
  })

  return (
    <group ref={meshRef}>
      {/* Simple human figure */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.25]} />
        <meshStandardMaterial color={villager.color} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#ffd1a3" />
      </mesh>
      {/* Label */}
      <Html position={[0, 2.2, 0]} center>
        <Paper
          elevation={2}
          sx={{
            padding: '4px 8px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            fontSize: '10px',
            whiteSpace: 'nowrap'
          }}
        >
          <Typography variant="caption" fontWeight={600}>
            {villager.name}
          </Typography>
        </Paper>
      </Html>
    </group>
  )
}

// GitHub Contribution Graph
const GitHubContributions = memo(({ position }: { position: [number, number, number] }) => {
  // Mock contribution data (replace with real API data)
  const contributions = useMemo(() => {
    const data = []
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        data.push({
          week,
          day,
          count: Math.floor(Math.random() * 15)
        })
      }
    }
    return data
  }, [])

  const getColor = (count: number) => {
    if (count === 0) return '#ebedf0'
    if (count < 5) return '#c6e48b'
    if (count < 10) return '#7bc96f'
    if (count < 15) return '#239a3b'
    return '#196127'
  }

  return (
    <group position={position} rotation={[-Math.PI / 3, 0, 0]}>
      {contributions.map((contrib, i) => (
        <mesh
          key={i}
          position={[
            contrib.week * 0.15 - 3.5,
            0.1,
            contrib.day * 0.15 - 0.5
          ]}
          castShadow
        >
          <boxGeometry args={[0.12, contrib.count * 0.05 + 0.05, 0.12]} />
          <meshStandardMaterial color={getColor(contrib.count)} />
        </mesh>
      ))}
      
      {/* Title */}
      <Text
        position={[0, -0.5, -1]}
        fontSize={0.3}
        color="#333"
        anchorX="center"
      >
        GitHub Contributions
      </Text>
    </group>
  )
})

// Coding Stats Display
const CodingStats = memo(({ position }: { position: [number, number, number] }) => {
  // TODO(nkverma): these are placeholder coding-profile counts — set to your own or remove.
  const stats = {
    hackerrank: 120,
    codechef: 80,
    github: 45
  }

  return (
    <group position={position}>
      {/* Stat boards */}
      {Object.entries(stats).map(([platform, count], i) => (
        <group key={platform} position={[(i - 1.5) * 1.5, 2, 0]}>
          {/* Board */}
          <mesh castShadow>
            <boxGeometry args={[1.2, 1.5, 0.1]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Post */}
          <mesh position={[0, -1.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
            <meshStandardMaterial color="#8d6e63" />
          </mesh>
          {/* Text */}
          <Text
            position={[0, 0.3, 0.06]}
            fontSize={0.15}
            color="#333"
            anchorX="center"
          >
            {platform.toUpperCase()}
          </Text>
          <Text
            position={[0, -0.1, 0.06]}
            fontSize={0.3}
            color="#2196f3"
            anchorX="center"
            fontWeight="bold"
          >
            {count}+
          </Text>
          <Text
            position={[0, -0.5, 0.06]}
            fontSize={0.12}
            color="#666"
            anchorX="center"
          >
            Problems
          </Text>
        </group>
      ))}
    </group>
  )
})

// Contact/Location House
const ContactHouse = memo(({ position, isNear, onClick }: { 
  position: [number, number, number]
  isNear: boolean
  onClick?: () => void
}) => {
  return (
    <group position={position}>
      {/* Special house design */}
      <mesh position={[0, 1.5, 0]} castShadow onClick={onClick}>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#e3f2fd" />
      </mesh>

      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[3, 2, 4]} />
        <meshStandardMaterial color="#1976d2" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.8, 2.01]}>
        <boxGeometry args={[1, 1.6, 0.1]} />
        <meshStandardMaterial color="#1565c0" />
      </mesh>

      {/* Windows */}
      <mesh position={[-1, 1.5, 2.01]}>
        <boxGeometry args={[0.7, 0.7, 0.1]} />
        <meshStandardMaterial color="#90caf9" />
      </mesh>
      <mesh position={[1, 1.5, 2.01]}>
        <boxGeometry args={[0.7, 0.7, 0.1]} />
        <meshStandardMaterial color="#90caf9" />
      </mesh>

      {/* Location marker on top */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>

      {isNear && (
        <Html position={[0, 5.5, 0]} center>
          <Paper
            elevation={3}
            sx={{
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
            onClick={onClick}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOn color="error" />
              <Typography variant="body2" fontWeight={600}>
                Contact & Location
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Press E
              </Typography>
            </Stack>
          </Paper>
        </Html>
      )}
    </group>
  )
})

// Modern Project House with Details
const ProjectHouse = memo(({ 
  project,
  position, 
  rotation = 0,
  color,
  isNear,
  onClick,
  houseStyle = 'modern'
}: { 
  project: any
  position: [number, number, number]
  rotation?: number
  color: string
  isNear: boolean
  onClick?: () => void
  houseStyle?: 'modern' | 'cottage' | 'villa' | 'college' | 'tech-lab' | 'design-studio'
}) => {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current && isNear) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.05
    }
  })

  if (houseStyle === 'college') {
    return (
      <group position={position} rotation={[0, rotation, 0]} ref={groupRef}>
        {/* Main building - 3 floors */}
        <mesh position={[0, 3, 0]} castShadow onClick={onClick}>
          <boxGeometry args={[6, 6, 4]} />
          <meshStandardMaterial color="#fff3e0" roughness={0.7} />
        </mesh>

        {/* Left wing */}
        <mesh position={[4, 2, 0]} castShadow>
          <boxGeometry args={[2, 4, 4]} />
          <meshStandardMaterial color="#fff3e0" roughness={0.7} />
        </mesh>

        {/* Right wing */}
        <mesh position={[-4, 2, 0]} castShadow>
          <boxGeometry args={[2, 4, 4]} />
          <meshStandardMaterial color="#fff3e0" roughness={0.7} />
        </mesh>

        {/* Entrance columns */}
        <mesh position={[-1.5, 2, 2.5]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
          <meshStandardMaterial color="#d7ccc8" />
        </mesh>
        <mesh position={[1.5, 2, 2.5]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
          <meshStandardMaterial color="#d7ccc8" />
        </mesh>

        {/* Roof */}
        <mesh position={[0, 6.5, 0]} castShadow>
          <boxGeometry args={[6.5, 0.5, 4.5]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>

        {/* Windows - Floor 1 */}
        {[-2, -1, 0, 1, 2].map((x, i) => (
          <mesh key={`win1-${i}`} position={[x * 1.2, 1.5, 2.01]}>
            <boxGeometry args={[0.6, 0.8, 0.05]} />
            <meshStandardMaterial color="#64b5f6" roughness={0.1} metalness={0.9} />
          </mesh>
        ))}

        {/* Windows - Floor 2 */}
        {[-2, -1, 0, 1, 2].map((x, i) => (
          <mesh key={`win2-${i}`} position={[x * 1.2, 3.5, 2.01]}>
            <boxGeometry args={[0.6, 0.8, 0.05]} />
            <meshStandardMaterial color="#64b5f6" roughness={0.1} metalness={0.9} />
          </mesh>
        ))}

        {/* Windows - Floor 3 */}
        {[-2, -1, 0, 1, 2].map((x, i) => (
          <mesh key={`win3-${i}`} position={[x * 1.2, 5.5, 2.01]}>
            <boxGeometry args={[0.6, 0.8, 0.05]} />
            <meshStandardMaterial color="#64b5f6" roughness={0.1} metalness={0.9} />
          </mesh>
        ))}

        {/* Main entrance door */}
        <mesh position={[0, 1, 2.01]}>
          <boxGeometry args={[1.2, 2, 0.1]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>

        {/* College sign */}
        <mesh position={[0, 7, 1]}>
          <boxGeometry args={[3, 0.5, 0.1]} />
          <meshStandardMaterial color="#1976d2" />
        </mesh>

        {/* Flag pole */}
        <mesh position={[0, 9, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 4, 8]} />
          <meshStandardMaterial color="#424242" />
        </mesh>
        <mesh position={[0.5, 10, 0]}>
          <boxGeometry args={[1, 0.6, 0.05]} />
          <meshStandardMaterial color="#ff9800" />
        </mesh>

        {/* Courtyard */}
        <mesh position={[0, 0.01, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3, 32]} />
          <meshStandardMaterial color="#c8e6c9" />
        </mesh>

        {isNear && (
          <Html position={[0, 8, 0]} center>
            <Paper
              elevation={3}
              sx={{
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                cursor: 'pointer',
                maxWidth: '200px'
              }}
              onClick={onClick}
            >
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <School fontSize="small" color="primary" />
                  <Typography variant="body2" fontWeight={600}>
                    {project.title}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Press E to view
                </Typography>
              </Stack>
            </Paper>
          </Html>
        )}
      </group>
    )
  }

  if (houseStyle === 'tech-lab') {
    return (
      <group position={position} rotation={[0, rotation, 0]} ref={groupRef}>
        {/* Main lab building */}
        <mesh position={[0, 2, 0]} castShadow onClick={onClick}>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#263238" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Glass front */}
        <mesh position={[0, 2, 2.01]}>
          <boxGeometry args={[3.8, 3.8, 0.1]} />
          <meshStandardMaterial 
            color="#00bcd4" 
            transparent 
            opacity={0.3} 
            roughness={0.1} 
            metalness={0.9} 
          />
        </mesh>

        {/* Server room annex */}
        <mesh position={[2.5, 1.5, -1]} castShadow>
          <boxGeometry args={[1.5, 3, 2]} />
          <meshStandardMaterial color="#37474f" roughness={0.5} metalness={0.5} />
        </mesh>

        {/* Antenna array */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
          <meshStandardMaterial color="#ff6f00" emissive="#ff6f00" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 5.2, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#00e676" emissive="#00e676" emissiveIntensity={0.8} />
        </mesh>

        {/* LED strip lights */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
          <mesh key={`led-${i}`} position={[x, 0.2, 2.02]}>
            <boxGeometry args={[0.3, 0.1, 0.05]} />
            <meshStandardMaterial 
              color="#00e5ff" 
              emissive="#00e5ff" 
              emissiveIntensity={0.7} 
            />
          </mesh>
        ))}

        {/* Ventilation units */}
        <mesh position={[-1.5, 4.2, 0]} castShadow>
          <boxGeometry args={[0.8, 0.4, 0.8]} />
          <meshStandardMaterial color="#546e7a" />
        </mesh>
        <mesh position={[1.5, 4.2, 0]} castShadow>
          <boxGeometry args={[0.8, 0.4, 0.8]} />
          <meshStandardMaterial color="#546e7a" />
        </mesh>

        {/* Security camera */}
        <mesh position={[1.8, 3.5, 1.8]} rotation={[0.5, -0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 0.3, 8]} />
          <meshStandardMaterial color="#212121" />
        </mesh>

        {/* Holographic display effect */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[3.5, 3.5, 3.5]} />
          <meshStandardMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.05} 
            wireframe 
          />
        </mesh>

        {isNear && (
          <Html position={[0, 6, 0]} center>
            <Paper
              elevation={3}
              sx={{
                padding: '8px 12px',
                background: 'rgba(38, 50, 56, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                cursor: 'pointer',
                maxWidth: '220px',
                border: '2px solid #00e5ff'
              }}
              onClick={onClick}
            >
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: '#00e676',
                    animation: 'pulse 1.5s infinite'
                  }} />
                  <Typography variant="body2" fontWeight={600} color="#00e5ff">
                    {project.title}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#b0bec5' }}>
                  Press E to access
                </Typography>
              </Stack>
            </Paper>
          </Html>
        )}
      </group>
    )
  }

  if (houseStyle === 'design-studio') {
    return (
      <group position={position} rotation={[0, rotation, 0]} ref={groupRef}>
        {/* Main studio building */}
        <mesh position={[0, 2, 0]} castShadow onClick={onClick}>
          <boxGeometry args={[4.5, 4, 4.5]} />
          <meshStandardMaterial color="#fce4ec" roughness={0.6} />
        </mesh>

        {/* Large glass windows */}
        <mesh position={[-2.26, 2, 0]}>
          <boxGeometry args={[0.05, 3.5, 4]} />
          <meshStandardMaterial 
            color="#e1bee7" 
            transparent 
            opacity={0.4} 
            roughness={0.1} 
            metalness={0.8} 
          />
        </mesh>
        <mesh position={[2.26, 2, 0]}>
          <boxGeometry args={[0.05, 3.5, 4]} />
          <meshStandardMaterial 
            color="#e1bee7" 
            transparent 
            opacity={0.4} 
            roughness={0.1} 
            metalness={0.8} 
          />
        </mesh>

        {/* Curved roof */}
        <mesh position={[0, 4.3, 0]} castShadow rotation={[0, 0, 0]}>
          <cylinderGeometry args={[2.5, 2.8, 0.8, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#ba68c8" roughness={0.7} />
        </mesh>

        {/* Color palette display */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={`palette-${i}`} position={[(i - 2) * 0.5, 3.8, 2.3]} castShadow>
            <boxGeometry args={[0.4, 0.4, 0.1]} />
            <meshStandardMaterial 
              color={['#f44336', '#9c27b0', '#2196f3', '#4caf50', '#ff9800'][i]} 
            />
          </mesh>
        ))}

        {/* Entrance */}
        <mesh position={[0, 1, 2.26]}>
          <boxGeometry args={[1.5, 2, 0.1]} />
          <meshStandardMaterial color="#8e24aa" />
        </mesh>

        {/* Design tools sculpture */}
        <mesh position={[-3, 0.8, 3]} castShadow>
          <boxGeometry args={[0.3, 1.6, 0.05]} />
          <meshStandardMaterial color="#ff6f00" />
        </mesh>
        <mesh position={[-2.5, 0.5, 3]} castShadow rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.15, 0.15, 1, 6]} />
          <meshStandardMaterial color="#00bcd4" />
        </mesh>

        {/* Plant decorations */}
        <mesh position={[3, 0.3, 3]}>
          <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        <mesh position={[3, 0.8, 3]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#66bb6a" />
        </mesh>

        {/* Creative sign */}
        <mesh position={[0, 5, 1.5]}>
          <boxGeometry args={[2, 0.6, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Floating design icons */}
        <mesh position={[-1.5, 2.5, 2.5]}>
          <torusGeometry args={[0.2, 0.08, 16, 32]} />
          <meshStandardMaterial color="#ff4081" emissive="#ff4081" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[1.5, 3, 2.5]}>
          <octahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial color="#7c4dff" emissive="#7c4dff" emissiveIntensity={0.3} />
        </mesh>

        {isNear && (
          <Html position={[0, 6, 0]} center>
            <Paper
              elevation={3}
              sx={{
                padding: '8px 12px',
                background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                cursor: 'pointer',
                maxWidth: '220px',
                border: '2px solid #ba68c8'
              }}
              onClick={onClick}
            >
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #f44336 0%, #9c27b0 50%, #2196f3 100%)'
                  }} />
                  <Typography variant="body2" fontWeight={600} color="#8e24aa">
                    {project.title}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Press E to explore
                </Typography>
              </Stack>
            </Paper>
          </Html>
        )}
      </group>
    )
  }

  if (houseStyle === 'villa') {
    return (
      <group position={position} rotation={[0, rotation, 0]} ref={groupRef}>
        {/* Main building */}
        <mesh position={[0, 1.5, 0]} castShadow onClick={onClick}>
          <boxGeometry args={[3.5, 3, 3.5]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>

        {/* Second floor */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[3, 2, 3]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>

        {/* Roof */}
        <mesh position={[0, 5, 0]} castShadow>
          <coneGeometry args={[2.5, 1.8, 4]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.9} />
        </mesh>

        {/* Door */}
        <mesh position={[0, 0.8, 1.76]}>
          <boxGeometry args={[0.8, 1.6, 0.1]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>

        {/* Windows - Ground floor */}
        <mesh position={[-1, 1.5, 1.76]}>
          <boxGeometry args={[0.6, 0.8, 0.1]} />
          <meshStandardMaterial color="#64b5f6" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[1, 1.5, 1.76]}>
          <boxGeometry args={[0.6, 0.8, 0.1]} />
          <meshStandardMaterial color="#64b5f6" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Windows - Second floor */}
        <mesh position={[-0.8, 3.5, 1.51]}>
          <boxGeometry args={[0.5, 0.7, 0.1]} />
          <meshStandardMaterial color="#64b5f6" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 3.5, 1.51]}>
          <boxGeometry args={[0.5, 0.7, 0.1]} />
          <meshStandardMaterial color="#64b5f6" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Chimney */}
        <mesh position={[1.2, 5.8, 0.8]} castShadow>
          <boxGeometry args={[0.4, 1.5, 0.4]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>

        {/* Balcony */}
        <mesh position={[0, 2.8, 1.8]}>
          <boxGeometry args={[2, 0.1, 0.8]} />
          <meshStandardMaterial color="#424242" />
        </mesh>

        {/* Fence around */}
        {[-2, -1, 0, 1, 2].map(x => (
          <mesh key={`fence-${x}`} position={[x * 0.5, 0.5, 2.5]} castShadow>
            <boxGeometry args={[0.1, 1, 0.1]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
        ))}

        {isNear && (
          <Html position={[0, 7, 0]} center>
            <Paper
              elevation={3}
              sx={{
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                cursor: 'pointer',
                maxWidth: '200px'
              }}
              onClick={onClick}
            >
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Code fontSize="small" color="primary" />
                  <Typography variant="body2" fontWeight={600}>
                    {project.title}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Press E to view
                </Typography>
              </Stack>
            </Paper>
          </Html>
        )}
      </group>
    )
  }

  if (houseStyle === 'cottage') {
    return (
      <group position={position} rotation={[0, rotation, 0]} ref={groupRef}>
        {/* Main structure */}
        <mesh position={[0, 1, 0]} castShadow onClick={onClick}>
          <boxGeometry args={[2.8, 2, 2.8]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>

        {/* Roof */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <coneGeometry args={[2.2, 1.8, 4]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.9} />
        </mesh>

        {/* Door */}
        <mesh position={[0, 0.6, 1.41]}>
          <boxGeometry args={[0.7, 1.2, 0.1]} />
          <meshStandardMaterial color="#6d4c41" />
        </mesh>

        {/* Windows */}
        <mesh position={[-0.8, 1, 1.41]}>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#90caf9" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0.8, 1, 1.41]}>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#90caf9" roughness={0.2} metalness={0.5} />
        </mesh>

        {/* Side windows */}
        <mesh position={[1.41, 1, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.5]} />
          <meshStandardMaterial color="#90caf9" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[-1.41, 1, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.5]} />
          <meshStandardMaterial color="#90caf9" roughness={0.2} metalness={0.5} />
        </mesh>

        {/* Garden */}
        <mesh position={[0, 0.05, 3]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.5, 16]} />
          <meshStandardMaterial color="#66bb6a" />
        </mesh>

        {isNear && (
          <Html position={[0, 4.5, 0]} center>
            <Paper
              elevation={3}
              sx={{
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                cursor: 'pointer',
                maxWidth: '200px'
              }}
              onClick={onClick}
            >
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Code fontSize="small" color="primary" />
                  <Typography variant="body2" fontWeight={600}>
                    {project.title}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Press E to view
                </Typography>
              </Stack>
            </Paper>
          </Html>
        )}
      </group>
    )
  }

  // Default modern style
  return (
    <group position={position} rotation={[0, rotation, 0]} ref={groupRef}>
      <mesh position={[0, 1.2, 0]} castShadow onClick={onClick}>
        <boxGeometry args={[2.5, 2.4, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[1.9, 1.5, 4]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.6, 1.26]}>
        <boxGeometry args={[0.6, 1.2, 0.1]} />
        <meshStandardMaterial color="#5d4037" roughness={0.7} />
      </mesh>

      <mesh position={[-0.6, 1.2, 1.26]}>
        <boxGeometry args={[0.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#90caf9" roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0.6, 1.2, 1.26]}>
        <boxGeometry args={[0.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#90caf9" roughness={0.2} metalness={0.5} />
      </mesh>

      {isNear && (
        <Html position={[0, 4, 0]} center>
          <Paper
            elevation={3}
            sx={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              cursor: 'pointer',
              maxWidth: '200px'
            }}
            onClick={onClick}
          >
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Code fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight={600}>
                  {project.title}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Press E to view
              </Typography>
            </Stack>
          </Paper>
        </Html>
      )}
    </group>
  )
})

// Street Lamp
const StreetLamp = memo(({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 4, 8]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#fff9c4" 
          emissive="#fff9c4" 
          emissiveIntensity={0.5} 
        />
      </mesh>
      <pointLight position={[0, 4.2, 0]} intensity={0.5} distance={10} color="#fff9c4" />
    </group>
  )
})

// Tree (Enhanced)
const Tree = memo(({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>
      
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#2d5016" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshStandardMaterial color="#3a6b1f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.8, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#4a8028" roughness={0.8} />
      </mesh>
    </group>
  )
})

// Rock
const Rock = memo(({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => {
  return (
    <mesh position={position} scale={[scale, scale * 0.7, scale]} castShadow>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#78909c" roughness={0.95} />
    </mesh>
  )
})

// Content Modal
const ContentModal = memo(({ structure, onClose }: { structure: Structure; onClose: () => void }) => {
  const theme = useTheme()
  
  if (!structure.content) return null

  // Special handling for contact info
  if (structure.type === 'contact') {
    return (
      <Fade in>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            pointerEvents: 'none',
          }}
        >
          <Paper
            elevation={24}
            sx={{
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              p: 4,
              pointerEvents: 'auto',
              borderRadius: 4,
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.98)'
                : 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4" fontWeight={700}>
                📍 Contact & Location
              </Typography>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>

            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Email color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {portfolioData.personal.email}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Phone color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {portfolioData.personal.phone}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <LocationOn color="error" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {portfolioData.personal.location}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <GitHub />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      GitHub
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {portfolioData.personal.github}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              onClick={onClose}
              sx={{ mt: 3 }}
            >
              Close
            </Button>
          </Paper>
        </Box>
      </Fade>
    )
  }

  // Regular content modal
  return (
    <Fade in>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          pointerEvents: 'none',
        }}
      >
        <Paper
          elevation={24}
          sx={{
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            p: 4,
            pointerEvents: 'auto',
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.98)'
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {structure.content.title}
              </Typography>
              {structure.content.description && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {structure.content.description}
                </Typography>
              )}
            </Box>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          <Stack spacing={2}>
            {structure.content.items?.map((item: any, idx: number) => (
              <Paper
                key={idx}
                elevation={2}
                sx={{
                  p: 2,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  borderRadius: 2,
                }}
              >
                {item.title && (
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.title}
                  </Typography>
                )}
                {item.subtitle && (
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {item.subtitle}
                  </Typography>
                )}
                {item.company && (
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {item.company}
                  </Typography>
                )}
                {item.description && (
                  <Typography variant="body2" paragraph>
                    {item.description}
                  </Typography>
                )}
                {item.tech && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {item.tech.map((t: string, i: number) => (
                      <Chip key={i} label={t} size="small" />
                    ))}
                  </Stack>
                )}
                {item.technologies && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                    {item.technologies.map((t: string, i: number) => (
                      <Chip key={i} label={t} size="small" color="primary" variant="outlined" />
                    ))}
                  </Stack>
                )}
              </Paper>
            ))}
          </Stack>

          <Button
            variant="contained"
            fullWidth
            onClick={onClose}
            sx={{ mt: 3 }}
          >
            Close
          </Button>
        </Paper>
      </Box>
    </Fade>
  )
})

// Main Detailed Village
export default function DetailedVillage() {
  const [avatarPosition, setAvatarPosition] = useState(new THREE.Vector3(0, 0, 0))
  const [avatarSpeed, setAvatarSpeed] = useState(0)
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null)
  const [nearestStructure, setNearestStructure] = useState<Structure | null>(null)
  const [performanceLevel, setPerformanceLevel] = useState<'low' | 'medium' | 'high'>('high')
  const [isLoading, setIsLoading] = useState(true)
  
  // Mobile touch controls state
  const [touchControls, setTouchControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false
  })

  // Detect device performance on mount
  useEffect(() => {
    const level = getPerformanceLevel()
    setPerformanceLevel(level)
    console.log('Performance Level:', level)
    
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // All village structures
  const structures: Structure[] = useMemo(() => {
    const projectHouses = portfolioData.projects.map((project, index) => {
      const angle = (index / portfolioData.projects.length) * Math.PI * 2
      const radius = 30
      const colors = ['#ffcdd2', '#c5cae9', '#b2ebf2']
      const styles = ['villa', 'cottage', 'modern'] as const
      
      return {
        id: `project-${index}`,
        type: 'house' as const,
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ] as [number, number, number],
        rotation: -angle,
        color: colors[index % colors.length],
        roofColor: '#8d6e63',
        label: project.title,
        icon: Code,
        houseStyle: styles[index % styles.length],
        content: {
          title: project.title,
          description: project.description,
          items: [{
            description: project.description,
            technologies: project.technologies,
            features: project.features
          }]
        }
      }
    })

    return [
      ...projectHouses,
      {
        id: 'contact',
        type: 'contact',
        position: [0, 0, -40],
        rotation: 0,
        label: 'Contact & Location',
        icon: LocationOn,
        content: portfolioData.personal
      },
      {
        id: 'education',
        type: 'house',
        position: [-45, 0, -30],
        rotation: Math.PI / 4,
        color: '#fff3e0',
        roofColor: '#8d6e63',
        label: 'Education - College',
        icon: School,
        houseStyle: 'college',
        content: {
          title: 'Education - College Campus',
          description: 'Academic Background & Learning Journey',
          items: portfolioData.education.map(edu => ({
            title: edu.degree,
            subtitle: edu.institution,
            description: `${edu.duration} | ${edu.score}`,
          }))
        }
      },
      {
        id: 'ai-agents',
        type: 'house',
        position: [45, 0, -30],
        rotation: -Math.PI / 4,
        color: '#263238',
        roofColor: '#37474f',
        label: 'AI Agents Lab',
        icon: Code,
        houseStyle: 'tech-lab',
        content: {
          title: 'Agentic AI & Machine Learning',
          description: 'Advanced AI agents and automation systems',
          items: [
            {
              title: 'GitHub Copilot',
              subtitle: 'AI Pair Programmer',
              description: 'Code suggestions, completions, and intelligent assistance',
              technologies: ['OpenAI Codex', 'GPT-4', 'VS Code']
            },
            {
              title: 'Claude AI',
              subtitle: 'Advanced Reasoning',
              description: 'Complex problem solving, code analysis, and documentation',
              technologies: ['Anthropic', 'Constitutional AI', 'Artifacts']
            },
            {
              title: 'ChatGPT',
              subtitle: 'Conversational AI',
              description: 'General purpose AI assistant for development tasks',
              technologies: ['GPT-4', 'Function Calling', 'Web Browsing']
            },
            {
              title: 'Cursor AI',
              subtitle: 'AI Code Editor',
              description: 'Intelligent code editing with multi-file understanding',
              technologies: ['GPT-4', 'Code Context', 'Auto-completion']
            },
            {
              title: 'Gemini Pro',
              subtitle: 'Google AI',
              description: 'Multimodal AI for code, images, and text',
              technologies: ['Google', 'Multimodal', 'Code Execution']
            },
            {
              title: 'Custom AI Agents',
              subtitle: 'Automation Scripts',
              description: 'Self-built agents for task automation and workflows',
              technologies: ['Python', 'LangChain', 'AutoGPT', 'CrewAI']
            }
          ]
        }
      },
      {
        id: 'flutterflow',
        type: 'house',
        position: [45, 0, 30],
        rotation: -Math.PI * 3 / 4,
        color: '#fce4ec',
        roofColor: '#ba68c8',
        label: 'FlutterFlow Studio',
        icon: Code,
        houseStyle: 'design-studio',
        content: {
          title: 'FlutterFlow Development',
          description: 'No-code/Low-code Flutter app development platform',
          items: [
            {
              title: 'Visual Builder',
              subtitle: 'Drag & Drop Interface',
              description: 'Build Flutter apps visually without writing code',
              technologies: ['FlutterFlow', 'Firebase', 'Supabase']
            },
            {
              title: 'Custom Widgets',
              subtitle: 'Reusable Components',
              description: 'Created custom widgets and templates for rapid development',
              technologies: ['Flutter', 'Dart', 'Custom Code']
            },
            {
              title: 'Backend Integration',
              subtitle: 'API & Database',
              description: 'Firebase, Supabase, and REST API integrations',
              technologies: ['Firebase', 'Firestore', 'Cloud Functions']
            },
            {
              title: 'State Management',
              subtitle: 'App State',
              description: 'Provider, Riverpod, and local state management',
              technologies: ['Provider', 'App State', 'Page State']
            },
            {
              title: 'Responsive Design',
              subtitle: 'Multi-Platform',
              description: 'Build once, deploy to iOS, Android, and Web',
              technologies: ['Responsive UI', 'Adaptive Layouts']
            },
            {
              title: 'Rapid Prototyping',
              subtitle: 'Quick MVP',
              description: 'Build and iterate on app prototypes 10x faster',
              technologies: ['FlutterFlow', 'Hot Reload', 'Live Preview']
            }
          ]
        }
      },
      {
        id: 'experience',
        type: 'house',
        position: [-45, 0, 30],
        rotation: Math.PI * 3 / 4,
        color: '#fff9c4',
        roofColor: '#f57f17',
        label: 'Experience',
        icon: Work,
        houseStyle: 'villa',
        content: {
          title: 'Work Experience',
          description: 'Professional journey',
          items: portfolioData.experience.map(exp => ({
            title: exp.role,
            company: exp.company,
            subtitle: exp.duration,
            description: exp.description,
            tech: exp.technologies
          }))
        }
      },
      {
        id: 'achievements',
        type: 'house',
        position: [-30, 0, 50],
        rotation: Math.PI / 2,
        color: '#b2dfdb',
        roofColor: '#00695c',
        label: 'Achievements',
        icon: EmojiEvents,
        houseStyle: 'cottage',
        content: {
          title: 'Achievements',
          description: 'Awards and recognition',
          items: portfolioData.achievements.map(ach => ({
            title: ach.title,
            subtitle: ach.date,
            description: ach.description,
          }))
        }
      },
      {
        id: 'certifications',
        type: 'house',
        position: [30, 0, 50],
        rotation: -Math.PI / 2,
        color: '#ffccbc',
        roofColor: '#d84315',
        label: 'Certifications',
        icon: CardMembership,
        houseStyle: 'modern',
        content: {
          title: 'Certifications',
          description: 'Professional credentials',
          items: portfolioData.certifications.map(cert => ({
            title: cert.title,
            subtitle: cert.issuer,
            description: cert.date,
          }))
        }
      },
      {
        id: 'github',
        type: 'github',
        position: [-50, 0, 0],
        label: 'GitHub Stats'
      },
      {
        id: 'stats',
        type: 'stats',
        position: [50, 0, 0],
        label: 'Coding Stats'
      },
      {
        id: 'playground',
        type: 'playground',
        position: [0, 0, 55],
        label: 'Game Zone',
        content: {
          title: '🎮 Interactive Game Zone',
          description: 'Multiple sports and activities available',
          items: [
            {
              title: '⚽ Football Field',
              description: 'Full-size football pitch with goals and center circle. Click the ball to kick it!',
            },
            {
              title: '🏀 Basketball Court',
              description: 'Professional basketball court with hoops and three-point lines. Shoot some hoops!',
            },
            {
              title: '🎾 Tennis Court',
              description: 'Tennis court with net and service lines. Practice your serve!',
            },
            {
              title: '🎠 Playground',
              description: 'Swing set and slide for relaxation and fun.',
            }
          ]
        }
      }
    ]
  }, [])

  // Trees - More distributed
  const trees = useMemo(() => {
    const treePositions: Structure[] = []
    // Perimeter trees
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2
      const radius = 70 + Math.random() * 8
      treePositions.push({
        id: `tree-perimeter-${i}`,
        type: 'tree',
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ],
        scale: 0.8 + Math.random() * 0.6
      })
    }
    
    // Random clustered trees
    const clusters = [
      [45, 0, 45], [-45, 0, 45], [45, 0, -45], [-45, 0, -45],
      [20, 0, 60], [-20, 0, 60], [60, 0, 20], [-60, 0, -20]
    ]
    
    clusters.forEach((center, clusterIdx) => {
      for (let i = 0; i < 3; i++) {
        treePositions.push({
          id: `tree-cluster-${clusterIdx}-${i}`,
          type: 'tree',
          position: [
            center[0] + (Math.random() - 0.5) * 8,
            0,
            center[2] + (Math.random() - 0.5) * 8
          ],
          scale: 0.7 + Math.random() * 0.5
        })
      }
    })
    
    return treePositions
  }, [])

  // Rocks - Better distributed
  const rocks = useMemo(() => {
    const rockPositions: Structure[] = []
    // Scattered rocks around the village
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 50 + Math.random() * 30
      rockPositions.push({
        id: `rock-${i}`,
        type: 'rock',
        position: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
          0,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 10
        ],
        scale: 0.6 + Math.random() * 1.2
      })
    }
    return rockPositions
  }, [])

  // Villagers - More NPCs
  const villagers = useMemo(() => [
    {
      id: 'villager-1',
      name: 'Developer Dave',
      role: 'Guide',
      position: new THREE.Vector3(-10, 0, -10),
      rotation: 0,
      path: [[-10, 0, -10], [-10, 0, 10], [10, 0, 10], [10, 0, -10]] as [number, number, number][],
      pathIndex: 0,
      color: '#2196f3'
    },
    {
      id: 'villager-2',
      name: 'Designer Diana',
      role: 'Artist',
      position: new THREE.Vector3(15, 0, 15),
      rotation: 0,
      path: [[15, 0, 15], [15, 0, -15], [-15, 0, -15], [-15, 0, 15]] as [number, number, number][],
      pathIndex: 0,
      color: '#e91e63'
    },
    {
      id: 'villager-3',
      name: 'Tech Tom',
      role: 'Engineer',
      position: new THREE.Vector3(20, 0, -20),
      rotation: 0,
      path: [[20, 0, -20], [20, 0, 20], [-20, 0, 20], [-20, 0, -20]] as [number, number, number][],
      pathIndex: 0,
      color: '#4caf50'
    },
    {
      id: 'villager-4',
      name: 'Manager Mike',
      role: 'Product',
      position: new THREE.Vector3(-25, 0, 0),
      rotation: 0,
      path: [[-25, 0, 0], [0, 0, 25], [25, 0, 0], [0, 0, -25]] as [number, number, number][],
      pathIndex: 0,
      color: '#ff9800'
    },
    {
      id: 'villager-5',
      name: 'Data Dan',
      role: 'Analyst',
      position: new THREE.Vector3(0, 0, 30),
      rotation: 0,
      path: [[0, 0, 30], [30, 0, 30], [30, 0, -30], [0, 0, -30]] as [number, number, number][],
      pathIndex: 0,
      color: '#9c27b0'
    }
  ], [])

  // Handle interactions
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && nearestStructure?.content) {
        setSelectedStructure(nearestStructure)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nearestStructure])

  const handlePositionUpdate = (pos: THREE.Vector3, speed: number) => {
    setAvatarPosition(pos)
    setAvatarSpeed(speed)

    let nearest: Structure | null = null
    let minDist = Infinity

    structures.forEach(structure => {
      if (structure.content || structure.type === 'contact') {
        const dist = Math.sqrt(
          Math.pow(pos.x - structure.position[0], 2) +
          Math.pow(pos.z - structure.position[2], 2)
        )
        const interactionRange = 8
        if (dist < interactionRange && dist < minDist) {
          minDist = dist
          nearest = structure
        }
      }
    })

    setNearestStructure(nearest)
  }



  // Loading screen
  if (isLoading) {
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        zIndex: 9999,
      }}>
        <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Loading Village...
        </Typography>
        <Typography variant="body1">
          {performanceLevel === 'low' ? 'Optimizing for mobile...' : 
           performanceLevel === 'medium' ? 'Loading medium quality...' : 
           'Loading high quality experience...'}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Canvas 
        shadows={performanceLevel !== 'low'} 
        dpr={performanceLevel === 'low' ? [0.5, 1] : [1, 2]}
        performance={{ min: 0.5 }}
        gl={{ antialias: performanceLevel !== 'low', alpha: false }}
      >
        <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={75} />
        
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={performanceLevel === 'low' ? 0.7 : 0.5} />
        
        {/* Main sun light */}
        <directionalLight
          position={[50, 60, 25]}
          intensity={2}
          castShadow={performanceLevel !== 'low'}
          shadow-mapSize={performanceLevel === 'low' ? [512, 512] : performanceLevel === 'medium' ? [1024, 1024] : [2048, 2048]}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-bias={-0.0001}
        />
        
        {/* Fill lights for better ambiance */}
        {performanceLevel !== 'low' && (
          <>
            <pointLight position={[-40, 15, -40]} intensity={0.4} color="#ffd54f" distance={80} />
            <pointLight position={[40, 15, 40]} intensity={0.4} color="#81c784" distance={80} />
            <hemisphereLight args={['#87ceeb', '#8d6e63', 0.3]} />
          </>
        )}
        
        <Sky
          distance={450000}
          sunPosition={[100, 25, 100]}
          inclination={0.6}
          azimuth={0.25}
        />
        
        {performanceLevel !== 'low' && (
          <>
            <Cloud position={[-20, 15, -40]} speed={0.1} opacity={0.4} />
            <Cloud position={[30, 18, -50]} speed={0.15} opacity={0.3} />
            <Cloud position={[0, 20, -60]} speed={0.12} opacity={0.5} />
            <Cloud position={[-40, 16, 30]} speed={0.08} opacity={0.35} />
            <Cloud position={[35, 22, -20]} speed={0.13} opacity={0.4} />
          </>
        )}
        
        <Environment preset="sunset" />
        
        {/* Enhanced Ground with grass-like appearance */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
          <circleGeometry args={[85, 128]} />
          <meshStandardMaterial 
            color="#7cb342"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
        
        {/* Grass details for non-mobile */}
        {performanceLevel === 'high' && Array.from({ length: 150 }, (_, i) => {
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * 80
          return (
            <mesh
              key={`grass-${i}`}
              position={[
                Math.cos(angle) * radius,
                0.01,
                Math.sin(angle) * radius
              ]}
              rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
            >
              <planeGeometry args={[0.5, 0.5]} />
              <meshStandardMaterial 
                color="#8bc34a"
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          )
        })}
        
        {/* Boundary fence */}
        {Array.from({ length: 48 }, (_, i) => {
          const angle = (i / 48) * Math.PI * 2
          const radius = 85
          return (
            <mesh 
              key={`boundary-${i}`} 
              position={[Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius]}
              rotation={[0, angle, 0]}
              castShadow
            >
              <boxGeometry args={[0.2, 1, 0.2]} />
              <meshStandardMaterial color="#795548" />
            </mesh>
          )
        })}
        
        {/* Natural pathways (dirt paths instead of roads) */}
        {[
          // Main cross paths
          [[0, 0, -80], [0, 0, 80]],
          [[-80, 0, 0], [80, 0, 0]],
          // Diagonal paths
          [[-60, 0, -60], [60, 0, 60]],
          [[-60, 0, 60], [60, 0, -60]]
        ].map((path, idx) => (
          <mesh 
            key={`path-${idx}`} 
            position={[
              (path[0][0] + path[1][0]) / 2,
              0.01,
              (path[0][2] + path[1][2]) / 2
            ]}
            rotation={[-Math.PI / 2, 0, Math.atan2(path[1][2] - path[0][2], path[1][0] - path[0][0])]}
          >
            <planeGeometry args={[
              Math.sqrt(Math.pow(path[1][0] - path[0][0], 2) + Math.pow(path[1][2] - path[0][2], 2)),
              1.5
            ]} />
            <meshStandardMaterial color="#8d6e63" roughness={0.95} />
          </mesh>
        ))}
        
        {/* Decorative lamp posts along paths */}
        {[-60, -40, -20, 0, 20, 40, 60].map(pos => (
          <StreetLamp key={`lamp-v-${pos}`} position={[2, 0, pos]} />
        ))}
        {[-60, -40, -20, 0, 20, 40, 60].map(pos => (
          <StreetLamp key={`lamp-h-${pos}`} position={[pos, 0, 2]} />
        ))}
        
        {/* Avatar */}
        <AvatarController 
          position={[0, 0, 0]} 
          onPositionUpdate={handlePositionUpdate}
          mobileControls={performanceLevel === 'low' ? touchControls : undefined}
          structures={structures}
          trees={trees}
          rocks={rocks}
        />
        
        {/* Contact House */}
        {structures.filter(s => s.type === 'contact').map(structure => (
          <ContactHouse
            key={structure.id}
            position={structure.position}
            isNear={nearestStructure?.id === structure.id}
            onClick={() => setSelectedStructure(structure)}
          />
        ))}

        {/* All Houses */}
        {structures.filter(s => s.type === 'house').map(structure => (
          <ProjectHouse
            key={structure.id}
            project={structure.content}
            position={structure.position}
            rotation={structure.rotation}
            color={structure.color!}
            isNear={nearestStructure?.id === structure.id}
            onClick={() => setSelectedStructure(structure)}
            houseStyle={structure.houseStyle || 'modern'}
          />
        ))}
        
        {/* GitHub Contributions */}
        {structures.filter(s => s.type === 'github').map(structure => (
          <GitHubContributions key={structure.id} position={structure.position} />
        ))}
        
        {/* Coding Stats */}
        {structures.filter(s => s.type === 'stats').map(structure => (
          <CodingStats key={structure.id} position={structure.position} />
        ))}
        

        
        {/* Trees */}
        {trees.map(tree => (
          <Tree key={tree.id} position={tree.position} scale={tree.scale} />
        ))}
        
        {/* Rocks */}
        {rocks.map(rock => (
          <Rock key={rock.id} position={rock.position} scale={rock.scale} />
        ))}
        
        {/* Animals - More distributed */}
        {/* Chickens */}
        <Chicken position={[10, 0, 10]} />
        <Chicken position={[-8, 0, 15]} />
        <Chicken position={[20, 0, -5]} />
        <Chicken position={[-15, 0, -12]} />
        <Chicken position={[5, 0, 25]} />
        <Chicken position={[-20, 0, 20]} />
        
        {/* Birds */}
        <Bird position={[0, 15, 0]} />
        <Bird position={[20, 18, 10]} />
        <Bird position={[-15, 20, -10]} />
        <Bird position={[10, 16, -20]} />
        <Bird position={[-25, 19, 15]} />
        
        {/* Cows */}
        <Cow position={[-30, 0, 30]} />
        <Cow position={[-35, 0, 25]} />
        <Cow position={[-25, 0, 35]} />
        
        {/* Dogs */}
        <Dog position={[15, 0, -15]} />
        <Dog position={[-10, 0, -20]} />
        <Dog position={[25, 0, 10]} />
        
        {/* Elephants */}
        <Elephant position={[40, 0, 40]} />
        <Elephant position={[-40, 0, -35]} />
        
        {/* Villagers */}
        {villagers.map(villager => (
          <VillagerNPC key={villager.id} villager={villager} />
        ))}
      </Canvas>

      {/* Desktop UI Overlay - Hidden on Mobile */}
      {performanceLevel !== 'low' && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              minWidth: '250px',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Speed fontSize="small" color="primary" />
              <Typography variant="body2" fontWeight={600}>
                Speed: {(avatarSpeed * 100).toFixed(0)}%
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <MyLocation fontSize="small" color="secondary" />
              <Typography variant="caption">
                X: {avatarPosition.x.toFixed(1)} Z: {avatarPosition.z.toFixed(1)}
              </Typography>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>
              📍 Explore the village!
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              🏠 {structures.filter(s => s.content).length} Interactive locations
            </Typography>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              padding: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              🎮 Controls
            </Typography>
            <Typography variant="caption" display="block">W/A/S/D - Move</Typography>
            <Typography variant="caption" display="block">Shift - Run</Typography>
            <Typography variant="caption" display="block">E - Interact</Typography>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              padding: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              🗺️ Map
            </Typography>
            <Typography variant="caption" display="block">🏡 Projects (Circle)</Typography>
            <Typography variant="caption" display="block">📍 Contact (North)</Typography>
            <Typography variant="caption" display="block">📊 GitHub (West)</Typography>
            <Typography variant="caption" display="block">💻 Stats (East)</Typography>
          </Paper>
        </Box>
      )}

      {/* Mobile Touch Controls - Only on Mobile */}
      {performanceLevel === 'low' && (
        <>
          {/* Movement Controls - Bottom Left */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              left: 20,
              zIndex: 1000,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 60px)',
              gridTemplateRows: 'repeat(3, 60px)',
              gap: 1,
            }}
          >
            {/* Top row - Forward */}
            <Box />
            <IconButton
              onTouchStart={() => setTouchControls(prev => ({ ...prev, forward: true }))}
              onTouchEnd={() => setTouchControls(prev => ({ ...prev, forward: false }))}
              onMouseDown={() => setTouchControls(prev => ({ ...prev, forward: true }))}
              onMouseUp={() => setTouchControls(prev => ({ ...prev, forward: false }))}
              sx={{
                bgcolor: 'rgba(33, 150, 243, 0.9)',
                color: 'white',
                '&:active': { bgcolor: 'rgba(33, 150, 243, 1)' },
                fontSize: '24px',
                fontWeight: 700
              }}
            >
              ↑
            </IconButton>
            <Box />

            {/* Middle row - Left and Right */}
            <IconButton
              onTouchStart={() => setTouchControls(prev => ({ ...prev, left: true }))}
              onTouchEnd={() => setTouchControls(prev => ({ ...prev, left: false }))}
              onMouseDown={() => setTouchControls(prev => ({ ...prev, left: true }))}
              onMouseUp={() => setTouchControls(prev => ({ ...prev, left: false }))}
              sx={{
                bgcolor: 'rgba(33, 150, 243, 0.9)',
                color: 'white',
                '&:active': { bgcolor: 'rgba(33, 150, 243, 1)' },
                fontSize: '24px',
                fontWeight: 700
              }}
            >
              ←
            </IconButton>
            <Box />
            <IconButton
              onTouchStart={() => setTouchControls(prev => ({ ...prev, right: true }))}
              onTouchEnd={() => setTouchControls(prev => ({ ...prev, right: false }))}
              onMouseDown={() => setTouchControls(prev => ({ ...prev, right: true }))}
              onMouseUp={() => setTouchControls(prev => ({ ...prev, right: false }))}
              sx={{
                bgcolor: 'rgba(33, 150, 243, 0.9)',
                color: 'white',
                '&:active': { bgcolor: 'rgba(33, 150, 243, 1)' },
                fontSize: '24px',
                fontWeight: 700
              }}
            >
              →
            </IconButton>

            {/* Bottom row - Backward */}
            <Box />
            <IconButton
              onTouchStart={() => setTouchControls(prev => ({ ...prev, backward: true }))}
              onTouchEnd={() => setTouchControls(prev => ({ ...prev, backward: false }))}
              onMouseDown={() => setTouchControls(prev => ({ ...prev, backward: true }))}
              onMouseUp={() => setTouchControls(prev => ({ ...prev, backward: false }))}
              sx={{
                bgcolor: 'rgba(33, 150, 243, 0.9)',
                color: 'white',
                '&:active': { bgcolor: 'rgba(33, 150, 243, 1)' },
                fontSize: '24px',
                fontWeight: 700
              }}
            >
              ↓
            </IconButton>
            <Box />
          </Box>

          {/* Interact Button - Bottom Right */}
          {nearestStructure && (
            <IconButton
              onClick={() => setSelectedStructure(nearestStructure)}
              sx={{
                position: 'fixed',
                bottom: 80,
                right: 20,
                zIndex: 1000,
                width: 70,
                height: 70,
                bgcolor: 'rgba(76, 175, 80, 0.95)',
                color: 'white',
                fontSize: '20px',
                fontWeight: 700,
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.5)',
                '&:active': { 
                  bgcolor: 'rgba(76, 175, 80, 1)',
                  transform: 'scale(0.95)'
                },
              }}
            >
              E
            </IconButton>
          )}

          {/* Simple Info Display - Top Center */}
          <Paper
            elevation={3}
            sx={{
              position: 'fixed',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" fontWeight={600}>
              {nearestStructure ? `🎯 ${nearestStructure.label || 'Location'} - Press E` : '📍 Explore the village'}
            </Typography>
          </Paper>
        </>
      )}

      {/* Content Modal */}
      {selectedStructure && (
        <ContentModal
          structure={selectedStructure}
          onClose={() => setSelectedStructure(null)}
        />
      )}
    </>
  )
}
