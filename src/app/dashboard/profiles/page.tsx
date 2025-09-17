'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { MockApiService } from '@/lib/mockApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Plus,
  Search,
  Edit,
  Eye,
  Trash2
} from 'lucide-react'
import { Profile, Tag } from '@/types/app.types'
import { getTagColorClass, formatSeniority } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
// JSON store'a server API'leri üzerinden erişeceğiz

export default function ProfilesPage() {
  const { user } = useMockAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [organizations, setOrganizations] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [profilesRes, orgsRes] = await Promise.all([
        fetch('/api/profiles'),
        fetch('/api/organizations')
      ])
      const profilesJson = await profilesRes.json()
      const profilesData = (profilesJson.items || []) as any[]
      const orgsData = await orgsRes.json()
      
      // Filter profiles based on user role
      let filteredProfiles = profilesData as Profile[]
      
      if (user?.role === 'partner_admin' || user?.role === 'partner_user') {
        // Partner users can only see profiles from their organization
        filteredProfiles = filteredProfiles.filter(
          profile => profile.organization_id === user.organization_id
        )
      }
      
      setProfiles(filteredProfiles)
      setOrganizations(orgsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProfiles = profiles.filter(profile => {
    const q = (searchTerm || '').toLowerCase()
    const matchesSearch =
      (profile.first_name || '').toLowerCase().includes(q) ||
      (profile.last_name || '').toLowerCase().includes(q) ||
      (profile.title || '').toLowerCase().includes(q) ||
      (profile.city || '').toLowerCase().includes(q) ||
      ((profile.organization?.name || '').toLowerCase().includes(q))

    const matchesOrganization = !selectedOrganization || profile.organization_id === selectedOrganization
    const matchesRole =
      !selectedRole ||
      (Array.isArray(profile.tags) && profile.tags.some(tag => 
        tag && (tag as any).category === 'role' && (tag as any).key && String((tag as any).key).toLowerCase().includes(selectedRole.toLowerCase())
      ))
    
    return matchesSearch && matchesOrganization && matchesRole
  })

  if (!user) return null

  const canEdit = user.role === 'owner' || user.role === 'partner_admin'
  const canDelete = user.role === 'owner'

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Profiller', current: true }
        ]} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profiller</h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'owner' 
              ? 'Tüm organizasyonların profillerini yönetin'
              : 'Organizasyonunuzun profillerini yönetin'
            }
          </p>
        </div>
        {canEdit && (
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/dashboard/profiles/new">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Profil
            </Link>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Profil ara (isim, unvan, şehir, organizasyon)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {user.role === 'owner' && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizasyon
                  </label>
                  <select
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tüm Organizasyonlar</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tüm Roller</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="consultant">Consultant</option>
                  <option value="developer">Developer</option>
                  <option value="junior">Junior</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedOrganization('')
                    setSelectedRole('')
                  }}
                  className="h-10"
                >
                  Temizle
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{filteredProfiles.length}</div>
              <div className="text-sm text-gray-600">
                {searchTerm || selectedOrganization || selectedRole ? 'Filtrelenmiş' : 'Toplam'} Profil
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredProfiles.filter(p => p.status === 'published').length}
              </div>
              <div className="text-sm text-gray-600">Yayında</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {filteredProfiles.filter(p => p.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-600">Taslak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredProfiles.map(p => p.organization_id)).size}
              </div>
              <div className="text-sm text-gray-600">Organizasyon</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profiles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {(profile.first_name || '').charAt(0)}{(profile.last_name || '').charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {profile.first_name} {profile.last_name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {profile.title}
                      </CardDescription>
                    </div>
                  </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {profile.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.city}, {profile.country}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatSeniority(profile.seniority_years)} deneyim
                  </div>
                </div>

                {/* Organization and Status */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">Organizasyon</div>
                    <Badge 
                      variant={profile.status === 'published' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {profile.status === 'published' ? 'Yayında' : 'Taslak'}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {profile.organization?.name}
                  </div>
                </div>

                {/* Tags */}
                {profile.tags && profile.tags.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500 mb-2">Uzmanlık Alanları</div>
                    <div className="flex flex-wrap gap-1">
                      {profile.tags.slice(0, 4).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className={`text-xs ${getTagColorClass(tag.category)}`}
                        >
                          {tag.display}
                        </Badge>
                      ))}
                      {profile.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/profiles/${profile.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Görüntüle
                      </Link>
                    </Button>
                    {canEdit && (
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Düzenle
                      </Button>
                    )}
                  </div>
                  {canDelete && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProfiles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Profil bulunamadı' : 'Henüz profil yok'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'İlk profilinizi oluşturmak için yukarıdaki butona tıklayın.'
              }
            </p>
            {canEdit && !searchTerm && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Profil Oluştur
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
