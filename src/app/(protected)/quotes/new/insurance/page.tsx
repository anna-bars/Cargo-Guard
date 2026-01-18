"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle, 
  ChevronRight, 
  CreditCard,
  HelpCircle,
  Shield,
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
  badge: string;
  icon: React.ReactNode;
}

export default function InsuranceQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [selectedCoverage, setSelectedCoverage] = useState<string>('premium');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'coverage' | 'documents'>('overview');

  useEffect(() => {
    const mockData: QuoteData = {
      cargoType: 'Electronics & Consumer Goods',
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
      transportationMode: 'Air Freight'
    };

    setQuoteData(mockData);
    setLoading(false);
  }, []);

  const coverageOptions: CoverageOption[] = [
    {
      id: 'standard',
      name: 'Standard Coverage',
      description: 'Essential protection for common risks during transit.',
      premium: calculatePremium('standard'),
      coverage: ['All Risks', 'Theft Protection', 'Accidental Damage', 'Basic Liability'],
      deductible: 1000,
      features: ['Standard claims processing', 'Email support', 'Basic tracking'],
      color: 'from-gray-100 to-gray-50',
      badge: 'Popular',
      icon: <Shield className="w-5 h-5 text-gray-600" />
    },
    {
      id: 'premium',
      name: 'Premium Coverage',
      description: 'Comprehensive protection including special risks and priority service.',
      premium: calculatePremium('premium'),
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
      badge: 'Recommended',
      icon: <Zap className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'Maximum protection with white-glove service for high-value shipments.',
      premium: calculatePremium('enterprise'),
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
      badge: 'Enterprise',
      icon: <BadgeCheck className="w-5 h-5 text-purple-600" />
    }
  ];

  function calculatePremium(type: string): number {
    if (!quoteData) return 0;
    
    const baseRate = quoteData.shipmentValue * 0.015;
    const modeMultiplier = quoteData.transportationMode.includes('Air') ? 1.2 : 1.0;
    
    const typeMultipliers = {
      'standard': 1.0,
      'premium': 1.5,
      'enterprise': 2.0
    };
    
    const typeMultiplier = typeMultipliers[type as keyof typeof typeMultipliers] || 1.0;
    const durationDays = Math.ceil(
      (new Date(quoteData.endDate).getTime() - new Date(quoteData.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const durationMultiplier = Math.max(1, durationDays / 30);
    
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

  const handleApproveQuote = () => {
    router.push('/quotes/review?coverage=' + selectedCoverage);
  };

  const handleModifyInputs = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail="client@example.com" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail="client@example.com" />
      
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Breadcrumb */}
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
                <p className="font-mono font-medium">#INS-2024-7890</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl">
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
                    <p className="text-sm font-medium text-gray-500">Review & Payment</p>
                    <p className="text-xs text-gray-500">Up next</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quote Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Summary Card */}
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
                  <p className="font-medium">{quoteData?.cargoType}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Shipment Value</span>
                  </div>
                  <p className="font-medium">{formatCurrency(quoteData?.shipmentValue || 0)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Route</span>
                  </div>
                  <p className="font-medium">{quoteData?.origin.city} → {quoteData?.destination.city}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm">Transport Mode</span>
                  </div>
                  <p className="font-medium">{quoteData?.transportationMode}</p>
                </div>
              </div>
            </div>

            {/* Coverage Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Coverage Plan</h2>
                  <p className="text-gray-600 text-sm">Choose the protection level that fits your needs</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Estimated Premium</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                      coverageOptions.find(coverage => coverage.id === selectedCoverage)?.premium || 0
                    )}
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
                            {coverage.icon}
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

            {/* Coverage Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">What's Covered:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {coverageOptions
                      .find(coverage => coverage.id === selectedCoverage)
                      ?.coverage.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Claims Process:</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedCoverage === 'standard' ? '3-5 business days' : 
                         selectedCoverage === 'premium' ? '<24 hours' : 'Same day'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedCoverage === 'standard' ? 'Email Support' : 
                         selectedCoverage === 'premium' ? '24/7 Priority Support' : 'Dedicated Team'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Base Premium</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(
                      coverageOptions.find(coverage => coverage.id === selectedCoverage)?.premium || 0
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Deductible</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(
                      coverageOptions.find(coverage => coverage.id === selectedCoverage)?.deductible || 0
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium text-gray-900">$99</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(
                      (coverageOptions.find(coverage => coverage.id === selectedCoverage)?.premium || 0) * 0.08
                    )}
                  </span>
                </div>
                
                <div className="pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(
                        (coverageOptions.find(coverage => coverage.id === selectedCoverage)?.premium || 0) + 
                        99 + 
                        ((coverageOptions.find(coverage => coverage.id === selectedCoverage)?.premium || 0) * 0.08)
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">Due upon approval</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleApproveQuote}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Continue to Payment
                </button>
                
                <button
                  onClick={handleModifyInputs}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Modify Shipment Details
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                </p>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Need Assistance?</h4>
                  <p className="text-sm text-gray-600">Our team is here to help</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Phone className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Call Us</p>
                    <p className="text-xs text-gray-600">1-800-INS-CARGO</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <AlertCircle className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Live Chat</p>
                    <p className="text-xs text-gray-600">Available 24/7</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 px-4 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                Schedule a Call
              </button>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Next Steps</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Review & Payment</p>
                    <p className="text-xs text-gray-500">Complete payment to activate coverage</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Policy Issuance</p>
                    <p className="text-xs text-gray-500">Receive documents within 1 hour</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Coverage Active</p>
                    <p className="text-xs text-gray-500">From shipment start date</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}