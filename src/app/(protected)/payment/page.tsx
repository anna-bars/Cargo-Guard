"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import { CreditCard, Shield, Calendar, MapPin, Package, Truck, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [policyData, setPolicyData] = useState<any>(null);
  const quoteId = searchParams.get('quoteId');
  const amount = parseFloat(searchParams.get('amount') || '0');

  useEffect(() => {
    loadData();
  }, [quoteId]);

  const loadData = async () => {
    if (!quoteId) {
      toast.error('No quote specified');
      router.push('/dashboard');
      return;
    }

    const supabase = createClient();
    
    try {
      // 1. Ստանալ quote-ը
      const { data: quote, error: quoteError } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', quoteId)
        .single();
      
      if (quoteError || !quote) {
        throw new Error('Quote not found');
      }
      
      setQuoteData(quote);
      
      // 2. Ստուգել/ստեղծել policy
      const { data: policy, error: policyError } = await supabase
        .from('policies')
        .select('*')
        .eq('quote_request_id', quoteId)
        .maybeSingle();
      
      if (policyError) {
        console.error('Policy error:', policyError);
      }
      
      if (policy) {
        setPolicyData(policy);
      } else if (quote.status === 'approved') {
        // Create policy if not exists
        const response = await fetch('/api/policies/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quoteId }),
        });
        
        const { policy: newPolicy } = await response.json();
        setPolicyData(newPolicy);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!quoteId || !policyData) return;
    
    setProcessing(true);
    
    try {
      // 1. Simulate payment processing
      toast.loading('Processing payment...');
      
      // 2. Update payment status
      const supabase = createClient();
      const { error: paymentError } = await supabase
        .from('policies')
        .update({
          payment_status: 'paid',
          status: 'processing',
          paid_at: new Date().toISOString(),
        })
        .eq('id', policyData.id);
      
      if (paymentError) throw paymentError;
      
      // 3. Update quote payment status
      const { error: quoteError } = await supabase
        .from('quote_requests')
        .update({
          payment_status: 'paid',
        })
        .eq('id', quoteId);
      
      if (quoteError) throw quoteError;
      
      // 4. Generate policy documents (simulated)
      setTimeout(async () => {
        const { error: policyUpdateError } = await supabase
          .from('policies')
          .update({
            status: 'active',
            activated_at: new Date().toISOString(),
            expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          })
          .eq('id', policyData.id);
        
        if (policyUpdateError) throw policyUpdateError;
        
        toast.dismiss();
        toast.success('Payment successful! Policy is now active.');
        
        // Redirect to policy page
        router.push(`/policies/${policyData.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F6]">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading payment details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F6]">
      <DashboardHeader userEmail="client@example.com" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-2">
            Review your policy details and complete payment to activate coverage
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Policy Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Policy Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Policy Summary</h2>
                  <p className="text-sm text-blue-600">Coverage pending activation</p>
                </div>
                {policyData && (
                  <div className="ml-auto px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200">
                    <span className="font-semibold text-sm">{policyData.policy_number}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Cargo Type</span>
                    </div>
                    <p className="font-semibold text-gray-900">{quoteData?.cargo_type}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Coverage Period</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {quoteData && new Date(quoteData.start_date).toLocaleDateString()} - {quoteData && new Date(quoteData.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Route</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {quoteData?.origin?.city} → {quoteData?.destination?.city}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Transport</span>
                    </div>
                    <p className="font-semibold text-gray-900">{quoteData?.transportation_mode}</p>
                  </div>
                </div>
              </div>
              
              {/* Important Notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-amber-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Important Notice</h3>
                    <p className="text-sm text-amber-700">
                      Your insurance coverage will start only after payment is completed. 
                      The policy document will be generated immediately after successful payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Methods Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-blue-500 rounded-xl bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Pay securely with your card</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-emerald-600">Secure</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-gray-500/10 to-gray-600/10 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Bank Transfer</p>
                      <p className="text-sm text-gray-600">Transfer funds directly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Payment Summary */}
          <div className="space-y-6">
            {/* Payment Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Premium</span>
                  <span className="font-semibold text-gray-900">
                    ${amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Service Fee</span>
                  <span className="font-semibold text-gray-900">$99.00</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Taxes (8%)</span>
                  <span className="font-semibold text-gray-900">
                    ${(amount * 0.08).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-700">
                      ${((amount + 99) * 1.08).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full py-3.5 font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                  processing
                    ? 'bg-gradient-to-r from-blue-400 to-blue-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                } text-white flex items-center justify-center gap-2`}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Confirm & Pay
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By completing this payment, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
            
            {/* Security Assurance */}
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>256-bit SSL encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>PCI DSS compliant</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>No card details stored</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}