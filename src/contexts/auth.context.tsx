import { useAlert } from '@bluemarble/bm-components'
import Router from 'next/router'
import { parseCookies, setCookie } from 'nookies'
import { createContext, type FC, type ReactNode, useEffect, useState } from 'react'
import { api } from '@/services/api'
import { config } from '@/utils/config'
import { getErrorMessage } from '@/utils/errorHandler'

interface UserProps {
  id: string
  name: string
  email: string
  // groups: sec_groups[]
}

interface SignInCredentials {
  email: string
  password: string
}

type AuthenticateStatus = 'autenticated' | 'unauthenticated' | 'loading'

interface AuthContextProps {
  user?: UserProps
  status: AuthenticateStatus
  signIn(credentials: SignInCredentials): Promise<boolean>
  signOut: () => void
  showSidebar: boolean
  setShowSidebar: (value: boolean) => void
}

export async function signOut() {
  // // authChannel.postMessage('signOut')
  await api.get('/auth/logout')
  Router.push('/sign-in')
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)
interface IAuthProvider {
  children: ReactNode
}

export const AuthProvider: FC<IAuthProvider> = ({ children }) => {
  const [user, setUser] = useState<UserProps>()
  const [status, setStatus] = useState<AuthenticateStatus>('unauthenticated')
  const [showSidebar, setShowSidebar] = useState(true)

  const { createAlert } = useAlert()

  async function signIn({ email, password }: SignInCredentials): Promise<boolean> {
    setStatus('loading')
    try {
      const response = await api.post('/auth/sessions', { email, password })

      const { token, refreshToken } = response.data

      const options = { maxAge: 60 * 60 * 24 * 30, path: '/' } // 30d
      setCookie(undefined, config.token, token, options)
      setCookie(undefined, config.refreshToken, refreshToken, options)

      api.defaults.headers.common.Authorization = `Bearer ${token}`

      const { data } = await api.get('/auth/me')
      const { name, id } = data

      setUser({ email, name, id })
      setStatus('autenticated')
      return true
    } catch (error) {
      createAlert(getErrorMessage(error), 'error')
      setStatus('unauthenticated')
      return false
    }
  }

  function clientSignOut() {
    signOut()
    setUser(undefined)
  }

  useEffect(() => {
    const cookie = parseCookies()
    const token = cookie[config.token]
    if (token) {
      setStatus('loading')
      api
        .get('/auth/me')
        .then((response) => {
          const { email, name, id } = response.data
          setStatus('autenticated')
          setUser({ email, name, id })
        })
        .catch(() => {
          setStatus('unauthenticated')
          signOut()
        })
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signOut: clientSignOut,
        signIn,
        status,
        showSidebar,
        setShowSidebar
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
