import knex from 'knex'

const handler = async (req: any, res: any) => {
  try {
    if (req.method === 'POST') return await POST()
    return res.status(405).json({ error: 'Método inválido' })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno', msg: error.message })
  }

  async function POST() {
    const { env_name, default_db } = req.body
    if (!env_name || !default_db) return res.status(400).json({ msg: 'env_name e default_db são obrigatórios' })

    const connection = process.env[env_name]
    if (!connection) return res.status(400).json({ msg: 'Conexão não encontrada, configurada no ENV' })

    const queryBuilder = knex({
      client: 'mysql',
      connection: `${connection}/${default_db}`,
      pool: { min: 0, max: 2, idleTimeoutMillis: 10 * 1000 }
    })

    const result = await queryBuilder.raw(`SELECT 1 
FROM information_schema.tables 
WHERE table_schema = '${default_db}'
LIMIT 1;`)
    return res.json({ msg: 'ok', result })
  }
}

export default handler
