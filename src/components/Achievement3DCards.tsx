import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, MeshDistortMaterial, Sphere, Stars, Text } from '@react-three/drei'
import { Box, Typography, Button, Card, CardContent, Chip, Stack } from '@mui/material'
import { EmojiEvents, Stars as StarsIcon, Verified, PictureAsPdf } from '@mui/icons-material'
import * as THREE from 'three'
import { useTheme } from '@mui/material/styles'

interface Achievement {
  title: string
  description: string
  date: string
  highlight?: boolean
  pdfPath?: string
}

interface Achievement3DCardProps {
  achievement: Achievement
  position: [number, number, number]
  index: number
}

function Achievement3DCard({ achievement, position, index }: Achievement3DCardProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(elapsed * 0.6 + index) * 0.25
      meshRef.current.rotation.y = Math.sin(elapsed * 0.3) * 0.08
      
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  const handleViewCertificate = () => {
    if (achievement.pdfPath) {
      window.open(achievement.pdfPath, '_blank')
    }
  }

  return (
    <group position={position}>
      <group>
        {/* Glowing sphere background */}
        <Sphere args={[2, 32, 32]} position={[0, 0, -0.8]}>
          <MeshDistortMaterial
            color={achievement.highlight ? '#fbbf24' : '#6366f1'}
            attach="material"
            distort={0.5}
            speed={2.5}
            roughness={0.1}
            metalness={0.9}
            emissive={achievement.highlight ? '#fbbf24' : '#6366f1'}
            emissiveIntensity={0.6}
            transparent
            opacity={0.25}
          />
        </Sphere>

        {/* Card content */}
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[4.5, 3.5]} />
          <meshStandardMaterial
            color={achievement.highlight ? '#1e1b4b' : '#1e293b'}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.95}
            emissive={achievement.highlight ? '#fbbf24' : '#6366f1'}
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
          
          <Html
            transform
            distanceFactor={1.3}
            position={[0, 0, 0.01]}
            style={{ width: '420px', pointerEvents: 'auto' }}
            zIndexRange={[100, 0]}
          >
            <Card
              sx={{
                background: achievement.highlight
                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                backdropFilter: 'blur(30px)',
                border: achievement.highlight
                  ? '3px solid rgba(251, 191, 36, 0.6)'
                  : '2px solid rgba(99, 102, 241, 0.4)',
                borderRadius: 4,
                boxShadow: achievement.highlight
                  ? '0 15px 40px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3)'
                  : '0 10px 35px rgba(99, 102, 241, 0.4)',
                color: 'white',
                transition: 'all 0.4s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: achievement.highlight
                    ? '0 20px 50px rgba(251, 191, 36, 0.7)'
                    : '0 15px 45px rgba(99, 102, 241, 0.6)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  {achievement.highlight ? (
                    <EmojiEvents sx={{ color: '#fbbf24', fontSize: 40 }} />
                  ) : (
                    <StarsIcon sx={{ color: '#a78bfa', fontSize: 40 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    {achievement.highlight && (
                      <Chip 
                        label="🏆 MAJOR ACHIEVEMENT" 
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(251, 191, 36, 0.3)', 
                          color: '#fbbf24',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          mb: 0.5
                        }} 
                      />
                    )}
                    <Typography variant="caption" sx={{ color: '#a78bfa', display: 'block' }}>
                      📅 {achievement.date}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ 
                  color: achievement.highlight ? '#fbbf24' : '#ffffff',
                  textShadow: achievement.highlight 
                    ? '0 0 20px rgba(251, 191, 36, 0.8)' 
                    : '0 0 10px rgba(167, 139, 250, 0.6)',
                  mb: 1.5,
                  lineHeight: 1.3
                }}>
                  {achievement.title}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.95, mb: 2.5, lineHeight: 1.6 }}>
                  {achievement.description}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Verified sx={{ color: '#10b981', fontSize: 20 }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                    Verified Achievement
                  </Typography>
                </Stack>

                {achievement.pdfPath && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PictureAsPdf />}
                    onClick={handleViewCertificate}
                    sx={{
                      mt: 2,
                      background: achievement.highlight
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      '&:hover': {
                        background: achievement.highlight
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                      },
                    }}
                  >
                    View Certificate
                  </Button>
                )}
              </CardContent>
            </Card>
          </Html>
        </mesh>

        {/* Enhanced lighting */}
        {achievement.highlight && (
          <>
            <pointLight position={[0, 0, 2.5]} intensity={3} color="#fbbf24" distance={7} />
            <pointLight position={[2, 2, 1]} intensity={2} color="#6366f1" distance={5} />
          </>
        )}
      </group>
    </group>
  )
}

