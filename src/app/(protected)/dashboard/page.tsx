'use client'

import DashboardLayout from '../DashboardLayout'
import { useEffect, useState } from 'react'
import { ConversionChart } from '../../components/charts/ConversionChart'
import { RecentActivityTable } from '@/app/components/tables/ActivityTable'
import { WelcomeWidget } from '@/app/components/widgets/WelcomeWidget'
import { HighValueCargoWidget } from '@/app/components/widgets/HighValueCargoWidget'
import { PerformanceOverview } from '@/app/components/widgets/PerformanceOverview'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3d62]"></div>
      </div>
    )
  }
  
  return (
    <DashboardLayout>
      <div className="w-full max-w-[99%] sm:max-w-[99%] mx-auto">
        {/* Mobile Header for Activity Section */}
        <div className="flex gap-2 items-center mb-4 xl:hidden">
          <img src="/dashboard/hashtag.svg" alt="" className="w-5 h-5" />
          <h2 className="font-normal text-lg">Dashboard</h2>
        </div>

        {/* Main Content Grid */}
        <main className="
          grid grid-cols-1 xl:grid-cols-[76.5%_23%] gap-2 
          h-[calc(100vh-140px)] xl:min-h-[100vh] xl:max-h-[100vh]
          max-[1336px]:grid-cols-[76.5%_23%]
          max-[1280px]:h-auto max-[1280px]:min-h-auto max-[1280px]:max-h-none
          max-[1280px]:grid-cols-1 max-[1280px]:grid-rows-[auto_auto]
          max-[1024px]:flex max-[1024px]:flex-col-reverse
        ">
          {/* Left Column - 75% */}
          <div className="
            max-h-[89%] min-h-[88%] flex flex-col gap-2 xl:min-h-[100vh] xl:max-h-[89vh]
            max-[1280px]:min-h-auto max-[1280px]:max-h-none max-[1280px]:row-start-2
            max-[1024px]:min-h-auto max-[1024px]:max-h-none
          ">
            {/* Performance Overview */}
            <PerformanceOverview 
              title="Performance Overview"
              timePeriod="This Month"
              metrics={[
                {
                  id: 'insured-amount',
                  value: '84',
                  decimal: '5k',
                  prefix: '$',
                  label: 'Total Insured Amount',
                  hasArrow: false
                },
                {
                  id: 'active-policies',
                  value: '8',
                  decimal: '47',
                  suffix: '%',
                  label: 'Active Policies',
                  hasArrow: true,
                  arrowDirection: 'up'
                },
                {
                  id: 'quotes-awaiting',
                  value: '3',
                  decimal: '',
                  suffix: '%',
                  label: 'Quotes Awaiting Approval',
                  hasArrow: true,
                  arrowDirection: 'down'
                },
                {
                  id: 'contracts-expire',
                  value: '2',
                  decimal: '',
                  suffix: '%',
                  label: 'Contracts Due to Expire',
                  hasArrow: true,
                  arrowDirection: 'down'
                },
                {
                  id: 'documents-uploads',
                  value: '1',
                  decimal: '',
                  suffix: '%',
                  label: 'Required Document Uploads',
                  hasArrow: true,
                  arrowDirection: 'down'
                }
              ]}
            />
 
              
              
            <RecentActivityTable 
              title="Recent Activity"
              showMobileHeader={false}
            />
          </div>

          {/* Right Column - 25% */}
          <div className="
            max-h-[89%] min-h-[88%] flex flex-col gap-2 xl:min-h-[100vh] xl:max-h-[89vh]
            max-[1336px]:flex max-[1336px]:flex-col max-[1336px]:gap-2
            max-[1280px]:min-h-auto max-[1280px]:max-h-none max-[1280px]:row-start-1
            max-[1280px]:flex max-[1280px]:flex-row max-[1280px]:gap-2 max-[1280px]:mb-2
            max-[1024px]:min-h-auto max-[1024px]:max-h-none
            max-[1024px]:flex-row max-[1024px]:gap-2
            max-[768px]:flex-row max-[768px]:overflow-x-auto max-[768px]:overflow-y-hidden
            max-[768px]:pb-4 max-[768px]:gap-3
          ">
            {/* Welcome Widget */}
            <WelcomeWidget userName="Lucas" />

            {/* Quote Conversion Rate */}
            <div className="
              flex-grow min-h-[calc(31%-4px)] xl:flex-[0_0_31%] xl:min-h-auto xl:h-auto
              max-[1336px]:flex-grow max-[1336px]:min-h-auto max-[1336px]:h-auto
              max-[1280px]:flex-grow max-[1280px]:min-h-auto max-[1280px]:h-auto max-[1280px]:block
              max-[1024px]:w-full max-[1024px]:min-h-[180px] max-[1024px]:max-h-[200px]
              max-[1024px]:block
              max-[768px]:flex-shrink-0 max-[768px]:w-[85%] max-[768px]:min-h-[250px] 
              max-[768px]:max-h-[280px]
            ">
              <ConversionChart />
            </div>

            {/* High-Value Cargo Share Widget */}
            <HighValueCargoWidget percentage={75.55} mtdValue="62,3k" />

          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}