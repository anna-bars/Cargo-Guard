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
        <div className="w-[94%] mx-auto">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="toolbar">
              <Link href="/">
                <Image 
                  src="/landing/logo.svg" 
                  alt="Cargo Guard Logo" 
                  width={120} 
                  height={40}
                  priority
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 items-center">
              <Link href="#" className="text-sm text-[#535C65] hover:text-[#163e66] transition-colors duration-250">
                Why Cargo Guard
              </Link>
              <Link href="#" className="text-sm text-[#535C65] hover:text-[#163e66] transition-colors duration-250">
                How It Works
              </Link>
              <Link href="#" className="text-sm text-[#535C65] hover:text-[#163e66] transition-colors duration-250">
                Results
              </Link>
              <Link href="#" className="text-sm text-[#535C65] hover:text-[#163e66] transition-colors duration-250">
                Platform
              </Link>
            </nav>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex gap-3">
                <Link href="/login">
                  <button className="text-sm text-[#2a2a2a] px-4 py-1.5 hover:text-[#0a0891] transition-colors duration-250">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="text-sm text-[#FAFAFA] px-4 py-1.5 bg-[#63686C] rounded-lg hover:bg-[#191b1c] transition-colors duration-250">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Mobile Hamburger Button - Client Component */}
            <ClientMobileMenu />
          </div>
          
          {/* Hero Section */}
          <div className="py-10 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="w-fit mx-auto flex items-center gap-3 bg-white/56 rounded-full pr-3">
                <Image 
                  src="/landing/flash.svg" 
                  alt="Flash Icon" 
                  width={28} 
                  height={28}
                  className="md:w-7 md:h-7"
                />
                <p className="text-sm md:text-sm font-normal text-[#4C4C4C]">
                  FINALLY. LOGISTICS MOVES AT YOUR SPEED.
                </p>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#4C4C4C] text-center mx-auto leading-tight md:leading-[48px] w-full md:w-[82%] lg:w-[66%] xl:w-[51%]">
                Cargo Insurance, Simplified.{' '}
                <span className="text-[#2563EB] font-medium">Instant Quotes. Zero Paperwork.</span>
              </h1>
              
              <p className="text-base text-[#4C4C4C] text-center mx-auto w-full md:w-[90%] lg:w-[72%] xl:w-[43%]">
                The first fully digital platform to secure your global freight against risk, powered by smart compliance tools.
              </p>
            </div>
            
            <div className="w-fit mx-auto flex flex-col sm:flex-row gap-4">
              <Link href="/quote">
                <button className="bg-transparent border-none px-0 py-1.5 text-base md:text-base text-[#2F2F2F] hover:text-[#2563eb] transition-colors duration-250 cursor-pointer">
                  Get An Instant Quote
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-[#2563EB] px-6 py-1.5 rounded-lg text-base md:text-base text-[#FAFAFA] hover:bg-[#043fc1] transition-colors duration-250 cursor-pointer">
                  Start Securing Cargo
                </button>
              </Link>
            </div>
          </div>
          
          {/* Desktop Dashboard Image */}
          <Image 
            src="/landing/dash.png" 
            alt="Cargo Guard Dashboard" 
            width={1200}
            height={600}
            className="w-[90%] mx-auto block shadow-[0_4px_37px_0px_#2563eb36] rounded-t-2xl mt-8 hidden md:block"
            priority
          />
          
          {/* Mobile Dashboard Image */}
          <Image 
            src="/landing/mob-dash.png" 
            alt="Cargo Guard Dashboard Mobile" 
            width={600}
            height={400}
            className="w-[96%] mx-auto block shadow-[0_4px_37px_0px_#2563eb36] rounded-tr-2xl mt-8 md:hidden"
            priority
          />
        </div>
      </header>
    </div>
  )
}