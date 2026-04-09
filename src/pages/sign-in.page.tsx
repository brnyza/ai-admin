import { Input, LargeButton, useAlert } from '@bluemarble/bm-components'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import Head from 'next/head'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
// import backgroundImage from '@/assets/bg-login.png'
import logoImg from '@/assets/logo-site.png'
import { AuthContext } from '@/contexts/auth.context'
import { config } from '@/utils/config'
import { getErrorMessage } from '@/utils/errorHandler'
import { withSSRGuest } from '@/utils/withSSRGuest'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { createAlert } = useAlert()
  const { signIn } = useContext(AuthContext)

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    if (loading) return
    setLoading(true)

    try {
      const result = await signIn({ email, password })
      if (result) {
        createAlert('Login realizado com sucesso', 'success')
        router.push(config.PAGINA_APOS_LOGIN)
      }
    } catch (error) {
      createAlert(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="main" sx={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center' }}>
      <Head>
        <title>BM AI</title>
      </Head>
      <Box sx={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>{/* <Image src={backgroundImage} draggable={false} objectFit="cover" alt="Operação AGEO NR" quality={100} layout="responsive" /> */}</Box>
      <Paper
        sx={{
          px: 3,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 350,
          width: '100vw',
          margin: 'auto',
          zIndex: 1
        }}
        elevation={0}
      >
        <Box sx={{ m: 0, mb: 0 }}>
          <Image src={logoImg} alt="logo" objectFit="contain" width={430} height={230} />
        </Box>
        <Formik initialValues={{ email: '', password: '' }} onSubmit={handleSubmit}>
          {() => (
            <Form style={{ width: '100%' }}>
              <Stack gap={1} mt={1}>
                <Input id="email" label="Email" name="email" autoFocus />
                <Input name="password" label="Senha" type="password" id="password" autoComplete="current-password" />
                <Link href="/forgot-password" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" sx={{ color: 'primary.main' }}>
                    Recuperar Senha
                  </Typography>
                </Link>
              </Stack>
              <Stack direction="row" justifyContent="flex-end">
                <LargeButton sx={{ width: 140, py: 1.3 }} fullWidth={false} loading={loading} type="submit">
                  <Typography variant="body2" sx={{ textTransform: 'initial' }}>
                    Entrar
                  </Typography>
                </LargeButton>
              </Stack>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  )
}

export const getServerSideProps = withSSRGuest(async () => ({ props: {} }))
