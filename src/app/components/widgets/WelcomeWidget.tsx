// src/app/components/widgets/WelcomeWidget.tsx
'use client'

interface WelcomeWidgetProps {
  userName?: string
}

export default function WelcomeWidget({ userName = "Lucas" }: WelcomeWidgetProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden w-full welcome-widget transition-shadow duration-300 flex-grow"
         style={{ minHeight: 'calc(41% - 4px)' }}>
      <img 
        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/frame-76.png" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 p-4 h-full flex flex-col action-content">
        <h2 className="font-montserrat text-[20px] font-normal text-white mb-0 welcome-title">
          Welcome back, {userName}!
        </h2>
        <p className="font-montserrat text-[14px] font-normal text-[#ffffffd9] mb-auto max-w-[224px] welcome-subtitle action-subtitle">
          Everything's under control — let's make this day productive.
        </p>
        
        <div className="flex items-end justify-between gap-[40px] action-buttons">
          <h3 className="font-montserrat text-[24px] !font-medium text-white leading-[27px] tracking-[0.64px] max-w-[224px] cta-title">
            Get Your New Quote Instantly
          </h3>

          <img 
            src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-84.png" 
            alt="Arrow" 
            className="outline-[4px] outline-[#f4f4f1] rounded-full w-[42px] h-[42px] hover:scale-102 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  )
}