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
    setCookie('token', token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('token')
    deleteCookie('token')
    set({ user: null, token: null })
  },
}))