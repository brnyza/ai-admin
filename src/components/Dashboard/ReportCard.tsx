import { Box, Divider, Stack, Typography } from '@mui/material'

export const ReportCard = ({ children, title, centered, sx }: { children: React.ReactNode; title?: string; centered?: boolean; sx?: any }) => {
  const width = sx?.width ? sx?.width : '100%'
  const height = sx?.height ? sx?.height : '100%'
  return (
    <Stack sx={{ width, height, backgroundColor: '#1e1e1e', ...sx }}>
      {title && (
        <>
          <Typography color="#c9c9c9" fontSize={14} fontWeight={500} sx={{ pl: centered ? 0 : 1.3, pt: 0.5, textAlign: centered ? 'center' : 'left', height: '25px' }}>
            {title}
          </Typography>
          <Divider color="#707070" sx={{ mx: 0.5, height: '1px' }} />
        </>
      )}
      <Box sx={{ alignContent: 'center', height: title ? 'calc(100% - 26px)' : '100%', width: '100%' }}>{children}</Box>
    </Stack>
  )
}
