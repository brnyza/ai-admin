import {
    IconButton,
    Stack,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TableRowProps,
  TableSortLabel,
  Tooltip,
  Typography
} from '@mui/material'
import { Box, BoxProps } from '@mui/system'
import { useRouter } from 'next/router'
import { FC, memo } from 'react'
import { MdArrowBack } from 'react-icons/md'
import { ITitles } from './index'

interface ICustomTableHead {
  titles?: ITitles[]
  orderBy: string
  order: 'desc' | 'asc' | undefined
  setOrder(value: string | undefined): void
  setOrderBy(value: string): void
}

const Trow: FC<TableRowProps> = (props) => {
  const { children, ...rest } = props
  return <TableRow {...rest}>{children}</TableRow>
}

export const Tr = memo(Trow)

interface ITd extends TableCellProps {}

export const Td: FC<ITd> = ({ children, ...props }) => {
  return <TableCell {...props}>{children}</TableCell>
}

interface IHeaderProps extends BoxProps {
  title: string
  noBackButton?: boolean
  backURL?: string
}

export const Header: FC<IHeaderProps> = ({ title, noBackButton, backURL, children, ...props }) => {
  const router = useRouter()
  return (
    <Box component="header" sx={{ py: 2 }} {...props}>
      <Stack direction="row" alignItems="center" spacing={1}>
{ !noBackButton &&
        <Tooltip title="Voltar">
          <IconButton onClick={() => backURL ? router.push(backURL) : router.back()}>
            <MdArrowBack />
          </IconButton>
        </Tooltip>
      }
        <Typography
          variant="h6"
          component="h1"
          fontWeight="bold"
          color="GrayText"
        >
        {title}
        </Typography>
      </Stack>
      <Box sx={{ display: 'flex', gap: 2, paddingTop: 1 }}>{children}</Box>
    </Box>
  )
}

const Head: FC<ICustomTableHead> = ({
  titles = [],
  order,
  orderBy,
  setOrder,
  setOrderBy
}) => {
  function onRequestSort(title: string) {
    if (title !== orderBy) {
      setOrderBy(title)
      return setOrder('desc')
    }

    switch (order) {
      case 'desc':
        setOrder('asc')
        setOrderBy(title)
        break
      case 'asc':
        setOrder(undefined)
        setOrderBy('')
        break
      default:
        setOrder('desc')
        setOrderBy(title)
        break
    }
  }

  return (
    <TableHead>
      <Tr sx={{ backgroundColor: 'background.default' }}>
        {titles.map((title, index) => {
          return (
            <Td
              key={index}
              sortDirection={orderBy === title.name ? order : false}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <TableSortLabel
                  onClick={() => onRequestSort(title.name)}
                  active={orderBy === title.name}
                  direction={orderBy === title.name ? order : 'asc'}
                >
                  <Typography fontWeight="bold" component="p" variant="body2">
                    {title.label}
                  </Typography>
                </TableSortLabel>
              </Box>
            </Td>
          )
        })}
      </Tr>
    </TableHead>
  )
}

export const CustomTableHead = Head

interface INotificationProps extends BoxProps {
  visible: boolean
}

export const Notification: FC<INotificationProps> = ({ visible, ...props }) => {
  if (!visible) return <></>

  return (
    <Box {...props}>
      <Box
        sx={{
          borderRadius: '50%',
          width: 8,
          height: 8,
          zIndex: 9999,
          background: '#009cb4',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </Box>
  )
}
