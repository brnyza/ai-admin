import { BaseGrid, Dialog, Input, LargeButton, Modal, Td, Tr, useAlert, useFilter, useGrid, useLoading } from '@bluemarble/bm-components'
import { Box, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { HeadingPage } from '@/components/HeadingPage'
import type { ApiProfiles } from '@/pages/api/profiles/index.api'
import { api } from '@/services/api'
import { getErrorMessage } from '@/utils/errorHandler'

const columns = [
  { name: '-', label: '', canSort: false },
  { name: 'name', label: 'Nome', sx: { width: 150 } },
  { name: 'INSTRUÇÕES', label: ' ', sx: { width: 150 } },
  { name: 'system_prompt', label: 'System Prompt' },
  { name: 'db_schema', label: 'DB Schema' },
  { name: 'created_at', label: 'Data Criação', sx: { width: 150 } }
] as const

type ColumnTitleNames = (typeof columns)[number]['name']
const columnLabel = (col: ColumnTitleNames) => columns.find(({ name }) => name === col)?.label || ''

const API_URL = '/profiles'

type ModalOptions = '' | 'update' | 'delete' | 'insert'

export default function ProfilesPage() {
  const router = useRouter()
  const filterGrid = useFilter()
  const gridData = useGrid<ApiProfiles[number]>({ columns: columns as any, filters: filterGrid.filters })
  const [selectedRowId, setSelectedRowId] = useState<string>()
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

  const handleCreateItem = async (fields: any) => {
    withErrorHandler({
      fn: async () => {
        await api.post(API_URL, fields)
        await getItems()
      },
      successAlert: 'Item inserido com sucesso'
    })
  }

  const handleUpdateItem = async (fields: any) => {
    withErrorHandler({
      fn: async () => {
        await api.put(`${API_URL}?id=${selectedRowId}`, fields)
        await getItems()
      },
      successAlert: 'Item atualizado com sucesso'
    })
  }

  const handleDeleteItem = async () => {
    withErrorHandler({
      loadingName: 'delete:item',
      fn: async () => {
        await api.delete(`${API_URL}?id=${selectedRowId}`)
        await getItems()
      },
      successAlert: 'Item deletado com sucesso'
    })
  }

  const handleActionItem = (id: string, action: ModalOptions) => {
    setSelectedRowId(id)
    setModal(action)
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
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <HeadingPage title="AI Profiles" />

      <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 2 }}>
        <LargeButton color="success" onClick={() => setModal('insert')} fullWidth={false}>
          + Profile
        </LargeButton>
      </Stack>

      <BaseGrid
        paperProps={{
          sx: {
            'td, th': { p: 1, textAlign: 'center' },
            th: { fontWeight: 600 }
          }
        }}
        {...gridData}
        isLoading={isLoading('get:items')}
        bordered
      >
        {gridData.data.map((row) => (
          <Tr key={row.id}>
            <TdActions handleActionFn={handleActionItem} id={row.id} />
            <Td>{row.name}</Td>
            <Td>
              <LargeButton size="small" onClick={() => router.push(`/instructions?profile_id=${row.id}`)}>
                Instruções
              </LargeButton>
            </Td>
            <Td sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.system_prompt}</Td>
            <Td sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.db_schema}</Td>
            <Td>{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</Td>
          </Tr>
        ))}
      </BaseGrid>

      {modal === 'insert' && <BaseForm onClose={onClose} onSubmit={handleCreateItem} />}
      {modal === 'update' && <BaseForm onClose={onClose} onSubmit={handleUpdateItem} isUpdateForm initialValues={selectedRow} />}
      <Dialog
        open={modal === 'delete'}
        loading={isLoading('delete:item')}
        title="Atenção, esta ação é irreversível"
        body="Tem certeza que deseja deletar este perfil?"
        options={[
          { label: 'Cancelar', cb: onClose },
          { label: 'Confirmar', cb: handleDeleteItem, focus: true }
        ]}
      />
    </Container>
  )
}

const TdActions = ({ handleActionFn, id }: { handleActionFn: (id: string, action: ModalOptions) => void; id: string }) => (
  <Td sx={{ p: '0!important', width: 80 }}>
    <Stack direction="row" justifyContent="center" gap={1}>
      <Tooltip title="Editar">
        <IconButton size="small" onClick={() => handleActionFn(id, 'update')}>
          <MdEdit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Deletar">
        <IconButton size="small" onClick={() => handleActionFn(id, 'delete')}>
          <MdDelete />
        </IconButton>
      </Tooltip>
    </Stack>
  </Td>
)

type BaseFormProps = {
  onSubmit: (fields: any) => Promise<void>
  onClose: () => void
  isUpdateForm?: boolean
  initialValues?: ApiProfiles[number]
}

const BaseForm = ({ onSubmit, onClose, initialValues, isUpdateForm }: BaseFormProps) => {
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{ px: 2, mb: 2, mt: 1, width: '90vw', overflowY: 'scroll', maxHeight: '90vh' }}>
        <Typography sx={{ mb: 2 }} variant="h6" fontWeight="bold">
          {isUpdateForm ? 'Editar Perfil' : 'Novo Perfil'}
        </Typography>
        <Formik onSubmit={onSubmit} initialValues={initialValues || { name: '', apikey: '', system_prompt: '', system_prompt_teste: '', db_schema: '' }}>
          {({ isSubmitting }) => (
            <Form>
              <Stack direction="column" gap={2}>
                <Stack direction="row" gap={2}>
                  <Input sx={{ width: 200 }} name="name" label="Nome" type="text" />
                  <Input name="apikey" label="API Key" type="text" />
                </Stack>
                <Input name="system_prompt" label="System Prompt" multiline rows={15} type="text" />
                {/* <Input name="system_prompt_teste" label="System Prompt (Teste)" multiline rows={15} type="text" /> */}
                <Input name="db_schema" label="DB Schema" multiline rows={15} type="text" />
              </Stack>
              <Stack direction="row" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
                <LargeButton color="inherit" onClick={onClose} fullWidth={false}>
                  Cancelar
                </LargeButton>
                <LargeButton loading={isSubmitting} type="submit" fullWidth={false}>
                  {isUpdateForm ? 'Salvar alterações' : 'Criar novo'}
                </LargeButton>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  )
}
