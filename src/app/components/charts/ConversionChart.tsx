import React, { useRef, useEffect, useState, useCallback, JSX } from 'react';

export const ConversionChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [activeTime, setActiveTime] = useState('This Month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const timeOptions = ['This Week', 'This Month', 'Last Month', 'Last Quarter'];
  
  const DATA = [
    { 
      type: 'approved', 
      count: 17, 
      hegHeight: 24,
      normalHeight: 16
    },
    { 
      type: 'declined', 
      count: 9, 
      hegHeight: 24, 
      normalHeight: 16 
    },
    { 
      type: 'expired', 
      count: 18, 
      hegHeight: 24, 
      normalHeight: 16 
    }
  ];

  const calculateBarsCount = useCallback((width: number) => {
    if (width <= 320) return 40;
    if (width <= 400) return 45;
    return 49;
  }, []);

  const [barsCount, setBarsCount] = useState(49);

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

  const handleTimeSelect = (time: string) => {
    setActiveTime(time);
    setIsDropdownOpen(false);
  };

  const renderBars = () => {
    const total = DATA.reduce((sum, item) => sum + item.count, 0);
    const bars: JSX.Element[] = [];
    
    const barsPerType = DATA.map(item => ({
      ...item,
      barCount: Math.max(1, Math.floor((item.count / total) * barsCount))
    }));
    
    const totalBars = barsPerType.reduce((sum, item) => sum + item.barCount, 0);
    
    let remainingBars = barsCount - totalBars;
    
    const sortedIndices = [...barsPerType.keys()].sort((a, b) => barsPerType[b].count - barsPerType[a].count);
    
    for (let i = 0; i < remainingBars && i < sortedIndices.length; i++) {
      barsPerType[sortedIndices[i]].barCount++;
    }
    
    let barIndex = 0;
    
    barsPerType.forEach((item) => {
      const itemBarCount = item.barCount;
      
      for (let i = 0; i < itemBarCount; i++) {
        const isFirst = i === 0;
        const isLast = i === itemBarCount - 1;
        
        let height = item.normalHeight;
        
        if (isFirst || isLast) {
          height = item.hegHeight;
        } else if (hoveredType === item.type) {
          height = item.hegHeight;
        }
        
        const gradientProgress = itemBarCount > 1 ? i / (itemBarCount - 1) : 0.5;
        let backgroundColor = getGradientColor(item.type, gradientProgress);
        
        let opacity = 1;
        
        if (hoveredType && hoveredType !== item.type) {
          opacity = 0.4;
        } else if (hoveredType === item.type) {
          backgroundColor = adjustColorBrightness(backgroundColor, 20);
        }
        
        bars.push(
          <div 
            key={`${item.type}-${i}-${barIndex}`}
            className={`${item.type}-chart-bar ${isFirst || isLast ? 'heg' : ''}`}
            style={{
              width: '1px',
              transform: 'scaleX(2.7)',
              transformOrigin: 'left',
              height: `${height}px`,
              backgroundColor: backgroundColor,
              opacity: opacity,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              borderRadius: '1px'
            }}
            onMouseEnter={() => setHoveredType(item.type)}
            onMouseLeave={() => setHoveredType(null)}
            title={`${item.type}: ${item.count}`}
          />
        );
        barIndex++;
      }
    });
    
    return bars;
  };

  const getGradientColor = (type: string, progress: number): string => {
    const gradients: Record<string, { start: string; end: string }> = {
      approved: { start: '#BED5F8', end: '#669CEE' },
      declined: { start: '#F8E2BE', end: '#EEDE66' },
      expired: { start: '#FFA4A4', end: '#EB6025' }
    };
    
    const gradient = gradients[type];
    if (!gradient) return '#000000';
    
    const startR = parseInt(gradient.start.slice(1, 3), 16);
    const startG = parseInt(gradient.start.slice(3, 5), 16);
    const startB = parseInt(gradient.start.slice(5, 7), 16);
    
    const endR = parseInt(gradient.end.slice(1, 3), 16);
    const endG = parseInt(gradient.end.slice(3, 5), 16);
    const endB = parseInt(gradient.end.slice(5, 7), 16);
    
    const r = Math.round(startR + (endR - startR) * progress);
    const g = Math.round(startG + (endG - startG) * progress);
    const b = Math.round(startB + (endB - startB) * progress);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const adjustColorBrightness = (color: string, percent: number): string => {
    if (color.startsWith('#')) {
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);
      
      r = Math.min(255, r + (255 - r) * percent / 100);
      g = Math.min(255, g + (255 - g) * percent / 100);
      b = Math.min(255, b + (255 - b) * percent / 100);
      
      return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }
    return color;
  };

  return (
    <div className="flex flex-col justify-between border border-[#d1d1d154] bg-[#fdfdf8cf] rounded-2xl p-4 h-full w-full quote-conversion performance-section hover:shadow-sm transition-shadow duration-300">
      <div className="mb-[4px] flex justify-between items-center">
        <h3 className="font-montserrat text-[18px] font-normal text-black action-title max-[1024px]:text-[14px]">
          Quote Conversion Rate
        </h3>
        
        {/* Dropdown for time selection */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 font-montserrat text-xs font-medium text-[#6f6f6f] tracking-[0.24px] cursor-pointer whitespace-nowrap px-3 py-1 border border-[#e2e3e4] rounded-lg hover:bg-gray-50 hover:border-[#669CEE] hover:text-[#669CEE] transition-all duration-300"
          >
            {activeTime}
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
                animationName: 'slideUpFade',
                animationDuration: '0.3s',
                animationTimingFunction: 'ease'
              }}
            >
              {timeOptions.map((time, index) => (
                <div 
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`
                    px-4 py-2 cursor-pointer font-montserrat text-xs font-medium tracking-[0.24px]
                    hover:bg-gray-50 transition-all duration-200
                    ${activeTime === time 
                      ? 'text-[#669CEE] underline font-semibold bg-blue-50' 
                      : 'text-[#6f6f6f] hover:text-[#669CEE]'
                    }
                  `}
                  style={{
                    animationName: 'slideUpFade',
                    animationDuration: '0.3s',
                    animationTimingFunction: 'ease',
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {time}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="block justify-between items-end">
        <div className="w-full">
          <div className="flex w-[96%] justify-between mb-3.5">
            {DATA.map((item) => (
              <div 
                key={item.type}
                className={`transition-all duration-300 ${hoveredType === item.type ? 'scale-105' : ''}`}
                onMouseEnter={() => setHoveredType(item.type)}
                onMouseLeave={() => setHoveredType(null)}
                style={{ cursor: 'pointer' }}
              >
                <div className="text-[13px] text-[#C8C8C8] capitalize">
                  {item.type}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div 
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: getGradientColor(item.type, 0.5),
                      transform: hoveredType === item.type ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: hoveredType === item.type ? `0 0 8px ${getGradientColor(item.type, 0.5)}80` : 'none'
                    }}
                  ></div>
                  <div className="text-[15px] font-medium transition-all duration-300"
                       style={{ color: hoveredType === item.type ? '#000' : 'inherit' }}>
                    {item.count}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='chart-cont' ref={containerRef}>
            <div 
              className="chaart"
              style={{
                display: 'inline-flex',
                gap: '4.5px',
                justifyContent: 'start',
                alignItems: 'end',
                overflow: 'hidden',
                marginBottom: '4px',
                minHeight: '24px'
              }}
            >
              {renderBars()}
            </div>
            
            <div 
              className="chaart chaart2"
              style={{
                display: 'inline-flex',
                gap: '4.5px',
                justifyContent: 'start',
                alignItems: 'end',
                overflow: 'hidden'
              }}
            >
              {Array.from({ length: 60 }).map((_, i) => (
                <div 
                  key={`line2-${i}`}
                  style={{
                    width: '1px',
                    height: '10px',
                    transform: 'scaleX(2.7)',
                    transformOrigin: 'left',
                    background: 'linear-gradient(180deg, #E2E3E4, transparent)',
                    borderRadius: '1px'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .empty-chart-bar {
          background: linear-gradient(180deg, #E2E3E4, transparent) !important;
        }
        
        .chart-cont {
          gap: 0px;
          display: grid;
        }
        
        .approved-chart-bar,
        .declined-chart-bar,
        .expired-chart-bar,
        .empty-chart-bar {
          transition: all 0.3s ease !important;
        }
        
        .quote-conversion.performance-section {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .quote-conversion .chart-cont {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        
        @media screen and (max-width: 1024px) {
          .quote-conversion.performance-section {
            min-height: 180px;
          }
        }
        
        @media screen and (max-width: 768px) {
          .quote-conversion.performance-section {
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
};