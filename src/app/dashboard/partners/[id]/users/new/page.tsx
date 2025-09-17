'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { MockApiService } from '@/lib/mockApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  UserPlus, 
  ArrowLeft,
  Save,
  Building2
} from 'lucide-react'
import { Organization, User } from '@/types/app.types'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default function NewUserPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useMockAuth()
  const [loading, setLoading] = useState(false)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'partner_user' as 'partner_admin' | 'partner_user'
  })

  useEffect(() => {
    if (params.id) {
      loadOrganization(params.id as string)
    }
  }, [params.id])

  const loadOrganization = async (orgId: string) => {
    try {
      const organizations = await MockApiService.getOrganizations()
      const org = organizations.find(o => o.id === orgId)
      setOrganization(org || null)
    } catch (error) {
      console.error('Error loading organization:', error)
    }
  }

  if (!user || user.role !== 'owner') {
    router.push('/dashboard')
    return null
  }

  if (!organization) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await MockApiService.createUser({
        ...formData,
        organization_id: organization.id
      })
      router.push(`/dashboard/partners/${organization.id}`)
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Partner Yönetimi', href: '/dashboard/partners' },
          { label: organization.name, href: `/dashboard/partners/${organization.id}` },
          { label: 'Yeni Kullanıcı', current: true }
        ]} 
      />
      
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Kullanıcı Ekle</h1>
          <p className="text-gray-600 mt-1">
            {organization.name} organizasyonuna yeni kullanıcı ekleyin
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Kullanıcı Bilgileri
            </CardTitle>
            <CardDescription>
              Yeni kullanıcının temel bilgilerini girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ornek@email.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Rol *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'partner_admin' | 'partner_user' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="partner_user">Kullanıcı</option>
                    <option value="partner_admin">Admin</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Admin kullanıcılar organizasyonu yönetebilir, normal kullanıcılar sadece kendi profillerini görüntüleyebilir.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Organizasyon</p>
                      <p className="text-sm text-blue-700">{organization.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Kullanıcı Ekle
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
