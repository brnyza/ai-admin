import jwt from 'jsonwebtoken'
import type { NextApiResponse } from 'next'
import type { DecodedToken, NextApiHandlerWithAuth, NextApiRequestWithAuth } from '@/types/session'

function withUserData(handler: NextApiHandlerWithAuth) {
  return async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
    const { authorization } = req.headers

    if (!authorization) return res.status(401).json({ error: 'Token inválido', code: 'token.invalid' })

    const [, token] = authorization.split(' ')

    if (!token) return res.status(401).json({ error: 'Token inválido', code: 'token.invalid' })

    try {
      const decoded = jwt.decode(token as string) as DecodedToken
      req.user = decoded.user
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido', code: 'token.invalid' })
    }
  }
}

export { withUserData }
