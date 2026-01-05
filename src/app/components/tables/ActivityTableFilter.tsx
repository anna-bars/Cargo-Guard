import React, { useState } from 'react';

interface ActivityTableFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  showMobileHeader?: boolean;
  title?: string;
  onReset?: () => void;
}

export const ActivityTableFilter: React.FC<ActivityTableFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  selectedTimeframe,
  setSelectedTimeframe,
  selectedSort,
  setSelectedSort,
  showMobileHeader = true,
  title = 'Recent Insurance Activity',
  onReset
}) => {
  const [showFilter, setShowFilter] = useState(false);

  const handleReset = () => {
    setSelectedFilter('All Activity');
    setSelectedTimeframe('Last 30 days');
    setSelectedSort('Status');
    setSearchQuery('');
    if (onReset) onReset();
  };

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

      <div className='block-1'>
        <div className='flex px-0 md:px-4 justify-between items-center border-b border-b-[#d1d1d154] pb-3 relative'>
          <h2 className="block">{title}</h2>
          <div className='header-btn flex justify-between gap-2'>
            <div className='desktop-filter-cont hidden md:flex items-center gap-4 bg-[#f9f9f6] rounded-lg mx-4'>
              <div className="flex items-center gap-2">
                {/* Activity Filter */}
                <div className="relative">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="appearance-none bg-[#f3f2ee] border border-[#d1d1d154] rounded-lg px-3 py-2 pl-4 pr-8 font-poppins text-sm text-gray-700 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] cursor-pointer min-w-[140px]"
                  >
                    <option value="All Activity">All Activity</option>
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Expiring">Expiring</option>
                    <option value="Missing">Missing</option>
                    <option value="Declined">Declined</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Timeframe Filter */}
                <div className="relative">
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="appearance-none bg-[#f3f2ee] border border-[#d1d1d154] rounded-lg px-3 py-2 pl-4 pr-8 font-poppins text-sm text-gray-700 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] cursor-pointer min-w-[140px]"
                  >
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 3 months">Last 3 months</option>
                    <option value="All time">All time</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Sort By Filter */}
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="appearance-none bg-[#f3f2ee] border border-[#d1d1d154] rounded-lg px-3 py-2 pl-4 pr-8 font-poppins text-sm text-gray-700 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] cursor-pointer min-w-[120px]"
                  >
                    <option value="Status">Status</option>
                    <option value="Date">Date</option>
                    <option value="Value">Value</option>
                    <option value="Type">Type</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
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
                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-poppins text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </div>
            </div>
            
            <button 
              className="md:hidden flex items-center gap-1 bg-[#F5F4F7] border border-[#d1d1d154] px-4 py-2 rounded-lg font-poppins text-sm font-normal hover:bg-[#F2F0F5] transition-colors duration-300 relative"
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

      {/* Mobile Filter Modal */}
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
                  onClick={handleReset}
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
    </>
  );
};