'use client'

import DashboardLayout from '../DashboardLayout'
import { useEffect, useState, useRef } from 'react'
import { ConversionChart } from '../../components/charts/ConversionChart'
import { WelcomeWidget } from '@/app/components/widgets/WelcomeWidget'
import { HighValueCargoWidget } from '@/app/components/widgets/HighValueCargoWidget'
import { PerformanceOverview } from '@/app/components/widgets/PerformanceOverview'
import { UniversalTable, renderStatus, renderButton } from '@/app/components/tables/UniversalTable';

// Dashboard-ի տվյալներ - ԼՐԱՑՈՒՄ
const quotesRows = [
  {
    id: 'Q-005',
    cargo: 'Electronics',
    shipmentValue: '$15,400.00',
    premiumAmount: '$450.00',
    expirationDate: 'Oct 25 – Nov 5',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  },
  {
    id: 'Q-021',
    cargo: 'Furniture',
    shipmentValue: '$20,000.00',
    premiumAmount: '$255.00',
    expirationDate: 'Oct 20 – Nov 1',
    status: { 
      text: 'Approved', 
      color: 'bg-[#16a34a]/10', 
      dot: 'bg-[#16a34a]', 
      textColor: 'text-[#16a34a]' 
    },
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  },
  {
    id: 'Q-054',
    cargo: 'Clothing',
    shipmentValue: '$5,500.00',
    premiumAmount: '$600.00',
    expirationDate: 'Oct 22 – Nov 3',
    status: { 
      text: 'Declined', 
      color: 'bg-[#8ea0b0]/10', 
      dot: 'bg-[#8ea0b0]', 
      textColor: 'text-[#8ea0b0]' 
    },
    button: { 
      text: 'View Reason', 
      variant: 'secondary' as const,
      onClick: (row: any) => console.log('View Reason', row.id)
    }
  },
  {
    id: 'Q-005-2',
    cargo: 'Machinery',
    shipmentValue: '$8,500.00',
    premiumAmount: '$165.00',
    expirationDate: 'Oct 24 – Nov 4',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  },
  {
    id: 'Q-014',
    cargo: 'Chemicals',
    shipmentValue: '$12,800.00',
    premiumAmount: '$360.00',
    expirationDate: 'Oct 21 – Nov 2',
    status: { 
      text: 'Approved', 
      color: 'bg-[#16a34a]/10', 
      dot: 'bg-[#16a34a]', 
      textColor: 'text-[#16a34a]' 
    },
    button: { 
      text: 'Approve Quote', 
      variant: 'primary' as const,
      onClick: (row: any) => console.log('Approve Quote', row.id)
    }
  }
]

