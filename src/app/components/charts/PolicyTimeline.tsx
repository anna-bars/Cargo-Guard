import React, { useState, useEffect } from 'react';

interface PolicyTimelineWidgetProps {
  percentage?: number;
  expiringPolicies?: number;
  totalPolicies?: number;
}

export const PolicyTimelineWidget: React.FC<PolicyTimelineWidgetProps> = ({
  percentage = 71,
  expiringPolicies = 7,
  totalPolicies = 22
}) => {
  const scoreNumber = percentage.toString();
  const [isHovered, setIsHovered] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Անիմացիա համար
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [isHovered, percentage]);

  return (
    <div 
      className="
        relative w-full font-montserrat flex-grow min-h-[calc(29%-4px)] 
        xl:flex-[0_0_31%] xl:min-h-auto xl:h-auto
        max-[1336px]:flex-grow max-[1336px]:min-h-auto max-[1336px]:h-auto
        max-[1280px]:flex-grow max-[1280px]:min-h-[240px] max-[1280px]:h-[240px] max-[1280px]:block
        max-[768px]:w-[49%] max-[1024px]:min-h-[240px] max-[1024px]:max-h-[240px]
        max-[1024px]:block
        max-[768px]:flex-shrink-0 max-[768px]:w-[100%] max-[768px]:min-h-[240px] 
        max-[768px]:max-h-[280px]
        max-[480px]:w-[100%] max-[480px]:min-h-[100%] max-[480px]:max-h-[100%]
        backdrop-blur-[10px] rounded-[16px] p-4 justify-between
        flex flex-col gap-0 border border-[#d1d1d154] bg-[#fdfdf8cf] rounded-2xl p-4 
        hover:shadow-sm transition-all duration-300 ease-out
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Title */}
      <h3 className="
        text-[18px] font-medium text-black tracking-[0.36px] leading-normal
        max-[1024px]:text-[16px]
        max-[768px]:text-[17px]
        max-[480px]:text-[15px]
        transition-all duration-300 ease-out
      ">
        Policy Expiration Timeline
      </h3>

      {/* Score Display */}
      <div className="flex flex-row items-end relative gap-4">
        <div className="flex items-center gap-[3px]">
          <span className="
            text-[10px] font-normal text-black tracking-[0.20px] leading-[12px]
            max-[1024px]:text-[9px]
            max-[480px]:text-[8px]
            absolute -top-[5px]
          ">%</span>
          
          <span className="
            text-[56px] font-normal text-black tracking-[1.12px] leading-[36px]
            max-[1024px]:text-[48px] max-[1024px]:tracking-[0.96px]
            max-[768px]:text-[50px]
            max-[480px]:text-[42px] max-[480px]:tracking-[0.84px]
            ml-4
            transition-all duration-300 ease-out
          ">
            {scoreNumber}
          </span>
          
        </div>
        
        <span className="
          text-[12px] font-medium text-[#c7c7c7] tracking-[0.24px] leading-normal
          max-[1024px]:text-[11px]
          max-[480px]:text-[10px]
          transition-all duration-300 ease-out
        ">
          Policies
        </span>
      </div>

      {/* Expiration Info */}
      <p className="
        text-[12px] font-medium text-[#c7c7c7] tracking-[0.24px] leading-normal
        max-[1024px]:text-[11px]
        max-[480px]:text-[10px]
        transition-all duration-300 ease-out
      ">
        Total expiring policies: {expiringPolicies} / {totalPolicies}
      </p>

      {/* Chart Container */}
      <div className="flex flex-col gap-2 flex-col-reverse">
        {/* Chart Labels */}
        <div className="
          flex justify-between items-center
          w-[340px] max-w-full
          max-[1024px]:w-[300px]
          max-[768px]:w-[320px]
          max-[480px]:w-full
        ">
          <span className="
            text-[12px] font-normal text-[#c7c7c7] tracking-[0.32px]
            transition-all duration-300 ease-out
          ">
            0%
          </span>
          
          <span className="
            text-[12px] font-normal text-black tracking-[0.32px]
            transition-all duration-300 ease-out
          ">
            50%
          </span>
          
          <span className="
            text-[12px] font-normal text-[#c7c7c7] tracking-[0.32px]
            transition-all duration-300 ease-out
          ">
            100%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div 
          className="
            relative w-[340px] h-[28px] max-w-full
            max-[1024px]:w-[300px]
            max-[768px]:w-[320px]
            max-[480px]:w-full max-[480px]:h-[24px]
            group
          "
        >
          {/* Progress Track */}
          <div className="
            absolute top-[10px] left-0 w-full h-[4px]
            bg-[rgba(252,220,162,0.5)] rounded-[58px]
            max-[480px]:top-[8px] max-[480px]:h-[3px]
            transition-all duration-300 ease-out
            overflow-hidden
          ">
            {/* Progress Fill with Glow Effect */}
            <div 
              className="
                absolute top-0 left-0 h-full bg-[#FCDCA2] rounded-[58px]
                transition-all duration-700 ease-out
                group-hover:shadow-[0_0_15px_rgba(252,220,162,0.8)]
                group-hover:brightness-110
              "
              style={{ width: `${animatedPercentage}%` }}
            >
              {/* Inner Glow Effect */}
              <div className="
                absolute inset-0 w-full h-full
                bg-gradient-to-r from-transparent via-white/20 to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500 ease-out
              "></div>
            </div>
          </div>

          {/* Gradient Bar with Enhanced Hover */}
          <div 
            className="
              absolute top-[4px] left-0 h-[16px]
              max-[1024px]:h-[16px]
              max-[768px]:h-[16px]
              max-[480px]:h-[14px] max-[480px]:top-[3px]
              transition-all duration-700 ease-out
              group-hover:scale-y-110
              group-hover:origin-bottom
            " 
            style={{ width: `${animatedPercentage + 10}%` }}
          >
            <img 
              src="/shipments/bar.svg" 
              alt="Gradient bar" 
              className="
                w-full h-full object-contain
                transition-all duration-500 ease-out
                group-hover:brightness-125
                group-hover:contrast-110
              "
            />
            
            {/* Overlay Glow Effect */}
            <div className="
              absolute inset-0 w-full h-full
              opacity-0 group-hover:opacity-40
              transition-opacity duration-500 ease-out
              bg-gradient-to-r from-transparent via-yellow-100 to-transparent
              blur-[2px]
            "></div>
          </div>

          {/* Triangle Pointer with Enhanced Hover */}
          <div 
            className="
              absolute top-[-1px] w-[27px] h-[25px]
              pointer-events-none transition-all duration-700 ease-out
              max-[1024px]:w-[24px] max-[1024px]:h-[22px]
              max-[480px]:w-[20px] max-[480px]:h-[18px]
              group-hover:scale-110
              group-hover:drop-shadow-[0_0_8px_rgba(252,220,162,0.9)]
              group-hover:z-10
            "
            style={{ 
              left: `calc(${animatedPercentage}% - ${window.innerWidth < 480 ? 10 : window.innerWidth < 1024 ? 12 : 13.5}px)`,
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
            }}
          >
            <img 
              src="/shipments/bar0.svg" 
              alt="Progress pointer"
              className="
                w-full h-full object-contain
                transition-all duration-500 ease-out
                group-hover:brightness-110
              "
            />
            
            {/* Pointer Glow */}
            <div className="
              absolute inset-0 w-full h-full
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500 ease-out
              bg-gradient-to-b from-yellow-200/30 to-transparent
              blur-[3px]
            "></div>
          </div>

          {/* Pulse Effect on Hover */}
          {isHovered && (
            <div className="
              absolute top-[10px] h-[4px]
              rounded-[58px]
              transition-all duration-300 ease-out
              animate-pulse
            "
            style={{ 
              width: `${animatedPercentage}%`,
              background: 'linear-gradient(90deg, rgba(252,220,162,0.3) 0%, rgba(252,220,162,0.6) 50%, rgba(252,220,162,0.3) 100%)',
              boxShadow: '0 0 20px rgba(252,220,162,0.4)'
            }}>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};