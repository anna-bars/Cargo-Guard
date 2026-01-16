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
  return (
    <div className="w-full max-w-[24.5%]">
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
        <div className="bg-[#fdfdf8cf] p-3 rounded-b-2xl rounded-tr-2xl flex flex-col gap-1">
          {/* Status */}
          <div className="flex justify-end">
            <div className="relative">
              <span className="text-xs text-[#6B6B6B] bg-[#FAFAFB] px-2 py-0.5 rounded-full border-2 border-[#B9DAEC] outline outline-2 outline-[#F3F3F5] relative">
                {status}
                {/* Dot before status */}
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#B9DAEC] rounded-full"></span>
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
          
          {/* Button */}
          <div className="mt-2 flex justify-end">
            <button className="px-4 py-1 bg-transparent border border-[#E3E6EA] rounded text-sm text-[#374151] hover:bg-gray-50 transition-colors">
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;