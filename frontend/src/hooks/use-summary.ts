import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface Summary {
  income: number
  expense: number
  balance: number
  month: string
}

export function useSummary(month: string) {
  return useQuery({
    queryKey: ['summary', month],
    queryFn: () => api.get<Summary>(`/api/summary?month=${month}`),
  })
}