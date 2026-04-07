import { useAlert } from '@bluemarble/bm-components'
import { Box, Drawer, Skeleton, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { type FC, useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '@/contexts/auth.context'
import { api } from '@/services/api'
import { getErrorMessage } from '@/utils/errorHandler'
import { BottomBar } from './BottomBar'
import { Footer } from './Footer'
import { Header } from './Header'
import { SideMenuItem } from './SideMenuItem'

interface MenuAppsResponse {
  display_name: string
  icon: string
  id: number
  module_id: number
  order: number
  url: string
  visible: boolean
}

interface ApplicationsProps {
  id: number
  display_name: string
  module_id: number
  icon: string
  url: string
  order: number
  visible: boolean
  subs?: {
    to: string
    title: string
  }[]
}

function formatMenu(data: MenuAppsResponse[]) {
  let subs = data.filter((item) => item.display_name.split('/').length > 1 && item.visible)
  const menus = data.filter((item) => item.display_name.split('/').length < 2 && item.visible)

  subs = subs.sort((a, b) => {
    return a.order - b.order || a.display_name.localeCompare(b.display_name)
  })

  let formattedMenu: ApplicationsProps[] = []

  for (const index in menus) {
    const item = menus[index]
    const filteredSubs = subs.filter((sub) => sub.display_name.split('/')[0] === item?.display_name)
    const formattedSubMenus = filteredSubs.map((item) => ({
      to: item.url,
      title: item.display_name.split('/')[1] || ''
    }))

    if (formattedSubMenus.length > 0) formattedMenu.push({ ...item, subs: formattedSubMenus } as ApplicationsProps)
    else if (item) formattedMenu.push(item)
  }

  formattedMenu = formattedMenu.sort((a, b) => {
    return a.order - b.order || a.display_name.localeCompare(b.display_name)
  })
  return formattedMenu
}

const Sidebar: FC = () => {
  const [loading, setLoading] = useState(false)
  const [, forceRender] = useState(0)
  const drawerStatus = useRef<string>('Close')
  const [menu, setMenu] = useState<ApplicationsProps[]>([])

  const { createAlert } = useAlert()
  const { signOut, user, showSidebar } = useContext(AuthContext)
  const router = useRouter()
  const { sidebar } = router.query

  const mobile = useMediaQuery('(max-width: 500px)')

  async function getMenuApps() {
    setLoading(true)
    try {
      const { data } = await api.get<MenuAppsResponse[]>('/apps/menu')
      const formattedMenu = formatMenu(data)
      setMenu(formattedMenu)
    } catch (error) {
      createAlert(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
  }
  function mudaDrawerStatus(valor: 'Open' | 'Close') {
    drawerStatus.current = valor
    forceRender((prev) => prev + 1)
  }
  const valorMin = sidebar === 'hidden' ? 25 : 65
  function mouseMove(e: any) {
    if (mobile) return
    if (drawerStatus.current === 'Close' && e.clientX < valorMin) mudaDrawerStatus('Open')
    if (drawerStatus.current === 'Open' && e.clientX >= 200) mudaDrawerStatus('Close')
  }

  function getMenuWidth(): string {
    if (drawerStatus.current === 'Close') {
      if (sidebar === 'hidden' || mobile) return '0px'
      return '65px'
    }
    if (drawerStatus.current === 'Open') {
      if (mobile) return '70vw'
      return '200px'
    }
    return '0px'
  }
  const handleNavigateToTickets = async () => {
    try {
      const { data } = await api.get('/connection-chamadosbm')
      const win = window.open(data.url, '_blank')
      win?.focus()
    } catch (error) {
      createAlert(getErrorMessage(error), 'error')
    }
  }
  useEffect(() => {
    if (user) getMenuApps()
  }, [user])

  useEffect(() => {
    if (mobile) {
      return () => {
        window.removeEventListener('mousemove', mouseMove, true)
      }
    }
    if (!mobile) {
      window.addEventListener('mousemove', mouseMove, true)
    }
    return () => {
      window.removeEventListener('mousemove', mouseMove, true)
    }
  }, [sidebar, mobile])

  if (!user || !showSidebar) return <div />

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: getMenuWidth()
        }}
        PaperProps={{
          sx: {
            width: getMenuWidth(),
            transition: 'all ease 150ms',
            backgroundColor: 'primary.main',
            display: 'grid',
            gridTemplateRows: '80px calc(100% - 80px - 60px)',
            overflowX: 'hidden'
          }
        }}
      >
        <Header />
        <Box
          sx={{
            height: '100%',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none' // Oculta o scrollbar no WebKit
            },
            '&::-ms-scrollbar': {
              display: 'none' // Oculta o scrollbar no IE e Edge
            }
          }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    ml: 2,
                    gap: 1,
                    alignItems: 'center'
                  }}
                >
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton width="75%" height={45} />
                </Box>
              )
            })
          ) : (
            <>
              {menu.map((item, index) => {
                const submenus: any = item?.subs

                if (submenus) {
                  return <SideMenuItem key={index} title={item.display_name} to={item.url} icon={item.icon} submenu={submenus} onClick={() => mudaDrawerStatus('Close')} />
                }

                return <SideMenuItem key={index} title={item.display_name} to={item.url} currentPage={router.asPath.startsWith(item.url) && item.url !== '/'} icon={item.icon} onClick={() => mudaDrawerStatus('Close')} />
              })}
              <SideMenuItem title="ChamadosBM" icon="MdCall" onClick={handleNavigateToTickets} />
            </>
          )}
        </Box>
        {user && <Footer user={user} signOut={signOut} />}
      </Drawer>
      {mobile && drawerStatus.current === 'Open' && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.4)'
          }}
          onClick={() => mudaDrawerStatus('Close')}
        />
      )}
      {mobile && <BottomBar handleOpenMenu={() => mudaDrawerStatus('Open')} />}
    </>
  )
}
export default Sidebar
