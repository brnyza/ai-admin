import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/libs/prisma'
import type { NextApiHandlerWithAuth, NextApiRequestWithAuth } from '@/types/session'

export const withLog = (handler: NextApiHandler | NextApiHandlerWithAuth) => {
  return async (req: NextApiRequestWithAuth | NextApiRequest, res: NextApiResponse) => {
    const { url, method } = req
    const user = (req as NextApiRequestWithAuth).user

    const urlWthQueries = url?.split('/api')[1]
    const [onlyURL, params] = urlWthQueries?.split('?') || []

    await prisma.sec_log.create({
      data: {
        method: method || '',
        url: onlyURL || '',
        user: user?.email,
        params: params || undefined,
        body: req.body ? JSON.stringify(req.body) : undefined,
        ip: (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string)
      }
    })

    return (handler as NextApiHandlerWithAuth)(req as NextApiRequestWithAuth, res)
  }
}
