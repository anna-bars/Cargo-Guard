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
              <div className="max-h-[89%] flex flex-col gap-2">
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

                <RecentActivityTable 
        title="Recent Activity"
        showMobileHeader={false}
      />
              </div>

              {/* Right Column - 25% */}
              <div className="flex max-h-[89%] flex-col gap-2 right">
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
                    width: 80%;
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
        gap: 8px;
        display: flex;
        flex-direction: row;
    }
        .welcome-widget, .quote-conversion.performance-section.jsx-be524dc674521ed {
                            max-height: 100% !important
          width: 49%;
        }
                .right {
        gap: 8px;
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