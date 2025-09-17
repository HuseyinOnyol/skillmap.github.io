import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { ApiService } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is owner
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!user || user.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const contactRequests = await ApiService.getContactRequests()
    
    return NextResponse.json(contactRequests)
  } catch (error) {
    console.error('Error fetching contact requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    
    // Validate required fields
    if (!requestData.requester_email || !requestData.filters) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const contactRequest = await ApiService.createContactRequest(requestData)
    
    return NextResponse.json(contactRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating contact request:', error)
    return NextResponse.json(
      { error: 'Failed to create contact request' },
      { status: 500 }
    )
  }
}
