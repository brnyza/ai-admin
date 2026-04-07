import { BaseTextFieldProps } from '@mui/material'
import { InputAutocompleteCell } from '../GridInputAutocomplete'
import { InputTextCell } from '../GridInputText'
import { InputSelectCell, InputSelectCellProps } from '../GridSelect'

export interface GridInputProps extends BaseTextFieldProps {
	onDefaultValue?: (value: string) => string
}

export interface InputCellProps {
	currentValue: string
	defaultValue?: string
	inputProps?: GridInputProps
	type?: GridInputProps['type'] | 'select'
	select?: Omit<InputSelectCellProps, 'setCanSave' | 'onInputChange'>
	onInputChange: (value: string) => void
	setCanSave: (value: boolean) => void
}

export const InputCell = (props: InputCellProps) => {
	if (props.type === 'select' && props.select) return <InputSelectCell {...props.select} setCanSave={props.setCanSave} onInputChange={props.onInputChange} currentValue={props.currentValue} />
	if (props.type === 'autocomplete')
		return (
			<InputAutocompleteCell
				{...props.select}
				setCanSave={props.setCanSave}
				onInputChange={props.onInputChange}
				defaultValue={props.defaultValue}
				currentValue={props.currentValue}
				options={props.select?.options || []}
				label={props.select?.label || ''}
				value={props.currentValue}
			/>
		)

	return <InputTextCell {...props} />
}
