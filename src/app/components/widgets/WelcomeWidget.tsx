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
      max-[1280px]:h-auto max-[1280px]:min-h-[240px] max-[1280px]:w-full max-[1280px]:flex-grow
      max-[768px]:w-[49%] max-[1280px]:min-h-[240px] max-[1024px]:max-h-[240px] max-[1024px]:flex-shrink
      max-[768px]:flex-shrink-0 max-[768px]:w-[100%] max-[768px]:min-h-[240px] 
      max-[768px]:max-h-[280px]
      max-[480px]:w-[100%] max-[480px]:min-h-[100%] max-[480px]:max-h-[100%]
    ">
      <img 
        src="https://c.animaapp.com/mjiggi0jSqvoj5/img/frame-76.png" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="max-[480px]:min-h-[240px] relative z-10 p-4 h-full flex flex-col justify-between
        max-[1024px]:p-3 max-[1024px]:min-h-[240px] max-[1280px]:min-h-[240px]
        max-[480px]:p-4
        max-[768px]:min-h-[240px]
      ">
        <div>
          <h2 className="
            font-montserrat font-normal text-white mb-2
            text-2xl xl:text-[20px] lg:text-xl md:text-lg sm:text-base
            max-[1336px]:text-xl max-[1336px]:mb-1.5
            max-[1280px]:text-lg max-[1280px]:mb-1.5
            max-[1024px]:text-base max-[1024px]:mb-1
            max-[768px]:text-lg max-[768px]:mb-2
            max-[480px]:text-base max-[480px]:mb-1.5
          ">
            Welcome back, {userName}!
          </h2>
          <p className="
            font-montserrat font-normal text-white/85 max-w-[224px]
            text-base xl:text-sm lg:text-sm md:text-xs
            max-[1336px]:max-w-full max-[1336px]:text-sm
            max-[1280px]:max-w-full max-[1280px]:text-xs
            max-[1024px]:max-w-none max-[1024px]:text-xs
            max-[768px]:text-sm max-[768px]:max-w-[90%]
            max-[480px]:text-xs max-[480px]:max-w-full
          ">
            Everything's under control — let's make this day productive.
          </p>
        </div>
        
        <div className="flex items-end justify-between gap-[40px] 
          max-[1336px]:max-w-full max-[1336px]:gap-[40px]
          max-[1280px]:max-w-full max-[1280px]:gap-[30px]
          max-[1024px]:max-w-full max-[1024px]:gap-[20px] max-[1024px]:items-center
          max-[768px]:gap-[30px] max-[768px]:items-end
          max-[480px]:gap-[20px] max-[480px]:items-center
        ">
          <h3 className="
            font-montserrat font-medium text-white leading-tight tracking-[0.64px]
            text-2xl xl:text-[24px] lg:text-xl md:text-lg sm:text-base
            max-w-[224px]
            max-[1336px]:text-[26px] max-[1336px]:font-medium max-[1336px]:leading-[33px] 
            max-[1336px]:tracking-[0.64px] max-[1336px]:max-w-[224px]
            max-[1280px]:text-[22px] max-[1280px]:leading-[28px] max-[1280px]:max-w-[224px]
            max-[1024px]:text-lg max-[1024px]:leading-snug max-[1024px]:max-w-[180px]
            max-[768px]:text-xl max-[768px]:leading-tight max-[768px]:max-w-[200px]
            max-[480px]:text-base max-[480px]:leading-normal max-[480px]:max-w-[150px] max-[480px]:tracking-normal
          ">
            Get Your New Quote Instantly
          </h3>

          <img 
            src="https://c.animaapp.com/mjiggi0jSqvoj5/img/group-84.png" 
            alt="Arrow" 
            className="
              outline-[4px] outline-[#f4f4f1] rounded-full 
              w-[42px] h-[42px] lg:w-10 lg:h-10 md:w-9 md:h-9 sm:w-8 sm:h-8
              hover:scale-102 transition-transform duration-300
              max-[1024px]:w-9 max-[1024px]:h-9
              max-[480px]:w-8 max-[480px]:h-8
            "
          />
        </div>
      </div>
    </div>
  );
};