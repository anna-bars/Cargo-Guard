import React from 'react';

interface DocumentItemProps {
  type?: string;
  id?: string;
  status?: string;
  cargoType?: string;
  summary?: string;
  buttonText?: string;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  type = 'Policy:',
  id = 'P-0812',
  status = 'Pending Review',
  cargoType = 'Electronics',
  summary = '1 Document Pending Review',
  buttonText = 'View All Docs'
}) => {
  // Ստատուսների համար գույների և կոճակների կոնֆիգուրացիա
  const statusConfig = {
    'Pending Review': {
      bgColor: 'bg-[#EAECBA]',
      hoverBgColor: 'group-hover:bg-[#EAECBA]',
      textColor: 'text-[#6B6B6B]',
      hoverTextColor: 'group-hover:text-[#4A4A4A]',
      borderColor: 'border-[#EAECBA]',
      hoverBorderColor: 'group-hover:border-[#D8DA94]',
      dotColor: '#EAECBA',
      hoverDotColor: '#D8DA94',
      buttons: [
        { text: 'View All Docs', variant: 'default' as const }
      ]
    },
    'Missing': {
      bgColor: 'bg-[#FAEDBC]',
      hoverBgColor: 'group-hover:bg-[#FAEDBC]',
      textColor: 'text-[#6B6B6B]',
      hoverTextColor: 'group-hover:text-[#4A4A4A]',
      borderColor: 'border-[#FAEDBC]',
      hoverBorderColor: 'group-hover:border-[#E8D9A4]',
      dotColor: '#FAEDBC',
      hoverDotColor: '#E8D9A4',
      buttons: [
        { text: 'View All Docs', variant: 'default' as const },
        { text: 'Upload Missing Docs', variant: 'primary' as const }
      ]
    },
    'Rejected': {
      bgColor: 'bg-[#ECB9BA]',
      hoverBgColor: 'group-hover:bg-[#ECB9BA]',
      textColor: 'text-[#6B6B6B]',
      hoverTextColor: 'group-hover:text-[#4A4A4A]',
      borderColor: 'border-[#ECB9BA]',
      hoverBorderColor: 'group-hover:border-[#DAA7A8]',
      dotColor: '#ECB9BA',
      hoverDotColor: '#DAA7A8',
      buttons: [
        { text: 'View All Docs', variant: 'default' as const },
        { text: 'Replace Document', variant: 'rejected' as const }
      ]
    },
    'Approved': {
      bgColor: 'bg-[#B9DAEC]',
      hoverBgColor: 'group-hover:bg-[#B9DAEC]',
      textColor: 'text-[#6B6B6B]',
      hoverTextColor: 'group-hover:text-[#4A4A4A]',
      borderColor: 'border-[#B9DAEC]',
      hoverBorderColor: 'group-hover:border-[#A7C8DA]',
      dotColor: '#B9DAEC',
      hoverDotColor: '#A7C8DA',
      buttons: [
        { text: 'View All Docs', variant: 'default' as const }
      ]
    },
    'In Progress': {
      bgColor: 'bg-[#EAECBA]',
      hoverBgColor: 'group-hover:bg-[#EAECBA]',
      textColor: 'text-[#6B6B6B]',
      hoverTextColor: 'group-hover:text-[#4A4A4A]',
      borderColor: 'border-[#EAECBA]',
      hoverBorderColor: 'group-hover:border-[#D8DA94]',
      dotColor: '#EAECBA',
      hoverDotColor: '#D8DA94',
      buttons: [
        { text: 'View All Docs', variant: 'default' as const }
      ]
    }
  };

  // Ընթացիկ ստատուսի կոնֆիգը
  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending Review'];

  return (
    <div className="w-full max-w-[100%] sm:max-w-[32.3%] group">
      <div className="relative">
        {/* Top part with background image */}
        <div 
          className="flex gap-2 items-start bg-no-repeat bg-top bg-contain pt-3 pl-4 pr-4"
          style={{ 
            backgroundImage: 'url(/documents/documents-item-top-part2.svg)',
            backgroundSize: 'revert-layer',
            backgroundPosition: 'left'
          }}
        >
          <p className="text-sm text-gray-800">{type}</p>
          <p className="text-sm text-[#7E7E7E] border-b border-[#7E7E7E]">{id}</p>
        </div>
        
        {/* Bottom part */}
        <div className="bg-[#fdfdf8cf] p-3 rounded-b-2xl rounded-tr-2xl flex flex-col gap-3">
          {/* Status with custom hover colors */}
          <div className="flex justify-end">
            <div className="relative">
              <span 
                className={`
                  text-xs 
                  bg-[#FAFAFB] 
                  px-2 py-0.5 
                  rounded-full 
                  border-2 
                  outline outline-2 outline-[#F3F3F5] 
                  relative
                  transition-all duration-300 ease-out
                  z-10
                  ${currentStatus.textColor}
                  ${currentStatus.hoverTextColor}
                  ${currentStatus.borderColor}
                  ${currentStatus.hoverBorderColor}
                  ${currentStatus.hoverBgColor}
                `}
              >
                {status}
                {/* Glowing dot with hover effect */}
                <span 
                  className={`
                    absolute -left-3 top-1/2 -translate-y-1/2 
                    w-1.5 h-1.5 
                    rounded-full
                    transition-all duration-300
                    z-20
                  `}
                  style={{ 
                    backgroundColor: currentStatus.dotColor,
                    '--hover-dot-color': currentStatus.hoverDotColor
                  } as React.CSSProperties}
                ></span>
              </span>
            </div>
          </div>
          
          {/* Info section */}
          <div className="flex flex-col gap-1.5">
            <div>
              <h3 className="text-sm font-normal text-gray-800">Cargo Type:</h3>
              <div className="text-sm text-[#7E7E7E] mt-1 ml-4">{cargoType}</div>
            </div>
            <div>
              <h3 className="text-sm font-normal text-gray-800">Document Summary:</h3>
              <div className="text-sm text-[#7E7E7E] mt-1 ml-4">{summary}</div>
            </div>
          </div>
          
          {/* Buttons - տարբեր ստատուսների համար տարբեր կոճակներ */}
          <div className="mt-2 flex justify-end gap-2">
            {currentStatus.buttons.map((button, index) => (
              <button
                key={index}
                className={`
                  px-4 py-1 rounded text-sm transition-colors
                  ${button.variant === 'default' 
                    ? 'bg-transparent border border-[#E3E6EA] text-[#374151] hover:bg-gray-50' 
                    : ''}
                  ${button.variant === 'primary' 
                    ? 'bg-[#2563EB] text-white border border-[#2563EB] hover:bg-[#1d4ed8]' 
                    : ''}
                  ${button.variant === 'rejected' 
                    ? 'bg-transparent border border-[#D03C3C] text-[#D03C3C] hover:bg-[#fef2f2]' 
                    : ''}
                `}
                style={
                  button.variant === 'rejected' 
                    ? { borderWidth: '1px' } 
                    : undefined
                }
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;