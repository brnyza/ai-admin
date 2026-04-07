import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import '@/styles/global.css'
import { AlertProvider } from '@bluemarble/bm-components'
import type { AppType } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Sidebar from '@/components/Sidebar'
import { AuthProvider } from '@/contexts/auth.context'
import { standardTheme } from '@/styles/theme'

const routesWithoutSideBar = ['']

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter()
  const shouldHideSidebar = routesWithoutSideBar.includes(router.pathname)
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
      </Head>
      <ThemeProvider theme={standardTheme}>
        <CssBaseline />
        <AlertProvider>
          <AuthProvider>
            <Box display="flex" sx={{ width: '100%', height: '100%' }}>
              {!shouldHideSidebar && <Sidebar />}
              <Box component="main" sx={{ flex: 1, overflow: 'auto', width: '100%', height: '100%' }}>
                <Component {...pageProps} />
              </Box>
            </Box>
          </AuthProvider>
        </AlertProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
