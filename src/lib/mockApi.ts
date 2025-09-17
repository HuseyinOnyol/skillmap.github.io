import { 
  Profile, 
  Tag, 
  ContactRequest, 
  SearchFilters, 
  SearchResponse,
  User,
  Organization,
  Experience,
  MaskedProfile
} from '@/types/app.types'
import { 
  mockProfiles, 
  mockTags, 
  mockContactRequests, 
  mockUsers, 
  mockOrganizations,
  demoCredentials
} from './mockData'
import { MaskingService } from './masking'
import { calculateProfileScore } from './utils'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export class MockApiService {
  // Tags
  static async getTags(category?: string): Promise<Tag[]> {
    await delay(300)
    let tags = mockTags
    if (category) {
      tags = tags.filter(tag => tag.category === category)
    }
    return tags
  }

  static async createTag(tag: Omit<Tag, 'id' | 'created_at'>): Promise<Tag> {
    await delay(500)
    const newTag: Tag = {
      ...tag,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    mockTags.push(newTag)
    return newTag
  }

  static async updateTag(id: string, updates: Partial<Tag>): Promise<Tag> {
    await delay(400)
    const index = mockTags.findIndex(tag => tag.id === id)
    if (index === -1) throw new Error('Tag not found')
    
    mockTags[index] = { ...mockTags[index], ...updates }
    return mockTags[index]
  }

  static async deleteTag(id: string): Promise<void> {
    await delay(300)
    const index = mockTags.findIndex(tag => tag.id === id)
    if (index === -1) throw new Error('Tag not found')
    mockTags.splice(index, 1)
  }

  // Profiles
  static async getProfiles(filters?: SearchFilters, viewerUser?: User | null): Promise<(Profile | MaskedProfile)[]> {
    await delay(500)
    
    let profiles = [...mockProfiles]

    // Apply filters
    if (filters) {
      profiles = this.applyTagFilters(profiles, filters)
    }

    // Calculate scores
    if (filters) {
      profiles = profiles.map(profile => ({
        ...profile,
        score: calculateProfileScore(profile, filters)
      }))
    }

    // Sort by score and updated_at
    profiles.sort((a, b) => {
      if (a.score && b.score && a.score !== b.score) {
        return b.score - a.score
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    // Apply masking
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

  static async getProfile(id: string, viewerUser?: User | null): Promise<Profile | MaskedProfile> {
    await delay(300)
    const profile = mockProfiles.find(p => p.id === id)
    if (!profile) throw new Error('Profile not found')

    const viewerRole = viewerUser?.role || null

    // Apply masking
    if (MaskingService.shouldMaskProfile(profile, viewerUser || null, viewerRole)) {
      return MaskingService.maskProfile(profile)
    }

    return profile
  }

  static async createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> {
    await delay(600)
    const newProfile: Profile = {
      ...profileData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      experiences: [],
      tags: []
    }
    mockProfiles.push(newProfile)
    return newProfile
  }

  static async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    await delay(500)
    const index = mockProfiles.findIndex(profile => profile.id === id)
    if (index === -1) throw new Error('Profile not found')
    
    mockProfiles[index] = { 
      ...mockProfiles[index], 
      ...updates, 
      updated_at: new Date().toISOString() 
    }
    return mockProfiles[index]
  }

  static async deleteProfile(id: string): Promise<void> {
    await delay(400)
    const index = mockProfiles.findIndex(profile => profile.id === id)
    if (index === -1) throw new Error('Profile not found')
    mockProfiles.splice(index, 1)
  }

  // Profile Tags
  static async updateProfileTags(profileId: string, tagIds: string[]): Promise<void> {
    await delay(400)
    const profile = mockProfiles.find(p => p.id === profileId)
    if (!profile) throw new Error('Profile not found')
    
    const tags = mockTags.filter(tag => tagIds.includes(tag.id))
    profile.tags = tags
  }

  // Contact Requests
  static async createContactRequest(request: Omit<ContactRequest, 'id' | 'created_at' | 'handled_by' | 'status'>): Promise<ContactRequest> {
    await delay(500)
    const newRequest: ContactRequest = {
      ...request,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      status: 'open'
    }
    mockContactRequests.push(newRequest)
    return newRequest
  }

  static async getContactRequests(): Promise<ContactRequest[]> {
    await delay(300)
    return [...mockContactRequests]
  }

  static async updateContactRequest(id: string, updates: Partial<ContactRequest>): Promise<ContactRequest> {
    await delay(400)
    const index = mockContactRequests.findIndex(req => req.id === id)
    if (index === -1) throw new Error('Contact request not found')
    
    mockContactRequests[index] = { ...mockContactRequests[index], ...updates }
    return mockContactRequests[index]
  }

  // Organizations
  static async getOrganizations(): Promise<Organization[]> {
    await delay(200)
    return [...mockOrganizations]
  }

  static async createOrganization(org: Omit<Organization, 'id' | 'created_at'>): Promise<Organization> {
    await delay(500)
    const newOrg: Organization = {
      ...org,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    mockOrganizations.push(newOrg)
    return newOrg
  }

  // Users
  static async getUsers(organizationId?: string): Promise<User[]> {
    await delay(300)
    let users = [...mockUsers]
    if (organizationId) {
      users = users.filter(user => user.organization_id === organizationId)
    }
    return users
  }

  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'last_login_at'>): Promise<User> {
    await delay(500)
    const organization = mockOrganizations.find(org => org.id === userData.organization_id)
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      organization
    }
    mockUsers.push(newUser)
    return newUser
  }

  // Experiences
  static async createExperience(experienceData: Omit<Experience, 'id' | 'created_at'>): Promise<Experience> {
    await delay(400)
    const newExperience: Experience = {
      ...experienceData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    
    // Add to profile
    const profile = mockProfiles.find(p => p.id === experienceData.profile_id)
    if (profile) {
      if (!profile.experiences) profile.experiences = []
      profile.experiences.push(newExperience)
    }
    
    return newExperience
  }

  static async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    await delay(400)
    // Find experience in profiles
    for (const profile of mockProfiles) {
      if (profile.experiences) {
        const index = profile.experiences.findIndex(exp => exp.id === id)
        if (index !== -1) {
          profile.experiences[index] = { ...profile.experiences[index], ...updates }
          return profile.experiences[index]
        }
      }
    }
    throw new Error('Experience not found')
  }

  static async deleteExperience(id: string): Promise<void> {
    await delay(300)
    // Find and remove experience from profiles
    for (const profile of mockProfiles) {
      if (profile.experiences) {
        const index = profile.experiences.findIndex(exp => exp.id === id)
        if (index !== -1) {
          profile.experiences.splice(index, 1)
          return
        }
      }
    }
    throw new Error('Experience not found')
  }

  // Authentication
  static async authenticate(email: string, password: string): Promise<User | null> {
    await delay(800) // Simulate network delay
    
    const credentials = demoCredentials[email as keyof typeof demoCredentials]
    if (credentials && credentials.password === password) {
      // Update last login
      const user = credentials.user
      user.last_login_at = new Date().toISOString()
      return user
    }
    
    return null
  }

  static async getUserById(id: string): Promise<User | null> {
    await delay(200)
    return mockUsers.find(user => user.id === id) || null
  }
}
