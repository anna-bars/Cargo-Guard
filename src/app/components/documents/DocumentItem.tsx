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
      color: '#EAECBA',
      textColor: '#6B6B6B',
      borderColor: '#EAECBA',
      buttons: [
        { text: 'View All Docs', variant: 'default' as const }
      ]
    },
    'Missing': {
      color: '#FAEDBC',
      textColor: '#6B6B6B',
      borderColor: '#FAEDBC',
      buttons: [
        { text: 'View All Docs', variant: 'default' as const },
        { text: 'Upload Missing Docs', variant: 'primary' as const }
      ]
    },
    'Rejected': {
      color: '#ECB9BA',
      textColor: '#6B6B6B',
      borderColor: '#ECB9BA',
      buttons: [
        { text: 'View All Docs', variant: 'default' as const },
        { text: 'Replace Document', variant: 'rejected' as const }
      ]
    },
    'Approved': {
      color: '#B9DAEC',
      textColor: '#6B6B6B',
      borderColor: '#B9DAEC',
      buttons: [
        { text: 'View All Docs', variant: 'default' as const }
      ]
    },
    'In Progress': {
      color: '#EAECBA',
      textColor: '#6B6B6B',
      borderColor: '#EAECBA',
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
          {/* Status with Glow Effect */}
          <div className="flex justify-end">
            <div className="relative">
              <span 
                className="
                  text-xs 
                  bg-[#FAFAFB] 
                  px-2 py-0.5 
                  rounded-full 
                  border-2 
                  outline outline-2 outline-[#F3F3F5] 
                  relative
                  group-hover:bg-gradient-to-r group-hover:from-[#8EB1FF] group-hover:to-[#ABC3F7]
                  group-hover:text-white
                  group-hover:border-[#F3F3F6]
                  group-hover:outline-blue-300
                  transition-all duration-300 ease-out
                  z-10
                "
                style={{
                  color: currentStatus.textColor,
                  borderColor: currentStatus.color
                }}
              >
                {status}
                {/* Glowing dot - enhanced */}
                <span 
                  className="
                    absolute -left-3 top-1/2 -translate-y-1/2 
                    w-1.5 h-1.5 
                    rounded-full
                    group-hover:scale-70
                    transition-all duration-300
                    z-20
                  "
                  style={{ backgroundColor: currentStatus.color }}
                ></span>
                
                {/* Additional glow layer */}
                <span className="
                  absolute inset-0 
                  rounded-full 
                  opacity-0 
                  group-hover:opacity-100
                  bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
                  blur-[2px]
                  -z-10
                  transition-opacity duration-300
                "></span>
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