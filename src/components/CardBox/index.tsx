import { Button, CircularProgress, Typography } from '@mui/material'
import Link from 'next/link'
import { FC, useState } from 'react'
import * as Icons from 'react-icons/md'

interface CardBoxProps {
  link: string
  name: string
  icon: string
  onClick?: (param: string) => void
}

const CardBox: FC<CardBoxProps> = ({ link, name, icon, onClick }) => {
  const [loading, setLoading] = useState(false)
  const SelectedIcon = Icons[icon]
  function handleClick() {
    if (link === '#') return
    if (onClick) onClick(link)
    setLoading(true)
  }
  return (
    <Link
      href={link}
      style={{
        textDecoration: 'none'
      }}
      onClick={handleClick}
    >
      <Button
        sx={{
          width: '100%',
          height: 150,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          color: 'GrayText',
          backgroundColor: 'white',
          ':hover': {
            backgroundColor: 'primary.light',
            color: '#fff',
            '.progress': {
              color: '#fff'
            }
          },
          position: 'relative',
          boxShadow:
            'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;'
        }}
        color="inherit"
        variant="contained"
      >
        {loading && (
          <CircularProgress
            className="progress"
            size={15}
            sx={{ top: 10, right: 10, position: 'absolute' }}
          />
        )}
        <SelectedIcon size={35} />

        <Typography component="h4" variant="h6" fontSize={15} fontWeight="bold">
          {name}
        </Typography>
        {link === '#' && (
          <Typography
            component="caption"
            color="#ee9945"
            variant="caption"
            fontSize={10}
            fontWeight="bold"
          >
            em breve
          </Typography>
        )}
      </Button>
    </Link>
  )
}
export default CardBox
