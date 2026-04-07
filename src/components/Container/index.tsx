import { Container as MaterialContainer, ContainerProps } from '@mui/material'
import { FC } from 'react'

export const Container: FC<ContainerProps> = ({ children, ...rest }) => {
  return <MaterialContainer {...rest}>{children}</MaterialContainer>
}
