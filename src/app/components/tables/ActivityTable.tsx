import React, { useState, useMemo } from 'react';
import { ActivityTableFilter } from './ActivityTableFilter';
import { CustomDropdown } from './CustomDropdown';

interface ActivityRow {
  type: 'Quote' | 'Policy';
  id: string;
  cargo: string;
  value: string;
  status: {
    text: string;
    color: string;
    dot: string;
    textColor: string;
  };
  date: string;
  button: {
    text: string;
    variant: 'primary' | 'secondary';
  };
}

interface RecentActivityTableProps {
  title?: string;
  showMobileHeader?: boolean;
  rows?: ActivityRow[];
}

export const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  title = 'Recent Insurance Activity',
  showMobileHeader = true,
  rows = DEFAULT_ROWS
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Activity');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 days');
  const [selectedSort, setSelectedSort] = useState('Status');

  const getFilteredRows = () => {
    let filtered = [...rows];
    
    if (selectedTimeframe === 'Last 7 days') {
      filtered = filtered.slice(0, 3);
    } else if (selectedTimeframe === 'Last 3 months') {
      filtered = filtered;
    }
    
    if (selectedFilter !== 'All Activity') {
      const statusMap: Record<string, string> = {
        'Pending': 'Pending Approval',
        'Active': 'Active',
        'Expiring': 'Expires',
        'Missing': 'Document Missing',
        'Declined': 'Declined'
      };
      
      const targetStatus = statusMap[selectedFilter];
      if (targetStatus) {
        filtered = filtered.filter(row => 
          row.status.text.includes(targetStatus)
        );
      }
    }
    
    if (selectedSort === 'Date') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (selectedSort === 'Value') {
      filtered.sort((a, b) => {
        const aValue = parseFloat(a.value.replace(/[^\d.-]/g, ''));
        const bValue = parseFloat(b.value.replace(/[^\d.-]/g, ''));
        return bValue - aValue;
      });
    }
    
    return filtered;
  };

  const filteredRows = useMemo(() => {
    const filtered = getFilteredRows();
    
    if (!searchQuery.trim()) {
      return filtered;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return filtered.filter(row => 
      row.type.toLowerCase().includes(query) ||
      row.id.toLowerCase().includes(query) ||
      row.cargo.toLowerCase().includes(query) ||
      row.value.toLowerCase().includes(query) ||
      row.status.text.toLowerCase().includes(query) ||
      row.date.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedFilter, selectedTimeframe, selectedSort, rows]);

  const handleReset = () => {
    // Reset logic is now handled in ActivityTableFilter
  };

  return (
    <>
      {/* Recent Activity Table */}
<section
  className="
    block-2 flex flex-col h-full relative py-4 xl:py-4
    border border-[#d1d1d12b] bg-[#f9f9f6ba] rounded-[16px] overflow-hidden

    /* Desktop/MD - 768px and up */
    md:border md:border-solid md:border-[#d1d1d154]
    md:bg-[#fafaf7]/80 md:rounded-[16px]
    md:pt-[16px]
    md:!pb-0
    
    /* Mobile - below 768px */
    max-[767px]:border-none 
    max-[767px]:bg-transparent 
    max-[767px]:p-0 
    max-[767px]:rounded-none
  "
>

  {/* Filter Component */}
  <ActivityTableFilter
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    selectedFilter={selectedFilter}
    setSelectedFilter={setSelectedFilter}
    selectedTimeframe={selectedTimeframe}
    setSelectedTimeframe={setSelectedTimeframe}
    selectedSort={selectedSort}
    setSelectedSort={setSelectedSort}
    showMobileHeader={showMobileHeader}
    title={title}
    onReset={handleReset}
  />

  <div
  className="
    block-2 bg-[#fbfbfb] rounded-t-[16px] mt-2
    border border-[#8989893b]
    flex flex-col flex-1 overflow-hidden

    max-[767px]:border-none
    max-[767px]:bg-[#eef0f1]
  "
>

    {/* Desktop Table Header */}
    <div className="mt-4 px-4 sm:px-4 py-2 mb-0 hidden md:grid grid-cols-[8.5%_8.5%_1fr_20%_14%_17%] gap-2 pb-2 mb-0 table-header w-[97%] bg-[#ededed7a] mx-auto my-3.5 rounded-[4px]">
      {['Type', 'ID', 'Cargo / Value', 'Status / Due Date', 'Last Update', 'Action'].map((header, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 font-poppins text-sm font-normal text-[#606068]
            ${header === 'Action' ? 'justify-end' : ''}`}
        >
          <span>{header}</span>
          {header !== 'Action' && (
            <img
              src="https://c.animaapp.com/mjiggi0jSqvoj5/img/filter--1--7.png"
              alt="Sort"
              className="w-3 h-3"
            />
          )}
        </div>
      ))}
    </div>
    
    {/* Table Rows Container with Scroll */}
    <div className="
  table-rows-cont
  px-0
  md:px-4
  xl:px-4
  block-2
  space-y-2
  activity-table
  overflow-y-auto
  flex-1
  max-h-[calc(100vh-300px)]
  min-h-[400px]
  xs:p-0 xs:m-0 xs:w-full
  
  /* Mobile background */
  xs:bg-[#eff1f1]
">
      {filteredRows.length > 0 ? (
        filteredRows.map((row, idx) => (
          <div key={idx} className="
  mob-ly-item tab-item 
  md:grid sm:grid-cols-[8.5%_8.5%_1fr_20%_14%_17%] gap-2 
  p-4 md:p-3 
  bg-[#f9f9f6] rounded-lg 
  flex flex-wrap items-center 
  hover:bg-[#f0f4f9] transition-colors duration-300
  
  /* Mobile styles */
  xs:min-w-full xs:flex xs:bg-[rgba(250,252,255,0.8)] 
  xs:rounded-[16px] xs:flex-wrap xs:gap-4 xs:justify-between 
  xs:p-5 xs:mb-3 xs:border-b xs:border-solid xs:border-[#d1d1d140]
  xs:hover:bg-[#f6f6ec]
  
  /* Desktop styles */
  md:bg-transparent
  md:!m-0 md:!border-b md:!border-solid md:!border-[#ededf3] md:!rounded-none
  md:hover:!bg-[#f0f0f5e8]">
            {/* Desktop Layout */}
            <div className="hidden md:block md:w-auto font-poppins text-sm text-black truncate row-cell">{row.type}</div>
            <div className="hidden md:block md:w-auto font-poppins text-sm text-[#2563eb] underline truncate row-cell id-link hover:text-[#1d4ed8] transition-colors duration-300">{row.id}</div>
            <div className="hidden md:block md:w-auto font-poppins text-sm text-black truncate row-cell">{row.cargo} / {row.value}</div>
            <div className="hidden md:block md:w-auto row-cell flex justify-end">
              <span className={`!font-medium inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[37px] font-poppins text-xs ${row.status.color} ${row.status.textColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${row.status.dot}`}></span>
                {row.status.text}
              </span>
            </div>
            <div className="hidden md:block md:w-auto font-poppins text-sm text-black truncate row-cell">{row.date}</div>
            
            {/* Mobile Layout */}
            <div className="infoo md:hidden w-full mob-lay">
              {/* Top row: Type/ID on left, Status on right */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={row.type === 'Policy' 
                      ? "/table/document-attachment-stroke-rounded.svg" 
                      : "/table/document-text-stroke-rounded.svg"
                    } 
                    alt={row.type} 
                    className="w-4 h-4 xs:w-[16px] xs:h-[16px] xs2:w-[14px] xs2:h-[14px] opacity-80 hover:opacity-100"
                  />
                  <span className="font-poppins text-sm font-normal text-black xs:text-[16px]">{row.type}</span>
                  <span className="font-poppins text-sm text-[#2563eb] underline xs:text-[#2563eb]">{row.id}</span>
                </div>
                
                {/* Status badge */}
                <div className="row-cell flex-shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[37px] font-poppins text-xs ${row.status.color} ${row.status.textColor} 
                    w-fit min-w-fit whitespace-nowrap pl-3 pr-3 h-[26px] items-center transition-all duration-300
                    xs:text-[10px] xs:px-2 xs:py-1.5 xs:h-[22px] xs3:text-[11px] xs3:px-2.5 xs3:py-1.5 xs3:h-[24px]`}>
                    <span className={`w-2 h-2 rounded-full ${row.status.dot}`}></span>
                    {row.status.text}
                  </span>
                </div>
              </div>
              
              {/* Middle row: Cargo on left, Value on right */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <img 
                    src="/table/package-stroke-rounded.svg" 
                    alt="Cargo" 
                    className="w-4 h-4 xs:w-[16px] xs:h-[16px] xs2:w-[14px] xs2:h-[14px] opacity-80 hover:opacity-100"
                  />
                  <span className="font-poppins text-sm text-gray-700">{row.cargo}</span>
                </div>
                <div className="font-poppins text-sm font-normal text-black">{row.value}</div>
              </div>
              
              {/* Divider line */}
              <div className="border-t border-[#f2f2ed] my-3 xs:my-3"></div>
              
              {/* Bottom row: Date and Button */}
              <div className="flex items-center justify-between xs:flex xs:items-center xs:gap-3 xs:w-full xs4:flex-col xs4:gap-2">
                {/* Date with clock icon */}
                <div className="flex items-center gap-2 w-1/2 xs4:w-full xs4:justify-center xs4:mb-1">
                  <img 
                    src="/table/clock.svg" 
                    alt="Time" 
                    className="w-4 h-4 xs:w-[16px] xs:h-[16px] xs2:w-[14px] xs2:h-[14px]"
                  />
                  <div className="font-poppins text-sm text-gray-600 xs2:text-[12px]">{row.date}</div>
                </div>
                
                {/* Button */}
                <div className="w-1/2 xs4:w-full xs:pl-1.5">
                  <button className={`
                    h-[44px] w-full rounded-lg font-inter text-sm justify-center items-center gap-2 transition-colors duration-300
                    ${row.button.variant === 'primary' 
                      ? 'bg-[#2563EB] text-white border border-[rgba(255,255,255,0.22)] hover:bg-[#1d4ed8] hover:text-white hover:border-[#d1d5db]' 
                      : 'bg-transparent text-[#374151] border border-[#e3e6ea] hover:bg-[#f3f4f6] hover:text-white hover:border-[#d1d5db]'
                    }
                    xs:text-[14px] xs:font-medium xs:w-[95%] xs:min-w-0
                    xs2:text-[13px] xs2:px-1.5 xs2:py-2.5 xs2:h-[40px] xs2:max-w-[95%]
                  `}>
                    {row.button.text}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Desktop button */}
            <div className="flex justify-end hidden md:flex md:w-auto row-cell">
              <button className={`h-9 px-4 rounded-lg font-poppins text-sm font-normal transition-colors duration-300 w-full xl:w-[140px] ${
                row.button.variant === 'primary' 
                  ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]' 
                  : 'bg-transparent text-[#374151] border border-[#e3e6ea] hover:bg-[#f3f4f6] hover:border-[#d1d5db]'
              }`}>
                {row.button.text}
              </button>
            </div>
          </div>
        ))
      ) : (
        // No results message
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-poppins font-medium text-lg text-gray-700 mb-2">No results found</h3>
          <p className="font-poppins text-sm text-gray-500 text-center max-w-md">
            No activities match your search "{searchQuery}". Try adjusting your filters or search terms.
          </p>
          <button 
            className="mt-6 px-6 py-2.5 bg-[#2563eb] text-white rounded-lg font-poppins text-sm font-normal hover:bg-[#1d4ed8] transition-colors duration-300"
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('All Activity');
              setSelectedTimeframe('Last 30 days');
              setSelectedSort('Status');
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  </div>
</section>
    </>
  );
};

const DEFAULT_ROWS = [
  {
    type: 'Quote',
    id: 'Q-005',
    cargo: 'Jewelry',
    value: '$15,400.00',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    date: 'Oct 25, 9:10PM',
    button: { text: 'Approve Quote', variant: 'primary' }
  },
  {
    type: 'Policy',
    id: 'P-021',
    cargo: 'Textiles',
    value: '$3,700.00',
    status: { 
      text: 'Document Missing', 
      color: 'bg-[#f97316]/10', 
      dot: 'bg-[#f97316]', 
      textColor: 'text-[#f97316]' 
    },
    date: 'Oct 20, 6:30PM',
    button: { text: 'Upload Docs', variant: 'secondary' }
  },
  {
    type: 'Policy',
    id: 'P-020',
    cargo: 'Heavy Machinery',
    value: '$48,400.00',
    status: { 
      text: 'Expires 15 Nov 2025', 
      color: 'bg-[#eab308]/10', 
      dot: 'bg-[#eab308]', 
      textColor: 'text-[#eab308]' 
    },
    date: 'Oct 15, 4:20AM',
    button: { text: 'Renew Policy', variant: 'secondary' }
  },
  {
    type: 'Policy',
    id: 'P-019',
    cargo: 'Electronics',
    value: '$8,000.00',
    status: { 
      text: 'Active', 
      color: 'bg-[#16a34a]/10', 
      dot: 'bg-[#16a34a]', 
      textColor: 'text-[#16a34a]' 
    },
    date: 'Oct 21, 2:30PM',
    button: { text: 'Download Cert', variant: 'secondary' }
  },
  {
    type: 'Quote',
    id: 'Q-007',
    cargo: 'Food Products',
    value: '$1,100.00',
    status: { 
      text: 'Declined', 
      color: 'bg-[#8ea0b0]/10', 
      dot: 'bg-[#8ea0b0]', 
      textColor: 'text-[#8ea0b0]' 
    },
    date: 'Sept 28, 9:30PM',
    button: { text: 'View Details', variant: 'secondary' }
  },
  {
    type: 'Quote',
    id: 'Q-008',
    cargo: 'Pharmaceuticals',
    value: '$6,250.00',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    date: 'Sept 30, 11:45AM',
    button: { text: 'Approve Quote', variant: 'primary' }
  },
  {
    type: 'Policy',
    id: 'P-022',
    cargo: 'Auto Parts',
    value: '$12,900.00',
    status: { 
      text: 'Active', 
      color: 'bg-[#16a34a]/10', 
      dot: 'bg-[#16a34a]', 
      textColor: 'text-[#16a34a]' 
    },
    date: 'Oct 02, 3:15PM',
    button: { text: 'Download Cert', variant: 'secondary' }
  },
  {
    type: 'Quote',
    id: 'Q-009',
    cargo: 'Luxury Watches',
    value: '$22,000.00',
    status: { 
      text: 'Declined', 
      color: 'bg-[#8ea0b0]/10', 
      dot: 'bg-[#8ea0b0]', 
      textColor: 'text-[#8ea0b0]' 
    },
    date: 'Oct 05, 7:50PM',
    button: { text: 'View Details', variant: 'secondary' }
  },
  {
    type: 'Policy',
    id: 'P-023',
    cargo: 'Construction Materials',
    value: '$31,500.00',
    status: { 
      text: 'Expires 01 Dec 2025', 
      color: 'bg-[#eab308]/10', 
      dot: 'bg-[#eab308]', 
      textColor: 'text-[#eab308]' 
    },
    date: 'Oct 08, 10:10AM',
    button: { text: 'Renew Policy', variant: 'secondary' }
  },
  {
    type: 'Quote',
    id: 'Q-010',
    cargo: 'Medical Equipment',
    value: '$18,750.00',
    status: { 
      text: 'Pending Approval', 
      color: 'bg-[#cbd03c]/10', 
      dot: 'bg-[#cbd03c]', 
      textColor: 'text-[#cbd03c]' 
    },
    date: 'Oct 10, 1:40PM',
    button: { text: 'Approve Quote', variant: 'primary' }
  }
];

export default RecentActivityTable;