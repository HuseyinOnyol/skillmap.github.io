'use client'

import { useState, useEffect } from 'react'
import { useMockAuth } from '@/contexts/MockAuthContext'
import { MockApiService } from '@/lib/mockApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Tag as TagIcon, 
  Plus,
  Search,
  Edit,
  Trash2,
  Filter
} from 'lucide-react'
import { Tag } from '@/types/app.types'
import { getTagColorClass } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/breadcrumb'

const categoryLabels = {
  module: 'Modül',
  tech: 'Teknoloji',
  role: 'Rol',
  scope: 'Kapsam',
  sector: 'Sektör',
  lang: 'Dil',
  level: 'Seviye'
}

export default function TagsPage() {
  const { user } = useMockAuth()
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      setLoading(true)
      const tagsData = await MockApiService.getTags()
      setTags(tagsData)
    } catch (error) {
      console.error('Error loading tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.display.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.key.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || tag.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(tags.map(tag => tag.category)))

  if (!user) return null

  const canEdit = user.role === 'owner'

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Tag Sözlüğü', current: true }
        ]} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tag Sözlüğü</h1>
          <p className="text-gray-600 mt-1">
            Sistemdeki tüm etiketleri yönetin ve düzenleyin
          </p>
        </div>
        {canEdit && (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Tag
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tag ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryLabels[category as keyof typeof categoryLabels] || category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('')}
        >
          Tümü ({tags.length})
        </Button>
        {categories.map(category => {
          const count = tags.filter(tag => tag.category === category).length
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {categoryLabels[category as keyof typeof categoryLabels] || category} ({count})
            </Button>
          )
        })}
      </div>

      {/* Tags Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags.map((tag) => (
            <Card key={tag.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {tag.display}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {tag.key}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTagColorClass(tag.category)}`}
                    >
                      {categoryLabels[tag.category as keyof typeof categoryLabels] || tag.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    {canEdit && (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {tag.active ? 'Aktif' : 'Pasif'}
                  </span>
                  <span>
                    {new Date(tag.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTags.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || selectedCategory ? 'Tag bulunamadı' : 'Henüz tag yok'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'İlk tag\'inizi oluşturmak için yukarıdaki butona tıklayın.'
              }
            </p>
            {canEdit && !searchTerm && !selectedCategory && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Tag Oluştur
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{tags.length}</div>
              <div className="text-sm text-gray-600">Toplam Tag</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {tags.filter(tag => tag.active).length}
              </div>
              <div className="text-sm text-gray-600">Aktif Tag</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Kategori</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {tags.filter(tag => tag.category === 'module').length}
              </div>
              <div className="text-sm text-gray-600">SAP Modülü</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
