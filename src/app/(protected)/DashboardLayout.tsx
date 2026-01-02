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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3d62]"></div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-[url('/background2.png')] bg-no-repeat bg-cover bg-center bg-top">

        <div className="h-[102vh] min-h-[102vh] font-montserrat flex flex-col">
      <div className='block-1'><DashboardHeader userEmail={user?.email} /></div>
      
      <main className="block-2 !min-w-[97.5%] max-h-[86%] max-w-[88%] sm:max-w-[97.5%] scrollbar-thin mx-auto overflow-hidden">
        {children}
      </main>
    </div>
    </div>
  )
}