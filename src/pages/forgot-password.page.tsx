import { Input, LargeButton, useAlert } from '@bluemarble/bm-components'
import { Box, Paper, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import Head from 'next/head'
import { useState } from 'react'
import { api } from '@/services/api'
import { getErrorMessage } from '@/utils/errorHandler'
import { withSSRGuest } from '@/utils/withSSRGuest'

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const { createAlert } = useAlert()

  async function handleSubmit({ email }: { email: string }) {
    setLoading(true)
    if (loading) return
    try {
      await api.post('/forgot-password', { email })
      createAlert('Email enviado com sucesso!', 'success')
    } catch (err) {
      createAlert(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Paper sx={{ maxWidth: 400, padding: 4 }}>
        <Head>
          <title>Esqueci minha senha</title>
        </Head>

        <Formik initialValues={{ email: '' }} onSubmit={handleSubmit}>
          {() => (
            <Form style={{ width: '100%' }}>
              <Typography sx={{ fontWeight: 'bold' }}>Digite o email cadastrado e enviaremos uma mensagem para redefinir a sua senha</Typography>
              <Input sx={{ my: 2 }} label="Email" name="email" />
              <LargeButton loading={loading} type="submit">
                Enviar email
              </LargeButton>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  )
}

export default ForgotPassword

export const getServerSideProps = withSSRGuest(async () => ({ props: {} }))
