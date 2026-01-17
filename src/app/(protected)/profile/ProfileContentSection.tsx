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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Ձախ կողմ - 30% (նավիգացիա) */}
      <div className="w-full lg:w-1/4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>
          
          <div className="space-y-2">
            <button
              onClick={() => onTabChange('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-[#0a3d62] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              My Profile & Billing
            </button>
            
            <button
              onClick={() => onTabChange('security')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
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
      <div className="w-full lg:w-3/4">
        {activeTab === 'profile' ? <ProfileBillingContent /> : <SecurityContent />}
      </div>
    </div>
  )
}