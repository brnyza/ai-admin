import { MdArrowBack, MdLocationOn } from 'react-icons/md'

import { useRouter } from 'next/router'

import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'

import { Spinner } from '../Spínner'
import Head from 'next/head'

type HeadingPageProps = {
  title: string
  shouldShowButtonBack?: boolean
  isLoadingData?: boolean
  location?: string
}

export function HeadingPage({
  title,
  shouldShowButtonBack = false,
  isLoadingData = false,
  location
}: HeadingPageProps) {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Stack
        sx={{
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
        direction="row"
        spacing={1}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {shouldShowButtonBack && (
            <Tooltip title="Voltar">
              <IconButton onClick={() => router.back()}>
                <MdArrowBack />
              </IconButton>
            </Tooltip>
          )}
          <Typography
            variant="h6"
            component="h1"
            fontWeight="bold"
            color="GrayText"
          >
            {title}
          </Typography>
          {isLoadingData && <Spinner />}
        </Box>

        {location && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgb(8, 145, 145, 0.4)',
              padding: '0.5rem',
              borderRadius: '0.25rem'
            }}
          >
            <MdLocationOn color="#089191" size="1.5rem" />
            <Typography sx={{ color: '#000' }}>{location}</Typography>
          </Box>
        )}
      </Stack>
    </>
  )
}
