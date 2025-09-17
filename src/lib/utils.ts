import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// PII Maskeleme fonksiyonları
export function maskName(firstName: string, lastName: string): string {
  const firstInitial = firstName.charAt(0).toUpperCase()
  const maskedLast = lastName.charAt(0).toUpperCase() + '*'.repeat(lastName.length - 1)
  return `${firstInitial}* ${maskedLast}`
}

export function maskEmail(email: string): string {
  const [username, domain] = email.split('@')
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1)
  const maskedDomain = domain.charAt(0) + '*'.repeat(domain.length - 1)
  return `${maskedUsername}@${maskedDomain}`
}

export function maskPhone(phone: string): string {
  return phone.replace(/\d/g, '*')
}

export function maskClientName(clientName: string, sector?: string): string {
  // Müşteri adını sektör genellemesine çevir
  const sectorMap: Record<string, string> = {
    'pharmaceutical': 'İlaç Sektörü',
    'ecommerce': 'E-ticaret',
    'automotive': 'Otomotiv',
    'finance': 'Finans',
    'retail': 'Perakende',
    'healthcare': 'Sağlık',
    'manufacturing': 'İmalat',
    'energy': 'Enerji',
    'telecom': 'Telekomünikasyon',
    'banking': 'Bankacılık'
  }
  
  return sector && sectorMap[sector.toLowerCase()] 
    ? sectorMap[sector.toLowerCase()]
    : 'Gizli Müşteri'
}

// Skorlama fonksiyonu
export function calculateProfileScore(
  profile: any,
  searchFilters: any
): number {
  let score = 0
  
  // Tag eşleşmeleri
  const profileTags = profile.tags || []
  const tagKeys = profileTags.map((tag: any) => tag.key)
  
  // Module eşleşmeleri (+3 puan)
  if (searchFilters.modules) {
    const moduleMatches = searchFilters.modules.filter((m: string) => 
      tagKeys.includes(m)
    ).length
    score += moduleMatches * 3
  }
  
  // Tech eşleşmeleri (+2 puan)
  if (searchFilters.techs) {
    const techMatches = searchFilters.techs.filter((t: string) => 
      tagKeys.includes(t)
    ).length
    score += techMatches * 2
  }
  
  // Role eşleşmeleri (+2 puan)
  if (searchFilters.roles) {
    const roleMatches = searchFilters.roles.filter((r: string) => 
      tagKeys.includes(r)
    ).length
    score += roleMatches * 2
  }
  
  // Scope eşleşmeleri (+2 puan)
  if (searchFilters.scopes) {
    const scopeMatches = searchFilters.scopes.filter((s: string) => 
      tagKeys.includes(s)
    ).length
    score += scopeMatches * 2
  }
  
  // Sector eşleşmeleri (+1 puan)
  if (searchFilters.sectors) {
    const sectorMatches = searchFilters.sectors.filter((s: string) => 
      tagKeys.includes(s)
    ).length
    score += sectorMatches * 1
  }
  
  // Language eşleşmeleri (+1 puan)
  if (searchFilters.langs) {
    const langMatches = searchFilters.langs.filter((l: string) => 
      tagKeys.includes(l)
    ).length
    score += langMatches * 1
  }
  
  // Kıdem yakınlığı (+1 puan)
  if (searchFilters.seniority_min || searchFilters.seniority_max) {
    const min = searchFilters.seniority_min || 0
    const max = searchFilters.seniority_max || 20
    if (profile.seniority_years >= min && profile.seniority_years <= max) {
      score += 1
    }
  }
  
  // Güncellik bonusu (+1 puan)
  const updatedAt = new Date(profile.updated_at)
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  
  if (updatedAt > ninetyDaysAgo) {
    score += 1
  }
  
  return score
}

// Tarih formatı
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Kıdem formatı
export function formatSeniority(years: number): string {
  if (years === 1) return '1 yıl'
  return `${years} yıl`
}

// Tag renk sınıfları
export function getTagColorClass(category: string): string {
  const colorMap: Record<string, string> = {
    'module': 'bg-blue-100 text-blue-800',
    'tech': 'bg-green-100 text-green-800',
    'role': 'bg-purple-100 text-purple-800',
    'scope': 'bg-orange-100 text-orange-800',
    'sector': 'bg-gray-100 text-gray-800',
    'lang': 'bg-indigo-100 text-indigo-800',
    'level': 'bg-yellow-100 text-yellow-800'
  }
  
  return colorMap[category] || 'bg-gray-100 text-gray-800'
}
