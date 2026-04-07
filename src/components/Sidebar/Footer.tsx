import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material'
import { FC } from 'react'
import { MdExitToApp } from 'react-icons/md'

interface FooterProps {
	user: any
	signOut: () => void
}

export const Footer: FC<FooterProps> = ({ user, signOut }) => {
	const [firstName] = user?.name?.split(' ') as string[]
	return (
		<Box>
			<Divider sx={{ borderColor: '#dedede', marginBottom: 1 }} />
			<Box
				sx={{
					display: 'flex',
					paddingLeft: 2.3,
					justifyContent: 'space-between',
					gap: 1,
					alignItems: 'center'
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Avatar
						sx={{
							bgcolor: 'background.paper',
							color: 'primary.main',
							width: 35,
							height: 35
						}}
						alt={user?.name}
					>
						{`${firstName?.charAt(0)}`}
					</Avatar>

					<Box
						sx={{
							paddingLeft: 2,
							width: 'max-content',
							color: '#fff',
							justifySelf: 'flex-start'
						}}
					>
						<Typography variant="subtitle2">{user?.name}</Typography>
						<Typography variant="caption">{user?.role}</Typography>
					</Box>
				</Box>
				<IconButton onClick={signOut} sx={{ marginRight: 1 }}>
					<MdExitToApp color="white" />
				</IconButton>
			</Box>
		</Box>
	)
}
