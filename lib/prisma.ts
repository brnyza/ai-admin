// import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// import { PrismaClient } from '../generated/prisma/client';

// const adapter = new PrismaPg(process.env.DATABASE_URL as string) // Assim também deu certo <<
// // const adapter = new PrismaMariaDb({
// //   host: process.env.DATABASE_HOST,
// //   user: process.env.DATABASE_USER,
// //   password: process.env.DATABASE_PASSWORD,
// //   database: process.env.DATABASE_NAME,
// //   connectionLimit: 5
// // });

// const createPrismaClient = () => {
//   return new PrismaClient({
//     adapter,
//     log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
//     // log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
//   })
// }

// const globalForPrisma = globalThis as unknown as {
//   prisma: ReturnType<typeof createPrismaClient> | undefined
// }

// export const prisma = globalForPrisma.prisma ?? createPrismaClient()
// if (process.env.NODE_ENV === 'development') global.prisma = prisma

// ;(BigInt.prototype as any).toJSON = function () {
//   const int = Number.parseFloat(this.toString())
//   return int ?? this.toString()
// }

interface CustomNodeJsGlobal {
  prisma: PrismaClient
}
// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export { prisma }
