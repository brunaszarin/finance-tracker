import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth-store'

describe('authStore', () => {
  beforeEach(() => {
    // Arrange — limpa o estado antes de cada teste
    useAuthStore.setState({ user: null, token: null })
    localStorage.clear()
  })

  it('deve ter estado inicial vazio', () => {
    // Arrange
    const state = useAuthStore.getState()

    // Act - nenhuma ação

    // Assert
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('deve salvar usuário e token ao chamar setAuth', () => {
    // Arrange
    const user = { id: '1', name: 'Bruna', email: 'bruna@email.com' }
    const token = 'fake_token_123'

    // Act
    useAuthStore.getState().setAuth(user, token)

    // Assert
    const state = useAuthStore.getState()
    expect(state.user).toEqual(user)
    expect(state.token).toBe(token)
  })

  it('deve salvar token no localStorage ao chamar setAuth', () => {
    // Arrange
    const user = { id: '1', name: 'Bruna', email: 'bruna@email.com' }
    const token = 'fake_token_123'

    // Act
    useAuthStore.getState().setAuth(user, token)

    // Assert
    expect(localStorage.getItem('token')).toBe(token)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(user))
  })

  it('deve limpar estado ao chamar logout', () => {
    // Arrange
    const user = { id: '1', name: 'Bruna', email: 'bruna@email.com' }
    useAuthStore.getState().setAuth(user, 'fake_token')

    // Act
    useAuthStore.getState().logout()

    // Assert
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('deve limpar localStorage ao chamar logout', () => {
    // Arrange
    const user = { id: '1', name: 'Bruna', email: 'bruna@email.com' }
    useAuthStore.getState().setAuth(user, 'fake_token')

    // Act
    useAuthStore.getState().logout()

    // Assert
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('deve restaurar estado do localStorage ao chamar initFromStorage', () => {
    // Arrange
    const user = { id: '1', name: 'Bruna', email: 'bruna@email.com' }
    const token = 'fake_token_123'
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    // Act
    useAuthStore.getState().initFromStorage()

    // Assert
    const state = useAuthStore.getState()
    expect(state.user).toEqual(user)
    expect(state.token).toBe(token)
  })
})