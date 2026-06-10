'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, Tag, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/dashboard/categories', label: 'Categories', icon: Tag },
]

function SidebarContent({
  pathname,
  user,
  onLogout,
  onClose,
}: {
  pathname: string
  user: { name?: string; email?: string } | null
  onLogout: () => void
  onClose: () => void
}) {
  return (
    <>
      <div className="mb-8 px-2">
        <span className="text-xl font-bold text-gray-900">Finance</span>
        <span className="text-xl font-bold text-green-600">.</span>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
          Main
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="px-2">
          <p className="text-sm font-medium text-gray-900">{user?.name ?? 'Usuário'}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      <aside className="hidden md:flex w-56 bg-white border-r border-gray-100 flex-col py-6 px-4 fixed h-full">
        <SidebarContent
          pathname={pathname}
          user={user}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-white z-30 flex flex-col py-6 px-4 transition-transform duration-300 md:hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <SidebarContent
          pathname={pathname}
          user={user}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-900"
          >
            <Menu size={22} />
          </button>
          <div>
            <span className="text-base font-bold text-gray-900">Finance</span>
            <span className="text-base font-bold text-green-600">.</span>
          </div>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}