'use client'

import DashboardLayout from '../DashboardLayout'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'

interface User {
  id: string
  email?: string
  created_at?: string
}
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('Dashboard')
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const pathname = usePathname()
  
  // Ավելացրեք notifications state-երը
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Quote Request',
      message: 'You have a new quote request from Global Shipping Ltd.',
      type: 'info' as const,
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '2',
      title: 'Policy Expiring Soon',
      message: 'Policy #P-020 expires in 15 days. Consider renewal.',
      type: 'warning' as const,
      read: false,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: '3',
      title: 'Document Approved',
      message: 'Your uploaded document has been approved.',
      type: 'success' as const,
      read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '4',
      title: 'Payment Received',
      message: 'Payment of $2,500 has been processed successfully.',
      type: 'success' as const,
      read: true,
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ])
  
  const [unreadCount, setUnreadCount] = useState(0)

  // Mobile filter states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedActivity, setSelectedActivity] = useState('All Activity')
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 days')
  const [selectedSort, setSelectedSort] = useState('Sort by')
  const [selectedStatus, setSelectedStatus] = useState('Status')

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        redirect('/login')
      }
      
      setUser(user)
      setLoading(false)
    }

    fetchUser()
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.classList.remove('overflow-hidden')
  }

  // Mobile filter functions
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false)
  }

  const applyFilters = () => {
    console.log('Applying filters:', {
      searchTerm,
      selectedActivity,
      selectedTimeframe,
      selectedSort,
      selectedStatus
    })
    closeMobileFilter()
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedActivity('All Activity')
    setSelectedTimeframe('Last 30 days')
    setSelectedSort('Sort by')
    setSelectedStatus('Status')
  }

  const handleProfileSetting = () => {
    console.log('Navigate to profile settings')
    closeMobileMenu()
    setIsUserDropdownOpen(false)
  }

  const handleLogout = () => {
    closeMobileMenu()
    setIsUserDropdownOpen(false)
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'shipments', label: 'Shipments' },
    { id: 'documents', label: 'Documents' }
  ]

  const handleNavClick = (itemId: string, itemLabel: string) => {
    setActiveNavItem(itemLabel)
    closeMobileMenu()
  }

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false)
  }

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown')
      const avatar = document.getElementById('user-avatar')
      
      if (dropdown && avatar && 
          !dropdown.contains(event.target as Node) && 
          !avatar.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    if (isUserDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isUserDropdownOpen])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3d62]"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className='insult'>
        <div className='infarkt'>
          <div className="max-w-[88%] min-w-full sm:max-w-[96%] mx-auto">
            {/* Header */}
            
            {/* Mobile Header for Activity Section */}
            <div className="flex gap-2 items-center mb-4 xl:hidden">
              <img src="/dashboard/hashtag.svg" alt="" className="w-5 h-5" />
              <h4 className="font-normal text-base">Dashboard</h4>
            </div>

            {/* Main Content Grid */}
            <main className="grid grid-cols-1 xl:grid-cols-[75%_24%] gap-4 items-stretch main-content">
              {/* Left Column - 75% */}
              <div className="max-h-[99.5%] flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/quotes/header-ic.svg"
                    alt=""
                    className="w-6 h-6"
                  />
                  <h2 className="text-[26px]">Quotes</h2>
                </div>

                
                {/* Mobile Activity Header */}
                <div className="xl:hidden flex items-center justify-between activity-mobile-header activity-section-mob-hd">
                  <h3 className="text-lg font-normal">All Insurance Quotes</h3>
                  <div className="flex gap-1">
                    <button className="p-[10px] bg-[#FBFBFC] border border-[#FBFBFC] rounded-[6px]">
                      <img src="/dashboard/btn/01.svg" alt="" className="w-4 h-4" />
                    </button>

                    <button className="p-[10px] bg-[#FBFBFC] border border-[#FBFBFC] rounded-[6px]">
                      <img src="/dashboard/btn/02.svg" alt="" className="w-4 h-4" />
                    </button>

                    <button className="p-[10px] bg-[#FBFBFC] border border-[#FBFBFC] rounded-[6px]">
                      <img src="/dashboard/btn/03.svg" alt="" className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={toggleMobileFilter}
                      className="p-[10px] bg-[#FBFBFC] border border-[#FBFBFC] rounded-[6px]"
                    >
                      <img src="/dashboard/btn/04.svg" alt="" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Recent Activity Table */}
                <section className="block-2 flex flex-col max-h-[100%] activity-section bg-[#fafcff]/80 rounded-2xl p-4 xl:p-4">
                  {/* Desktop Filters */}
                  <div className='block-1'>
                    <h2 className="text-[20px] mb-4">All Insurance Quotes</h2>
                    <div className="hidden xl:flex justify-between items-center mb-4 activity-header activity-filters">
                      <div className="flex items-center gap-1.5">
                        <img 
                          src="https://c.animaapp.com/mjiggi0jSqvoj5/img/filter-1.png" 
                          alt="Filter" 
                          className="w-3 h-3"
                        />
                        <span className="font-montserrat text-base font-normal text-[#818181]">
                          Search Filter
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 showin-result-ittle-info">
                        <div className="w-36 h-[38px] border-b border-[#c7c7c7]/51 flex items-center justify-between px-3 py-2 hover:border-[#a0a0a0]/51 transition-colors duration-300">
                          <input 
                            type="text" 
                            placeholder="Search by..."
                            className="w-full border-none bg-transparent font-montserrat text-xs text-[#7b7b7b] outline-none"
                          />
                          <img 
                            src="https://c.animaapp.com/mjiggi0jSqvoj5/img/search--1--2.png" 
                            alt="Search" 
                            className="w-3 h-3"
                          />
                        </div>
                        
                        {['All Activity', 'Last 30 days', 'Sort by', 'Status'].map((text, idx) => (
                          <div key={idx} className="h-[38px] flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51 font-montserrat text-xs text-[#7b7b7b] hover:border-[#a0a0a0]/51 transition-colors duration-300">
                            <span>{text}</span>
                            <img 
                              src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                              alt="Dropdown"
                              className="w-2 h-1"
                            />
                          </div>
                        ))}
                        
                        <button className="bg-[#F9FBFD] border border-[#C8C8C8]  text-white p-2 rounded-[50%] font-poppins text-sm font-normal hover:bg-[#F1F6FA] transition-colors duration-300">
                          <img src="/quotes/refresh.svg" className="w-[16px] h-[16px]" alt="" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Desktop Table Header - Updated */}
                    <div className="hidden xl:grid grid-cols-[100px_120px_120px_140px_150px_150px_140px] gap-4 pb-2 border-b border-gray-200 mb-2 table-header">
                      {['Quote ID', 'Cargo', 'Shipment Value', 'Premium Amount', 'Expiration Date', 'Status', 'Action'].map((header, idx) => (
                        <div key={idx} className="flex items-center gap-2 font-poppins text-sm font-normal text-[#606068]">
                          <span>{header}</span>
                          {header !== 'Action' && (
                            <img 
                              src="https://c.animaapp.com/mjiggi0jSqvoj5/img/filter--1--7.png" 
                              alt="Sort" 
                              className="w-3 h-3"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Table Rows - Updated with new data */}
                  {/* Table Rows - Updated with mobile layout */}
<div className="block-2 space-y-2 activity-table overflow-y-scroll">
  {[
    {
      id: 'Q-005',
      cargo: 'Electronics',
      value: '$15,400.00',
      premium: '$450.00',
      expiration: 'Oct 25 – Nov 5',
      status: { text: 'Pending Approval', color: 'bg-[#cbd03c]/10', dot: 'bg-[#cbd03c]', textColor: 'text-[#cbd03c]' },
      button: { text: 'Approve Quote', variant: 'primary' }
    },
    {
      id: 'Q-021',
      cargo: 'Furniture',
      value: '$20,000.00',
      premium: '$255.00',
      expiration: 'Oct 20 – Nov 1',
      status: { text: 'Approved', color: 'bg-[#16a34a]/10', dot: 'bg-[#16a34a]', textColor: 'text-[#16a34a]' },
      button: { text: 'Approve Quote', variant: 'primary' }
    },
    {
      id: 'Q-054',
      cargo: 'Clothing',
      value: '$5,500.00',
      premium: '$600.00',
      expiration: 'Oct 22 – Nov 3',
      status: { text: 'Declined', color: 'bg-[#8ea0b0]/10', dot: 'bg-[#8ea0b0]', textColor: 'text-[#8ea0b0]' },
      button: { text: 'View Reason', variant: 'secondary' }
    },
    {
      id: 'Q-005',
      cargo: 'Machinery',
      value: '$8,500.00',
      premium: '$165.00',
      expiration: 'Oct 24 – Nov 4',
      status: { text: 'Pending Approval', color: 'bg-[#cbd03c]/10', dot: 'bg-[#cbd03c]', textColor: 'text-[#cbd03c]' },
      button: { text: 'Approve Quote', variant: 'primary' }
    },
    {
      id: 'Q-014',
      cargo: 'Chemicals',
      value: '$12,800.00',
      premium: '$360.00',
      expiration: 'Oct 21 – Nov 2',
      status: { text: 'Approved', color: 'bg-[#16a34a]/10', dot: 'bg-[#16a34a]', textColor: 'text-[#16a34a]' },
      button: { text: 'Approve Quote', variant: 'primary' }
    }
  ].map((row, idx) => (
    <div key={idx} className="xl:grid xl:grid-cols-[100px_120px_120px_140px_150px_150px_140px] gap-4 p-3 xl:p-3 bg-[#f8fafd] xl:bg-[#f8fafd] rounded-lg xl:rounded-lg flex flex-wrap items-center table-row hover:bg-[#f0f4f9] transition-colors duration-300">
      {/* Desktop Layout */}
      <div className="hidden xl:block xl:w-auto font-poppins text-sm text-[#2563eb] underline truncate row-cell id-link hover:text-[#1d4ed8] transition-colors duration-300">{row.id}</div>
      <div className="hidden xl:block xl:w-auto font-poppins text-sm text-black truncate row-cell">{row.cargo}</div>
      <div className="hidden xl:block xl:w-auto font-poppins text-sm text-black truncate row-cell">{row.value}</div>
      <div className="hidden xl:block xl:w-auto font-poppins text-sm text-black truncate row-cell">{row.premium}</div>
      <div className="hidden xl:block xl:w-auto font-poppins text-sm text-black truncate row-cell">{row.expiration}</div>
      <div className="hidden xl:block xl:w-auto row-cell">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-xs ${row.status.color} ${row.status.textColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.status.dot}`}></span>
          {row.status.text}
        </span>
      </div>
      
      {/* Mobile Layout */}
      <div className="xl:hidden w-full">
        {/* Top row: ID on left, Status on right */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="font-poppins text-sm font-medium text-[#2563eb] underline">{row.id}</span>
          </div>
          <div className="row-cell flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[37px] font-poppins text-xs ${row.status.color} ${row.status.textColor} mobile-status-badge`}>
              <span className={`w-2 h-2 rounded-full ${row.status.dot}`}></span>
              {row.status.text}
            </span>
          </div>
        </div>
        
        {/* Middle row: Cargo and Value */}
        <div className="flex justify-between items-center mb-2">
          <div className="font-poppins text-sm text-gray-700">{row.cargo}</div>
          <div className="font-poppins text-sm font-medium text-black">{row.value}</div>
        </div>
        
        {/* Middle row: Premium and Expiration */}
        <div className="flex justify-between items-center mb-4">
          <div className="font-poppins text-sm text-gray-700">Premium: {row.premium}</div>
          <div className="font-poppins text-sm text-gray-600">{row.expiration}</div>
        </div>
        
        {/* Full-width button */}
        <div className="flex flex-col gap-4">
          <button className={`mobile-action-btn ${
            row.button.variant === 'primary' 
              ? 'primary-btn' 
              : 'secondary-btn'
          }`}>
            {row.button.text}
          </button>
        </div>
      </div>
      
      {/* Desktop button */}
      <div className="hidden xl:block xl:w-auto row-cell">
        <button className={`h-9 px-4 rounded-lg font-poppins text-sm font-normal transition-colors duration-300 w-full xl:w-[140px] ${
          row.button.variant === 'primary' 
            ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]' 
            : 'bg-transparent text-[#374151] border border-[#e3e6ea] hover:bg-[#f3f4f6] hover:border-[#d1d5db]'
        }`}>
          {row.button.text}
        </button>
      </div>
    </div>
  ))}
</div>

                </section>
              </div>

              {/* Right Column - 25% */}
              <div className="flex max-h-[99.5%] flex-col gap-4 right">
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
                {/* Welcome Widget */}
                {/* Stats Cards Section */}
<div className="flex flex-col gap-4">
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
              </div>
            </main>
          </div>

          {/* Mobile Filter Overlay */}
          {isMobileFilterOpen && (
            <div className="mobile-filter-overlay active">
              <div className="mobile-filter-container">
                <div className="mobile-filter-header">
                  <h3 className="mobile-filter-title">Filters</h3>
                  <button onClick={closeMobileFilter} className="mobile-close-filter-btn">
                    <img src="/dashboard/close.svg" alt="Close" className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mobile-filter-content">
                  {/* Search Input */}
                  <div className="mobile-filter-group">
                    <label className="mobile-filter-label">Search by...</label>
                    <div className="mobile-search-input">
                      <input
                        type="text"
                        placeholder="Type to search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mobile-search-field"
                      />
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/search--1--2.png" 
                        alt="Search" 
                        className="mobile-search-icon"
                      />
                    </div>
                  </div>
                  
                  {/* All Activity Dropdown */}
                  <div className="mobile-filter-group">
                    <label className="mobile-filter-label">All Activity</label>
                    <div className="mobile-dropdown">
                      <select 
                        value={selectedActivity}
                        onChange={(e) => setSelectedActivity(e.target.value)}
                        className="mobile-dropdown-select"
                      >
                        <option value="All Activity">All Activity</option>
                        <option value="Quotes Only">Quotes Only</option>
                        <option value="Shipments Only">Shipments Only</option>
                        <option value="Documents Only">Documents Only</option>
                      </select>
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                        alt="Dropdown"
                        className="mobile-dropdown-arrow"
                      />
                    </div>
                  </div>
                  
                  {/* Last 30 days Dropdown */}
                  <div className="mobile-filter-group">
                    <label className="mobile-filter-label">Timeframe</label>
                    <div className="mobile-dropdown">
                      <select 
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="mobile-dropdown-select"
                      >
                        <option value="Last 30 days">Last 30 days</option>
                        <option value="Last 7 days">Last 7 days</option>
                        <option value="Last 24 hours">Last 24 hours</option>
                        <option value="Last 3 months">Last 3 months</option>
                        <option value="All time">All time</option>
                      </select>
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                        alt="Dropdown"
                        className="mobile-dropdown-arrow"
                      />
                    </div>
                  </div>
                  
                  {/* Sort by Dropdown */}
                  <div className="mobile-filter-group">
                    <label className="mobile-filter-label">Sort by</label>
                    <div className="mobile-dropdown">
                      <select 
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="mobile-dropdown-select"
                      >
                        <option value="Sort by">Sort by</option>
                        <option value="Newest first">Newest first</option>
                        <option value="Oldest first">Oldest first</option>
                        <option value="Status">Status</option>
                        <option value="Value">Value</option>
                      </select>
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                        alt="Dropdown"
                        className="mobile-dropdown-arrow"
                      />
                    </div>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="mobile-filter-group">
                    <label className="mobile-filter-label">Status</label>
                    <div className="mobile-dropdown">
                      <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="mobile-dropdown-select"
                      >
                        <option value="Status">Status</option>
                        <option value="All Status">All Status</option>
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                        <option value="Expired">Expired</option>
                      </select>
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                        alt="Dropdown"
                        className="mobile-dropdown-arrow"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mobile-filter-actions">
                  <button onClick={resetFilters} className="mobile-filter-reset">
                    Reset Filters
                  </button>
                  <button onClick={applyFilters} className="mobile-filter-apply">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CSS Styles */}
          <style jsx>{`
            /* Hamburger Menu Styles */
            .hamburger-menu {
                display: none;
            }

            .hamburger-btn {
                width: 44px;
                height: 44px;
                background-color: #f7f7f7;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.22);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                padding: 10px;
            }

            .hamburger-line {
                width: 20px;
                height: 2px;
                background-color: #000000;
                transition: all 0.3s ease;
            }

            .hamburger-btn.active .hamburger-line:nth-child(1) {
                transform: translateY(6px) rotate(45deg);
            }

            .hamburger-btn.active .hamburger-line:nth-child(2) {
                opacity: 0;
            }

            .hamburger-btn.active .hamburger-line:nth-child(3) {
                transform: translateY(-6px) rotate(-45deg);
            }

            /* Mobile Navigation Overlay */
            .mobile-nav-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .mobile-nav-overlay.active {
                display: block;
                opacity: 1;
            }

            .mobile-nav-container {
                position: absolute;
                top: 0;
                right: 0;
                width: 300px;
                height: 100%;
                background-color: #ffffff;
                padding: 20px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                overflow-y: auto;
            }

            .mobile-nav-overlay.active .mobile-nav-container {
                transform: translateX(0);
            }

            .mobile-nav-header {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 30px;
            }

            .mobile-close-btn {
                width: 44px;
                height: 44px;
                background-color: #f7f7f7;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.22);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 24px;
                color: #000000;
            }

            /* Mobile Filter Overlay - Updated as requested */
            .mobile-filter-overlay {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 70007;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                top: 0;
            }

            .mobile-filter-overlay.active {
                display: block;
                opacity: 1;
            }

            .mobile-filter-container {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 75vh;
                background-color: #ffffff;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
                padding: 24px;
                transform: translateY(100%);
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
            }

            .mobile-filter-overlay.active .mobile-filter-container {
                transform: translateY(0);
            }

            .mobile-filter-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid #f0f0f0;
            }

            .mobile-filter-title {
                font-family: 'Montserrat', sans-serif;
                font-size: 20px;
                font-weight: 600;
                color: #000000;
            }

            .mobile-close-filter-btn {
                width: 40px;
                height: 40px;
                background-color: #f7f7f7;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.22);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }

            .mobile-filter-content {
                flex: 1;
                overflow-y: auto;
                padding-right: 8px;
            }

            .mobile-filter-group {
                margin-bottom: 20px;
            }

            .mobile-filter-label {
                display: block;
                font-family: 'Montserrat', sans-serif;
                font-size: 14px;
                font-weight: 500;
                color: #606068;
                margin-bottom: 8px;
            }

            .mobile-search-input {
                position: relative;
                width: 100%;
            }

            .mobile-search-field {
                width: 100%;
                height: 48px;
                padding: 0 16px 0 40px;
                border: 1px solid #e3e6ea;
                border-radius: 8px;
                font-family: 'Montserrat', sans-serif;
                font-size: 14px;
                color: #7b7b7b;
                background-color: #ffffff;
                outline: none;
                transition: border-color 0.3s;
            }

            .mobile-search-field:focus {
                border-color: #2563eb;
            }

            .mobile-search-icon {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                opacity: 0.5;
            }

            .mobile-dropdown {
                position: relative;
                width: 100%;
            }

            .mobile-dropdown-select {
                width: 100%;
                height: 48px;
                padding: 0 16px;
                border: 1px solid #e3e6ea;
                border-radius: 8px;
                font-family: 'Montserrat', sans-serif;
                font-size: 14px;
                color: #7b7b7b;
                background-color: #ffffff;
                outline: none;
                appearance: none;
                cursor: pointer;
                transition: border-color 0.3s;
            }

            .mobile-dropdown-select:focus {
                border-color: #2563eb;
            }

            .mobile-dropdown-arrow {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                width: 12px;
                height: 8px;
                pointer-events: none;
            }

            .mobile-filter-actions {
                display: flex;
                gap: 12px;
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid #f0f0f0;
            }

            .mobile-filter-reset {
                flex: 1;
                height: 48px;
                border: 1px solid #e3e6ea;
                border-radius: 8px;
                background-color: transparent;
                font-family: 'Montserrat', sans-serif;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
                cursor: pointer;
                transition: all 0.3s;
            }

            .mobile-filter-reset:hover {
                background-color: #f3f4f6;
                border-color: #d1d5db;
            }

            .mobile-filter-apply {
                flex: 1;
                height: 48px;
                border: none;
                border-radius: 8px;
                background-color: #2563eb;
                font-family: 'Montserrat', sans-serif;
                font-size: 14px;
                font-weight: 500;
                color: #ffffff;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .mobile-filter-apply:hover {
                background-color: #1d4ed8;
            }

            .mobile-nav-search {
                width: 100%;
                height: 44px;
                background-color: #f7f7f7;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.22);
                display: flex;
                align-items: center;
                padding: 0 12px;
                margin-bottom: 20px;
            }

            .mobile-nav-search input {
                flex: 1;
                border: none;
                background: transparent;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                color: #000000;
                outline: none;
            }

            .mobile-nav-search img {
                width: 18px;
                height: 18px;
            }

            .mobile-nav-links {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 30px;
            }

            .mobile-nav-link {
                padding: 12px 16px;
                font-family: 'Inter', sans-serif;
                font-size: 16px;
                color: #000000;
                text-decoration: none;
                border-radius: 8px;
                transition: background-color 0.3s ease;
            }

            .mobile-nav-link.active {
                background-color: #f7f7f7;
            }

            .mobile-nav-link:hover {
                background-color: #ffffff !important;
            }

            .mobile-nav-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .mobile-action-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                background-color: #f7f7f7;
                border: 1px solid rgba(255, 255, 255, 0.22);
                border-radius: 8px;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                color: #000000;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .mobile-action-btn:hover {
                background-color: #e9e9e9;
            }

            .mobile-action-btn img {
                width: 20px;
                height: 20px;
            }

            /* User Dropdown Styles */
            .user-dropdown-arrow {
                transition: transform 0.2s ease;
            }

            .user-dropdown-arrow.open {
                transform: rotate(180deg);
            }

            @media screen and (max-width: 1336px) {
            .block-2 {
        overflow: scroll !important;
    }

                .activity-header {
                    display: block;
                }
                
                .activity-filters {
                    justify-content: flex-end;
                }
                
                .action-content {
                    height: 100%;
                }
                
                .action-subtitle {
                    max-width: 100%;
                }
                
                .action-center {
                    height: 254px;
                }
                
                .action-bg {
                    top: 0;
                }

                .action-buttons {
                    max-width: 100%;
                }
                
                .welcome-widget {
                    height: 352px;
                }
                
                .cta-title {
                    font-size: 26px;
                    font-weight: 500;
                    line-height: 33px;
                    letter-spacing: 0.64px;
                    max-width: 224px;
                }
            }

            @media screen and (max-width: 1280px) {
                .main-content {
                    display: flex;
                    flex-direction: column-reverse;
                }
                
                .right {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    gap: 16px;
                }
                
                .action-center {
                    height: 100%;
                    width: 40%;
                }
                
                .action-bg {
                    width: 840px;
                    height: 328px !important;
                }

                .welcome-title {
                    font-size: 18px;
                    margin-bottom: 6px;
                }
                
                .welcome-subtitle {
                    max-width: 100%;
                    font-size: 12px;
                }
                
                .cta-title {
                    font-size: 22px;
                    line-height: 28px;
                }

                .quote-conversion.performance-section {
                    width: 49%;
                    position: relative;
                    justify-content: space-between;
                    display: flex;
                    flex-direction: column;
                }
                
                .navigation {
                    display: none;
                }
                
                .activity-mobile-header {
                    display: flex;
                    margin-bottom: 16px;
                }
                
                .activity-section-mob-hd {
                    display: flex;
                }
                
                .welcome-widget {
                    height: 260px;
                    width: 49%;
                }
                
                .showin-result-ittle-info {
                    display: none;
                }
                
                .activity-table {
                    margin-top: -12px;
                }
                
                .hamburger-menu {
                    display: block;
                }
                
                /* Hide desktop navigation completely */
                .navigation {
                    display: none;
                }
            }

            @media screen and (max-width: 1024px) {
                .welcome-widget, .action-center, .conv-rate {
                    display: none;
                }
                .rate-mob-hid {
                  display: none !important;
                }
                .quote-conversion.performance-section {
                    width: 100%;
                    min-height: 170px;
                }
                
                .action-title, .section-title {
                    font-size: 16px;
                }
                
                .action-subtitle {
                    margin-bottom: 0px;
                }
                
                .metrics-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 35px;
                    padding-left: 20px;
                }
                
                .metric-card-item {
                    width: 43%;
                }
                
                .section-header {
                    align-items: center;
                }
                
                .activity-header {
                    display: none;
                }
                
                .table-header {
                    display: none;
                }
                
                .activity-table {
                    margin-top: 0px;
                }
                
                .table-row {
                    min-width: 100%;
                    display: flex;
                    background-color: rgba(250, 252, 255, 0.8);
                    border-radius: 16px;
                    flex-wrap: wrap;
                    gap: 12px;
                    justify-content: space-between;
                    padding: 16px;
                }
                .table-row button {
                  width: 100%;
                }
                .logo-text {
                    display: none;
                }
                
                .id-link {
                    color: #2563eb !important;
                }
                
                .activity-section {
                    padding: 0;
                    background-color: transparent;
                    margin-top: -12px;
                }
                
                .row-cell {
                    font-family: 'Poppins', sans-serif;
                    font-size: 14px;
                    color: #000000;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 45.5%;
                    gap: 8px;
                }
                
                .container {
                    max-width: 94% !important;
                    display: block;
                }
                
                .header {
                    margin-bottom: 16px;
                }
                
                .user-avatar img {
                    width: 44px;
                    height: 44px;
                }

                .notification-wrapper {
                    width: 44px;
                    height: 44px;
                }

                .notification-icon img {
                    width: 18px;
                }

                .notification-badge {
                    top: 12px;
                    right: 13px;
                    width: 6px;
                    height: 6px;
                }
            }

            @media screen and (max-width: 768px) {
                .metric-value, .metric-value2 {
                    font-size: 32px;
                    font-weight: 200;
                }

                .metrics-grid {
                    gap: 22px;
                }
                
                .performance-section {
                    padding: 16px;
                }
                
                .action-title, .section-title {
                    font-size: 14px;
                }
                
                .mobile-nav-container {
                    width: 100%;
                }
                
                .hamburger-btn {
                    width: 40px;
                    height: 40px;
                }
            }

            /* Prevent scrolling when menu is open */
            body.menu-open {
                overflow: hidden;
            }

            .metric-arrow {
                width: 28px;
                margin-left: 6px;
            }

            .btn-primary {
        width: 100%;
    }


    /* Mobile action button styles for Quotes page */
.mobile-action-btn {
  color: #ffffff;
  cursor: pointer;
  background-color: #2563EB;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: background-color 0.3s;
  display: flex;
  text-align: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  border: 1px solid rgba(0, 0, 255, 0.169);
}

.mobile-action-btn.primary-btn {
  background-color: #2563EB;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.mobile-action-btn.secondary-btn {
  background-color: transparent;
  color: #374151;
  border: 1px solid #e3e6ea;
}

.mobile-action-btn:hover {
  background-color: #1d4ed8;
}

.mobile-action-btn.secondary-btn:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

/* Mobile status badge - fit content */
.mobile-status-badge {
  width: fit-content !important;
  min-width: fit-content !important;
  white-space: nowrap !important;
  padding-left: 12px !important;
  padding-right: 12px !important;
  height: 26px;
  display: inline-flex !important;
  align-items: center !important;
}

/* Mobile specific styles for Quotes page */
@media screen and (max-width: 1024px) {
  .table-row {
    min-width: 100%;
    display: flex;
    background-color: rgba(250, 252, 255, 0.8);
    border-radius: 16px;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: space-between;
    padding: 20px;
    margin-bottom: 12px;
  }
  
  .row-cell {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: auto !important;
    min-width: fit-content !important;
  }
  
  /* Status badge in mobile */
  .table-row .mobile-status-badge {
    font-size: 11px !important;
    padding: 6px 10px !important;
    height: 24px;
  }
  
  /* Mobile layout spacing */
  .table-row > .xl\\:hidden {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .table-row .xl\\:hidden > div {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .mobile-action-btn {
    height: 44px;
    font-size: 14px;
    font-weight: 500;
  }
  
  .mobile-status-badge {
    font-size: 10px !important;
    padding: 5px 8px !important;
    height: 22px;
  }
  
  .table-row {
    padding: 16px;
    gap: 12px;
  }
}
  /* Additional Styles for Stats Cards */
.stats-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.stats-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments for stats cards */
@media screen and (max-width: 1280px) {
  .stats-card {
    width: 49%;
    min-height: 260px;
  }
  
  .right {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .right > div {
    width: 100%;
  }
  
  .right > .flex.flex-col.gap-4 {
    flex-direction: row;
    width: 100%;
  }
  
  .right > .flex.flex-col.gap-4 > .stats-card {
    width: 49%;
  }
}

@media screen and (max-width: 768px) {
  .right > .flex.flex-col.gap-4 {
    flex-direction: column;
  }
  
  .right > .flex.flex-col.gap-4 > .stats-card {
    width: 100%;
  }
  
  .stats-description {
    max-width: 100% !important;
  }
  
  .card-header {
    width: 100% !important;
  }
  
  .time-tabs {
    flex-wrap: wrap;
  }
} 
  /* Stats Cards */
.stats-card {
    background-color: #fafcffcc;
    border-radius: 16px;
    padding: 24px;
    width: 100%;
}

.stats-card h3 {
    font-family: "Montserrat", Helvetica;
    font-size: 18px;
    font-weight: 500;
    color: #000000;
    letter-spacing: 0.36px;
    line-height: normal;
}

.stats-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.rate-section {
    position: relative;
    width: 145px;
    height: 39px;
}

.rate-label {
    position: absolute;
    top: 24px;
    left: 97px;
    font-family: "Montserrat", Helvetica;
    font-size: 12px;
    font-weight: 500;
    color: #c7c7c7;
    letter-spacing: 0.24px;
    line-height: normal;
}

.rate-value {
    position: absolute;
    top: 0;
    left: 0;
    width: 82px;
    height: 37px;
    display: flex;
    gap: 3px;
    align-items: baseline;
}

.percentage {
    font-family: "Montserrat", Helvetica;
    font-size: 56px;
    color: #000000;
    font-weight: 400;
    letter-spacing: 1.12px;
    line-height: 36px;
    margin-top: 1px;
    width: 66px;
}

.percent-symbol {
    font-family: "Montserrat", Helvetica;
    font-size: 10px;
    color: #000000;
    font-weight: 400;
    letter-spacing: 0.20px;
    line-height: normal;
    width: 9px;
}

.stats-description {
    font-family: "Montserrat", Helvetica;
    font-size: 12px;
    font-weight: 400;
    color: #afaeae;
    letter-spacing: 0.24px;
    line-height: normal;
    width: 268px;
    margin: 0;
}

.stats-description strong {
    font-weight: 500;
    letter-spacing: 0.03px;
}

.stats-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
}

.stats-footer span {
    font-family: "Montserrat", Helvetica;
    font-size: 16px;
    font-weight: 400;
    color: #3c3c3c;
    letter-spacing: 0.32px;
    line-height: normal;
    width: 206px;
}

.stats-footer img {
    width: 42px;
    height: 42px;
}

/* Quotes Expiration Card */
.card-header {
    display: flex;
    flex-direction: column;
    width: 331px;
    gap: 16px;
    margin-bottom: 24px;
}

.time-tabs {
    display: flex;
    gap: 12px;
}

.time-tabs span {
    font-family: "Montserrat", Helvetica;
    font-size: 12px;
    font-weight: 500;
    color: #c7c7c7;
    letter-spacing: 0.24px;
    line-height: normal;
    cursor: pointer;
    white-space: nowrap;
}

.time-tabs span.active {
    color: #6f6f6f;
    text-decoration: underline;
}

.expiration-stats {
    position: relative;
    width: 149px;
    height: 73.5px;
    margin-bottom: 24px;
}

.expiration-left {
    position: absolute;
    top: 0;
    left: 2px;
    width: 143px;
    height: 45px;
    display: flex;
    gap: 14px;
}

.expiration-rate {
    width: 81px;
    height: 42px;
    display: flex;
    gap: 3px;
    align-items: baseline;
}

.rate-number {
    font-family: "Montserrat", Helvetica;
    font-size: 56px;
    color: #000000;
    font-weight: 400;
    letter-spacing: 1.12px;
    line-height: 41px;
    margin-top: 1px;
    width: 65px;
}

.rate-symbol {
    font-family: "Montserrat", Helvetica;
    font-size: 10px;
    color: #000000;
    font-weight: 400;
    letter-spacing: 0.20px;
    line-height: normal;
    width: 9px;
}

.expiration-left .rate-label {
    margin-top: 30.2px;
    width: 46px;
    height: 15px;
    font-weight: 500;
    color: #c7c7c7;
    font-size: 12px;
    letter-spacing: 0.24px;
    line-height: normal;
}

.expiration-right {
    position: absolute;
    top: 58px;
    left: 0;
}

.expiration-total {
    font-family: "Montserrat", Helvetica;
    font-size: 12px;
    font-weight: 500;
    color: #c7c7c7;
    letter-spacing: 0.24px;
    line-height: normal;
    white-space: nowrap;
}

.expiration-chart {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.expiration-chart img {
    width: 100%;
    height: 24px;
}

.chart-label {
    font-family: "Montserrat", Helvetica;
    font-size: 12px;
    font-weight: 500;
    color: #c7c7c7;
    letter-spacing: 0.24px;
    line-height: normal;
}

/* Chart styles */
.chart-div-item {
    height: 24px;
    background-color: #E2E3E4;
}
.chart-div-active-item {
    height: 20px;
    background-color: #EE9F66;
}
.chaart {
    display: flex;
    gap: 4px;
    justify-content: start;
    align-items: center;
    overflow: hidden;
    margin-bottom: 12px;
}
.chart-div-item,
.chart-div-active-item {
    width: 1px;
    transform: scaleX(2);
    transform-origin: left;
}
          `}</style>
        </div>
      </div>
    </DashboardLayout>
  )
}