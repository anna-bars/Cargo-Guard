'use client'

import DashboardLayout from '../DashboardLayout'
import { useEffect, useState, useRef } from 'react'
import { ConversionChart } from '../../components/charts/ConversionChart'
import { WelcomeWidget } from '@/app/components/widgets/WelcomeWidget'
import { HighValueCargoWidget } from '@/app/components/widgets/HighValueCargoWidget'
import { PerformanceOverview } from '@/app/components/widgets/PerformanceOverview'
import { UniversalTable, renderStatus, renderButton } from '@/app/components/tables/UniversalTable';

// Dashboard-ի տվյալներ - ԼՐԱՑՈՒՄ
const dashboardRows = [
  {
    type: 'Quote',
    id: 'Q-005',
    cargo: 'Jewelry',
    value: '$15,400.00',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    date: 'Oct 25, 9:10PM',
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve', row.id)
    }
  },
  {
    type: 'Policy',
    id: 'P-021',
    cargo: 'Textiles',
    value: '$3,700.00',
    status: { 
      text: 'Document Missing', 
      color: 'bg-[#f97316]/10', 
      dot: 'bg-[#f97316]', 
      textColor: 'text-[#f97316]' 
    },
    date: 'Oct 20, 6:30PM',
    button: { 
      text: 'Upload Docs', 
      variant: 'secondary' as const,
      onClick: (row: any) => console.log('Upload Docs', row.id)
    }
  },
  {
    type: 'Policy',
    id: 'P-020',
    cargo: 'Heavy Machinery',
    value: '$48,400.00',
    status: { 
      text: 'Expires 15 Nov 2025', 
      color: 'bg-[#eab308]/10', 
      dot: 'bg-[#eab308]', 
      textColor: 'text-[#eab308]' 
    },
    date: 'Oct 15, 4:20AM',
    button: { 
      text: 'Renew Policy', 
      variant: 'secondary' as const,
      onClick: (row: any) => console.log('Renew Policy', row.id)
    }
  },
  {
    type: 'Policy',
    id: 'P-019',
    cargo: 'Electronics',
    value: '$8,000.00',
    status: { 
      text: 'Active', 
      color: 'bg-[#16a34a]/10', 
      dot: 'bg-[#16a34a]', 
      textColor: 'text-[#16a34a]' 
    },
    date: 'Oct 21, 2:30PM',
    button: { 
      text: 'Download Cert', 
      variant: 'secondary' as const,
      onClick: (row: any) => console.log('Download Cert', row.id)
    }
  },
  {
    type: 'Quote',
    id: 'Q-007',
    cargo: 'Food Products',
    value: '$1,100.00',
    status: { 
      text: 'Declined', 
      color: 'bg-[#8ea0b0]/10', 
      dot: 'bg-[#8ea0b0]', 
      textColor: 'text-[#8ea0b0]' 
    },
    date: 'Sept 28, 9:30PM',
    button: { 
      text: 'View Details', 
      variant: 'secondary' as const,
      onClick: (row: any) => console.log('View Details', row.id)
    }
  },
  {
    type: 'Quote',
    id: 'Q-008',
    cargo: 'Pharmaceuticals',
    value: '$6,250.00',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    date: 'Sept 30, 11:45AM',
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  },
  {
    type: 'Policy',
    id: 'P-022',
    cargo: 'Auto Parts',
    value: '$12,900.00',
    status: { 
      text: 'Active', 
      color: 'bg-[#16a34a]/10', 
      dot: 'bg-[#16a34a]', 
      textColor: 'text-[#16a34a]' 
    },
    date: 'Oct 02, 3:15PM',
    button: { 
      text: 'Download Cert', 
      variant: 'secondary' as const,
      onClick: (row: any) => console.log('Download Cert', row.id)
    }
  },
  {
    type: 'Quote',
    id: 'Q-009',
    cargo: 'Luxury Watches',
    value: '$22,000.00',
    status: { 
      text: 'Declined', 
      color: 'bg-[#8ea0b0]/10', 
      dot: 'bg-[#8ea0b0]', 
      textColor: 'text-[#8ea0b0]' 
    },
    date: 'Oct 05, 7:50PM',
    button: { 
      text: 'View Details', 
      variant: 'secondary' as const,
      onClick: (row: any) => console.log('View Details', row.id)
    }
  },
  {
    type: 'Policy',
    id: 'P-023',
    cargo: 'Construction Materials',
    value: '$31,500.00',
    status: { 
      text: 'Expires 01 Dec 2025', 
      color: 'bg-[#eab308]/10', 
      dot: 'bg-[#eab308]', 
      textColor: 'text-[#eab308]' 
    },
    date: 'Oct 08, 10:10AM',
    button: { 
      text: 'Renew Policy', 
      variant: 'secondary' as const,
      onClick: (row: any) => console.log('Renew Policy', row.id)
    }
  },
  {
    type: 'Quote',
    id: 'Q-010',
    cargo: 'Medical Equipment',
    value: '$18,750.00',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    date: 'Oct 10, 1:40PM',
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  }
];

