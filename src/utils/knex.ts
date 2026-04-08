import knex from 'knex'
import 'dotenv/config'

export const queryBuilder = knex({
  client: 'pg',
  // connection: process.env.DATABASE_URL_EC2,
  connection: process.env.DATABASE_URL_PG,
  pool: { min: 0, max: 2, idleTimeoutMillis: 10 * 1000 }
})

export const queryBuilderPg = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL_PG,
  pool: { min: 0, max: 2, idleTimeoutMillis: 10 * 1000 }
})

export async function insertOrUpdate(knex: any, tableName: string, data: any) {
  const firstData = data[0] ? data[0] : data
  return await knex.raw(
    `${knex(tableName).insert(data).toQuery()} ON DUPLICATE KEY UPDATE ${Object.getOwnPropertyNames(firstData)
      .map((field) => `${field}=VALUES(${field})`)
      .join(', ')}`
  )
}

export async function insertOrUpdatetoQuery(knex: any, tableName: string, data: any) {
  const firstData = data[0] ? data[0] : data
  return await knex
    .raw(
      `${knex(tableName).insert(data).toQuery()} ON DUPLICATE KEY UPDATE ${Object.getOwnPropertyNames(firstData)
        .map((field) => `${field}=VALUES(${field})`)
        .join(', ')}`
    )
    .toQuery()
}

interface iLogDB {
  log: string
  // total_registros?: number
  // registros_afetados?: number
}

export async function logDB(dadosLog: iLogDB) {
  return await queryBuilder('api_bm_log').insert(dadosLog)
}

const logs: string[] = []

export const bmLog = (message: string) => logs.push(message)

export const registerBmLog = async () => {
  if (logs.length > 0) {
    await logDB({ log: logs.join('\n') })
    logs.length = 0
  }
}
