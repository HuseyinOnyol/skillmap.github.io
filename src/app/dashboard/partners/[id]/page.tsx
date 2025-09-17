'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Calendar,
  Edit,
  UserPlus,
  Mail
} from 'lucide-react'
import { Organization, User } from '@/types/app.types'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function PartnerDetailPage() {
  const { user } = useMockAuth()
  const params = useParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

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

  if (!user) return null

  const canEdit = user.role === 'owner'

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

  const adminUsers = users.filter(u => u.role === 'partner_admin')
  const regularUsers = users.filter(u => u.role === 'partner_user')

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Partner Yönetimi', href: '/dashboard/partners' },
          { label: organization.name, current: true }
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
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-sm">
                  {organization.type}
                </Badge>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Katılım: {new Date(organization.created_at).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          </div>
        </div>
        {canEdit && (
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/partners/${organization.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/partners/${organization.id}/users`}>
                <Users className="w-4 h-4 mr-2" />
                Kullanıcı Yönetimi
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{adminUsers.length}</div>
              <div className="text-sm text-gray-600">Admin Kullanıcı</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{regularUsers.length}</div>
              <div className="text-sm text-gray-600">Normal Kullanıcı</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Kullanıcılar ({users.length})</span>
            </CardTitle>
            {canEdit && (
              <Button size="sm" asChild>
                <Link href={`/dashboard/partners/${organization.id}/users`}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Kullanıcı Ekle
                </Link>
              </Button>
            )}
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
              {canEdit && (
                <Button asChild>
                  <Link href={`/dashboard/partners/${organization.id}/users`}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    İlk Kullanıcıyı Ekle
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Admin Users */}
              {adminUsers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Admin Kullanıcılar</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {adminUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Admin
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Users */}
              {regularUsers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Normal Kullanıcılar</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {regularUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          Kullanıcı
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}