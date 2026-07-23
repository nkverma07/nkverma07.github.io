import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Stars, Text } from '@react-three/drei'
import { Box, Typography, IconButton, Card, CardMedia } from '@mui/material'
import { Close, ChevronLeft, ChevronRight, ZoomIn } from '@mui/icons-material'
import * as THREE from 'three'
import { useTheme } from '@mui/material/styles'

interface Gallery3DProps {
  images: string[]
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const theme = useTheme()
  
  const particlesCount = 1000
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        color={theme.palette.mode === 'dark' ? '#6366f1' : '#8b5cf6'}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

interface ImageCard3DProps {
  image: string
  position: [number, number, number]
  index: number
  onClick: () => void
}

function ImageCard3D({ image, position, index, onClick }: ImageCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [textureError, setTextureError] = useState(false)
  
  // Load texture with proper error handling
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(
      image,
      undefined,
      undefined,
      () => {
        console.error('Failed to load texture:', image)
        setTextureError(true)
      }
    )
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return tex
  }, [image])

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(elapsed * 0.4 + index) * 0.15
      meshRef.current.rotation.y = Math.sin(elapsed * 0.2 + index) * 0.05
      
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  return (
    <group position={position}>
      <group>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[3.5, 2.5]} />
          <meshStandardMaterial
            map={textureError ? undefined : texture}
            color={textureError ? '#6366f1' : '#ffffff'}
            roughness={0.2}
            metalness={0.6}
            emissive={hovered ? '#6366f1' : '#1e293b'}
            emissiveIntensity={hovered ? 0.6 : 0.1}
            toneMapped={false}
          />
        </mesh>
        
        {/* Enhanced Frame */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.7, 2.7, 0.15]} />
          <meshStandardMaterial
            color={hovered ? '#6366f1' : '#475569'}
            roughness={0.2}
            metalness={0.8}
            emissive={hovered ? '#6366f1' : '#1e293b'}
            emissiveIntensity={hovered ? 0.4 : 0.1}
          />
        </mesh>

        {/* Glow effect */}
        {hovered && (
          <pointLight position={[0, 0, 1.5]} intensity={5} color="#6366f1" distance={6} />
        )}
      </group>
    </group>
  )
}

function GalleryScene({ images, onImageClick }: { images: string[]; onImageClick: (index: number) => void }) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.15
    }
  })

  // Arrange images in a beautiful wave pattern
  const imagePositions = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(images.length))
    return images.map((_, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      const x = (col - cols / 2) * 4.5
      const z = (row - Math.floor(images.length / cols) / 2) * 3.5
      const y = Math.sin((col + row) * 0.5) * 1.5
      return [x, y, z] as [number, number, number]
    })
  }, [images])

  return (
    <>
      <ParticleField />
      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={1} />
      
      <group ref={groupRef}>
        {images.map((image, index) => (
          <ImageCard3D
            key={index}
            image={image}
            position={imagePositions[index]}
            index={index}
            onClick={() => onImageClick(index)}
          />
        ))}
      </group>

      {/* Ambient decorative elements */}
      <Text
        position={[0, 6, -8]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#6366f1"
      >
        🎉 Achievement Gallery
      </Text>
      
      {/* Decorative rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <ringGeometry args={[15, 16, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

export default function Gallery3D({ images }: Gallery3DProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [view3D, setView3D] = useState(true)
  const theme = useTheme()

  const handleImageClick = (index: number) => {
    setSelectedImage(index)
  }

  const handleClose = () => {
    setSelectedImage(null)
  }

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === null || prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedImage((prev) => (prev === null || prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      {view3D ? (
        <Box
          sx={{
            width: '100%',
            height: '700px',
            position: 'relative',
            borderRadius: 3,
            overflow: 'hidden',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
            boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
          }}
        >
          <Canvas camera={{ position: [0, 2, 18], fov: 75 }}>
            <ambientLight intensity={0.6} />
            <spotLight position={[15, 15, 15]} angle={0.3} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, -10, -5]} intensity={1.2} color="#6366f1" />
            <pointLight position={[10, -10, 5]} intensity={1.2} color="#8b5cf6" />
            
            <Environment preset="night" />
            
            <GalleryScene images={images} onImageClick={handleImageClick} />
            
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minDistance={8}
              maxDistance={35}
              autoRotate
              autoRotateSpeed={0.3}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>

          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              bgcolor: 'rgba(0,0,0,0.8)',
              color: 'white',
              px: 3,
              py: 1,
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.9)' },
            }}
            onClick={() => setView3D(false)}
          >
            <Typography variant="body2">📄 Grid View</Typography>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'rgba(0,0,0,0.8)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <Typography variant="body2" align="center">
              🖱️ Drag to rotate • Scroll to zoom • Click images to view fullscreen
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: 20,
              bgcolor: theme.palette.background.paper,
              px: 3,
              py: 1,
              borderRadius: 2,
              border: `2px solid ${theme.palette.primary.main}`,
              cursor: 'pointer',
              zIndex: 10,
              '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' },
            }}
            onClick={() => setView3D(true)}
          >
            <Typography variant="body2">🎨 3D View</Typography>
          </Box>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 2
          }}>
            {images.map((image, index) => (
              <Card
                key={index}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.5)',
                  },
                }}
                onClick={() => handleImageClick(index)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  alt={`Achievement ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    '.MuiCard-root:hover &': { opacity: 1 },
                  }}
                >
                  <ZoomIn sx={{ mr: 1 }} />
                  <Typography variant="caption">View Fullscreen</Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Fullscreen Modal */}
      {selectedImage !== null && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleClose}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'white',
              bgcolor: 'rgba(99, 102, 241, 0.2)',
              '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.4)' },
            }}
          >
            <Close />
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
            sx={{
              position: 'absolute',
              left: { xs: 10, md: 40 },
              color: 'white',
              bgcolor: 'rgba(99, 102, 241, 0.2)',
              '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.4)' },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <img
            src={images[selectedImage]}
            alt={`Achievement ${selectedImage + 1}`}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 0 50px rgba(99, 102, 241, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            sx={{
              position: 'absolute',
              right: { xs: 10, md: 40 },
              color: 'white',
              bgcolor: 'rgba(99, 102, 241, 0.2)',
              '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.4)' },
            }}
          >
            <ChevronRight />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.7)',
              px: 3,
              py: 1,
              borderRadius: 2,
            }}
          >
            <Typography variant="caption">
              {selectedImage + 1} / {images.length}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  )
}

