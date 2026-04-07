// import IMask from 'imask'
import { OutlinedTextFieldProps, TextField } from '@mui/material'
import { useEffect } from 'react'
import { useIMask } from 'react-imask'

interface InputMaskProps extends Partial<OutlinedTextFieldProps> {
	name: string
	label: string
	mask: any
	onChangeValue?: (value: string, unmaskedValue: string) => void
}

export default function InputMask({ name, mask, value: controlledValue, onChangeValue, ...rest }: InputMaskProps) {
	const { ref, value, setValue, maskRef, unmaskedValue } = useIMask(mask as any, {
		onComplete: (...params) => {
			if (onChangeValue) onChangeValue(params[0], unmaskedValue)
		}
	})

	useEffect(() => {
		setValue(String(controlledValue))
	}, [controlledValue])

	return <TextField inputRef={ref} variant="outlined" fullWidth size="small" margin="dense" {...rest} />
}
