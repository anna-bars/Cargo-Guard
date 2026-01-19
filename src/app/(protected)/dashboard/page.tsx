'use client'

import DashboardLayout from '../DashboardLayout'
import { useEffect, useState, useRef } from 'react'
import { ConversionChart } from '../../components/charts/ConversionChart'
import { WelcomeWidget } from '@/app/components/widgets/WelcomeWidget'
import { HighValueCargoWidget } from '@/app/components/widgets/HighValueCargoWidget'
import { PerformanceOverview } from '@/app/components/widgets/PerformanceOverview'
import { UniversalTable, renderStatus, renderButton } from '@/app/components/tables/UniversalTable';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/app/context/UserContext';

// Dashboard-ի տվյալներ - կստանանք Supabase-ից
const dashboardColumns = [
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
    key: 'cargo',
    label: 'Cargo',
    sortable: true,
    renderDesktop: (_: any, row: any) => (
      <span className="font-poppins text-sm text-black">
        {row.cargo}
      </span>
    )
  },
  {
    key: 'value',
    label: 'Value',
    sortable: true,
    renderDesktop: (_: any, row: any) => (
      <span className="font-poppins text-sm text-black">
        ${row.value?.toLocaleString('en-US') || '0'}
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
  const [dashboardRows, setDashboardRows] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalInsuredAmount: 0,
    activePoliciesCount: 0,
    quotesAwaitingCount: 0,
    contractsExpiringCount: 0,
    documentsMissingCount: 0
  })
  const [activeWidget, setActiveWidget] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()
  const supabase = createClient()

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return
      
      try {
        // 1. Ստանալ quote_requests-ը այս օգտատիրոջ համար
        const { data: quotes, error: quotesError } = await supabase
          .from('quote_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (quotesError) throw quotesError

        // 2. Ստանալ policies (եթե ունեք առանձին աղյուսակ)
        const { data: policies, error: policiesError } = await supabase
          .from('policies')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (policiesError) {
          console.warn('No policies table found, using quotes as policies')
        }

        // 3. Միավորել տվյալները և ֆորմատավորել
        const combinedData = await formatDashboardData(quotes || [], policies || [])
        setDashboardRows(combinedData)

        // 4. Հաշվել վիճակագրությունը
        calculateStats(quotes || [], policies || [])

      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Fallback to static data in case of error
        setDashboardRows(getFallbackData())
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  const formatDashboardData = async (quotes: any[], policies: any[]) => {
    const formattedData: any[] = []

    // Ֆորմատավորել quotes
    quotes.forEach(quote => {
      let statusConfig = getStatusConfig(quote.status)
      
      // Determine button action based on status
      let buttonAction = { 
        text: 'View Details', 
        variant: 'secondary' as const,
        onClick: (row: any) => handleQuoteAction(row)
      }

      if (quote.status === 'pending') {
        buttonAction = { 
          text: 'Approve Quote', 
          variant: 'primary' as const,
          onClick: (row: any) => handleApproveQuote(row)
        }
      }

      formattedData.push({
        type: 'Quote',
        id: quote.quote_id || quote.id,
        cargo: quote.cargo_type || 'Unknown',
        value: quote.shipment_value || 0,
        status: statusConfig,
        date: formatDate(quote.created_at),
        button: buttonAction,
        rawData: quote // Keep original data for reference
      })
    })

    // Ֆորմատավորել policies (եթե կան)
    policies.forEach(policy => {
      let statusConfig = getStatusConfig(policy.status)
      
      // Determine button action based on policy status
      let buttonAction = { 
        text: 'View Policy', 
        variant: 'secondary' as const,
        onClick: (row: any) => handlePolicyAction(row)
      }

      if (policy.status === 'active') {
        buttonAction = { 
          text: 'Download Cert', 
          variant: 'secondary' as const,
          onClick: (row: any) => handleDownloadCertificate(row)
        }
      } else if (policy.status === 'expiring') {
        buttonAction = { 
          text: 'Renew Policy', 
          variant: 'secondary' as const,
          onClick: (row: any) => handleRenewPolicy(row)
        }
      }

      formattedData.push({
        type: 'Policy',
        id: policy.policy_number || policy.id,
        cargo: policy.cargo_type || 'Unknown',
        value: policy.insured_amount || policy.shipment_value || 0,
        status: statusConfig,
        date: formatDate(policy.created_at),
        button: buttonAction,
        rawData: policy
      })
    })

    // Սորտավորել ըստ ամսաթվի (նորագույնը առաջինը)
    return formattedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, any> = {
      'pending': { 
        text: 'Pending Approval', 
        color: 'bg-[#cbd03c]/10', 
        dot: 'bg-[#cbd03c]', 
        textColor: 'text-[#cbd03c]' 
      },
      'approved': { 
        text: 'Approved', 
        color: 'bg-[#16a34a]/10', 
        dot: 'bg-[#16a34a]', 
        textColor: 'text-[#16a34a]' 
      },
      'rejected': { 
        text: 'Declined', 
        color: 'bg-[#8ea0b0]/10', 
        dot: 'bg-[#8ea0b0]', 
        textColor: 'text-[#8ea0b0]' 
      },
      'active': { 
        text: 'Active', 
        color: 'bg-[#16a34a]/10', 
        dot: 'bg-[#16a34a]', 
        textColor: 'text-[#16a34a]' 
      },
      'expiring': { 
        text: 'Expires Soon', 
        color: 'bg-[#eab308]/10', 
        dot: 'bg-[#eab308]', 
        textColor: 'text-[#eab308]' 
      },
      'document_missing': { 
        text: 'Document Missing', 
        color: 'bg-[#f97316]/10', 
        dot: 'bg-[#f97316]', 
        textColor: 'text-[#f97316]' 
      },
      'default': { 
        text: 'Processing', 
        color: 'bg-gray-100', 
        dot: 'bg-gray-400', 
        textColor: 'text-gray-700' 
      }
    }

    return statusMap[status] || statusMap['default']
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateStats = (quotes: any[], policies: any[]) => {
    // Հաշվել ընդհանուր ապահովագրված գումարը
    const totalInsuredAmount = [...quotes, ...policies]
      .filter(item => item.status === 'approved' || item.status === 'active')
      .reduce((sum, item) => sum + (item.shipment_value || item.insured_amount || 0), 0)

    // Հաշվել ակտիվ policies
    const activePoliciesCount = policies.filter(p => p.status === 'active').length

    // Հաշվել մշակման մեջ գտնվող quotes
    const quotesAwaitingCount = quotes.filter(q => q.status === 'pending').length

    // Հաշվել շուտով ժամկետանցվելիք contracts
    const contractsExpiringCount = policies.filter(p => p.status === 'expiring').length

    // Հաշվել բացակայող փաստաթղթեր
    const documentsMissingCount = [...quotes, ...policies]
      .filter(item => item.status === 'document_missing').length

    setStats({
      totalInsuredAmount,
      activePoliciesCount,
      quotesAwaitingCount,
      contractsExpiringCount,
      documentsMissingCount
    })
  }

  const getFallbackData = () => {
    // Fallback data if Supabase fails
    return [
      {
        type: 'Quote',
        id: 'Q-005',
        cargo: 'Jewelry',
        value: 15400,
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
      // ... rest of fallback data
    ]
  }

  // Action handlers
  const handleQuoteAction = (row: any) => {
    console.log('View quote details:', row.id)
    // router.push(`/quotes/${row.id}`)
  }

  const handleApproveQuote = (row: any) => {
    console.log('Approve quote:', row.id)
    // Implement approval logic
  }

  const handlePolicyAction = (row: any) => {
    console.log('View policy:', row.id)
    // router.push(`/policies/${row.id}`)
  }

  const handleDownloadCertificate = (row: any) => {
    console.log('Download certificate for:', row.id)
    // Implement download logic
  }

  const handleRenewPolicy = (row: any) => {
    console.log('Renew policy:', row.id)
    // Implement renewal logic
  }

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
      <div className="min-w-[96%] max-w-[95.5%] !sm:min-w-[90.5%] mx-auto">
        {/* Mobile Header for Activity Section */}
        <div className="flex gap-2 items-center  mt-4 mb-2 xl:hidden">
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
            {/* Performance Overview - now with real data */}
            <PerformanceOverview 
              title="Performance Overview"
              timePeriod="This Month"
              metrics={[
                {
                  id: 'insured-amount',
                  value: Math.floor(stats.totalInsuredAmount / 1000).toString(),
                  decimal: 'k',
                  prefix: '$',
                  label: 'Total Insured Amount',
                  hasArrow: false
                },
                {
                  id: 'active-policies',
                  value: stats.activePoliciesCount.toString(),
                  decimal: '',
                  suffix: '',
                  label: 'Active Policies',
                  hasArrow: true,
                  arrowDirection: 'up'
                },
                {
                  id: 'quotes-awaiting',
                  value: stats.quotesAwaitingCount.toString(),
                  decimal: '',
                  suffix: '',
                  label: 'Quotes Awaiting Approval',
                  hasArrow: true,
                  arrowDirection: stats.quotesAwaitingCount > 0 ? 'down' : 'up'
                },
                {
                  id: 'contracts-expire',
                  value: stats.contractsExpiringCount.toString(),
                  decimal: '',
                  suffix: '',
                  label: 'Contracts Due to Expire',
                  hasArrow: true,
                  arrowDirection: stats.contractsExpiringCount > 0 ? 'down' : 'up'
                },
                {
                  id: 'documents-uploads',
                  value: stats.documentsMissingCount.toString(),
                  decimal: '',
                  suffix: '',
                  label: 'Required Document Uploads',
                  hasArrow: true,
                  arrowDirection: stats.documentsMissingCount > 0 ? 'down' : 'up'
                }
              ]}
            />

            <div className="block md:hidden">
              <ConversionChart />
            </div>

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
              mobileDesignType="dashboard"
              desktopGridCols="0.7fr 1fr 0.7fr 1fr 0.7fr 1fr"
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
            <HighValueCargoWidget 
              percentage={calculateHighValuePercentage(dashboardRows)}
              mtdValue={`${Math.floor(stats.totalInsuredAmount / 1000)}k`}
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
                <HighValueCargoWidget 
                  percentage={calculateHighValuePercentage(dashboardRows)}
                  mtdValue={`${Math.floor(stats.totalInsuredAmount / 1000)}k`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper function to calculate high-value percentage
function calculateHighValuePercentage(data: any[]) {
  if (!data.length) return 45.55 // Default fallback
  
  const highValueThreshold = 10000 // $10,000+ is considered high-value
  const highValueCount = data.filter(item => item.value >= highValueThreshold).length
  return (highValueCount / data.length) * 100
}