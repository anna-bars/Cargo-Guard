'use client'

import { useState } from 'react'

interface QuotesExpirationCardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const QuotesExpirationCard = ({ activeTab = 'This Week', onTabChange }: QuotesExpirationCardProps) => {
  const tabs = ['This Week', 'Next Week', 'In 2–4 Weeks', 'Next Month'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const totalQuotes = 22;
  const expiringQuotes = 7;
  const expiringRate = Math.round((expiringQuotes / totalQuotes) * 100);
  
  const chartItems = Array.from({ length: totalQuotes });
  const activeItemsCount = Math.round((expiringRate / 100) * totalQuotes);

  const handleTabSelect = (tab: string) => {
    onTabChange?.(tab);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <style jsx>{`
        .chart-div-active-item {
          background-color: #ee9f66;
          height: 20px;
        }
        .chart-div-item, .chart-div-active-item {
          transform-origin: 0;
          width: 1px;
          transform: scaleX(2);
        }
        .chart-div-item {
          background-color: #e2e3e4;
          height: 24px;
        }
        .chaart {
          justify-content: start;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
          display: flex;
          overflow: hidden;
        }
      `}</style>

      <div className="stats-card bg-[#fafbf6]/80 rounded-2xl p-4">
        <div className="card-header mb-6 flex justify-between items-start">
          <h3 className="font-montserrat text-lg font-medium text-black mb-0">Quotes Expiration</h3>
          
          {/* Dropdown աջ անկյունում */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 font-montserrat text-xs font-medium text-[#6f6f6f] tracking-[0.24px] cursor-pointer whitespace-nowrap px-3 py-1 border border-[#e2e3e4] rounded-lg hover:bg-gray-50 transition-colors"
            >
              {activeTab}
              <svg 
                className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white min-w-[120px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-lg z-10 py-1">
                {tabs.map((tab) => (
                  <div 
                    key={tab}
                    onClick={() => handleTabSelect(tab)}
                    className={`
                      px-4 py-2 cursor-pointer font-montserrat text-xs font-medium tracking-[0.24px]
                      hover:bg-gray-50 transition-colors
                      ${activeTab === tab 
                        ? 'text-[#6f6f6f] underline' 
                        : 'text-[#6f6f6f]'
                      }
                    `}
                  >
                    {tab}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* ... մնացած նույն կոդը ... */}
        <div className="expiration-stats relative w-[149px] h-[73.5px] mb-6">
          <div className="expiration-left absolute top-0 left-0.5 w-[143px] h-11 flex gap-3">
            <div className="expiration-rate w-20 h-10 flex gap-1 items-baseline">
              <span className="rate-number font-montserrat text-[56px] text-black font-normal tracking-[1.12px] leading-10 w-16">
                {expiringRate}
              </span>
              <span className="rate-symbol font-montserrat text-xs text-black font-normal tracking-[0.20px] w-2">
                %
              </span>
            </div>
          </div>
          <div className="expiration-right absolute top-14 left-0">
            <span className="expiration-total font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px] whitespace-nowrap">
              Total expiring quotes: {expiringQuotes}
            </span>
          </div>
        </div>
        
        <div className="chaart">
          {chartItems.map((_, index) => (
            <div 
              key={index}
              className={index < activeItemsCount ? 'chart-div-active-item' : 'chart-div-item'}
            />
          ))}
        </div>
        
        <div className="expiration-chart flex flex-col gap-3">
          <span className="chart-label font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px]">
            Total quotes: {totalQuotes}
          </span>
        </div>
      </div>
    </>
  );
};

export default QuotesExpirationCard;