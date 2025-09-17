'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Search, Filter, User, Calendar, Mail } from 'lucide-react'
// Client bileşeninde fs kullanan servisleri çağırmayacağız; API route'larından fetch edeceğiz.
import { MaskedProfile, SearchFilters, Tag } from '@/types/app.types'
import { getTagColorClass, formatSeniority } from '@/lib/utils'

export default function PublicCatalogPage() {
  const [profiles, setProfiles] = useState<MaskedProfile[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const qs = new URLSearchParams()
      if (filters.modules?.length) qs.set('modules', filters.modules.join(','))
      if (filters.techs?.length) qs.set('techs', filters.techs.join(','))
      if (typeof filters.seniority_min === 'number') qs.set('seniority_min', String(filters.seniority_min))
      if (typeof filters.seniority_max === 'number') qs.set('seniority_max', String(filters.seniority_max))
      const [profilesRes, tagsRes] = await Promise.all([
        fetch(`/api/profiles?${qs.toString()}`),
        fetch(`/api/tags`)
      ])
      const profilesJson = await profilesRes.json()
      const tagsJson = await tagsRes.json()
      const profilesData = profilesJson.items || []
      const tagsData = tagsJson || []
      setProfiles(profilesData as MaskedProfile[])
      setTags(tagsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (filters.modules?.length) qs.set('modules', filters.modules.join(','))
      if (filters.techs?.length) qs.set('techs', filters.techs.join(','))
      if (typeof filters.seniority_min === 'number') qs.set('seniority_min', String(filters.seniority_min))
      if (typeof filters.seniority_max === 'number') qs.set('seniority_max', String(filters.seniority_max))
      const res = await fetch(`/api/profiles?${qs.toString()}`)
      const json = await res.json()
      setProfiles(json.items as MaskedProfile[])
    } catch (error) {
      console.error('Error searching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTagsByCategory = (category: string) => {
    return tags.filter(tag => tag.category === category)
  }

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const categoryKey = `${category}s` as keyof SearchFilters
      const currentValues = (prev[categoryKey] as string[]) || []
      
      if (checked) {
        return {
          ...prev,
          [categoryKey]: [...currentValues, value]
        }
      } else {
        return {
          ...prev,
          [categoryKey]: currentValues.filter(v => v !== value)
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">SkillMap</h1>
                <p className="text-sm text-gray-600 font-medium">SAP Uzman Kataloğu</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-medium"
                >
                  Giriş Yap
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              SAP Uzmanlarını
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Keşfedin
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Projeniz için en uygun SAP uzmanlarını bulun. Gelişmiş filtreleme ve akıllı eşleştirme sistemi ile doğru uzmanı keşfedin.
            </p>
            
            {/* Quick Search */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Teknoloji, modül veya rol arayın..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/90 text-gray-900 border-0 rounded-xl h-12 text-lg placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="bg-white text-blue-600 hover:bg-gray-100 rounded-xl h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Ara
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-6 font-semibold backdrop-blur-sm"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filtrele
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filters */}
      {showFilters && (
        <section className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gelişmiş Filtreler</h3>
              <p className="text-gray-600">Arama kriterlerinizi daraltarak daha spesifik sonuçlar elde edin</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Modules */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  SAP Modülleri
                </h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {getTagsByCategory('module').map(tag => (
                    <label key={tag.id} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 mr-3 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => handleFilterChange('module', tag.key, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{tag.display}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Teknolojiler
                </h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {getTagsByCategory('tech').map(tag => (
                    <label key={tag.id} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 mr-3 text-green-600 focus:ring-green-500"
                        onChange={(e) => handleFilterChange('tech', tag.key, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{tag.display}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Deneyim Seviyesi
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min. Yıl</label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        onChange={(e) => setFilters(prev => ({ ...prev, seniority_min: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max. Yıl</label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        onChange={(e) => setFilters(prev => ({ ...prev, seniority_max: parseInt(e.target.value) || 20 }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setFilters({})}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-6"
              >
                Filtreleri Temizle
              </Button>
              <Button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Filtreleri Uygula
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {loading ? 'Yükleniyor...' : `${profiles.length} uzman bulundu`}
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map((profile, index) => (
              <Card 
                key={profile.id} 
                className="group hover-lift bg-white border-0 shadow-soft hover:shadow-large transition-all duration-300 rounded-2xl overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {profile.display_name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {profile.display_name}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <User className="w-4 h-4 mr-1" />
                          {profile.title}
                        </div>
                      </div>
                    </div>
                    {profile.score && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full">
                          {profile.score.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {formatSeniority(profile.seniority_years)} deneyim
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {profile.summary && (
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {profile.summary}
                      </p>
                    )}
                    
                    {profile.tags && profile.tags.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {profile.tags.slice(0, 6).map((tagKey) => {
                            const tag = tags.find(t => t.key === tagKey)
                            return tag ? (
                              <span
                                key={tagKey}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${getTagColorClass(tag.category)}`}
                              >
                                {tag.display}
                              </span>
                            ) : null
                          })}
                          {profile.tags.length > 6 && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                              +{profile.tags.length - 6} daha
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(profile.updated_at).toLocaleDateString('tr-TR')}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-4 py-2 text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        İletişim
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && profiles.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sonuç bulunamadı
              </h3>
              <p className="text-gray-600">
                Arama kriterlerinizi değiştirerek tekrar deneyin.
              </p>
            </div>
          </div>
        )}
      </main>
      
      {/* Demo Info Card kapatıldı */}
    </div>
  )
}
