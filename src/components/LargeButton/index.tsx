import { Button, ButtonProps, CircularProgress } from '@mui/material'
import { FC } from 'react'

interface LargeButtonProps extends ButtonProps {
  loading?: boolean
}

const LargeButton: FC<LargeButtonProps> = ({
  children,
  sx,
  loading,
  size = 'large',
  disabled,
  ...rest
}) => {
  return (
    <Button
      size={size}
      fullWidth
      variant="contained"
      sx={{
        boxShadow: 'none',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
        lineHeight: 1.2,
        ...sx
      }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <CircularProgress size={21} color="inherit" />
      ) : (
        <>{children}</>
      )}
    </Button>
  )
}
export default LargeButton
