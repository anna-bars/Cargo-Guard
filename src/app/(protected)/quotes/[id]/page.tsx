"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import QuoteHeader from './components/QuoteHeader';
import StatsGrid from './components/StatsGrid';
import NavigationTabs from './components/NavigationTabs';
import TabContent from './components/TabContent';
import QuickActions from './components/QuickActions';
import CostSummary from './components/CostSummary';
import SupportCard from './components/SupportCard';
import DeleteConfirmation from './components/DeleteConfirmation';
import LoadingState from './components/LoadingState';
import NotFoundState from './components/NotFoundState';
import { QuoteData } from './types';
import { getStatusConfig } from './utils/statusConfig';
import { formatCurrency, formatDateTime } from './utils/formatters';
import toast from 'react-hot-toast';

export default function QuoteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'analytics'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const quoteId = params.id as string;

  useEffect(() => {
    loadQuoteData();
  }, [quoteId]);

 // loadQuoteData ֆունկցիայում
const loadQuoteData = async () => {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please login to view quote details");
      router.push('/login');
      return;
    }
    
    const { data: quoteRequest, error: quoteError } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('id', quoteId)
      .eq('user_id', user.id)
      .single();
    
    if (quoteError || !quoteRequest) {
      toast.error("Quote not found or access denied");
      router.push('/dashboard');
      return;
    }
    
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!quoteRequest.payment_status || !validPaymentStatuses.includes(quoteRequest.payment_status)) {
      quoteRequest.payment_status = 'pending';
    }
    
    setQuoteData(quoteRequest as QuoteData);
    
    // Documents are already included in quoteRequest.documents
    // No need to query separate documents table
    if (quoteRequest.documents && Array.isArray(quoteRequest.documents)) {
      setDocuments(quoteRequest.documents);
      console.log('Documents from quote request:', quoteRequest.documents);
    } else {
      console.log('No documents found in quote request');
      setDocuments([]);
    }
    
  } catch (error) {
    console.error('Error loading quote data:', error);
    toast.error("Failed to load quote details");
  } finally {
    setLoading(false);
  }
};

  const handleMakePayment = () => {
    if (!quoteData) return;
    toast.success('Redirecting to payment...');
    router.push(`/payment?quoteId=${quoteData.id}&amount=${quoteData.calculated_premium}`);
  };

  const handleViewPolicy = () => {
    if (!quoteData) return;
    toast.success('Opening policy document...');
  };

  const handleViewReceipt = () => {
    if (!quoteData) return;
    toast.success('Opening payment receipt...');
  };

  const handleDeleteQuote = async () => {
    if (!quoteData) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', quoteData.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Quote deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Failed to delete quote');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleEditQuote = () => {
    if (!quoteData) return;
    router.push(`/quotes/edit/${quoteData.id}`);
  };

  const handleResubmit = () => {
    if (!quoteData) return;
    toast.success('Redirecting to quote editor...');
    router.push(`/quotes/edit/${quoteData.id}`);
  };

  const refreshData = () => {
    setLoading(true);
    loadQuoteData();
    toast.success('Refreshing quote data...');
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!quoteData) {
    return <NotFoundState router={router} />;
  }

  const statusConfig = getStatusConfig(quoteData.status, quoteData.payment_status);

  return (
    <div className="min-h-screen bg-[#F3F3F6]">
      <DashboardHeader userEmail="client@example.com" />
      
      {showDeleteConfirm && (
        <DeleteConfirmation
          onCancel={() => setShowDeleteConfirm(false)}
          onDelete={handleDeleteQuote}
        />
      )}
      
      <div className="relative max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuoteHeader
          quoteData={quoteData}
          statusConfig={statusConfig}
          onBack={() => router.back()}
          onEdit={handleEditQuote}
          onDelete={() => setShowDeleteConfirm(true)}
          onRefresh={refreshData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StatsGrid quoteData={quoteData} statusConfig={statusConfig} />
            
            <NavigationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              documentsCount={documents.length}
              showAnalytics={quoteData.status === 'approved' && quoteData.payment_status === 'paid'}
            />
            
            <TabContent
              activeTab={activeTab}
              quoteData={quoteData}
              statusConfig={statusConfig}
              documents={documents}
              onMakePayment={handleMakePayment}
              onResubmit={handleResubmit}
              onViewDocuments={() => setActiveTab('documents')}
              formatCurrency={formatCurrency}
              formatDate={(dateString) => new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
              formatDateTime={formatDateTime}
            />
          </div>

          <div className="space-y-6">
            <QuickActions
              statusConfig={statusConfig}
              onMakePayment={handleMakePayment}
              onViewPolicy={handleViewPolicy}
              onViewReceipt={handleViewReceipt}
              onResubmit={handleResubmit}
              onCheckStatus={refreshData}
            />
            
            {quoteData.status === 'approved' && (
              <CostSummary
                calculatedPremium={quoteData.calculated_premium}
                paymentStatus={quoteData.payment_status}
              />
            )}
            
            <SupportCard />
          </div>
        </div>
      </div>
    </div>
  );
}