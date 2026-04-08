import { Autocomplete, BaseGrid, Dialog, Input, LargeButton, Modal, Td, Tr, useAlert, useFilter, useGrid, useLoading } from '@bluemarble/bm-components'
import { Box, CircularProgress, Container, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { HeadingPage } from '@/components/HeadingPage'
import { useFetch } from '@/hooks/useFetch'
import type { ApiConnections } from '@/pages/api/connections/index.api'
import type { ApiProfiles } from '@/pages/api/profiles/index.api'
import { api } from '@/services/api'
import { getErrorMessage } from '@/utils/errorHandler'

const columns = [
  { name: '-', label: '', canSort: false },
  { name: 'name', label: 'Nome' },
  { name: 'connections.env_name', label: 'Conexão' },
  { name: 'modelos.name', label: 'Modelo' },
  { name: 'default_db', label: 'DB Padrão' },
  { name: 'INSTRUÇÕES', label: ' ', sx: { width: 150 } },
  { name: 'system_prompt', label: 'System Prompt', sx: { width: 150 } },
  { name: 'db_schema', label: 'DB Schema', sx: { width: 150 } },
  { name: 'created_at', label: 'Data Criação', sx: { width: 130 } }
] as const

type ColumnTitleNames = (typeof columns)[number]['name']
const columnLabel = (col: ColumnTitleNames) => columns.find(({ name }) => name === col)?.label || ''

const API_URL = '/profiles'

type ModalOptions = '' | 'update' | 'delete' | 'insert' | 'update-system-prompt' | 'update-db-schema'

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

      <Stack sx={{ flexDirection: 'row', alignItems: 'center', mb: 2 }}>
        <Box sx={{ flex: 1 }} />
        <LargeButton color="success" onClick={() => setModal('insert')} fullWidth={false}>
          Add Profile
        </LargeButton>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <LargeButton color="info" onClick={() => router.push('/modelos')} fullWidth={false}>
            Modelos
          </LargeButton>
          <LargeButton color="info" onClick={() => router.push('/connections')} fullWidth={false}>
            Conexões
          </LargeButton>
        </Box>
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
            <Td>{row.connections?.description || '-'}</Td>
            <Td>{row.modelos?.name || '-'}</Td>
            <Td>{row.default_db}</Td>
            <Td sx={{ p: '3px!important' }}>
              <LargeButton sx={{ p: 0 }} color="inherit" size="small" onClick={() => router.push(`/instructions?profile_id=${row.id}`)}>
                Instruções
              </LargeButton>
            </Td>
            <Td sx={{ p: '3px!important' }}>
              <LargeButton sx={{ p: 0 }} color="inherit" size="small" onClick={() => handleActionItem(row.id, 'update-system-prompt')}>
                {row.system_prompt ? 'Editar' : 'Adicionar'}
              </LargeButton>
            </Td>
            <Td sx={{ p: '3px!important' }}>
              <LargeButton sx={{ p: 0 }} color="inherit" size="small" onClick={() => handleActionItem(row.id, 'update-db-schema')}>
                {row.db_schema ? 'Editar' : 'Adicionar'}
              </LargeButton>
            </Td>
            {/* <Td sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.system_prompt}</Td> */}
            {/* <Td sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.db_schema}</Td> */}
            <Td>{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</Td>
          </Tr>
        ))}
      </BaseGrid>

      {modal === 'insert' && <BaseForm onClose={onClose} onSubmit={handleCreateItem} modal={modal} />}
      {modal === 'update' && <BaseForm onClose={onClose} onSubmit={handleUpdateItem} isUpdateForm initialValues={selectedRow} modal={modal} />}
      {modal === 'update-system-prompt' && <BaseForm onClose={onClose} onSubmit={handleUpdateItem} isUpdateForm initialValues={selectedRow} modal={modal} />}
      {modal === 'update-db-schema' && <BaseForm onClose={onClose} onSubmit={handleUpdateItem} isUpdateForm initialValues={selectedRow} modal={modal} />}
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
  modal: ModalOptions
}

