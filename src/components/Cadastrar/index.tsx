import { BaseGrid, Dialog, Input, LargeButton, Modal, Td, Tr, useAlert, useGrid } from '@bluemarble/bm-components'
import { Box, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { HeadingPage } from '@/components/HeadingPage'
import { useLoading } from '@/hooks/useLoading'
import type { CadastroNaviosStatusResposta } from '@/pages/api/cadastro/cadastro-status-navios/index.api'
import { api } from '@/services/api'
import { getErrorMessage } from '@/utils/errorHandler'

const columns = [
  { name: '-', label: '', canSort: false },
  { name: 'nome', label: 'Nome' }
]

type ModalOptions = '' | 'update' | 'delete' | 'insert'

interface IUrlProps {
  urlApi: string
  title: string
  returnType?: any
}
export const Cadastrar = ({ urlApi, title, returnType }: IUrlProps) => {
  const gridData = useGrid<CadastroNaviosStatusResposta>({ columns })
  const [selectedRowId, setSelectedRowId] = useState<number>()
  const selectedRow = useMemo(() => {
    return gridData.defaultData.find((row) => row.id === selectedRowId)
  }, [selectedRowId])

  const [modal, setModal] = useState<ModalOptions>('')
  const { isLoading, setLoading } = useLoading()
  const { createAlert } = useAlert()

  async function getLineupStatus() {
    const LOADING_NAME = 'get:Lineup'
    setLoading(LOADING_NAME)
    try {
      const { data } = await api.get(`${urlApi}`)
      gridData.set(data)
    } catch (error) {
      createAlert(getErrorMessage(error), 'error')
    } finally {
      setLoading(LOADING_NAME, true)
    }
  }

  const handleCreateLineup = async (fields: any) => {
    const LOADING_NAME = 'post:Lineup'
    setLoading(LOADING_NAME)
    try {
      await api.post(`${urlApi}`, { ...fields })

      await getLineupStatus()
      createAlert('Item inserido com sucesso', 'success')
      setModal('')
    } catch (error) {
      createAlert(getErrorMessage(error), 'error')
    } finally {
      setLoading(LOADING_NAME, true)
    }
  }

  const handleUpdateLineup = async (fields: any) => {
    const LOADING_NAME = 'put:Lineup'
    setLoading(LOADING_NAME)
    try {
      await api.put(`${urlApi}`, { ...fields, selectedRowId })
      await getLineupStatus()
      createAlert('Item atualizado com sucesso', 'success')
      setModal('')
      setSelectedRowId(undefined)
    } catch (error) {
      createAlert(getErrorMessage(error), 'error')
    } finally {
      setLoading(LOADING_NAME, true)
    }
  }

  const handleDeleteLineup = async () => {
    const LOADING_NAME = 'delete:Lineup'
    setLoading(LOADING_NAME)
    try {
      await api.delete(`${urlApi}`, { params: { id: selectedRowId } })
      await getLineupStatus()
      createAlert('Item deletado com sucesso', 'success')
      setModal('')
      setSelectedRowId(undefined)
    } catch (error) {
      createAlert(getErrorMessage(error), 'error')
    } finally {
      setLoading(LOADING_NAME, true)
    }
  }

  const handleActionItem = (id: number, action: ModalOptions) => {
    setSelectedRowId(id)
    setModal(action)
  }

  useEffect(() => {
    getLineupStatus()
  }, [])

  return (
    <Container>
      <HeadingPage title={title} shouldShowButtonBack />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <LargeButton sx={{ color: '#fff' }} color="success" onClick={() => setModal('insert')} fullWidth={false}>
          Inserir
        </LargeButton>
      </Box>
      <Box
        sx={{
          py: 2,
          tr: {
            td: { py: 0, textAlign: 'center' },
            th: { py: 0, textAlign: 'center', fontWeight: 600 }
          }
        }}
      >
        <BaseGrid {...gridData} isLoading={isLoading('get:Lineup')}>
          {gridData.data.map((row) => (
            <Fragment key={row.id}>
              <Tr>
                <Td>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleActionItem(row.id, 'update')}>
                        <MdEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar">
                      <IconButton size="small" onClick={() => handleActionItem(row.id, 'delete')}>
                        <MdDelete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Td>
                <Td>{row.nome}</Td>
              </Tr>
            </Fragment>
          ))}
        </BaseGrid>
      </Box>
      <BaseForm loading={isLoading('post:Cadastro')} open={modal === 'insert'} onClose={() => setModal('')} onSubmit={handleCreateLineup} initialValues={{ ...selectedRow }} />
      <BaseForm
        loading={isLoading('put:Cadastro')}
        open={modal === 'update'}
        updateForm
        onClose={() => setModal('')}
        onSubmit={handleUpdateLineup}
        initialValues={{
          ...selectedRow
        }}
      />
      <Dialog
        open={modal === 'delete'}
        loading={isLoading('delete:Cadastro')}
        title="Atenção, esta ação é irreversível"
        body="Tem certeza que deseja deletar este item?"
        options={[
          { label: 'Cancelar', cb: () => setModal('') },
          { label: 'Confirmar', cb: () => handleDeleteLineup(), focus: true }
        ]}
      />
    </Container>
  )
}

type BaseFormProps = {
  onSubmit: (fields: any) => Promise<void>
  onClose: () => void
  open: boolean
  loading: boolean
  initialValues?: Record<string, any>
  updateForm?: boolean
}

const BaseForm = ({ onSubmit, onClose, open, loading, initialValues, updateForm }: BaseFormProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {updateForm ? 'Editar' : 'Novo'}
        </Typography>
      </Box>
      <Box sx={{ p: 2, maxWidth: 650, width: '100vw' }}>
        <Formik onSubmit={onSubmit} initialValues={initialValues || {}}>
          {({ values }) => {
            return (
              <Form>
                <Stack direction="column" gap={1}>
                  <Input name="nome" label="Nome" />
                </Stack>
                <LargeButton loading={loading} sx={{ mt: 2 }} type="submit">
                  {updateForm ? 'Salvar alterações' : 'Criar novo'}
                </LargeButton>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </Modal>
  )
}
