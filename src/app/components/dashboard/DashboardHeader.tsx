'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Notifications from './Notifications'
import LogoutButton from './LogoutButton'

interface DashboardHeaderProps {
  userEmail?: string
}

export default function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const [activeNavItem, setActiveNavItem] = useState('Dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const pathname = usePathname()
  
  // Ավելացրեք notifications state-երը (համարենք այնքանով, հետո կարող եք տեղափոխել context կամ redux)
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Quote Request',
      message: 'You have a new quote request from Global Shipping Ltd.',
      type: 'info' as const,
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    // ... ձեր notification-ները
  ])
  
  const [unreadCount, setUnreadCount] = useState(0)
  
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length
    setUnreadCount(count)
  }, [notifications])
  
  useEffect(() => {
    // Update active nav item based on current path
    const currentPath = pathname.split('/').pop() || 'dashboard'
    const navItem = navItems.find(item => item.id === currentPath)
    if (navItem) {
      setActiveNavItem(navItem.label)
    }
  }, [pathname])
  
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
  
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }
  
  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false)
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
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'quotes', label: 'Quotes', href: '/quotes' },
    { id: 'shipments', label: 'Shipments', href: '/shipments' },
    { id: 'documents', label: 'Documents', href: '/documents' },
    { id: 'profile', label: 'Profile', href: '/profile' }
  ]
  
  const handleNavClick = (itemLabel: string) => {
    setActiveNavItem(itemLabel)
    closeMobileMenu()
    closeUserDropdown()
  }
  
  const handleProfileSetting = () => {
    // Navigate to profile page
    closeMobileMenu()
    setIsUserDropdownOpen(false)
  }
  
  const userDisplayName = userEmail?.split('@')[0] || 'User'
  
  return (
    <>
      {/* Fixed width container */}
      <div className="max-w-[88%] sm:max-w-[96%] mx-auto pt-3">
        {/* Header */}
        <header className="flex justify-between items-center h-[68px] mb-2">
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
            
            {navItems.map((item) => (
              <Link 
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className={`h-[54px] flex items-center justify-center px-9 rounded-lg transition-all duration-300 cursor-pointer group no-underline ${activeNavItem === item.label ? 'bg-white shadow-sm' : 'bg-[#f7f7f7] border border-white/22 hover:bg-white'}`}
              >
                <span className={`font-inter text-[16px] font-normal transition-all duration-300 ${activeNavItem === item.label ? 'text-black' : 'text-black group-hover:text-black/80'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* Header Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button 
                className="w-[44px] h-[44px] sm:w-[54px] sm:h-[54px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center relative cursor-pointer hover:bg-white transition-colors duration-300"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Notifications"
              >
                <img 
                  src="https://c.animaapp.com/mjiggi0jSqvoj5/img/bell-1.png" 
                  alt="Notifications"
                  className="w-[24px]"
                />
                {unreadCount > 0 && (
                  <span className="absolute top-4 right-[19px] bg-[#f86464] w-[6px] h-[6px] rounded-full"></span>
                )}
              </button>
              
              <Notifications 
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
              />
            </div>
            
            {/* Desktop User Avatar with Dropdown */}
            <div className="hidden xl:block relative">
              <div 
                id="user-avatar"
                className="relative cursor-pointer"
                onClick={toggleUserDropdown}
              >
                <img 
                  src="/dashboard/avatar-img.png" 
                  alt="User Avatar"
                  className="w-[54px] h-[54px] rounded-lg object-cover hover:opacity-90 transition-opacity duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-200">
                  <svg 
                    className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div 
                  id="user-dropdown"
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2"
                  style={{ 
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                    borderRadius: '12px'
                  }}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-inter text-sm font-medium text-gray-900">
                      {userDisplayName}
                    </div>
                    <div className="font-inter text-xs text-gray-500 truncate">
                      {userEmail || 'user@example.com'}
                    </div>
                  </div>
                  
                  {/* Profile Setting Button */}
                  <Link 
                    href="/profile"
                    onClick={handleProfileSetting}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200 text-left no-underline"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-inter text-sm font-medium text-gray-800">Profile Setting</span>
                  </Link>
                  
                  {/* Logout Button */}
                  <div className="border-t border-gray-100">
                    <LogoutButton desktopVersion />
                  </div>
                </div>
              )}
            </div>
            
            <div className="xl:hidden">
              <img 
                src="/dashboard/avatar-img.png" 
                alt="User Avatar"
                className="w-[44px] h-[44px] rounded-lg object-cover"
              />
            </div>
            
            {/* Hamburger Menu Button */}
            <button 
              className="xl:hidden w-[44px] h-[44px] bg-[#f7f7f7] rounded-lg border border-white/22 flex flex-col justify-center items-center gap-1 p-2.5 cursor-pointer hover:bg-white transition-colors duration-300"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
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
                className="w-[44px] h-[44px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center cursor-pointer text-2xl text-black hover:bg-gray-100 transition-colors duration-300"
                onClick={closeMobileMenu}
              >
                ×
              </button>
            </div>
            
            {/* User Info Section */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-[#f7f7f7] rounded-lg hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
              <img 
                src="/dashboard/avatar-img.png" 
                alt="User Avatar"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <div className="font-inter text-sm font-medium text-black">
                  {userDisplayName}
                </div>
                <div className="font-inter text-xs text-gray-600 truncate max-w-[180px]">
                  {userEmail || 'user@example.com'}
                </div>
              </div>
            </div>
          
            {/* Mobile Navigation Links with Hover Effect */}
            <nav className="flex flex-col gap-3 mb-7">
              {navItems.map((item) => (
                <Link 
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavClick(item.label)}
                  className={`px-4 py-3 font-inter text-base no-underline rounded-lg transition-all duration-300 ${activeNavItem === item.label ? 'bg-white text-black font-medium shadow-sm' : 'text-black hover:bg-[#f7f7f7]'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* User Settings Section - Added */}
            <div className="mt-auto pt-5 border-t border-gray-200">
              <Link 
                href="/profile"
                onClick={handleProfileSetting}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer mb-3 no-underline"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-inter text-sm font-medium text-gray-800">Profile Setting</span>
              </Link>
              
              <div onClick={closeMobileMenu}>
                <LogoutButton mobileVersion />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Hamburger Menu Styles */
        body.menu-open {
          overflow: hidden;
        }
        
        @media screen and (max-width: 1024px) {
          .logo-text {
            display: none;
          }
        }
        
        @media screen and (max-width: 768px) {
          .mobile-nav-container {
            width: 100%;
          }
          
          .hamburger-btn {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </>
  )
}