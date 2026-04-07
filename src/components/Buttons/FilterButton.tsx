import { Button } from '@mui/material'
import { RiFilterLine } from 'react-icons/ri'

interface FilterButtonProps {
  onClick: () => void
}

export function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <Button variant="contained" onClick={onClick} size="small" title="Filtrar">
      <RiFilterLine size={20} />
    </Button>
  )
}
