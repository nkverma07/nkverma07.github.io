import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Environment, Stars, Text } from '@react-three/drei'
import { Box, Typography, Button, Stack, Chip } from '@mui/material'
import { PictureAsPdf, Download, Verified, School } from '@mui/icons-material'
import * as THREE from 'three'
import { useTheme } from '@mui/material/styles'

interface Certificate {
  title: string
  issuer: string
  date: string
  category: string
  pdfPath?: string
  credentialId?: string
}

interface CertificateCardProps {
  certificate: Certificate
  position: [number, number, number]
  rotation: [number, number, number]
  onClick: () => void
}

const categoryColors: { [key: string]: string } = {
  'AI/ML': '#f59e0b',
  'Programming': '#10b981',
  'Systems': '#ef4444',
  'Database': '#3b82f6',
  'Development': '#8b5cf6',
  'Platform': '#ec4899',
  'Mobile': '#06b6d4',
  'Data Science': '#a855f7',
}

function CertificateCard3D({ certificate, position, rotation, onClick }: CertificateCardProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const theme = useTheme()

  const categoryColor = categoryColors[certificate.category] || '#6366f1'

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(elapsed * 0.8 + position[0]) * 0.15
      
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  const handleViewCertificate = (e: any) => {
    e.stopPropagation()
    if (certificate.pdfPath) {
      window.open(certificate.pdfPath, '_blank')
    }
  }

  const handleDownload = (e: any) => {
    e.stopPropagation()
    if (certificate.pdfPath) {
      const link = document.createElement('a')
      link.href = certificate.pdfPath
      link.download = `${certificate.title.replace(/\s+/g, '_')}.pdf`
      link.click()
    }
  }

  return (
    <group>
      <group position={position} rotation={rotation}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[3, 3.5, 0.15]} />
          <meshStandardMaterial
            color={theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9'}
            roughness={0.2}
            metalness={0.8}
            emissive={categoryColor}
            emissiveIntensity={hovered ? 0.5 : 0.1}
          />
          
          {/* Certificate border/frame */}
          <mesh position={[0, 0, -0.08]}>
            <boxGeometry args={[3.2, 3.7, 0.1]} />
            <meshStandardMaterial
              color={categoryColor}
              roughness={0.1}
              metalness={1}
              emissive={categoryColor}
              emissiveIntensity={hovered ? 0.3 : 0.1}
            />
          </mesh>
          
          <Html
            transform
            distanceFactor={1.6}
            position={[0, 0, 0.08]}
            style={{
              width: '280px',
              pointerEvents: 'auto',
            }}
            zIndexRange={[100, 0]}
          >
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'transparent',
                color: 'white',
                borderRadius: 2,
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1.5 }}>
                <School sx={{ color: categoryColor, fontSize: 24 }} />
                <Chip
                  label={certificate.category}
                  size="small"
                  sx={{
                    bgcolor: categoryColor,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                  }}
                />
              </Stack>
              
              <Verified sx={{ color: '#10b981', fontSize: 32, mb: 1 }} />
              
              <Typography 
                variant="h6" 
                fontWeight={700} 
                sx={{ 
                  mb: 1.5, 
                  fontSize: '0.9rem',
                  lineHeight: 1.3,
                  color: 'white',
                  textShadow: `0 0 10px ${categoryColor}`,
                }}
              >
                {certificate.title}
              </Typography>
              
              <Typography variant="body2" display="block" sx={{ mb: 0.8, opacity: 0.95, fontWeight: 600 }}>
                🏢 {certificate.issuer}
              </Typography>
              
              <Typography variant="caption" display="block" sx={{ mb: 1.5, opacity: 0.9 }}>
                📅 {certificate.date}
              </Typography>

              {certificate.credentialId && (
                <Box sx={{ 
                  bgcolor: 'rgba(0,0,0,0.3)', 
                  p: 1, 
                  borderRadius: 1, 
                  mb: 1.5,
                  border: `1px solid ${categoryColor}40`
                }}>
                  <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                    🔑 ID: {certificate.credentialId}
                  </Typography>
                </Box>
              )}

              {certificate.pdfPath && (
                <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    startIcon={<PictureAsPdf />}
                    onClick={handleViewCertificate}
                    sx={{ 
                      fontSize: '0.75rem', 
                      py: 1,
                      background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                      fontWeight: 600,
                      boxShadow: `0 4px 15px ${categoryColor}40`,
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${categoryColor}ee 0%, ${categoryColor}bb 100%)`,
                        boxShadow: `0 6px 20px ${categoryColor}60`,
                      }
                    }}
                  >
                    View Certificate
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<Download />}
                    onClick={handleDownload}
                    sx={{ 
                      fontSize: '0.75rem', 
                      py: 0.8,
                      color: 'white', 
                      borderColor: categoryColor,
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: `${categoryColor}20`,
                        borderColor: categoryColor,
                      }
                    }}
                  >
                    Download PDF
                  </Button>
                </Stack>
              )}
            </Box>
          </Html>
        </mesh>

        {/* Glow effect on hover */}
        {hovered && (
          <pointLight position={[0, 0, 1.5]} intensity={2.5} color={categoryColor} distance={5} />
        )}
      </group>
    </group>
  )
}

interface Certificate3DCarouselProps {
  certificates: Certificate[]
}

function CertificateScene({ certificates }: { certificates: Certificate[] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const [autoRotate, setAutoRotate] = useState(true)

  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.15
    }
  })

  const radius = 6
  const angleStep = (Math.PI * 2) / certificates.length

  return (
    <>
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
      
      <Text
        position={[0, 5, -3]}
        fontSize={0.8}
        color="#6366f1"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#ffffff"
      >
        🎓 Professional Certifications
      </Text>
      
      <group ref={groupRef}>
        {certificates.map((cert, index) => {
          const angle = angleStep * index
          const x = Math.sin(angle) * radius
          const z = Math.cos(angle) * radius
          
          return (
            <CertificateCard3D
              key={index}
              certificate={cert}
              position={[x, 0, z]}
              rotation={[0, -angle, 0]}
              onClick={() => setAutoRotate(!autoRotate)}
            />
          )
        })}
      </group>
      
      {/* Decorative ring at bottom */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <ringGeometry args={[radius - 0.5, radius + 0.5, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

export default function Certificate3DCarousel({ certificates }: Certificate3DCarouselProps) {
  const theme = useTheme()
  const isMobile = window.innerWidth < 768

  return (
    <Box sx={{ 
      width: '100%', 
      height: isMobile ? 'auto' : '700px', 
      position: 'relative', 
      borderRadius: 3, 
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
    }}>
      {isMobile ? (
        // Simple card grid for mobile
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: 3,
          p: 3,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        }}>
          <Typography variant="h5" fontWeight={700} align="center" sx={{ 
            mb: 2,
            color: theme.palette.mode === 'dark' ? '#6366f1' : '#4f46e5',
          }}>
            🎓 Professional Certifications
          </Typography>
          {certificates.map((cert, index) => {
            const categoryColor = categoryColors[cert.category] || '#6366f1'
            return (
              <Box
                key={index}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
                  borderRadius: 3,
                  p: 3,
                  border: `3px solid ${categoryColor}`,
                  boxShadow: `0 8px 32px ${categoryColor}40`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <School sx={{ color: categoryColor, fontSize: 28 }} />
                  <Chip
                    label={cert.category}
                    size="small"
                    sx={{
                      bgcolor: categoryColor,
                      color: 'white',
                      fontWeight: 700,
                    }}
                  />
                  <Verified sx={{ color: '#10b981', fontSize: 24, ml: 'auto' }} />
                </Stack>

                <Typography variant="h6" fontWeight={700} sx={{ 
                  mb: 1.5,
                  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1e293b',
                }}>
                  {cert.title}
                </Typography>

                <Typography variant="body2" sx={{ 
                  mb: 1,
                  color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#475569',
                  fontWeight: 600 
                }}>
                  🏢 {cert.issuer}
                </Typography>

                <Typography variant="body2" sx={{ 
                  mb: 2,
                  color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                }}>
                  📅 {cert.date}
                </Typography>

                {cert.credentialId && (
                  <Box sx={{ 
                    bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f1f5f9',
                    p: 1.5,
                    borderRadius: 2,
                    mb: 2,
                    border: `1px solid ${categoryColor}40`
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                      fontSize: '0.75rem' 
                    }}>
                      🔑 ID: {cert.credentialId}
                    </Typography>
                  </Box>
                )}

                {cert.pdfPath && (
                  <Stack direction="column" spacing={1.5}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PictureAsPdf />}
                      onClick={() => window.open(cert.pdfPath, '_blank')}
                      sx={{
                        py: 1.5,
                        background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: `0 4px 20px ${categoryColor}40`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${categoryColor}ee 0%, ${categoryColor}bb 100%)`,
                        }
                      }}
                    >
                      View Certificate
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Download />}
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = cert.pdfPath!
                        link.download = `${cert.title.replace(/\s+/g, '_')}.pdf`
                        link.click()
                      }}
                      sx={{
                        py: 1.5,
                        color: categoryColor,
                        borderColor: categoryColor,
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        borderWidth: 2,
                        '&:hover': {
                          bgcolor: `${categoryColor}20`,
                          borderColor: categoryColor,
                          borderWidth: 2,
                        }
                      }}
                    >
                      Download PDF
                    </Button>
                  </Stack>
                )}
              </Box>
            )
          })}
        </Box>
      ) : (
        <Canvas 
          shadows 
          camera={{ position: [0, 2, 12], fov: 50 }}
        >
        
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.6} />
        <spotLight
          position={[15, 15, 15]}
          angle={0.3}
          penumbra={1}
          intensity={2.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-12, -8, -8]} intensity={1} color="#6366f1" />
        <pointLight position={[12, -8, -8]} intensity={1} color="#8b5cf6" />
        <pointLight position={[0, 12, 5]} intensity={0.8} color="#fbbf24" />
        
        <Environment preset="sunset" />
        
        <CertificateScene certificates={certificates} />
        
        {/* Background sphere */}
        <mesh position={[0, 0, -10]}>
          <sphereGeometry args={[18, 32, 32]} />
          <meshBasicMaterial
            color={theme.palette.mode === 'dark' ? '#0a0a0a' : '#f0f9ff'}
            side={THREE.BackSide}
          />
        </mesh>
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(0,0,0,0.8)',
            color: 'white',
            px: 3,
            py: 1,
            borderRadius: 2,
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(99, 102, 241, 0.4)',
          }}
        >
          <Typography variant="body2" align="center" fontWeight={600}>
            {certificates.length} Professional Certifications
          </Typography>
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
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          <Typography variant="body2" align="center">
            🖱️ Click cards to pause rotation • Hover for details • Auto-rotates every 8 seconds
          </Typography>
        </Box>
      </Canvas>
      )}
    </Box>
  )
}

