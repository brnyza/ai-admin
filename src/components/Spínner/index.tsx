import { Box, CircularProgress } from '@mui/material'

interface SpinnerProps {
  size?: number
}

export function Spinner({ size = 20 }: SpinnerProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress size={size} />
    </Box>
  )
}
