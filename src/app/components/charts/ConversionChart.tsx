import React, { useRef, useEffect, useState, useCallback, JSX } from 'react';

export const ConversionChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  
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
    
    let barIndex = 0;
    
    // Յուրաքանչյուր տեսակի գծիկների համար
    DATA.forEach((item, dataIndex) => {
      const itemBars = Math.max(1, Math.round((item.count / total) * barsCount));
      
      for (let i = 0; i < itemBars; i++) {
        const isFirst = i === 0;
        const isLast = i === itemBars - 1;
        
        // Հաշվել բարձրությունը՝ հաշվի առնելով hover էֆֆեկտը
        let height = item.normalHeight;
        
        if (isFirst || isLast) {
          height = item.hegHeight;
        } else if (hoveredType === item.type) {
          // Եթե hover է՝ ամեն գծիկ դառնում է hegHeight-ի չափ
          height = item.hegHeight;
        }
        
        // Հաշվել գույնի պայծառությունը hover-ի ժամանակ
        let backgroundColor = item.color;
        let opacity = 1;
        
        if (hoveredType && hoveredType !== item.type) {
          // Եթե hover է մեկ այլ տեսակի վրա՝ այս տեսակի գծիկները դառնում են թափանցիկ
          opacity = 0.4;
        } else if (hoveredType === item.type) {
          // Եթե hover է այս տեսակի վրա՝ գույնը պայծառանում է
          backgroundColor = adjustColorBrightness(item.color, 20);
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
    
    // Մնացած դատարկ գծիկներ
    const totalDataBars = DATA.reduce((sum, item) => 
      sum + Math.max(1, Math.round((item.count / total) * barsCount)), 0);
    const remainingBars = barsCount - totalDataBars;
    
    for (let i = 0; i < remainingBars; i++) {
      let opacity = 1;
      if (hoveredType) {
        opacity = 0.2; // Hover-ի ժամանակ դատարկ գծիկները նույնպես թափանցիկ
      }
      
      bars.push(
        <div 
          key={`empty-${i}-${barIndex}`}
          className="empty-chart-bar"
          style={{
            width: '1px',
            transform: 'scaleX(2.7)',
            transformOrigin: 'left',
            height: '10px',
            background: 'linear-gradient(180deg, #E2E3E4, transparent)',
            opacity: opacity,
            transition: 'all 0.3s ease',
            borderRadius: '1px'
          }}
        />
      );
      barIndex++;
    }
    
    return bars;
  };

  // Օգնական ֆունկցիա գույնի պայծառությունը փոխելու համար
  const adjustColorBrightness = (color: string, percent: number): string => {
    // Պարզեցված տարբերակ - ավելացնում է պայծառությունը
    if (color.startsWith('#')) {
      // Hex գույնի համար
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
    <div className="flex flex-col justify-between border border-[#d1d1d154] bg-[#fafaf7]/80 rounded-2xl p-4 h-full w-full quote-conversion performance-section hover:shadow-sm transition-shadow duration-300">
      <div className="mb-[4px]">
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
                      backgroundColor: item.color,
                      transform: hoveredType === item.type ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: hoveredType === item.type ? `0 0 8px ${item.color}80` : 'none'
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
                minHeight: '26px' // Ամենաբարձր գծիկի համար
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
            
            {/* <div className='flex justify-between mt-1'>
              <p className='text-xs text-[#C8C8C8]'>0</p>
              <p className='text-xs text-[#C8C8C8]'>100</p>
            </div> */}
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
        
        /* Smooth transitions for all chart bars */
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
    
    // .chaart, .chaart2 {
    //   min-height: 20px;
    // }
  }
  
  @media screen and (max-width: 768px) {
    .quote-conversion.performance-section {
      min-height: 240px;
    }
    
    // .chaart, .chaart2 {
    //   min-height: 24px;
    // }
  }
      `}</style>
    </div>
  );
};