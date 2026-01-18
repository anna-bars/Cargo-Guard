"use client";

import { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Package, 
  Plane, 
  Ship, 
  Truck,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';

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

  // Cargo options
  const cargoOptions = [
    { value: 'electronics', label: 'Electronics', icon: '💻' },
    { value: 'clothing', label: 'Clothing', icon: '👕' },
    { value: 'machinery', label: 'Machinery', icon: '⚙️' },
    { value: 'food', label: 'Food Products', icon: '🍎' },
    { value: 'chemicals', label: 'Chemicals', icon: '🧪' },
    { value: 'pharma', label: 'Pharmaceuticals', icon: '💊' },
    { value: 'other', label: 'Other', icon: '📦' },
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Cargo Type Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Cargo Information</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Cargo Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cargo Type *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {cargoOptions.map((option) => (
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
                              <span className="text-2xl">{option.icon}</span>
                              <span className="text-sm font-medium text-gray-700">
                                {option.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Shipment Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <p className="mt-2 text-sm text-gray-500">
                        Include all freight charges and duties for full coverage
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Route Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Origin */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Coverage Period</h2>
                    </div>
                    
                    <div className="space-y-4 flex justify-between">
                      <div className='w-[49%]'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="pl-10 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div className='w-[48.8%]'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="pl-10 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transport Mode */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Truck className="w-5 h-5 text-blue-600" />
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
                              p-2 rounded-lg
                              ${transportationMode === mode.id
                                ? `bg-blue-100 text-blue-600`
                                : 'bg-gray-100 text-gray-500'
                              }
                            `}>
                              <Icon className="w-6 h-6" />
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