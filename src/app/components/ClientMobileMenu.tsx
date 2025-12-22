// src/components/ClientMobileMenu.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ClientMobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open')
      window.scrollTo(0, 0)
    } else {
      document.body.classList.remove('menu-open')
    }

    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [isMenuOpen])

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="md:hidden flex flex-col justify-between w-7 h-[21px] bg-transparent border-none cursor-pointer p-0 z-[1001] transition-opacity duration-150"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span 
          className={`block h-0.5 w-[88%] bg-[#4C4C4C] rounded transition-all duration-200 ${
            isMenuOpen ? 'transform translate-y-[9px] rotate-45' : ''
          }`}
        />
        <span 
          className={`block h-0.5 w-[88%] bg-[#4C4C4C] rounded transition-all duration-200 ${
            isMenuOpen ? 'opacity-0' : ''
          }`}
        />
        <span 
          className={`block h-0.5 w-[88%] bg-[#4C4C4C] rounded transition-all duration-200 ${
            isMenuOpen ? 'transform -translate-y-[9px] -rotate-45' : ''
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 w-full h-screen bg-[#FBFBFF] transition-all duration-200 z-[999] md:hidden ${
          isMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 w-7 h-7 bg-transparent border-none cursor-pointer z-[1001] flex items-center justify-center transition-all duration-150"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <span className="absolute w-full h-0.5 bg-[#4C4C4C] rounded rotate-45" />
          <span className="absolute w-full h-0.5 bg-[#4C4C4C] rounded -rotate-45" />
        </button>

        {/* Menu Content */}
        <div 
          className={`pt-20 px-6 pb-40 flex flex-col gap-8 h-full transition-all duration-250 ${
            isMenuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2.5'
          }`}
        >
          <div className="flex flex-col gap-0">
            {['Why Cargo Guard', 'How It Works', 'Results', 'Platform'].map((item, index) => (
              <Link
                key={item}
                href="#"
                className={`text-lg text-[#535C65] py-3 border-b border-gray-200 font-medium hover:text-[#2563EB] transition-colors duration-150 ${
                  isMenuOpen 
                    ? 'animate-fadeInUp' 
                    : ''
                }`}
                style={isMenuOpen ? { animationDelay: `${0.05 + index * 0.05}s` } : {}}
                onClick={closeMenu}
              >
                {item}
              </Link>
            ))}
          </div>

          <div 
            className={`mt-auto flex flex-col sm:flex-row gap-4 absolute bottom-0 left-0 right-0 p-6 bg-[#2563eb] transition-all duration-250 ${
              isMenuOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2.5'
            }`}
          >
            <Link href="/login" className="flex-1" onClick={closeMenu}>
              <button className="w-full py-3 text-sm bg-white text-[#2a2a2a] rounded-lg hover:bg-gray-100 transition-colors duration-150">
                Login
              </button>
            </Link>
            <Link href="/signup" className="flex-1" onClick={closeMenu}>
              <button className="w-full py-3 text-sm bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors duration-150">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.25s ease forwards;
        }
        
        body.menu-open {
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          body.menu-open .tb {
            opacity: 0.3;
            pointer-events: none;
            transition: opacity 0.15s ease;
          }
        }
      `}</style>
    </>
  )
}