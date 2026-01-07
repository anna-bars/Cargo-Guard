// components/widgets/WelcomeWidget.tsx
import React from 'react';

interface WelcomeWidgetProps {
  userName?: string;
}

export const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({ 
  userName = "Lucas" 
}) => {
  return (
    <div className="
      relative rounded-2xl overflow-hidden w-full transition-shadow duration-300 
      flex-grow min-h-[calc(41%-4px)] xl:flex-[0_0_38.5%] xl:min-h-auto xl:h-auto
      max-[1336px]:h-[352px] max-[1336px]:w-full
      max-[1280px]:h-auto max-[1280px]:min-h-[260px] max-[1280px]:w-full max-[1280px]:flex-grow
      max-[1024px]:w-[49%] max-[1024px]:min-h-[180px] max-[1024px]:max-h-[200px] max-[1024px]:flex-shrink
      max-[768px]:flex-shrink-0 max-[768px]:w-[85%] max-[768px]:min-h-[250px] 
      max-[768px]:max-h-[280px]
    ">
      <img 
        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/frame-76.png" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 p-4 h-full flex flex-col 
        max-[1336px]:h-full
        max-[1280px]:h-full
        max-[1024px]:justify-between
      ">
        <h2 className="
          font-montserrat text-[20px] font-normal text-white mb-0
          max-[1336px]:text-[20px] max-[1336px]:mb-1.5
          max-[1280px]:text-[18px] max-[1280px]:mb-1.5
          max-[480px]:text-[18px]
        ">
          Welcome back, {userName}!
        </h2>
        <p className="
          font-montserrat text-[14px] font-normal text-white/85 mb-auto max-w-[224px]
          max-[1336px]:mb-auto max-[1336px]:max-w-full
          max-[1280px]:mb-auto max-[1280px]:max-w-full max-[1280px]:text-[12px]
          max-[1024px]:mb-0 max-[1024px]:max-w-none max-[1024px]:text-[12px]
        ">
          Everything's under control — let's make this day productive.
        </p>
        
        <div className="flex items-end justify-between gap-[40px] 
          max-[1336px]:max-w-full max-[1336px]:gap-[40px]
          max-[1280px]:max-w-full
          max-[1024px]:max-w-full
        ">
          <h3 className="
            font-montserrat text-[24px] font-medium text-white leading-[27px] 
            tracking-[0.64px] max-w-[224px]
            max-[1336px]:text-[26px] max-[1336px]:font-medium max-[1336px]:leading-[33px] 
            max-[1336px]:tracking-[0.64px] max-[1336px]:max-w-[224px]
            max-[1280px]:text-[22px] max-[1280px]:leading-[28px] max-[1280px]:max-w-[224px]
            max-[480px]:text-[20px] max-[480px]:leading-[24px]
          ">
            Get Your New Quote Instantly
          </h3>

          <img 
            src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-84.png" 
            alt="Arrow" 
            className="
              outline-[4px] outline-[#f4f4f1] rounded-full w-[42px] h-[42px] 
              hover:scale-102 transition-transform duration-300
            "
          />
        </div>
      </div>
    </div>
  );
};