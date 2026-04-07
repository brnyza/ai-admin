import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { prisma } from '@/libs/prisma'
import type { JwtUserData } from '@/types/session'

const JWT_SECRET = `${process.env.JWT_SECRET}`

export const comparePassword = (password: string, storagePassword: string) => hashPassword(password) === storagePassword

export interface UserProps {
  id: number
  email: string
  name: string
}

export const generateNewSessionToken = ({ email, name, id }: UserProps): string => {
  const user = { email, name, id } as JwtUserData
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: '1d' })
}

export const generateNewRefreshToken = ({ email, name, id }: UserProps): string => {
  const user = { email, name, id } as JwtUserData
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: '7days' })
}

interface JWTTokenProps {
  user: JwtUserData
  iat: number
  exp: number
}

export const validateJwt = (token: string): JWTTokenProps | null => {
  try {
    const result = jwt.verify(token, JWT_SECRET) as JWTTokenProps
    return result
  } catch (error) {
    return null
  }
}

export const hashPassword = (password: string): string => {
  const hash = crypto.createHash('sha512')
  return hash.update(password, 'utf-8').digest('hex')
}

export async function generateJwtAndRefreshToken(userId: number, payload: object = {}) {
  const token = jwt.sign(payload, JWT_SECRET, {
    subject: String(userId), // sub
    expiresIn: '1d'
  })

  const refreshToken = await createRefreshToken(userId)

  return { token, refreshToken }
}

export async function createRefreshToken(user_id: number) {
  await prisma.sec_refresh_token.deleteMany({ where: { user_id } })

  const refreshToken = await prisma.sec_refresh_token.create({ select: { token: true }, data: { token: uuid(), user_id } })

  return refreshToken.token
}

export async function checkRefreshTokenIsValid(user_id: number, refreshToken: string) {
  const storageRefreshToken = await prisma.sec_refresh_token.findFirst({ select: { token: true }, where: { user_id } })
  return storageRefreshToken?.token === refreshToken
}

export async function invalidateRefreshToken(user_id: number) {
  await prisma.sec_refresh_token.deleteMany({ where: { user_id } })
}
