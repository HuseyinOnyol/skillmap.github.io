'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMockAuth } from '@/contexts/MockAuthContext'
// API route'ları üzerinden istekte bulunacağız
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  User, 
  ArrowLeft,
  Save
} from 'lucide-react'
import { Organization } from '@/types/app.types'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default function NewProfilePage() {
  const router = useRouter()
  const { user } = useMockAuth()
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    country: 'Turkey',
    title: '',
    seniority_years: 1,
    work_scope: 'FullCycle' as 'FullCycle' | 'Support',
    summary: '',
    project_areas: [] as string[],
    experiences_ui: [
      { name: '', areas: [] as string[], description: '', scope: 'FullCycle' as 'FullCycle' | 'Support' | 'Hybrid', duration_months: 0 }
    ],
    organization_id: '',
    visibility_level: 'public_masked' as 'public_masked' | 'partner_only' | 'private',
    status: 'draft' as 'published' | 'draft'
  })

  useEffect(() => {
    loadOrganizations()
    // Set default organization based on user role
    if (user?.role === 'partner_admin' || user?.role === 'partner_user') {
      setFormData(prev => ({ ...prev, organization_id: user.organization_id }))
    }
  }, [user])

  const loadOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations')
      const orgsData = await res.json()
      setOrganizations(orgsData)
    } catch (error) {
      console.error('Error loading organizations:', error)
    }
  }

  if (!user || (user.role !== 'owner' && user.role !== 'partner_admin')) {
    router.push('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const areasLine = (formData.project_areas && formData.project_areas.length > 0)
        ? `Yetenekler: ${formData.project_areas.join(', ')}`
        : ''

      const experienceLines = (formData.experiences_ui || [])
        .filter(exp => exp.name || exp.description || (exp.areas && exp.areas.length))
        .map(exp => {
          const pieces = [
            exp.name ? `Proje: ${exp.name}` : '',
            exp.scope ? `Kapsam: ${exp.scope}` : '',
            exp.areas && exp.areas.length ? `Alanlar: ${exp.areas.join(', ')}` : '',
            typeof exp.duration_months === 'number' && exp.duration_months > 0 ? `Süre: ${exp.duration_months} ay` : '',
            exp.description ? `Açıklama: ${exp.description}` : ''
          ].filter(Boolean)
          return `- ${pieces.join(' | ')}`
        })

      const summaryCombined = [
        areasLine,
        experienceLines.length ? 'Deneyimler:\n' + experienceLines.join('\n') : '',
        formData.summary
      ].filter(Boolean).join('\n')

      const { project_areas, experiences_ui, ...payload } = { ...formData, summary: summaryCombined }

      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      router.push('/dashboard/profiles')
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    })
  }
  
  const handleProjectAreasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value)
    setFormData({
      ...formData,
      project_areas: selected
    })
  }
  
  const toggleSkill = (skill: string) => {
    const exists = formData.project_areas.includes(skill)
    setFormData({
      ...formData,
      project_areas: exists
        ? formData.project_areas.filter(s => s !== skill)
        : [...formData.project_areas, skill]
    })
  }

  const addCustomSkill = () => {
    const skill = newSkill.trim()
    if (!skill) return
    if (!formData.project_areas.includes(skill)) {
      setFormData({ ...formData, project_areas: [...formData.project_areas, skill] })
    }
    setNewSkill('')
  }
  
  const addExperienceBlock = () => {
    setFormData({
      ...formData,
      experiences_ui: [...formData.experiences_ui, { name: '', areas: [], description: '', scope: 'FullCycle', duration_months: 0 }]
    })
  }

  const removeExperienceBlock = (index: number) => {
    const next = formData.experiences_ui.filter((_, i) => i !== index)
    setFormData({ ...formData, experiences_ui: next.length ? next : [{ name: '', areas: [], description: '', scope: 'FullCycle', duration_months: 0 }] })
  }

  const handleExperienceChange = (index: number, field: 'name' | 'description' | 'scope', value: string) => {
    const next = [...formData.experiences_ui]
    next[index] = { ...next[index], [field]: value }
    setFormData({ ...formData, experiences_ui: next })
  }

  const handleExperienceAreasChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value)
    const next = [...formData.experiences_ui]
    next[index] = { ...next[index], areas: selected }
    setFormData({ ...formData, experiences_ui: next })
  }

  const handleExperienceDurationChange = (index: number, value: string) => {
    const num = parseInt(value || '0')
    const next = [...formData.experiences_ui]
    next[index] = { ...next[index], duration_months: isNaN(num) ? 0 : num }
    setFormData({ ...formData, experiences_ui: next })
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Profiller', href: '/dashboard/profiles' },
          { label: 'Yeni Profil', current: true }
        ]} 
      />
      
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Profil Oluştur</h1>
          <p className="text-gray-600 mt-1">
            Yeni bir çalışan profili oluşturun
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Kişisel Bilgiler
            </CardTitle>
            <CardDescription>
              Çalışanın temel bilgilerini girin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad *
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Örn: Ahmet"
                />
              </div>
              
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Soyad *
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Örn: Yılmaz"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+90 532 123 4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Şehir *
                </label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Örn: İstanbul"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Ülke *
                </label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Örn: Turkey"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profesyonel Bilgiler</CardTitle>
            <CardDescription>
              Çalışanın iş deneyimi ve uzmanlık bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Ünvan *
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Örn: Senior SAP ABAP Developer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="seniority_years" className="block text-sm font-medium text-gray-700 mb-2">
                  Deneyim (Yıl) *
                </label>
                <Input
                  id="seniority_years"
                  name="seniority_years"
                  type="number"
                  min="0"
                  max="50"
                  required
                  value={formData.seniority_years}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="work_scope" className="block text-sm font-medium text-gray-700 mb-2">
                  Çalışma Kapsamı *
                </label>
                <select
                  id="work_scope"
                  name="work_scope"
                  value={formData.work_scope}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FullCycle">Full Cycle Development</option>
                  <option value="Support">Support & Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                Özet
              </label>
              <div className="mb-3">
                <div className="block text-sm text-gray-700 mb-2">Yetenekler</div>
                <div className="flex flex-wrap gap-3">
                  {['ABAP','Fiori','RAP'].map(s => (
                    <label key={s} className="inline-flex items-center text-sm">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={formData.project_areas.includes(s)}
                        onChange={() => toggleSkill(s)}
                      />
                      {s}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Örn: OData, CDS, BTP..."
                  />
                  <Button type="button" variant="outline" onClick={addCustomSkill}>Ekle</Button>
                </div>
                <div className="mt-2 text-xs text-gray-500">Kutucuklardan seçebilir veya kendi becerini ekleyebilirsin.</div>
              </div>
              {/* Repeating Experiences */}
              <div className="space-y-4">
                {formData.experiences_ui.map((exp, index) => (
                  <div key={index} className="border rounded-md p-3 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Proje adı</label>
                        <Input
                          type="text"
                          value={exp.name}
                          onChange={(e) => handleExperienceChange(index, 'name', e.target.value)}
                          placeholder="Örn: S/4HANA Dönüşüm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Kapsam</label>
                        <select
                          value={exp.scope}
                          onChange={(e) => handleExperienceChange(index, 'scope', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="FullCycle">Full Cycle</option>
                          <option value="Support">Support</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Çalışılan alanlar</label>
                        <select
                          multiple
                          value={exp.areas}
                          onChange={(e) => handleExperienceAreasChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
                        >
                          <option value="ABAP">ABAP</option>
                          <option value="Fiori">Fiori</option>
                          <option value="RAP">RAP</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Süre (ay)</label>
                        <Input
                          type="number"
                          min={0}
                          value={exp.duration_months || 0}
                          onChange={(e) => handleExperienceDurationChange(index, e.target.value)}
                          placeholder="Örn: 6"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm text-gray-700 mb-2">Açıklama</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        placeholder="Projedeki rolünüz, sorumluluklar ve çıktılar..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button type="button" variant="outline" onClick={() => removeExperienceBlock(index)}>Sil</Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addExperienceBlock}>+ Deneyim Ekle</Button>
              </div>
              <textarea
                id="summary"
                name="summary"
                rows={4}
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Çalışanın deneyimi ve uzmanlık alanları hakkında kısa bir açıklama..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Organization and Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Organizasyon ve Ayarlar</CardTitle>
            <CardDescription>
              Profil organizasyonu ve görünürlük ayarları
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.role === 'owner' && (
              <div>
                <label htmlFor="organization_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Organizasyon *
                </label>
                <select
                  id="organization_id"
                  name="organization_id"
                  required
                  value={formData.organization_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Organizasyon seçin</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="visibility_level" className="block text-sm font-medium text-gray-700 mb-2">
                  Görünürlük Seviyesi
                </label>
                <select
                  id="visibility_level"
                  name="visibility_level"
                  value={formData.visibility_level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public_masked">Halka Açık (Maskelenmiş)</option>
                  <option value="partner_only">Sadece Partnerler</option>
                  <option value="private">Özel</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
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
                Profil Oluştur
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
