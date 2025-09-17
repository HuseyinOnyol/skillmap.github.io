'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { MockApiService } from '@/lib/mockApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Edit,
  ArrowLeft,
  Briefcase,
  Award,
  Building2,
  Download
} from 'lucide-react'
import { Profile, Experience } from '@/types/app.types'
import { getTagColorClass, formatSeniority } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function ProfileDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useMockAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadProfile(params.id as string)
    }
  }, [params.id])

  const loadProfile = async (profileId: string) => {
    try {
      setLoading(true)
      const profileData = await MockApiService.getProfile(profileId, user)
      setProfile(profileData as Profile)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
        </div>
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Bulunamadı</h2>
          <p className="text-gray-600 mb-6">
            Aradığınız profil bulunamadı veya erişim yetkiniz yok.
          </p>
          <Button onClick={() => router.push('/dashboard/profiles')}>
            Profillere Dön
          </Button>
        </div>
      </div>
    )
  }

  const canEdit = user.role === 'owner' || 
                  (user.role === 'partner_admin' && profile.organization_id === user.organization_id) ||
                  (user.role === 'partner_user' && profile.email === user.email)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Profiller', href: '/dashboard/profiles' },
          { label: `${profile.first_name} ${profile.last_name}`, current: true }
        ]} 
      />
      
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-gray-600 mt-1">Profil Detayları</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {canEdit && (
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </Button>
          )}
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Download className="w-4 h-4 mr-2" />
            CV İndir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {profile.first_name[0]}{profile.last_name[0]}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-gray-600 mb-4">{profile.title}</p>
                
                <Badge 
                  variant={profile.status === 'published' ? 'default' : 'secondary'}
                  className="mb-4"
                >
                  {profile.status === 'published' ? 'Yayında' : 'Taslak'}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-700">{profile.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-700">{profile.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-700">{profile.city}, {profile.country}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-700">{formatSeniority(profile.seniority_years)} deneyim</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-700">{profile.organization?.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Scope */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Çalışma Kapsamı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-sm">
                {profile.work_scope}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          {profile.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Özet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {profile.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Skills & Expertise */}
          {profile.tags && profile.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Uzmanlık Alanları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['module', 'tech', 'role', 'scope', 'sector', 'lang', 'level'].map(category => {
                    const categoryTags = profile.tags?.filter(tag => tag.category === category) || []
                    if (categoryTags.length === 0) return null
                    
                    const categoryLabels = {
                      module: 'SAP Modülleri',
                      tech: 'Teknolojiler',
                      role: 'Roller',
                      scope: 'Kapsam',
                      sector: 'Sektörler',
                      lang: 'Diller',
                      level: 'Seviye'
                    }
                    
                    return (
                      <div key={category}>
                        <h4 className="font-medium text-gray-700 mb-2">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {categoryTags.map(tag => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className={`text-xs ${getTagColorClass(tag.category)}`}
                            >
                              {tag.display}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {profile.experiences && profile.experiences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Deneyim ({profile.experiences.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.experiences.map((experience) => (
                    <div key={experience.id} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{experience.project_name}</h4>
                          <p className="text-gray-600">{experience.client_name}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{experience.start_date} - {experience.end_date || 'Devam ediyor'}</div>
                          <div>{experience.duration_months && `${experience.duration_months} ay`}</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Badge variant="outline" className="text-xs mr-2">
                          {experience.role}
                        </Badge>
                        <Badge variant="outline" className="text-xs mr-2">
                          {experience.scope}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {experience.work_model}
                        </Badge>
                      </div>
                      
                      {experience.tech_modules && experience.tech_modules.length > 0 && (
                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-2">Kullanılan Teknolojiler:</div>
                          <div className="flex flex-wrap gap-2">
                            {experience.tech_modules.map(tech => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {experience.highlights && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700 text-sm">
                            {experience.highlights}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profil Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <div className="font-medium">Profil güncellendi</div>
                    <div className="text-gray-500">{new Date(profile.updated_at).toLocaleDateString('tr-TR')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm">
                    <div className="font-medium">Profil oluşturuldu</div>
                    <div className="text-gray-500">{new Date(profile.created_at).toLocaleDateString('tr-TR')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
