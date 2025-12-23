'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'
import Script from 'next/script'

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
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.classList.remove('menu-open')
    const hamburgerBtn = document.getElementById('hamburgerBtn')
    if (hamburgerBtn) hamburgerBtn.classList.remove('active')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3d62] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f3f6]">
      <div className="max-w-[96%] mx-auto pt-4">
        {/* Header / Toolbar */}
        <header className="flex justify-between items-center h-[68px] mb-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://c.animaapp.com/mjiggi0jSqvoj5/img/layer-1-1.png" 
              alt="Cargo Guard Logo" 
              className="w-[22px] h-[29px] object-cover"
            />
            <h1 className="font-montserrat text-[24px] font-normal text-[#0a3d62] hidden lg:block">
              Cargo Guard
            </h1>
          </div>
          
          {/* Desktop Navigation (hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="w-[54px] h-[54px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center">
              <div className="search-icon flex">
                <img 
                  src="https://c.animaapp.com/mjiggi0jSqvoj5/img/search-interface-symbol-1.png" 
                  alt="Search"
                  className="w-[18px] h-[18px] object-cover"
                />
              </div>
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
            <div className="w-[54px] h-[54px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center relative lg:hidden">
              <div className="notification-icon flex">
                <img 
                  src="https://c.animaapp.com/mjiggi0jSqvoj5/img/bell-1.png" 
                  alt="Notifications"
                  className="w-[24px]"
                />
                <span className="absolute top-4 right-[19px] bg-[#f86464] w-[6px] h-[6px] rounded-full"></span>
              </div>
            </div>
            
            <div className="hidden lg:block w-[54px] h-[54px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center relative">
              <div className="notification-icon flex">
                <img 
                  src="https://c.animaapp.com/mjiggi0jSqvoj5/img/bell-1.png" 
                  alt="Notifications"
                  className="w-[24px]"
                />
                <span className="absolute top-4 right-[19px] bg-[#f86464] w-[6px] h-[6px] rounded-full"></span>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/898887d89ce7b428ae8824c896050271-1.png" 
                alt="User Avatar"
                className="w-[54px] h-[54px] rounded-lg object-cover"
              />
            </div>
            
            <div className="lg:hidden">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/898887d89ce7b428ae8824c896050271-1.png" 
                alt="User Avatar"
                className="w-[44px] h-[44px] rounded-lg object-cover"
              />
            </div>
            
            {/* Hamburger Menu */}
            <div className="lg:hidden">
              <button 
                className={`hamburger-btn w-[44px] h-[44px] bg-[#f7f7f7] rounded-lg border border-white/22 flex flex-col justify-center items-center gap-1 p-2.5 cursor-pointer ${isMobileMenuOpen ? 'active' : ''}`}
                id="hamburgerBtn"
                aria-label="Toggle menu"
                onClick={toggleMobileMenu}
              >
                <span className={`hamburger-line w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'transform translate-y-1.5 rotate-45' : ''}`}></span>
                <span className={`hamburger-line w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`hamburger-line w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'transform -translate-y-1.5 -rotate-45' : ''}`}></span>
              </button>
            </div>
            
            {/* User info and logout for desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-gray-700">{user?.email}</span>
              <LogoutButton />
            </div>
          </div>
        </header>
        
        {/* Mobile Navigation Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          id="mobileNavOverlay"
          onClick={(e) => e.target === e.currentTarget && closeMobileMenu()}
        >
          <div className={`absolute top-0 right-0 w-[300px] h-full bg-white p-5 overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="mobile-nav-header flex justify-end mb-7">
              <button 
                className="mobile-close-btn w-[44px] h-[44px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center cursor-pointer text-[24px] text-black"
                id="mobileCloseBtn"
                aria-label="Close menu"
                onClick={closeMobileMenu}
              >
                ×
              </button>
            </div>
            
            <div className="mobile-nav-content">
              <div className="mobile-nav-search w-full h-[44px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center px-3 mb-5">
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="flex-1 border-none bg-transparent font-inter text-[14px] text-black outline-none"
                />
                <img 
                  src="https://c.animaapp.com/mjiggi0jSqvoj5/img/search-interface-symbol-1.png" 
                  alt="Search"
                  className="w-[18px] h-[18px]"
                />
              </div>
              
              <nav className="mobile-nav-links flex flex-col gap-3 mb-7">
                <a href="#" className="mobile-nav-link active px-4 py-3 font-inter text-[16px] text-black no-underline rounded-lg bg-[#f7f7f7]">
                  Dashboard
                </a>
                <a href="#" className="mobile-nav-link px-4 py-3 font-inter text-[16px] text-black no-underline rounded-lg hover:bg-[#f0f0f0] transition-colors duration-300">
                  Quotes
                </a>
                <a href="#" className="mobile-nav-link px-4 py-3 font-inter text-[16px] text-black no-underline rounded-lg hover:bg-[#f0f0f0] transition-colors duration-300">
                  Shipments
                </a>
                <a href="#" className="mobile-nav-link px-4 py-3 font-inter text-[16px] text-black no-underline rounded-lg hover:bg-[#f0f0f0] transition-colors duration-300">
                  Documents
                </a>
              </nav>
              
              <div className="mobile-nav-actions flex flex-col gap-3">
                <button className="mobile-action-btn flex items-center gap-2 px-4 py-3 bg-[#f7f7f7] border border-white/22 rounded-lg font-inter text-[14px] text-black cursor-pointer hover:bg-[#e9e9e9] transition-colors duration-300">
                  <img 
                    src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-118-1.svg" 
                    alt="Quote"
                    className="w-5 h-5"
                  />
                  Get New Quote
                </button>
                <button className="mobile-action-btn flex items-center gap-2 px-4 py-3 bg-[#f7f7f7] border border-white/22 rounded-lg font-inter text-[14px] text-black cursor-pointer hover:bg-[#e9e9e9] transition-colors duration-300">
                  <img 
                    src="https://c.animaapp.com/mjiggi0jSqvoj5/img/upload-1.png" 
                    alt="Upload"
                    className="w-5 h-5"
                  />
                  Upload Document
                </button>
                <button className="mobile-action-btn flex items-center gap-2 px-4 py-3 bg-[#f7f7f7] border border-white/22 rounded-lg font-inter text-[14px] text-black cursor-pointer hover:bg-[#e9e9e9] transition-colors duration-300">
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
        </div>
        
        {/* Mobile Header for Activity Section */}
        <div className="activity-mobile-header flex gap-2 items-center mb-4 lg:hidden">
          <img src="/hashtag.svg" alt="" />
          <h4 className="font-normal text-[16px]">Dashboard</h4>
        </div>
        
        {/* Main Content */}
        <main className="grid lg:grid-cols-3 gap-4 items-baseline">
          {/* Left Column (75% on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Performance Overview */}
            <section className="bg-[#fafcff]/80 rounded-2xl p-6 h-auto">
              <div className="flex justify-between items-start mb-7">
                <div className="titles">
                  <h2 className="font-montserrat text-[20px] font-medium text-black lg:text-[18px]">
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
              
              <div className="flex flex-wrap lg:flex-nowrap justify-around gap-8 lg:gap-2 pl-5 lg:pl-0">
                <div className="w-[43%] lg:w-[12%]">
                  <div className="metric-item">
                    <div className="relative w-fit">
                      <div className="font-montserrat text-[46px] lg:text-[32px] font-normal text-black flex items-start leading-none w-fit items-baseline relative">
                        <span className="text-black tracking-[1.28px]">84.</span>
                        <span className="text-[#c7c7c7] tracking-[1.28px]">5k</span>
                        <span className="absolute text-[12px] top-1.5 -left-4">$</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Total Insured Amount
                  </p>
                </div>
                
                <div className="w-[43%] lg:w-[12%]">
                  <div className="metric-item">
                    <div className="relative w-fit">
                      <div className="font-montserrat text-[46px] lg:text-[32px] font-normal text-black flex items-start leading-none w-fit items-baseline relative">
                        <span className="text-black tracking-[1.28px]">8.</span>
                        <span className="text-[#c7c7c7] tracking-[1.28px]">47</span>
                        <span className="absolute text-[12px] top-1.5 -left-4">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Active Policies
                  </p>
                </div>
                
                <div className="w-[43%] lg:w-[12%]">
                  <div className="metric-item">
                    <div className="relative w-fit">
                      <div className="font-montserrat text-[46px] lg:text-[32px] font-normal text-black flex items-start leading-none w-fit items-baseline">
                        <span className="text-black tracking-[1.28px]">3.</span>
                        <img className="w-7 ml-1.5" src="/arrow.svg" alt="" />
                      </div>
                    </div>
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Quotes Awaiting Approval
                  </p>
                </div>
                
                <div className="w-[43%] lg:w-[12%]">
                  <div className="metric-item">
                    <div className="relative w-fit">
                      <div className="font-montserrat text-[46px] lg:text-[32px] font-normal text-black flex items-start leading-none w-fit items-baseline">
                        <span className="text-black tracking-[1.28px]">2.</span>
                        <img className="w-7 ml-1.5" src="/arrow.svg" alt="" />
                      </div>
                    </div>
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Contracts Due to Expire
                  </p>
                </div>
                
                <div className="w-[43%] lg:w-[12%]">
                  <div className="metric-item">
                    <div className="relative w-fit">
                      <div className="font-montserrat text-[46px] lg:text-[32px] font-normal text-black flex items-start leading-none w-fit items-baseline">
                        <span className="text-black tracking-[1.28px]">1.</span>
                        <img className="w-7 ml-1.5" src="/arrow.svg" alt="" />
                      </div>
                    </div>
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Required Document Uploads
                  </p>
                </div>
              </div>
            </section>
            
            {/* Mobile Activity Header */}
            <div className="flex items-center justify-between lg:hidden">
              <h3 className="text-[18px] font-normal">Recent Activity</h3>
              <div className="flex gap-2">
                <button className="p-0 w-fit border-none bg-transparent w-[44px] h-[44px]">
                  <img src="/btn/01.svg" alt="" className="w-[132%] h-[132%]" />
                </button>
                <button className="p-0 w-fit border-none bg-transparent w-[44px] h-[44px]">
                  <img src="/btn/02.svg" alt="" className="w-[132%] h-[132%]" />
                </button>
                <button className="p-0 w-fit border-none bg-transparent w-[44px] h-[44px]">
                  <img src="/btn/03.svg" alt="" className="w-[132%] h-[132%]" />
                </button>
                <button className="p-0 w-fit border-none bg-transparent w-[44px] h-[44px]">
                  <img src="/btn/04.svg" alt="" className="w-[132%] h-[132%]" />
                </button>
              </div>
            </div>
            
            {/* Recent Activity */}
            <section className="bg-[#fafcff]/80 rounded-2xl p-6 lg:bg-transparent lg:p-0 lg:mt-[-3px]">
              <div className="hidden lg:flex justify-between items-center mb-6">
                <div className="flex items-center gap-1.5">
                  <img 
                    src="https://c.animaapp.com/mjiggi0jSqvoj5/img/filter-1.png" 
                    alt="Filter" 
                    className="w-3 h-3 object-cover"
                  />
                  <span className="font-montserrat text-[16px] font-normal text-[#818181]">
                    Search Filter
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-36 h-[38px] border-b border-[#c7c7c7]/51 flex items-center justify-between px-3 py-2">
                    <input 
                      type="text" 
                      placeholder="Search by..."
                      className="border-none bg-transparent font-montserrat text-[12px] text-[#7b7b7b] w-full focus:outline-none"
                    />
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/search--1--2.png" 
                      alt="Search" 
                      className="w-3 h-3 object-cover"
                    />
                  </div>
                  
                  <div className="h-[38px] flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51 font-montserrat text-[12px] text-[#7b7b7b]">
                    <span>All Activity</span>
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                      alt="Dropdown"
                    />
                  </div>
                  
                  <div className="h-[38px] flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51 font-montserrat text-[12px] text-[#7b7b7b]">
                    <span>Last 30 days</span>
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                      alt="Dropdown"
                    />
                  </div>
                  
                  <div className="h-[38px] flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51 font-montserrat text-[12px] text-[#7b7b7b]">
                    <span>Sort by</span>
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                      alt="Dropdown"
                    />
                  </div>
                  
                  <div className="h-[38px] flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51 font-montserrat text-[12px] text-[#7b7b7b]">
                    <span>Status</span>
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
                      alt="Dropdown"
                    />
                  </div>
                  
                  <button className="bg-[#2563eb] text-white border-none rounded-lg font-poppins text-[14px] font-normal cursor-pointer transition-colors duration-300 hover:bg-[#1d4ed8] w-fit px-4 py-2">
                    Get New Quote
                  </button>
                </div>
              </div>
              
              <div className="mt-7 lg:mt-0 w-full overflow-x-auto">
                <div className="hidden lg:grid grid-cols-[120px_120px_1fr_200px_150px_130px] gap-2 pb-2 border-b border-[#e5e7eb] mb-2">
                  <div className="flex items-center gap-2 font-poppins text-[14px] font-normal text-[#606068]">
                    <span>Type</span>
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/filter--1--7.png" 
                      alt="Sort" 
                      className="w-3 h-3 object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 font-poppins text-[14px] font-normal text-[#606068]">
                    <span>ID</span>
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/filter--1--7.png" 
                      alt="Sort" 
                      className="w-3 h-3 object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 font-poppins text-[14px] font-normal text-[#606068]">
                    <span>Cargo / Value</span>
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/filter--1--7.png" 
                      alt="Sort" 
                      className="w-3 h-3 object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 font-poppins text-[14px] font-normal text-[#606068]">
                    <span>Status / Due Date</span>
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/filter--1--7.png" 
                      alt="Sort" 
                      className="w-3 h-3 object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 font-poppins text-[14px] font-normal text-[#606068]">
                    <span>Last Update</span>
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/filter--1--7.png" 
                      alt="Sort" 
                      className="w-3 h-3 object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 font-poppins text-[14px] font-normal text-[#606068]">
                    <span>Action</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {/* Row 1 */}
                  <div className="min-w-full lg:grid lg:grid-cols-[120px_120px_1fr_200px_150px_130px] gap-2 px-3 py-2 bg-[#f8fafd] rounded-lg items-center lg:bg-[#fafcff]/80 lg:rounded-2xl lg:p-3 flex flex-wrap justify-between gap-5.5">
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Quote</div>
                    <div className="font-poppins text-[14px] text-[#2563eb] underline cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Q-005</div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Jewelry / 15,400.00</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-[12px] font-normal leading-[18px] text-[#cbd03c] bg-[#cbd03c]/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cbd03c]"></span>
                        Pending Approval
                      </span>
                    </div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Oct 25, 9:10PM</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      <button className="w-full h-9 bg-[#2563eb] text-white border-none rounded-lg font-poppins text-[14px] font-normal cursor-pointer transition-colors duration-300 hover:bg-[#1d4ed8]">
                        Approve Quote
                      </button>
                    </div>
                  </div>
                  
                  {/* Row 2 */}
                  <div className="min-w-full lg:grid lg:grid-cols-[120px_120px_1fr_200px_150px_130px] gap-2 px-3 py-2 bg-[#f8fafd] rounded-lg items-center lg:bg-[#fafcff]/80 lg:rounded-2xl lg:p-3 flex flex-wrap justify-between gap-5.5">
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Policy</div>
                    <div className="font-poppins text-[14px] text-[#2563eb] underline cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">P-021</div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Textiles / 3,700.00</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-[12px] font-normal leading-[18px] text-[#f97316] bg-[#f97316]/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
                        Document Missing
                      </span>
                    </div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Oct 20, 6:30PM</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      <button className="w-full h-9 bg-transparent text-[#374151] border border-[#e3e6ea] rounded-lg font-poppins text-[14px] font-normal cursor-pointer transition-all duration-300 hover:bg-[#f3f4f6]">
                        Upload Docs
                      </button>
                    </div>
                  </div>
                  
                  {/* Row 3 */}
                  <div className="min-w-full lg:grid lg:grid-cols-[120px_120px_1fr_200px_150px_130px] gap-2 px-3 py-2 bg-[#f8fafd] rounded-lg items-center lg:bg-[#fafcff]/80 lg:rounded-2xl lg:p-3 flex flex-wrap justify-between gap-5.5">
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Policy</div>
                    <div className="font-poppins text-[14px] text-[#2563eb] underline cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">P-020</div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Heavy Machinery / 48,400.00</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-[12px] font-normal leading-[18px] text-[#eab308] bg-[#eab308]/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]"></span>
                        Expires 15 Nov 2025
                      </span>
                    </div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Oct 15, 4:20AM</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      <button className="w-full h-9 bg-transparent text-[#374151] border border-[#e3e6ea] rounded-lg font-poppins text-[14px] font-normal cursor-pointer transition-all duration-300 hover:bg-[#f3f4f6]">
                        Renew Policy
                      </button>
                    </div>
                  </div>
                  
                  {/* Row 4 */}
                  <div className="min-w-full lg:grid lg:grid-cols-[120px_120px_1fr_200px_150px_130px] gap-2 px-3 py-2 bg-[#f8fafd] rounded-lg items-center lg:bg-[#fafcff]/80 lg:rounded-2xl lg:p-3 flex flex-wrap justify-between gap-5.5">
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Policy</div>
                    <div className="font-poppins text-[14px] text-[#2563eb] underline cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">P-019</div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Electronics / 8,000.00</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-[12px] font-normal leading-[18px] text-[#16a34a] bg-[#16a34a]/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                        Active
                      </span>
                    </div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Oct 21, 2:30PM</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      <button className="w-full h-9 bg-transparent text-[#374151] border border-[#e3e6ea] rounded-lg font-poppins text-[14px] font-normal cursor-pointer transition-all duration-300 hover:bg-[#f3f4f6]">
                        Download Cert
                      </button>
                    </div>
                  </div>
                  
                  {/* Row 5 */}
                  <div className="min-w-full lg:grid lg:grid-cols-[120px_120px_1fr_200px_150px_130px] gap-2 px-3 py-2 bg-[#f8fafd] rounded-lg items-center lg:bg-[#fafcff]/80 lg:rounded-2xl lg:p-3 flex flex-wrap justify-between gap-5.5">
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Quote</div>
                    <div className="font-poppins text-[14px] text-[#2563eb] underline cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Q-007</div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Food Products / 1,100.00</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-[12px] font-normal leading-[18px] text-[#8ea0b0] bg-[#8ea0b0]/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8ea0b0]"></span>
                        Declined
                      </span>
                    </div>
                    <div className="font-poppins text-[14px] text-black whitespace-nowrap overflow-hidden text-ellipsis w-[45.5%]">Sept 28, 9:30PM</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      <button className="w-full h-9 bg-transparent text-[#374151] border border-[#e3e6ea] rounded-lg font-poppins text-[14px] font-normal cursor-pointer transition-all duration-300 hover:bg-[#f3f4f6]">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          {/* Right Column (25% on desktop) */}
          <div className="lg:col-span-1 flex flex-col gap-4 lg:flex-col lg:flex-col">
            {/* Welcome Widget */}
            <aside className="relative h-[449px] lg:h-[260px] rounded-2xl overflow-hidden lg:w-full">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/frame-76.png" 
                alt="Background" 
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="relative z-10 p-6 h-full flex flex-col">
                <h2 className="font-montserrat text-[20px] lg:text-[18px] font-normal text-white mb-3">
                  Welcome back, Lucas!
                </h2>
                <p className="font-montserrat text-[14px] lg:text-[12px] font-normal text-white mb-auto max-w-[224px] lg:max-w-full">
                  Everything's under control — let's make this day productive.
                </p>
                
                <div className="flex items-end justify-between gap-[82px]">
                  <h3 className="font-montserrat text-[32px] lg:text-[26px] font-medium text-white leading-[38px] lg:leading-[33px] tracking-[0.64px] max-w-[224px]">
                    Get Your New Quote Instantly
                  </h3>
                  <img 
                    src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-84.png" 
                    alt="Arrow" 
                    className="w-[42px] h-[42px]"
                  />
                </div>
              </div>
            </aside>
            
            {/* Action Center */}
            <aside className="bg-[#fafcff]/80 rounded-2xl p-6 relative overflow-hidden h-[203px] lg:h-full w-full lg:w-[100%]">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/vector-148.svg" 
                alt="Background" 
                className="absolute top-[-41px] lg:top-0 left-[-274px] w-[796px] lg:w-[840px] h-[270px] lg:h-[328px] z-0"
              />
              <div className="relative z-10 flex h-full lg:block">
                <div className="action-header">
                  <h3 className="font-montserrat text-[18px] lg:text-[16px] font-medium text-black mb-1">
                    Action Center
                  </h3>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] max-w-[159px] lg:max-w-full mb-6 lg:mb-0">
                    Your latest quotes and policies. Act now on pending items to proceed.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 ml-auto max-w-[198px] lg:max-w-full justify-end lg:justify-start">
                  <button className="flex items-center gap-2 px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg backdrop-blur font-montserrat text-[16px] font-normal text-[#1e293b] cursor-pointer transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-lg w-full">
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-118-1.svg" 
                      alt="Quote Icon"
                      className="w-4 h-4"
                    />
                    <span className="text-[14px]">Get New Quote</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg backdrop-blur font-montserrat text-[16px] font-normal text-[#1e293b] cursor-pointer transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-lg w-full">
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/upload-1.png" 
                      alt="Upload Icon"
                      className="w-4 h-4"
                    />
                    <span className="text-[14px]">Upload Document</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-3 py-2.5 bg-white/20 border border-white/30 rounded-lg backdrop-blur font-montserrat text-[16px] font-normal text-[#1e293b] cursor-pointer transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-lg w-full">
                    <img 
                      src="https://c.animaapp.com/mjiggi0jSqvoj5/img/upload-1-1.png" 
                      alt="Renew Icon"
                      className="w-4 h-4"
                    />
                    <span className="text-[14px]">Renew Policy</span>
                  </button>
                </div>
              </div>
            </aside>
            
            {/* Quote Conversion Rate */}
            <section className="bg-[#fafcff]/80 rounded-2xl p-6 relative w-full lg:w-[36%] min-h-[203px] lg:flex lg:flex-col lg:justify-between">
              <div className="quote-conversion-header">
                <h3 className="font-montserrat text-[18px] lg:text-[16px] font-medium text-black">
                  Quote Conversion Rate
                </h3>
                <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7]">
                  This Month
                </p>
              </div>
              <div className="flex justify-between">
                <div className="w-full overflow-hidden pt-4">
                  <div className="flex justify-between w-full mb-1.5">
                    <div>
                      <div className="text-[13px] text-[#C8C8C8] w-full">Approved</div>
                      <div className="text-[15px] mt-0.5">17</div>
                    </div>
                    <div>
                      <div className="text-[13px] text-[#C8C8C8] w-full">Declined</div>
                      <div className="text-[15px] mt-0.5">9</div>
                    </div>
                    <div>
                      <div className="text-[13px] text-[#C8C8C8] w-full">Expired</div>
                      <div className="text-[15px] mt-0.5">0</div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <div className="flex justify-start gap-1 items-baseline">
                      {Array.from({ length: 22 }).map((_, i) => (
                        <div 
                          key={`top-${i}`} 
                          className={`w-[3px] h-5 bg-[#bed5f8] ${i === 0 || i === 21 ? 'h-8' : ''}`}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-start gap-1 items-baseline">
                      {Array.from({ length: 44 }).map((_, i) => (
                        <div 
                          key={`bottom-${i}`} 
                          className="w-[3px] h-1 bg-[#f3f3f6]"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block w-full text-end ml-auto flex flex-col-reverse pt-5">
                  <div className="text-[13px] text-[#C8C8C8]">Conversion Rate</div>
                  <div className="text-[26px] text-black font-normal">65</div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}