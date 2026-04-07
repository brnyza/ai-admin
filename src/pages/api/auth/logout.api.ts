import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { config } from '@/utils/config'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') return await deleteAllCookies()
  return res.status(405).json({ error: 'Método inválido' })

  async function deleteAllCookies() {
    const options = { maxAge: -1, path: '/' }
    console.info('deleteAllCookies')
    return res.setHeader('Set-Cookie', [serialize(config.token, '', options), serialize(config.refreshToken, '', options)]).redirect('/')
  }
}

export default handler
