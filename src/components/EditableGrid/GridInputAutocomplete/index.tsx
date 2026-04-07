import { Autocomplete, TextField } from '@mui/material'

export interface InputAutocompleteCellProps {
  options: any[]
  label: string
  value: string
  setCanSave: (value: boolean) => void
  onInputChange: (value: string) => void
  currentValue?: string
  defaultValue?: string
}

export const InputAutocompleteCell = ({
  options,
  label,
  value,
  onInputChange,
  currentValue,
  defaultValue: ExternalDefaultValue
}: InputAutocompleteCellProps) => {
  const defaultValue = options.find(
    (option) =>
      String(option[value]) ===
      (String(currentValue) || String(ExternalDefaultValue))
  )

  const onChange = (_: any, newValue: any, reason: string) => {
    if (reason === 'clear') return
    onInputChange(newValue[value])
  }

  return (
    <Autocomplete
      defaultValue={defaultValue}
      options={options}
      onChange={onChange}
      getOptionLabel={(option) => option[label]}
      renderInput={(params) => <RenderInput {...params} />}
      isOptionEqualToValue={(a, b) => a?.[value] === b?.[value]}
    />
  )
}

const RenderInput = (params: any) => {
  return (
    <TextField
      {...params}
      autoFocus
      focused
      sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        borderRadius: 0,
        color: 'primary.main',
        p: 0
      }}
      inputProps={{
        ...params.inputProps,
        sx: {
          ...params.inputProps.sx,
          width: '100%',
          height: '100%',
          p: '0!important',
          pl: 2
        }
      }}
      InputProps={{
        ...params.InputProps,
        sx: {
          ...params.inputProps.sx,
          height: '100%',
          borderRadius: 0
        }
      }}
    />
  )
}
