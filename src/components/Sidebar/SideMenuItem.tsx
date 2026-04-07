import { Box, Collapse, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import * as Icons from 'react-icons/md'

interface SideMenuItemProps {
  to?: string
  title: string
  icon: any
  submenu?: { to: string; title: string }[]
  onClick?: () => void
  currentPage?: boolean
}

export const SideMenuItem = ({ to = '/', currentPage = false, title, icon, submenu, onClick }: SideMenuItemProps) => {
  const router = useRouter()

  const [menuState, setMenuState] = useState(false)
  const Icon: any = Icons

  function handleOpenMenu() {
    setMenuState(!menuState)
  }

  function handleNavigate(to: string) {
    if (onClick) onClick()
    router.push(to)
  }

  const NewIcon = Icon[icon]

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <ListItem
          onClick={() => (submenu ? handleOpenMenu() : handleNavigate(to))}
          // button
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'primary',
            filter: currentPage ? 'opacity(1)' : 'opacity(.5)',
            paddingLeft: 1.5,
            justifyContent: 'space-between',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: 'white' }}>
              <NewIcon />
            </IconButton>
            <Typography component="p" variant="subtitle2">
              {title}
            </Typography>
          </Box>
          {submenu && <IconButton sx={{ color: 'white' }}>{menuState ? <Icons.MdExpandLess /> : <Icons.MdExpandMore />}</IconButton>}
        </ListItem>
      </Box>
      {submenu && (
        <Collapse in={menuState}>
          <List
            sx={{
              paddingY: 0,
              maxHeight: 250,
              overflowY: 'auto',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '4px'
              }
            }}
          >
            {submenu.map((item, index) => {
              return (
                <ListItemButton key={index} sx={{ paddingLeft: 8, color: 'white' }} onClick={() => handleNavigate(item.to)}>
                  <Typography component="p" variant="subtitle2">
                    {item.title}
                  </Typography>
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>
      )}
    </>
  )
}
