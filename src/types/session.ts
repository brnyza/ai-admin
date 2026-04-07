import type { NextApiRequest, NextApiResponse } from 'next'

export type JwtUserData = {
  email: string
  id: number
  name: string
}

export interface NextApiRequestWithAuth extends NextApiRequest {
  user: JwtUserData
}

export type NextApiHandlerWithAuth<T = void> = (req: NextApiRequestWithAuth, res: NextApiResponse) => T | Promise<T>

export type DecodedToken = {
  sub: string
  user: JwtUserData
}
