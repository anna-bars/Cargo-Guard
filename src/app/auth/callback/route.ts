import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('🔵 Auth callback called')
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Code:', code ? 'Present' : 'Missing')
  
  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Auth error:', error.message)
        return NextResponse.redirect('http://localhost:3001/login?error=' + encodeURIComponent(error.message))
      }
      
      console.log('✅ Session exchange successful')
    } catch (error: any) {
      console.error('❌ Unexpected error:', error)
      return NextResponse.redirect('http://localhost:3001/login?error=Authentication+failed')
    }
  }
  
  // Հաջողության դեպքում
  return NextResponse.redirect('http://localhost:3001/dashboard')
}