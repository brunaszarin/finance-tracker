import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
  categoryName: string
}

export interface TransactionRequest {
  description: string
  amount: number
  date: string
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
}

export function useTransactions() {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.get<Transaction[]>('/api/transactions'),
    enabled: !!token,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TransactionRequest) =>
      api.post<Transaction>('/api/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}