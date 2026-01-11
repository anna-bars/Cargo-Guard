'use client'

interface QuotesExpirationCardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const QuotesExpirationCard = ({ activeTab = 'This Week', onTabChange }: QuotesExpirationCardProps) => {
  const tabs = ['This Week', 'Next Week'];
  
  // Քարտի համար տվյալներ
  const totalQuotes = 22;
  const expiringQuotes = 7;
  const expiringRate = Math.round((expiringQuotes / totalQuotes) * 100);
  
  // Ստեղծենք գծիկների զանգվածը (32% ակտիվ, մնացածը ոչ ակտիվ)
  const chartItems = Array.from({ length: totalQuotes });
  const activeItemsCount = Math.round((expiringRate / 100) * totalQuotes);

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
        <div className="card-header mb-6">
          <h3 className="font-montserrat text-lg font-medium text-black mb-0">Quotes Expiration</h3>
          <div className="time-tabs flex gap-3 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <span 
                key={tab}
                onClick={() => onTabChange?.(tab)}
                className={`
                  font-montserrat text-xs font-medium tracking-[0.24px] cursor-pointer whitespace-nowrap
                  ${activeTab === tab 
                    ? 'text-[#6f6f6f] underline' 
                    : 'text-[#c7c7c7]'
                  }
                `}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
        
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
        
        {/* Chart with vertical bars */}
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