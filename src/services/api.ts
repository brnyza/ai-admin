import axios, { type AxiosError, type AxiosInstance } from 'axios'
import type { GetServerSidePropsContext } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '@/contexts/auth.context'
import { config } from '@/utils/config'
import { AuthTokenError } from './errors/AuthTokenError'

interface failedRequestsQueueProps {
  onSuccess: (token: string) => void
  onFailure: (err: AxiosError) => void
}

let isRefreshing = false
let failedRequestsQueue: failedRequestsQueueProps[] = []

export const setupApiClient = (ctx?: GetServerSidePropsContext): AxiosInstance => {
  let cookies = parseCookies(ctx)
  const api = axios.create({ baseURL: '/api' })

  api.defaults.headers.common.Authorization = `Bearer ${cookies[config.token]}`
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if ((error.response.data as any)?.code === 'token.expired') {
          cookies = parseCookies(ctx)
          const refreshToken = cookies[config.refreshToken]
          const originalConfig = error.config as any
          if (!isRefreshing) {
            isRefreshing = true
            api
              .post('/auth/refresh', { refreshToken })
              .then((response) => {
                const { token, refreshToken: newRefreshToken } = response.data

                const options = { maxAge: 60 * 60 * 24 * 30, path: '/' } // 30 days
                setCookie(ctx, config.token, token, options)
                setCookie(ctx, config.refreshToken, newRefreshToken, options)

                api.defaults.headers.common.Authorization = `Bearer ${token}`

                failedRequestsQueue.forEach((request) => {
                  request.onSuccess(token)
                })
                failedRequestsQueue = []
              })
              .catch((err) => {
                failedRequestsQueue.forEach((request) => {
                  request.onFailure(err)
                })
                failedRequestsQueue = []
                if (typeof window !== 'undefined') {
                  signOut()
                }
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers.Authorization = `Bearer ${token}`

                resolve(api(originalConfig))
              },
              onFailure: (err: AxiosError) => {
                reject(err)
              }
            })
          })
        }
        if (typeof window !== 'undefined') {
          signOut()
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }

      return Promise.reject(error)
    }
  )

  return api
}

export const api = setupApiClient()
