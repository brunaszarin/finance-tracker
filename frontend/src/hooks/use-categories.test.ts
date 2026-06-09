import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useCategories } from './use-categories'
import { api } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = 'QueryClientWrapper'
  return Wrapper
}

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar lista de categorias', async () => {
    // Arrange
    const mockCategories = [
      { id: '1', name: 'Alimentação', type: 'EXPENSE' },
      { id: '2', name: 'Salário', type: 'INCOME' },
    ]
    vi.mocked(api.get).mockResolvedValue(mockCategories)

    // Act
    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockCategories)
    expect(api.get).toHaveBeenCalledWith('/api/categories')
  })

  it('deve retornar erro quando API falha', async () => {
    // Arrange
    vi.mocked(api.get).mockRejectedValue(new Error('API error'))

    // Act
    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})