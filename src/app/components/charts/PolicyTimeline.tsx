import React from 'react';

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

  return (
    <div className="
      relative w-full font-montserrat flex-grow min-h-[calc(29%-4px)] 
      xl:flex-[0_0_28%] xl:min-h-auto xl:h-auto
      max-[1336px]:flex-grow max-[1336px]:min-h-auto max-[1336px]:h-auto
      max-[1280px]:flex-grow max-[1280px]:min-h-[240px] max-[1280px]:h-[240px] max-[1280px]:block
      max-[768px]:w-[49%] max-[1024px]:min-h-[240px] max-[1024px]:max-h-[240px]
      max-[1024px]:block
      max-[768px]:flex-shrink-0 max-[768px]:w-[100%] max-[768px]:min-h-[240px] 
      max-[768px]:max-h-[280px]
      max-[480px]:w-[100%] max-[480px]:min-h-[100%] max-[480px]:max-h-[100%]
      backdrop-blur-[10px] rounded-[16px] p-6
      flex flex-col gap-5 border border-[#d1d1d154] bg-[#fdfdf8cf] rounded-2xl p-4 hover:shadow-sm transition-shadow duration-300
    ">
      {/* Card Title */}
      <h2 className="
        text-[18px] font-medium text-black tracking-[0.36px] leading-normal
        max-[1024px]:text-[16px]
        max-[768px]:text-[17px]
        max-[480px]:text-[15px]
      ">
        Policy Expiration Timeline
      </h2>

      {/* Score Display */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-[3px]">
          <span className="
            text-[10px] font-normal text-black tracking-[0.20px] leading-[12px]
            max-[1024px]:text-[9px]
            max-[480px]:text-[8px]
          ">%</span>
          
          <span className="
            text-[56px] font-normal text-black tracking-[1.12px] leading-[36px]
            max-[1024px]:text-[48px] max-[1024px]:tracking-[0.96px]
            max-[768px]:text-[50px]
            max-[480px]:text-[42px] max-[480px]:tracking-[0.84px]
          ">
            {scoreNumber}
          </span>
          
        </div>
        
        <span className="
          text-[12px] font-medium text-[#c7c7c7] tracking-[0.24px] leading-normal
          max-[1024px]:text-[11px]
          max-[480px]:text-[10px]
        ">
          Policies
        </span>
      </div>

      {/* Expiration Info */}
      <p className="
        text-[12px] font-medium text-[#c7c7c7] tracking-[0.24px] leading-normal
        max-[1024px]:text-[11px]
        max-[480px]:text-[10px]
      ">
        Total expiring policies: {expiringPolicies}
      </p>

      {/* Chart Container */}
      <div className="flex flex-col gap-2">
        {/* Chart Labels */}
        <div className="
          flex justify-between items-center
          w-[340px] max-w-full
          max-[1024px]:w-[300px]
          max-[768px]:w-[320px]
          max-[480px]:w-full
        ">
          <span className="
            text-[16px] font-normal text-[#c7c7c7] tracking-[0.32px]
            max-[1024px]:text-[14px]
            max-[480px]:text-[12px]
          ">
            0%
          </span>
          
          <span className="
            text-[16px] font-normal text-black tracking-[0.32px]
            max-[1024px]:text-[14px]
            max-[480px]:text-[12px]
          ">
            50%
          </span>
          
          <span className="
            text-[16px] font-normal text-[#c7c7c7] tracking-[0.32px]
            max-[1024px]:text-[14px]
            max-[480px]:text-[12px]
          ">
            100%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="
          relative w-[340px] h-[28px] max-w-full
          max-[1024px]:w-[300px]
          max-[768px]:w-[320px]
          max-[480px]:w-full max-[480px]:h-[24px]
        ">
          {/* Progress Track */}
          <div className="
            absolute top-[10px] left-0 w-full h-[4px]
            bg-[rgba(252,220,162,0.5)] rounded-[58px]
            max-[480px]:top-[8px] max-[480px]:h-[3px]
          ">
            {/* Progress Fill */}
            <div 
              className="
                absolute top-0 left-0 h-full bg-[#FCDCA2] rounded-[58px]
                transition-all duration-300 ease-out
              "
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {/* Gradient Bar */}
          <div className="
            absolute top-[4px] left-0 w-[281px] h-[16px]
            max-[1024px]:w-[250px]
            max-[768px]:w-[270px]
            max-[480px]:w-[calc(100%-40px)] max-[480px]:top-[3px] max-[480px]:h-[14px]
          ">
            <img 
              src="/shipments/bar.svg" 
              alt="Gradient bar" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Triangle Pointer */}
          <div 
            className="
              absolute top-[-1px] w-[27px] h-[25px]
              pointer-events-none transition-all duration-300 ease-out
              max-[1024px]:w-[24px] max-[1024px]:h-[22px]
              max-[480px]:w-[20px] max-[480px]:h-[18px]
            "
            style={{ left: `calc(${percentage}% - ${window.innerWidth < 480 ? 10 : window.innerWidth < 1024 ? 12 : 13.5}px)` }}
          >
            <img 
              src="/shipments/bar0.svg" 
              alt="Progress pointer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Total Policies */}
      <p className="
        text-[12px] font-medium text-[#c7c7c7] tracking-[0.24px] leading-normal mt-2
        max-[1024px]:text-[11px]
        max-[480px]:text-[10px]
      ">
        Total policies: {totalPolicies}
      </p>
    </div>
  );
};