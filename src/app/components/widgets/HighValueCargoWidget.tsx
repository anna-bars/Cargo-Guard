// components/widgets/HighValueCargoWidget.tsx
import React from 'react';

interface HighValueCargoWidgetProps {
  percentage?: number;
  mtdValue?: string;
}

export const HighValueCargoWidget: React.FC<HighValueCargoWidgetProps> = ({
  percentage = 75.55,
  mtdValue = "62,3k"
}) => {
  const percentageStr = percentage.toFixed(2);
  const [whole, decimal] = percentageStr.split('.');

  return (
    <div className="
      relative w-full font-montserrat flex-grow min-h-[calc(29%-4px)] 
      xl:flex-[0_0_28%] xl:min-h-auto xl:h-auto
      max-[1336px]:flex-grow max-[1336px]:min-h-auto max-[1336px]:h-auto
      max-[1280px]:flex-grow max-[1280px]:min-h-auto max-[1280px]:h-auto max-[1280px]:block
      max-[1024px]:w-[49%] max-[1024px]:min-h-[180px] max-[1024px]:max-h-[200px]
      max-[1024px]:block
      max-[768px]:flex-shrink-0 max-[768px]:w-[85%] max-[768px]:min-h-[250px] 
      max-[768px]:max-h-[280px]
    ">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#fafcffcc] rounded-xl"></div>
      
      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[#3c3c3c] text-[16px] font-normal tracking-[0.24px] w-[60%] leading-tight">
            High-value cargo insured this month
          </h3>

          <div className="relative">
            <span className="absolute -left-1 top-0 text-white/84 text-[4px] tracking-[0.08px]">$</span>
            <div className="bg-[#71a3ef] rounded-[20px] px-2 py-0.5 flex items-center justify-center">
              <span className="text-white text-xs tracking-[0.24px]">
                <span className="tracking-[0.04px]">MTD · {mtdValue.split(',')[0]},</span>
                <span className="text-white/80 tracking-[0.04px]">{mtdValue.split(',')[1]}</span>
              </span>
            </div>
          </div>
        </div>

        <div>
          {/* Percentage Section */}
          <div className="flex mb-3 items-end justify-start">
            <div className="flex items-start gap-0.5 mb-0.5">
              <span className="text-black text-[42px] tracking-[0.84px] leading-none">
                <span className="tracking-[0.54px]">{whole}.</span>
                <span className="text-[#c7c7c7] tracking-[0.54px]">{decimal}</span>
              </span>
              <span className="text-black text-[7px] tracking-[0.14px] mt-[9px]">%</span>
            </div>
            
            <p className="text-[#c7c7c7] text-xs tracking-[0.24px] text-right leading-tight w-[50%] text-left mb-1">
              of total insured value this month
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="relative h-5">
              <div 
                className="absolute top-1 left-0 h-3 bg-gradient-to-r from-[#bfd5f8] to-[#669cee] rounded-l-[40px] rounded-r-none"
                style={{ width: `${percentage}%` }}
              ></div>
              <div 
                className="absolute top-1 h-3 bg-gradient-to-r from-[#6da1ef4f] to-[#f6f8fa40] rounded-r-[40px] rounded-l-none"
                style={{ left: `${percentage}%`, width: `${100 - percentage}%` }}
              ></div>
              <img 
                className="absolute top-[-0.5px] w-[20px] h-[20px]" 
                src="https://c.animaapp.com/mk1qdxa5LsxC7P/img/polygon-1.svg" 
                alt="Progress marker"
                style={{ left: `calc(${percentage}% - 10px)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};