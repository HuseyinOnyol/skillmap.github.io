'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { MockApiService } from '@/lib/mockApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Calendar,
  User,
  Filter
} from 'lucide-react'
import { ContactRequest } from '@/types/app.types'
import { Breadcrumb } from '@/components/ui/breadcrumb'

const statusLabels = {
  open: 'Açık',
  in_progress: 'İşlemde',
  closed: 'Kapalı'
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  closed: 'bg-green-100 text-green-800 border-green-200'
}

export default function ContactRequestsPage() {
  const { user } = useMockAuth()
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const requestsData = await MockApiService.getContactRequests()
      setRequests(requestsData)
    } catch (error) {
      console.error('Error loading contact requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requester_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      await MockApiService.updateContactRequest(requestId, { 
        status: newStatus as any,
        handled_by: user?.id || null
      })
      loadRequests() // Reload data
    } catch (error) {
      console.error('Error updating request status:', error)
    }
  }

  if (!user) return null

  const canHandle = user.role === 'owner' || user.role === 'partner_admin'

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'İletişim Talepleri', current: true }
        ]} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İletişim Talepleri</h1>
          <p className="text-gray-600 mt-1">
            Gelen iletişim taleplerini yönetin ve yanıtlayın
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="E-posta veya not ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Durumlar</option>
                <option value="open">Açık</option>
                <option value="in_progress">İşlemde</option>
                <option value="closed">Kapalı</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('')}
        >
          Tümü ({requests.length})
        </Button>
        <Button
          variant={statusFilter === 'open' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('open')}
        >
          Açık ({requests.filter(r => r.status === 'open').length})
        </Button>
        <Button
          variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('in_progress')}
        >
          İşlemde ({requests.filter(r => r.status === 'in_progress').length})
        </Button>
        <Button
          variant={statusFilter === 'closed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('closed')}
        >
          Kapalı ({requests.filter(r => r.status === 'closed').length})
        </Button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {request.requester_email}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(request.created_at).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${statusColors[request.status]}`}
                  >
                    {statusLabels[request.status]}
                  </Badge>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">
                    {request.notes}
                  </p>
                </div>

                {/* Filters Applied */}
                {request.filters && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uygulanan Filtreler:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.filters.modules && request.filters.modules.map(module => (
                        <Badge key={module} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                      {request.filters.techs && request.filters.techs.map(tech => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {request.filters.roles && request.filters.roles.map(role => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                      {request.filters.seniority_min && (
                        <Badge variant="outline" className="text-xs">
                          Min {request.filters.seniority_min} yıl
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Profile References */}
                {request.profile_refs && request.profile_refs.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      İlgili Profiller ({request.profile_refs.length}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {request.profile_refs.map(profileId => (
                        <Badge key={profileId} variant="outline" className="text-xs">
                          Profil #{profileId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Detaylar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-1" />
                      Yanıtla
                    </Button>
                  </div>
                  
                  {canHandle && (
                    <div className="flex items-center space-x-2">
                      {request.status === 'open' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusUpdate(request.id, 'in_progress')}
                          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          İşleme Al
                        </Button>
                      )}
                      {request.status === 'in_progress' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusUpdate(request.id, 'closed')}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Kapat
                        </Button>
                      )}
                      {request.status === 'closed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusUpdate(request.id, 'open')}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Yeniden Aç
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter ? 'Talep bulunamadı' : 'Henüz talep yok'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'Henüz hiç iletişim talebi gelmemiş.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === 'open').length}
              </div>
              <div className="text-sm text-gray-600">Açık Talepler</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600">İşlemde</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'closed').length}
              </div>
              <div className="text-sm text-gray-600">Kapalı</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{requests.length}</div>
              <div className="text-sm text-gray-600">Toplam Talep</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
