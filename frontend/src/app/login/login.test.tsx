import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'

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

describe('LoginPage', () => {
  it('renderiza os campos de email e senha', () => {
    // Arrange
    render(<LoginPage />)

    // Act - nenhuma ação necessária, apenas verificação de renderização

    // Assert
    expect(screen.getByLabelText('Email')).toBeDefined()
    expect(screen.getByLabelText('Senha')).toBeDefined()
  })

  it('renderiza o botão de entrar', () => {
    // Arrange
    render(<LoginPage />)

    // Act - nenhuma ação necessária

    // Assert
    expect(screen.getByRole('button', { name: /entrar/i })).toBeDefined()
  })

  it('exibe erros de validação quando campos estão vazios', async () => {
    // Arrange
    render(<LoginPage />)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    // Act
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeDefined()
    })
  })

  it('exibe erro quando email é inválido', async () => {
    // Arrange
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')
    const form = screen.getByRole('button', { name: /entrar/i }).closest('form')!

    // Act
    fireEvent.change(emailInput, { target: { value: 'emailinvalido' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    Object.defineProperty(emailInput, 'validity', { get: () => ({ valid: true }) })
    fireEvent.submit(form)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeDefined()
    })
  })

  it('exibe link para criar conta', () => {
    // Arrange
    render(<LoginPage />)

    // Act - nenhuma ação necessária

    // Assert
    expect(screen.getByText('Criar conta')).toBeDefined()
  })
})