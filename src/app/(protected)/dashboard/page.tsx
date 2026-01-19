'use client'

import DashboardLayout from '../DashboardLayout'
import { useEffect, useState, useRef } from 'react'
import { ConversionChart, ConversionChartData } from '../../components/charts/ConversionChart'
import { WelcomeWidget } from '@/app/components/widgets/WelcomeWidget'
import { HighValueCargoWidget } from '@/app/components/widgets/HighValueCargoWidget'
import { PerformanceOverview } from '@/app/components/widgets/PerformanceOverview'
import { UniversalTable, renderStatus, renderButton } from '@/app/components/tables/UniversalTable';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';

// Dashboard-ի columns
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
    label: 'Status',
    sortable: true,
    renderDesktop: (status: any) => renderStatus(status)
  },
  {
    key: 'date',
    label: 'Created',
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
    draftQuotesCount: 0,
    submittedQuotesCount: 0,
    underReviewCount: 0,
    approvedQuotesCount: 0
  })
  const [activeWidget, setActiveWidget] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClient()

// DashboardPage.tsx-ում ավելացրեք այս ֆունկցիան
const calculateConversionData = (quotes: any[], period: string = 'This Month'): ConversionChartData => {
  if (!quotes.length) {
    // Fallback data
    return { approved: 17, declined: 9, expired: 18 };
  }

  const now = new Date();
  let startDate: Date;

  // Որոշել ժամանակահատվածը
  switch (period) {
    case 'This Week':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case 'Last Month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    case 'Last Quarter':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      break;
    case 'This Month':
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  // Ֆիլտրել quotes ըստ ժամանակահատվածի
  const filteredQuotes = quotes.filter(quote => {
    const quoteDate = new Date(quote.created_at);
    return quoteDate >= startDate && quoteDate <= now;
  });

  // Հաշվել վիճակագրությունները
  const approvedCount = filteredQuotes.filter(q => 
    q.status === 'approved' && q.payment_status === 'paid'
  ).length;

  const declinedCount = filteredQuotes.filter(q => 
    q.status === 'rejected' || q.status === 'fix_and_resubmit'
  ).length;

  const expiredCount = filteredQuotes.filter(q => 
    q.status === 'expired' || 
    (q.status === 'approved' && q.payment_status !== 'paid' && 
     new Date(q.created_at) < new Date(new Date().setDate(new Date().getDate() - 30)))
  ).length;

  return {
    approved: approvedCount,
    declined: declinedCount,
    expired: expiredCount
  };
};
// DashboardPage.tsx-ում useState-ներին ավելացրեք
// DashboardPage.tsx-ում useState-ներին ավելացրեք
const [conversionData, setConversionData] = useState<Record<string, ConversionChartData>>({
  'This Week': { approved: 0, declined: 0, expired: 0 },
  'This Month': { approved: 0, declined: 0, expired: 0 },
  'Last Month': { approved: 0, declined: 0, expired: 0 },
  'Last Quarter': { approved: 0, declined: 0, expired: 0 }
});

const [activeConversionPeriod, setActiveConversionPeriod] = useState<string>('This Month');
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
      .limit(50) // Ավելի շատ տվյալներ conversion-ի համար

    if (quotesError) throw quotesError

    // 2. Ֆորմատավորել տվյալները
    const formattedData = formatDashboardData(quotes || [])
    setDashboardRows(formattedData)

    // 3. Հաշվել վիճակագրությունը
    calculateStats(quotes || [])

    // 4. Հաշվել conversion data բոլոր ժամանակահատվածների համար
    const periods = ['This Week', 'This Month', 'Last Month', 'Last Quarter'];
    const newConversionData: Record<string, ConversionChartData> = {};
    
    periods.forEach(period => {
      newConversionData[period] = calculateConversionData(quotes || [], period);
    });
    
    setConversionData(newConversionData);

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    setDashboardRows(getFallbackData())
  } finally {
    setLoading(false)
  }
}
}, [user])
// DashboardPage.tsx-ում `getStatusConfig` ֆունկցիայում

