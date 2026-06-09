import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useTransactions, useCreateTransaction, useDeleteTransaction } from './use-transactions'
import { api } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = 'QueryClientWrapper'
  return Wrapper
}

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar lista de transações', async () => {
    // Arrange
    const mockTransactions = [
      { id: '1', description: 'Supermercado', amount: 150, date: '2026-06-01', type: 'EXPENSE', categoryId: 'cat1', categoryName: 'Alimentação' },
    ]
    vi.mocked(api.get).mockResolvedValue(mockTransactions)

    // Act
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockTransactions)
  })

  it('deve retornar erro quando API falha', async () => {
    // Arrange
    vi.mocked(api.get).mockRejectedValue(new Error('API error'))

    // Act
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useCreateTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar transação com sucesso', async () => {
    // Arrange
    const mockTransaction = {
      id: '1', description: 'Supermercado', amount: 150,
      date: '2026-06-01', type: 'EXPENSE', categoryId: 'cat1', categoryName: 'Alimentação'
    }
    vi.mocked(api.post).mockResolvedValue(mockTransaction)

    // Act
    const { result } = renderHook(() => useCreateTransaction(), { wrapper: createWrapper() })
    result.current.mutate({
      description: 'Supermercado', amount: 150,
      date: '2026-06-01', type: 'EXPENSE', categoryId: 'cat1'
    })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.post).toHaveBeenCalledWith('/api/transactions', expect.any(Object))
  })
})

describe('useDeleteTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve deletar transação com sucesso', async () => {
    // Arrange
    vi.mocked(api.delete).mockResolvedValue(undefined)

    // Act
    const { result } = renderHook(() => useDeleteTransaction(), { wrapper: createWrapper() })
    result.current.mutate('1')

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.delete).toHaveBeenCalledWith('/api/transactions/1')
  })
})