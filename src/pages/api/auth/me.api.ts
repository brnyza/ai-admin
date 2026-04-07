import { prisma } from '@/libs/prisma'
import { withAuth } from '@/middlewares/withAuth'
import { withCors } from '@/middlewares/withCors'
import type { NextApiHandlerWithAuth } from '@/types/session'
import { hashPassword } from '@/utils/auth'

const handler: NextApiHandlerWithAuth = async (req, res) => {
  if (req.method === 'GET') return await GET()
  if (req.method === 'PUT') return await PUT()
  return res.status(405).json({ error: 'Método inválido' })

  async function GET() {
    console.log('me api', { user: req.user })
    const user = await prisma.sec_users.findUnique({
      where: {
        id: Number(req.user)
      }
      // include: {
      //   sec_users_groups: {
      //     select: {
      //       sec_groups: true
      //     }
      //   }
      // }
    })

    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' })

    return res.json({
      email: user.email,
      name: user.name,
      id: user.id
      // groups: user.sec_users_groups.map((group) => group.sec_groups)
    })
  }

  async function PUT() {
    const { name, pswd } = req.body

    const senhaEncriptada = pswd ? hashPassword(pswd) : undefined

    const dados = await prisma.sec_users.update({
      data: {
        name,
        pswd: senhaEncriptada
      },
      where: {
        id: req.user.id
      }
    })

    return res.json(dados)
  }
}

export default withCors(withAuth(handler))
