import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

function AnimatedParticles() {
  const ref = useRef<THREE.Points>(null!)
  const { mouse } = useThree()
  const theme = useTheme()

  const particleCount = 3000
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
      
      // Color
      const color = theme.palette.mode === 'dark' 
        ? new THREE.Color('#6366f1') 
        : new THREE.Color('#8b5cf6')
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return { positions, colors }
  }, [theme.palette.mode])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (ref.current) {
      ref.current.rotation.x = time * 0.05
      ref.current.rotation.y = time * 0.075
      
      // Mouse interaction
      ref.current.rotation.x += mouse.y * 0.05
      ref.current.rotation.y += mouse.x * 0.05
      
      // Wave effect
      const positions = ref.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const z = positions[i3 + 2]
        positions[i3 + 1] = Math.sin(x * 0.1 + time) * 2 + Math.cos(z * 0.1 + time) * 2
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3))
    return geo
  }, [particles])

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function FloatingGeometry({ position, geometry, color }: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { mouse } = useThree()

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      
      meshRef.current.rotation.x = time * 0.3 + mouse.y * 2
      meshRef.current.rotation.y = time * 0.2 + mouse.x * 2
      meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 2
      
      // Scale pulse
      const scale = 1 + Math.sin(time * 2) * 0.1
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry === 'torus' && <torusGeometry args={[1, 0.3, 16, 100]} />}
      {geometry === 'octahedron' && <octahedronGeometry args={[1.5, 0]} />}
      {geometry === 'icosahedron' && <icosahedronGeometry args={[1.2, 0]} />}
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.3}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

interface Interactive3DBackgroundProps {
  height?: string
  intensity?: 'low' | 'medium' | 'high'
}

export default function Interactive3DBackground({ 
  height = '100vh', 
  intensity = 'medium' 
}: Interactive3DBackgroundProps) {
  const theme = useTheme()

  const geometries = useMemo(() => {
    const count = intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8
    const items = []
    
    for (let i = 0; i < count; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20 - 20
        ],
        geometry: ['torus', 'octahedron', 'icosahedron'][Math.floor(Math.random() * 3)],
        color: theme.palette.mode === 'dark' 
          ? ['#6366f1', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 3)]
          : ['#8b5cf6', '#a78bfa', '#c084fc'][Math.floor(Math.random() * 3)]
      })
    }
    
    return items
  }, [intensity, theme.palette.mode])

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <AnimatedParticles />
        
        {geometries.map((item, index) => (
          <FloatingGeometry
            key={index}
            position={item.position}
            geometry={item.geometry}
            color={item.color}
          />
        ))}
      </Canvas>
    </Box>
  )
}

