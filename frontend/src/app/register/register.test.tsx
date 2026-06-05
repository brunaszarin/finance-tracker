import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterPage from './page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
}))

vi.mock('@/store/authStore', () => ({
  useAuthStore: () => vi.fn(),
}))

describe('RegisterPage', () => {
  it('renderiza todos os campos do formulário', () => {
    // Arrange
    render(<RegisterPage />)

    // Act - nenhuma ação necessária

    // Assert
    expect(screen.getByLabelText('Nome')).toBeDefined()
    expect(screen.getByLabelText('Email')).toBeDefined()
    expect(screen.getByLabelText('Senha')).toBeDefined()
    expect(screen.getByLabelText('Confirmar senha')).toBeDefined()
  })

  it('renderiza o botão de criar conta', () => {
    // Arrange
    render(<RegisterPage />)

    // Act - nenhuma ação necessária

    // Assert
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeDefined()
  })

  it('exibe erro quando nome é muito curto', async () => {
    // Arrange
    render(<RegisterPage />)
    const nameInput = screen.getByLabelText('Nome')
    const submitButton = screen.getByRole('button', { name: /criar conta/i })

    // Act
    fireEvent.change(nameInput, { target: { value: 'A' } })
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Nome deve ter no mínimo 2 caracteres')).toBeDefined()
    })
  })

  it('exibe erro quando senhas não coincidem', async () => {
    // Arrange
    render(<RegisterPage />)
    const passwordInput = screen.getByLabelText('Senha')
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha')
    const submitButton = screen.getByRole('button', { name: /criar conta/i })

    // Act
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.change(confirmPasswordInput, { target: { value: '654321' } })
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Senhas não coincidem')).toBeDefined()
    })
  })

  it('exibe link para fazer login', () => {
    // Arrange
    render(<RegisterPage />)

    // Act - nenhuma ação necessária

    // Assert
    expect(screen.getByText('Entrar')).toBeDefined()
  })
})