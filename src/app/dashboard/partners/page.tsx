'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Plus,
  Search,
  Edit,
  Users,
  Mail,
  Phone,
  Calendar,
  Eye,
  X,
  UserPlus
} from 'lucide-react'
import { Organization, User } from '@/types/app.types'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function PartnersPage() {
  const { user } = useMockAuth()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'partner_user' as 'partner_admin' | 'partner_user'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [orgsResponse, usersResponse] = await Promise.all([
        fetch('/api/organizations'),
        fetch('/api/partners/users')
      ])
      
      if (!orgsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const orgsData = await orgsResponse.json()
      const usersData = await usersResponse.json()
      
      // Filter out owner organization for partners view
      const partnerOrgs = orgsData.filter((org: Organization) => org.type === 'partner')
      setOrganizations(partnerOrgs)
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrgId || !newUserForm.name || !newUserForm.email) return

    try {
      const response = await fetch('/api/partners/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUserForm,
          organization_id: selectedOrgId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      // Reload data and close modal
      await loadData()
      setShowCreateUserModal(false)
      setNewUserForm({ name: '', email: '', role: 'partner_user' })
      setSelectedOrgId('')
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const openCreateUserModal = (orgId: string) => {
    setSelectedOrgId(orgId)
    setShowCreateUserModal(true)
  }

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) return null

  const canEdit = user.role === 'owner'

  const getOrganizationUsers = (orgId: string) => {
    return users.filter(user => user.organization_id === orgId)
  }

  const getOrganizationStats = (orgId: string) => {
    const orgUsers = getOrganizationUsers(orgId)
    const adminUsers = orgUsers.filter(user => user.role === 'partner_admin')
    const regularUsers = orgUsers.filter(user => user.role === 'partner_user')
    
    return {
      totalUsers: orgUsers.length,
      admins: adminUsers.length,
      users: regularUsers.length
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Partner Yönetimi', current: true }
        ]} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Partner organizasyonları ekleyin, kullanıcılarını yönetin ve çalışan profillerini görüntüleyin
          </p>
        </div>
        {canEdit && (
          <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Link href="/dashboard/partners/new">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Partner Ekle
            </Link>
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Partner organizasyon ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organizations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrganizations.map((org) => {
            const stats = getOrganizationStats(org.id)
            const orgUsers = getOrganizationUsers(org.id)
            
            return (
              <Card key={org.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{org.name}</CardTitle>
                        <CardDescription>
                          Partner Organizasyon
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {org.type}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                      <div className="text-xs text-gray-600">Toplam Kullanıcı</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.admins}</div>
                      <div className="text-xs text-gray-600">Admin</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.users}</div>
                      <div className="text-xs text-gray-600">Kullanıcı</div>
                    </div>
                  </div>

                  {/* Users List */}
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-gray-700 mb-3">Kullanıcılar</div>
                    <div className="space-y-2">
                      {orgUsers.slice(0, 3).map((user) => (
                        <div key={user.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                              {user.name[0]}
                            </div>
                            <span className="text-gray-700">{user.name}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              user.role === 'partner_admin' 
                                ? 'text-green-600 border-green-200' 
                                : 'text-blue-600 border-blue-200'
                            }`}
                          >
                            {user.role === 'partner_admin' ? 'Admin' : 'Kullanıcı'}
                          </Badge>
                        </div>
                      ))}
                      {orgUsers.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{orgUsers.length - 3} kullanıcı daha
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      Katılım: {new Date(org.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/partners/${org.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detaylar
                      </Link>
                    </Button>
                    {canEdit && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/partners/${org.id}/edit`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/partners/${org.id}/users`}>
                            <Users className="w-4 h-4 mr-1" />
                            Kullanıcılar
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openCreateUserModal(org.id)}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Hesap Oluştur
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredOrganizations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Partner bulunamadı' : 'Henüz partner yok'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'İlk partner organizasyonunuzu eklemek için yukarıdaki butona tıklayın.'
              }
            </p>
            {canEdit && !searchTerm && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Partner Ekle
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{organizations.length}</div>
              <div className="text-sm text-gray-600">Toplam Partner</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(user => user.role === 'partner_admin').length}
              </div>
              <div className="text-sm text-gray-600">Partner Admin</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(user => user.role === 'partner_user').length}
              </div>
              <div className="text-sm text-gray-600">Partner Kullanıcı</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {users.filter(user => user.organization?.type === 'partner').length}
              </div>
              <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Yeni Kullanıcı Oluştur</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCreateUserModal(false)}
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
                  onClick={() => setShowCreateUserModal(false)}
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
