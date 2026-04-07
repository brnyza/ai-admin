import type { NextApiHandler, NextApiResponse } from 'next'
import nextCors from 'nextjs-cors'
import type { NextApiHandlerWithAuth, NextApiRequestWithAuth } from '@/types/session'

export const withCors = (handler: NextApiHandler | NextApiHandlerWithAuth) => {
  return async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
    await nextCors(req, res, {
      methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
      origin: '*',
      optionsSuccessStatus: 200
    })
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    return handler(req, res)
  }
}
