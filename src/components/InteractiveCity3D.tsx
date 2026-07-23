import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Text, Sky, Stars, Html } from '@react-three/drei'
import { Box, Typography, IconButton, Paper, Chip, Stack, Button } from '@mui/material'
import { Close, School, Work, EmojiEvents, Code, Info, CardMembership } from '@mui/icons-material'
import * as THREE from 'three'
import { useTheme } from '@mui/material/styles'
import { portfolioData } from '../data/portfolioData'

// Building data structure
interface Building {
  id: string
  position: [number, number, number]
  size: [number, number, number]
  color: string
  label: string
  icon: any
  content: {
    title: string
    description: string
    items: any[]
  }
}

// Ground component
function Ground() {
  return (
    <>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 50, 50]} />
        <meshStandardMaterial 
          color="#1a472a"
          roughness={0.8}
        />
      </mesh>
      
      {/* Grid lines */}
      <gridHelper args={[200, 40, '#666666', '#444444']} position={[0, -0.4, 0]} />
      
      {/* Decorative grass patches */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 180,
            -0.3,
            (Math.random() - 0.5) * 180
          ]}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.1, 6]} />
          <meshStandardMaterial color="#2d5a2d" />
        </mesh>
      ))}
    </>
  )
}

// Anime-style building component
function Building({ building, onInteract }: { building: Building; onInteract: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = building.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    } else if (meshRef.current) {
      meshRef.current.position.y = building.position[1]
    }
  })

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default'
  }, [hovered])

  const roofColor = hovered ? '#ff6b9d' : '#c2410c'

  return (
    <group position={building.position}>
      {/* Main building body */}
      <mesh 
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onInteract}
      >
        <boxGeometry args={building.size} />
        <meshStandardMaterial 
          color={building.color}
          roughness={0.7}
          metalness={0.2}
          emissive={hovered ? building.color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Anime-style slanted roof */}
      <mesh 
        position={[0, building.size[1] / 2 + 1, 0]} 
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <coneGeometry args={[building.size[0] * 0.8, 2, 4]} />
        <meshStandardMaterial 
          color={roofColor}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, -building.size[1] / 2 + 1.5, building.size[2] / 2 + 0.01]}>
        <boxGeometry args={[1.5, 3, 0.2]} />
        <meshStandardMaterial color="#3b2414" />
      </mesh>

      {/* Windows */}
      {[-2, 2].map((x, i) => (
        <mesh key={i} position={[x, 1, building.size[2] / 2 + 0.02]}>
          <boxGeometry args={[1.2, 1.2, 0.1]} />
          <meshStandardMaterial 
            color={hovered ? '#ffeb3b' : '#4fc3f7'}
            emissive="#ffeb3b"
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>
      ))}

      {/* Floating label */}
      <Text
        position={[0, building.size[1] / 2 + 3.5, 0]}
        fontSize={0.8}
        color={hovered ? '#ffeb3b' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        {building.label}
      </Text>

      {/* Icon above building */}
      <Html position={[0, building.size[1] / 2 + 2.5, 0]} center>
        <Box sx={{ 
          bgcolor: 'rgba(0,0,0,0.7)', 
          borderRadius: '50%', 
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: hovered ? '2px solid #ffeb3b' : '2px solid transparent',
          transition: 'all 0.3s ease'
        }}>
          <building.icon sx={{ color: hovered ? '#ffeb3b' : '#fff', fontSize: 32 }} />
        </Box>
      </Html>

      {/* Glowing base when hovered */}
      {hovered && (
        <pointLight 
          position={[0, 0, 0]} 
          intensity={2} 
          distance={10} 
          color="#ffeb3b" 
        />
      )}
    </group>
  )
}

// Street lamps
function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 5, 8]} />
        <meshStandardMaterial color="#2c2c2c" metalness={0.8} />
      </mesh>
      
      {/* Lamp */}
      <mesh position={[0, 5.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#ffeb3b" 
          emissive="#ffeb3b" 
          emissiveIntensity={1}
        />
      </mesh>
      
      {/* Light */}
      <pointLight position={[0, 5, 0]} intensity={3} distance={15} color="#ffeb3b" castShadow />
    </group>
  )
}

