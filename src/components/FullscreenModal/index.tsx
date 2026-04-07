import {
  AppBar,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  Toolbar,
  Typography
} from '@mui/material'
import { Ref, forwardRef, ReactNode } from 'react'
import { MdClose } from 'react-icons/md'
import { TransitionProps } from '@mui/material/transitions'

type FullscreenModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: any
  },
  ref: Ref<unknown>
) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      {props.children}
    </Slide>
  )
})

export const FullscreenModal = ({
  open,
  onClose,
  children,
  title
}: FullscreenModalProps) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }} color="default" elevation={0}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <MdClose />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
