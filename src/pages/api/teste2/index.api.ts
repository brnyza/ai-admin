import { prisma } from 'lib/prisma'

const handler = async (req: any, res: any) => {
  try {
    if (req.method === 'GET') return await GET()
    return res.status(405).json({ error: 'Método inválido' })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno', msg: error.message })
  } finally {
  }

  async function GET() {
    const result = await prisma.profiles.findMany()
    return res.json({ msg: 'ok', result })
  }
}

export default handler
