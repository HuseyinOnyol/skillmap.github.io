import { NextResponse } from 'next/server'
import { ApiJsonService as ApiService } from '@/lib/api-json'

export async function GET() {
  try {
    const orgs = await ApiService.getOrganizations()
    return NextResponse.json(orgs)
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 })
  }
}


