import {
  FormControl,
  InputLabel,
  Select as DefaultSelect,
  SelectProps
} from '@mui/material'
import { FC } from 'react'

export const Select: FC<SelectProps> = ({
  children,
  name = '',
  fullWidth,
  label,
  ...props
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      size="small"
      margin="dense"
      sx={{ m: 0 }}
    >
      <InputLabel id={name}>{label}</InputLabel>
      <DefaultSelect
        labelId={name}
        id={name}
        name={name}
        fullWidth={fullWidth}
        label={label}
        MenuProps={{
          sx: {
            zIndex: 9999
          }
        }}
        {...props}
      >
        {children}
      </DefaultSelect>
    </FormControl>
  )
}
