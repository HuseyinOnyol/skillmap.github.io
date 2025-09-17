export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          type: 'owner' | 'partner'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'owner' | 'partner'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'owner' | 'partner'
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'owner' | 'partner_admin' | 'partner_user'
          organization_id: string
          created_at: string
          last_login_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'owner' | 'partner_admin' | 'partner_user'
          organization_id: string
          created_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'owner' | 'partner_admin' | 'partner_user'
          organization_id?: string
          created_at?: string
          last_login_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          city: string | null
          country: string | null
          title: string
          seniority_years: number
          work_scope: 'FullCycle' | 'Support' | 'Hybrid'
          summary: string | null
          visibility_level: 'public_masked' | 'partners_masked' | 'internal_full'
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          city?: string | null
          country?: string | null
          title: string
          seniority_years: number
          work_scope: 'FullCycle' | 'Support' | 'Hybrid'
          summary?: string | null
          visibility_level?: 'public_masked' | 'partners_masked' | 'internal_full'
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          city?: string | null
          country?: string | null
          title?: string
          seniority_years?: number
          work_scope?: 'FullCycle' | 'Support' | 'Hybrid'
          summary?: string | null
          visibility_level?: 'public_masked' | 'partners_masked' | 'internal_full'
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          profile_id: string
          project_name: string
          client_name: string | null
          role: 'Lead' | 'Senior' | 'Mid' | 'Junior' | 'Consultant' | 'Developer'
          start_date: string
          end_date: string | null
          duration_months: number | null
          scope: 'FullCycle' | 'Support'
          tech_modules: string[]
          highlights: string | null
          work_model: 'Onsite' | 'Remote' | 'Hybrid'
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          project_name: string
          client_name?: string | null
          role: 'Lead' | 'Senior' | 'Mid' | 'Junior' | 'Consultant' | 'Developer'
          start_date: string
          end_date?: string | null
          duration_months?: number | null
          scope: 'FullCycle' | 'Support'
          tech_modules: string[]
          highlights?: string | null
          work_model: 'Onsite' | 'Remote' | 'Hybrid'
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          project_name?: string
          client_name?: string | null
          role?: 'Lead' | 'Senior' | 'Mid' | 'Junior' | 'Consultant' | 'Developer'
          start_date?: string
          end_date?: string | null
          duration_months?: number | null
          scope?: 'FullCycle' | 'Support'
          tech_modules?: string[]
          highlights?: string | null
          work_model?: 'Onsite' | 'Remote' | 'Hybrid'
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          category: 'module' | 'tech' | 'role' | 'scope' | 'sector' | 'lang' | 'level'
          key: string
          display: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category: 'module' | 'tech' | 'role' | 'scope' | 'sector' | 'lang' | 'level'
          key: string
          display: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category?: 'module' | 'tech' | 'role' | 'scope' | 'sector' | 'lang' | 'level'
          key?: string
          display?: string
          active?: boolean
          created_at?: string
        }
      }
      profile_tags: {
        Row: {
          profile_id: string
          tag_id: string
        }
        Insert: {
          profile_id: string
          tag_id: string
        }
        Update: {
          profile_id?: string
          tag_id?: string
        }
      }
      contact_requests: {
        Row: {
          id: string
          requester_email: string
          notes: string | null
          filters: any
          profile_refs: string[]
          created_at: string
          handled_by: string | null
          status: 'open' | 'in_progress' | 'closed'
        }
        Insert: {
          id?: string
          requester_email: string
          notes?: string | null
          filters: any
          profile_refs: string[]
          created_at?: string
          handled_by?: string | null
          status?: 'open' | 'in_progress' | 'closed'
        }
        Update: {
          id?: string
          requester_email?: string
          notes?: string | null
          filters?: any
          profile_refs?: string[]
          created_at?: string
          handled_by?: string | null
          status?: 'open' | 'in_progress' | 'closed'
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          entity: string
          entity_id: string
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity: string
          entity_id: string
          metadata: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity?: string
          entity_id?: string
          metadata?: any
          created_at?: string
        }
      }
    }
  }
}
