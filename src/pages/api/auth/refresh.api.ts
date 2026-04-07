import { prisma } from '@/libs/prisma'
import { withCors } from '@/middlewares/withCors'
import type { NextApiHandlerWithAuth } from '@/types/session'
import { checkRefreshTokenIsValid, generateJwtAndRefreshToken, invalidateRefreshToken } from '@/utils/auth'
import { withUserData } from '@/utils/withUserData'

export const handler: NextApiHandlerWithAuth = async (req, res) => {
  if (req.method === 'POST') return await POST()
  return res.status(405).json({ error: 'Método inválido' })

  async function POST() {
    const userId = req.user
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ error: 'Refresh Token não encontrado' })

    const user = await prisma.sec_users.findUnique({
      where: {
        id: userId.id
      }
      // include: {
      //   sec_users_groups: {
      //     include: {
      //       sec_groups: true
      //     }
      //   }
      // }
    })

    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

    const isValidRefreshToken = await checkRefreshTokenIsValid(userId.id, refreshToken)

    if (!isValidRefreshToken) {
      return res.status(401).json({ error: true, message: 'Refresh Token inválido' })
    }

    await invalidateRefreshToken(userId.id)
    const { token, refreshToken: newRefreshToken } = await generateJwtAndRefreshToken(
      userId.id
      //   {
      //   groups: user.sec_users_groups.map((group) => group.sec_groups)
      // }
    )

    return res.json({
      token,
      refreshToken: newRefreshToken
    })
  }
}

export default withCors(withUserData(handler))
