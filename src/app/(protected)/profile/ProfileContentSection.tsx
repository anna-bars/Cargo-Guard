'use client'

import { ProfileTab } from './page'
import { ProfileBillingContent } from './ProfileBillingContent'
import { SecurityContent } from './SecurityContent'

interface ProfileContentSectionProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
}

export const ProfileContentSection = ({ activeTab, onTabChange }: ProfileContentSectionProps) => {
  return (
    <div className="flex gap-8">
      {/* Ձախ կողմ - 30% (նավիգացիա) */}
      <div className="w-[30%] min-w-[300px]">
        <div className="rounded-2xl sticky top-8">
          
          <div className="space-y-2">
            <button
              onClick={() => onTabChange('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors [font-family:'Montserrat-Regular',Helvetica] text-sm ${
                activeTab === 'profile'
                  ? 'bg-[#0a3d62] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              My Profile & Billing
            </button>
            
            <button
              onClick={() => onTabChange('security')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors [font-family:'Montserrat-Regular',Helvetica] text-sm ${
                activeTab === 'security'
                  ? 'bg-[#0a3d62] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Security
            </button>
          </div>
        </div>
      </div>

      {/* Աջ կողմ - 70% (պարունակություն) */}
      <div className="w-[70%]">
        {activeTab === 'profile' ? <ProfileBillingContent /> : <SecurityContent />}
      </div>
    </div>
  )
}