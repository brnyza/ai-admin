import { prisma } from '@/libs/prisma'
import { withAuth } from '@/middlewares'
import { withLog } from '@/middlewares/withLog'

const getInstructions = async (profile_id?: string) => {
  const result = await prisma.instructions.findMany({
    where: profile_id ? { profile_id } : {},
    orderBy: { created_at: 'desc' }
  })
  return result
}

export type ApiInstructions = Awaited<ReturnType<typeof getInstructions>>

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
    const { profile_id } = req.query
    const result = await getInstructions(profile_id as string)
    return res.json(result)
  }

  async function POST() {
    const data = req.body
    const result = await prisma.instructions.create({ data })
    return res.status(201).json(result)
  }

  async function PUT() {
    const { id } = req.query
    const data = req.body

    // Remove metadata fields that shouldn't be updated manually
    delete data.id
    delete data.created_at
    delete data.updated_at

    const result = await prisma.instructions.update({
      where: { id: String(id) },
      data: {
        ...data,
        updated_at: new Date()
      }
    })
    return res.json(result)
  }

  async function DELETE() {
    const { id } = req.query
    await prisma.instructions.delete({
      where: { id: String(id) }
    })
    return res.json({ msg: 'ok' })
  }
}

export default withAuth(withLog(handler))
