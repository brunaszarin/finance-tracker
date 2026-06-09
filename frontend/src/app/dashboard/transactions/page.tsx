'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Trash2, ChevronLeft, ChevronRight, CalendarIcon, ChevronDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useTransactions, useCreateTransaction, useDeleteTransaction } from '@/hooks/use-transactions'
import { useCategories } from '@/hooks/use-categories'

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
})

type TransactionForm = {
  description: string
  amount: number
  date: string
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
}

const inputClass = "bg-white border border-gray-200 rounded-lg text-sm h-9 px-3"
const popoverClass = "p-1 bg-white border border-gray-200 rounded-xl shadow-lg"

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function TransactionsPage() {
  const [open, setOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const month = format(currentDate, 'yyyy-MM')

  const { data: transactions, isLoading } = useTransactions()
  const { data: categories } = useCategories()
  const createTransaction = useCreateTransaction()
  const deleteTransaction = useDeleteTransaction()

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'EXPENSE' },
  })

  const selectedType = watch('type')
  const selectedCategoryId = watch('categoryId')
  const filteredCategories = categories?.filter(c => c.type === selectedType) ?? []
  const filteredTransactions = transactions?.filter(tx => tx.date.startsWith(month)) ?? []

  function prevMonth() {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  function nextMonth() {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  function onSubmit(data: TransactionForm) {
    createTransaction.mutate(data, {
      onSuccess: () => {
        reset()
        setSelectedDate(undefined)
        setOpen(false)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie suas receitas e despesas</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2">
            <button onClick={prevMonth} className="text-gray-400 hover:text-gray-700 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-gray-700 w-28 text-center capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button onClick={nextMonth} className="text-gray-400 hover:text-gray-700 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Nova transação
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6" aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle className="text-base font-semibold text-gray-900">Nova transação</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">

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
                          onClick={() => {
                            setValue('type', type as 'INCOME' | 'EXPENSE')
                            setValue('categoryId', '')
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {type === 'EXPENSE' ? 'Despesa' : 'Receita'}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Descrição */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm text-gray-700">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Ex: Supermercado"
                    className={inputClass}
                    {...register('description')}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                {/* Valor */}
                <div className="space-y-1.5">
                  <Label htmlFor="amount" className="text-sm text-gray-700">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    className={inputClass}
                    {...register('amount', { valueAsNumber: true })}
                  />
                  {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
                </div>

                {/* Data */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-700">Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-9 justify-start text-left text-sm font-normal bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <CalendarIcon size={14} className="mr-2 text-gray-400" />
                        {selectedDate
                          ? format(selectedDate, 'dd/MM/yyyy')
                          : <span className="text-gray-400">Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-fit p-0 bg-white border border-gray-200 rounded-xl shadow-lg"
                      style={{ zIndex: 200 }}
                      align="start"
                      sideOffset={4}
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                          if (date) setValue('date', format(date, 'yyyy-MM-dd'))
                        }}
                        locale={ptBR}
                        className="rounded-xl p-3"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                </div>

                {/* Categoria */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-700">Categoria</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-9 justify-between text-sm font-normal bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <span className={!selectedCategoryId ? 'text-gray-400' : ''}>
                          {selectedCategoryId
                            ? filteredCategories.find(c => c.id === selectedCategoryId)?.name
                            : 'Selecione uma categoria'}
                        </span>
                        <ChevronDown size={14} className="text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className={popoverClass}
                      style={{ zIndex: 200 }}
                      align="start"
                      sideOffset={4}
                    >
                      {filteredCategories.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-gray-400">Nenhuma categoria encontrada</p>
                      ) : (
                        filteredCategories.map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setValue('categoryId', cat.id)}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {cat.name}
                          </button>
                        ))
                      )}
                    </PopoverContent>
                  </Popover>
                  {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
                </div>

                {createTransaction.isError && (
                  <p className="text-xs text-red-500">Erro ao criar transação. Tente novamente.</p>
                )}

                <Button type="submit" className="w-full" disabled={createTransaction.isPending}>
                  {createTransaction.isPending ? 'Salvando...' : 'Salvar transação'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Carregando...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Nenhuma transação em {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${tx.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-400">
                      {tx.categoryName} · {format(new Date(tx.date + 'T12:00:00'), 'dd MMM yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <button
                    onClick={() => deleteTransaction.mutate(tx.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}