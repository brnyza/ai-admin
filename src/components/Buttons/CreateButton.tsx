import { Button } from '@mui/material'
import { MdLibraryAdd } from 'react-icons/md'

interface CreateButtonProps {
  onClick: () => void
}

export function CreateButton({ onClick }: CreateButtonProps) {
  return (
    <Button variant="contained" onClick={onClick} size="small" title="Inserir">
      <MdLibraryAdd size={20} />
    </Button>
  )
}
