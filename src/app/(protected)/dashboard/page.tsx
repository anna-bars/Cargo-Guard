'use client'

import DashboardLayout from '../DashboardLayout'
import { useEffect, useState, useRef } from 'react'
import { ConversionChart } from '../../components/charts/ConversionChart'
import { RecentActivityTable } from '@/app/components/tables/ActivityTable'
import { WelcomeWidget } from '@/app/components/widgets/WelcomeWidget'
import { HighValueCargoWidget } from '@/app/components/widgets/HighValueCargoWidget'
import { PerformanceOverview } from '@/app/components/widgets/PerformanceOverview'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [activeWidget, setActiveWidget] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const widgetWidth = container.clientWidth
    const currentIndex = Math.round(scrollLeft / widgetWidth)
    
    setActiveWidget(currentIndex)
  }

  const scrollToWidget = (index: number) => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const widgetWidth = container.clientWidth
    container.scrollTo({
      left: index * widgetWidth,
      behavior: 'smooth'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#778B8E]"></div>
      </div>
    )
  }
  
  return (
    <DashboardLayout>
      <div className="w-full max-w-[99%] sm:max-w-[99%] mx-auto">
        {/* Mobile Header for Activity Section */}
        <div className="flex gap-2 items-center mb-4 xl:hidden">
          <img
            src="/dashboard/hashtag.svg"
            alt=""
            className="w-[26px] h-[26px] sm:w-5 sm:h-5"
          />
          <h2 className="font-normal text-[26px] sm:text-lg">
            Dashboard
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="
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

          {/* Right Column - 25% - Desktop View */}
          <div className="
            max-h-[89%] min-h-[88%] flex flex-col gap-2 xl:min-h-[100vh] xl:max-h-[89vh]
            max-[1336px]:flex max-[1336px]:flex-col max-[1336px]:gap-2
            max-[1280px]:min-h-auto max-[1280px]:max-h-none max-[1280px]:row-start-1
            max-[1280px]:hidden
          ">
            {/* Welcome Widget */}
            <WelcomeWidget userName="Lucas" />

            {/* Quote Conversion Rate */}
            <div className="flex-grow min-h-[calc(31%-4px)] xl:flex-[0_0_31%] xl:min-h-auto xl:h-auto">
              <ConversionChart />
            </div>

            {/* High-Value Cargo Share Widget */}
            <HighValueCargoWidget percentage={75.55} mtdValue="62,3k" />
          </div>

          {/* Mobile/Tablet View - Horizontal Scroll with Snap */}
          <div className="
            hidden max-[1280px]:block max-[1280px]:row-start-1
            max-[1280px]:w-full max-[1280px]:mb-2
          ">

            {/* Horizontal Scroll Container */}
            <div 
              ref={scrollContainerRef}
              className="
                flex overflow-x-auto snap-x snap-mandatory
                w-full h-[240px]
                [&::-webkit-scrollbar]:hidden
                [-ms-overflow-style:none]
                [scrollbar-width:none]
                gap-2
              "
              onScroll={handleScroll}
            >
              {/* Welcome Widget */}
              <div className="
                flex-shrink-0 w-[72%] h-full
                snap-center
              ">
                <WelcomeWidget userName="Lucas" />
              </div>

              {/* Conversion Chart */}
              <div className="
                flex-shrink-0 w-[90%] h-full
                snap-center
              ">
                <div className="h-full w-full">
                  <ConversionChart />
                </div>
              </div>

              {/* High Value Cargo */}
              <div className="
                flex-shrink-0 w-[90%] h-full
                snap-center
              ">
                <HighValueCargoWidget percentage={75.55} mtdValue="62,3k" />
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-4 flex justify-start gap-2 mb-0">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => scrollToWidget(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeWidget === index 
                      ? 'bg-[#778B8E] w-8' 
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to widget ${index + 1}`}
                />
              ))}
            </div>


          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}