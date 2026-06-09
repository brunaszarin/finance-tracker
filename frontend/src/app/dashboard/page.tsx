'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuthStore } from '@/store/auth-store'
import { useSummary } from '@/hooks/use-summary'
import { useTransactions } from '@/hooks/use-transactions'

const COLORS = ['#16a34a', '#dc2626', '#2563eb', '#d97706', '#7c3aed', '#db2777']

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const month = format(currentDate, 'yyyy-MM')

  const { data: summary, isLoading: summaryLoading } = useSummary(month)
  const { data: transactions, isLoading: txLoading } = useTransactions()

  function prevMonth() {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  function nextMonth() {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  const chartData = transactions
    ?.filter(tx => tx.type === 'EXPENSE')
    .reduce((acc, tx) => {
      const existing = acc.find(item => item.name === tx.categoryName)
      if (existing) {
        existing.value += tx.amount
      } else {
        acc.push({ name: tx.categoryName, value: tx.amount })
      }
      return acc
    }, [] as { name: string; value: number }[]) ?? []

  const recentTransactions = transactions?.slice(0, 5) ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here is your financial overview for {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-4 py-2">
          <button onClick={prevMonth} className="text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-700 w-28 text-center capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button onClick={nextMonth} className="text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-1 bg-gray-900 text-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={18} className="text-gray-400" />
            <span className="text-sm text-gray-400">Total Balance</span>
          </div>
          <p className="text-3xl font-bold">
            {summaryLoading ? '...' : formatCurrency(summary?.balance ?? 0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp size={16} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Monthly Income</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {summaryLoading ? '...' : formatCurrency(summary?.income ?? 0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown size={16} className="text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Monthly Expenses</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {summaryLoading ? '...' : formatCurrency(summary?.expense ?? 0)}
          </p>
        </div>
      </div>

      {/* Spending Overview + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Spending Overview</h2>

          {chartData.length === 0 ? (
             <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-sm">Nenhuma despesa registrada</p>
            </div>
          ) : (
            <div className="flex gap-6">
              <ResponsiveContainer width="45%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                 <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex-1 space-y-3">
                {chartData.map((item, index) => {
                  const total = chartData.reduce((sum, i) => sum + i.value, 0)
                  const pct = Math.round((item.value / total) * 100)
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.value)}
                        </span>
                        <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-900">Recent Transactions</h2>
          </div>

          {txLoading ? (
            <p className="text-sm text-gray-400">Carregando...</p>
          ) : recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma transação ainda</p>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-400">
                      {tx.categoryName} · {format(new Date(tx.date), 'dd MMM', { locale: ptBR })}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}