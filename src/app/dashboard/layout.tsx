'use client'

import { useMockAuth } from '@/contexts/MockAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Users, 
  Building2, 
  FileText, 
  Mail, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, signOut } = useMockAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navigation = [
    ...(user.role === 'owner' ? [
      { name: 'Partner Yönetimi', href: '/dashboard/partners', icon: Building2 },
      { name: 'Tüm Profiller', href: '/dashboard/profiles', icon: Users },
      { name: 'İletişim Talepleri', href: '/dashboard/contact-requests', icon: Mail },
    ] : []),
    ...(user.role === 'partner_admin' ? [
      { name: 'Çalışanlarım', href: '/dashboard/profiles', icon: Users },
      { name: 'Profil Ekle', href: '/dashboard/profiles/new', icon: FileText },
    ] : []),
    ...(user.role === 'partner_user' ? [
      { name: 'Profilim', href: '/dashboard/profile', icon: Users },
    ] : []),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-md shadow-large">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-6 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-gradient">SkillMap</h1>
            </div>
            <nav className="px-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-4 py-3 text-base font-medium rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-4 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-gray-200/50 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-base font-semibold text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-soft">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">SkillMap</h1>
                <p className="text-xs text-gray-500 font-medium">Dashboard</p>
              </div>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  <item.icon className="mr-4 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-gray-200/50 p-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-72 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white/80 backdrop-blur-md">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
