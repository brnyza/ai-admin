import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'
import { ReactNode } from 'react'

interface PDFContainerProps {
  orientation?: 'landscape' | 'portrait'
  children: ReactNode
}

export const PDFContainer = ({ children, orientation }: PDFContainerProps) => {
  return (
    <Box sx={{ bgcolor: grey[300], width: '100%' }}>
      <Box
        sx={{
          width: orientation === 'landscape' ? '30.3cm' : '21cm',
          minHeight: orientation === 'landscape' ? '40.6cm' : '29.7cm',
          margin: '0 auto',
          bgcolor: '#ffff'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
