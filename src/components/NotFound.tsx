import React from 'react'
import { Box, Button, Container, Typography, useTheme, useMediaQuery } from '@mui/material'

/**
 * 404 Not Found Page
 * Displays when user navigates to non-existent routes
 */
const NotFound: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleGoHome = () => {
    window.location.href = '/'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e1e2e 0%, #282c34 50%, #1a1a2e 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #f5f7fa 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
          top: '-100px',
          right: '-100px',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.secondary.main}20 0%, transparent 70%)`,
          bottom: '-50px',
          left: '-50px',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: 'center',
            zIndex: 1,
            position: 'relative',
          }}
        >
          {/* Large 404 text */}
          <Typography
            variant="h1"
            sx={{
              fontSize: isMobile ? '6rem' : '10rem',
              fontWeight: 900,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 2,
              lineHeight: 1,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            404
          </Typography>

          {/* Heading */}
          <Typography
            variant="h3"
            sx={{
              marginBottom: 2,
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: isMobile ? '1.5rem' : '2rem',
            }}
          >
            Page Not Found
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              marginBottom: 4,
              color: theme.palette.text.secondary,
              fontSize: isMobile ? '1rem' : '1.1rem',
              lineHeight: 1.6,
              maxWidth: '400px',
              margin: '0 auto 2rem',
            }}
          >
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted. Let's get you back on track.
          </Typography>

          {/* Error code */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              marginBottom: 4,
              color: theme.palette.text.disabled,
              fontSize: '0.875rem',
              fontFamily: 'monospace',
            }}
          >
            Error Code: 404 • Resource Not Found
          </Typography>

          {/* Action buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'center',
              marginTop: 4,
            }}
          >
            <Button
              variant="contained"
              size={isMobile ? 'large' : 'large'}
              onClick={handleGoHome}
              sx={{
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Go to Home
            </Button>

            <Button
              variant="outlined"
              size={isMobile ? 'large' : 'large'}
              onClick={handleGoBack}
              sx={{
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? `${theme.palette.primary.main}15`
                    : `${theme.palette.primary.main}08`,
                  borderColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Go Back
            </Button>
          </Box>

          {/* Additional help text */}
          <Box
            sx={{
              marginTop: 6,
              padding: 3,
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                marginBottom: 1,
              }}
            >
              <strong>What can you do?</strong>
            </Typography>
            <Typography
              variant="caption"
              component="div"
              sx={{
                color: theme.palette.text.disabled,
                lineHeight: 1.8,
              }}
            >
              • Check if the URL is correct<br />
              • Try using the navigation menu<br />
              • Visit my social profiles for updates<br />
              • Contact me for assistance
            </Typography>
          </Box>
        </Box>
      </Container>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </Box>
  )
}

export default NotFound