// Trees
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
      
      {/* Foliage - anime style */}
      <mesh position={[0, 3, 0]}>
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#2d5a2d" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#3d6a3d" roughness={0.9} />
      </mesh>
    </group>
  )
}

// Floating particles/fireflies
function Fireflies() {
  const pointsRef = useRef<THREE.Points>(null!)
  
  const particles = useMemo(() => {
    const count = 100
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = Math.random() * 10 + 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    
    return positions
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(particles, 3))
    return geo
  }, [particles])

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.2} 
        color="#ffeb3b" 
        transparent 
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// First-person controller component
function CityScene({ buildings, onBuildingInteract }: { 
  buildings: Building[]
  onBuildingInteract: (building: Building) => void 
}) {
  const { camera } = useThree()
  const theme = useTheme()

  useEffect(() => {
    camera.position.set(0, 2, 20)
  }, [camera])

  // Street lamps positions
  const lampPositions: [number, number, number][] = [
    [-15, 0, -15], [15, 0, -15], [-15, 0, 15], [15, 0, 15],
    [-30, 0, 0], [30, 0, 0], [0, 0, -30], [0, 0, 30]
  ]

  // Trees positions
  const treePositions: [number, number, number][] = [
    [-25, 0, -25], [25, 0, -25], [-25, 0, 25], [25, 0, 25],
    [-35, 0, -10], [35, 0, -10], [-35, 0, 10], [35, 0, 10],
    [-10, 0, -35], [10, 0, -35], [-10, 0, 35], [10, 0, 35]
  ]

  return (
    <>
      {/* Sky and environment */}
      <Sky 
        sunPosition={[100, 20, 100]} 
        inclination={0.6}
        azimuth={0.25}
      />
      <Stars radius={300} depth={60} count={5000} factor={7} />
      <fog attach="fog" args={[theme.palette.mode === 'dark' ? '#0a0a0a' : '#87ceeb', 50, 200]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight 
        args={['#87ceeb', '#2d5a2d', 0.6]}
      />

      {/* Ground */}
      <Ground />

      {/* Buildings */}
      {buildings.map((building) => (
        <Building 
          key={building.id} 
          building={building} 
          onInteract={() => onBuildingInteract(building)}
        />
      ))}

      {/* Street lamps */}
      {lampPositions.map((pos, i) => (
        <StreetLamp key={`lamp-${i}`} position={pos} />
      ))}

      {/* Trees */}
      {treePositions.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} />
      ))}

      {/* Fireflies */}
      <Fireflies />

      {/* First-person controls */}
      <PointerLockControls makeDefault />
    </>
  )
}

// Content modal component
function ContentModal({ building, onClose }: { building: Building; onClose: () => void }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        overflow: 'auto'
      }}
      onClick={onClose}
    >
      <Paper
        sx={{
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          position: 'relative',
          boxShadow: '0 0 50px rgba(99, 102, 241, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(99, 102, 241, 0.2)',
            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.4)' }
          }}
        >
          <Close />
        </IconButton>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <building.icon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {building.content.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {building.content.description}
              </Typography>
            </Box>
          </Stack>

          {/* Render content based on building type */}
          <Stack spacing={3}>
            {building.content.items.map((item: any, index: number) => (
              <Paper key={index} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                {item.title && (
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.title || item.degree || item.role || item.name}
                  </Typography>
                )}
                
                {item.institution && (
                  <Typography variant="body2" color="primary" gutterBottom>
                    {item.institution || item.company || item.issuer}
                  </Typography>
                )}
                
                {item.description && (
                  <Typography variant="body1" paragraph>
                    {item.description || item.summary}
                  </Typography>
                )}
                
                {item.duration && (
                  <Typography variant="caption" color="text.secondary">
                    {item.duration || item.date}
                  </Typography>
                )}
                
                {item.score && (
                  <Chip label={item.score} size="small" sx={{ mt: 1 }} />
                )}
                
                {item.technologies && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                    {item.technologies.map((tech: string, i: number) => (
                      <Chip key={i} label={tech} size="small" color="primary" />
                    ))}
                  </Stack>
                )}

                {item.pdfPath && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CardMembership />}
                    href={item.pdfPath}
                    target="_blank"
                    sx={{ mt: 2 }}
                  >
                    View Certificate
                  </Button>
                )}
              </Paper>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

// Instructions overlay
function Instructions({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        p: 4,
        borderRadius: 3,
        border: '2px solid #6366f1',
        textAlign: 'center',
        zIndex: 1000,
        maxWidth: '500px'
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        🏙️ Welcome to Interactive Portfolio City!
      </Typography>
      <Typography variant="body1" paragraph sx={{ mt: 2 }}>
        Click anywhere to start exploring
      </Typography>
      <Stack spacing={1} sx={{ mt: 3, textAlign: 'left' }}>
        <Typography variant="body2">🖱️ <strong>Mouse:</strong> Look around</Typography>
        <Typography variant="body2">⌨️ <strong>WASD:</strong> Move forward/back/left/right</Typography>
        <Typography variant="body2">🏠 <strong>Click Buildings:</strong> View content inside</Typography>
        <Typography variant="body2">🌙 <strong>ESC:</strong> Exit pointer lock</Typography>
      </Stack>
    </Box>
  )
}

export default function InteractiveCity3D() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const theme = useTheme()

  // Define buildings with portfolio content
  const buildings: Building[] = useMemo(() => [
    {
      id: 'education',
      position: [-20, 4, -20],
      size: [8, 8, 8],
      color: '#3b82f6',
      label: '🎓 Education',
      icon: School,
      content: {
        title: 'Education & Learning',
        description: 'My academic journey and qualifications',
        items: portfolioData.education
      }
    },
    {
      id: 'experience',
      position: [20, 4, -20],
      size: [8, 8, 8],
      color: '#8b5cf6',
      label: '💼 Experience',
      icon: Work,
      content: {
        title: 'Work Experience',
        description: 'Professional roles and internships',
        items: portfolioData.experience
      }
    },
    {
      id: 'projects',
      position: [-20, 4, 20],
      size: [8, 8, 8],
      color: '#10b981',
      label: '🚀 Projects',
      icon: Code,
      content: {
        title: 'Projects Portfolio',
        description: 'Innovative solutions and applications',
        items: portfolioData.projects
      }
    },
    {
      id: 'certifications',
      position: [20, 4, 20],
      size: [8, 8, 8],
      color: '#f59e0b',
      label: '📜 Certificates',
      icon: CardMembership,
      content: {
        title: 'Certifications',
        description: 'Professional certifications and achievements',
        items: portfolioData.certifications
      }
    },
    {
      id: 'achievements',
      position: [0, 4, -10],
      size: [8, 8, 8],
      color: '#ef4444',
      label: '🏆 Achievements',
      icon: EmojiEvents,
      content: {
        title: 'Achievements',
        description: 'Awards and recognitions',
        items: portfolioData.achievements
      }
    },
    {
      id: 'about',
      position: [0, 5, 10],
      size: [10, 10, 10],
      color: '#ec4899',
      label: '👤 About Me',
      icon: Info,
      content: {
        title: 'About Me',
        description: portfolioData.about.summary,
        items: portfolioData.about.highlights.map(h => ({ title: h }))
      }
    }
  ], [])

  const handleBuildingInteract = (building: Building) => {
    setSelectedBuilding(building)
  }

  const handleCanvasClick = () => {
    setShowInstructions(false)
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#87ceeb'
      }}
    >
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        onClick={handleCanvasClick}
      >
        <CityScene buildings={buildings} onBuildingInteract={handleBuildingInteract} />
      </Canvas>

      {/* Instructions */}
      <Instructions show={showInstructions} />

      {/* Content Modal */}
      {selectedBuilding && (
        <ContentModal 
          building={selectedBuilding} 
          onClose={() => setSelectedBuilding(null)} 
        />
      )}

      {/* Mini map indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          p: 2,
          borderRadius: 2,
          border: '2px solid #6366f1'
        }}
      >
        <Typography variant="caption" fontWeight={600}>
          🗺️ Explore the city and click buildings to discover content!
        </Typography>
      </Box>
    </Box>
  )
}
