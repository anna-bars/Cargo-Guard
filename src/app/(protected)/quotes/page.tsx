'use client'

import DashboardLayout from '../DashboardLayout'
import { useEffect, useState, useRef } from 'react'
import { ConversionChart } from '../../components/charts/ConversionChart'
import { UniversalTable, renderStatus, renderButton } from '@/app/components/tables/UniversalTable';
import QuotesExpirationCard from '@/app/components/charts/QuotesExpirationCard'
import InfoWidget from '@/app/components/widgets/InfoWidget'

// Dashboard-ի տվյալներ - ԼՐԱՑՈՒՄ
const quotesRows = [
  {
    id: 'Q-005',
    cargo: 'Electronics',
    shipmentValue: '$15,400.00',
    premiumAmount: '$450.00',
    expirationDate: `Oct 25, '25 – Nov 5, '25`,
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
    expirationDate: `Oct 20, '25 – Nov 1, '25`,
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
    expirationDate: `Oct 22, '25 – Nov 3, '25`,
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
    expirationDate: `Oct 24, '25 – Nov 4, '25`,
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
    expirationDate: `Oct 21, '25 – Nov 2, '25`,
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
    label: 'Value',
    sortable: true
  },
  {
    key: 'premiumAmount',
    label: 'Premium',
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
  const [activeTab, setActiveTab] = useState('This Week')
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

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
            <div className="block md:hidden">
              <QuotesExpirationCard 
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Universal Table for Recent Activity */}
            <div className='max-h-[85%'>
            <UniversalTable
              title="Quotes Overview"
              showMobileHeader={true}
              rows={quotesRows}
              columns={quotesColumns}
              mobileDesign={{
                showType: false,
                showCargoIcon: true,
                showDateIcon: true,
                dateLabel: 'Expires',
                buttonWidth: '47%'
              }}
              mobileDesignType="quotes" // ավելացնել
              desktopGridCols="0.5fr 0.8fr  0.8fr 0.7fr 1.1fr 0.9fr 1fr" // ավելացնել
            />
            </div>
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
              <InfoWidget 
                title="Improve Your Quote Rate"
                rateValue={72}
                description={
                  <>
                    Your Quotes are often Declined due to 
                    <strong className="font-medium tracking-[0.03px]"> Inaccurate Cargo Value</strong>
                  </>
                }
              />
           

            {/* Quote Conversion Rate */}
            <div className="flex-grow min-h-[calc(31%-4px)] xl:flex-[0_0_31%] xl:min-h-auto xl:h-auto">
              <ConversionChart />
            </div>

            {/* Quotes Expiration Card */}
            <QuotesExpirationCard 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />


          </div>

          {/* Tablet View (768px - 1279px) - Three Widgets Side by Side */}
          <div className="
            hidden max-[1280px]:block min-[769px]:block
            max-[768px]:hidden
            max-[1280px]:row-start-1 max-[1280px]:w-full
            max-[1280px]:mb-2
          ">
            <div className="grid grid-cols-3 gap-2 w-full">
            
             {/* Improve Your Quote Rate Card */}
              <InfoWidget 
                title="Improve Your Quote Rate"
                rateValue={72}
                description={
                  <>
                    Your Quotes are often Declined due to 
                    <strong className="font-medium tracking-[0.03px]"> Inaccurate Cargo Value</strong>
                  </>
                }
              />
           

            {/* Quote Conversion Rate */}
            <div className="flex-grow min-h-[calc(31%-4px)] xl:flex-[0_0_31%] xl:min-h-auto xl:h-auto">
              <ConversionChart />
            </div>

            {/* Quotes Expiration Card */}
            <div className="w-full h-[100%]">
              <QuotesExpirationCard 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            </div>
            
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}