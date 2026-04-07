import type { NextApiHandler } from 'next'
import { prisma } from '@/libs/prisma'
import { withCors } from '@/middlewares/withCors'
import type { JwtUserData } from '@/types/session'
import { comparePassword, generateJwtAndRefreshToken } from '@/utils/auth'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') return await POST()
  return res.status(405).json({ error: 'Método inválido' })

  async function POST() {
    const ip = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string)
    const { email, password } = req.body
    await prisma.sec_log.create({ data: { user: email, method: req.method, url: req.url, ip, remarks: `tentativa de login, email: ${email}` } })
    const user = await prisma.sec_users.findFirst({ select: { pswd: true, id: true, email: true, name: true }, where: { email } })

    if (!user) {
      await prisma.sec_log.create({ data: { user: email, method: req.method, url: req.url, ip, remarks: `email: ${email}, usuário não encontrado` } })
      return res.status(401).json({ error: 'Email ou senha incorreta' })
    }
    if (!user.pswd) {
      await prisma.sec_log.create({ data: { user: email, method: req.method, url: req.url, ip, remarks: `email: ${email}, usuário sem senha` } })
      return res.status(401).json({ error: 'Usuário sem senha' })
    }

    const isValidPassword = comparePassword(password, user.pswd)

    if (!isValidPassword) {
      await prisma.sec_log.create({ data: { user: email, method: req.method, url: req.url, ip, remarks: `email: ${email}, senha incorreta` } })
      return res.status(401).json({ error: 'Email ou senha incorreta' })
    }

    const { refreshToken, token } = await generateJwtAndRefreshToken(user.id, { user: { id: user.id, email: user.email, name: user.name } as JwtUserData })

    await prisma.sec_log.create({ data: { user: email, method: req.method, url: req.url, ip, remarks: `email: ${email}, login realizado com sucesso` } })
    // await prisma.$disconnect()

    return res.json({ token, refreshToken })
  }
}

export default withCors(handler)
