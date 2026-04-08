import { prisma } from '@/libs/prisma'
import { withAuth } from '@/middlewares'
import { withLog } from '@/middlewares/withLog'

const getModelos = async () => {
  const result = await prisma.modelos.findMany({ orderBy: { name: 'asc' } })
  return result
}

export type ApiModelos = Awaited<ReturnType<typeof getModelos>>

const handler = async (req: any, res: any) => {
  try {
    if (req.method === 'GET') return await GET()
    if (req.method === 'POST') return await POST()
    if (req.method === 'PUT') return await PUT()
    if (req.method === 'DELETE') return await DELETE()
    return res.status(405).json({ error: 'Método inválido' })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno', msg: error.message })
  }

  async function GET() {
    const { id } = req.query
    if (id) {
      const result = await prisma.modelos.findUnique({
        where: { id: Number(id) }
      })
      return res.json(result)
    }
    const result = await getModelos()
    return res.json(result)
  }

  async function POST() {
    const data = req.body
    const result = await prisma.modelos.create({ data })
    return res.status(201).json(result)
  }

  async function PUT() {
    const { id } = req.query
    const data = req.body

    // Remove metadata fields that shouldn't be updated manually
    delete data.id
    delete data.created_at
    delete data.updated_at
    delete data.profiles // Remove relations if any

    const result = await prisma.modelos.update({
      where: { id: Number(id) },
      data: {
        ...data,
        updated_at: new Date()
      }
    })
    return res.json(result)
  }

  async function DELETE() {
    const { id } = req.query
    await prisma.modelos.delete({
      where: { id: Number(id) }
    })
    return res.json({ msg: 'ok' })
  }
}

export default withAuth(withLog(handler))
