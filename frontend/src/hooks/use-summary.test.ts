import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useSummary } from './use-summary'
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

describe('useSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar resumo do mês', async () => {
    // Arrange
    const mockSummary = { income: 1000, expense: 500, balance: 500, month: '2026-06' }
    vi.mocked(api.get).mockResolvedValue(mockSummary)

    // Act
    const { result } = renderHook(() => useSummary('2026-06'), { wrapper: createWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockSummary)
    expect(api.get).toHaveBeenCalledWith('/api/summary?month=2026-06')
  })

  it('deve retornar erro quando API falha', async () => {
    // Arrange
    vi.mocked(api.get).mockRejectedValue(new Error('API error'))

    // Act
    const { result } = renderHook(() => useSummary('2026-06'), { wrapper: createWrapper() })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})