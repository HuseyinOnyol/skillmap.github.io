import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// .env.local yoksa verilen değerleri varsayılan olarak kullan
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rwvcngqooxdvsmgyqluz.supabase.co/').replace(/\/$/, '')
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dmNuZ3Fvb3hkdnNtZ3lxbHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMDQ0MDksImV4cCI6MjA3MzU4MDQwOX0.GZLipQ8-1av8SK1xc6K5clJnc6vK0Q1j-y84h62q494'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Server-side client (for API routes)
export const createServerClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
