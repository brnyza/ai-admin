import { Button } from '@mui/material'
import { RiFilterOffLine } from 'react-icons/ri'
interface CleanFilterButtonProps {
  onClick: () => void
}

export function CleanFilterButton({ onClick }: CleanFilterButtonProps) {
  return (
    <Button variant="contained" onClick={onClick} size="small" title="Limpar filtros">
      <RiFilterOffLine size={21} />
    </Button>
  )
}
