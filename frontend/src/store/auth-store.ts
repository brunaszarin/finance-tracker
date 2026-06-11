import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  initFromStorage: () => void
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24}`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setCookie('token', token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    deleteCookie('token')
    set({ user: null, token: null })
  },
  initFromStorage: () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    if (token && user) {
      setCookie('token', token)
      set({ token, user })
    }
  },
}))

if (typeof window !== 'undefined') {
  useAuthStore.getState().initFromStorage()
}