'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { MockApiService } from '@/lib/mockApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Users, 
  Building2, 
  MessageSquare, 
  BarChart3,
  TrendingUp,
  Plus,
  Eye,
  UserCheck,
  Clock
} from 'lucide-react'
import { Organization, User, ContactRequest } from '@/types/app.types'

export default function DashboardPage() {
  const { user } = useMockAuth()
  const [stats, setStats] = useState({
    totalProfiles: 0,
    totalPartners: 0,
    totalUsers: 0,
    openRequests: 0
  })
  const [recentPartners, setRecentPartners] = useState<Organization[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentRequests, setRecentRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [organizations, users, profiles, requests] = await Promise.all([
        MockApiService.getOrganizations(),
        MockApiService.getUsers(),
        MockApiService.getProfiles(),
        MockApiService.getContactRequests()
      ])

      const partnerOrgs = organizations.filter(org => org.type === 'partner')
      const openRequests = requests.filter(req => req.status === 'open')

      setStats({
        totalProfiles: profiles.length,
        totalPartners: partnerOrgs.length,
        totalUsers: users.length,
        openRequests: openRequests.length
      })

      // Son eklenen partnerler (son 3)
      setRecentPartners(partnerOrgs.slice(0, 3))
      
      // Son eklenen kullanıcılar (son 5)
      setRecentUsers(users.slice(0, 5))
      
      // Son iletişim talepleri (son 3)
      setRecentRequests(requests.slice(0, 3))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const getWelcomeMessage = () => {
    switch (user.role) {
      case 'owner':
        return 'Sistem Yöneticisi'
      case 'partner_admin':
        return 'Partner Yöneticisi'
      case 'partner_user':
        return 'Kullanıcı'
      default:
        return 'Kullanıcı'
    }
  }

  const getDashboardCards = () => {
    if (user.role === 'owner') {
      return [
        {
          title: 'Partner Yönetimi',
          description: 'Partner organizasyonları ve kullanıcılarını yönetin',
          icon: Building2,
          href: '/dashboard/partners',
          color: 'from-green-500 to-green-600',
          primary: true
        },
        {
          title: 'Tüm Profiller',
          description: 'Sistemdeki tüm çalışan profillerini görüntüleyin',
          icon: Users,
          href: '/dashboard/profiles',
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'İletişim Talepleri',
          description: 'Gelen talepleri yönetin ve yanıtlayın',
          icon: MessageSquare,
          href: '/dashboard/contact-requests',
          color: 'from-orange-500 to-orange-600'
        }
      ]
    }

    if (user.role === 'partner_admin') {
      return [
        {
          title: 'Organizasyon Profilleri',
          description: 'Kendi organizasyonunuzun profillerini yönetin',
          icon: Users,
          href: '/dashboard/profiles',
          color: 'from-blue-500 to-blue-600',
          primary: true
        },
        {
          title: 'İletişim Talepleri',
          description: 'Gelen talepleri görüntüleyin',
          icon: MessageSquare,
          href: '/dashboard/contact-requests',
          color: 'from-orange-500 to-orange-600'
        }
      ]
    }

    return [
      {
        title: 'Profilim',
        description: 'Kendi profilinizi görüntüleyin ve düzenleyin',
        icon: Users,
        href: '/dashboard/profile/cv',
        color: 'from-blue-500 to-blue-600',
        primary: true
      }
    ]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Hoş geldiniz, {user.name}!
        </h1>
        <p className="text-blue-100">
          {getWelcomeMessage()} olarak SkillMap sistemine giriş yaptınız.
        </p>
        {user.role === 'owner' && (
          <p className="text-blue-200 text-sm mt-2">
            Partner organizasyonları yönetin ve sistem genelinde çalışan profillerini görüntüleyin.
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalProfiles}</p>
                <p className="text-sm text-gray-600">Toplam Profil</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalPartners}</p>
                <p className="text-sm text-gray-600">Partner Organizasyon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.openRequests}</p>
                <p className="text-sm text-gray-600">Açık Talep</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getDashboardCards().map((card, index) => (
          <Card key={index} className={`hover:shadow-lg transition-shadow duration-200 ${card.primary ? 'ring-2 ring-blue-200' : ''}`}>
            <CardHeader>
              <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center text-white mb-2`}>
                <card.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={card.href}>
                  {card.primary ? 'Yönet' : 'Görüntüle'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Owner Specific Sections */}
      {user.role === 'owner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Partners */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Son Eklenen Partnerler
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/partners">
                    <Eye className="w-4 h-4 mr-1" />
                    Tümünü Gör
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPartners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                        {partner.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{partner.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(partner.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {partner.type}
                    </Badge>
                  </div>
                ))}
                {recentPartners.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Henüz partner organizasyon yok
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Son Eklenen Kullanıcılar
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/partners">
                    <Eye className="w-4 h-4 mr-1" />
                    Tümünü Gör
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Son Aktiviteler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Yeni iletişim talebi</p>
                  <p className="text-xs text-gray-500">
                    {request.requester_email} - {new Date(request.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {request.status}
                </Badge>
              </div>
            ))}
            {recentRequests.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                Henüz aktivite yok
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}