'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, CheckCircle, Users, Mail, Phone } from 'lucide-react';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import { useUser } from '@/app/context/UserContext';
import { quotes } from '@/lib/supabase/quotes';

export default function QuoteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  
  const quoteId = params.id as string;
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quoteId || !user) return;

    const loadQuote = async () => {
      try {
        const quoteData = await quotes.getById(quoteId);
        setQuote(quoteData);
      } catch (error) {
        console.error('Error loading quote:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [quoteId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail={user?.email} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail={user?.email} />
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900">Quote not found</h2>
          <button
            onClick={() => router.push('/quotes')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Quotes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail={user?.email} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Under Review
            </h1>
            <p className="text-gray-600">
              Quote #{quote.quote_number} is being reviewed by our team
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Quote Submitted</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
                
                <div className="h-0.5 w-16 mx-4 bg-gray-300" />
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Manual Review</p>
                    <p className="text-xs text-gray-500">Current Step</p>
                  </div>
                </div>
                
                <div className="h-0.5 w-16 mx-4 bg-gray-300" />
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white text-gray-400 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Decision</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Our team is reviewing your quote. You'll receive an email notification once a decision is made.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Review Timeline
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">Quote Submitted</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(quote.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Your quote has been received and is in the queue for review.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Underwriter Review</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Our underwriting team is assessing your shipment details against our risk criteria.
                    </p>
                    <div className="mt-2 text-xs text-blue-600">
                      Estimated completion: Within 24 hours
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-500">Decision Notification</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      You'll receive an email with the final decision and next steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quote Details
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Cargo Type</p>
                    <p className="font-medium">{quote.cargo_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Shipment Value</p>
                    <p className="font-medium">${quote.shipment_value?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="font-medium">
                      {quote.origin?.city || quote.origin?.name} → {quote.destination?.city || quote.destination?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transport Mode</p>
                    <p className="font-medium">{quote.transportation_mode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Support</p>
                    <p className="text-xs text-gray-600">support@yourcompany.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Support</p>
                    <p className="text-xs text-gray-600">1-800-INS-CARGO</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                Our team is available 24/7 to assist with any questions about your quote review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}