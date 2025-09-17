import { supabase } from './supabase'
import { 
  Profile, 
  Tag, 
  ContactRequest, 
  SearchFilters, 
  SearchResponse,
  User,
  Organization,
  Experience
} from '@/types/app.types'
import { MaskingService } from './masking'
import { calculateProfileScore } from './utils'

export class ApiService {
  // Tags
  static async getTags(category?: string) {
    let query = supabase
      .from('tags')
      .select('*')
      .eq('active', true)
      .order('display')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Tag[]
  }

  static async createTag(tag: Omit<Tag, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select()
      .single()

    if (error) throw error
    return data as Tag
  }

  static async updateTag(id: string, updates: Partial<Tag>) {
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Tag
  }

  static async deleteTag(id: string) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Profiles
  static async getProfiles(filters?: SearchFilters, viewerUser?: User | null) {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        organization:organizations(*),
        experiences(*),
        tags:profile_tags(tag:tags(*))
      `)
      .eq('status', 'published')

    // Filtreleri uygula
    if (filters?.source?.length) {
      if (filters.source.includes('owner')) {
        query = query.in('organizations.type', ['owner'])
      }
      if (filters.source.includes('partner')) {
        query = query.in('organizations.type', ['partner'])
      }
    }

    if (filters?.seniority_min) {
      query = query.gte('seniority_years', filters.seniority_min)
    }

    if (filters?.seniority_max) {
      query = query.lte('seniority_years', filters.seniority_max)
    }

    const { data, error } = await query
    if (error) throw error

    let profiles = data as Profile[]

    // Tag filtrelerini uygula
    if (filters) {
      profiles = this.applyTagFilters(profiles, filters)
    }

    // Skorlama
    if (filters) {
      profiles = profiles.map(profile => ({
        ...profile,
        score: calculateProfileScore(profile, filters)
      }))
    }

    // Sıralama
    profiles.sort((a, b) => {
      if (a.score && b.score && a.score !== b.score) {
        return b.score - a.score
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    // Maskeleme uygula
    const viewerRole = viewerUser?.role || null
    const maskedProfiles = MaskingService.applyVisibilityRules(
      profiles,
      viewerUser || null,
      viewerRole
    )

    return maskedProfiles
  }

  private static applyTagFilters(profiles: Profile[], filters: SearchFilters): Profile[] {
    return profiles.filter(profile => {
      const profileTags = profile.tags?.map(tag => tag.key) || []

      // Modules filter (AND logic)
      if (filters.modules?.length) {
        const hasAllModules = filters.modules.every(module => 
          profileTags.includes(module)
        )
        if (!hasAllModules) return false
      }

      // Techs filter (AND logic)
      if (filters.techs?.length) {
        const hasAllTechs = filters.techs.every(tech => 
          profileTags.includes(tech)
        )
        if (!hasAllTechs) return false
      }

      // Roles filter (OR logic)
      if (filters.roles?.length) {
        const hasAnyRole = filters.roles.some(role => 
          profileTags.includes(role)
        )
        if (!hasAnyRole) return false
      }

      // Scopes filter (OR logic)
      if (filters.scopes?.length) {
        const hasAnyScope = filters.scopes.some(scope => 
          profileTags.includes(scope) || profile.work_scope === scope
        )
        if (!hasAnyScope) return false
      }

      // Sectors filter (OR logic)
      if (filters.sectors?.length) {
        const hasAnySector = filters.sectors.some(sector => 
          profileTags.includes(sector)
        )
        if (!hasAnySector) return false
      }

      // Languages filter (AND logic)
      if (filters.langs?.length) {
        const hasAllLangs = filters.langs.every(lang => 
          profileTags.includes(lang)
        )
        if (!hasAllLangs) return false
      }

      return true
    })
  }

  static async getProfile(id: string, viewerUser?: User | null) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        organization:organizations(*),
        experiences(*),
        tags:profile_tags(tag:tags(*))
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    const profile = data as Profile
    const viewerRole = viewerUser?.role || null

    // Maskeleme kontrolü
    if (MaskingService.shouldMaskProfile(profile, viewerUser || null, viewerRole)) {
      return MaskingService.maskProfile(profile)
    }

    return profile
  }

  static async createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data as Profile
  }

  static async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  }

  static async deleteProfile(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Profile Tags
  static async updateProfileTags(profileId: string, tagIds: string[]) {
    // Önce mevcut tag'leri sil
    await supabase
      .from('profile_tags')
      .delete()
      .eq('profile_id', profileId)

    // Yeni tag'leri ekle
    if (tagIds.length > 0) {
      const profileTags = tagIds.map(tagId => ({
        profile_id: profileId,
        tag_id: tagId
      }))

      const { error } = await supabase
        .from('profile_tags')
        .insert(profileTags)

      if (error) throw error
    }
  }

  // Contact Requests
  static async createContactRequest(request: Omit<ContactRequest, 'id' | 'created_at' | 'handled_by' | 'status'>) {
    const { data, error } = await supabase
      .from('contact_requests')
      .insert({
        ...request,
        status: 'open'
      })
      .select()
      .single()

    if (error) throw error
    return data as ContactRequest
  }

  static async getContactRequests() {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as ContactRequest[]
  }

  static async updateContactRequest(id: string, updates: Partial<ContactRequest>) {
    const { data, error } = await supabase
      .from('contact_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as ContactRequest
  }

  // Organizations
  static async getOrganizations() {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Organization[]
  }

  static async createOrganization(org: Omit<Organization, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('organizations')
      .insert(org)
      .select()
      .single()

    if (error) throw error
    return data as Organization
  }

  // Users
  static async getUsers(organizationId?: string) {
    let query = supabase
      .from('users')
      .select(`
        *,
        organization:organizations(*)
      `)
      .order('created_at', { ascending: false })

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    const { data, error } = await query
    if (error) throw error
    return data as User[]
  }

  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'last_login_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select(`
        *,
        organization:organizations(*)
      `)
      .single()

    if (error) throw error
    return data as User
  }

  // Experiences
  static async createExperience(experienceData: Omit<Experience, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('experiences')
      .insert(experienceData)
      .select()
      .single()

    if (error) throw error
    return data as Experience
  }

  static async updateExperience(id: string, updates: Partial<Experience>) {
    const { data, error } = await supabase
      .from('experiences')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Experience
  }

  static async deleteExperience(id: string) {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
