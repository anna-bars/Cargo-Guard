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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const pathname = usePathname()
  
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
      title: 'Shipment Update',
      message: 'Your shipment #12345 has been dispatched',
      type: 'success' as const,
      read: false,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: '3',
      title: 'Document Expiry',
      message: 'Your insurance document expires in 7 days',
      type: 'warning' as const,
      read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ])
  
  const [unreadCount, setUnreadCount] = useState(0)
  
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length
    setUnreadCount(count)
  }, [notifications])
  
  useEffect(() => {
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
  
  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen)
  }
  
  const closeProfileModal = () => {
    setIsProfileModalOpen(false)
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
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { id: 'quotes', label: 'Quotes', href: '/quotes', icon: 'quotes' },
    { id: 'shipments', label: 'Shipments', href: '/shipments', icon: 'shipments' },
    { id: 'documents', label: 'Documents', href: '/documents', icon: 'documents' },
    { id: 'profile', label: 'Profile', href: '/profile', icon: 'settings' }
  ]
  
  const handleNavClick = (itemLabel: string) => {
    setActiveNavItem(itemLabel)
  }
  
  const handleProfileSetting = () => {
    setIsProfileModalOpen(false)
  }
  
  const userDisplayName = userEmail?.split('@')[0] || 'User'
  
  const isActive = (itemLabel: string) => activeNavItem === itemLabel
  
  return (
    <>
      {/* Fixed width container */}
      <div className="max-w-[88%] sm:max-w-[96%] mx-auto pt-3">
        {/* Header */}
        <header className="flex justify-between items-center h-[68px] mb-3">
          <div className="flex items-center gap-3">
            <img 
              src="https://c.animaapp.com/mjiggi0jSqvoj5/img/layer-1-1.png" 
              alt="Cargo Guard Logo" 
              className="w-[22px] h-[29px] object-cover"
            />
            {/* Hide text on mobile, show only on desktop */}
            <h2 className="hidden sm:block font-montserrat text-[18px] sm:text-[24px] font-normal text-[#0a3d62]">
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
                className={`h-[54px] flex items-center justify-center px-9 rounded-lg transition-all duration-300 cursor-pointer group no-underline ${isActive(item.label) ? 'bg-white shadow-sm' : 'bg-[#f7f7f7] border border-white/22 hover:bg-white'}`}
              >
                <span className={`font-inter text-[16px] font-normal transition-all duration-300 ${isActive(item.label) ? 'text-black' : 'text-black group-hover:text-black/80'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Notifications Button - Updated with count badge */}
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
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#f86464] text-white text-[10px] font-inter font-medium rounded-full flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
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
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
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
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-inter text-sm font-medium text-gray-900">
                      {userDisplayName}
                    </div>
                    <div className="font-inter text-xs text-gray-500 truncate">
                      {userEmail || 'user@example.com'}
                    </div>
                  </div>
                  
                  <Link 
                    href="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200 text-left no-underline"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-inter text-sm font-medium text-gray-800">Profile Setting</span>
                  </Link>
                  
                  <div className="border-t border-gray-100">
                    <LogoutButton desktopVersion />
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile User Avatar - Click opens profile modal */}
            <div className="xl:hidden relative">
              <div 
                className="relative cursor-pointer"
                onClick={toggleProfileModal}
              >
                <img 
                  src="/dashboard/avatar-img.png" 
                  alt="User Avatar"
                  className="w-[44px] h-[44px] rounded-lg object-cover hover:opacity-90 transition-opacity duration-300"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Profile Modal for Mobile */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[9999] transition-opacity duration-300">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={closeProfileModal}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 transition-transform duration-300 animate-slideUp">
              {/* Close button */}
              <div className="flex justify-end mb-6">
                <button 
                  className="w-[44px] h-[44px] bg-[#f7f7f7] rounded-lg border border-white/22 flex items-center justify-center cursor-pointer text-2xl text-black hover:bg-gray-100 transition-colors duration-300"
                  onClick={closeProfileModal}
                >
                  ×
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-[#f7f7f7] rounded-lg">
                <img 
                  src="/dashboard/avatar-img.png" 
                  alt="User Avatar"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <div className="font-inter text-base font-medium text-black">
                    {userDisplayName}
                  </div>
                  <div className="font-inter text-sm text-gray-600 truncate max-w-[200px]">
                    {userEmail || 'user@example.com'}
                  </div>
                </div>
              </div>
              
              {/* Profile Setting Button */}
              <Link 
                href="/profile"
                onClick={handleProfileSetting}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer mb-3 no-underline"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-inter text-base font-medium text-gray-800">Profile Setting</span>
              </Link>
              
              {/* Logout Button */}
              <div onClick={closeProfileModal}>
                <LogoutButton mobileVersion />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation - Updated with transparent background and no text */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="flex justify-center gap-2 items-center h-[70px] px-2">
          {navItems.map((item) => {
            const active = isActive(item.label)
            const iconSrc = active 
              ? `/nav/${item.icon}-active.svg`
              : `/nav/${item.icon}.svg`
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className="flex items-center justify-center no-underline"
              >
                <div 
                  className={`w-[50px] h-[50px] flex items-center justify-center rounded-[6px] transition-all duration-200 ${
                    active 
                      ? 'bg-black' 
                      : 'bg-[#F3F3F6] border border-[#EDEDED]'
                  }`}
                  style={{ padding: '14px' }}
                >
                  <img 
                    src={iconSrc}
                    alt={item.label}
                    className="w-6 h-6"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Padding for mobile bottom nav */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        /* Add padding to main content to avoid overlap with bottom nav */
        @media (max-width: 1279px) {
          main {
            padding-bottom: 50px !important;
          }
        }
      `}</style>
    </>
  )
}