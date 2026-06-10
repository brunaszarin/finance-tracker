'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCategories } from '@/hooks/use-categories'
import { api } from '@/lib/api'

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['INCOME', 'EXPENSE']),
})

type CategoryForm = {
  name: string
  type: 'INCOME' | 'EXPENSE'
}

const inputClass = "bg-white border border-gray-200 rounded-lg text-sm h-9 px-3"
const popoverClass = "p-1 bg-white border border-gray-200 rounded-xl shadow-lg"

export default function CategoriesPage() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useCategories()

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { type: 'EXPENSE' },
  })

  const selectedType = watch('type')

  const createCategory = useMutation({
    mutationFn: (data: CategoryForm) => api.post('/api/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      reset()
      setOpen(false)
    },
  })

  const deleteCategory = useMutation({
    mutationFn: (id: string) => api.delete(`/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const incomeCategories = categories?.filter(c => c.type === 'INCOME') ?? []
  const expenseCategories = categories?.filter(c => c.type === 'EXPENSE') ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie suas categorias de receitas e despesas</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Nova categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-gray-900">Nova categoria</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit((data) => createCategory.mutate(data))} className="space-y-4 mt-2">

              {/* Tipo */}
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">Tipo</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-9 justify-between text-sm font-normal bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      {selectedType === 'EXPENSE' ? 'Despesa' : 'Receita'}
                      <ChevronDown size={14} className="text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className={popoverClass}
                    style={{ zIndex: 200 }}
                    align="start"
                    sideOffset={4}
                  >
                    {['EXPENSE', 'INCOME'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setValue('type', type as 'INCOME' | 'EXPENSE')}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {type === 'EXPENSE' ? 'Despesa' : 'Receita'}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              {/* Nome */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm text-gray-700">Nome</Label>
                <Input
                  id="name"
                  placeholder="Ex: Alimentação"
                  className={inputClass}
                  {...register('name')}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {createCategory.isError && (
                <p className="text-xs text-red-500">Erro ao criar categoria. Tente novamente.</p>
              )}

              <Button type="submit" className="w-full" disabled={createCategory.isPending}>
                {createCategory.isPending ? 'Salvando...' : 'Salvar categoria'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-gray-400">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Despesas */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <h2 className="text-sm font-semibold text-gray-900">Despesas</h2>
              <span className="ml-auto text-xs text-gray-400">{expenseCategories.length}</span>
            </div>
            {expenseCategories.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                Nenhuma categoria de despesa
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {expenseCategories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-900">{cat.name}</span>
                    <button
                      onClick={() => deleteCategory.mutate(cat.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Receitas */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <h2 className="text-sm font-semibold text-gray-900">Receitas</h2>
              <span className="ml-auto text-xs text-gray-400">{incomeCategories.length}</span>
            </div>
            {incomeCategories.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                Nenhuma categoria de receita
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {incomeCategories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-900">{cat.name}</span>
                    <button
                      onClick={() => deleteCategory.mutate(cat.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}