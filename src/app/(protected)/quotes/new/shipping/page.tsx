"use client";

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Cpu,
  Shirt,
  Cog,
  Apple,
  FlaskConical,
  Pill,
  Box,
  Plane, 
  Ship, 
  Truck,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';

// Custom Date Picker Component
const CustomDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date",
  minDate,
  maxDate 
}: {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const today = new Date();
  const min = minDate ? new Date(minDate) : null;
  const max = maxDate ? new Date(maxDate) : null;

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateSelect = (day: number) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    
    // Check if date is within range
    if (min && selected < min) return;
    if (max && selected > max) return;
    
    setSelectedDate(selected);
    onChange(selected.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const isDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as Element).closest('.date-picker-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative date-picker-container">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors flex items-center justify-between bg-white"
      >
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value ? formatDate(new Date(value)) : placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="font-semibold text-gray-900">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const disabled = isDisabled(day);
              const today = isToday(day);
              const selected = isSelected(day);
              
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={disabled}
                  className={`
                    h-8 rounded-lg text-sm transition-all duration-200
                    ${selected
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : today
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'hover:bg-gray-100 text-gray-900'
                    }
                    ${disabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setSelectedDate(today);
                onChange(today.toISOString().split('T')[0]);
                setIsOpen(false);
              }}
              className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Select Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ShippingValuePage() {
  // State-ներ
  const [cargoType, setCargoType] = useState('');
  const [shipmentValue, setShipmentValue] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transportationMode, setTransportationMode] = useState('');
  const [step, setStep] = useState(1);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  // Cargo options with Lucide icons
  const cargoOptions = [
    { value: 'electronics', label: 'Electronics', icon: Cpu },
    { value: 'clothing', label: 'Clothing', icon: Shirt },
    { value: 'machinery', label: 'Machinery', icon: Cog },
    { value: 'food', label: 'Food Products', icon: Apple },
    { value: 'chemicals', label: 'Chemicals', icon: FlaskConical },
    { value: 'pharma', label: 'Pharmaceuticals', icon: Pill },
    { value: 'other', label: 'Other', icon: Box },
  ];

  // Transport modes
  const transportModes = [
    { id: 'sea', name: 'Sea Freight', icon: Ship, color: 'blue' },
    { id: 'air', name: 'Air Freight', icon: Plane, color: 'emerald' },
    { id: 'road', name: 'Road Freight', icon: Truck, color: 'amber' },
  ];

  // Progress steps
  const steps = [
    { id: 1, name: 'Shipment Details', status: 'current' },
    { id: 2, name: 'Coverage Options', status: 'upcoming' },
    { id: 3, name: 'Quote Review', status: 'upcoming' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
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
    // Next step logic
    setStep(2);
  };

  const handleCancel = () => {
    setCargoType('');
    setShipmentValue('');
    setOrigin('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setTransportationMode('');
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader userEmail="client@example.com" />
      
      {/* Main Content */}
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button className="flex items-center gap-2 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Quotes</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">New Quote</span>
          </div>
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Create Shipping Insurance Quote</h1>
              <span className="text-sm text-gray-500">Step {step} of 3</span>
            </div>
            
            <div className="flex items-center">
              {steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2
                    ${stepItem.id === step 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : stepItem.id < step
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                    }
                  `}>
                    {stepItem.id < step ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      stepItem.id
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    stepItem.id === step ? 'text-blue-600' : 
                    stepItem.id < step ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {stepItem.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 w-16 mx-4 ${
                      stepItem.id < step ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_0.02fr_0.7fr]">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 w-[99%]">
            <div className="bg-[#FFFFFE] rounded-2xl shadow-lg border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Cargo Type Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Cargo Information</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Cargo Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#868686] mb-2">
                        Cargo Type *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {cargoOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setCargoType(option.value)}
                              className={`
                                p-4 rounded-xl border-2 transition-all duration-200
                                ${cargoType === option.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <div className={`
                                  p-3 rounded-lg
                                  ${cargoType === option.value
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600'
                                  }
                                `}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-[#868686]">
                                  {option.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shipment Value */}
                    <div>
                      <label className="block text-sm font-medium text-[#868686] mb-2">
                        Shipment Value (USD) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          value={shipmentValue}
                          onChange={(e) => setShipmentValue(e.target.value)}
                          placeholder="Enter total value"
                          className="pl-10 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">USD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Route Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Origin */}
                    <div>
                      <label className="block text-sm font-medium text-[#868686] mb-2">
                        Origin *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          placeholder="e.g., New York Port, USA"
                          className="pl-10 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div>
                      <label className="block text-sm font-medium text-[#868686] mb-2">
                        Destination *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="e.g., Shanghai Port, China"
                          className="pl-10 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates & Transport */}
                <div className="">
                  {/* Dates */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Coverage Period</h2>
                    </div>
                    
                    <div className="space-y-4 flex justify-between">
                      <div className='w-[49%]'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <CustomDatePicker
                          value={startDate || today}
                          onChange={setStartDate}
                          placeholder="Select start date"
                          minDate={today}
                        />
                      </div>

                      <div className='w-[48.8%]'>
                        <label className="block text-sm font-medium text-[#868686] mb-2">
                          End Date *
                        </label>
                        <CustomDatePicker
                          value={endDate || tomorrowFormatted}
                          onChange={setEndDate}
                          placeholder="Select end date"
                          minDate={startDate || today}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transport Mode */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Transport Mode *</h2>
                    </div>
                    
                    <div className="space-y-3 flex justify-between">
                      {transportModes.map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setTransportationMode(mode.id)}
                            className={`
                              w-[32.7%] relative p-4 rounded-xl border-2 transition-all duration-200
                              flex flex-col items-center gap-4 mb-0
                              ${transportationMode === mode.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className={`
                              p-3 rounded-lg
                              ${transportationMode === mode.id
                                ? `bg-blue-100 text-blue-600`
                                : 'bg-gray-100 text-gray-500'
                              }
                            `}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 text-center">
                              <div className="font-medium text-gray-900">{mode.name}</div>
                              <div className="text-sm text-gray-500">
                                {mode.id === 'sea' && 'Most economical, 20-40 days'}
                                {mode.id === 'air' && 'Fastest option, 2-7 days'}
                                {mode.id === 'road' && 'Regional delivery, 3-10 days'}
                              </div>
                            </div>
                            {transportationMode === mode.id && (
                              <div className="w-5 h-5 absolute top-2 right-2 rounded-full bg-blue-500 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={!cargoType || !shipmentValue || !origin || !destination || !startDate || !endDate || !transportationMode}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      Continue to Coverage Options
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Tips & Help */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="bg-[url('/quotes/new/shipping-wd-back.png')] bg-cover flex flex-col gap-8 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Smart Quote Tips</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">Full Coverage:</span> Include all freight charges and duties in shipment value for complete protection.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">Lower Premiums:</span> Accurate cargo classification can reduce premiums by up to 30%.
                  </p>
                </div>

                <div>
                 
                <div className="pt-4 ">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 text-white">Progress</span>
                    <span className="text-sm font-semibold text-white">
                      {[
                        !!cargoType,
                        !!shipmentValue,
                        !!origin && !!destination,
                        !!startDate && !!endDate,
                        !!transportationMode
                      ].filter(Boolean).length} of 5
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(
                          [
                            !!cargoType,
                            !!shipmentValue,
                            !!origin && !!destination,
                            !!startDate && !!endDate,
                            !!transportationMode
                          ].filter(Boolean).length / 5
                        ) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                </div>
               
              </div>
            </div>


            {/* Help Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Our team is here to assist you with any questions about your shipment insurance.
              </p>
              <button className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}