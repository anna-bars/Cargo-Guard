import React, { useRef, useEffect, useState, useCallback, JSX } from 'react';

export const ConversionChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const DATA = [
    { type: 'approved', count: 17, color: '#669CEE', hegHeight: 26, normalHeight: 20 },
    { type: 'declined', count: 9, color: '#EEAF66', hegHeight: 24, normalHeight: 16 },
    { type: 'expired', count: 18, color: '#66EE88', hegHeight: 18, normalHeight: 14 }
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

  const renderBars = () => {
    const total = DATA.reduce((sum, item) => sum + item.count, 0);
    const bars: JSX.Element[] = [];
    
    // Approved գծիկներ
    const approvedBars = Math.max(1, Math.round((DATA[0].count / total) * barsCount));
    for (let i = 0; i < approvedBars; i++) {
      const isFirst = i === 0;
      const isLast = i === approvedBars - 1;
      
      bars.push(
        <div 
          key={`approved-${i}`}
          className={`approved-chart-bar ${isFirst || isLast ? 'heg' : ''}`}
          style={{
            width: '1px',
            transform: 'scaleX(2.7)',
            transformOrigin: 'left',
            height: isFirst || isLast ? `${DATA[0].hegHeight}px` : `${DATA[0].normalHeight}px`,
            backgroundColor: DATA[0].color
          }}
        />
      );
    }
    
    // Declined գծիկներ
    const declinedBars = Math.max(1, Math.round((DATA[1].count / total) * barsCount));
    for (let i = 0; i < declinedBars; i++) {
      const isFirst = i === 0;
      const isLast = i === declinedBars - 1;
      
      bars.push(
        <div 
          key={`declined-${i}`}
          className={`declined-chart-bar ${isFirst || isLast ? 'heg' : ''}`}
          style={{
            width: '1px',
            transform: 'scaleX(2.7)',
            transformOrigin: 'left',
            height: isFirst || isLast ? `${DATA[1].hegHeight}px` : `${DATA[1].normalHeight}px`,
            backgroundColor: DATA[1].color
          }}
        />
      );
    }
    
    // Expired գծիկներ (ԱՎԵԼԱՑՆՈՒՄ ԵՆՔ ՍԱ)
    const expiredBars = Math.max(1, Math.round((DATA[2].count / total) * barsCount));
    for (let i = 0; i < expiredBars; i++) {
      const isFirst = i === 0;
      const isLast = i === expiredBars - 1;
      
      bars.push(
        <div 
          key={`expired-${i}`}
          className={`expired-chart-bar ${isFirst || isLast ? 'heg' : ''}`}
          style={{
            width: '1px',
            transform: 'scaleX(2.7)',
            transformOrigin: 'left',
            height: isFirst || isLast ? `${DATA[2].hegHeight}px` : `${DATA[2].normalHeight}px`,
            backgroundColor: DATA[2].color
          }}
        />
      );
    }
    
    // Մնացած դատարկ գծիկներ
    const remainingBars = barsCount - (approvedBars + declinedBars + expiredBars);
    for (let i = 0; i < remainingBars; i++) {
      bars.push(
        <div 
          key={`empty-${i}`}
          className="empty-chart-bar"
          style={{
            width: '1px',
            transform: 'scaleX(2.7)',
            transformOrigin: 'left',
            height: '10px',
            background: 'linear-gradient(180deg, #E2E3E4, transparent)'
          }}
        />
      );
    }
    
    return bars;
  };

  return (
    <div className="flex flex-col justify-between border border-[#d1d1d154] bg-[#fafaf7]/80 rounded-2xl p-4 h-auto min-h-[203px] w-full quote-conversion performance-section hover:shadow-sm transition-shadow duration-300">
      <div className="mb-[24px]">
        <h3 className="font-montserrat text-[18px] font-normal text-black action-title">
          Quote Conversion Rate
        </h3>
        <p className="font-montserrat text-[12px] font-normal text-[#c7c7c7]">
          This Month
        </p>
      </div>
      
      <div className="block justify-between items-end">
        <div className="w-full">
          <div className="flex w-[96%] justify-between mb-3.5">
            <div>
              <div className="text-[13px] text-[#C8C8C8]">Approved</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#669CEE]"></div>
                <div className="text-[15px]">17</div>
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#C8C8C8]">Declined</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EEAF66]"></div>
                <div className="text-[15px]">9</div>
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#C8C8C8]">Expired</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#66EE88]"></div>
                {/* ՓՈԽԵՄ ՆՈՐ ԱՐՏԱԴՐՈՒԹՅԱՆ ՀԱՄԱՐ */}
                <div className="text-[15px]">18</div>
              </div>
            </div>
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
                marginBottom: '4px'
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
                overflow: 'hidden',
                marginBottom: '4px'
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
                    background: 'linear-gradient(180deg, #E2E3E4, transparent)'
                  }}
                />
              ))}
            </div>
            
            <div className='flex justify-between '>
              <p className='text-xs text-[#C8C8C8]'>0</p>
              <p className='text-xs text-[#C8C8C8]'>100</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .approved-chart-bar {
          background-color: #669CEE !important;
        }
        
        .declined-chart-bar {
          background-color: #EEAF66 !important;
        }
        
        .expired-chart-bar {
          background-color: #66EE88 !important;
        }
        
        .empty-chart-bar {
          background: linear-gradient(180deg, #E2E3E4, transparent) !important;
        }
        
        .approved-chart-bar.heg {
          height: 26px !important;
        }
        
        .declined-chart-bar.heg {
          height: 24px !important;
        }
        
        .expired-chart-bar.heg {
          height: 18px !important;
        }
        
        .chart-cont {
          gap: 0px;
          display: grid;
        }
      `}</style>
    </div>
  );
};