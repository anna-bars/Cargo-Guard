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
export default function QuotesPage() {
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
              <div className="max-h-[87.5%] flex flex-col gap-4">
                {/* Mobile Activity Header */}
                <div className="xl:hidden flex items-center justify-between activity-mobile-header activity-section-mob-hd">
                  <h3 className="text-lg font-normal">Recent Activity</h3>
                  <div className="flex">
                    {[1, 2, 3, 4].map((num) => (
                      <img key={num} src={`dashboard/btn/0${num}.svg`} alt="" className="w-[44px] h-[44px] p-0 border-none" />
                    ))}
                  </div>
                </div>

                {/* Recent Activity Table */}
                <section className="block-2 flex flex-col max-h-[88%] activity-section bg-[#fafcff]/80 rounded-2xl p-4 xl:p-4">
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
              <div className="flex max-h-[87.5%] flex-col gap-4 right">
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
                      <h3 className="font-montserrat text-[32px] font-medium text-white leading-[38px] tracking-[0.64px] max-w-[224px] cta-title">
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
                <div className="bg-[#fafcff]/80 rounded-2xl p-4 h-auto min-h-[203px] w-full quote-conversion performance-section hover:shadow-sm transition-shadow duration-300">
                  <div className="mb-[24px]">
                    <h3 className="font-montserrat text-[18px] font-medium text-black action-title">
                      Quote Conversion Rate
                    </h3>
                    <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7]">
                      This Month
                    </p>
                  </div>
                  
                  <div className="block justify-between items-end">
                    <div className="w-full">
                      <div className="flex justify-between mb-1.5">
                        <div>
                          <div className="text-[13px] text-[#C8C8C8]">Approved</div>
                          <div className="text-[15px] mt-0.5">17</div>
                        </div>
                        <div>
                          <div className="text-[13px] text-[#C8C8C8]">Declined</div>
                          <div className="text-[15px] mt-0.5">9</div>
                        </div>
                        <div>
                          <div className="text-[13px] text-[#C8C8C8]">Expired</div>
                          <div className="text-[15px] mt-0.5">0</div>
                        </div>
                      </div>
                      
                      <div className="flex items-end gap-1 overflow-hidden">
                        {/* Top bars */}
                        <div className="flex gap-1 items-baseline">
                          {Array.from({ length: 22 }).map((_, i) => (
                            <div 
                              key={`top-${i}`} 
                              className={`w-[3px] bg-[#bed5f8] ${i === 0 || i === 21 ? 'h-8' : 'h-5'}`}
                            />
                          ))}
                        </div>
                        
                        {/* Bottom bars */}
                        <div className="flex gap-1 items-baseline">
                          {Array.from({ length: 44 }).map((_, i) => (
                            <div 
                              key={`bottom-${i}`} 
                              className="w-[3px] h-1 bg-[#f3f3f6]"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* CSS Styles remain exactly the same */}
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
          `}</style>
        </div>
      </div>
    </DashboardLayout>
  )
}