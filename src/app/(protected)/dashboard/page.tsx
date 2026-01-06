'use client'

import DashboardLayout from '../DashboardLayout'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { ConversionChart } from '../../components/charts/ConversionChart'
import { RecentActivityTable } from '@/app/components/tables/ActivityTable'

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
            <section className="
              border border-[#d1d1d1]/33 bg-[#fafaf7]/80 rounded-2xl p-4 h-auto
              max-[768px]:p-4
            ">
              <div className="flex justify-between items-start mb-2 
                max-[1336px]:items-center
                max-[1280px]:items-center
                max-[1024px]:items-center
              ">
                <div>
                  <h2 className="
                    font-montserrat text-[16px] font-normal text-black
                    max-[1336px]:text-[16px]
                    max-[1280px]:text-[16px]
                    max-[1024px]:text-[14px]
                  ">
                    Performance Overview
                  </h2>
                </div>
                <div className="
                  flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51 
                  hover:border-[#a0a0a0]/51 transition-colors duration-300
                ">
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
              <div className="
                flex justify-around xl:flex-nowrap gap-8 xl:gap-2 
                max-[1336px]:justify-around max-[1336px]:gap-2
                max-[1280px]:justify-around max-[1280px]:gap-2
                max-[1024px]:flex max-[1024px]:gap-8 max-[1024px]:px-5
                max-[768px]:flex-wrap max-[768px]:gap-4 max-[768px]:gap-y-8 max-[768px]:justify-start
              ">
                {/* Total Insured Amount */}
                <div className="
                  w-[43%] xl:w-[12%]
                  max-[1336px]:w-[12%]
                  max-[1280px]:w-[12%]
                  max-[1024px]:w-[43%]
                ">
                  <div className="relative">
                    <div className="
                      font-montserrat text-[46px] xl:text-[46px] font-normal text-black 
                      flex items-baseline relative
                      max-[1336px]:text-[46px]
                      max-[1280px]:text-[46px]
                      max-[768px]:text-[38px] max-[768px]:font-light
                    ">
                      <span className="text-black tracking-[1.28px]">84.</span>
                      <span className="text-[#c7c7c7] tracking-[1.28px]">5k</span>
                      <span className="absolute -left-5 top-3 text-[12px]">$</span>
                    </div>
                  </div>
                  <p className="
                    font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1
                    max-[768px]:mt-[-8px] max-[768px]:text-[10px] max-[768px]:w-[74%]
                  ">
                    Total Insured Amount
                  </p>
                </div>
                
                {/* Active Policies */}
                <div className="
                  w-[43%] xl:w-[12%]
                  max-[1336px]:w-[12%]
                  max-[1280px]:w-[12%]
                  max-[1024px]:w-[43%]
                ">
                  <div className="relative">
                    <div className="
                      font-montserrat relative w-fit text-[46px] xl:text-[46px] font-normal text-black 
                      flex items-baseline relative
                      max-[1336px]:text-[46px]
                      max-[1280px]:text-[46px]
                      max-[768px]:text-[38px] max-[768px]:font-light
                    ">
                      <span className="text-black tracking-[1.28px]">8.</span>
                      <span className="text-[#c7c7c7] tracking-[1.28px]">47</span>
                      <span className="absolute -left-5 top-3 text-[12px]">%</span>
                      <span className="absolute -right-5 top-3 text-[12px]">
                        <img src="/dashboard/top-arrow.svg" alt="" />
                      </span>
                    </div>
                  </div>
                  <p className="
                    font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1
                    max-[768px]:mt-[-8px] max-[768px]:text-[10px] max-[768px]:w-[74%]
                  ">
                    Active Policies
                  </p>
                </div>
                
                {/* Quotes Awaiting Approval */}
                <div className="
                  w-[43%] xl:w-[12%]
                  max-[1336px]:w-[12%]
                  max-[1280px]:w-[12%]
                  max-[1024px]:w-[43%]
                ">
                  <div className="
                    font-montserrat relative w-fit text-[46px] xl:text-[46px] font-normal text-black 
                    flex items-baseline
                    max-[1336px]:text-[46px]
                    max-[1280px]:text-[46px]
                    max-[768px]:text-[38px] max-[768px]:font-light
                  ">
                    <span className="text-black tracking-[1.28px]">3.</span>
                    <img 
                      className="w-7 ml-1.5" 
                      src="/dashboard/arrow.svg" 
                      alt="Arrow" 
                      style={{ width: '28px', marginLeft: '6px' }}
                    />
                    <span className="absolute -left-5 top-3 text-[12px]">%</span>
                    <span className="absolute -right-5 top-3 text-[12px]">
                      <img src="/dashboard/top-arrow.svg" alt="" />
                    </span>
                  </div>
                  <p className="
                    font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1
                    max-[768px]:mt-[-8px] max-[768px]:text-[10px] max-[768px]:w-[74%]
                  ">
                    Quotes Awaiting Approval
                  </p>
                </div>
                
                {/* Contracts Due to Expire */}
                <div className="
                  w-[43%] xl:w-[12%]
                  max-[1336px]:w-[12%]
                  max-[1280px]:w-[12%]
                  max-[1024px]:w-[43%]
                ">
                  <div className="
                    font-montserrat relative w-fit text-[46px] xl:text-[46px] font-normal text-black 
                    flex items-baseline
                    max-[1336px]:text-[46px]
                    max-[1280px]:text-[46px]
                    max-[768px]:text-[38px] max-[768px]:font-light
                  ">
                    <span className="text-black tracking-[1.28px]">2.</span>
                    <img 
                      className="w-7 ml-1.5" 
                      src="/dashboard/arrow.svg" 
                      alt="Arrow"
                      style={{ width: '28px', marginLeft: '6px' }}
                    />
                    <span className="absolute -left-5 top-3 text-[12px]">%</span>
                    <span className="absolute -right-5 top-3 text-[12px]">
                      <img src="/dashboard/top-arrow.svg" alt="" />
                    </span>
                  </div>
                  <p className="
                    font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1
                    max-[768px]:mt-[-8px] max-[768px]:text-[10px] max-[768px]:w-[74%]
                  ">
                    Contracts Due to Expire
                  </p>
                </div>
                
                {/* Required Document Uploads */}
                <div className="
                  w-[43%] xl:w-[12%]
                  max-[1336px]:w-[12%]
                  max-[1280px]:w-[12%]
                  max-[1024px]:w-[43%]
                ">
                  <div className="
                    font-montserrat relative w-fit text-[46px] xl:text-[46px] font-normal text-black 
                    flex items-baseline
                    max-[1336px]:text-[46px]
                    max-[1280px]:text-[46px]
                    max-[768px]:text-[38px] max-[768px]:font-light
                  ">
                    <span className="text-black tracking-[1.28px]">1.</span>
                    <img 
                      className="w-7 ml-1.5" 
                      src="/dashboard/arrow.svg" 
                      alt="Arrow"
                      style={{ width: '28px', marginLeft: '6px' }}
                    />
                    <span className="absolute -left-5 top-3 text-[12px]">%</span>
                    <span className="absolute -right-5 top-3 text-[12px]">
                      <img src="/dashboard/top-arrow.svg" alt="" />
                    </span>
                  </div>
                  <p className="
                    font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1
                    max-[768px]:mt-[-8px] max-[768px]:text-[10px] max-[768px]:w-[74%]
                  ">
                    Required Document Uploads
                  </p>
                </div>
              </div>
            </section>

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
            max-[1280px]:flex max-[1280px]:flex-col max-[1280px]:gap-2 max-[1280px]:mb-2
            max-[1024px]:min-h-auto max-[1024px]:max-h-none
            max-[1024px]:flex-row max-[1024px]:gap-2
            max-[768px]:flex-row max-[768px]:overflow-x-auto max-[768px]:overflow-y-hidden
            max-[768px]:pb-4 max-[768px]:gap-3
          ">
            {/* Welcome Widget */}
            <div className="
              relative rounded-2xl overflow-hidden w-full transition-shadow duration-300 
              flex-grow min-h-[calc(41%-4px)] xl:flex-[0_0_38%] xl:min-h-auto xl:h-auto
              max-[1336px]:h-[352px] max-[1336px]:w-full
              max-[1280px]:h-auto max-[1280px]:min-h-[260px] max-[1280px]:w-full max-[1280px]:flex-grow
              max-[1024px]:w-[49%] max-[1024px]:min-h-[180px] max-[1024px]:max-h-[200px] max-[1024px]:flex-shrink
              max-[768px]:flex-shrink-0 max-[768px]:w-[85%] max-[768px]:min-h-[250px] 
              max-[768px]:max-h-[280px]
            ">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/frame-76.png" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 p-4 h-full flex flex-col 
                max-[1336px]:h-full
                max-[1280px]:h-full
                max-[1024px]:justify-between
              ">
                <h2 className="
                  font-montserrat text-[20px] font-normal text-white mb-0
                  max-[1336px]:text-[20px] max-[1336px]:mb-1.5
                  max-[1280px]:text-[18px] max-[1280px]:mb-1.5
                  max-[480px]:text-[18px]
                ">
                  Welcome back, Lucas!
                </h2>
                <p className="
                  font-montserrat text-[14px] font-normal text-white/85 mb-auto max-w-[224px]
                  max-[1336px]:mb-auto max-[1336px]:max-w-full
                  max-[1280px]:mb-auto max-[1280px]:max-w-full max-[1280px]:text-[12px]
                  max-[1024px]:mb-0 max-[1024px]:max-w-none max-[1024px]:text-[12px]
                ">
                  Everything's under control — let's make this day productive.
                </p>
                
                <div className="flex items-end justify-between gap-[40px] 
                  max-[1336px]:max-w-full max-[1336px]:gap-[40px]
                  max-[1280px]:max-w-full
                  max-[1024px]:max-w-full
                ">
                  <h3 className="
                    font-montserrat text-[24px] font-medium text-white leading-[27px] 
                    tracking-[0.64px] max-w-[224px]
                    max-[1336px]:text-[26px] max-[1336px]:font-medium max-[1336px]:leading-[33px] 
                    max-[1336px]:tracking-[0.64px] max-[1336px]:max-w-[224px]
                    max-[1280px]:text-[22px] max-[1280px]:leading-[28px] max-[1280px]:max-w-[224px]
                    max-[480px]:text-[20px] max-[480px]:leading-[24px]
                  ">
                    Get Your New Quote Instantly
                  </h3>

                  <img 
                    src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-84.png" 
                    alt="Arrow" 
                    className="
                      outline-[4px] outline-[#f4f4f1] rounded-full w-[42px] h-[42px] 
                      hover:scale-102 transition-transform duration-300
                    "
                  />
                </div>
              </div>
            </div>

            {/* Quote Conversion Rate */}
            <div className="
              flex-grow min-h-[calc(30%-4px)] xl:flex-[0_0_30%] xl:min-h-auto xl:h-auto
              max-[1336px]:flex-grow max-[1336px]:min-h-auto max-[1336px]:h-auto
              max-[1280px]:flex-grow max-[1280px]:min-h-auto max-[1280px]:h-auto max-[1280px]:block
              max-[1024px]:w-full max-[1024px]:min-h-[180px] max-[1024px]:max-h-[200px]
              max-[1024px]:block
              max-[768px]:flex-shrink-0 max-[768px]:w-[85%] max-[768px]:min-h-[250px] 
              max-[768px]:max-h-[280px]
            ">
              <ConversionChart />
            </div>

            {/* Middle Widget */}
            <div className="
              relative w-full font-montserrat flex-grow min-h-[calc(29%-4px)] 
              xl:flex-[0_0_27%] xl:min-h-auto xl:h-auto
              max-[1336px]:flex-grow max-[1336px]:min-h-auto max-[1336px]:h-auto
              max-[1280px]:flex-grow max-[1280px]:min-h-auto max-[1280px]:h-auto max-[1280px]:block
              max-[1024px]:w-[49%] max-[1024px]:min-h-[180px] max-[1024px]:max-h-[200px]
              max-[1024px]:block
              max-[768px]:flex-shrink-0 max-[768px]:w-[85%] max-[768px]:min-h-[250px] 
              max-[768px]:max-h-[280px]
            ">
              {/* Background */}
              <div className="absolute top-0 left-0 w-full h-full bg-[#fafcffcc] rounded-xl"></div>
              
              {/* Content */}
              <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[#3c3c3c] text-[16px] font-normal tracking-[0.24px] w-[60%] leading-tight">
                    High-value cargo insured this month
                  </h3>

                  <div className="relative">
                    <span className="absolute -left-1 top-0 text-white/84 text-[4px] tracking-[0.08px]">$</span>
                    <div className="bg-[#71a3ef] rounded-[20px] px-2 py-0.5 flex items-center justify-center">
                      <span className="text-white text-xs tracking-[0.24px]">
                        <span className="tracking-[0.04px]">MTD · 62,</span>
                        <span className="text-white/80 tracking-[0.04px]">3k</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Percentage Section */}
                  <div className="flex mb-3 items-end justify-start">
                    <div className="flex items-start gap-0.5 mb-0.5">
                      <span className="text-black text-[42px] tracking-[0.84px] leading-none">
                        <span className="tracking-[0.54px]">75.</span>
                        <span className="text-[#c7c7c7] tracking-[0.54px]">55</span>
                      </span>
                      <span className="text-black text-[7px] tracking-[0.14px] mt-[9px]">%</span>
                    </div>
                    
                    <p className="text-[#c7c7c7] text-xs tracking-[0.24px] text-right leading-tight w-[50%] text-left mb-1">
                      of total insured value this month
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="relative h-5">
                      <div className="absolute top-1 left-0 w-[75%] h-3 bg-gradient-to-r from-[#bfd5f8] to-[#669cee] rounded-l-[40px] rounded-r-none"></div>
                      <div className="absolute top-1 left-[75%] w-[25%] h-3 bg-gradient-to-r from-[#6da1ef4f] to-[#f6f8fa40] rounded-r-[40px] rounded-l-none"></div>
                      <img 
                        className="absolute top-[-0.5px] left-[72%] w-[20px] h-[20px]" 
                        src="https://c.animaapp.com/mk1qdxa5LsxC7P/img/polygon-1.svg" 
                        alt="Progress marker"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}