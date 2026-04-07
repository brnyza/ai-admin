import { IconButton, Paper, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { MdHome, MdMenu } from 'react-icons/md'

interface BottomBarProps {
  handleOpenMenu: () => void
}

export const BottomBar = ({ handleOpenMenu }: BottomBarProps) => {
  const router = useRouter()
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        py: 1,
        zIndex: 2
      }}
    >
      <Stack direction="row" justifyContent="space-around">
        <IconButton onClick={handleOpenMenu}>
          <MdMenu />
        </IconButton>
        <IconButton onClick={() => router.push('/')}>
          <MdHome />
        </IconButton>
      </Stack>
    </Paper>
  )
}
