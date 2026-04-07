import { Tooltip, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { ReportCard } from './ReportCard'

export const Card = ({ title, value, corAzul, tooltip }: { title: string; value: string | ReactNode; corAzul?: boolean; tooltip?: ReactNode }) => (
  <ReportCard title={title} centered>
    <Tooltip title={tooltip}>
      <Typography fontSize={15} color={corAzul ? 'rgb(109, 172, 255)' : '#c9c9c9'} sx={{ textAlign: 'center' }}>
        {value}
      </Typography>
    </Tooltip>
  </ReportCard>
)
