'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import DashboardHeader from '../components/dashboard/DashboardHeader'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        redirect('/login')
      }
      
      setUser(user)
      setLoading(false)
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3d62]"></div>
      </div>
    )
  }

  return (
    <div className='h-[100vh] max-h-[100vh] overflow-hidden'>
        <div className="h-[102vh] min-h-[102vh] bg-[#f3f3f6] font-montserrat flex flex-col">
      <div className='block-1'><DashboardHeader userEmail={user?.email} /></div>
      
      <main className="block-2 !min-w-[96%] max-h-[86%] max-w-[88%] sm:max-w-[96%] scrollbar-thin mx-auto overflow-hidden">
        {children}
      </main>
    </div>
    </div>
  )
}