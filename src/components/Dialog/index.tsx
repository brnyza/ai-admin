import {
  Box,
  Dialog as DefaultDialog,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Button,
  CircularProgress,
  DialogProps
} from '@mui/material'
import { FC } from 'react'

interface DialogOptionsProps {
  label: string
  focus?: boolean
  cb(label: string): void
}

interface DialogCustomProps extends DialogProps {
  open: boolean
  title: string
  body: string
  options: DialogOptionsProps[]
  loading: boolean
}

const Dialog: FC<DialogCustomProps> = ({
  open,
  title,
  loading,
  body,
  options,
  ...rest
}) => {
  return (
    <DefaultDialog open={open} {...rest}>
      <Box sx={{ p: 2 }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
        <DialogContentText sx={{ px: '10px', textAlign: 'center', mb: 2 }}>
          {body}
        </DialogContentText>
        <DialogActions>
          {options.map((item, index) => {
            return (
              <Button
                key={index}
                onClick={() => item.cb(item.label)}
                variant={item.focus ? 'contained' : 'text'}
                sx={{
                  fontWeight: item.focus ? 'bold' : 'normal',
                  color: item.focus ? '#fff' : 'primary.main'
                }}
                disableElevation
                disabled={loading}
              >
                {loading && item.focus ? (
                  <CircularProgress size={25} color="inherit" />
                ) : (
                  <>{item.label}</>
                )}
              </Button>
            )
          })}
        </DialogActions>
      </Box>
    </DefaultDialog>
  )
}
export default Dialog
