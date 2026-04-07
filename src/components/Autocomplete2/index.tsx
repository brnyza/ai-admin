import { type AutocompleteRenderInputParams, CircularProgress, Autocomplete as MuiAutocomplete, type AutocompleteProps as MuiAutocompleteProps, TextField, type TextFieldProps } from '@mui/material'
import { useField } from 'formik'
import { Fragment, type MouseEvent, type ReactNode, useEffect } from 'react'

type MuiAutocompleteBaseProps<T> = Omit<MuiAutocompleteProps<T, boolean, undefined, boolean>, 'renderInput' | 'getOptionLabel'>

interface AutocompleteWithoutProps<T> extends MuiAutocompleteBaseProps<T> {
  name?: never
  withFormik: false
  getOptionValue?: never
  label?: string
  required?: boolean
  getOptionLabel: (option: T) => string
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode
  textFieldProps?: TextFieldProps
}

interface AutocompleteWithFormikProps<T> extends MuiAutocompleteBaseProps<T> {
  name: string
  withFormik?: true
  required?: boolean
  label?: string
  option?: {
    label?: keyof T
    value?: keyof T
    key?: string
  }
  textFieldProps?: TextFieldProps
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode
  getOptionLabel?: (option: T) => string
  getOptionValue?: (option: T) => string | number
}

type AutocompleteProps<T> = AutocompleteWithoutProps<T> | AutocompleteWithFormikProps<T>

export function Autocomplete2<T>({ withFormik = true, name, getOptionValue, ...rest }: AutocompleteProps<T>) {
  if (withFormik) {
    return <FormikAutocomplete name={name as string} getOptionValue={getOptionValue} {...rest} />
  }
  return <BaseInput {...(rest as AutocompleteWithoutProps<T>)} />
}

function BaseInput<T>(props: Omit<AutocompleteWithoutProps<T>, 'withFormik'>) {
  return <MuiAutocomplete fullWidth renderInput={(params) => <TextField label={props.label} {...params} />} {...(props as any)} />
}

function FormikAutocomplete<T>({ getOptionValue, option, ...props }: Omit<AutocompleteWithFormikProps<T>, 'withFormik'>) {
  const [{ value, ...field }, meta, { setValue }] = useField({
    name: props.name,
    defaultValue: props.defaultValue as any,
  })

  const onChange = (_: MouseEvent, newValue: T) => {
    const value = option?.value
    if (getOptionValue) {
      setValue(getOptionValue(newValue))
    } else if (value) {
      setValue(newValue[value])
    } else setValue(newValue)
  }

  const getOptionLabel = (item: T) => {
    if (props?.getOptionLabel) return props.getOptionLabel(item)
    if (option?.label) return String(item[option.label])
    return '[getOptionLabel] error'
  }

  const isOptionEqualToValue = (a: T, b: T) => {
    const key = option?.key
    if (props?.isOptionEqualToValue) return props.isOptionEqualToValue(a, b)
    if (key) return a[key] === b[key]
    return Object.values(a as any)[0] === Object.values(b as any)[0]
  }

  useEffect(() => {
    if (value) return
    if (props.defaultValue) setValue(props.defaultValue)
  }, [props.defaultValue, value, setValue])

  return (
    <MuiAutocomplete
      getOptionLabel={getOptionLabel as any}
      renderInput={(params) => (
        <TextField
          error={Boolean(meta?.error)}
          helperText={meta?.error}
          {...params}
          {...field}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {props.loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
          label={props.label}
          required={props.required}
          autoFocus={props.autoFocus}
          {...props.textFieldProps}
        />
      )}
      value={(value as unknown as any) || null}
      onChange={onChange as unknown as any}
      isOptionEqualToValue={isOptionEqualToValue}
      {...props}
    />
  )
}
