import { TableCell, TableCellProps, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import { ColumnsProps } from '.'
import { InputCell } from './GridInput'

interface GridCellProps {
  focusedIndex: {
    x: number
    y: number
  }
  rowIndex: number
  columnIndex: number
  isEditing: boolean
  value: any
  bordered?: boolean
  onClick: () => void
  onDoubleClick: () => void
  onInputChange: (value: string) => void
  setCanSave: (value: boolean) => void
  canEditTable: boolean

  tableCellProps?: TableCellProps
  validationErrors?: string[]

  column: ColumnsProps<any>
}

export const GridCell = ({
  value,
  focusedIndex,
  canEditTable,
  columnIndex,
  rowIndex,
  isEditing,
  onInputChange,
  bordered,
  onClick,
  onDoubleClick,
  setCanSave,
  tableCellProps,
  validationErrors,
  column
}: GridCellProps) => {
  const formattedValue = column?.formatLabelValue
    ? column?.formatLabelValue(value)
    : value
  const isFocused =
    focusedIndex.y === rowIndex && focusedIndex.x === columnIndex
  const canEdit = isEditing && isFocused
  const withOthersStyles = () => {
    let result: any = {}

    if (bordered) {
      result = {
        border: '1px solid',
        borderColor: 'divider'
      }
    }
    if (isFocused && !canEdit && canEditTable) {
      result = {
        ...result,
        outline: '2px solid',
        color: 'primary.main',
        outlineColor: 'inherit'
      }
    }

    if (canEdit) {
      result = {
        ...result,
        p: 0
      }
    }

    if (validationErrors?.includes(column?.name as string)) {
      result = {
        bgcolor: red[100]
      }
    }

    return result
  }
  return (
    <TableCell
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      {...tableCellProps}
      sx={{
        position: 'relative',
        ...tableCellProps?.sx,
        ...withOthersStyles()
      }}
    >
      {canEdit ? (
        <InputCell
          select={column?.select}
          type={column?.type}
          inputProps={column?.inputProps}
          defaultValue={column?.newRow?.defaultValue}
          currentValue={value}
          onInputChange={onInputChange}
          setCanSave={setCanSave}
        />
      ) : (
        <Typography variant="body2" color="initial">
          {formattedValue}
        </Typography>
      )}
    </TableCell>
  )
}
