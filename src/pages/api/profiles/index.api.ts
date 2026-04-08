import { prisma } from '@/libs/prisma'
import { withAuth } from '@/middlewares'
import { withLog } from '@/middlewares/withLog'

const getProfiles = async () => {
  const result = await prisma.profiles.findMany({
    orderBy: { name: 'asc' },
    include: { connections: true, modelos: true }
  })
  return result
}

export type ApiProfiles = Awaited<ReturnType<typeof getProfiles>>

/**
 * Limpa o payload transformando strings vazias em null
 * e removendo campos indesejados.
 */
function cleanPayload(data: any, excludeFields: string[] = []) {
  const cleanData = { ...data }
  
  // Remove campos específicos (metadados/relações)
  excludeFields.forEach(field => {
    delete cleanData[field]
  })


  // Converte strings vazias para null
  Object.keys(cleanData).forEach(key => {
    if (cleanData[key] === '') cleanData[key] = null
  })

  return cleanData
}


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
      const result = await prisma.profiles.findUnique({
        where: { id: String(id) },
        include: { connections: true, modelos: true }
      })
      return res.json(result)
    }
    const result = await getProfiles()
    return res.json(result)
  }

  async function POST() {
    const data = cleanPayload(req.body)
    const result = await prisma.profiles.create({ data })
    return res.status(201).json(result)
  }


  async function PUT() {
    const { id } = req.query
    const data = cleanPayload(req.body, ['id', 'created_at', 'updated_at', 'connections', 'modelos'])

    const result = await prisma.profiles.update({

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
    await prisma.profiles.delete({
      where: { id: String(id) }
    })
    return res.json({ msg: 'ok' })
  }
}

export default withAuth(withLog(handler))
