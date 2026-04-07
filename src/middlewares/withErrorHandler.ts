import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import type { NextApiHandlerWithAuth, NextApiRequestWithAuth } from '@/types/session'

export const withErrorHandler = (handler: NextApiHandlerWithAuth | NextApiHandler) => {
  return async (req: NextApiRequestWithAuth | NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req as any, res)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(400).json({ error: prismaErrorMsg(error) })
      }
      return res.status(500).json({ error: error.message })
    }
  }
}

const prismaErrorMsg = (error: PrismaClientKnownRequestError) => {
  const { code, meta } = error
  if (code === 'P2002') return 'Cadastro Duplicado (P2002)'
  if (code === 'P2003') return 'Erro, não foi possível deletar o registro, porque ele está sendo utilizado em outro local do sistema (P2003)'
  return `Erro DB (${code}), ${JSON.stringify(meta)}`
}
