import jwt from 'jsonwebtoken'
import type { NextApiResponse } from 'next'
import type { DecodedToken, NextApiHandlerWithAuth, NextApiRequestWithAuth } from '@/types/session'
import { config } from '@/utils/config'

function withAuth(handler: NextApiHandlerWithAuth) {
  return async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if (ip === '54.233.75.15') {
      // vindo do servidor PDF, permitir mesmo a página sendo 'Page.requireAuth = true'
      return handler(req, res)
    }
    const token = req.headers.authorization?.split(' ')[1] || req.cookies[config.token]
    console.log('withAuth', { token })

    if (!token) return res.status(401).json({ error: 'Token inválido', code: 'token.invalid' })

    try {
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as DecodedToken
      console.log('withAuth', { decoded })
      req.user = decoded.sub as any
      return handler(req, res)
    } catch (error: any) {
      return res.status(401).json({ error: 'Token inválido', code: 'token.expired', errMsg: error.message })
    }
  }
}

export { withAuth }
