import { Checkbox, ClickAwayListener, Paper, Table, TableBody, TableCell, TableCellProps, TableHead, TableRow, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import useEvent from '../../hooks/useEvent'
import { GridCell } from './GridCell'
import { GridInputProps } from './GridInput'
import { InputSelectCellProps } from './GridSelect'
import { NewRow } from './NewRow'

export interface onSaveOptions<T> {
	prop: keyof T
	newValue: string
	index: number
}

export interface ColumnsProps<T> {
	id?: string | number
	name: keyof T | ''
	label: string
	visible?: boolean
	type?: GridInputProps['type'] | 'select' | 'autocomplete'
	inputProps?: GridInputProps
	select?: Omit<InputSelectCellProps, 'setCanSave' | 'onInputChange'>
	formatLabelValue?: (value: string) => string
	required?: boolean
	TableCellProps?: TableCellProps
	newRow?: {
		defaultValue?: string
	}
}

interface EditableGridProps<T> {
	columns: ColumnsProps<T>[]
	data: Array<T>
	primaryKey: keyof T
	focusedIndex: { x: number; y: number }
	isEditing: boolean
	bordered?: boolean
	onSave: (item: T, options: onSaveOptions<T>) => void
	setFocusedIndex: (props: { x: number; y: number }) => void
	setIsEditing: (value: boolean) => void
	canEditTable: boolean
	setCanEditTable: (value: boolean) => void

	selectedRows: number[]
	setSelectedRows: (value: number[]) => void
	checkbox?: boolean
	checkMultiple?: boolean

	onSaveNewRow?: (newRow: T) => void

	canInsertNewRow: boolean
	setCanInsertNewRow: (value: boolean) => void
}

export function EditableGrid<T extends Record<string, any>>({
	columns,
	data,
	primaryKey,
	onSave,
	setFocusedIndex,
	setIsEditing,
	focusedIndex,
	isEditing,
	bordered,
	canEditTable,
	setCanEditTable,
	selectedRows,
	setSelectedRows,
	checkbox = false,
	checkMultiple = false,
	onSaveNewRow,
	canInsertNewRow
}: EditableGridProps<T>) {
	const [canSave, setCanSave] = useState(true)
	const checkboxOffset = checkbox ? 1 : 0

	const inputValue = useRef('')
	const maxPositions = {
		x: columns.length - 1 - checkboxOffset,
		y: data.length - 1
	}
	const focusedRow = data?.[focusedIndex?.y]
	const focusedProp = columns?.[focusedIndex?.x + checkboxOffset]?.name as string
	const gridRef = useRef(null)
	const [isShiftPressed, setIsShiftPressed] = useState(false)

	const onInputChange = (value: string) => {
		inputValue.current = value
	}

	const moveIndexPosition = (x = 0, y = 0, ignoreEditing?: boolean) => {
		let xPosition = focusedIndex.x + x
		let yPosition = focusedIndex.y + y

		if (isEditing && !ignoreEditing) return
		if (xPosition > maxPositions.x && yPosition < maxPositions.y) {
			xPosition = 0
			yPosition += 1
		} else if (xPosition < 0 && yPosition > 0) {
			xPosition = maxPositions.x
			yPosition -= 1
		} else if (xPosition < 0) {
			xPosition = 0
		} else if (yPosition < 0) {
			yPosition = 0
		} else if (xPosition > maxPositions.x) {
			xPosition = maxPositions.x
		} else if (yPosition > maxPositions.y) {
			yPosition = maxPositions.y
		}

		setFocusedIndex({
			x: xPosition,
			y: yPosition
		})
	}

	const handleSaveChanges = async () => {
		if (focusedRow && focusedProp) {
			const previousValue = focusedRow[focusedProp as keyof T]
			if (previousValue !== inputValue.current)
				onSave(updateRowData(), {
					prop: focusedProp,
					newValue: inputValue.current,
					index: focusedIndex.y
				})
		}
	}

	const updateRowData = (): T => {
		const updatedRow = { ...focusedRow, [focusedProp as string]: inputValue.current } as T

		return updatedRow
	}

	const startEditOrSave = () => {
		if (!canSave) return
		if (!isEditing) {
			setIsEditing(true)
		} else {
			handleSaveChanges()
			setIsEditing(false)
		}
	}

	const saveAndMove = (event: KeyboardEvent) => {
		event.preventDefault()
		if (isEditing) handleSaveChanges()
		moveIndexPosition(1, 0, true)
	}

	const keyMaps = {
		ArrowRight: (event: KeyboardEvent) => moveIndexPosition(1, 0),
		ArrowLeft: (event: KeyboardEvent) => moveIndexPosition(-1, 0),
		ArrowDown: (event: KeyboardEvent) => moveIndexPosition(0, 1),
		ArrowUp: (event: KeyboardEvent) => moveIndexPosition(0, -1),
		Enter: (event: KeyboardEvent) => startEditOrSave(),
		Tab: (event: KeyboardEvent) => saveAndMove(event),
		Escape: (event: KeyboardEvent) => {
			event.preventDefault()
			setIsEditing(false)
			if (!isEditing) setCanEditTable(false)
		}
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Shift') setIsShiftPressed(true)
		if (!canEditTable) return
		const movement = keyMaps[event.key as 'ArrowRight']
		if (event.shiftKey && event.key === 'Tab') {
			event.preventDefault()
			if (isEditing) handleSaveChanges()
			moveIndexPosition(-1, 0, true)
		} else if (movement) {
			movement(event)
		}
	}
	const handleKeyUp = (event: KeyboardEvent) => {
		if (event.key === 'Shift') setIsShiftPressed(false)
	}

	const onClick = (x: number, y: number) => {
		if (!canEditTable) setCanEditTable(true)
		if (focusedIndex.x === x && focusedIndex.y === y && canEditTable) setIsEditing(true)
		else {
			if (isEditing) handleSaveChanges()
			setFocusedIndex({ x, y })
		}
	}

	const onDoubleClickCell = (x: number, y: number) => {
		if (!canEditTable) return
		setIsEditing(true)
		setFocusedIndex({ x, y })
	}
	const onClickAwayTable = () => {
		if (!canSave) return
		if (isEditing) handleSaveChanges()

		setCanEditTable(false)
		setIsEditing(false)
	}

	const isSelectedRow = (row: number) => selectedRows.includes(row)

	const onChangeSelectRow = (row: number) => {
		if (isSelectedRow(row)) setSelectedRows(selectedRows.filter((selectedRow) => selectedRow !== row))
		else if (selectedRows.length > 0 && checkMultiple && isShiftPressed) {
			const lastRowIndex = data.findIndex((each) => each[primaryKey] === selectedRows[selectedRows.length - 1])
			const currentRowIndex = data.findIndex((each) => each[primaryKey] === row)
			const sortedIndexes = [lastRowIndex, currentRowIndex].sort((a, b) => a - b)

			if (sortedIndexes[0] !== undefined && sortedIndexes[1] !== undefined) {
				const a = sortedIndexes[0]
				const b = sortedIndexes[1]
				const filteredRows = data.filter((_, index) => index >= a && index <= b)

				const filteredRowsId = filteredRows.map((data) => data[primaryKey])

				setSelectedRows([...selectedRows, ...filteredRowsId])
			}
		} else {
			if (!checkMultiple) setSelectedRows([row])
			else setSelectedRows([...selectedRows, row])
		}
	}

	useEvent('keydown', handleKeyDown)
	useEvent('keyup', handleKeyUp)

	useEffect(() => {
		if (isEditing) {
			if (focusedRow && focusedProp) {
				inputValue.current = focusedRow[focusedProp as keyof T]
			}
		}
	}, [isEditing, focusedIndex])

	return (
		<ClickAwayListener onClickAway={onClickAwayTable}>
			<Paper>
				<Table ref={gridRef} size="small">
					<TableHead>
						<TableRow>
							{columns.map((column, index) => {
								const key = column.name === '' ? column.id || column.label || index : String(column.name)
								return (
									<TableCell
										key={key}
										{...column?.TableCellProps}
										sx={{
											border: '1px solid',
											borderColor: 'divider',
											...column?.TableCellProps?.sx
										}}
									>
										<Typography variant="body2" fontWeight="bold" fontSize="inherit">
											{column.label}
										</Typography>
									</TableCell>
								)
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{canInsertNewRow && onSaveNewRow && <NewRow columns={columns} hasCheckbox={checkbox} maxPositions={maxPositions} onSaveNewRow={onSaveNewRow} />}
						{data.map((row, rowIndex) => {
							return (
								<TableRow key={row[primaryKey]}>
									{checkbox && (
										<TableCell padding="checkbox">
											<Checkbox checked={isSelectedRow(row[primaryKey])} onChange={() => onChangeSelectRow(row[primaryKey])} size="small" sx={{ m: 0 }} />
										</TableCell>
									)}
									{columns
										.filter((columns) => columns.visible !== false)
										.map((column, columnIndex) => {
											const key = String(column.name || column.label || columnIndex)
											return (
												<GridCell
													canEditTable={canEditTable}
													bordered={bordered}
													key={key}
													isEditing={isEditing}
													focusedIndex={focusedIndex}
													rowIndex={rowIndex}
													columnIndex={columnIndex}
													value={row[column.name]}
													onInputChange={onInputChange}
													column={column}
													onClick={() => onClick(columnIndex, rowIndex)}
													onDoubleClick={() => onDoubleClickCell(columnIndex, rowIndex)}
													setCanSave={setCanSave}
												/>
											)
										})}
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</Paper>
		</ClickAwayListener>
	)
}
