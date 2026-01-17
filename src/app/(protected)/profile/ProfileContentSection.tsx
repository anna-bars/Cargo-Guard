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
      <div className="w-[16%] min-w-[300px]">
  <div className="rounded-2xl sticky top-8">
    <div className="space-y-2">
      <button
        onClick={() => onTabChange('profile')}
        className={`flex justify-between items-center self-stretch w-full h-[43px] px-9 py-2.5 rounded-xl border border-solid border-[#FAFBFD] transition-colors [font-family:'Montserrat-Regular',Helvetica] text-sm ${
          activeTab === 'profile'
            ? 'bg-white'
            : 'bg-[#f8fafd]'
        }`}
      >
        <span className="font-normal text-[16px] text-black">
          My Profile & Billing
        </span>
      </button>
      
      <button
        onClick={() => onTabChange('security')}
        className={`flex justify-between items-center self-stretch w-full h-[43px] px-9 py-2.5 rounded-xl border border-solid border-[#FAFBFD] transition-colors [font-family:'Montserrat-Regular',Helvetica] text-sm ${
          activeTab === 'security'
            ? 'bg-white'
            : 'bg-[#f8fafd]'
        }`}
      >
        <span className="font-normal text-[16px] text-black">
          Security
        </span>
      </button>
    </div>
  </div>
</div>

      {/* Աջ կողմ - 70% (պարունակություն) */}
      <div className="w-[84%]">
        {activeTab === 'profile' ? <ProfileBillingContent /> : <SecurityContent />}
      </div>
    </div>
  )
}