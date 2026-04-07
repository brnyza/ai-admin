import { Modal as ModalContainer, Box, ModalProps } from '@mui/material'
import { FC } from 'react'

interface ModalCustomProps extends ModalProps {
  open: boolean
  onClose: (value: boolean) => void
}

export const Modal: FC<ModalCustomProps> = ({
  open,
  onClose,
  children,
  ...rest
}) => {
  return (
    <ModalContainer
      open={open}
      onClose={() => onClose(false)}
      disableEnforceFocus
      {...rest}
    >
      <Box
        sx={{
          outline: 'none',
          backgroundColor: 'white',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 1
        }}
      >
        {children}
      </Box>
    </ModalContainer>
  )
}
