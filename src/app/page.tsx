// src/app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import ClientMobileMenu from './components/ClientMobileMenu'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Եթե օգտատերը մուտք գործած է, ուղղորդել dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#FBFBFF]">
      {/* Navigation */}
      <header className="w-full">
        <div className="container w-[96%] mx-auto lg:w-[88%] sm:w-[88%]">
          <div className="tb flex justify-between items-center py-4 lg:py-[16px]">
            {/* Logo */}
            <div className="toolbar">
              <Link href="/">
                <Image 
                  src="/landing/logo.svg" 
                  alt="Cargo Guard Logo" 
                  width={154} 
                  height={40}
                  priority
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 items-center">
              <Link href="#" className="text-sm text-[#535C65] hover:text-[#163e66] transition-all duration-250 ease-in">
                Why Cargo Guard
              </Link>
              <Link href="#" className="text-sm text-[#535C65] hover:text-[#163e66] transition-all duration-250 ease-in">
                How It Works
              </Link>
              <Link href="#" className="text-sm text-[#535C65] hover:text-[#163e66] transition-all duration-250 ease-in">
                Results
              </Link>
              <Link href="#" className="text-sm text-[#535C65] hover:text-[#163e66] transition-all duration-250 ease-in">
                Platform
              </Link>
            </nav>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex gap-3">
                <Link href="/login">
                  <button className="login-btn text-sm text-[#2a2a2a] px-4 py-1.5 hover:text-[#0a0891] transition-all duration-250 ease-in">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="sign-up-btn text-sm text-[#FAFAFA] px-4 py-1.5 bg-[#63686C] rounded-lg hover:bg-[#191b1c] transition-all duration-250 ease-in">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Mobile Hamburger Button - Client Component */}
            <ClientMobileMenu />
          </div>
          
          {/* Hero Section */}
          <div className="py-10 flex flex-col gap-4 md:py-[40px] md:gap-[16px]">
            <div className="flex flex-col gap-3 md:gap-[12px]">
              <div className="w-fit mx-auto flex items-center gap-2 md:gap-[8px] bg-white/56 rounded-full pr-3 md:pr-[12px]">
                <Image 
                  src="/landing/flash.svg" 
                  alt="Flash Icon" 
                  width={24}
                  height={24}
                  className="md:w-7 md:h-7 lg:w-7 lg:h-7"
                />
                <p className="text-xs md:text-sm lg:text-sm font-normal text-[#4C4C4C]">
                  FINALLY. LOGISTICS MOVES AT YOUR SPEED.
                </p>
              </div>
              
              <h1 className="text-[28px] leading-[36px] md:text-[32px] md:leading-[44px] lg:text-[36px] lg:leading-[48px] font-normal text-[#4C4C4C] text-center mx-auto w-[96%] md:w-[96%] lg:w-[82%] xl:w-[66%] 2xl:w-[51%]">
                Cargo Insurance, Simplified.{' '}
                <span className="text-[#2563EB] font-medium">Instant Quotes. Zero Paperwork.</span>
              </h1>
              
              <p className="text-base text-[#4C4C4C] text-center mx-auto w-[90%] md:w-[90%] lg:w-[90%] xl:w-[72%] 2xl:w-[43%]">
                The first fully digital platform to secure your global freight against risk, powered by smart compliance tools.
              </p>
            </div>
            
            <div className="w-fit mx-auto flex flex-row sm:flex-row gap-4 md:gap-[16px]">
              <Link href="/quote">
                <button className="first-btn bg-transparent border-none px-0 py-1.5 text-sm md:text-base text-[#2F2F2F] hover:text-[#2563eb] transition-all duration-250 ease-in cursor-pointer">
                  Get An Instant Quote
                </button>
              </Link>
              <Link href="/signup">
                <button className="main-btn bg-[#2563EB] px-4 py-1.5 md:px-6 md:py-1.5 rounded-lg text-sm md:text-base text-[#FAFAFA] hover:bg-[#043fc1] transition-all duration-250 ease-in cursor-pointer">
                  Start Securing Cargo
                </button>
              </Link>
            </div>
          </div>
          
          {/* Desktop Dashboard Image */}
          <div className="hidden md:block">
            <Image 
              src="/landing/dash.png" 
              alt="Cargo Guard Dashboard" 
              width={1200}
              height={600}
              className="w-[90%] mx-auto shadow-[0_4px_37px_0px_#2563eb36] rounded-t-[16px]"
              priority
            />
          </div>
        </div>
        {/* Mobile Dashboard Image */}
          <div className="md:hidden w-full">
            <Image 
              src="/landing/mob-dash.png" 
              alt="Cargo Guard Dashboard Mobile" 
              width={600}
              height={400}
              className="w-[96%] shadow-[0_4px_37px_0px_#2563eb36] rounded-tr-[16px]"
              priority
            />
          </div>
      </header>
    </div>
  )
}