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
      <div className="max-w-[96%] mx-auto pt-4">
        {/* Header */}
        <header className="flex justify-between items-center h-[68px] mb-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://c.animaapp.com/mjiggi0jSqvoj5/img/layer-1-1.png" 
              alt="Cargo Guard Logo" 
              className="w-[22px] h-[29px] object-cover"
            />
            <h1 className="font-montserrat text-[24px] font-normal text-[#0a3d62]">
              Cargo Guard
            </h1>
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
            <div className="w-[54px] h-[54px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center relative xl:hidden">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/bell-1.png" 
                alt="Notifications"
                className="w-[24px]"
              />
              <span className="absolute top-4 right-[19px] bg-[#f86464] w-[6px] h-[6px] rounded-full"></span>
            </div>
            
            <div className="hidden xl:block w-[54px] h-[54px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center relative">
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
              <span className="text-gray-700">{user?.email}</span>
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
          <img src="/hashtag.svg" alt="" className="w-5 h-5" />
          <h4 className="font-normal text-base">Dashboard</h4>
        </div>

        {/* Main Content Grid - Exact same as CSS */}
        <main className="grid grid-cols-1 xl:grid-cols-[75%_25%] gap-4 items-stretch">
          {/* Left Column - 75% */}
          <div className="flex flex-col gap-4">
            {/* Performance Overview */}
            <section className="bg-[#fafcff]/80 rounded-2xl p-6 h-auto">
              <div className="flex justify-between items-start mb-7">
                <div>
                  <h2 className="font-montserrat text-[20px] font-medium text-black">
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
              <div className="flex justify-around flex-wrap xl:flex-nowrap gap-8 xl:gap-2">
                {/* Total Insured Amount */}
                <div className="w-[43%] xl:w-[12%]">
                  <div className="relative">
                    <div className="font-montserrat text-[46px] xl:text-[46px] font-normal text-black flex items-baseline relative">
                      <span className="text-black tracking-[1.28px]">84.</span>
                      <span className="text-[#c7c7c7] tracking-[1.28px]">5k</span>
                      <span className="absolute -left-5 top-1.5 text-[12px]">$</span>
                    </div>
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Total Insured Amount
                  </p>
                </div>
                
                {/* Active Policies */}
                <div className="w-[43%] xl:w-[12%]">
                  <div className="relative">
                    <div className="font-montserrat text-[46px] xl:text-[46px] font-normal text-black flex items-baseline relative">
                      <span className="text-black tracking-[1.28px]">8.</span>
                      <span className="text-[#c7c7c7] tracking-[1.28px]">47</span>
                      <span className="absolute -left-5 top-1.5 text-[12px]">%</span>
                    </div>
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Active Policies
                  </p>
                </div>
                
                {/* Quotes Awaiting Approval */}
                <div className="w-[43%] xl:w-[12%]">
                  <div className="font-montserrat text-[46px] xl:text-[46px] font-normal text-black flex items-baseline">
                    <span className="text-black tracking-[1.28px]">3.</span>
                    <img className="w-7 ml-1.5" src="/arrow.svg" alt="" />
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Quotes Awaiting Approval
                  </p>
                </div>
                
                {/* Contracts Due to Expire */}
                <div className="w-[43%] xl:w-[12%]">
                  <div className="font-montserrat text-[46px] xl:text-[46px] font-normal text-black flex items-baseline">
                    <span className="text-black tracking-[1.28px]">2.</span>
                    <img className="w-7 ml-1.5" src="/arrow.svg" alt="" />
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Contracts Due to Expire
                  </p>
                </div>
                
                {/* Required Document Uploads */}
                <div className="w-[43%] xl:w-[12%]">
                  <div className="font-montserrat text-[46px] xl:text-[46px] font-normal text-black flex items-baseline">
                    <span className="text-black tracking-[1.28px]">1.</span>
                    <img className="w-7 ml-1.5" src="/arrow.svg" alt="" />
                  </div>
                  <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1">
                    Required Document Uploads
                  </p>
                </div>
              </div>
            </section>

            {/* Mobile Activity Header */}
            <div className="xl:hidden flex items-center justify-between">
              <h3 className="text-lg font-normal">Recent Activity</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button key={num} className="w-[44px] h-[44px] p-0 border-none bg-transparent">
                    <img src={`/btn/0${num}.svg`} alt="" className="w-[132%] h-[132%]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity Table */}
            <section className="bg-[#fafcff]/80 rounded-2xl p-6 xl:bg-[#fafcff]/80 xl:p-6">
              {/* Desktop Filters */}
              <div className="hidden xl:flex justify-between items-center mb-6">
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
                
                <div className="flex items-center gap-4">
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
              <div className="hidden xl:grid grid-cols-[120px_120px_1fr_200px_150px_130px] gap-2 pb-2 border-b border-gray-200 mb-2">
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
              <div className="space-y-2">
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
                  <div key={idx} className="xl:grid xl:grid-cols-[120px_120px_1fr_200px_150px_130px] gap-2 p-3 xl:p-3 bg-[#f8fafd] xl:bg-[#f8fafd] rounded-lg xl:rounded-lg flex flex-wrap items-center">
                    {/* Mobile/Desktop Layout */}
                    <div className="w-[45%] xl:w-auto font-poppins text-sm text-black truncate">{row.type}</div>
                    <div className="w-[45%] xl:w-auto font-poppins text-sm text-[#2563eb] underline truncate">{row.id}</div>
                    <div className="w-[45%] xl:w-auto font-poppins text-sm text-black truncate mt-2 xl:mt-0">{row.cargo}</div>
                    <div className="w-[45%] xl:w-auto mt-2 xl:mt-0">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-xs ${row.status.color} ${row.status.textColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.status.dot}`}></span>
                        {row.status.text}
                      </span>
                    </div>
                    <div className="w-[45%] xl:w-auto font-poppins text-sm text-black truncate mt-2 xl:mt-0">{row.date}</div>
                    <div className="w-full xl:w-auto mt-2 xl:mt-0">
                      <button className={`h-9 px-4 rounded-lg font-poppins text-sm font-normal transition-colors w-full xl:w-[130px] ${
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
          <div className="flex flex-col gap-4">
            {/* Welcome Widget */}
            <div className="relative h-[449px] rounded-2xl overflow-hidden w-full">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/frame-76.png" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 p-6 h-full flex flex-col">
                <h2 className="font-montserrat text-[20px] font-normal text-white mb-3">
                  Welcome back, Lucas!
                </h2>
                <p className="font-montserrat text-[14px] font-normal text-white mb-auto max-w-[224px]">
                  Everything's under control — let's make this day productive.
                </p>
                
                <div className="flex items-end justify-between gap-[82px]">
                  <h3 className="font-montserrat text-[32px] font-medium text-white leading-[38px] tracking-[0.64px] max-w-[224px]">
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
            <div className="bg-[#fafcff]/80 rounded-2xl p-6 relative overflow-hidden h-[203px] w-full">
              <img 
                src="https://c.animaapp.com/mjiggi0jSqvoj5/img/vector-148.svg" 
                alt="Background" 
                className="absolute -top-10 -left-[274px] w-[796px] h-[270px]"
              />
              <div className="relative z-10 h-full flex">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-montserrat text-[18px] font-medium text-black mb-1">
                      Action Center
                    </h3>
                    <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7] max-w-[159px]">
                      Your latest quotes and policies. Act now on pending items to proceed.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
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
            <div className="bg-[#fafcff]/80 rounded-2xl p-6 h-auto min-h-[203px] w-full">
              <div className="mb-4">
                <h3 className="font-montserrat text-[18px] font-medium text-black">
                  Quote Conversion Rate
                </h3>
                <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7]">
                  This Month
                </p>
              </div>
              
              <div className="flex justify-between items-end">
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
                  
                  <div className="flex items-end gap-1">
                    {/* Top bars */}
                    <div className="flex gap-1">
                      {Array.from({ length: 22 }).map((_, i) => (
                        <div 
                          key={`top-${i}`} 
                          className={`w-[3px] bg-[#bed5f8] ${i === 0 || i === 21 ? 'h-8' : 'h-5'}`}
                        />
                      ))}
                    </div>
                    
                    {/* Bottom bars */}
                    <div className="flex gap-1">
                      {Array.from({ length: 44 }).map((_, i) => (
                        <div 
                          key={`bottom-${i}`} 
                          className="w-[3px] h-1 bg-[#f3f3f6]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="hidden xl:block text-right ml-4">
                  <div className="text-[13px] text-[#C8C8C8]">Conversion Rate</div>
                  <div className="text-[26px] text-black font-normal">65</div>
                </div>
              </div>
              
              {/* Mobile conversion rate */}
              <div className="xl:hidden text-right mt-4">
                <div className="text-[13px] text-[#C8C8C8]">Conversion Rate</div>
                <div className="text-[26px] text-black font-normal">65</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Responsive CSS for 1280px and below */}
      <style jsx>{`
        @media screen and (max-width: 1280px) {
          .main-content {
            display: flex !important;
            flex-direction: column-reverse !important;
          }
          
          .right {
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
            gap: 16px;
          }
          
          .welcome-widget {
            height: 260px !important;
            width: 36% !important;
          }
          
          .action-center {
            height: auto !important;
            width: 40% !important;
          }
          
          .quote-conversion {
            width: 36% !important;
          }
          
          .navigation {
            display: none !important;
          }
          
          .activity-mobile-header {
            display: flex !important;
            margin-bottom: 16px;
          }
          
          .activity-section-mob-hd {
            display: flex !important;
          }
          
          .showin-result-ittle-info {
            display: none !important;
          }
          
          .activity-table {
            margin-top: -12px !important;
          }
        }
        
        @media screen and (max-width: 1024px) {
          .welcome-widget,
          .action-center {
            display: none !important;
          }
          
          .quote-conversion {
            width: 100% !important;
            min-height: 195px !important;
          }
          
          .action-title, .section-title {
            font-size: 16px !important;
          }
          
          .metrics-grid {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 35px !important;
            padding-left: 20px !important;
          }
          
          .metric-card-item {
            width: 43% !important;
          }
          
          .section-header {
            align-items: center !important;
          }
          
          .activity-header {
            display: none !important;
          }
          
          .table-header {
            display: none !important;
          }
          
          .activity-table {
            margin-top: 0px !important;
          }
          
          .table-row {
            min-width: 100% !important;
            display: flex !important;
            background-color: rgba(250, 252, 255, 0.8) !important;
            border-radius: 16px !important;
            flex-wrap: wrap !important;
            gap: 22px !important;
            justify-content: space-between !important;
            padding: 16px !important;
          }
          
          .logo-text {
            display: none !important;
          }
          
          .id-link {
            color: #2563eb !important;
          }
          
          .activity-section {
            padding: 0 !important;
            background-color: transparent !important;
            margin-top: -12px !important;
          }
          
          .row-cell {
            width: 45.5% !important;
            gap: 8px !important;
          }
          
          .container {
            max-width: 94% !important;
            display: block !important;
          }
          
          .header {
            margin-bottom: 16px !important;
          }
          
          .user-avatar img {
            width: 44px !important;
            height: 44px !important;
          }

          .notification-wrapper {
            width: 44px !important;
            height: 44px !important;
          }

          .notification-icon img {
            width: 18px !important;
          }

          .notification-badge {
            top: 12px !important;
            right: 13px !important;
            width: 6px !important;
            height: 6px !important;
          }
        }
        
        @media screen and (max-width: 768px) {
          .metric-value, .metric-value2 {
            font-size: 32px !important;
          }

          .metrics-grid {
            gap: 22px !important;
          }
          
          .performance-section {
            padding: 16px !important;
          }
          
          .action-title, .section-title {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  )
}