function BackgroundElements() {
  const theme = useTheme()
  
  return (
    <>
      {/* Floating geometric shapes */}
      {[...Array(8)].map((_, i) => (
        <group key={i} position={[
          Math.sin(i * 1.5) * 12,
          Math.cos(i * 1.8) * 6,
          -8 - i * 1.5
        ]}>
          <mesh>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial
              color={theme.palette.mode === 'dark' ? '#6366f1' : '#8b5cf6'}
              wireframe
              transparent
              opacity={0.25}
            />
          </mesh>
        </group>
      ))}
      
      {/* Particle stars */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {/* Title text */}
      <Text
        position={[0, 5.5, -5]}
        fontSize={1}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#6366f1"
      >
        🏆 Major Achievements
      </Text>
    </>
  )
}

interface Achievement3DCardsProps {
  achievements: Achievement[]
}

export default function Achievement3DCards({ achievements }: Achievement3DCardsProps) {
  const theme = useTheme()
  const isMobile = window.innerWidth < 768

  return (
    <Box
      sx={{
        width: '100%',
        height: isMobile ? 'auto' : '700px',
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #ddd6fe 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}
    >
      {isMobile ? (
        // Simple card layout for mobile
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} align="center" sx={{ 
            mb: 3,
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}>
            <EmojiEvents sx={{ fontSize: 32 }} />
            Major Achievements
          </Typography>

          <Stack spacing={3}>
            {achievements.map((achievement, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
                  borderRadius: 3,
                  p: 3,
                  border: achievement.highlight 
                    ? '3px solid #fbbf24' 
                    : `2px solid ${theme.palette.mode === 'dark' ? '#6366f1' : '#8b5cf6'}`,
                  boxShadow: achievement.highlight
                    ? '0 8px 32px rgba(251, 191, 36, 0.4)'
                    : '0 8px 32px rgba(99, 102, 241, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': achievement.highlight ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                  } : {},
                }}
              >
                {achievement.highlight && (
                  <Chip 
                    label="🏆 MAJOR ACHIEVEMENT" 
                    size="small"
                    sx={{ 
                      bgcolor: '#fbbf24',
                      color: '#000',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: '0.75rem',
                    }} 
                  />
                )}

                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                  {achievement.highlight ? (
                    <EmojiEvents sx={{ color: '#fbbf24', fontSize: 40 }} />
                  ) : (
                    <StarsIcon sx={{ color: '#a78bfa', fontSize: 40 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ 
                      mb: 1,
                      color: achievement.highlight 
                        ? '#fbbf24' 
                        : (theme.palette.mode === 'dark' ? '#ffffff' : '#1e293b'),
                    }}>
                      {achievement.title}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: theme.palette.mode === 'dark' ? '#a78bfa' : '#8b5cf6',
                      display: 'block',
                      fontWeight: 600,
                    }}>
                      📅 {achievement.date}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="body2" sx={{ 
                  mb: 2,
                  color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#475569',
                  lineHeight: 1.7,
                }}>
                  {achievement.description}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Verified sx={{ color: '#10b981', fontSize: 20 }} />
                  <Typography variant="caption" sx={{ 
                    color: '#10b981',
                    fontWeight: 600 
                  }}>
                    Verified Achievement
                  </Typography>
                </Stack>

                {achievement.pdfPath && (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PictureAsPdf />}
                    onClick={() => window.open(achievement.pdfPath, '_blank')}
                    sx={{
                      py: 1.5,
                      background: achievement.highlight
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      '&:hover': {
                        background: achievement.highlight
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    View Certificate
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      ) : (
        <Canvas camera={{ position: [0, 0, 14], fov: 75 }} shadows>
        <ambientLight intensity={0.5} />
        <spotLight position={[15, 15, 15]} angle={0.3} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-12, -10, -8]} intensity={1.2} color="#6366f1" />
        <pointLight position={[12, -10, 8]} intensity={1.2} color="#8b5cf6" />
        <pointLight position={[0, 10, 5]} intensity={1} color="#fbbf24" />

        <BackgroundElements />

        <group>
          {achievements.map((achievement, index) => (
            <Achievement3DCard
              key={index}
              achievement={achievement}
              position={[
                index * 5.5 - (achievements.length * 5.5) / 2 + 2.75,
                0,
                0
              ]}
              index={index}
            />
          ))}
        </group>

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
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(251, 191, 36, 0.3)',
          }}
        >
          <Typography variant="body2" align="center" fontWeight={600}>
            🖱️ Drag to explore • Hover over cards for interactive effects
          </Typography>
        </Box>
      </Canvas>
      )}
    </Box>
  )
}