const getStatusConfig = (quote: any) => {
  // Status map-ը մնում է նույնը, բայց փոխենք rejected-ի և fix_and_resubmit-ի button-ը
  const statusMap: Record<string, any> = {
    'draft': { 
      text: 'Continue Quote', 
      color: 'bg-gray-100', 
      dot: 'bg-gray-500', 
      textColor: 'text-gray-700',
      buttonText: 'Continue Quote',
      buttonVariant: 'primary' as const
    },
    'submitted': { 
      text: 'Waiting for review', 
      color: 'bg-blue-50', 
      dot: 'bg-blue-500', 
      textColor: 'text-blue-700',
      buttonText: 'View Details',
      buttonVariant: 'secondary' as const
    },
    'under_review': { 
      text: 'Documents under review', 
      color: 'bg-amber-50', 
      dot: 'bg-amber-500', 
      textColor: 'text-amber-700',
      buttonText: 'View Details',
      buttonVariant: 'secondary' as const
    },
    'approved': { 
      text: quote.payment_status === 'paid' ? 'Approved & Paid' : 'Pay to Activate', 
      color: quote.payment_status === 'paid' ? 'bg-emerald-50' : 'bg-amber-50', 
      dot: quote.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500', 
      textColor: quote.payment_status === 'paid' ? 'text-emerald-700' : 'text-amber-700',
      buttonText: quote.payment_status === 'paid' ? 'View Policy' : 'Pay Now',
      buttonVariant: quote.payment_status === 'paid' ? 'success' as const : 'primary' as const
    },
    'rejected': { 
      text: 'Rejected', 
      color: 'bg-rose-50', 
      dot: 'bg-rose-500', 
      textColor: 'text-rose-700',
      buttonText: 'View Details', // Փոխարինել Resubmit → View Details
      buttonVariant: 'secondary' as const // Փոխարինել primary → secondary
    },
    'pay_to_activate': { 
      text: 'Pay to Activate', 
      color: 'bg-amber-50', 
      dot: 'bg-amber-500', 
      textColor: 'text-amber-700',
      buttonText: 'Pay Now',
      buttonVariant: 'primary' as const
    },
    'waiting_for_review': { 
      text: 'Waiting for Review', 
      color: 'bg-cyan-50', 
      dot: 'bg-cyan-500', 
      textColor: 'text-cyan-700',
      buttonText: 'View Details',
      buttonVariant: 'secondary' as const
    },
    'documents_under_review': { 
      text: 'Documents Under Review', 
      color: 'bg-indigo-50', 
      dot: 'bg-indigo-500', 
      textColor: 'text-indigo-700',
      buttonText: 'View Details',
      buttonVariant: 'secondary' as const
    },
    'fix_and_resubmit': { 
      text: 'Fix & Resubmit', 
      color: 'bg-amber-50', 
      dot: 'bg-amber-500', 
      textColor: 'text-amber-700',
      buttonText: 'View Details', // Փոխարինել Resubmit → View Details
      buttonVariant: 'secondary' as const // Փոխարինել primary → secondary
    }
  };

  // Ստուգել եթե quote-ը paid է
  if (quote.payment_status === 'paid' && quote.status === 'approved') {
    return {
      text: 'Approved & Paid',
      color: 'bg-emerald-50',
      dot: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      buttonText: 'View Policy',
      buttonVariant: 'success' as const
    };
  }

  return statusMap[quote.status] || statusMap['draft'];
};
  const formatQuoteId = (id: string) => {
    if (id.startsWith('Q-')) {
      return id;
    }
    if (id.startsWith('temp-')) {
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
      return `Q-${randomNum}`;
    }
    return `Q-${id.slice(-5)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

 const formatDashboardData = (quotes: any[]) => {
  const formattedData: any[] = []

  // Ֆորմատավորել quotes
  quotes.forEach(quote => {
    const statusConfig = getStatusConfig(quote)
    
    const buttonAction = { 
      text: statusConfig.buttonText, 
      variant: statusConfig.buttonVariant,
      onClick: (row: any) => handleQuoteAction(row, quote)
    }
    
    formattedData.push({
      type: 'Quote',
      id: formatQuoteId(quote.quote_id || quote.id),
      cargo: quote.cargo_type || 'Unknown',
      value: quote.shipment_value || 0,
      status: {
        text: statusConfig.text,
        color: statusConfig.color,
        dot: statusConfig.dot,
        textColor: statusConfig.textColor
      },
      date: formatDate(quote.created_at),
      button: buttonAction,
      rawData: quote,
      quoteStatus: quote.status,
      paymentStatus: quote.payment_status
    })
  })

  // Սորտավորել ըստ ամսաթվի (նորագույնը առաջինը)
  return formattedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
};

  const calculateStats = (quotes: any[]) => {
    const draftQuotesCount = quotes.filter(q => q.status === 'draft').length
    const submittedQuotesCount = quotes.filter(q => q.status === 'submitted').length
    const underReviewCount = quotes.filter(q => q.status === 'under_review').length
    const approvedQuotesCount = quotes.filter(q => q.status === 'approved').length
    
    const totalInsuredAmount = quotes
      .filter(item => item.status === 'approved')
      .reduce((sum, item) => sum + (item.shipment_value || 0), 0)

    setStats({
      totalInsuredAmount,
      draftQuotesCount,
      submittedQuotesCount,
      underReviewCount,
      approvedQuotesCount
    })
  };


  const getFallbackData = () => {
    return [
      {
        type: 'Quote',
        id: 'Q-02154',
        cargo: 'Electronics',
        value: 45000,
        status: { 
          text: 'Waiting for review', 
          color: 'bg-blue-50', 
          dot: 'bg-blue-500', 
          textColor: 'text-blue-700' 
        },
        date: 'Jan 19, 2:30 PM',
        button: { 
          text: 'View Details', 
          variant: 'secondary' as const,
          onClick: (row: any) => handleQuoteAction(row, 'submitted')
        },
        quoteStatus: 'submitted'
      },
      {
        type: 'Quote',
        id: 'Q-02153',
        cargo: 'Pharmaceuticals',
        value: 15000,
        status: { 
          text: 'Continue Quote', 
          color: 'bg-gray-100', 
          dot: 'bg-gray-500', 
          textColor: 'text-gray-700' 
        },
        date: 'Jan 18, 11:45 AM',
        button: { 
          text: 'Continue Quote', 
          variant: 'primary' as const,
          onClick: (row: any) => handleQuoteAction(row, 'draft')
        },
        quoteStatus: 'draft'
      }
    ]
  };

const handleQuoteAction = (row: any, quote: any) => {
  const quoteId = row.rawData?.id || row.id;
  const status = quote.status;
  const paymentStatus = quote.payment_status;
  
  // Սկզբում ստուգել policy-ն
  const checkPolicyAndRedirect = async () => {
    try {
      // Ստուգել արդյոք policy կա
      const { data: policy } = await supabase
        .from('policies')
        .select('*')
        .eq('quote_request_id', quoteId)
        .maybeSingle();
      
      if (policy?.status === 'active') {
        // Գնալ policy էջ
        router.push(`/shipments/${policy.id}`)
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking policy:', error)
      return false;
    }
  }
  
  switch (status) {
    case 'draft':
      router.push(`/quotes/new?quote_id=${quoteId}&continue=true`)
      break
    case 'submitted':
    case 'under_review':
    case 'waiting_for_review':
    case 'documents_under_review':
      router.push(`/quotes/${quoteId}`)
      break
    case 'approved':
      if (paymentStatus === 'paid') {
        // Փորձել գտնել policy և գնալ այնտեղ
        checkPolicyAndRedirect().then((hasPolicy) => {
          if (!hasPolicy) {
            // Եթե policy չկա, գնալ quote details
            router.push(`/quotes/${quoteId}`)
          }
        })
      } else {
        // Approved բայց չվճարված
        router.push(`/quotes/${quoteId}`)
      }
      break
    case 'rejected':
    case 'fix_and_resubmit':
      router.push(`/quotes/${quoteId}`)
      break
    case 'pay_to_activate':
      router.push(`/quotes/${quoteId}`)
      break
    default:
      router.push(`/quotes/${quoteId}`)
  }
}

  useEffect(() => {
    // Check screen size for mobile
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current || !isMobile) return
    
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const widgetWidth = container.clientWidth
    const currentIndex = Math.round(scrollLeft / widgetWidth)
    
    setActiveWidget(currentIndex)
  };

  const scrollToWidget = (index: number) => {
    if (!scrollContainerRef.current || !isMobile) return
    
    const container = scrollContainerRef.current
    const widgetWidth = container.clientWidth
    container.scrollTo({
      left: index * widgetWidth,
      behavior: 'smooth'
    })
  };

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
        <div className="flex gap-2 items-center mt-4 mb-2 xl:hidden">
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
            {/* Performance Overview with new stats */}
            <PerformanceOverview 
              title="Performance Overview"
              timePeriod="This Month"
              metrics={[
                {
                  id: 'insured-amount',
                  value: Math.floor(stats.totalInsuredAmount / 1000).toString(),
                  decimal: 'k',
                  prefix: '$',
                  label: 'Approved Value',
                  hasArrow: false
                },
                {
                  id: 'draft-quotes',
                  value: stats.draftQuotesCount.toString(),
                  decimal: '',
                  suffix: '',
                  label: 'Draft Quotes',
                  hasArrow: true,
                  arrowDirection: stats.draftQuotesCount > 0 ? 'up' : 'down'
                },
                {
                  id: 'submitted-quotes',
                  value: stats.submittedQuotesCount.toString(),
                  decimal: '',
                  suffix: '',
                  label: 'Submitted',
                  hasArrow: true,
                  arrowDirection: stats.submittedQuotesCount > 0 ? 'up' : 'down'
                },
                {
                  id: 'under-review',
                  value: stats.underReviewCount.toString(),
                  decimal: '',
                  suffix: '',
                  label: 'Under Review',
                  hasArrow: true,
                  arrowDirection: stats.underReviewCount > 0 ? 'up' : 'down'
                },
                {
                  id: 'approved-quotes',
                  value: stats.approvedQuotesCount.toString(),
                  decimal: '',
                  suffix: '',
                  label: 'Ready to Pay',
                  hasArrow: true,
                  arrowDirection: stats.approvedQuotesCount > 0 ? 'up' : 'down'
                }
              ]}
            />

            <div className="block md:hidden">
<ConversionChart 
  title="Quote Conversion Rate"
  data={conversionData}
  defaultActiveTime={activeConversionPeriod}
  showTimeDropdown={true}
  typeLabels={{
    approved: 'approved',
    declined: 'declined',
    expired: 'expired'
  }}
  colors={{
    approved: { start: '#BED5F8', end: '#669CEE' },
    declined: { start: '#F8E2BE', end: '#EEDE66' },
    expired: { start: '#FFA4A4', end: '#EB6025' }
  }}
  onTimeChange={(time) => setActiveConversionPeriod(time)}
/>
            </div>

            <UniversalTable
              title="Recent Activity"
              showMobileHeader={false}
              rows={dashboardRows}
              columns={dashboardColumns}
         
              filterConfig={{
                showActivityFilter: true,
                showTimeframeFilter: true,
                showSortFilter: true,
                activityOptions: [
                  'All Activity', 
                  'Draft', 
                  'Submitted', 
                  'Under Review', 
                  'Approved', 
                  'Rejected'
                ],
                timeframeOptions: ['Last 7 days', 'Last 30 days', 'Last 3 months', 'All time'],
                sortOptions: ['Status', 'Date', 'Value', 'Type']
              }}
              mobileDesign={{
                showType: true,
                showCargoIcon: true,
                showDateIcon: true,
                dateLabel: 'Created',
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
         
<ConversionChart 
  title="Quote Conversion Rate"
  data={conversionData}
  defaultActiveTime={activeConversionPeriod}
  showTimeDropdown={true}
  typeLabels={{
    approved: 'approved',
    declined: 'declined',
    expired: 'expired'
  }}
  colors={{
    approved: { start: '#BED5F8', end: '#669CEE' },
    declined: { start: '#F8E2BE', end: '#EEDE66' },
    expired: { start: '#FFA4A4', end: '#EB6025' }
  }}
  onTimeChange={(time) => setActiveConversionPeriod(time)}
/>
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
                  <ConversionChart 
  title="Quote Conversion Rate"
  data={conversionData}
  defaultActiveTime={activeConversionPeriod}
  showTimeDropdown={true}
  typeLabels={{
    approved: 'approved',
    declined: 'declined',
    expired: 'expired'
  }}
  colors={{
    approved: { start: '#BED5F8', end: '#669CEE' },
    declined: { start: '#F8E2BE', end: '#EEDE66' },
    expired: { start: '#FFA4A4', end: '#EB6025' }
  }}
  onTimeChange={(time) => setActiveConversionPeriod(time)}
/>
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