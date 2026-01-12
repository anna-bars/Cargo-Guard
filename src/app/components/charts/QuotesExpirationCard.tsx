'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface QuotesExpirationCardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface ExpirationData {
  totalQuotes: number;
  expiringQuotes: number;
  expiringRate: number;
}

const QuotesExpirationCard = ({ activeTab = 'This Week', onTabChange }: QuotesExpirationCardProps) => {
  const tabs = ['This Week', 'Next Week', 'In 2–4 Weeks', 'Next Month'];
  
  // Մոկ տվյալներ յուրաքանչյուր ժամանակահատվածի համար
  const expirationData: Record<string, ExpirationData> = {
    'This Week': { totalQuotes: 22, expiringQuotes: 7, expiringRate: 32 },
    'Next Week': { totalQuotes: 18, expiringQuotes: 5, expiringRate: 28 },
    'In 2–4 Weeks': { totalQuotes: 35, expiringQuotes: 12, expiringRate: 34 },
    'Next Month': { totalQuotes: 42, expiringQuotes: 9, expiringRate: 21 }
  };
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [barsCount, setBarsCount] = useState(60);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { totalQuotes, expiringQuotes, expiringRate } = expirationData[activeTab];
  
  // Հաշվել գծիկների քանակը՝ կախված container-ի լայնությունից
  const calculateBarsCount = useCallback((width: number) => {
    if (width <= 200) return 40;
    if (width <= 280) return 50;
    if (width <= 350) return 60;
    return 70;
  }, []);

  useEffect(() => {
    const updateBarsCount = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setBarsCount(calculateBarsCount(width));
      }
    };

    updateBarsCount();
    window.addEventListener('resize', updateBarsCount);
    
    return () => {
      window.removeEventListener('resize', updateBarsCount);
    };
  }, [calculateBarsCount]);

  // Անիմացիա երբ փոխվում է tab-ը
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Տվյալների մասնաբաժինները գծիկների համար
  const calculateBarDistribution = () => {
    const activePercentage = expiringRate / 100;
    const activeBars = Math.max(1, Math.round(activePercentage * barsCount));
    const inactiveBars = Math.max(1, barsCount - activeBars);
    
    return { activeBars, inactiveBars };
  };

  const { activeBars, inactiveBars } = calculateBarDistribution();

  // Հաշվել գրադիենտ գույնը՝ կախված տոկոսից
  const getGradientColor = (progress: number, isActive: boolean) => {
    if (isActive) {
      const startR = 255;
      const startG = 180;
      const startB = 120;
      
      const endR = 238;
      const endG = 159;
      const endB = 102;
      
      const r = Math.round(startR + (endR - startR) * progress);
      const g = Math.round(startG + (endG - startG) * progress);
      const b = Math.round(startB + (endB - startB) * progress);
      
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return `#E2E3E4`;
    }
  };

  const handleTabSelect = (tab: string) => {
    onTabChange?.(tab);
    setIsDropdownOpen(false);
  };

  // Գեներացնել գծիկներ
  const renderBars = () => {
    const bars = [];
    
    // Ակտիվ գծիկներ (expiring)
    for (let i = 0; i < activeBars; i++) {
      const isFirst = i === 0;
      const isLast = i === activeBars - 1;
      const progress = activeBars > 1 ? i / (activeBars - 1) : 0.5;
      
      let height = 20;
      if (isFirst || isLast) {
        height = 20;
      }
      
      const animationDelay = `${(i * 10) % 500}ms`;
      
      bars.push(
        <div
          key={`${activeTab}-active-${i}`}
          className="chart-bar active-bar"
          style={{
            width: '1px',
            transform: 'scaleX(2.7)',
            transformOrigin: 'left',
            height: `${height}px`,
            backgroundColor: getGradientColor(progress, true),
            borderRadius: '1px',
            cursor: 'pointer',
            // Օգտագործել առանձին animation properties փոխարեն shorthand-ի
            animationName: isAnimating ? 'barAppear' : 'none',
            animationDuration: '0.5s',
            animationTimingFunction: 'ease',
            animationFillMode: 'forwards',
            animationDelay: animationDelay,
            opacity: isAnimating ? 0 : 1
          }}
          title={`Expiring quotes: ${expiringQuotes} (${expiringRate}%)`}
        />
      );
    }
    
    // Ոչ ակտիվ գծիկներ (non-expiring)
    for (let i = 0; i < inactiveBars; i++) {
      const isFirst = i === 0;
      const isLast = i === inactiveBars - 1;
      
      let height = 26;
      if (isFirst || isLast) {
        height = 26;
      }
      
      const animationDelay = `${((activeBars + i) * 10) % 500}ms`;
      
      bars.push(
        <div
          key={`${activeTab}-inactive-${i}`}
          className="chart-bar inactive-bar"
          style={{
            width: '1px',
            transform: 'scaleX(2.7)',
            transformOrigin: 'left',
            height: `${height}px`,
            backgroundColor: '#E2E3E4',
            borderRadius: '1px',
            cursor: 'pointer',
            // Օգտագործել առանձին animation properties փոխարեն shorthand-ի
            animationName: isAnimating ? 'barAppear' : 'none',
            animationDuration: '0.5s',
            animationTimingFunction: 'ease',
            animationFillMode: 'forwards',
            animationDelay: animationDelay,
            opacity: isAnimating ? 0 : 1
          }}
          title={`Non-expiring quotes: ${totalQuotes - expiringQuotes}`}
        />
      );
    }
    
    return bars;
  };

  return (
    <>
      <style jsx>{`
        @keyframes barAppear {
          0% {
            opacity: 0;
            transform: scaleX(2.7) scaleY(0.3);
          }
          70% {
            opacity: 0.8;
            transform: scaleX(2.7) scaleY(1.1);
          }
          100% {
            opacity: 1;
            transform: scaleX(2.7) scaleY(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .chart-bar {
          transition: all 0.3s ease;
        }
        
        .chart-bar:hover {
          opacity: 0.8;
          transform: scaleX(2) scaleY(1.1) !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .chaart {
          justify-content: start;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
          display: flex;
          overflow: hidden;
          min-height: 24px;
        }
        
        .expiration-stats {
          transition: all 0.3s ease;
        }
        
        .stats-card {
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .chart-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        
        /* Հովեր էֆֆեկտը ողջ կոմպոնենտի համար */
        .stats-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }
        
        .card-header {
          animation: fadeIn 0.4s ease;
        }
      `}</style>

      <div className="stats-card bg-[#fafbf6]/80 rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
        <div className="card-header mb-5 flex justify-between items-start">
          <h3 className="font-montserrat text-lg font-medium text-black mb-0 transition-all duration-300 hover:opacity-80">
            Quotes Expiration
          </h3>
          
          {/* Dropdown աջ անկյունում */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 font-montserrat text-xs font-medium text-[#6f6f6f] tracking-[0.24px] cursor-pointer whitespace-nowrap px-3 py-1 border border-[#e2e3e4] rounded-lg hover:bg-gray-50 hover:border-[#ee9f66] hover:text-[#ee9f66] transition-all duration-300"
            >
              {activeTab}
              <svg 
                className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute right-0 top-full mt-1 bg-white min-w-[140px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-lg z-10 py-1"
                style={{
                  animationName: 'fadeIn',
                  animationDuration: '0.3s',
                  animationTimingFunction: 'ease'
                }}
              >
                {tabs.map((tab) => (
                  <div 
                    key={tab}
                    onClick={() => handleTabSelect(tab)}
                    className={`
                      px-4 py-2 cursor-pointer font-montserrat text-xs font-medium tracking-[0.24px]
                      hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1
                      ${activeTab === tab 
                        ? 'text-[#ee9f66] underline font-semibold bg-orange-50' 
                        : 'text-[#6f6f6f] hover:text-[#ee9f66]'
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
        
        <div 
          className="expiration-stats relative w-[149px] mb-4"
          style={{
            animationName: 'fadeIn',
            animationDuration: '0.5s',
            animationTimingFunction: 'ease'
          }}
        >
          <div className="expiration-left absolute top-0 left-0.5 w-[143px] h-11 flex gap-3">
            <div className="expiration-rate w-20 h-10 flex gap-1 items-baseline transition-all duration-300">
              <span 
                className="ml-4 rate-number font-montserrat text-[56px] text-black font-normal tracking-[1.12px] leading-10 w-16 transition-all duration-500"
                style={{
                  animationName: 'fadeIn',
                  animationDuration: '0.4s',
                  animationTimingFunction: 'ease'
                }}
              >
                {expiringRate}
              </span>
              <span className="absolute top-[-2px] left-0 rate-symbol font-montserrat text-xs text-black font-normal tracking-[0.20px] w-2">
                %
              </span>
              <span className="text-[#C8C8C8] text-[12px] ml-[16px] transition-all duration-300">
                Quotes
              </span>
            </div>
          </div>
          <div className="expiration-right absolute top-14 left-0">
            <span className="expiration-total font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px] whitespace-nowrap transition-all duration-300 hover:text-gray-600">
              Total expiring quotes: {expiringQuotes}
            </span>
          </div>
        </div>
        
        <div className="chart-container" ref={containerRef}>
          <div className="chaart">
            {renderBars()}
          </div>
          
          <div 
            className="expiration-chart flex justify-between items-center mt-2 transition-all duration-300"
            style={{
              animationName: 'fadeIn',
              animationDuration: '0.6s',
              animationTimingFunction: 'ease'
            }}
          >
            <span className="chart-label font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px] hover:text-gray-600">
              Total quotes: {totalQuotes}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 group">
                <div 
                  className="w-2 h-2 rounded-full bg-[#ee9f66] transition-all duration-300 group-hover:scale-125"
                  style={{
                    animationName: 'fadeIn',
                    animationDuration: '0.5s',
                    animationTimingFunction: 'ease',
                    animationDelay: '0.3s'
                  }}
                ></div>
                <span className="font-montserrat text-xs font-medium text-[#6f6f6f] group-hover:text-[#ee9f66] transition-all duration-300">
                  Expiring: {expiringQuotes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotesExpirationCard;