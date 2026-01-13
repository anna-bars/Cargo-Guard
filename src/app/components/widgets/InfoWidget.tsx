import React from 'react';

interface InfoWidgetProps {
  title?: string;
  rateValue?: number;
  description?: React.ReactNode;
  className?: string;
}

export const InfoWidget: React.FC<InfoWidgetProps> = ({
  title = "Improve Your Quote Rate",
  rateValue = 72,
  description,
  className = ""
}) => {
  const defaultDescription = (
    <>
      Your Quotes are often Declined due to 
      <strong className="font-medium tracking-[0.03px]"> Inaccurate Cargo Value</strong>
    </>
  );

  return (
    <div className={`min-h-[calc(26%-4px)] xl:flex-[0_0_26%] stats-card border border-[#d1d1d154] bg-[#fdfdf8cf] rounded-2xl p-4 hover:shadow-sm transition-shadow duration-300 ${className}`}>
      <h3 className="font-montserrat text-lg font-medium text-black mb-6">
        {title}
      </h3>
      <div className="stats-content">
        <div className="rate-section relative w-[145px] h-[39px]">
          <div className="rate-label absolute top-6 left-24 font-montserrat text-xs font-medium text-[#c7c7c7] tracking-[0.24px]">
            Quotes
          </div>
          <div className="rate-value absolute top-0 left-0 w-20 h-[37px] flex gap-1 items-baseline">
            <span className="percentage font-montserrat text-[56px] text-black font-normal tracking-[1.12px] leading-9 w-16 ml-4">
              {rateValue}
            </span>
            <span className="percent-symbol font-montserrat text-xs text-black font-normal tracking-[0.20px] w-2 absolute top-[-4px] left-0">
              %
            </span>
          </div>
        </div>
        <p className="mt-2 stats-description font-montserrat text-xs font-normal text-[#afaeae] tracking-[0.24px] max-w-[268px]">
          {description || defaultDescription}
        </p>
      </div>
    </div>
  );
};

export default InfoWidget;