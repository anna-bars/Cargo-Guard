import React, { useState, useMemo } from 'react';

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
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All Activity');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 days');
  const [selectedSort, setSelectedSort] = useState('Status');
  
  // Ֆիլտրացված տվյալներ
  const getFilteredRows = () => {
    let filtered = [...rows];
    
    // Ժամանակային ֆիլտր
    if (selectedTimeframe === 'Last 7 days') {
      // Սիմուլյացիա
      filtered = filtered.slice(0, 3);
    } else if (selectedTimeframe === 'Last 3 months') {
      // Բոլորը
      filtered = filtered;
    }
    
    // Status ֆիլտր
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
    
    // Սորտավորում
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

  // Search functionality
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

  return (
    <>
      {/* Mobile Activity Header */}
      {showMobileHeader && (
        <div className="pt-2 recent-activity md:hidden flex items-center justify-between activity-mobile-header activity-section-mob-hd mb-4">
          <h3 className="text-lg font-normal">Recent Activity</h3>
          <div className='flex gap-2'>
            <button 
              className="flex items-center gap-1 bg-[#F5F4F7] border border-[#d1d1d154] px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#F2F0F5] transition-colors duration-300"
              onClick={() => setShowFilter(!showFilter)}
            >
              <img src="dashboard/icons/filter-stroke-rounded.svg" alt="" className="w-[16px] h-[16px]" />
              Filter
            </button>
            <button className="bg-[#eb8d25] text-white px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#ff8c0c] transition-colors duration-300">
              Get New Quote
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity Table */}
      <section className="block-2 flex flex-col max-h-[88%] border border-[#d1d1d154] activity-section bg-[#fafaf7]/80 rounded-2xl py-4 xl:py-4 relative">
        {/* Desktop Filters */}
        <div className='block-1'>
          <div className='flex px-0 md:px-4 justify-between items-center border-b border-b-[#d1d1d154] pb-3 relative'>
            <h2 className="block">{title}</h2>
            <div className='header-btn flex justify-between gap-2'>
              {/* Search Input - Replaced button with input */}
              <div className="hidden md:flex items-center gap-2 w-[180px] bg-[#f9f9f6] border border-[#d1d1d154] px-4 py-2 rounded-lg font-poppins text-sm relative">
                <img src="dashboard/icons/search-01-stroke-rounded.svg" alt="Search" className="w-[16px] h-[16px]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none border-none text-[#6e6d6d] placeholder:text-[#6e6d6d] font-poppins text-sm font-normal"
                />
                {/* Clear search button */}
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button 
                className="flex items-center gap-1 bg-[#F5F4F7] border border-[#d1d1d154] px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#F2F0F5] transition-colors duration-300 relative"
                onClick={() => setShowFilter(!showFilter)}
              >
                <img src="dashboard/icons/filter-stroke-rounded.svg" alt="" className="w-[16px] h-[16px]" />
                Filter
                {/* Active filter indicator */}
                {(selectedFilter !== 'All Activity' || selectedTimeframe !== 'Last 30 days' || selectedSort !== 'Status') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2563eb] rounded-full"></span>
                )}
              </button>
              <button className="bg-[#eb8d25] text-white px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#ff8c0c] transition-colors duration-300">
                Get New Quote
              </button>
            </div>
            
            {/* Desktop Filter Dropdown */}
            {showFilter && (
              <div className="absolute right-0 top-14 z-50 w-72 bg-white border border-[#e5e7eb] rounded-xl shadow-lg p-4 filter-dropdown hidden md:block">
                <div className="flex justify-between items-center mb-0">
                  <button 
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    onClick={() => setShowFilter(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Filter sections */}
                <div className="space-y-3">
                  {/* Activity Type */}
                  <div>
                    <h4 className="font-poppins font-medium text-xs text-gray-700 mb-2">Activity</h4>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['All Activity', 'Pending', 'Active', 'Expiring', 'Missing', 'Declined'].map((filter) => (
                        <button
                          key={filter}
                          className={`px-2 py-1.5 rounded-md font-poppins text-xs transition-all duration-200 ${
                            selectedFilter === filter
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedFilter(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Timeframe */}
                  <div>
                    <h4 className="font-poppins font-medium text-xs text-gray-700 mb-2">Timeframe</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['Last 7 days', 'Last 30 days', 'Last 3 months', 'All time'].map((timeframe) => (
                        <button
                          key={timeframe}
                          className={`px-2 py-1.5 rounded-md font-poppins text-xs transition-all duration-200 ${
                            selectedTimeframe === timeframe
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedTimeframe(timeframe)}
                        >
                          {timeframe}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sort By */}
                  <div>
                    <h4 className="font-poppins font-medium text-xs text-gray-700 mb-2">Sort by</h4>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Status', 'Date', 'Value', 'Type'].map((sort) => (
                        <button
                          key={sort}
                          className={`px-2 py-1.5 rounded-md font-poppins text-xs transition-all duration-200 ${
                            selectedSort === sort
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedSort(sort)}
                        >
                          {sort}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2 pt-1.5 mt-1.5 border-t border-gray-100">
                  <button 
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-poppins text-xs font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSelectedFilter('All Activity');
                      setSelectedTimeframe('Last 30 days');
                      setSelectedSort('Status');
                    }}
                  >
                    Reset
                  </button>
                  <button 
                    className="flex-1 py-2 bg-[#2563eb] text-white rounded-lg font-poppins text-xs font-medium hover:bg-[#1d4ed8] transition-colors"
                    onClick={() => setShowFilter(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Desktop Table Header */}
          <div className="px-4 sm:px-4 py-2 mb-0.5 hidden md:grid grid-cols-[8.5%_8.5%_1fr_20%_14%_17%] gap-2 pb-2 mb-0 table-header w-[97%] bg-[#ededed7a] mx-auto my-3.5 rounded-[4px]">
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
        </div>

        {/* Active filters display - MINIMALIST STYLE */}
        {(selectedFilter !== 'All Activity' || selectedTimeframe !== 'Last 30 days' || selectedSort !== 'Status' || searchQuery) && (
          <div className="px-4 mb-0.5 mt-1 flex flex-wrap gap-2 filter-tags mobile-filter-tags">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[#fdfeff] border border-[#00000026] text-[#7f7f7f] px-3 py-1.5 rounded-[6px] text-xs font-poppins font-medium mobile-filter-tag">
                Search: "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="ml-1 text-[#7f7f7f] hover:text-black text-sm font-normal transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {selectedFilter !== 'All Activity' && (
              <span className="inline-flex items-center gap-1 bg-[#fdfeff] border border-[#00000026] text-[#7f7f7f] px-3 py-1.5 rounded-[6px] text-xs font-poppins font-medium mobile-filter-tag">
                Activity: {selectedFilter}
                <button 
                  onClick={() => setSelectedFilter('All Activity')} 
                  className="ml-1 text-[#7f7f7f] hover:text-black text-sm font-normal transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTimeframe !== 'Last 30 days' && (
              <span className="inline-flex items-center gap-1 bg-[#fdfeff] border border-[#00000026] text-[#7f7f7f] px-3 py-1.5 rounded-[6px] text-xs font-poppins font-medium mobile-filter-tag">
                Time: {selectedTimeframe}
                <button 
                  onClick={() => setSelectedTimeframe('Last 30 days')} 
                  className="ml-1 text-[#7f7f7f] hover:text-black text-sm font-normal transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {selectedSort !== 'Status' && (
              <span className="inline-flex items-center gap-1 bg-[#fdfeff] border border-[#00000026] text-[#7f7f7f] px-3 py-1.5 rounded-[6px] text-xs font-poppins font-medium mobile-filter-tag">
                Sort: {selectedSort}
                <button 
                  onClick={() => setSelectedSort('Status')} 
                  className="ml-1 text-[#7f7f7f] hover:text-black text-sm font-normal transition-colors"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Table Rows */}
        <div className="table-rows-cont px-4 xl:px-4 block-2 space-y-2 activity-table overflow-y-scroll">
          {filteredRows.length > 0 ? (
            filteredRows.map((row, idx) => (
              <div key={idx} className="tab-item md:grid sm:grid-cols-[8.5%_8.5%_1fr_20%_14%_17%] gap-2 p-4 md:p-3 bg-[#f9f9f6] md:bg-[#f9f9f6] rounded-lg md:rounded-lg flex flex-wrap items-center table-row hover:bg-[#f0f4f9] transition-colors duration-300">
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
                
                {/* Mobile Layout - UPDATED WITH ICONS */}
                <div className="md:hidden w-full">
                  {/* Top row: Type/ID on left, Status on right */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      {/* Type icon */}
                      <img 
                        src={row.type === 'Policy' 
                          ? "/table/document-attachment-stroke-rounded.svg" 
                          : "/table/document-text-stroke-rounded.svg"
                        } 
                        alt={row.type} 
                        className="w-4 h-4"
                      />
                      <span className="font-poppins text-sm font-normal text-black">{row.type}</span>
                      <span className="font-poppins text-sm text-[#2563eb] underline">{row.id}</span>
                    </div>
                    
                    {/* Right side: Status badge */}
                    <div className="row-cell flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[37px] font-poppins text-xs ${row.status.color} ${row.status.textColor} mobile-status-badge`}>
                        <span className={`w-2 h-2 rounded-full ${row.status.dot}`}></span>
                        {row.status.text}
                      </span>
                    </div>
                  </div>
                  
                  {/* Middle row: Cargo on left, Value on right */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      {/* Cargo icon */}
                      <img 
                        src="/table/package-stroke-rounded.svg" 
                        alt="Cargo" 
                        className="w-4 h-4"
                      />
                      <span className="font-poppins text-sm text-gray-700">{row.cargo}</span>
                    </div>
                    <div className="font-poppins text-sm font-normal text-black">{row.value}</div>
                  </div>
                  
                  {/* NEW: Divider line */}
                  <div className="border-t border-[#f2f2ed] my-3"></div>
                  
                  {/* Bottom row: Date and Button in 50/50 split */}
                  <div className="flex items-center justify-between mobile-bottom-row">
                    {/* Date with clock icon - 50% width */}
                    <div className="flex items-center gap-2 w-1/2 mobile-date-container">
                      <img 
                        src="/table/clock.svg" 
                        alt="Time" 
                        className="w-4 h-4"
                      />
                      <div className="font-poppins text-sm text-gray-600">{row.date}</div>
                    </div>
                    
                    {/* Button - 50% width */}
                    <div className="w-1/2 mobile-button-container">
                      <button className={`mobile-action-btn ${
                        row.button.variant === 'primary' 
                          ? 'primary-btn' 
                          : 'secondary-btn'
                      }`}>
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
      </section>

      {/* Mobile Filter Modal - Now appears from bottom */}
      {showFilter && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={() => setShowFilter(false)}
          />
          
          {/* Filter Modal - Sliding from bottom */}
          <div className="relative w-full bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-poppins font-semibold text-lg text-gray-900">Filters</h3>
                <button 
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowFilter(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Filter Content */}
            <div className="p-4 space-y-6">
              {/* Activity Type */}
              <div>
                <h4 className="font-poppins font-medium text-sm text-gray-900 mb-3">Activity</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['All Activity', 'Pending', 'Active', 'Expiring', 'Missing', 'Declined'].map((filter) => (
                    <button
                      key={filter}
                      className={`px-4 py-3 rounded-lg font-poppins text-sm transition-all duration-200 ${
                        selectedFilter === filter
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Timeframe */}
              <div>
                <h4 className="font-poppins font-medium text-sm text-gray-900 mb-3">Timeframe</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Last 7 days', 'Last 30 days', 'Last 3 months', 'All time'].map((timeframe) => (
                    <button
                      key={timeframe}
                      className={`px-4 py-3 rounded-lg font-poppins text-sm transition-all duration-200 ${
                        selectedTimeframe === timeframe
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedTimeframe(timeframe)}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sort By */}
              <div>
                <h4 className="font-poppins font-medium text-sm text-gray-900 mb-3">Sort by</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Status', 'Date', 'Value', 'Type'].map((sort) => (
                    <button
                      key={sort}
                      className={`px-4 py-3 rounded-lg font-poppins text-sm transition-all duration-200 ${
                        selectedSort === sort
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedSort(sort)}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <button 
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-poppins text-base font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    setSelectedFilter('All Activity');
                    setSelectedTimeframe('Last 30 days');
                    setSelectedSort('Status');
                  }}
                >
                  Reset
                </button>
                <button 
                  className="flex-1 py-3.5 bg-[#2563eb] text-white rounded-xl font-poppins text-base font-medium hover:bg-[#1d4ed8] transition-colors"
                  onClick={() => setShowFilter(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ՄՈԲԱՅԼ ԱԴԱՊՏԻՎ CSS - INCLUDING FILTER DROPDOWN */}
      <style jsx>{`
        /* Activity table responsive styles */
        @media screen and (max-width: 1336px) {
          .block-2 {
            overflow: scroll !important;
          }
        }

        @media screen and (min-width: 768px) {
          .activity-section {
            border: 1px solid #d1d1d154 !important;
            background: #fafaf7/80 !important;
            border-radius: 16px !important;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }
          
          .table-rows-cont {
            padding: 0 16px !important;
          }
          
          /* Filter dropdown positioning for desktop */
          .filter-dropdown {
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: 8px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.2s ease-out;
            width: 42%;
            background: #e2e5efff;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile bottom slide-up animation */
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        /* Active filter tags styling - MINIMALIST DESIGN */
        .filter-tags {
          position: relative;
          z-index: 10;
          display: flex !important;
        }
        
        .filter-tags span {
          background-color: #fdfeff !important;
          border: 1px solid #00000026 !important;
          border-radius: 6px !important;
          box-shadow: none !important;
          color: #7f7f7f !important;
          font-family: 'Poppins', sans-serif;
          font-size: 11px !important;
          font-weight: 400;
          padding: 4px 10px !important;
          line-height: 1.4;
          transition: all 0.2s ease;
          display: inline-flex !important;
          align-items: center !important;
        }
        
        .filter-tags span:hover {
          background-color: #f8f9fa !important;
          border-color: #00000040 !important;
        }
        
        .filter-tags button {
          font-size: 14px !important;
          font-weight: 400;
          padding: 0 4px !important;
          margin-left: 4px !important;
          opacity: 0.7;
          transition: all 0.2s ease;
          line-height: 1;
          cursor: pointer;
        }
        
        .filter-tags button:hover {
          opacity: 1;
          color: #333333 !important;
        }

        /* Mobile specific filter tags styling */
        @media screen and (max-width: 768px) {
          .mobile-filter-tags {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            padding: 12px 16px !important;
            background: #f9f9f6 !important;
            margin-top: -8px;
            margin-bottom: 8px !important;
            border-bottom: 1px solid #d1d1d140 !important;
            width: 100% !important;
            box-sizing: border-box !important;
            position: relative !important;
            z-index: 5 !important;
          }
          
          .mobile-filter-tag {
            background-color: #ffffff !important;
            border: 1px solid #00000026 !important;
            border-radius: 6px !important;
            box-shadow: none !important;
            color: #7f7f7f !important;
            font-size: 10px !important;
            padding: 3px 8px !important;
            margin: 2px !important;
            display: inline-flex !important;
            align-items: center !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          .mobile-filter-tags button {
            font-size: 12px !important;
            margin-left: 2px !important;
            opacity: 0.7;
          }
        }

        @media screen and (max-width: 1024px) {
          .block-2 {
            max-height: none !important;
          }
          
          .table-rows-cont {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          
          .activity-table {
            margin-top: 0px;
          }
          
          .table-row:hover {
            background-color: #f6f6ecff !important;
          }
          
          .id-link {
            color: #2563eb !important;
          }
        }

        @media screen and (max-width: 768px) {
          .recent-activity button {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
          
          .table-row {
            min-width: 100%;
            display: flex;
            background-color: rgba(250, 252, 255, 0.8) !important;
            border-radius: 16px !important;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: space-between;
            padding: 20px !important;
            margin-bottom: 12px !important;
            border-bottom: 1px solid #d1d1d140 !important;
          }
          
          .recent-activity h3 {
            font-size: 16px !important;
          }
          
          .table-rows-cont {
            padding: 0 !important;
            margin: 0 !important;
            width: 101% !important;
          }
          
          /* FIX: Keep activity-section styling but ensure filter tags are visible */
          .activity-section {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            position: relative;
            border-radius: 0 !important;
          }
          
          /* Ensure filter tags container is visible in mobile */
          .activity-section > .filter-tags.mobile-filter-tags {
            background: #f9f9f6 !important;
            margin: 0 !important;
            padding: 12px 16px !important;
            display: flex !important;
            width: 100% !important;
          }
          
          .tab-item {
            margin: 0;
            background-color: #f9f9f6 !important;
            border: none !important;
            border-bottom: 1px solid #d1d1d140 !important;
          }
          
          .tab-item:hover {
            background-color: #f6f6ecff !important;
          }
          
          /* Icon container styling */
          .table-row .flex.items-center.gap-2 img {
            opacity: 0.8;
          }
          
          .table-row .flex.items-center.gap-2 img:hover {
            opacity: 1;
          }
          
          /* New mobile bottom row layout */
          .mobile-bottom-row {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
          }
          
          .mobile-date-container {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-right: 6px;
          }
          
          .mobile-button-container {
            padding-left: 6px;
          }
          
          /* Fix mobile status badge alignment */
          .mobile-status-badge {
            margin-left: auto !important;
            margin-right: 0 !important;
          }
        }

        /* Mobile action button styles */
        .mobile-action-btn {
          color: #ffffff;
          cursor: pointer;
          background-color: #2563EB;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 8px;
          align-items: center;
          gap: 8px;
          padding: 12px 8px !important;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          transition: all 0.3s ease;
          display: flex;
          text-align: center;
          justify-content: center;
          width: 100% !important;
          height: 44px;
          border: 1px solid rgba(0, 0, 0, 0.169);
        }

        .mobile-action-btn.primary-btn {
          background-color: #2563EB;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }

        .mobile-action-btn.secondary-btn {
          background-color: transparent;
          color: #374151;
          border: 1px solid #e3e6ea;
        }

        .mobile-action-btn:hover {
          background-color: #1d4ed8;
        }

        .mobile-action-btn.secondary-btn:hover {
          background-color: #f3f4f6;
          border-color: #d1d5db;
        }

        /* Mobile status badge */
        .mobile-status-badge {
          width: fit-content !important;
          min-width: fit-content !important;
          white-space: nowrap !important;
          padding-left: 12px !important;
          padding-right: 12px !important;
          height: 26px;
          display: inline-flex !important;
          align-items: center !important;
          transition: all 0.3s ease;
        }

        @media screen and (max-width: 1024px) {
          .table-row .mobile-status-badge {
            font-size: 11px !important;
            padding: 6px 10px !important;
            height: 24px;
          }
        }

        @media screen and (max-width: 768px) {
          .mobile-action-btn {
            height: 44px;
            font-size: 14px;
            font-weight: 500;
            width: 95% !important;
            min-width: 0 !important;
          }
          
          .mobile-status-badge {
            font-size: 10px !important;
            padding: 5px 8px !important;
            height: 22px;
          }
          
          /* Ensure 50/50 split works properly */
          .mobile-date-container,
          .mobile-button-container {
            flex: 0 0 50% !important;
            max-width: 50% !important;
          }
          
          /* Adjust spacing for the divider */
          .border-t {
            margin-top: 12px !important;
            margin-bottom: 12px !important;
          }
          
          /* Icon sizes */
          .table-row .flex.items-center.gap-2 img {
            width: 16px !important;
            height: 16px !important;
          }
          
          .mobile-date-container img {
            width: 16px !important;
            height: 16px !important;
          }
        }

        @media screen and (max-width: 425px) {
          h2.block {
            font-size: 16px;
          }
          
          .header-btn button {
            font-size: 14px;
            padding: 6px 12px;
          }
          
          /* Adjust for very small screens */
          .mobile-date-container {
            gap: 4px;
          }
          
          .mobile-date-container img {
            width: 14px !important;
            height: 14px !important;
          }
          
          .mobile-date-container .font-poppins {
            font-size: 12px !important;
          }
          
          .mobile-action-btn {
            font-size: 13px !important;
            padding: 10px 6px !important;
            height: 40px;
            max-width: 95%;
          }
          
          /* Smaller icons on very small screens */
          .table-row .flex.items-center.gap-2 img {
            width: 14px !important;
            height: 14px !important;
          }
          
          /* Mobile filter modal adjustments */
          .fixed.inset-0 .relative {
            max-height: 80vh !important;
          }
          
          .fixed.inset-0 .p-4 {
            padding: 16px !important;
          }
          
          .fixed.inset-0 button {
            font-size: 14px !important;
            padding: 12px !important;
          }
          
          /* Active filters on small screens */
          .mobile-filter-tags {
            padding: 10px 12px !important;
          }
          
          .mobile-filter-tag {
            font-size: 9px !important;
            padding: 2px 6px !important;
          }
        }

        /* Specific adjustments for iPhone SE and similar small devices */
        @media screen and (max-width: 375px) {
          .mobile-bottom-row {
            flex-direction: column;
            gap: 8px;
          }
          
          .mobile-date-container,
          .mobile-button-container {
            flex: 0 0 100% !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
          }
          
          .mobile-date-container {
            justify-content: center;
            margin-bottom: 4px;
          }
          
          /* Mobile filter modal adjustments */
          .fixed.inset-0 .grid.grid-cols-2 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .fixed.inset-0 button {
            font-size: 13px !important;
            padding: 10px !important;
          }
          
          /* Active filters on very small screens */
          .mobile-filter-tags {
            flex-wrap: nowrap !important;
            overflow-x: auto;
            padding: 8px 10px !important;
            white-space: nowrap;
            -webkit-overflow-scrolling: touch;
            margin-bottom: 6px !important;
          }
          
          .mobile-filter-tag {
            flex-shrink: 0;
            font-size: 8px !important;
            padding: 2px 5px !important;
            margin: 2px 3px !important;
          }
          
          .mobile-filter-tags button {
            font-size: 10px !important;
          }
        }

        /* Desktop filter dropdown */
        .filter-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          animation: slideDown 0.2s ease-out;
          width: 34% !important;
          max-width: 90vw;
          border: 1px solid #e5e7eb !important;
          border-radius: 12px !important;
          background: #f8f9fa !important;
        }

        /* Mobile filter modal specific styles */
        @media screen and (max-width: 768px) {
          .fixed.inset-0 {
            z-index: 9999;
          }
          
          .fixed.inset-0 .relative {
            width: 100% !important;
            border-radius: 24px 24px 0 0 !important;
            box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.1);
          }
          
          .fixed.inset-0 h3 {
            font-size: 18px !important;
            font-weight: 600;
          }
          
          .fixed.inset-0 h4 {
            font-size: 15px !important;
            font-weight: 500;
          }
          
          .fixed.inset-0 .space-y-6 > div {
            margin-bottom: 20px;
          }
          
          .fixed.inset-0 .grid.grid-cols-2 button {
            width: 100%;
            text-align: center;
            padding: 14px 12px;
            border-radius: 12px;
            font-weight: 500;
          }
          
          .fixed.inset-0 .sticky.bottom-0 {
            padding-top: 16px;
            padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
            background: linear-gradient(to top, white 85%, transparent);
          }
          
          .fixed.inset-0 .sticky.bottom-0 button {
            padding: 16px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 14px;
          }
        }

        @media screen and (max-width: 425px) {
          .fixed.inset-0 .grid.grid-cols-2 button {
            padding: 12px 8px;
            font-size: 14px;
          }
          
          .fixed.inset-0 .sticky.bottom-0 button {
            padding: 14px;
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
};

// Default data
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
  }
];

export default RecentActivityTable;