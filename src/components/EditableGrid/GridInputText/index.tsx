import { TextField } from '@mui/material'
import { InputCellProps } from '../GridInput'

export const InputTextCell = ({ defaultValue, currentValue, inputProps = {}, onInputChange }: InputCellProps) => {
	const { onDefaultValue, ...rest } = inputProps
	const formattedDefaultValue = onDefaultValue ? onDefaultValue(currentValue ?? defaultValue ?? '') : (currentValue ?? defaultValue ?? '')

	return (
		<TextField
			focused
			autoFocus
			onChange={({ target }) => onInputChange(target.value)}
			sx={{
				width: '100%',
				height: '100%',
				position: 'absolute',
				left: 0,
				top: 0,
				borderRadius: 0,
				color: 'primary.main'
			}}
			InputProps={{ sx: { width: '100%', height: '100%', borderRadius: 0 } }}
			inputProps={{
				sx: { width: '100%', height: '100%', pl: 1, borderRadius: 0 }
			}}
			defaultValue={formattedDefaultValue}
			{...(rest as any)}
		/>
	)
}
