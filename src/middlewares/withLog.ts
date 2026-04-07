// import { prisma } from '@/libs/prisma'
// import type { NextApiRequestWithAuth } from '@/types/session'
// import { moment } from '@/utils/moment'
// import { PrismaParser } from '@/utils/prismaParser'

// export const createLog = async (req: NextApiRequestWithAuth) => {
//   const { url, method, user } = req

//   const urlWthQueries = url?.split('/api')[1]
//   const [onlyURL, params] = urlWthQueries?.split('?') || []
//   const body = JSON.stringify(req.body)

//   const hasParamId = params?.match(/id/gi)

//   const schemaName = onlyURL?.replace(/\//g, '').replace(/-/g, '_') as string
//   let previousBody = ''

//   if (prisma[schemaName] && hasParamId && req?.method?.match(/put|delete/i)) {
//     try {
//       const parser = new PrismaParser()
//       const parserModel = parser.parseModel(schemaName)
//       const primaryKey = parserModel.find((column) => column.isPrimary)

//       const idParamsValue = params ? params.split('&').find((param) => param.includes('$primaryKey.column')) : ''.split('=').pop()

//       if (primaryKey) {
//         const previousData = await prisma[schemaName].findFirst({
//           where: {
//             [primaryKey?.column]: primaryKey.type === 'Int' ? Number(idParamsValue) : idParamsValue
//           }
//         })

//         previousBody = JSON.stringify(previousData)
//       } else {
//         previousBody = JSON.stringify({
//           error: 'Não foi possível acessar o conteúdo da rota'
//         })
//       }
//     } catch (error) {
//       previousBody = JSON.stringify({
//         error: 'Não foi possível acessar o conteúdo da rota'
//       })
//     }
//   }

//   await prisma.sec_log.create({
//     data: {
//       method: method || '',
//       url: onlyURL || '',
//       user,
//       params,
//       body,
//       previous_body: previousBody,
//       created_at: moment().subtract(3, 'hours').toDate()
//     }
//   })
// }
