import React from 'react'
import { Box, Container, Typography, Button, Stack, IconButton, useTheme as useMuiTheme } from '@mui/material'
import { GitHub, LinkedIn, Email, Phone, LocationOn, Download } from '@mui/icons-material'
import { portfolioData } from '../../data/portfolioData'

interface HeroSectionProps {
  onExploreCity?: () => void
  onPlayGame?: () => void
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  const theme = useMuiTheme()
  const { personal } = portfolioData

  const handleContactClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleProjectsClick = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a237e 0%, #0d1117 100%)'
          : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        py: { xs: 8, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            animation: 'fadeIn 1s ease-in',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(30px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              mb: 2,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #dc004e 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            {personal.name}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
              fontWeight: 600,
              mb: 1,
              color: theme.palette.text.primary,
            }}
          >
            {personal.title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              fontWeight: 400,
              mb: 4,
              color: theme.palette.text.secondary,
            }}
          >
            {personal.subtitle}
          </Typography>

          {/* Contact Info Quick View */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" color="primary" />
              <Typography variant="body2">{personal.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone fontSize="small" color="primary" />
              <Typography variant="body2">{personal.phone}</Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" color="primary" />
              <Typography variant="body2">Jaipur, India</Typography>
            </Box>
          </Stack>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleContactClick}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get In Touch
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleProjectsClick}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View Projects
            </Button>
            <Button
              variant="outlined"
              size="large"
              component="a"
              href={personal.resume}
              download={personal.resumeFileName}
              startIcon={<Download />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
                '&:hover': {
                  borderColor: theme.palette.secondary.main,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(244, 143, 177, 0.08)'
                    : 'rgba(220, 0, 78, 0.06)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Download Resume
            </Button>
          </Stack>

          {/* Social Links */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <IconButton
              component="a"
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'scale(1.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <GitHub fontSize="large" />
            </IconButton>
            <IconButton
              component="a"
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  color: '#0077b5',
                  transform: 'scale(1.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <LinkedIn fontSize="large" />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection
