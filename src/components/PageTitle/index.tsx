import { IconButton, Stack, Tooltip, Typography } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MdArrowBack } from 'react-icons/md'

type PageTitleProps = {
  title: string
  destination?: string
  showBackButton?: boolean
}

export const PageTitle = ({
  title,
  destination,
  showBackButton
}: PageTitleProps) => {
  const router = useRouter()

  const handleGoBack = () => {
    if (destination) router.push(destination)
    else router.back()
  }
  return (
    <Stack direction="row" alignItems="center" my={2}>
      {showBackButton && (
        <Tooltip title="Voltar">
          <IconButton onClick={handleGoBack}>
            <MdArrowBack />
          </IconButton>
        </Tooltip>
      )}
      <Head>
        <title>{title}</title>
      </Head>

      <Typography
        component="h1"
        variant="h6"
        fontWeight="bold"
        color="text.secondary"
      >
        {title}
      </Typography>
    </Stack>
  )
}
