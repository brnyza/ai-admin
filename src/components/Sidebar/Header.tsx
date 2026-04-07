import { Box } from '@mui/material'
// import LogoIcon from '../LogoIcon'
import Image from 'next/image'
import logoImg from '@/assets/logo-branco.png'

export const Header = () => {
  return (
    <Box sx={{ paddingTop: 2 }}>
      <Box sx={{ paddingLeft: 1.8, pb: 1, display: 'flex', gap: 1.5 }}>
        <Image src={logoImg} alt="logo" width={35} height={35} />
        {/* <LogoIcon style={{ width: 155, fill: '#fff' }} /> */}
      </Box>
    </Box>
  )
}
