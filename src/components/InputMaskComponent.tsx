import { IMaskMixin } from 'react-imask'
import { TextField } from '@mui/material'

const InputMaskLocal = IMaskMixin(({ inputRef, ...props }) => <TextField inputRef={inputRef} variant="standard" fullWidth margin="normal" {...(props as any)} />)

export default InputMaskLocal
