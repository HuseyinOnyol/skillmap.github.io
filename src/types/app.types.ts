export type UserRole = 'owner' | 'partner_admin' | 'partner_user'
export type OrganizationType = 'owner' | 'partner'
export type WorkScope = 'FullCycle' | 'Support' | 'Hybrid'
export type ExperienceRole = 'Lead' | 'Senior' | 'Mid' | 'Junior' | 'Consultant' | 'Developer'
export type WorkModel = 'Onsite' | 'Remote' | 'Hybrid'
export type VisibilityLevel = 'public_masked' | 'partners_masked' | 'internal_full'
export type ProfileStatus = 'draft' | 'published' | 'archived'
export type ContactRequestStatus = 'open' | 'in_progress' | 'closed'
export type TagCategory = 'module' | 'tech' | 'role' | 'scope' | 'sector' | 'lang' | 'level'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organization_id: string
  organization?: Organization
  created_at: string
  last_login_at: string | null
}

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  created_at: string
}

export interface Profile {
  id: string
  organization_id: string
  organization?: Organization
  first_name: string
  last_name: string
  email: string
  phone: string | null
  city: string | null
  country: string | null
  title: string
  seniority_years: number
  work_scope: WorkScope
  summary: string | null
  visibility_level: VisibilityLevel
  status: ProfileStatus
  created_at: string
  updated_at: string
  experiences?: Experience[]
  tags?: Tag[]
  score?: number
}

export interface MaskedProfile {
  id: string
  display_name: string
  title: string
  seniority_years: number
  work_scope: WorkScope
  summary: string | null
  tags: string[]
  score?: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  profile_id: string
  project_name: string
  client_name: string | null
  role: ExperienceRole
  start_date: string
  end_date: string | null
  duration_months: number | null
  scope: WorkScope
  tech_modules: string[]
  highlights: string | null
  work_model: WorkModel
  created_at: string
}

export interface Tag {
  id: string
  category: TagCategory
  key: string
  display: string
  active: boolean
  created_at: string
}

export interface ContactRequest {
  id: string
  requester_email: string
  notes: string | null
  filters: SearchFilters
  profile_refs: string[]
  created_at: string
  handled_by: string | null
  status: ContactRequestStatus
}

export interface SearchFilters {
  modules?: string[]
  techs?: string[]
  roles?: string[]
  scopes?: string[]
  sectors?: string[]
  langs?: string[]
  seniority_min?: number
  seniority_max?: number
  source?: string[]
  availability?: boolean
}

export interface SearchRequest {
  filters: SearchFilters
  sort?: 'score_desc' | 'updated_desc'
  limit?: number
  offset?: number
}

export interface SearchResponse {
  items: MaskedProfile[]
  total: number
}

export interface InviteRequest {
  email: string
  name: string
  role: UserRole
  organization_id: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity: string
  entity_id: string
  metadata: Record<string, any>
  created_at: string
}
