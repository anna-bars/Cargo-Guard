'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle, 
  ChevronRight, 
  Shield,
  Download,
  HelpCircle,
  AlertCircle,
  Zap,
  Clock,
  MapPin,
  Package,
  DollarSign,
  Calendar,
  Truck,
  BadgeCheck,
  Users,
  Phone
} from 'lucide-react';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import { useUser } from '@/app/context/UserContext';
import { quotes } from '@/lib/supabase/quotes';
import { PremiumCalculator } from '@/lib/services/premiumCalculator';

interface QuoteData {
  id: string;
  quote_number: string;
  cargo_type: string;
  shipment_value: number;
  origin: any;
  destination: any;
  start_date: string;
  end_date: string;
  transportation_mode: string;
  status: string;
  payment_status: string;
}

interface CoverageOption {
  id: 'standard' | 'premium' | 'enterprise';
  name: string;
  description: string;
  premium: number;
  coverage: string[];
  deductible: number;
  features: string[];
  color: string;
  badge: string;
}

export default function InsuranceQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  
  const quoteId = searchParams.get('quote_id');
  
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [selectedCoverage, setSelectedCoverage] = useState<'standard' | 'premium' | 'enterprise'>('premium');
  const [loading, setLoading] = useState(true);
  const [coverageOptions, setCoverageOptions] = useState<CoverageOption[]>([]);

  useEffect(() => {
    const loadQuoteData = async () => {
      if (!quoteId || !user) return;

      try {
        setLoading(true);
        
        // Load quote from database
        const quote = await quotes.getById(quoteId);
        setQuoteData(quote);

        // Calculate premiums for all coverage options
        const premiumInput = {
          cargoType: quote.cargo_type,
          shipmentValue: quote.shipment_value,
          transportationMode: quote.transportation_mode,
          coverageType: 'standard',
          startDate: quote.start_date,
          endDate: quote.end_date
        };

        const options: CoverageOption[] = [
          {
            id: 'standard',
            name: 'Standard Coverage',
            description: 'Essential protection for common risks during transit.',
            premium: PremiumCalculator.calculate({...premiumInput, coverageType: 'standard'}).basePremium,
            coverage: ['All Risks', 'Theft Protection', 'Accidental Damage', 'Basic Liability'],
            deductible: 1000,
            features: ['Standard claims processing', 'Email support', 'Basic tracking'],
            color: 'from-gray-100 to-gray-50',
            badge: 'Popular'
          },
          {
            id: 'premium',
            name: 'Premium Coverage',
            description: 'Comprehensive protection including special risks and priority service.',
            premium: PremiumCalculator.calculate({...premiumInput, coverageType: 'premium'}).basePremium,
            coverage: ['All Risks +', 'War & Political Risks', 'Strike Coverage', 'Cyber Protection', 'Delay Compensation'],
            deductible: 500,
            features: [
              '24/7 Priority Support',
              'Dedicated Risk Manager',
              'Expedited Claims (<24h)',
              'Real-time Tracking',
              'Monthly Risk Reports'
            ],
            color: 'from-blue-50 to-indigo-50',
            badge: 'Recommended'
          },
          {
            id: 'enterprise',
            name: 'Enterprise Plan',
            description: 'Maximum protection with white-glove service for high-value shipments.',
            premium: PremiumCalculator.calculate({...premiumInput, coverageType: 'enterprise'}).basePremium,
            coverage: ['All Inclusive', 'War & Terrorism', 'Customs Delay', 'Inventory Protection', 'Revenue Loss'],
            deductible: 250,
            features: [
              '24/7 Dedicated Team',
              'Same-day Claims',
              'Custom Coverage',
              'API Integration',
              'Quarterly Reviews'
            ],
            color: 'from-purple-50 to-pink-50',
            badge: 'Enterprise'
          }
        ];

        setCoverageOptions(options);

      } catch (error) {
        console.error('Error loading quote data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuoteData();
  }, [quoteId, user]);

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

  const getTransportationModeDisplay = (mode: string) => {
    const modeMap: Record<string, string> = {
      'air': 'Air Freight',
      'sea': 'Sea Freight',
      'road': 'Road Freight'
    };
    return modeMap[mode] || mode;
  };

  const handleDownloadDocuments = async () => {
    if (!quoteData || !selectedCoverage) return;
    
    try {
      // Update quote with selected coverage
      await quotes.continueDraft(quoteData.id, {
        selected_coverage: selectedCoverage,
        calculated_premium: coverageOptions.find(coverage => coverage.id === selectedCoverage)?.premium || 0,
        deductible: coverageOptions.find(coverage => coverage.id === selectedCoverage)?.deductible || 0
      });

      // Navigate to documents page
      router.push(`/quotes/${quoteData.id}/documents`);

    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Failed to update quote. Please try again.');
    }
  };

  const handleModifyInputs = () => {
    router.push(`/quotes/${quoteData?.id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail={user?.email} />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your quote...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail={user?.email} />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quote Data Found</h2>
            <p className="text-gray-600 mb-6">Please go back and fill out the shipment details form.</p>
            <button
              onClick={() => router.push('/quotes/new/shipping')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Shipment Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedCoverageData = coverageOptions.find(coverage => coverage.id === selectedCoverage);
  const basePremium = selectedCoverageData?.premium || 0;
  const deductible = selectedCoverageData?.deductible || 0;
  const serviceFee = 99;
  const taxes = Math.round(basePremium * 0.08);
  const totalAmount = basePremium + serviceFee + taxes;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail={user?.email} />
      
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                >
                  Dashboard
                </button>
                <ChevronRight className="w-3 h-3" />
                <button 
                  onClick={() => router.push('/quotes')}
                  className="hover:text-gray-700 transition-colors"
                >
                  Quotes
                </button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 font-medium">New Quote</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Insurance Quote</h1>
              <p className="text-gray-600 mt-2">Review and customize your coverage options</p>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Quote ID</p>
                <p className="font-mono font-medium">
                  {quoteData.quote_number}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between max-w-[75%]">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Shipment Details</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
                
                <div className="h-0.5 w-20 mx-4 bg-blue-600" />
                
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
                    2
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Coverage Options</p>
                    <p className="text-xs text-gray-500">Current Step</p>
                  </div>
                </div>
                
                <div className="h-0.5 w-20 mx-4 bg-gray-300" />
                
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 bg-white text-gray-400">
                    3
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Document Download</p>
                    <p className="text-xs text-gray-500">Up next</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 w-[102%]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Shipment Summary</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active Quote
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Cargo Type</span>
                  </div>
                  <p className="font-medium">{quoteData.cargo_type}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Shipment Value</span>
                  </div>
                  <p className="font-medium">{formatCurrency(quoteData.shipment_value)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Route</span>
                  </div>
                  <p className="font-medium">
                    {quoteData.origin?.city || quoteData.origin?.name || 'Unknown'} → 
                    {quoteData.destination?.city || quoteData.destination?.name || 'Unknown'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm">Transport Mode</span>
                  </div>
                  <p className="font-medium">{getTransportationModeDisplay(quoteData.transportation_mode)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Coverage Plan</h2>
                  <p className="text-gray-600 text-sm">Choose the protection level that fits your needs</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Estimated Premium</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(basePremium)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coverageOptions.map((coverage) => (
                  <div
                    key={coverage.id}
                    className={`
                      relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${selectedCoverage === coverage.id 
                        ? 'border-blue-500 bg-gradient-to-br ' + coverage.color + ' shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }
                    `}
                    onClick={() => setSelectedCoverage(coverage.id)}
                  >
                    {selectedCoverage === coverage.id && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                          Selected
                        </div>
                      </div>
                    )}
                    
                    {coverage.badge && (
                      <div className="absolute -top-2 left-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium
                          ${coverage.id === 'standard' ? 'bg-gray-100 text-gray-800' : ''}
                          ${coverage.id === 'premium' ? 'bg-blue-100 text-blue-800' : ''}
                          ${coverage.id === 'enterprise' ? 'bg-purple-100 text-purple-800' : ''}
                        `}>
                          {coverage.badge}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            coverage.id === 'standard' ? 'bg-gray-100' :
                            coverage.id === 'premium' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            {coverage.id === 'standard' ? <Shield className="w-5 h-5 text-gray-600" /> :
                             coverage.id === 'premium' ? <Zap className="w-5 h-5 text-blue-600" /> :
                             <BadgeCheck className="w-5 h-5 text-purple-600" />}
                          </div>
                          <h3 className="font-semibold text-gray-900">{coverage.name}</h3>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{coverage.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Premium</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(coverage.premium)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Deductible</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(coverage.deductible)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-xs font-medium text-gray-900 mb-2">Key Features:</p>
                      <ul className="space-y-1">
                        {coverage.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Base Premium</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(basePremium)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Deductible</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(deductible)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium text-gray-900">{formatCurrency(serviceFee)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(taxes)}
                  </span>
                </div>
                
                <div className="pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">Due upon approval</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleDownloadDocuments}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Documents
                </button>
                
                <button
                  onClick={handleModifyInputs}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Modify Shipment Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}