const dashboardColumns = [
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    className: 'hidden lg:flex items-center',
    hideOnDesktop: false,
    renderDesktop: (value: string) => (
      <div className="font-poppins text-sm text-black truncate row-cell">
        {value}
      </div>
    )
  },
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    renderDesktop: (value: string) => (
      <span className="font-poppins text-sm text-[#2563eb] underline hover:text-[#1d4ed8] transition-colors duration-300 cursor-pointer">
        {value}
      </span>
    )
  },
  {
    key: 'cargoValue',
    label: 'Cargo / Value',
    sortable: true,
    renderDesktop: (_: any, row: any) => (
      <span className="font-poppins text-sm text-black">
        {row.cargo} / {row.value}
      </span>
    )
  },
  {
    key: 'status',
    label: 'Status / Due Date',
    sortable: true,
    renderDesktop: (status: any) => renderStatus(status)
  },
  {
    key: 'date',
    label: 'Last Update',
    sortable: true
  },
  {
    key: 'button',
    label: 'Action',
    renderDesktop: (button: any, row: any) => renderButton(button, row),
    className: 'flex justify-end'
  }
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [activeWidget, setActiveWidget] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Check screen size for mobile
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleScroll = () => {
    if (!scrollContainerRef.current || !isMobile) return
    
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const widgetWidth = container.clientWidth
    const currentIndex = Math.round(scrollLeft / widgetWidth)
    
    setActiveWidget(currentIndex)
  }

  const scrollToWidget = (index: number) => {
    if (!scrollContainerRef.current || !isMobile) return
    
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
        <div className="flex gap-2 items-center mb-2 xl:hidden">
          <img
            src="/dashboard/hashtag.svg"
            alt=""
            className="w-[22px] h-[22px] sm:w-5 sm:h-5"
          />
          <h2 className="font-normal text-[18px] sm:text-lg">
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

            <div className="block md:hidden">
              <ConversionChart />
            </div>

            {/* Universal Table for Recent Activity */}
            <UniversalTable
  title="Recent Activity"
  showMobileHeader={false}
  rows={dashboardRows}
  columns={dashboardColumns}
  mobileDesign={{
    showType: true,
    showCargoIcon: true,
    showDateIcon: true,
    dateLabel: 'Last Update',
    buttonWidth: '47%'
  }}
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

          {/* Tablet View (768px - 1279px) - Three Widgets Side by Side */}
          <div className="
            hidden max-[1280px]:block min-[769px]:block
            max-[768px]:hidden
            max-[1280px]:row-start-1 max-[1280px]:w-full
            max-[1280px]:mb-2
          ">
            <div className="grid grid-cols-3 gap-2 w-full">
              {/* Welcome Widget */}
              <div className="w-full h-[240px]">
                <WelcomeWidget userName="Lucas" />
              </div>

              {/* Conversion Chart */}
              <div className="w-full h-[240px]">
                <div className="h-full w-full">
                  <ConversionChart />
                </div> 
              </div>

              {/* High Value Cargo */}
              <div className="w-full h-[240px]">
                <HighValueCargoWidget percentage={75.55} mtdValue="62,3k" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}