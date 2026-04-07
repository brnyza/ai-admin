import { Modal, useEvent } from '@bluemarble/bm-components'
import { Portal } from '@mui/material'
import { type ReactNode, useCallback, useMemo, useState } from 'react'

interface IEvents {
	onClick: (event: any, data: any) => void
}

interface IPopoverDialogProps {
	children: (props: { events: IEvents }) => ReactNode
	content: (props: { onClose: () => void; data: any }) => ReactNode
	disableListener?: boolean
}

export const PopoverDialog = ({ children, content, disableListener }: IPopoverDialogProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [data, setData] = useState<any | null>()

	const events = useMemo(() => {
		return {
			onClick: (event: any, data: any) => {
				if (disableListener) return
				event.preventDefault()
				event.stopPropagation()

				setData(data)
				setIsOpen(true)
			}
		}
	}, [disableListener])

	const onClose = useCallback(() => setIsOpen(false), [])

	useEvent('keydown', (event) => {
		if (event.code === 'Escape') setIsOpen(false)
	})

	return (
		<>
			{children({
				events
			})}
			<Portal>
				<Modal open={isOpen} onClose={onClose}>
					{content({ onClose, data })}
				</Modal>
			</Portal>
		</>
	)
}
