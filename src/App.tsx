import { useEffect } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Container, Box, AppBar, Toolbar, Typography, Button, Stack, Chip } from '@mui/material'
import { OpenInNew } from '@mui/icons-material'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { getTheme } from './theme/theme'
import ThemeToggle from './components/ThemeToggle'
import HeroSection from './components/sections/HeroSection'
import Gallery3D from './components/Gallery3D'
import { portfolioData } from './data/portfolioData'
import { Card, CardContent } from '@mui/material'
import { School, EmojiEvents, Download, Verified } from '@mui/icons-material'
import { initializeStructuredData } from './utils/structuredData'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function AppContent() {
  const { actualTheme } = useTheme()
  const theme = getTheme(actualTheme)
  // const [showCity, setShowCity] = useState(false)
  // const [showGame, setShowGame] = useState(false)

  // Initialize structured data for SEO
  useEffect(() => {
    initializeStructuredData()
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // GAME MODE AND CITY MODE DISABLED
  // If game mode is active, show the driving game
  /* if (showGame) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        
        <Tooltip title="Exit Village Mode">
          <IconButton
            onClick={() => setShowGame(false)}
            sx={{
              position: 'fixed',
              top: 20,
              left: 20,
              zIndex: 10001,
              bgcolor: 'rgba(255, 23, 68, 0.9)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 23, 68, 1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(255, 23, 68, 0.5)'
            }}
          >
            <Home fontSize="large" />
          </IconButton>
        </Tooltip>
        
        <DetailedVillage />
      </MuiThemeProvider>
    )
  }

  // If city mode is active, show only the city
  if (showCity) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        
        <Tooltip title="Exit City View">
          <IconButton
            onClick={() => setShowCity(false)}
            sx={{
              position: 'fixed',
              top: 20,
              left: 20,
              zIndex: 10001,
              bgcolor: 'rgba(99, 102, 241, 0.9)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(99, 102, 241, 1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)'
            }}
          >
            <Home fontSize="large" />
          </IconButton>
        </Tooltip>
        
        <InteractiveCity3D />
      </MuiThemeProvider>
    )
  } */

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Navigation Bar */}
      <AppBar 
        position="fixed" 
        elevation={2}
        sx={{ 
          backdropFilter: 'blur(20px)',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              cursor: 'pointer',
              color: theme.palette.text.primary,
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            NK
          </Typography>
          
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
            <Button 
              onClick={() => scrollToSection('about')}
              sx={{ 
                textTransform: 'none', 
                display: { xs: 'none', sm: 'inline-flex' },
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              About
            </Button>
            <Button 
              onClick={() => scrollToSection('skills')}
              sx={{ 
                textTransform: 'none', 
                display: { xs: 'none', sm: 'inline-flex' },
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              Skills
            </Button>
            <Button 
              onClick={() => scrollToSection('projects')}
              sx={{ 
                textTransform: 'none',
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              Projects
            </Button>
            <Button 
              onClick={() => scrollToSection('experience')}
              sx={{ 
                textTransform: 'none', 
                display: { xs: 'none', md: 'inline-flex' },
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              Experience
            </Button>
            <Button 
              onClick={() => scrollToSection('achievements')}
              sx={{ 
                textTransform: 'none', 
                display: { xs: 'none', sm: 'inline-flex' },
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              Achievements
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              sx={{ 
                textTransform: 'none',
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              Contact
            </Button>
            <ThemeToggle />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <HeroSection 
        // onExploreCity={() => setShowCity(true)}
        // onPlayGame={() => setShowGame(true)}
      />

      {/* About Section */}
      <Box id="about" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, backgroundColor: theme.palette.background.default, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
            About Me
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ maxWidth: '900px', mx: 'auto', lineHeight: 1.8, px: { xs: 2, sm: 0 } }}>
            Motivated and detail-oriented Flutter Developer with a strong grasp of mobile app development, AI/ML fundamentals, and backend integration using FastAPI. 
            Proficient in Firebase, Python, C++, Git, and Data Structures & Algorithms (DSA). Passionate about creating responsive, high-performance applications.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mt: 4 }}>
            {['8.06 CGPA in AI & DS', 'Runner-up in Hack Arya Verse', 'Full Stack Intern at mPass', '6+ Certifications'].map((highlight, idx) => (
              <Box key={idx} sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600}>{highlight}</Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box id="skills" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, backgroundColor: theme.palette.background.paper, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
            Skills
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Technical Skills
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {['Flutter', 'Firebase', 'Python', 'C++', 'FastAPI', 'MySQL', 'Git & GitHub', 'DSA', 'RESTful APIs', 'Dart'].map((skill, idx) => (
                <Box key={idx} sx={{ p: 2, bgcolor: theme.palette.background.default, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={600}>{skill}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Projects Section */}
      <Box id="projects" sx={{ 
        py: { xs: 6, sm: 8, md: 10 }, 
        px: { xs: 2, sm: 3 }, 
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            fontWeight={700}
            sx={{ 
              mb: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🚀 Featured Projects
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}
          >
            Innovative solutions built with modern technologies
          </Typography>
          
          <Stack spacing={{ xs: 3, sm: 4 }} sx={{ mt: 4 }}>
            {portfolioData.projects.map((project, idx) => {
              const icons = ['🌐', '🔳', '⬇️']
              const colors = ['#6366f1', '#10b981', '#f59e0b']
              return (
              <Box 
                key={idx} 
                sx={{ 
                  p: { xs: 3, sm: 4 },
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 3,
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                    : '0 8px 32px rgba(99, 102, 241, 0.15)',
                  border: `2px solid ${colors[idx]}30`,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? `0 12px 48px rgba(0, 0, 0, 0.6), 0 0 0 3px ${colors[idx]}40`
                      : `0 12px 48px ${colors[idx]}30, 0 0 0 3px ${colors[idx]}40`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${colors[idx]} 0%, ${colors[idx]}80 100%)`,
                  }
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                  <Box 
                    sx={{ 
                      fontSize: { xs: '48px', sm: '64px' },
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {icons[idx]}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h5" 
                      fontWeight={700} 
                      gutterBottom
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? '#ffffff' : '#1e293b',
                        mb: 2,
                      }}
                    >
                      {project.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{ 
                        color: theme.palette.text.secondary,
                        lineHeight: 1.8,
                        mb: 3,
                      }}
                    >
                      {project.description}
                    </Typography>
                    
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      flexWrap="wrap" 
                      useFlexGap
                      sx={{ gap: 1, mb: 3 }}
                    >
                      {project.technologies.map((tech, i) => (
                        <Chip
                          key={i}
                          label={tech}
                          size="medium"
                          sx={{ 
                            bgcolor: `${colors[idx]}20`,
                            color: colors[idx],
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            px: 1,
                            border: `1px solid ${colors[idx]}40`,
                            '&:hover': {
                              bgcolor: `${colors[idx]}30`,
                            }
                          }}
                        />
                      ))}
                    </Stack>

                    {/* Project Link Button */}
                    <Button
                      component="a"
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      startIcon={<OpenInNew />}
                      sx={{
                        background: colors[idx],
                        color: '#ffffff',
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        '&:hover': {
                          background: colors[idx],
                          opacity: 0.85,
                          transform: 'translateX(4px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      View Project
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )
            })}
          </Stack>
        </Container>
      </Box>

      {/* Experience Section */}
      <Box id="experience" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
            Experience
          </Typography>
          <Box sx={{ mt: 4, p: 3, bgcolor: theme.palette.background.default, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600}>Full Stack Developer Intern</Typography>
            <Typography variant="h6" color="primary">mPass Lobby Management Pvt. Ltd.</Typography>
            <Typography variant="body2" color="text.secondary">Jaipur, Rajasthan | June 2025 – July 2025</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" paragraph>• Built and optimized frontend using Flutter</Typography>
              <Typography variant="body1" paragraph>• Implemented state management with Provider</Typography>
              <Typography variant="body1" paragraph>• Improved UI performance with widget tree debugging</Typography>
              <Typography variant="body1">• Contributed to live projects and internal development tasks</Typography>
            </Box>
          </Box>
          
          {/* Certifications Section */}
          <Typography variant="h4" align="center" gutterBottom fontWeight={700} sx={{ mt: 6 }}>
            🎓 Certifications
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            My professional certifications and courses
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            mt: 2,
            perspective: '1000px'
          }}>
            {portfolioData.certifications.map((cert, idx) => {
              const categoryColors: { [key: string]: string } = {
                'AI/ML': '#f59e0b',
                'Programming': '#10b981',
                'Systems': '#ef4444',
                'Database': '#3b82f6',
                'Development': '#8b5cf6',
                'Platform': '#ec4899',
              };
              const categoryColor = categoryColors[cert.category] || '#6366f1';
              
              return (
              <Card key={idx} sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)`
                    : `linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.98) 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${categoryColor}30`,
                  boxShadow: `0 4px 20px ${categoryColor}20`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                  '&:hover': {
                    transform: 'translateY(-12px) rotateX(5deg)',
                    boxShadow: `0 20px 40px ${categoryColor}40, 0 0 20px ${categoryColor}20`,
                    border: `2px solid ${categoryColor}60`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${categoryColor}, transparent)`,
                    opacity: 0.8,
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          background: `linear-gradient(135deg, ${categoryColor}40, ${categoryColor}20)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                          boxShadow: `0 4px 12px ${categoryColor}30`
                        }}>
                          <School sx={{ color: categoryColor, fontSize: 24 }} />
                        </Box>
                        <Chip 
                          label={cert.category} 
                          size="small" 
                          sx={{
                            bgcolor: `${categoryColor}20`,
                            color: categoryColor,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            border: `1px solid ${categoryColor}40`,
                            boxShadow: `0 2px 8px ${categoryColor}20`
                          }}
                        />
                      </Box>
                      <Verified sx={{ color: '#10b981', fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight={700} sx={{
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)'
                        : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                      lineHeight: 1.3
                    }}>
                      {cert.title}
                    </Typography>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, fontWeight: 500 }}>
                        <Box component="span" sx={{ mr: 1 }}>🏢</Box> {cert.issuer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box component="span" sx={{ mr: 1 }}>📅</Box> {cert.date}
                      </Typography>
                    </Box>
                    {cert.credentialId && (
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        bgcolor: `${categoryColor}10`,
                        border: `1px solid ${categoryColor}30`,
                        mb: 2
                      }}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', fontFamily: 'monospace', fontWeight: 600 }}>
                          <Box component="span" sx={{ mr: 1 }}>🔑</Box> ID: {cert.credentialId}
                        </Typography>
                      </Box>
                    )}
                    {cert.pdfPath && (
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        startIcon={<Download />}
                        onClick={() => window.open(cert.pdfPath, '_blank')}
                        sx={{
                          mt: 'auto',
                          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                          color: 'white',
                          fontWeight: 700,
                          py: 1.2,
                          boxShadow: `0 4px 15px ${categoryColor}40`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${categoryColor}ee 0%, ${categoryColor}bb 100%)`,
                            boxShadow: `0 6px 20px ${categoryColor}60`,
                            transform: 'scale(1.02)'
                          }
                        }}
                      >
                        View Certificate
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Achievements & Gallery Section */}
      <Box id="achievements" sx={{ 
        py: { xs: 4, sm: 6, md: 8 }, 
        px: { xs: 2, sm: 3 },
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%)',
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom fontWeight={700} sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}>
            🎉 Achievements & Gallery
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6, px: { xs: 2, sm: 0 } }}>
            My achievements and accomplishments
          </Typography>

          {/* Achievements Cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 4,
            mb: 8,
            perspective: '1000px'
          }}>
            {portfolioData.achievements.map((achievement, idx) => (
              <Card key={idx} sx={{ 
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  background: achievement.highlight
                    ? theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
                    : theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)'
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: achievement.highlight ? '3px solid' : '2px solid',
                  borderColor: achievement.highlight ? 'warning.main' : 'primary.main',
                  boxShadow: achievement.highlight 
                    ? '0 8px 32px rgba(251, 191, 36, 0.3), 0 0 20px rgba(251, 191, 36, 0.2)'
                    : '0 4px 20px rgba(99, 102, 241, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                  '&:hover': {
                    transform: 'translateY(-16px) rotateX(3deg) scale(1.02)',
                    boxShadow: achievement.highlight 
                      ? '0 20px 50px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.3)'
                      : '0 12px 40px rgba(99, 102, 241, 0.3)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: achievement.highlight
                      ? 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)'
                      : 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s infinite',
                  },
                  '@keyframes shimmer': {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '16px',
                        background: achievement.highlight
                          ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                          : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: achievement.highlight
                          ? '0 8px 24px rgba(251, 191, 36, 0.4)'
                          : '0 8px 24px rgba(99, 102, 241, 0.3)',
                        animation: achievement.highlight ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%, 100%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.05)' },
                        }
                      }}>
                        {achievement.highlight ? (
                          <EmojiEvents sx={{ color: 'white', fontSize: 36 }} />
                        ) : (
                          <Verified sx={{ color: 'white', fontSize: 36 }} />
                        )}
                      </Box>
                      <Chip
                        label={achievement.date}
                        size="small"
                        sx={{
                          bgcolor: achievement.highlight ? 'warning.main' : 'primary.main',
                          color: 'white',
                          fontWeight: 700,
                          px: 2,
                          boxShadow: 2
                        }}
                      />
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight={700} sx={{
                      background: achievement.highlight
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                      lineHeight: 1.3
                    }}>
                      {achievement.title}
                    </Typography>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      border: '1px dashed',
                      borderColor: 'divider',
                      mb: 3
                    }}>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {achievement.description}
                      </Typography>
                    </Box>
                    {achievement.pdfPath && (
                      <Button
                        variant="contained"
                        size="medium"
                        startIcon={<Download />}
                        onClick={() => window.open(achievement.pdfPath, '_blank')}
                        sx={{
                          background: achievement.highlight
                            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: 'white',
                          fontWeight: 700,
                          py: 1.5,
                          px: 4,
                          boxShadow: achievement.highlight
                            ? '0 4px 20px rgba(251, 191, 36, 0.4)'
                            : '0 4px 20px rgba(99, 102, 241, 0.3)',
                          '&:hover': {
                            boxShadow: achievement.highlight
                              ? '0 6px 30px rgba(251, 191, 36, 0.6)'
                              : '0 6px 30px rgba(99, 102, 241, 0.5)',
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        View Certificate
                      </Button>
                    )}
                  </CardContent>
                </Card>
            ))}
          </Box>

          {/* Photo Gallery */}
          <Typography variant="h3" align="center" gutterBottom fontWeight={700} sx={{ 
            mt: 8, 
            mb: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            📸 3D Photo Gallery
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Navigate through my achievements in an immersive 3D space
          </Typography>
          <Gallery3D images={portfolioData.gallery} />
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 }, backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
            Get In Touch
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ px: { xs: 2, sm: 0 } }}>
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, feel free to reach out!
          </Typography>
          <Stack spacing={2} sx={{ mt: 4 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}>
              <Typography variant="h6">📧 Email</Typography>
              <Typography variant="body1" color="primary">narenderkumar.hut@gmail.com</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}>
              <Typography variant="h6">📱 Phone</Typography>
              <Typography variant="body1" color="primary">+91 9462835610</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}>
              <Typography variant="h6">📍 Location</Typography>
              <Typography variant="body1" color="primary">Jaipur, Rajasthan, India</Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, textAlign: 'center', backgroundColor: theme.palette.background.paper }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 Narender Kumar. Built with React, TypeScript & Material-UI
        </Typography>
      </Box>
    </MuiThemeProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
