import { BaseGrid, Td, Tr, useAlert, useFilter, useGrid, useLoading } from '@bluemarble/bm-components'
import { Container,  Tooltip } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { HeadingPage } from '@/components/HeadingPage'
import type { ApiLogUso } from '@/pages/api/log_uso/index.api'
import { api } from '@/services/api'
import { getErrorMessage } from '@/utils/errorHandler'

const columns = [
  { name: 'created_at', label: 'Data', sx: { width: 170 } },
  { name: 'id', label: 'ID', sx: { width: 70 } },
  { name: 'type', label: 'Tipo', sx: { width: 100 } },
  { name: 'text', label: 'Texto' },
  { name: 'time_elapsed_sec', label: 'Tempo (s)', sx: { width: 100 } },
  { name: 'thread_id', label: 'Thread ID', sx: { width: 300 } }
] as const


const API_URL = '/log_uso'

type ModalOptions = '' | 'update' | 'delete' | 'insert'

export default function LogUsoPage() {
  const filterGrid = useFilter()
  const gridData = useGrid<ApiLogUso[number]>({ columns: columns as any, filters: filterGrid.filters, rowsPerPageOptions: [100, 200, 300] })
  const [selectedRowId, setSelectedRowId] = useState<number>()
  const selectedRow = useMemo(() => gridData.defaultData.find((row) => row.id === selectedRowId), [selectedRowId])

  const [modal, setModal] = useState<ModalOptions>('')
  const { isLoading, setLoading } = useLoading()
  const { createAlert } = useAlert()

  async function getItems() {
    withErrorHandler({
      loadingName: 'get:items',
      fn: async () => {
        const { data } = await api.get(API_URL)
        gridData.set(data)
      }
    })
  }

  const onClose = () => {
    if (selectedRowId !== undefined) setSelectedRowId(undefined)
    if (modal !== '') setModal('')
  }

  async function withErrorHandler({ loadingName, fn, successAlert }: { loadingName?: string; fn: () => Promise<void>; successAlert?: string }) {
    try {
      if (loadingName) setLoading(loadingName)
      await fn()
      if (successAlert) createAlert(successAlert, 'success')
      onClose()
    } catch (error) {
      createAlert(getErrorMessage(error), 'error')
    } finally {
      if (loadingName) setLoading(loadingName, true)
    }
  }

  useEffect(() => {
    getItems()
  }, [])

  return (
    <Container sx={{ mt: 2, width: '100%', minWidth: '100%' }}>
      <HeadingPage title="Log de Uso" shouldShowButtonBack />

      <BaseGrid
        paperProps={{
          sx: {
            'td, th': { p: 0.3, px: 1, textAlign: 'center' },
            th: { fontWeight: 600, svg: { display: 'none' } }
          }
        }}
        {...gridData}
        isLoading={isLoading('get:items')}
        bordered
      >
        {gridData.data.map((row) => (
          <Tr key={row.id}>
            <Td>{row.created_at ? new Date(row.created_at).toLocaleString() : '-'}</Td>
            <Td>{row.id}</Td>
            <Td>{formataType(row.type)}</Td>
            <Td sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left!important' }}>
              <Tooltip title={row.text || ''}>
                <span>{row.text}</span>
              </Tooltip>
            </Td>
            <Td>{row.time_elapsed_sec?.toString()}</Td>
            <Td>{row.thread_id}</Td>
          </Tr>
        ))}
      </BaseGrid>
    </Container>
  )
}

const formataType = (type: string | null) => {
  if (!type) return '-'
  if (type === 'sql_error') return `🔴 ${type}`
  if (type === 'sql_result') return `🟢 ${type}`
  if (type === 'prompt') return `▶️ ${type}`
  if (type === 'result') return `✅ ${type}`
  return type
}


