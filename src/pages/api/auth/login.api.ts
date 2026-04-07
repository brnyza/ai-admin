import { serialize } from 'cookie'
import moment from 'moment'
import type { NextApiHandler } from 'next'
import { prisma } from '@/libs/prisma'
import { comparePassword, generateNewRefreshToken, generateNewSessionToken } from '@/utils/auth'
import { config } from '@/utils/config'

const handler: NextApiHandler = async (req, res) => {
  const ip = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string)
  const { email, password } = req.body
  await prisma.sec_log.create({ data: { method: req.method, url: req.url, ip, remarks: `tentativa de login, email: ${email}` } })
  const storageUser = await prisma.sec_users.findFirst({ where: { email } })

  if (!storageUser) {
    // await prisma.$disconnect()
    await prisma.sec_log.create({ data: { method: req.method, url: req.url, ip, remarks: `tentativa de login, email: ${email}, usuário não encontrado` } })
    return res.status(400).json({ error: 'Usuário ou senha incorreta' })
  }

  const isPasswordCorret = comparePassword(password, `${storageUser.pswd}`)

  if (!isPasswordCorret) {
    // await prisma.$disconnect()
    await prisma.sec_log.create({ data: { method: req.method, url: req.url, ip, remarks: `tentativa de login, email: ${email}, senha incorreta` } })
    return res.status(400).json({ error: 'Usuário ou senha incorreta' })
  }

  const { name, id } = storageUser

  const token = generateNewSessionToken({ name: name as string, id, email })
  const refreshToken = generateNewRefreshToken({ email, id, name: name as string })

  await prisma.sec_log.create({ data: { method: req.method, url: req.url, ip, remarks: `login realizado com sucesso, email: ${email}`, user: email } })

  return res
    .setHeader('Set-Cookie', [
      serialize(config.token, token, {
        path: '/',
        expires: moment().add(1, 'days').toDate()
      }),
      serialize(config.refreshToken, refreshToken, {
        path: '/',
        expires: moment().add(7, 'days').toDate(),
        httpOnly: true
      })
    ])
    .status(200)
    .send('Login feito com sucesso')
}

export default handler
