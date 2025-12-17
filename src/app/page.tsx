// src/app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Եթե օգտատերը մուտք գործած է, ուղղորդել dashboard
  if (user) {
    redirect('/dashboard')
  }

  // Եթե մուտք չի գործել, ցույց տալ landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Cargo Guard</div>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>
      {/* ... landing page hero section ... */}
    </div>
  )
}