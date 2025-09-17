import { NextRequest, NextResponse } from 'next/server'
import { ApiJsonService as ApiService } from '@/lib/api-json'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('organization_id') || undefined
    const users = await ApiService.getUsers(orgId)
    
    // Handle undefined or null users
    if (!users) {
      return NextResponse.json([])
    }
    
    // Ensure users are properly serializable
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const user = await ApiService.createUser(data)
    
    // Handle undefined or null user
    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
    
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}


