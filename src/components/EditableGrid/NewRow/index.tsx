import { TableCell, TableRow } from '@mui/material'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ColumnsProps } from '..'
import { GridCell } from '../GridCell'

interface NewRowProps {
  columns: ColumnsProps<any>[]
  hasCheckbox: boolean
  maxPositions: { x: number; y: number }
  onSaveNewRow: (prop: any) => void
}

export const NewRow = ({
  columns,
  hasCheckbox,
  maxPositions,
  onSaveNewRow
}: NewRowProps) => {
  const [focusedIndex, setFocusedIndex] = useState({ x: 0, y: 0 })
  const newRowValues = useRef({})
  const [validationError, setValidationError] = useState<string[]>([])
  const onInputChange = (prop: string, value: string) => {
    newRowValues.current = { ...newRowValues.current, [prop]: value }
  }

  const getDefaultRowValues = () => {
    const defaultNewRow = {}
    columns.forEach((column) => {
      defaultNewRow[column.name] = column?.newRow?.defaultValue || undefined
    })
    return defaultNewRow
  }

  const saveRow = () => {
    const requiredColumns = columns.filter((column) => column.required)
    let isRequiredsFilled = true

    requiredColumns.forEach((column) => {
      if (
        !newRowValues.current?.[column.name] ||
        newRowValues.current?.[column.name]?.trim() === ''
      )
        isRequiredsFilled = false
    })

    if (!isRequiredsFilled) {
      setValidationError(
        requiredColumns.map((column) => column?.name as string)
      )
      return
    }

    onSaveNewRow(newRowValues.current)
    newRowValues.current = getDefaultRowValues()

    setFocusedIndex({ x: 0, y: 0 })
    setValidationError([])
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    const canMoveRight = focusedIndex.x + 1 <= maxPositions.x
    const canMoveLeft = focusedIndex.x - 1 >= 0

    const { key, shiftKey } = event
    if (key === 'Enter') {
      event.preventDefault()
      saveRow()
    } else if (shiftKey && key === 'Tab') {
      event.preventDefault()
      setFocusedIndex({
        y: 0,
        x: canMoveLeft ? focusedIndex.x - 1 : focusedIndex.x
      })
    } else if (key === 'Tab') {
      event.preventDefault()
      setFocusedIndex({
        y: 0,
        x: canMoveRight ? focusedIndex.x + 1 : focusedIndex.x
      })
    }
  }

  useEffect(() => {
    newRowValues.current = getDefaultRowValues()
  }, [])

  return (
    <TableRow onKeyDown={onKeyDown}>
      {hasCheckbox && <TableCell padding="checkbox" />}
      {columns
        .filter((columns) => columns.visible !== false)
        .map((column, columnIndex) => {
          const key = String(column.name || column.label || columnIndex)
          return (
            <GridCell
              canEditTable={true}
              bordered={true}
              key={key}
              isEditing={true}
              focusedIndex={focusedIndex}
              rowIndex={0}
              columnIndex={columnIndex}
              value={
                newRowValues.current?.[column.name] ||
                column?.newRow?.defaultValue
              }
              onInputChange={(value) =>
                onInputChange(column.name as string, value)
              }
              column={column}
              onClick={() => setFocusedIndex({ x: columnIndex, y: 0 })}
              onDoubleClick={() => {}}
              setCanSave={() => {}}
              tableCellProps={{ sx: { height: 31 } }}
              validationErrors={validationError}
            />
          )
        })}
    </TableRow>
  )
}
