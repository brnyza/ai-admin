import { IconButton, Stack, Tooltip, Typography } from '@mui/material'
import Head from 'next/head'
import Router from 'next/router'
import { MdArrowBack } from 'react-icons/md'

const TituloGlobal = ({ nome }: { nome: string }) => {
  return (
    <>
      <Head>
        <title>{nome}</title>
      </Head>
      <Stack sx={{ pt: 2 }} direction="row" alignItems="center" spacing={1}>
        <Tooltip title="Voltar">
          <IconButton
            onClick={() => Router.back()}
            sx={{
              svg: {
                width: '20px',
                height: '20px'
              }
            }}
          >
            <MdArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h6" component="h1" fontWeight="bold" color="GrayText">
          {nome}
        </Typography>
      </Stack>
    </>
  )
}

export { TituloGlobal }
