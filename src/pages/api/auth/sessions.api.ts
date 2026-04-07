import type { NextApiHandler } from 'next'
import { prisma } from '@/libs/prisma'
import { withCors } from '@/middlewares/withCors'
import { comparePassword, generateJwtAndRefreshToken } from '@/utils/auth'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') return await POST()
  return res.status(405).json({ error: 'Método inválido' })

  async function POST() {
    const { email, password } = req.body
    const user = await prisma.sec_users.findFirst({ select: { pswd: true, id: true }, where: { email } })

    if (!user) return res.status(401).json({ error: 'Email ou senha incorreta' })
    if (!user.pswd) return res.status(401).json({ error: 'Usuário sem senha' })

    const isValidPassword = comparePassword(password, user.pswd)

    if (!isValidPassword) return res.status(401).json({ error: 'Email ou senha incorreta' })

    const { refreshToken, token } = await generateJwtAndRefreshToken(user.id, {})

    // await prisma.$disconnect()

    return res.json({ token, refreshToken })
  }
}

export default withCors(handler)