const quotesColumns = [
  {
    key: 'id',
    label: 'Quote ID',
    sortable: true,
    renderDesktop: (value: string) => (
      <span className="font-poppins text-sm text-[#2563eb] underline hover:text-[#1d4ed8] transition-colors duration-300 cursor-pointer">
        {value}
      </span>
    )
  },
  {
    key: 'cargo',
    label: 'Cargo',
    sortable: true
  },
  {
    key: 'shipmentValue',
    label: 'Shipment Value',
    sortable: true
  },
  {
    key: 'premiumAmount',
    label: 'Premium Amount',
    sortable: true
  },
  {
    key: 'expirationDate',
    label: 'Expiration Date',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    renderDesktop: (status: any) => renderStatus(status)
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
            <div className="flex items-center gap-3">
                  <img
                    src="/quotes/header-ic.svg"
                    alt=""
                    className="w-6 h-6"
                  />
                  <h2 className="text-[26px]">Quotes</h2>
                </div>

            <div className="block md:hidden">
              <ConversionChart />
            </div>

            {/* Universal Table for Recent Activity */}
        <UniversalTable
  title="All Insurance Quotes"
  showMobileHeader={true}
  rows={quotesRows}
  columns={quotesColumns}
  mobileDesign={{
    showType: false, // Quotes-ում type չկա
    showCargoIcon: true,
    showDateIcon: true,
    dateLabel: 'Expires',
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
            <div className="flex justify-end items-center gap-3 !h-[39px]">
                  <button
                    className="inline-flex items-center justify-center gap-[10px] px-4 py-2 h-[35.68px] bg-[#f8fbff] border border-[#ffffff30] rounded-[6px] font-poppins text-base font-normal text-black cursor-pointer whitespace-nowrap"
                  >
                    <img
                      src="/quotes/download.svg"
                      alt=""
                      className="w-3 h-3 object-cover"
                    />
                    Download
                  </button>
                  <button className="inline-flex items-center justify-center gap-[10px] px-4 py-2 h-[35.68px] bg-[#0b0b0b] border-0 rounded-[6px] font-poppins text-base font-normal text-white cursor-pointer whitespace-nowrap">
                    + Get New Quote
                  </button>
                </div>

                {/* Improve Your Quote Rate Card */}
              <div className="stats-card bg-[#fafcff]/80 rounded-2xl p-4">
                <h3 className="font-montserrat text-lg font-medium text-black mb-6">Improve Your Quote Rate</h3>
                <div className="stats-content mb-6">
                  <div className="rate-section relative w-[145px] h-[39px]">
                    <div className="rate-label absolute top-6 left-24 font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px]">Quotes</div>
                    <div className="rate-value absolute top-0 left-0 w-20 h-[37px] flex gap-1 items-baseline">
                      <span className="percentage font-montserrat text-[56px] text-black font-normal tracking-[1.12px] leading-9 w-16">72</span>
                      <span className="percent-symbol font-montserrat text-xs text-black font-normal tracking-[0.20px] w-2">%</span>
                    </div>
                  </div>
                  <p className="stats-description font-montserrat text-xs font-normal text-[#afaeae] tracking-[0.24px] max-w-[268px]">
                    Your Quotes are often Declined due to 
                    <strong className="font-medium tracking-[0.03px]"> Inaccurate Cargo Value</strong>
                  </p>
                </div>
                <div className="stats-footer flex items-end justify-between w-full">
                  <span className="font-montserrat text-base font-normal text-[#3c3c3c] tracking-[0.32px] max-w-[206px]">
                    View Full Cargo Type Rules Before Proceeding
                  </span>
                  <img 
                    src="https://c.animaapp.com/mjous28hLTkY2o/img/group-84-1.png" 
                    alt="Arrow"
                    className="w-10 h-10"
                  />
                </div>
              </div>
           

            {/* Quote Conversion Rate */}
            <div className="flex-grow min-h-[calc(31%-4px)] xl:flex-[0_0_31%] xl:min-h-auto xl:h-auto">
              <ConversionChart />
            </div>

            {/* Quotes Expiration Card */}
  <div className="stats-card bg-[#fafcff]/80 rounded-2xl p-4">
    <div className="card-header mb-6">
      <h3 className="font-montserrat text-lg font-medium text-black mb-0">Quotes Expiration</h3>
      <div className="time-tabs flex gap-3">
        <span className="active font-montserrat text-xs font-medium text-[#6f6f6f] tracking-[0.24px] underline cursor-pointer whitespace-nowrap">This Week</span>
        <span className="font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px] cursor-pointer whitespace-nowrap">Next Week</span>
        <span className="font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px] cursor-pointer whitespace-nowrap">In 2–4 Weeks</span>
        <span className="font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px] cursor-pointer whitespace-nowrap">Next Month</span>
      </div>
    </div>
    
    <div className="expiration-stats relative w-[149px] h-[73.5px] mb-6">
      <div className="expiration-left absolute top-0 left-0.5 w-[143px] h-11 flex gap-3">
        <div className="expiration-rate w-20 h-10 flex gap-1 items-baseline">
          <span className="rate-number font-montserrat text-[56px] text-black font-normal tracking-[1.12px] leading-10 w-16">32</span>
          <span className="rate-symbol font-montserrat text-xs text-black font-normal tracking-[0.20px] w-2">%</span>
        </div>
      </div>
      <div className="expiration-right absolute top-14 left-0">
        <span className="expiration-total font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px] whitespace-nowrap">
          Total expiring quotes: 7
        </span>
      </div>
    </div>
    
   <div className="chaart">
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>
                            <div className="chart-div-active-item"></div>

                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            <div className="chart-div-item"></div>
                            
                        </div>
    
    <div className="expiration-chart flex flex-col gap-3">
      <span className="chart-label font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px]">
        Total quotes: 22
      </span>
    </div>
  </div>
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