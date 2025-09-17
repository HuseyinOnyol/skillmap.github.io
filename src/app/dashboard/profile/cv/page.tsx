'use client'

import { useState, useEffect } from 'react'
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
  Download,
  Edit,
  Plus,
  Briefcase,
  GraduationCap,
  Award,
  Languages
} from 'lucide-react'
import { Profile, Experience } from '@/types/app.types'
import { getTagColorClass, formatSeniority } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default function ProfileCVPage() {
  const { user } = useMockAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  const loadUserProfile = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      // Find user's profile
      const profiles = await MockApiService.getProfiles()
      const userProfile = profiles.find(p => 
        p.organization_id === user.organization_id && 
        p.email === user.email
      ) as Profile
      
      setProfile(userProfile || null)
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
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Bulunamadı</h2>
          <p className="text-gray-600 mb-6">
            Henüz bir profiliniz yok. CV'nizi oluşturmak için profil oluşturun.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Profil Oluştur
          </Button>
        </div>
      </div>
    )
  }

  const canEdit = user.role === 'owner' || user.role === 'partner_admin' || 
                  (user.role === 'partner_user' && profile.email === user.email)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Profil', href: '/dashboard/profiles' },
          { label: 'CV Görünümü', current: true }
        ]} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CV Görünümü</h1>
          <p className="text-gray-600 mt-1">
            Profilinizin CV formatındaki görünümü
          </p>
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
            PDF İndir
          </Button>
        </div>
      </div>

      {/* CV Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Header Section */}
            <div className="text-center mb-8 pb-8 border-b">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {profile.first_name[0]}{profile.last_name[0]}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.first_name} {profile.last_name}
              </h1>
              <h2 className="text-xl text-gray-600 mb-4">{profile.title}</h2>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {profile.phone}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {profile.city}, {profile.country}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatSeniority(profile.seniority_years)} deneyim
                </div>
              </div>
            </div>

            {/* Summary */}
            {profile.summary && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Özet
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {profile.summary}
                </p>
              </div>
            )}

            {/* Skills & Expertise */}
            {profile.tags && profile.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Uzmanlık Alanları
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            )}

            {/* Experience */}
            {profile.experiences && profile.experiences.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Deneyim
                </h3>
                <div className="space-y-6">
                  {profile.experiences.map((experience) => (
                    <div key={experience.id} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{experience.project_name}</h4>
                          <p className="text-gray-600">{experience.client_name}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{experience.start_date} - {experience.end_date || 'Devam ediyor'}</div>
                          <div>{experience.duration_months && `${experience.duration_months} ay`}</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Badge variant="outline" className="text-xs">
                          {experience.role}
                        </Badge>
                        <Badge variant="outline" className="text-xs ml-2">
                          {experience.scope}
                        </Badge>
                        <Badge variant="outline" className="text-xs ml-2">
                          {experience.work_model}
                        </Badge>
                      </div>
                      
                      {experience.tech_modules && experience.tech_modules.length > 0 && (
                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-1">Kullanılan Teknolojiler:</div>
                          <div className="flex flex-wrap gap-1">
                            {experience.tech_modules.map(tech => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {experience.highlights && (
                        <p className="text-gray-700 text-sm">
                          {experience.highlights}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Scope */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Çalışma Kapsamı
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <Badge variant="outline" className="text-sm">
                  {profile.work_scope}
                </Badge>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t text-center text-sm text-gray-500">
              <p>Bu CV SkillMap sistemi tarafından otomatik olarak oluşturulmuştur.</p>
              <p className="mt-1">Son güncelleme: {new Date(profile.updated_at).toLocaleDateString('tr-TR')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
