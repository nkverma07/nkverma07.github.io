import React from 'react'
import {
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Box,
  Typography,
} from '@mui/material'
import {
  LightMode,
  DarkMode,
  SettingsBrightness,
} from '@mui/icons-material'
import { useTheme } from '../contexts/ThemeContext'
import type { ThemeMode } from '../contexts/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { mode, setMode } = useTheme()

  const handleThemeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ThemeMode | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
        Theme:
      </Typography>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleThemeChange}
        aria-label="theme toggle"
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            border: 1,
            px: 1.5,
            py: 0.5,
          },
        }}
      >
        <ToggleButton value="light" aria-label="light mode">
          <Tooltip title="Light Mode">
            <LightMode fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="dark" aria-label="dark mode">
          <Tooltip title="Dark Mode">
            <DarkMode fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="system" aria-label="system mode">
          <Tooltip title="System Mode">
            <SettingsBrightness fontSize="small" />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default ThemeToggle
