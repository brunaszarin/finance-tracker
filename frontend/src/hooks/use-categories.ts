import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Category {
  id: string
  name: string
  type: 'INCOME' | 'EXPENSE'
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/api/categories'),
  })
}