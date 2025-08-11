// lib/theme.ts
'use client'

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // biru default
    },
    secondary: {
      main: '#ff9800', // oranye default
    },
  },
  shape: {
    borderRadius: 12,
  },
})

export default theme
