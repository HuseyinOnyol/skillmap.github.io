'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Building2, Users, UserPlus, Edit2, Trash2, X, Mail } from 'lucide-react'
import { Organization, User } from '@/types/app.types'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function EditPartnerPage() {
  const { user } = useMockAuth()
  const params = useParams()
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'partner' as const
  })
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'partner_user' as 'partner_admin' | 'partner_user'
  })

  useEffect(() => {
    loadOrganization()
  }, [params.id])

  const loadOrganization = async () => {
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
      
      if (org) {
        setOrganization(org)
        setFormData({
          name: org.name,
          type: org.type
        })
      }
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // TODO: Implement organization update API
      console.log('Updating organization:', formData)
      router.push('/dashboard/partners')
    } catch (error) {
      console.error('Error updating organization:', error)
    } finally {
      setSaving(false)
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
      await loadOrganization()
      setShowCreateUserModal(false)
      setNewUserForm({ name: '', email: '', role: 'partner_user' })
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewUserForm({
      name: user.name,
      email: user.email,
      role: user.role as 'partner_admin' | 'partner_user'
    })
    setShowEditUserModal(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser || !newUserForm.name || !newUserForm.email) return

    try {
      // TODO: Implement user update API
      console.log('Updating user:', editingUser.id, newUserForm)
      
      // For now, just update locally
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...newUserForm }
          : u
      ))
      
      setShowEditUserModal(false)
      setEditingUser(null)
      setNewUserForm({ name: '', email: '', role: 'partner_user' })
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return

    try {
      // TODO: Implement user delete API
      console.log('Deleting user:', userId)
      
      // For now, just remove locally
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

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
          { label: 'Düzenle', current: true }
        ]} 
      />

      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/partners">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Düzenle</h1>
          <p className="text-gray-600 mt-1">
            {organization.name} organizasyonunu düzenleyin
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Organizasyon Bilgileri</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizasyon Adı
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Organizasyon adı"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'partner' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="partner">Partner</option>
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/partners')}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Users Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Kullanıcı Yönetimi ({users.length})</span>
            </CardTitle>
            <Button 
              onClick={() => setShowCreateUserModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Yeni Kullanıcı
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz kullanıcı yok</h3>
              <p className="text-gray-600 mb-4">
                Bu organizasyonda henüz kayıtlı kullanıcı bulunmuyor.
              </p>
              <Button 
                onClick={() => setShowCreateUserModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                İlk Kullanıcıyı Ekle
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Katılım: {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={`${
                        user.role === 'partner_admin' 
                          ? 'text-green-600 border-green-200 bg-green-50' 
                          : 'text-blue-600 border-blue-200 bg-blue-50'
                      }`}
                    >
                      {user.role === 'partner_admin' ? 'Admin' : 'Kullanıcı'}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Kullanıcı Düzenle</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowEditUserModal(false)
                  setEditingUser(null)
                  setNewUserForm({ name: '', email: '', role: 'partner_user' })
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="space-y-4">
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
                  onClick={() => {
                    setShowEditUserModal(false)
                    setEditingUser(null)
                    setNewUserForm({ name: '', email: '', role: 'partner_user' })
                  }}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Güncelle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}