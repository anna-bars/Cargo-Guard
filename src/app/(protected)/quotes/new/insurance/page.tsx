"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, ChevronRight, Info } from 'lucide-react';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';

interface QuoteData {
  cargoType: string;
  shipmentValue: number;
  origin: {
    name: string;
    city: string;
    country: string;
  };
  destination: {
    name: string;
    city: string;
    country: string;
  };
  startDate: string;
  endDate: string;
  transportationMode: string;
}

interface CoverageOption {
  id: string;
  name: string;
  description: string;
  premium: number;
  coverage: string[];
  deductible: number;
  features: string[];
  color: string;
}

export default function InsuranceQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [selectedCoverage, setSelectedCoverage] = useState<string>('standard');
  const [loading, setLoading] = useState(true);

  // Demo data - իրականում պետք է ստանաք URL-ից կամ API-ից
  useEffect(() => {
    // Սիմուլյացիա՝ տվյալների ստացում
    const mockData: QuoteData = {
      cargoType: 'Electronics',
      shipmentValue: 45000,
      origin: {
        name: 'New York Port',
        city: 'New York',
        country: 'USA'
      },
      destination: {
        name: 'Tokyo Port',
        city: 'Tokyo',
        country: 'Japan'
      },
      startDate: '2025-12-10',
      endDate: '2025-12-25',
      transportationMode: 'Air'
    };

    setQuoteData(mockData);
    setLoading(false);
  }, []);

  const coverageOptions: CoverageOption[] = [
    {
      id: 'standard',
      name: 'Standard Coverage',
      description: 'Base protection for loss or damage.',
      premium: calculatePremium('standard'),
      coverage: ['All Risks', 'Theft', 'Accidental Damage'],
      deductible: 1000,
      features: ['Basic coverage', 'Standard response time', 'Email support'],
      color: 'border-[#7dabf1]'
    },
    {
      id: 'premium',
      name: 'Premium Coverage',
      description: 'Includes war, strike, and special risk coverage.',
      premium: calculatePremium('premium'),
      coverage: ['All Risks', 'War Risks', 'Strike Coverage', 'Special Perils'],
      deductible: 500,
      features: [
        'Extended coverage',
        '24/7 emergency support',
        'Priority claims processing',
        'Dedicated account manager'
      ],
      color: 'border-transparent'
    }
  ];

  function calculatePremium(type: string): number {
    if (!quoteData) return 0;
    
    const baseRate = quoteData.shipmentValue * 0.015; // 1.5% base rate
    const modeMultiplier = quoteData.transportationMode === 'Air' ? 1.2 : 1.0;
    const typeMultiplier = type === 'premium' ? 1.5 : 1.0;
    const durationDays = Math.ceil(
      (new Date(quoteData.endDate).getTime() - new Date(quoteData.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const durationMultiplier = durationDays / 30; // Monthly rate
    
    return Math.round(baseRate * modeMultiplier * typeMultiplier * durationMultiplier);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateRange = () => {
    if (!quoteData) return '';
    return `${formatDate(quoteData.startDate)} – ${formatDate(quoteData.endDate)}`;
  };

  const handleApproveQuote = () => {
    // Այստեղ ավելացրեք API call կամ navigation դեպի վճարման էջ
    alert('Quote approved! Proceeding to payment...');
  };

  const handleModifyInputs = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader userEmail="client@example.com" />
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
      <DashboardHeader userEmail="client@example.com" />
      
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button 
              onClick={() => router.push('/quotes/new/shipping')}
              className="flex items-center gap-2 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shipment Details</span>
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium">Insurance Quote</span>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Your Insurance Quote</h1>
              <span className="text-sm text-gray-500">Step 2 of 3</span>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-green-500 bg-green-500 text-white">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Shipment Details</span>
              </div>
              
              <div className="h-0.5 w-16 mx-4 bg-green-500" />
              
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-600 text-white">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Coverage Options</span>
              </div>
              
              <div className="h-0.5 w-16 mx-4 bg-gray-300" />
              
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 bg-white text-gray-400">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Quote Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Left Column - Quote Details */}
          <div className="space-y-8">
            {/* Coverage Options */}
            <div className="bg-[#fafcff] p-6 rounded-2xl">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="font-medium text-[18px] md:text-xl text-black mb-1">
                    Your Insurance Quote
                  </h2>
                  <p className="font-normal text-[12px] md:text-sm text-[#afafaf]">
                    Total Premium Amount
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">
                    {formatCurrency(
                      coverageOptions.find(coverage => coverage.id === selectedCoverage)?.premium || 0
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    per shipment
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coverageOptions.map((coverage) => (
                  <div
                    key={coverage.id}
                    className={`
                      h-auto md:h-[148px] flex flex-col justify-between bg-[#eeeeff] p-4 rounded-2xl border border-solid 
                      ${coverage.color}
                      ${selectedCoverage === coverage.id ? 'ring-2 ring-blue-500' : ''}
                      cursor-pointer transition-all duration-200 hover:shadow-md
                    `}
                    onClick={() => setSelectedCoverage(coverage.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-[16px] text-black mb-1">
                          {coverage.name}
                        </h3>
                        <p className="font-normal text-[11px] text-[#afafaf]">
                          {coverage.description}
                        </p>
                      </div>
                      {selectedCoverage === coverage.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xl md:text-2xl font-bold text-gray-900">
                        {formatCurrency(coverage.premium)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-600">Deductible:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(coverage.deductible)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Summary */}
            <div className="bg-[#fafcff] p-6 rounded-2xl">
              <h2 className="font-medium text-[18px] md:text-xl text-black mb-6">
                Quote Summary
              </h2>

              <div className="space-y-8">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <span className="font-normal text-[16px] text-[#505050]">Cargo Type</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-lg">📦</span>
                      </div>
                      <span className="font-normal text-[24px] text-black">
                        {quoteData?.cargoType || 'Electronics'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="font-normal text-[16px] text-[#505050]">Shipment Value</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-lg">$</span>
                      </div>
                      <span className="font-normal text-[24px] text-black">
                        {formatCurrency(quoteData?.shipmentValue || 45000)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <span className="font-normal text-[16px] text-[#505050]">Policy Coverage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-lg">🛡️</span>
                      </div>
                      <span className="font-normal text-[24px] text-black">
                        {selectedCoverage === 'standard' ? 'Standard' : 'Premium'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="font-normal text-[16px] text-[#505050]">Transportation Mode</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 text-lg">
                          {quoteData?.transportationMode === 'Air' ? '✈️' : 
                           quoteData?.transportationMode === 'Sea' ? '🚢' : '🚚'}
                        </span>
                      </div>
                      <span className="font-normal text-[24px] text-black">
                        {quoteData?.transportationMode || 'Air'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <span className="font-normal text-[16px] text-[#505050]">Coverage Period</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 text-lg">📅</span>
                      </div>
                      <span className="font-normal text-[20px] md:text-[24px] text-black">
                        {formatDateRange()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="font-normal text-[16px] text-[#505050]">Deductible</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 text-lg">💰</span>
                      </div>
                      <span className="font-normal text-[24px] text-black">
                        {formatCurrency(
                          coverageOptions.find(coverage => coverage.id === selectedCoverage)?.deductible || 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <span className="font-normal text-[16px] text-[#505050]">Route</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 text-lg">📍</span>
                      </div>
                      <span className="font-normal text-[20px] md:text-[24px] text-black">
                        {quoteData?.origin.city || 'New York'} → {quoteData?.destination.city || 'Tokyo'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="font-normal text-[16px] text-[#505050]">Additional Fees</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Info className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-normal text-[20px] text-black">
                        $25 (Taxes/Fees)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Buttons */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Premium</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        coverageOptions.find(coverage => coverage.id === selectedCoverage)?.premium || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Deductible</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        coverageOptions.find(coverage => coverage.id === selectedCoverage)?.deductible || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium text-gray-900">$25</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(
                        (coverageOptions.find(coverage => coverage.id === selectedCoverage)?.premium || 0) + 25
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleApproveQuote}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                Approve Quote & Proceed
              </button>
              
              <button
                onClick={handleModifyInputs}
                className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-lg"
              >
                Modify Inputs
              </button>
            </div>

            {/* Help Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Our insurance specialists are available 24/7 to answer any questions about your coverage.
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