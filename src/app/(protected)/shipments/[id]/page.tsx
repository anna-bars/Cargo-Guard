"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  Package, 
  Truck, 
  Download, 
  FileText,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Receipt
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PolicyPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState<any>(null);
  const policyId = params.id as string;

  useEffect(() => {
    loadPolicy();
  }, [policyId]);

  const loadPolicy = async () => {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();
      
      if (error) {
        throw error;
      }
      
      setPolicy(data);
      
    } catch (error) {
      console.error('Error loading policy:', error);
      toast.error('Failed to load policy');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return {
          color: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700',
          border: 'border border-amber-200',
          icon: <Clock className="w-5 h-5" />,
          label: 'Pending Payment',
          description: 'Payment required to activate',
        };
      case 'paid':
        return {
          color: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700',
          border: 'border border-blue-200',
          icon: <Clock className="w-5 h-5" />,
          label: 'Processing',
          description: 'Generating policy documents',
        };
      case 'active':
        return {
          color: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700',
          border: 'border border-emerald-200',
          icon: <CheckCircle className="w-5 h-5" />,
          label: 'Active',
          description: 'Coverage in effect',
        };
      case 'expired':
        return {
          color: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700',
          border: 'border border-gray-200',
          icon: <Clock className="w-5 h-5" />,
          label: 'Expired',
          description: 'Coverage ended',
        };
      case 'cancelled':
        return {
          color: 'bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700',
          border: 'border border-rose-200',
          icon: <AlertCircle className="w-5 h-5" />,
          label: 'Cancelled',
          description: 'Policy cancelled',
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700',
          border: 'border border-gray-200',
          icon: <Clock className="w-5 h-5" />,
          label: status,
          description: '',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F6]">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading policy...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-[#F3F3F6]">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Policy Not Found</h2>
            <p className="text-gray-600 mb-6">The policy you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(policy.status);

  return (
    <div className="min-h-screen bg-[#F3F3F6]">
      <DashboardHeader userEmail="client@example.com" />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-30"></div>
                  <div className="relative px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <span className="text-sm font-semibold">{policy.policy_number}</span>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${statusConfig.color} ${statusConfig.border}`}>
                  {statusConfig.icon}
                  <span className="font-semibold text-sm">{statusConfig.label}</span>
                </div>
                {policy.payment_status === 'paid' && policy.status === 'pending_payment' && (
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200">
                    <span className="font-semibold text-sm">Payment Completed</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Cargo Insurance Policy</h1>
              <p className="text-gray-600 mt-2">
                {statusConfig.description}
                {policy.activated_at && (
                  <> • Activated on {new Date(policy.activated_at).toLocaleDateString()}</>
                )}
              </p>
            </div>
            
            {policy.status === 'active' && (
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300">
                File a Claim
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            {policy.status === 'paid' && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Processing Policy</h2>
                    <p className="text-blue-600">Your insurance documents are being generated. This usually takes a few moments.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm text-blue-700">70%</span>
                </div>
              </div>
            )}

            {/* Policy Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Policy Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Cargo Details
                      </div>
                    </label>
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <p className="font-semibold text-gray-900">{policy.cargo_type}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Coverage: ${policy.coverage_amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Deductible: ${policy.deductible.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Coverage Period
                      </div>
                    </label>
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <p className="font-semibold text-gray-900">
                        {new Date(policy.coverage_start).toLocaleDateString()} → {new Date(policy.coverage_end).toLocaleDateString()}
                      </p>
                      {policy.expires_at && (
                        <p className="text-sm text-gray-600 mt-1">
                          Expires: {new Date(policy.expires_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Route
                      </div>
                    </label>
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{policy.origin?.city || 'Origin'}</p>
                          <p className="text-xs text-blue-600 mt-1">Origin</p>
                        </div>
                        <div className="flex-1 px-4">
                          <div className="relative h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{policy.destination?.city || 'Destination'}</p>
                          <p className="text-xs text-blue-600 mt-1">Destination</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Transportation
                      </div>
                    </label>
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <p className="font-semibold text-gray-900">{policy.transportation_mode}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-600">Global Network</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Documents</h2>
              
              {policy.status === 'active' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group bg-gradient-to-r from-gray-50 to-white border border-gray-300 rounded-xl hover:border-blue-500 p-4 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                          <FileText className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Insurance Certificate</h3>
                          <p className="text-sm text-gray-600">Official policy document</p>
                        </div>
                      </div>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-gray-50 to-white border border-gray-300 rounded-xl hover:border-blue-500 p-4 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-lg">
                          <FileText className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Terms & Conditions</h3>
                          <p className="text-sm text-gray-600">Policy terms</p>
                        </div>
                      </div>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-gray-50 to-white border border-gray-300 rounded-xl hover:border-blue-500 p-4 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                          <Receipt className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Payment Receipt</h3>
                          <p className="text-sm text-gray-600">Transaction confirmation</p>
                        </div>
                      </div>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4 border border-gray-300">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents Pending</h3>
                  <p className="text-gray-600">
                    {policy.status === 'pending_payment'
                      ? 'Complete payment to generate policy documents.'
                      : 'Policy documents are being generated. Please check back shortly.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Premium Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Premium Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Premium</span>
                  <span className="font-semibold text-gray-900">
                    ${policy.premium_amount?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Coverage</span>
                  <span className="font-semibold text-gray-900">
                    ${policy.coverage_amount?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Deductible</span>
                  <span className="font-semibold text-gray-900">
                    ${policy.deductible?.toLocaleString()}
                  </span>
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">Total Paid</span>
                    <span className="text-2xl font-bold text-blue-700">
                      ${(policy.premium_amount * 1.08 + 99).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className={`text-sm font-medium ${
                    policy.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                  } flex items-center gap-2`}>
                    <div className={`w-2 h-2 rounded-full ${
                      policy.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></div>
                    {policy.payment_status === 'paid' ? 'Payment Completed' : 'Payment Pending'}
                  </div>
                </div>
              </div>
              
              {policy.status === 'pending_payment' && policy.payment_status !== 'paid' && (
                <button
                  onClick={() => router.push(`/payment?quoteId=${policy.quote_request_id}&amount=${policy.premium_amount}`)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Pay Now
                </button>
              )}
            </div>
            
            {/* Next Steps */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Next Steps</h3>
              
              <div className="space-y-4">
                {policy.status === 'pending_payment' && (
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Complete Payment</p>
                      <p className="text-sm text-blue-600">Pay to activate your coverage</p>
                    </div>
                  </div>
                )}
                
                {policy.status === 'paid' && (
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Document Generation</p>
                      <p className="text-sm text-blue-600">Policy documents being created</p>
                    </div>
                  </div>
                )}
                
                {policy.status === 'active' && (
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Coverage Active</p>
                      <p className="text-sm text-emerald-600">Your cargo is now insured</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Download Documents</p>
                    <p className="text-sm text-gray-600">Save your policy for records</p>
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