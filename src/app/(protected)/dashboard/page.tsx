'use client'

import DashboardLayout from '../DashboardLayout'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { ConversionChart } from '../../components/charts/ConversionChart'

interface User {
  id: string
  email?: string
  created_at?: string
}

export default function DashboardPage() {
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

  // Mobile filter states for Dashboard
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

  const handleProfileSetting = () => {
    console.log('Navigate to profile settings')
    closeMobileMenu()
    setIsUserDropdownOpen(false)
  }

  const handleLogout = () => {
    closeMobileMenu()
    setIsUserDropdownOpen(false)
  }

  // Mobile filter functions for Dashboard
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false)
  }

  const applyFilters = () => {
    console.log('Applying Dashboard filters:', {
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
          <div className="max-w-[88%] min-w-full sm:max-w-[97.5%] mx-auto">
            {/* Mobile Header for Activity Section */}
            <div className="flex gap-2 items-center mb-4 xl:hidden">
              <img src="/dashboard/hashtag.svg" alt="" className="w-5 h-5" />
              <h2 className="font-normal text-lg">Dashboard</h2>
            </div>

            {/* Main Content Grid */}
            <main className="grid grid-cols-1 xl:grid-cols-[76.5%_23%] gap-2 items-stretch main-content">
              {/* Left Column - 75% */}
              <div className="max-h-[93%] flex flex-col gap-2">
                {/* Performance Overview */}
                <section className="block-1 border border-[#d1d1d154] bg-[#fafaf7]/80 rounded-2xl p-4 h-auto performance-section">
                  <div className="flex justify-between items-start mb-2 section-header">
                    <div>
                      <h2 className="font-montserrat text-[16px] font-normal text-black section-title">
                        Performance Overview
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51 hover:border-[#a0a0a0]/51 transition-colors duration-300">
                      <span className="font-montserrat text-[12px] font-normal text-[#7b7b7b]">
                        This Month
                      </span>
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                        alt="Dropdown" 
                        className="w-2 h-1"
                      />
                    </div>
                  </div>
                  
                  {/* Metrics Grid */}
                  <div className="flex justify-around xl:flex-nowrap gap-8 xl:gap-2 metrics-grid">
                    {/* Total Insured Amount */}
                    <div className="w-[43%] xl:w-[12%] metric-card-item">
                      <div className="relative">
                        <div className="font-montserrat text-[46px] xl:text-[46px] font-normal text-black flex items-baseline relative metric-value">
                          <span className="text-black tracking-[1.28px]">84.</span>
                          <span className="text-[#c7c7c7] tracking-[1.28px]">5k</span>
                          <span className="absolute -left-5 top-3 text-[12px]">$</span>
                        </div>
                      </div>
                      <p className="sub-header-metric font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                        Total Insured Amount
                      </p>
                    </div>
                    
                    {/* Active Policies */}
                    <div className="w-[43%] xl:w-[12%] metric-card-item">
                      <div className="relative">
                        <div className="font-montserrat relative w-fit text-[46px] xl:text-[46px] font-normal text-black flex items-baseline relative metric-value2">
                          <span className="text-black tracking-[1.28px]">8.</span>
                          <span className="text-[#c7c7c7] tracking-[1.28px]">47</span>
                          <span className="absolute -left-5 top-3 text-[12px]">%</span>
                          <span className="absolute -right-5 top-3 text-[12px]">
                          <img src="/dashboard/top-arrow.svg" alt="" />
                        </span>
                        </div>
                      </div>
                      <p className="sub-header-metric font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                        Active Policies
                      </p>
                    </div>
                    
                    {/* Quotes Awaiting Approval */}
                    <div className="w-[43%] xl:w-[12%] metric-card-item">
                      <div className="font-montserrat relative w-fit text-[46px] xl:text-[46px] font-normal text-black flex items-baseline metric-value">
                        <span className="text-black tracking-[1.28px]">3.</span>
                        <img 
                          className="w-7 ml-1.5 metric-arrow" 
                          src="/dashboard/arrow.svg" 
                          alt="Arrow" 
                          style={{ width: '28px', marginLeft: '6px' }}
                        />
                        <span className="absolute -left-5 top-3 text-[12px]">%</span>
                        <span className="absolute -right-5 top-3 text-[12px]">
                          <img src="/dashboard/top-arrow.svg" alt="" />
                        </span>
                      </div>
                      <p className="sub-header-metric font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                        Quotes Awaiting Approval
                      </p>
                    </div>
                    
                    {/* Contracts Due to Expire */}
                    <div className="w-[43%] xl:w-[12%] metric-card-item">
                      <div className="font-montserrat relative w-fit text-[46px] xl:text-[46px] font-normal text-black flex items-baseline metric-value">
                        <span className="text-black tracking-[1.28px]">2.</span>
                        <img 
                          className="w-7 ml-1.5 metric-arrow" 
                          src="/dashboard/arrow.svg" 
                          alt="Arrow"
                          style={{ width: '28px', marginLeft: '6px' }}
                        />
                        <span className="absolute -left-5 top-3 text-[12px]">%</span>
                        <span className="absolute -right-5 top-3 text-[12px]">
                          <img src="/dashboard/top-arrow.svg" alt="" />
                        </span>
                      </div>
                      <p className="sub-header-metric font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                        Contracts Due to Expire
                      </p>
                    </div>
                    
                    {/* Required Document Uploads */}
                    <div className="w-[43%] xl:w-[12%] metric-card-item">
                      <div className="font-montserrat relative w-fit text-[46px] xl:text-[46px] font-normal text-black flex items-baseline metric-value">
                        <span className="text-black tracking-[1.28px]">1.</span>
                        <img 
                          className="w-7 ml-1.5 metric-arrow" 
                          src="/dashboard/arrow.svg" 
                          alt="Arrow"
                          style={{ width: '28px', marginLeft: '6px' }}
                        />
                        <span className="absolute -left-5 top-3 text-[12px]">%</span>
                        <span className="absolute -right-5 top-3 text-[12px]">
                          <img src="/dashboard/top-arrow.svg" alt="" />
                        </span>
                      </div>
                      <p className="sub-header-metric font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                        Required Document Uploads
                      </p>
                    </div>
                  </div>
                </section>

                {/* Mobile Activity Header */}
                <div className="recent-activity md:hidden flex items-center justify-between activity-mobile-header activity-section-mob-hd">
                  <h3 className="text-lg font-normal">Recent Activity</h3>
                  <div className='flex justify-betwwen gap-2'>
                        <button className="flex items-center gap-1 bg-[#F5F4F7] border border-[#d1d1d154] px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#F2F0F5] transition-colors duration-300">
                          <img src="dashboard/icons/filter-stroke-rounded.svg" alt="" className="w-[16px] h-[16px]" />
                          Filter
                        </button>
                        <button className="bg-[#eb8d25] text-white px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#ff8c0c] transition-colors duration-300">
                          Get New Quote
                        </button>
                      </div>
                </div>

                {/* Recent Activity Table */}
                <section className="block-2 flex flex-col max-h-[88%] border border-[#d1d1d154] activity-section bg-[#fafaf7]/80 rounded-2xl py-4 xl:py-4">
                  {/* Desktop Filters */}
                  <div className='block-1 '>
                   
                  <div className='hidden sm:flex px-4 xl:px-4 flex justify-between items-center border-b border-b-[#d1d1d154] pb-3'>
                    <h2 className="hidden md:block">Recent Insurance Activity</h2>
                    <div className='hidden md:flex justify-between gap-2'>
                      <button className="flex text-[#6e6d6d] items-center gap-2 w-[180px] bg-[#f9f9f6] border border-[#d1d1d154] px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#F2F0F5] transition-colors duration-300">
                        <img src="dashboard/icons/search-01-stroke-rounded.svg" alt="" className="w-[16px] h-[16px]" />
                        Search
                      </button>
                      <button className="flex items-center gap-1 bg-[#F5F4F7] border border-[#d1d1d154] px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#F2F0F5] transition-colors duration-300">
                        <img src="dashboard/icons/filter-stroke-rounded.svg" alt="" className="w-[16px] h-[16px]" />
                        Filter
                      </button>
                      <button className="bg-[#eb8d25] text-white px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#ff8c0c] transition-colors duration-300">
                        Get New Quote
                      </button>
                    </div>
                  </div>
                    
                    {/* Desktop Table Header */}
                    {/* Desktop Table Header */}
                    <div className="px-4 sm:px-4 py-2 mb-0.5 hidden md:grid grid-cols-[8.5%_8.5%_1fr_20%_14%_17%] gap-2 pb-2 mb-0 table-header w-[97%] bg-[#ededed7a] mx-auto my-3.5 rounded-[4px]">
                      {['Type', 'ID', 'Cargo / Value', 'Status / Due Date', 'Last Update', 'Action'].map((header, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 font-poppins text-sm font-normal text-[#606068]
                            ${header === 'Action' ? 'justify-end' : ''}`}
                        >
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

                  {/* Table Rows */}
                  <div className="table-rows-cont px-4 xl:px-4 block-2 space-y-2 activity-table overflow-y-scroll">
                    {[
                      {
                        type: 'Quote',
                        id: 'Q-005',
                        cargo: 'Jewelry',
                        value: '$15,400.00',
                        status: { text: 'Pending Approval', color: 'bg-[#cbd03c]/10', dot: 'bg-[#cbd03c]', textColor: 'text-[#cbd03c]' },
                        date: 'Oct 25, 9:10PM',
                        button: { text: 'Approve Quote', variant: 'primary' }
                      },
                      {
                        type: 'Policy',
                        id: 'P-021',
                        cargo: 'Textiles',
                        value: '$3,700.00',
                        status: { text: 'Document Missing', color: 'bg-[#f97316]/10', dot: 'bg-[#f97316]', textColor: 'text-[#f97316]' },
                        date: 'Oct 20, 6:30PM',
                        button: { text: 'Upload Docs', variant: 'secondary' }
                      },
                      {
                        type: 'Policy',
                        id: 'P-020',
                        cargo: 'Heavy Machinery',
                        value: '$48,400.00',
                        status: { text: 'Expires 15 Nov 2025', color: 'bg-[#eab308]/10', dot: 'bg-[#eab308]', textColor: 'text-[#eab308]' },
                        date: 'Oct 15, 4:20AM',
                        button: { text: 'Renew Policy', variant: 'secondary' }
                      },
                      {
                        type: 'Policy',
                        id: 'P-019',
                        cargo: 'Electronics',
                        value: '$8,000.00',
                        status: { text: 'Active', color: 'bg-[#16a34a]/10', dot: 'bg-[#16a34a]', textColor: 'text-[#16a34a]' },
                        date: 'Oct 21, 2:30PM',
                        button: { text: 'Download Cert', variant: 'secondary' }
                      },
                      {
                        type: 'Quote',
                        id: 'Q-007',
                        cargo: 'Food Products',
                        value: '$1,100.00',
                        status: { text: 'Declined', color: 'bg-[#8ea0b0]/10', dot: 'bg-[#8ea0b0]', textColor: 'text-[#8ea0b0]' },
                        date: 'Sept 28, 9:30PM',
                        button: { text: 'View Details', variant: 'secondary' }
                      }
                    ].map((row, idx) => (
                      <div key={idx} className="tab-item md:grid md:grid-cols-[8.5%_8.5%_1fr_20%_14%_17%] gap-2 p-4 md:p-3 bg-[#f9f9f6] md:bg-[#f9f9f6] rounded-lg md:rounded-lg flex flex-wrap items-center table-row hover:bg-[#f0f4f9] transition-colors duration-300">
                        {/* Desktop Layout */}
                        <div className="hidden md:block md:w-auto font-poppins text-sm text-black truncate row-cell">{row.type}</div>
                        <div className="hidden md:block md:w-auto font-poppins text-sm text-[#2563eb] underline truncate row-cell id-link hover:text-[#1d4ed8] transition-colors duration-300">{row.id}</div>
                        <div className="hidden md:block md:w-auto font-poppins text-sm text-black truncate row-cell">{row.cargo} / {row.value}</div>
                        <div className="hidden md:block md:w-auto row-cell flex justify-end">
                          <span className={`!font-medium inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-xs ${row.status.color} ${row.status.textColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${row.status.dot}`}></span>
                            {row.status.text}
                          </span>
                        </div>
                        <div className="hidden md:block md:w-auto font-poppins text-sm text-black truncate row-cell">{row.date}</div>
                        
                        {/* Mobile Layout */}
                        <div className="md:hidden w-full">
                          {/* Top row: Type/ID on left, Status on right */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                              <span className="font-poppins text-sm font-normal text-black">{row.type}</span>
                              <span className="font-poppins text-sm text-[#2563eb] underline">{row.id}</span>
                            </div>
                            <div className="row-cell flex-shrink-0">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[37px] font-poppins text-xs ${row.status.color} ${row.status.textColor} mobile-status-badge`}>
                                <span className={`w-2 h-2 rounded-full ${row.status.dot}`}></span>
                                {row.status.text}
                              </span>
                            </div>
                          </div>
                          
                          {/* Middle row: Cargo on left, Value on right */}
                          <div className="flex justify-between items-center mb-4">
                            <div className="font-poppins text-sm text-gray-700">{row.cargo}</div>
                            <div className="font-poppins text-sm font-normal text-black">{row.value}</div>
                          </div>
                          
                          {/* Bottom row: Date on left, full-width button */}
                          <div className="flex flex-col gap-2">
                            <div className="font-poppins text-sm text-gray-600">{row.date}</div>
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
                        <div className="flex justify-end hidden md:flex md:w-auto row-cell">
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
              <div className="flex max-h-[93%] flex-col gap-2 right">
                {/* Welcome Widget */}
                <div className="relative h-[380px] rounded-2xl overflow-hidden w-full welcome-widget hover:shadow-lg transition-shadow duration-300">
                  <img 
                    src="https://c.animaapp.com/mjiggi0jSqvoj5/img/frame-76.png" 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-10 p-4 h-full flex flex-col action-content">
                    <h2 className="font-montserrat text-[20px] font-normal text-white mb-3 welcome-title">
                      Welcome back, Lucas!
                    </h2>
                    <p className="font-montserrat text-[14px] font-normal text-white mb-auto max-w-[224px] welcome-subtitle action-subtitle">
                      Everything's under control — let's make this day productive.
                    </p>
                    
                    <div className="flex items-end justify-between gap-[82px] action-buttons">
                      <h3 className="font-montserrat text-[32px] font-normal text-white leading-[38px] tracking-[0.64px] max-w-[224px] cta-title">
                        Get Your New Quote Instantly
                      </h3>
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-84.png" 
                        alt="Arrow" 
                        className="w-[42px] h-[42px] hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Quote Conversion Rate */}
                <ConversionChart />


                
              </div>
            </main>
          </div>

        

          <style jsx>{`
           
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
                        grid-template-columns: 76.5% 23%;
                }
                
                .right {
                    display: flex;
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
                    width: 100%;
                    position: relative;
                    justify-content: space-between;
                    display: flex;
                    flex-direction: column;
                }
                
                .navigation {
                    display: none;
                }
                
               
                
              
                .welcome-widget {
                    height: 260px;
                    width: 100%;
                }
                
                .showin-result-ittle-info {
                    display: none;
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
            .main-content {
                display: flex;
                flex-direction: column-reverse;
            }
                    .right.jsx-d116e6d599512e01 {
        gap: 16px;
        display: flex;
        flex-direction: row;
    }
        .welcome-widget, .quote-conversion.performance-section.jsx-be524dc674521ed {
                    height: 200px;  
          width: 49%;
        }
                .right {
        gap: 16px;
        display: flex;
        flex-direction: row;
    }
                 .action-center, .conv-rate {
                    display: none;
                }
                .rate-mob-hid {
                  display: none !important;
                }
                .quote-conversion.performance-section {
                    width: 62%;
                    min-height: 170px;
                }

                    .action-content {
                        justify-content: space-between;
                    }
                
                .action-title, .section-title {
                    font-size: 16px;
                }
                
                .action-subtitle {
                    margin-bottom: 0px;
                }
                
                .metrics-grid {
                    display: flex;
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
                .recent-activity button {
                    padding: 6px 12px;
                    font-size: 12px;
                }
                    .recent-activity h3 {
                        font-size: 16px;
                    }
                .table-rows-cont {
                  padding: 0 !important;
                  margin: 0 !important;
                  width: 101%;
                }
                  .welcome-widget {
                   display: none;
                  }
                   .quote-conversion.performance-section {
        width: 100%;
          }
            .metrics-grid {
        flex-wrap: wrap;
    }
                .activity-section {
                   border: none !important;
                           background: transparent;
        padding: 0;
                }
                .metric-value, .metric-value2 {
                    font-size: 38px;
                    font-weight: 300 !important;
                }

                .metrics-grid {
                            gap: 16px 32px;
        justify-content: flex-start;
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

    /* Mobile action button styles for Dashboard page */
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

/* Mobile specific styles for Dashboard page */
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
.tab-item {
            margin: 0;
    background-color: #f9f9f6;
    border: none;
    border-bottom: 1px solid #d1d1d140;
}
  .tab-item:hover  {
            background-color: #f6f6ecff;
    }
@media screen and (max-width: 768px) {
.sub-header-metric {
    margin-top: -8px !important;
    font-size: 10px !important;
    width: 74% !important;
}
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
    margin-bottom: 12px;
  }
}
          `}</style>
        </div>
      </div>
    </DashboardLayout>
  )
}