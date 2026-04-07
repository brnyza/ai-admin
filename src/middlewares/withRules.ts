import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/libs/prisma'
import type { NextApiRequestWithAuth } from '@/types/session'
import { createLog } from './withLog'

async function getRules(req: NextApiRequest, userId: string) {
  const rules = {
    canView: false,
    canUpdate: false,
    canDelete: false,
    canInsert: false
  }

  if (!req.url) return rules
  const path = req?.url?.split('?')[0]?.split('/api')[1]

  const userGroups = await prisma.sec_groups.findMany({
    where: {
      sec_users_groups: {
        some: {
          user_id: userId
        }
      }
    }
  })

  const idGroups = userGroups.map((group) => group.id)

  const groupsRules = await prisma.sec_group_permission.findMany({
    include: {
      sec_routes: true
    },
    where: {
      group_id: { in: idGroups },
      AND: {
        sec_routes: {
          url: path
        }
      }
    }
  })

  // await prisma.$disconnect()

  groupsRules.forEach((rule) => {
    if (rule.canInsert) rules.canInsert = rule.canInsert
    if (rule.canUpdate) rules.canUpdate = rule.canUpdate
    if (rule.canDelete) rules.canDelete = rule.canDelete
    if (rule.canView) rules.canView = rule.canView
  })

  return rules
}

export const withRules = (handler: NextApiHandler) => {
  return async (req: NextApiRequestWithAuth, res: NextApiResponse): Promise<any> => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if (ip === '54.233.75.15') {
      // vindo do servidor PDF, permitir mesmo a página sendo 'Page.requireAuth = true'
      return handler(req, res)
    }
    if (!req.user) return res.status(401).send('Não foi possível validar o seu usuário')
    const rules = await getRules(req, req.user)
    if (!rules) return res.status(500).send('Erro ao verificar permissões')

    createLog(req)
    if (req.method === 'GET') {
      if (!rules.canView) return res.status(403).send('Você não tem permissão para vizualização')
    }
    if (req.method === 'PUT') {
      if (!rules.canUpdate) return res.status(403).send('Você não tem permissão para edição')
    }
    if (req.method === 'PATCH') {
      if (!rules.canUpdate) return res.status(403).send('Você não tem permissão para edição')
    }
    if (req.method === 'POST') {
      if (!rules.canInsert) return res.status(403).send('Você não tem permissão para inserção')
    }
    if (req.method === 'DELETE') {
      if (!rules.canDelete) return res.status(403).send('Você não tem permissão para deletar')
    }

    return handler(req, res)
  }
}
