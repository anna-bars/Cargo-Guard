"use client";

import { useState } from 'react';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader'

export default function ShippingValuePage() {
  // State-ներ բոլոր input-ների համար
  const [cargoType, setCargoType] = useState('');
  const [shipmentValue, setShipmentValue] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transportationMode, setTransportationMode] = useState('');

  // Cargo type options
  const cargoOptions = [
    'Electronics',
    'Clothing',
    'Machinery',
    'Food Products',
    'Chemicals',
    'Pharmaceuticals',
    'Other'
  ];

  // Transportation modes
  const transportModes = [
    { id: 'sea', name: 'Sea', icon: '/icons/sea.svg' },
    { id: 'air', name: 'Air', icon: '/icons/air.svg' },
    { id: 'road', name: 'Road', icon: '/icons/road.svg' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      cargoType,
      shipmentValue,
      origin,
      destination,
      startDate,
      endDate,
      transportationMode
    });
    // Այստեղ կարող եք ավելացնել quote հաշվարկման լոգիկա
  };

  const handleCancel = () => {
    // Reset բոլոր input-ները
    setCargoType('');
    setShipmentValue('');
    setOrigin('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setTransportationMode('');
  };

  // Ձևավորել date-ը input-ի համար
  const formatDateForInput = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 30); // 30 օր հետո
    
    return {
      today: today.toISOString().split('T')[0],
      tomorrow: tomorrow.toISOString().split('T')[0]
    };
  };

  const defaultDates = formatDateForInput();

  return (
    <div className="min-h-screen bg-[#F3F3F6]">
      <DashboardHeader userEmail={"c"} />
      
      {/* Page Header */}
      <div className="px-6">
        <div className="flex items-center gap-3 mt-4 mb-2 sm:mt-0">
          <img
            src="/quotes/header-ic.svg"
            alt="Quote Icon"
            className="w-[22px] h-[22px] sm:w-6 sm:h-6"
          />
          <h2 className="font-normal text-[18px] sm:text-[26px]">
            Shipment Insurance Quote
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="px-6 py-4">
        <div className="flex gap-6">
          {/* Left Column - Form */}
          <div className="w-[1241px] flex flex-col gap-[44px] bg-[#fafcff] p-6 rounded-2xl">
            <div className="flex flex-col gap-[44px]">
              {/* Cargo Type Dropdown */}
              <div className="w-[585px] flex flex-col gap-2">
                <label htmlFor="cargoType" className="font-normal text-[14px] leading-[18px] text-[#505050]">
                  Cargo Type *
                </label>
                <div className="relative">
                  <select
                    id="cargoType"
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                    className="w-full h-[42px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8] bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select cargo type</option>
                    {cargoOptions.map((option) => (
                      <option key={option} value={option.toLowerCase()}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg 
                      className="w-4 h-4 text-[#7b7b7b]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Shipment Value Input */}
              <div className="w-[585px] flex flex-col gap-2">
                <label htmlFor="shipmentValue" className="font-normal text-[14px] leading-[18px] text-[#505050]">
                  Shipment Value (USD) *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7b7b7b]">
                    $
                  </div>
                  <input
                    type="number"
                    id="shipmentValue"
                    value={shipmentValue}
                    onChange={(e) => setShipmentValue(e.target.value)}
                    placeholder="Enter total shipment value"
                    className="w-full h-[42px] pl-10 pr-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Origin and Destination */}
              <div className="flex justify-between items-center self-stretch">
                {/* Origin Input */}
                <div className="w-[585px] flex flex-col gap-2">
                  <label htmlFor="origin" className="font-normal text-[14px] leading-[18px] text-[#505050]">
                    From (Origin City / Port) *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-3 h-4 text-[#505050]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="origin"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="e.g., New York, USA"
                      className="w-full h-[42px] pl-10 pr-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Destination Input */}
                <div className="w-[585px] flex flex-col gap-2">
                  <label htmlFor="destination" className="font-normal text-[14px] leading-[18px] text-[#505050]">
                    To (Destination City / Port) *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-3 h-4 text-[#505050]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g., London, UK"
                      className="w-full h-[42px] pl-10 pr-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Coverage Period */}
              <div className="flex justify-between items-end self-stretch">
                {/* Start Date Input */}
                <div className="w-[585px] flex flex-col gap-2">
                  <label htmlFor="startDate" className="font-normal text-[14px] leading-[18px] text-[#505050]">
                    Coverage Start Date *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-[#505050]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate || defaultDates.today}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-[42px] pl-10 pr-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min={defaultDates.today}
                      required
                    />
                  </div>
                </div>

                {/* End Date Input */}
                <div className="w-[585px] flex flex-col gap-2">
                  <label htmlFor="endDate" className="font-normal text-[14px] leading-[18px] text-[#505050]">
                    Coverage End Date *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-[#505050]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate || defaultDates.tomorrow}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-[42px] pl-10 pr-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min={startDate || defaultDates.today}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Transportation Mode Selection */}
              <div className="flex flex-col gap-4">
                <label className="font-normal text-[14px] leading-[18px] text-[#505050]">
                  Transportation Mode *
                </label>
                <div className="flex justify-between items-center self-stretch">
                  {transportModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTransportationMode(mode.id)}
                      className={`w-[383px] flex flex-col justify-center items-center gap-[3px] px-4 py-3 rounded-[7px] border border-solid transition-all duration-200 ${
                        transportationMode === mode.id 
                          ? 'border-blue-600 bg-blue-50 shadow-sm' 
                          : 'border-[#c8c8c8] hover:border-blue-400 hover:bg-blue-25'
                      }`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center ${
                        transportationMode === mode.id ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {mode.id === 'sea' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4m16 0l-4-4m4 4l-4 4M4 12l4-4m-4 4l4 4" />
                          )}
                          {mode.id === 'air' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                          )}
                          {mode.id === 'road' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          )}
                        </svg>
                      </div>
                      <span className={`font-normal text-[14px] leading-[18px] text-center ${
                        transportationMode === mode.id ? 'text-blue-600 font-medium' : 'text-[#505050]'
                      }`}>
                        {mode.name}
                      </span>
                    </button>
                  ))}
                </div>
                {!transportationMode && (
                  <p className="text-red-500 text-sm mt-1">Please select a transportation mode</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={handleCancel}
                className="flex justify-center items-center gap-2.5 px-4 py-3 rounded-md border border-solid border-[#c6c8cb] hover:bg-gray-50 transition-colors"
              >
                <span className="font-normal text-[16px] leading-[18px] text-gray-700">
                  Cancel
                </span>
              </button>
              <button 
                type="submit"
                disabled={!cargoType || !shipmentValue || !origin || !destination || !startDate || !endDate || !transportationMode}
                className="flex justify-center items-center gap-2.5 bg-blue-600 px-4 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span className="font-normal text-[16px] leading-[18px] text-white">
                  Calculate Quote
                </span>
              </button>
            </div>
          </div>

          {/* Right Column - Tips */}
          <div className="flex flex-col gap-[76px] p-6 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-800">
            <span className="font-normal text-[20px] text-white">
              Smart Quote Tips
            </span>
            
            <div className="flex flex-col gap-6 self-stretch">
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[14px] text-white">
                  Full Coverage: Ensure your Shipment Value includes all freight and duties to guarantee full coverage.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[14px] text-white">
                  Lower Premiums: Selecting the correct Cargo Type can significantly reduce your premium.
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-[13px] self-stretch">
              <span className="font-bold text-[12px] leading-3 text-right text-white">
                1 of 6
              </span>
              <span className="font-normal text-[10px] leading-3 text-white">
                Complete 6 more fields to continue.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}