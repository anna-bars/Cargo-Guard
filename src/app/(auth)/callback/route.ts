// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        `http://localhost:3001/login?error=${encodeURIComponent(error.message)}`
      )
    }
  }

  // Ուղղորդել dashboard էջ (3001-ով)
  return NextResponse.redirect('http://localhost:3001/dashboard')
}