// components/widgets/PerformanceOverview.tsx
import React from 'react';

interface MetricItem {
  id: string;
  value: string;
  decimal: string;
  prefix?: string;
  suffix?: string;
  label: string;
  hasArrow?: boolean;
  arrowDirection?: 'up' | 'down';
}

interface PerformanceOverviewProps {
  title?: string;
  timePeriod?: string;
  metrics?: MetricItem[];
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({
  title = "Performance Overview",
  timePeriod = "This Month",
  metrics = [
    {
      id: 'insured-amount',
      value: '84',
      decimal: '5k',
      prefix: '$',
      label: 'Total Insured Amount',
      hasArrow: false
    },
    {
      id: 'active-policies',
      value: '8',
      decimal: '47',
      suffix: '%',
      label: 'Active Policies',
      hasArrow: true,
      arrowDirection: 'up'
    },
    {
      id: 'quotes-awaiting',
      value: '3',
      decimal: '',
      suffix: '%',
      label: 'Quotes Awaiting Approval',
      hasArrow: true,
      arrowDirection: 'down'
    },
    {
      id: 'contracts-expire',
      value: '2',
      decimal: '',
      suffix: '%',
      label: 'Contracts Due to Expire',
      hasArrow: true,
      arrowDirection: 'down'
    },
    {
      id: 'documents-uploads',
      value: '1',
      decimal: '',
      suffix: '%',
      label: 'Required Document Uploads',
      hasArrow: true,
      arrowDirection: 'down'
    }
  ]
}) => {
  return (
    <section className="
      border border-[#d1d1d1]/33 bg-[#fafaf7]/80 rounded-2xl p-4 h-auto
      max-[768px]:p-4
    ">
      <div className="flex justify-between items-start mb-2 
        max-[1336px]:items-center
        max-[1280px]:items-center
        max-[1024px]:items-center
      ">
        <div>
          <h2 className="
            font-montserrat text-[16px] font-normal text-black
            max-[1336px]:text-[16px]
            max-[1280px]:text-[16px]
            max-[1024px]:text-[14px]
          ">
            {title}
          </h2>
        </div>
        <div className="
          flex items-center gap-3 px-3 py-2 rounded-lg border border-[#c7c7c7]/51 
          hover:border-[#a0a0a0]/51 transition-colors duration-300 cursor-pointer
        ">
          <span className="font-montserrat text-[12px] font-normal text-[#7b7b7b]">
            {timePeriod}
          </span>
          <img 
            src="https://c.animaapp.com/mjiggi0jSqvoj5/img/arrow-3-1.svg" 
            alt="Dropdown" 
            className="w-2 h-1"
          />
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="
        flex justify-around xl:flex-nowrap gap-8 xl:gap-2 
        max-[1336px]:justify-around max-[1336px]:gap-2
        max-[1280px]:justify-around max-[1280px]:gap-2
        max-[1024px]:flex max-[1024px]:gap-8 max-[1024px]:px-5
        max-[768px]:flex-wrap max-[768px]:gap-4 max-[768px]:gap-y-8 max-[768px]:justify-start
      ">
        {metrics.map((metric) => (
          <div 
            key={metric.id}
            className="
              w-[43%] xl:w-[12%]
              max-[1336px]:w-[12%]
              max-[1280px]:w-[12%]
              max-[1024px]:w-[43%]
            "
          >
            <div className="relative">
              <div className="
                font-montserrat text-[46px] xl:text-[46px] font-normal text-black 
                flex items-baseline relative
                max-[1336px]:text-[46px]
                max-[1280px]:text-[46px]
                max-[768px]:text-[38px] max-[768px]:font-light
              ">
                <span className="text-black tracking-[1.28px]">{metric.value}.</span>
                
                {/* Decimal part or Arrow */}
                {metric.decimal ? (
                  <span className="text-[#c7c7c7] tracking-[1.28px]">{metric.decimal}</span>
                ) : metric.hasArrow ? (
                  <img 
                    className="w-7 ml-1.5" 
                    src="/dashboard/arrow.svg" 
                    alt="Arrow" 
                    style={{ width: '28px', marginLeft: '6px' }}
                  />
                ) : null}
                
                {/* Prefix/Suffix - սլաները ձախից */}
                {metric.prefix && (
                  <span className="absolute -left-5 top-3 text-[12px]">{metric.prefix}</span>
                )}
                
                {metric.suffix && (
                  <span className="absolute -left-5 top-3 text-[12px]">{metric.suffix}</span>
                )}
                
                {/* Arrow indicators - սլաները աջից */}
                {metric.hasArrow && metric.arrowDirection === 'up' && (
                  <span className="absolute -right-5 top-3 text-[12px]">
                    <img src="/dashboard/top-arrow.svg" alt="Up arrow" />
                  </span>
                )}
                
                {metric.hasArrow && metric.arrowDirection === 'down' && (
                  <span className="absolute -right-5 top-3 text-[12px]">
                    <img src="/dashboard/top-arrow.svg" alt="Down arrow" />
                  </span>
                )}
              </div>
            </div>
            <p className="
              font-montserrat text-[12px] font-normal text-[#c7c7c7] mt-1
              max-[768px]:mt-[-8px] max-[768px]:text-[10px] max-[768px]:w-[74%]
            ">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};