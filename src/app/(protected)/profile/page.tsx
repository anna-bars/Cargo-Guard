'use client'

import { useState } from 'react'
import DashboardLayout from '../DashboardLayout'
import { ProfileNavigationSection } from './ProfileNavigationSection'
import { ProfileContentSection } from './ProfileContentSection'

export type ProfileTab = 'profile' | 'security'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')

  return (
    <DashboardLayout>
      <div className="bg-[#f3f3f6] w-full min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Վերևի բաժինը - այլևս ոչ absolute */}
          <ProfileNavigationSection />
          
          {/* Հիմնական բաժինը - 30% և 70% բաժանումով */}
          <div className="mt-8">
            <ProfileContentSection activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}