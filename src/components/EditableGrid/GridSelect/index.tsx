import { MenuItem, TextField } from '@mui/material'

export interface InputSelectCellProps {
  options: any[]
  label: string
  value: string
  setCanSave: (value: boolean) => void
  onInputChange: (value: string) => void
  currentValue?: string
}

export const InputSelectCell = ({
  options,
  label,
  value,
  setCanSave,
  onInputChange,
  currentValue
}: InputSelectCellProps) => {
  const defaultValue = options.find(
    (option) => option[value] === currentValue
  )?.[value]

  const onChange = (_: any, { props }: any) => {
    onInputChange(props.value)
  }

  return (
    <TextField
      defaultValue={defaultValue}
      autoFocus
      focused
      onChange={onChange as any}
      sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        borderRadius: 0,
        color: 'primary.main'
      }}
      inputProps={{
        sx: { width: '100%', height: '100%', p: 0, pl: 2 }
      }}
      InputProps={{
        sx: { height: '100%', borderRadius: 0 }
      }}
      SelectProps={
        {
          // onOpen: () => setCanSave(false),
          // onClose: () => setCanSave(true)
        }
      }
      select
    >
      {options.map((option) => (
        <MenuItem key={option[value]} value={option[value]}>
          {option[label]}
        </MenuItem>
      ))}
    </TextField>
  )
}
