import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'

export interface Category {
  id: string
  name: string
  type: 'INCOME' | 'EXPENSE'
}

export function useCategories() {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/api/categories'),
    enabled: !!token,
  })
}