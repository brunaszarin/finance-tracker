import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'

interface Summary {
  income: number
  expense: number
  balance: number
  month: string
}

export function useSummary(month: string) {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: ['summary', month],
    queryFn: () => api.get<Summary>(`/api/summary?month=${month}`),
    enabled: !!token,
  })
}