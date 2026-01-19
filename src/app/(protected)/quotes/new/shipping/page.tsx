"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, CheckCircle, Ship, Plane, Truck } from 'lucide-react';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import CustomDatePicker from './components/CustomDatePicker';
import LocationIQAutocomplete from './components/LocationIQAutocomplete';
import MobileTipsCard from './components/MobileTipsCard';
import MobileStepIndicator from './components/MobileStepIndicator';
import CargoTypeSelector from './components/CargoTypeSelector';
import { LocationData } from './components/LocationIQAutocomplete';
import { useUser } from '@/app/context/UserContext';

export default function ShippingValuePage() {
  const router = useRouter();
  const { user } = useUser();
  
  const [cargoType, setCargoType] = useState('');
  const [shipmentValue, setShipmentValue] = useState('');
  const [origin, setOrigin] = useState<LocationData | null>(null);
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transportationMode, setTransportationMode] = useState('');
  const [step, setStep] = useState(1);
  const [otherCargoType, setOtherCargoType] = useState('');
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Փոխել true-ից false

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  const transportModes = [
    { id: 'sea', name: 'Sea Freight', icon: Ship, color: 'blue' },
    { id: 'air', name: 'Air Freight', icon: Plane, color: 'emerald' },
    { id: 'road', name: 'Road Freight', icon: Truck, color: 'amber' },
  ];

  const steps = [
    { id: 1, name: 'Shipment Details', status: 'current' },
    { id: 2, name: 'Coverage Options', status: 'upcoming' },
    { id: 3, name: 'Quote Review', status: 'upcoming' },
  ];

  // Load draft from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadDraftFromLocalStorage = () => {
      try {
        const draftData = localStorage.getItem('quote_draft');
        if (draftData) {
          const draft = JSON.parse(draftData);
          setCargoType(draft.cargoType || '');
          setOtherCargoType(draft.otherCargoType || '');
          setShipmentValue(draft.shipmentValue || '');
          setStartDate(draft.startDate || today);
          setEndDate(draft.endDate || tomorrowFormatted);
          setTransportationMode(draft.transportationMode || '');
          setOrigin(draft.origin || null);
          setDestination(draft.destination || null);
          setQuoteId(draft.quoteId || `temp-${Date.now()}`);
        } else {
          // Create new draft ID
          setQuoteId(`temp-${Date.now()}`);
          setStartDate(today);
          setEndDate(tomorrowFormatted);
        }
      } catch (error) {
        console.error('Error loading draft from localStorage:', error);
        // Create new draft ID as fallback
        setQuoteId(`temp-${Date.now()}`);
        setStartDate(today);
        setEndDate(tomorrowFormatted);
      }
    };

    loadDraftFromLocalStorage();
  }, []);

  // Auto-save to localStorage with debounce
  useEffect(() => {
    if (typeof window === 'undefined' || !quoteId) return;

    const timeoutId = setTimeout(() => {
      const draftData = {
        quoteId,
        cargoType,
        otherCargoType,
        shipmentValue,
        startDate,
        endDate,
        transportationMode,
        origin,
        destination,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem('quote_draft', JSON.stringify(draftData));
      setIsSaving(false);
    }, 1000); // Debounce 1 second

    setIsSaving(true);

    return () => clearTimeout(timeoutId);
  }, [cargoType, otherCargoType, shipmentValue, startDate, endDate, transportationMode, origin, destination, quoteId]);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!isFormComplete) {
    alert('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը');
    return;
  }

  // Prepare the data to pass to next page
  const quoteData = {
    quoteId: quoteId || `q-${Date.now()}`,
    cargoType: cargoType === 'other' ? otherCargoType : cargoType,
    shipmentValue: parseFloat(shipmentValue),
    origin,
    destination,
    startDate,
    endDate,
    transportationMode
  };

  // Save to localStorage for the next page
  localStorage.setItem('quote_submission', JSON.stringify(quoteData));
  
  // Navigate to insurance page
  router.push(`/quotes/new/insurance?quote_id=${quoteData.quoteId}`);
};
  const handleCancel = () => {
    if (window.confirm('Համոզված ե՞ք, որ ցանկանում եք չեղարկել: Բոլոր մուտքագրված տվյալները կկորչեն։')) {
      // Clear localStorage
      localStorage.removeItem('quote_draft');
      
      // Reset form
      setCargoType('');
      setOtherCargoType('');
      setShipmentValue('');
      setOrigin(null);
      setDestination(null);
      setStartDate('');
      setEndDate('');
      setTransportationMode('');
      setQuoteId(null);
      setStep(1);
      
      // Navigate back
      router.push('/quotes');
    }
  };

  const completedFields = [
    cargoType === 'other' ? !!otherCargoType : !!cargoType,
    !!shipmentValue,
    !!origin,
    !!destination,
    !!startDate,
    !!endDate,
    !!transportationMode
  ].filter(Boolean).length;

  const totalFields = 7;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);
  const isFormComplete = completedFields === totalFields;

  // Remove loading state since we're not waiting for API
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader userEmail={user?.email} />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader userEmail={user?.email} />
      
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 pb-6 md:pb-8">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button 
              onClick={() => router.push('/quotes')}
              className="flex items-center gap-2 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Quotes</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">New Quote</span>
          </div>
          
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
        
        <div className="flex items-center gap-3 mt-0 mb-2 sm:mt-0">
          <img
            src="/quotes/header-ic.svg"
            alt=""
            className="w-[22px] h-[22px] sm:w-6 sm:h-6"
          />
          <h2 className="font-normal text-[18px] sm:text-[26px]">Shipment Insurance Quote</h2>
          {isSaving && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Saving...
            </span>
          )}
        </div> 

        {/* Mobile Header */}
        <MobileStepIndicator currentStep={step} />
        <MobileTipsCard completionPercentage={completionPercentage} />
        

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_0.02fr_0.7fr]">
          <div className="lg:col-span-2 w-full lg:w-[99%]">
            <div className="bg-[#FFFFFE] rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Cargo Type Section */}
                <CargoTypeSelector 
                  cargoType={cargoType}
                  otherCargoType={otherCargoType}
                  onCargoTypeSelect={setCargoType}
                  onOtherCargoTypeChange={setOtherCargoType}
                />

                {/* Shipment Value */}
                <div>
                  <label className="block text-sm font-medium text-[#868686] mb-2">
                    Shipment Value (USD) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      value={shipmentValue}
                      onChange={(e) => setShipmentValue(e.target.value)}
                      placeholder="Enter total value"
                      className="pl-10 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors text-sm md:text-base placeholder:text-sm md:placeholder:text-base"
                      required
                      min="0"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">USD</span>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Route Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <LocationIQAutocomplete
                      value={origin}
                      onChange={setOrigin}
                      placeholder="Search location..."
                      label="Origin *"
                      required
                    />

                    <LocationIQAutocomplete
                      value={destination}
                      onChange={setDestination}
                      placeholder="Search location..."
                      label="Destination *"
                      required
                    />
                  </div>
                </div>

                {/* Dates & Transport */}
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Coverage Period</h2>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div className='w-full sm:w-[49%]'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <CustomDatePicker
                          value={startDate || today}
                          onChange={setStartDate}
                          placeholder="Start date"
                          minDate={today}
                        />
                      </div>

                      <div className='w-full sm:w-[49%]'>
                        <label className="block text-sm font-medium text-[#868686] mb-2">
                          End Date *
                        </label>
                        <CustomDatePicker
                          value={endDate || tomorrowFormatted}
                          onChange={setEndDate}
                          placeholder="End date"
                          minDate={startDate || today}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Transport Mode *</h2>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                      {transportModes.map((mode) => {
                        const Icon = mode.icon;
                        const transportDescriptions = {
                          'sea': '20-40 days',
                          'air': '2-7 days', 
                          'road': '3-10 days'
                        };
                        
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setTransportationMode(mode.id)}
                            className={`
                              w-full sm:w-[32.7%] relative p-4 rounded-xl border-2 transition-all duration-200
                              flex flex-col sm:flex-col items-center gap-3 md:gap-4 mb-0
                              ${transportationMode === mode.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className={`
                              p-3 rounded-lg flex items-center justify-center
                              ${transportationMode === mode.id
                                ? `bg-blue-100 text-blue-600`
                                : 'bg-gray-100 text-gray-500'
                              }
                            `}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 text-center">
                              <div className="font-medium text-gray-900 text-sm md:text-base">{mode.name}</div>
                              <div className="text-xs md:text-sm text-gray-500">
                                {transportDescriptions[mode.id as keyof typeof transportDescriptions]}
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
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => router.push('/quotes')}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm md:text-base order-2 sm:order-1"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormComplete}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-sm md:text-base order-1 sm:order-2"
                    >
                      Continue to Coverage Options
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Tips & Help (Desktop only) */}
          <div className="hidden lg:block space-y-6">
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
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 text-white">Progress</span>
                      <span className="text-sm font-semibold text-white">
                        {completedFields} of {totalFields}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-white h-3 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

        {/* Mobile Help Card (Fixed at bottom) */}
        <div className="lg:hidden mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
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
  );
}