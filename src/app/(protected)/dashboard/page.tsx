'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'

interface User {
  id: string
  email?: string
  created_at?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3d62]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f3f6] font-montserrat">
      {/* Fixed width container */}
      <div className="max-w-[88%] sm:max-w-[96%] mx-auto pt-4">
        {/* Header */}
        <header className="flex justify-between items-center h-[68px] mb-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://c.animaapp.com/mjiggi0jSqvoj5/img/layer-1-1.png" 
              alt="Cargo Guard Logo" 
              className="w-[22px] h-[29px] object-cover"
            />
            <h2 className="font-montserrat text-[18px] sm:text-[24px] font-normal text-[#0a3d62]">
  Cargo Guard
</h2>

          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            <div className="w-[54px] h-[54px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/search-interface-symbol-1.png" 
                alt="Search"
                className="w-[18px] h-[18px] object-cover"
              />
            </div>
            
            <div className="h-[54px] flex items-center justify-center px-9 bg-white rounded-lg">
              <a href="#" className="font-inter text-[16px] font-normal text-black no-underline">
                Dashboard
              </a>
            </div>
            
            <div className="h-[54px] flex items-center justify-center px-9 bg-[#f7f7f7] rounded-lg border border-white/22">
              <a href="#" className="font-inter text-[16px] font-normal text-black no-underline">
                Quotes
              </a>
            </div>
            
            <div className="h-[54px] flex items-center justify-center px-9 bg-[#f7f7f7] rounded-lg border border-white/22">
              <a href="#" className="font-inter text-[16px] font-normal text-black no-underline">
                Shipments
              </a>
            </div>
            
            <div className="h-[54px] flex items-center justify-center px-9 bg-[#f7f7f7] rounded-lg border border-white/22">
              <a href="#" className="font-inter text-[16px] font-normal text-black no-underline">
                Documents
              </a>
            </div>
          </nav>
          
          {/* Header Actions */}
          <div className="flex items-center gap-2.5">
            <div className="w-[44px] h-[44px] sm:w-[54px] sm:h-[54px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center relative xl:hidden">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/bell-1.png" 
                alt="Notifications"
                className="w-[24px]"
              />
              <span className="absolute top-4 right-[19px] bg-[#f86464] w-[6px] h-[6px] rounded-full"></span>
            </div>
            
            <div className="hidden xl:flex w-[54px] h-[54px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center relative">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/bell-1.png" 
                alt="Notifications"
                className="w-[24px]"
              />
              <span className="absolute top-4 right-[19px] bg-[#f86464] w-[6px] h-[6px] rounded-full"></span>
            </div>
            
            <div className="hidden xl:block">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/898887d89ce7b428ae8824c896050271-1.png" 
                alt="User Avatar"
                className="w-[54px] h-[54px] rounded-lg object-cover"
              />
            </div>
            
            <div className="xl:hidden">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/898887d89ce7b428ae8824c896050271-1.png" 
                alt="User Avatar"
                className="w-[44px] h-[44px] rounded-lg object-cover"
              />
            </div>
            
            {/* Hamburger Menu Button */}
            <button 
              className="xl:hidden w-[44px] h-[44px] bg-[#f7f7f7] rounded-lg border border-white/22 flex flex-col justify-center items-center gap-1 p-2.5 cursor-pointer"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
            
            {/* Desktop User Info */}
            <div className="hidden xl:flex items-center gap-4 ml-4">
              {/* <span className="text-gray-700">{user?.email}</span> */}
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={closeMobileMenu}
          ></div>
          <div className={`absolute top-0 right-0 w-[300px] h-full bg-white p-5 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-end mb-7">
              <button 
                className="w-[44px] h-[44px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center cursor-pointer text-2xl text-black"
                onClick={closeMobileMenu}
              >
                ×
              </button>
            </div>
            
            <div className="mb-5">
              <div className="w-full h-[44px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center px-3">
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="flex-1 border-none bg-transparent font-inter text-sm text-black outline-none"
                />
                <img 
                  src="https://c.animaapp.com/mjiggi0jSqvoj5/img/search-interface-symbol-1.png" 
                  alt="Search"
                  className="w-[18px] h-[18px]"
                />
              </div>
            </div>
            
            <nav className="flex flex-col gap-3 mb-7">
              <a href="#" className="px-4 py-3 font-inter text-base text-black no-underline rounded-lg bg-[#f7f7f7]">
                Dashboard
              </a>
              <a href="#" className="px-4 py-3 font-inter text-base text-black no-underline rounded-lg hover:bg-gray-100 transition-colors">
                Quotes
              </a>
              <a href="#" className="px-4 py-3 font-inter text-base text-black no-underline rounded-lg hover:bg-gray-100 transition-colors">
                Shipments
              </a>
              <a href="#" className="px-4 py-3 font-inter text-base text-black no-underline rounded-lg hover:bg-gray-100 transition-colors">
                Documents
              </a>
            </nav>
            
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-2 px-4 py-3 bg-[#f7f7f7] border border-white/22 rounded-lg font-inter text-sm text-black cursor-pointer hover:bg-gray-100 transition-colors">
                <img 
                  src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-118-1.svg" 
                  alt="Quote"
                  className="w-5 h-5"
                />
                Get New Quote
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-[#f7f7f7] border border-white/22 rounded-lg font-inter text-sm text-black cursor-pointer hover:bg-gray-100 transition-colors">
                <img 
                  src="https://c.animaapp.com/mjiggi0jSqvoj5/img/upload-1.png" 
                  alt="Upload"
                  className="w-5 h-5"
                />
                Upload Document
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-[#f7f7f7] border border-white/22 rounded-lg font-inter text-sm text-black cursor-pointer hover:bg-gray-100 transition-colors">
                <img 
                  src="https://c.animaapp.com/mjiggi0jSqvoj5/img/upload-1-1.png" 
                  alt="Renew"
                  className="w-5 h-5"
                />
                Renew Policy
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Header for Activity Section */}
        <div className="flex gap-2 items-center mb-4 xl:hidden">
          <img src="/dashboard/hashtag.svg" alt="" className="w-5 h-5" />
          <h4 className="font-normal text-base">Dashboard</h4>
        </div>

        {/* Main Content Grid - Exact same as CSS */}
        <main className="grid grid-cols-1 xl:grid-cols-[75%_25%] gap-4 items-stretch main-content">
          {/* Left Column - 75% */}
          <div className="flex flex-col gap-4">
            {/* Performance Overview */}
            <section className="bg-[#fafcff]/80 rounded-2xl p-6 h-auto performance-section">
              <div className="flex justify-between items-start mb-7 section-header">
                <div>
                  <h2 className="font-montserrat text-[20px] font-medium text-black section-title">
                    Performance Overview
                  </h2>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51">
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
              
              {/* Metrics Grid - Exact spacing */}
              <div className="flex justify-around flex-wrap xl:flex-nowrap gap-8 xl:gap-2 metrics-grid">
                {/* Total Insured Amount */}
                <div className="w-[43%] xl:w-[12%] metric-card-item">
                  <div className="relative">
                    <div className="font-montserrat text-[46px] xl:text-[46px] font-normal text-black flex items-baseline relative metric-value">
                      <span className="text-black tracking-[1.28px]">84.</span>
                      <span className="text-[#c7c7c7] tracking-[1.28px]">5k</span>
                      <span className="absolute -left-5 top-3 text-[12px]">$</span>
                    </div>
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
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
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
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
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
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
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
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
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Required Document Uploads
                  </p>
                </div>
              </div>
            </section>

            {/* Mobile Activity Header */}
            <div className="xl:hidden flex items-center justify-between activity-mobile-header activity-section-mob-hd">
              <h3 className="text-lg font-normal">Recent Activity</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <img key={num} src={`dashboard/btn/0${num}.svg`} alt="" className="w-[44px] h-[44px] p-0 border-none"  />
                ))}
              </div>
            </div>

            {/* Recent Activity Table */}
            <section className="activity-section bg-[#fafcff]/80 rounded-2xl p-6 xl:p-6">
              {/* Desktop Filters */}
              <div className="hidden xl:flex justify-between items-center mb-6 activity-header activity-filters">
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
                  <div className="w-36 h-[38px] border-b border-[#c7c7c7]/51 flex items-center justify-between px-3 py-2">
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
                    <div key={idx} className="h-[38px] flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51 font-montserrat text-xs text-[#7b7b7b]">
                      <span>{text}</span>
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                        alt="Dropdown"
                        className="w-2 h-1"
                      />
                    </div>
                  ))}
                  
                  <button className="bg-[#2563eb] text-white px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#1d4ed8] transition-colors">
                    Get New Quote
                  </button>
                </div>
              </div>
              
              {/* Desktop Table Header */}
              <div className="hidden xl:grid grid-cols-[120px_120px_1fr_200px_150px_140px] gap-2 pb-2 border-b border-gray-200 mb-2 table-header">
                {['Type', 'ID', 'Cargo / Value', 'Status / Due Date', 'Last Update', 'Action'].map((header, idx) => (
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

              {/* Table Rows */}
              <div className="space-y-2 activity-table">
                {[
                  {
                    type: 'Quote',
                    id: 'Q-005',
                    cargo: 'Jewelry / 15,400.00',
                    status: { text: 'Pending Approval', color: 'bg-[#cbd03c]/10', dot: 'bg-[#cbd03c]', textColor: 'text-[#cbd03c]' },
                    date: 'Oct 25, 9:10PM',
                    button: { text: 'Approve Quote', variant: 'primary' }
                  },
                  {
                    type: 'Policy',
                    id: 'P-021',
                    cargo: 'Textiles / 3,700.00',
                    status: { text: 'Document Missing', color: 'bg-[#f97316]/10', dot: 'bg-[#f97316]', textColor: 'text-[#f97316]' },
                    date: 'Oct 20, 6:30PM',
                    button: { text: 'Upload Docs', variant: 'secondary' }
                  },
                  {
                    type: 'Policy',
                    id: 'P-020',
                    cargo: 'Heavy Machinery / 48,400.00',
                    status: { text: 'Expires 15 Nov 2025', color: 'bg-[#eab308]/10', dot: 'bg-[#eab308]', textColor: 'text-[#eab308]' },
                    date: 'Oct 15, 4:20AM',
                    button: { text: 'Renew Policy', variant: 'secondary' }
                  },
                  {
                    type: 'Policy',
                    id: 'P-019',
                    cargo: 'Electronics / 8,000.00',
                    status: { text: 'Active', color: 'bg-[#16a34a]/10', dot: 'bg-[#16a34a]', textColor: 'text-[#16a34a]' },
                    date: 'Oct 21, 2:30PM',
                    button: { text: 'Download Cert', variant: 'secondary' }
                  },
                  {
                    type: 'Quote',
                    id: 'Q-007',
                    cargo: 'Food Products / 1,100.00',
                    status: { text: 'Declined', color: 'bg-[#8ea0b0]/10', dot: 'bg-[#8ea0b0]', textColor: 'text-[#8ea0b0]' },
                    date: 'Sept 28, 9:30PM',
                    button: { text: 'View Details', variant: 'secondary' }
                  }
                ].map((row, idx) => (
                  <div key={idx} className="xl:grid xl:grid-cols-[120px_120px_1fr_200px_150px_140px] gap-2 p-3 xl:p-3 bg-[#f8fafd] xl:bg-[#f8fafd] rounded-lg xl:rounded-lg flex flex-wrap items-center table-row">
                    {/* Mobile/Desktop Layout */}
                    <div className="w-[45%] xl:w-auto font-poppins text-sm text-black truncate row-cell">{row.type}</div>
                    <div className="w-[45%] xl:w-auto font-poppins text-sm text-[#2563eb] underline truncate row-cell id-link">{row.id}</div>
                    <div className="w-[45%] xl:w-auto font-poppins text-sm text-black truncate mt-2 xl:mt-0 row-cell">{row.cargo}</div>
                    <div className="w-[45%] xl:w-auto mt-2 xl:mt-0 row-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-xs ${row.status.color} ${row.status.textColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.status.dot}`}></span>
                        {row.status.text}
                      </span>
                    </div>
                    <div className="w-[45%] xl:w-auto font-poppins text-sm text-black truncate mt-2 xl:mt-0 row-cell">{row.date}</div>
                    <div className="w-full xl:w-auto mt-2 xl:mt-0 row-cell">
                      <button className={`h-9 px-4 rounded-lg font-poppins text-sm font-normal transition-colors w-full xl:w-[140px] ${
                        row.button.variant === 'primary' 
                          ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]' 
                          : 'bg-transparent text-[#374151] border border-[#e3e6ea] hover:bg-[#f3f4f6]'
                      }`}>
                        {row.button.text}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - 25% with exact 400px on desktop */}
          <div className="flex flex-col gap-4 right">
            {/* Welcome Widget */}
            <div className="relative h-[449px] rounded-2xl overflow-hidden w-full welcome-widget">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/frame-76.png" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 p-6 h-full flex flex-col action-content">
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
                    className="w-[42px] h-[42px]"
                  />
                </div>
              </div>
            </div>

            {/* Action Center */}
            <div className="action-center bg-[#fafcff]/80 rounded-2xl p-6 relative overflow-hidden h-[203px] w-full">
              <div 
                className="absolute inset-0 w-full h-full action-bg"
                style={{
                  backgroundImage: 'url(https://c.animaapp.com/mjiggi0jSqvoj5/img/vector-148.svg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
              <div className="relative z-10 h-full flex action-content">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-montserrat text-[18px] font-medium text-black mb-1 action-title">
                      Action Center
                    </h3>
                    <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] max-w-[159px] action-subtitle">
                      Your latest quotes and policies. Act now on pending items to proceed.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 action-buttons">
                    <button className="flex items-center gap-2 px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg backdrop-blur font-montserrat text-[16px] font-normal text-[#1e293b] hover:bg-white/30 transition-colors w-full">
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-118-1.svg" 
                        alt="Quote"
                        className="w-4 h-4"
                      />
                      <span className="text-[14px]">Get New Quote</span>
                    </button>
                    
                    <button className="flex items-center gap-2 px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg backdrop-blur font-montserrat text-[16px] font-normal text-[#1e293b] hover:bg-white/30 transition-colors w-full">
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/upload-1.png" 
                        alt="Upload"
                        className="w-4 h-4"
                      />
                      <span className="text-[14px]">Upload Document</span>
                    </button>
                    
                    <button className="flex items-center gap-2 px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg backdrop-blur font-montserrat text-[16px] font-normal text-[#1e293b] hover:bg-white/30 transition-colors w-full">
                      <img 
                        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/upload-1-1.png" 
                        alt="Renew"
                        className="w-4 h-4"
                      />
                      <span className="text-[14px]">Renew Policy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Conversion Rate */}
            <div className="bg-[#fafcff]/80 rounded-2xl p-6 h-auto min-h-[203px] w-full quote-conversion performance-section">
              <div className="mb-4">
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
                
             <div className="rate-mob-hid hidden md:block text-right mt-4">
  <div className="text-[13px] text-[#C8C8C8]">Conversion Rate</div>
  <div className="text-[26px] text-black font-normal">65</div>
</div>
              </div>
              
              {/* Mobile conversion rate */}
              <div className="conv-rate xl:hidden text-right mt-4">
                <div className="text-[13px] text-[#C8C8C8]">Conversion Rate</div>
                <div className="text-[26px] text-black font-normal">65</div>
              </div>
            </div>
          </div>
        </main>
      </div>

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
            background-color: #f0f0f0;
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

        @media screen and (max-width: 1336px) {
            .activity-header {
                display: block;
            }
            
            .activity-filters {
                justify-content: flex-end;
            }
            
            .action-content {
                display: block;
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
                width: 36%;
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
                width: 36%;
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
                min-height: 195px;
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
      `}</style>
    </div>
  )
}