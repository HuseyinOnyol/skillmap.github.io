import { sqlite, generateId } from './db-sqlite'
import { Profile, Tag, SearchFilters, Organization, Experience } from '@/types/app.types'
import { calculateProfileScore } from './utils'

function rows<T = any>(stmt: string, params: any[] = []): T[] {
  return sqlite.prepare(stmt).all(...params) as T[]
}

function run(stmt: string, params: any[] = []): void {
  sqlite.prepare(stmt).run(...params)
}

export class ApiSqliteService {
  static async getTags(category?: string): Promise<Tag[]> {
    if (category) {
      return rows<Tag>(`SELECT * FROM tags WHERE active = 1 AND category = ?`, [category])
    }
    return rows<Tag>(`SELECT * FROM tags WHERE active = 1`)
  }

  static async getOrganizations(): Promise<Organization[]> {
    return rows<Organization>(`SELECT * FROM organizations`)
  }

  static async createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> {
    const id = generateId()
    const now = new Date().toISOString()
    run(
      `INSERT INTO profiles (
        id, organization_id, first_name, last_name, email, phone, city, country,
        title, seniority_years, work_scope, summary, visibility_level, status,
        created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id, profileData.organization_id, profileData.first_name, profileData.last_name, profileData.email,
        profileData.phone || null, profileData.city || null, profileData.country || null,
        profileData.title, profileData.seniority_years, profileData.work_scope, profileData.summary || null,
        profileData.visibility_level, profileData.status, now, now
      ]
    )
    return { ...profileData, id, created_at: now, updated_at: now }
  }

  static async getProfiles(filters?: SearchFilters): Promise<Profile[]> {
    const all = rows<Profile>(`SELECT * FROM profiles`)

    // Apply simple tag filters later if needed; for now return basic list
    let profiles = all

    if (filters) {
      profiles = profiles.map(p => ({
        ...p,
        score: calculateProfileScore(p, filters)
      })) as any
      profiles.sort((a: any, b: any) => {
        if (a.score && b.score && a.score !== b.score) return b.score - a.score
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
    } else {
      profiles.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    }

    return profiles
  }

  static async createTag(tag: Omit<Tag, 'id' | 'created_at'>): Promise<Tag> {
    const id = generateId()
    const now = new Date().toISOString()
    run(`INSERT INTO tags (id, category, key, display, active, created_at) VALUES (?,?,?,?,?,?)`,
      [id, tag.category, tag.key, tag.display, tag.active ? 1 : 0, now]
    )
    return { ...tag, id, created_at: now }
  }

  static async updateProfileTags(profileId: string, tagIds: string[]): Promise<void> {
    run(`DELETE FROM profile_tags WHERE profile_id = ?`, [profileId])
    const ins = sqlite.prepare(`INSERT INTO profile_tags (profile_id, tag_id) VALUES (?,?)`)
    sqlite.transaction((ids: string[]) => {
      ids.forEach((tid) => ins.run(profileId, tid))
    })(tagIds)
  }

  static async createExperience(experience: Omit<Experience, 'id' | 'created_at'>): Promise<Experience> {
    const id = generateId()
    const now = new Date().toISOString()
    run(`INSERT INTO experiences (
      id, profile_id, project_name, client_name, role, start_date, end_date, duration_months,
      scope, tech_modules, highlights, work_model, created_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
      id, experience.profile_id, experience.project_name, experience.client_name || null,
      experience.role, experience.start_date, experience.end_date || null, experience.duration_months || null,
      experience.scope, (experience.tech_modules || []).join(' '), experience.highlights || null,
      experience.work_model, now
    ])
    return { ...experience, id, created_at: now }
  }
}


