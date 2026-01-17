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
        <div className="px-10 py-8">
          {/* Վերին բաժինը - ոչ absolute */}
          <ProfileNavigationSection />
          
          {/* Հիմնական բաժինը */}
          <div className="mt-12">
            <ProfileContentSection activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}