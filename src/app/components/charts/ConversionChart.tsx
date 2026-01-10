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
  
  // Նախ հաշվել յուրաքանչյուր տեսակի գծիկների քանակը
  const barsPerType = DATA.map(item => ({
    ...item,
    barCount: Math.max(1, Math.floor((item.count / total) * barsCount))
  }));
  
  // Հաշվել ընդհանուր գծիկները
  const totalBars = barsPerType.reduce((sum, item) => sum + item.barCount, 0);
  
  // Եթե ավելի քիչ գծիկներ ենք ունենում, քան պետք է, ավելացնել հավասարաչափ
  let remainingBars = barsCount - totalBars;
  
  // Մնացած գծիկները ավելացնել ամենամեծ տոկոսով տեսակին՝ առանց հերթականությունը փոխելու
  const sortedIndices = [...barsPerType.keys()].sort((a, b) => barsPerType[b].count - barsPerType[a].count);
  
  for (let i = 0; i < remainingBars && i < sortedIndices.length; i++) {
    barsPerType[sortedIndices[i]].barCount++;
  }
  
  let barIndex = 0;
  
  // Յուրաքանչյուր տեսակի գծիկների համար
  barsPerType.forEach((item) => {
    const itemBarCount = item.barCount;
    
    for (let i = 0; i < itemBarCount; i++) {
      const isFirst = i === 0;
      const isLast = i === itemBarCount - 1;
      
      // Հաշվել բարձրությունը՝ հաշվի առնելով hover էֆֆեկտը
      let height = item.normalHeight;
      
      if (isFirst || isLast) {
        height = item.hegHeight;
      } else if (hoveredType === item.type) {
        // Եթե hover է՝ ամեն գծիկ դառնում է hegHeight-ի չափ
        height = item.hegHeight;
      }
      
      // Հաշվել գույնի գրադիենտը ըստ տեսակի
      const gradientProgress = itemBarCount > 1 ? i / (itemBarCount - 1) : 0.5;
      let backgroundColor = getGradientColor(item.type, gradientProgress);
      
      // Հաշվել գույնի պայծառությունը hover-ի ժամանակ
      let opacity = 1;
      
      if (hoveredType && hoveredType !== item.type) {
        // Եթե hover է մեկ այլ տեսակի վրա՝ այս տեսակի գծիկները դառնում են թափանցիկ
        opacity = 0.4;
      } else if (hoveredType === item.type) {
        // Եթե hover է այս տեսակի վրա՝ գույնը պայծառանում է
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

// Գրադիենտ գույնի ֆունկցիա բոլոր տեսակների համար
const getGradientColor = (type: string, progress: number): string => {
  // Գրադիենտի գույները յուրաքանչյուր տեսակի համար
  const gradients: Record<string, { start: string; end: string }> = {
    approved: { start: '#BED5F8', end: '#669CEE' },
    declined: { start: '#FF5343', end: '#F71500' }, // declined-ի համար՝ FF5343 → F71500
    expired: { start: '#FFCF38', end: '#EAB308' }   // expired-ի համար՝ FFCF38 → EAB308
  };
  
  const gradient = gradients[type];
  if (!gradient) return '#000000';
  
  // RGB արժեքները ստանալ
  const startR = parseInt(gradient.start.slice(1, 3), 16);
  const startG = parseInt(gradient.start.slice(3, 5), 16);
  const startB = parseInt(gradient.start.slice(5, 7), 16);
  
  const endR = parseInt(gradient.end.slice(1, 3), 16);
  const endG = parseInt(gradient.end.slice(3, 5), 16);
  const endB = parseInt(gradient.end.slice(5, 7), 16);
  
  // Ինտերպոլացիա
  const r = Math.round(startR + (endR - startR) * progress);
  const g = Math.round(startG + (endG - startG) * progress);
  const b = Math.round(startB + (endB - startB) * progress);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
    <div className="flex flex-col justify-between border border-[#d1d1d154] bg-[#fdfdf8cf] rounded-2xl p-4 h-full w-full quote-conversion performance-section hover:shadow-sm transition-shadow duration-300">
      <div className="mb-[4px]">
        <h3 className="font-montserrat text-[18px] font-normal text-black action-title max-[1024px]:text-[14px]">
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
                      // Ցույց տալ գրադիենտի միջին գույնը
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
      min-height: 200px;
    }
    
    // .chaart, .chaart2 {
    //   min-height: 24px;
    // }
  }
      `}</style>
    </div>
  );
};