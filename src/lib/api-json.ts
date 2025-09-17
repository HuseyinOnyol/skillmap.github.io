import { readJson, writeJson, generateId } from './jsonStore'
import { Profile, Tag, SearchFilters, Organization, Experience, User } from '@/types/app.types'
import { calculateProfileScore } from './utils'

export class ApiJsonService {
  static async getTags(category?: string): Promise<Tag[]> {
    const db = readJson()
    const all = db.tags as Tag[]
    return category ? all.filter(t => t.active && t.category === category) : all.filter(t => t.active)
  }

  static async createTag(tag: Omit<Tag, 'id' | 'created_at'>): Promise<Tag> {
    const db = readJson()
    const newTag: Tag = { ...tag, id: generateId(), created_at: new Date().toISOString() }
    db.tags.push(newTag as any)
    writeJson(db)
    return newTag
  }

  static async getOrganizations(): Promise<Organization[]> {
    const db = readJson()
    return db.organizations as Organization[]
  }

  static async createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> {
    const db = readJson()
    const now = new Date().toISOString()
    const profile: Profile = { ...profileData, id: generateId(), created_at: now, updated_at: now }
    db.profiles.push(profile as any)
    writeJson(db)
    return profile
  }

  static async getProfiles(filters?: SearchFilters): Promise<Profile[]> {
    const db = readJson()
    let profiles = db.profiles as Profile[]
    if (filters) {
      profiles = profiles.map(p => ({ ...p, score: calculateProfileScore(p, filters) })) as any
      profiles.sort((a: any, b: any) => (a.score && b.score && a.score !== b.score) ? b.score - a.score : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    } else {
      profiles.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    }
    return profiles
  }

  static async updateProfileTags(profileId: string, tagIds: string[]): Promise<void> {
    const db = readJson()
    db.profile_tags = db.profile_tags.filter(pt => pt.profile_id !== profileId)
    tagIds.forEach(tid => db.profile_tags.push({ profile_id: profileId, tag_id: tid }))
    writeJson(db)
  }

  static async createExperience(experience: Omit<Experience, 'id' | 'created_at'>): Promise<Experience> {
    const db = readJson()
    const now = new Date().toISOString()
    const exp: Experience = { ...experience, id: generateId(), created_at: now }
    db.experiences.push(exp as any)
    writeJson(db)
    return exp
  }

  static async getUsers(organizationId?: string): Promise<User[]> {
    const db = readJson()
    let users = (db.users || []) as User[]
    if (organizationId) {
      users = users.filter(u => u.organization_id === organizationId)
    }
    return users
  }

  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'last_login_at'>): Promise<User> {
    const db = readJson()
    const now = new Date().toISOString()
    const user: User = { ...userData, id: generateId(), created_at: now, last_login_at: null }
    
    // Ensure users array exists
    if (!db.users) {
      db.users = []
    }
    
    db.users.push(user as any)
    writeJson(db)
    return user
  }
}


