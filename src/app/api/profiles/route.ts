import { NextRequest, NextResponse } from 'next/server'
import { ApiJsonService as ApiService } from '@/lib/api-json'
import { SearchFilters } from '@/types/app.types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filters from query parameters
    const filters: SearchFilters = {}
    
    if (searchParams.get('modules')) {
      filters.modules = searchParams.get('modules')!.split(',')
    }
    if (searchParams.get('techs')) {
      filters.techs = searchParams.get('techs')!.split(',')
    }
    if (searchParams.get('roles')) {
      filters.roles = searchParams.get('roles')!.split(',')
    }
    if (searchParams.get('scopes')) {
      filters.scopes = searchParams.get('scopes')!.split(',')
    }
    if (searchParams.get('sectors')) {
      filters.sectors = searchParams.get('sectors')!.split(',')
    }
    if (searchParams.get('langs')) {
      filters.langs = searchParams.get('langs')!.split(',')
    }
    if (searchParams.get('seniority_min')) {
      filters.seniority_min = parseInt(searchParams.get('seniority_min')!)
    }
    if (searchParams.get('seniority_max')) {
      filters.seniority_max = parseInt(searchParams.get('seniority_max')!)
    }
    if (searchParams.get('source')) {
      filters.source = searchParams.get('source')!.split(',')
    }

    const profiles = await ApiService.getProfiles(filters)
    const masked = profiles.map((p: any) => ({
      id: p.id,
      display_name: `${p.first_name || ''} ${p.last_name ? p.last_name.charAt(0) + '.' : ''}`.trim(),
      title: p.title,
      seniority_years: p.seniority_years,
      work_scope: p.work_scope,
      summary: p.summary,
      tags: Array.isArray(p.tags)
        ? p.tags.map((t: any) => (typeof t === 'string' ? t : t.key)).filter(Boolean)
        : [],
      score: p.score,
      created_at: p.created_at,
      updated_at: p.updated_at,
    }))
    
    return NextResponse.json({
      items: masked,
      total: masked.length
    })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json()
    const profile = await ApiService.createProfile(profileData)
    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}