const BaseForm = ({ onSubmit, onClose, initialValues, isUpdateForm, modal }: BaseFormProps) => {
  const [connections, isLoadingConnections] = useFetch<ApiConnections>('/connections', [])
  const [modelos, isLoadingModelos] = useFetch<any[]>('/modelos', [])
  const { createAlert } = useAlert()
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{ px: 2, mb: 2, mt: 1, width: '90vw', overflowY: 'auto', maxHeight: '90vh', maxWidth: modal === 'update' ? 600 : undefined }}>
        <Typography sx={{ mb: 2 }} variant="h6" fontWeight="bold">
          {isUpdateForm ? 'Editar Perfil' : 'Novo Perfil'}
        </Typography>

        <Formik onSubmit={onSubmit} initialValues={initialValues || { name: '', apikey: '', system_prompt: '', system_prompt_teste: '', db_schema: '', default_db: '', connection_id: '', modelo_id: '' }}>
          {({ isSubmitting, values }) => {
            if (isLoadingConnections || isLoadingModelos) return <CircularProgress />
            return (
              <Form>
                <Stack direction="column" gap={2}>
                  {(() => {
                    if (modal === 'update-system-prompt') {
                      return (
                        <Stack direction="row" gap={2}>
                          <Input name="system_prompt" label="System Prompt" multiline rows={30} type="text" />
                        </Stack>
                      )
                    }
                    if (modal === 'update-db-schema') {
                      return (
                        <Stack direction="row" gap={2}>
                          <Input name="db_schema" label="DB Schema" multiline rows={30} type="text" />
                        </Stack>
                      )
                    }
                    return (
                      <Stack direction="column" gap={2}>
                        <Input name="name" label="Nome do Profile" type="text" />
                        <Input name="apikey" label="API Key" type="text" />
                        <Divider />
                        <Stack direction="row" justifyContent="flex-end" gap={2} sx={{ mt: 0, mb: 2 }}>
                          <Autocomplete
                            name="connection_id"
                            label="Conexão"
                            options={connections || []}
                            getOptionLabel={(option) => option?.description || ''}
                            getOptionValue={(option) => option?.id}
                            isOptionEqualToValue={(a, b) => a?.id === b?.id}
                          />
                          <Input name="default_db" label="DB Padrão" type="text" />
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end" gap={2} sx={{ mt: 0, mb: 2 }}>
                          <Autocomplete
                            name="modelo_id"
                            label="Modelo"
                            options={modelos || []}
                            getOptionLabel={(option) => option?.name || ''}
                            getOptionValue={(option) => option?.id}
                            isOptionEqualToValue={(a, b) => a?.id === b?.id}
                          />
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end" gap={2} sx={{ mt: 0, mb: 2 }}>
                          <LargeButton
                            color="inherit"
                            onClick={async () => {
                              const connection = connections?.find((connection) => connection.id === values?.connection_id)
                              try {
                                await api.post('/testar-conexao', { env_name: connection?.env_name, default_db: values?.default_db })
                                createAlert('Teste de Conexão ok!', 'success')
                              } catch (error: any) {
                                if (error.response.data.msg) {
                                  createAlert(error.response.data.msg, 'error')
                                } else {
                                  createAlert(error.message, 'error')
                                }
                              }
                            }}
                            fullWidth={false}
                          >
                            Testar Conexão
                          </LargeButton>
                        </Stack>
                      </Stack>
                    )
                  })()}
                </Stack>
                <Stack direction="row" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
                  <LargeButton color="inherit" onClick={onClose} fullWidth={false}>
                    Cancelar
                  </LargeButton>
                  <LargeButton color="success" loading={isSubmitting} type="submit" fullWidth={false}>
                    {isUpdateForm ? 'Salvar alterações' : 'Criar novo'}
                  </LargeButton>
                </Stack>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </Modal>
  )
}
