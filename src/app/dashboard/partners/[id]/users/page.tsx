'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Search,
  Mail,
  Calendar,
  X
} from 'lucide-react'
import { Organization, User } from '@/types/app.types'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function PartnerUsersPage() {
  const { user } = useMockAuth()
  const params = useParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'partner_user' as 'partner_admin' | 'partner_user'
  })

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [orgsResponse, usersResponse] = await Promise.all([
        fetch('/api/organizations'),
        fetch(`/api/partners/users?organization_id=${params.id}`)
      ])
      
      if (!orgsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const organizations = await orgsResponse.json()
      const usersData = await usersResponse.json()
      
      const org = organizations.find((o: Organization) => o.id === params.id)
      setOrganization(org || null)
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserForm.name || !newUserForm.email) return

    try {
      const response = await fetch('/api/partners/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUserForm,
          organization_id: params.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      // Reload data and close modal
      await loadData()
      setShowCreateModal(false)
      setNewUserForm({ name: '', email: '', role: 'partner_user' })
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user || user.role !== 'owner') {
    return <div>Yetkisiz erişim</div>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return <div>Partner organizasyon bulunamadı</div>
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Partner Yönetimi', href: '/dashboard/partners' },
          { label: organization.name, href: `/dashboard/partners/${organization.id}` },
          { label: 'Kullanıcılar', current: true }
        ]} 
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/partners">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            <p className="text-gray-600 mt-1">
              {organization.name} organizasyonunun kullanıcılarını yönetin
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Yeni Kullanıcı
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    user.role === 'partner_admin' 
                      ? 'text-green-600 border-green-200 bg-green-50' 
                      : 'text-blue-600 border-blue-200 bg-blue-50'
                  }`}
                >
                  {user.role === 'partner_admin' ? 'Admin' : 'Kullanıcı'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Katılım: {new Date(user.created_at).toLocaleDateString('tr-TR')}
              </div>
              
              {user.last_login_at && (
                <div className="text-xs text-gray-500">
                  Son giriş: {new Date(user.last_login_at).toLocaleDateString('tr-TR')}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Kullanıcı bulunamadı' : 'Henüz kullanıcı yok'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'İlk kullanıcıyı eklemek için yukarıdaki butona tıklayın.'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Yeni Kullanıcı
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Yeni Kullanıcı Oluştur</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <Input
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Kullanıcı adı soyadı"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <Input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="kullanici@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value as 'partner_admin' | 'partner_user' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="partner_user">Partner Kullanıcı</option>
                  <option value="partner_admin">Partner Admin</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Oluştur
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
