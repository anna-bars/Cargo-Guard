'use client';

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

  const loadQuoteData = async () => {
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to view quote details");
        router.push('/login');
        return;
      }
      
      // Load quote data
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .eq('user_id', user.id)
        .single();
      
      if (quoteError || !quote) {
        toast.error("Quote not found or access denied");
        router.push('/dashboard');
        return;
      }
      
      // Load policy data if exists
      const { data: policy, error: policyError } = await supabase
        .from('policies')
        .select('id, policy_number, status, premium_amount, coverage_start, coverage_end')
        .eq('quote_id', quoteId)
        .maybeSingle();
      
      // Load payment data if exists
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('id, transaction_id, payment_status, amount, completed_at')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      // Combine all data
      const combinedData: QuoteData = {
        ...quote,
        policy_id: policy?.id || null,
        policy_number: policy?.policy_number || null,
        policy_status: policy?.status || null,
        payment_id: payment?.id || null,
        transaction_id: payment?.transaction_id || null,
        payment_status: payment?.payment_status || 'pending',
        premium_amount: policy?.premium_amount || quote.calculated_premium,
        coverage_start: policy?.coverage_start || quote.start_date,
        coverage_end: policy?.coverage_end || quote.end_date,
        payment_amount: payment?.amount,
        payment_completed_at: payment?.completed_at
      };
      
      setQuoteData(combinedData);
      
      // Load documents from quotes.documents field
      if (quote.documents && Array.isArray(quote.documents)) {
        setDocuments(quote.documents);
      } else {
        setDocuments([]);
      }
      
    } catch (error) {
      console.error('Error loading quote data:', error);
      toast.error("Failed to load quote details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!quoteData) return;
    
    toast.loading('Generating PDF...');
    
    // Simulate PDF generation
    setTimeout(() => {
      toast.dismiss();
      
      // Create a simple PDF download
      const pdfContent = `
        CARGO GUARD INSURANCE
        QUOTE SUMMARY
        
        Quote Number: ${quoteData.quote_number}
        Date: ${formatDateTime(quoteData.created_at)}
        Status: ${quoteData.status.toUpperCase()}
        
        SHIPMENT DETAILS:
        • Cargo Type: ${quoteData.cargo_type}
        • Shipment Value: ${formatCurrency(quoteData.shipment_value)}
        • Origin: ${quoteData.origin?.city || 'N/A'}
        • Destination: ${quoteData.destination?.city || 'N/A'}
        • Transportation: ${quoteData.transportation_mode}
        • Coverage Period: ${new Date(quoteData.start_date).toLocaleDateString()} - ${new Date(quoteData.end_date).toLocaleDateString()}
        
        INSURANCE DETAILS:
        • Premium: ${formatCurrency(quoteData.calculated_premium || 0)}
        • Service Fee: $99
        • Total: ${formatCurrency((quoteData.calculated_premium || 0) + 99)}
        
        This is a computer-generated quote. For official documents, please contact support.
      `;
      
      // Create and download PDF
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quote-${quoteData.quote_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    }, 1500);
  };

  const handleViewPolicy = () => {
    if (!quoteData) return;
    
    if (!quoteData.policy_id) {
      toast.error('Policy not yet created. Please complete payment first.');
      return;
    }
    
    toast.loading('Loading policy...');
    
    // Simulate loading and redirect to policy page
    setTimeout(() => {
      toast.dismiss();
      router.push(`/policies/${quoteData.policy_id}`);
    }, 1000);
  };

  const handleViewReceipt = () => {
    if (!quoteData) return;
    
    if (quoteData.payment_status !== 'completed' && quoteData.payment_status !== 'paid') {
      toast.error('No payment receipt available');
      return;
    }
    
    toast.loading('Loading receipt...');
    
    // Simulate receipt display
    setTimeout(() => {
      toast.dismiss();
      
      // Create receipt content
      const receiptContent = `
        CARGO GUARD INSURANCE
        PAYMENT RECEIPT
        
        Receipt Number: RCP-${quoteData.transaction_id || Date.now()}
        Date: ${quoteData.payment_completed_at ? formatDateTime(quoteData.payment_completed_at) : new Date().toLocaleDateString()}
        
        DETAILS:
        • Quote Number: ${quoteData.quote_number}
        • Policy Number: ${quoteData.policy_number || 'N/A'}
        • Amount Paid: ${formatCurrency(quoteData.payment_amount || (quoteData.calculated_premium || 0) + 99)}
        • Payment Method: Credit Card
        • Status: ${quoteData.payment_status.toUpperCase()}
        
        ITEMS:
        • Insurance Premium: ${formatCurrency(quoteData.calculated_premium || 0)}
        • Service Fee: $99
        • Taxes: ${formatCurrency(Math.round((quoteData.calculated_premium || 0) * 0.08))}
        • Total: ${formatCurrency((quoteData.calculated_premium || 0) + 99 + Math.round((quoteData.calculated_premium || 0) * 0.08))}
        
        Thank you for your business!
        This is a computer-generated receipt.
      `;
      
      // Display receipt in a new window
      const receiptWindow = window.open();
      if (receiptWindow) {
        receiptWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Receipt - ${quoteData.quote_number}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
              h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
              .receipt { border: 1px solid #ddd; padding: 20px; margin-top: 20px; }
              .item { margin: 10px 0; }
              .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1>Payment Receipt</h1>
            <div class="receipt">
              <pre>${receiptContent}</pre>
            </div>
            <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #1e40af; color: white; border: none; cursor: pointer;">
              Print Receipt
            </button>
          </body>
          </html>
        `);
        receiptWindow.document.close();
      }
      
      toast.success('Receipt opened in new window');
    }, 1000);
  };

  const handleMakePayment = () => {
    if (!quoteData) return;
    
    if (quoteData.status !== 'approved') {
      toast.error('Quote must be approved before payment');
      return;
    }
    
    if (quoteData.payment_status === 'paid' || quoteData.payment_status === 'completed') {
      toast.error('Payment already completed');
      return;
    }
    
    router.push(`/quotes/${quoteData.id}/payment`);
  };

  const handleDeleteQuote = async () => {
    if (!quoteData) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('quotes')
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
    
    if (quoteData.payment_status === 'paid' || quoteData.payment_status === 'completed') {
      toast.error('Cannot edit paid quotes');
      return;
    }
    
    router.push(`/quotes/edit/${quoteData.id}`);
  };

  const handleResubmit = () => {
    if (!quoteData) return;
    
    if (quoteData.payment_status === 'paid' || quoteData.payment_status === 'completed') {
      toast.error('Cannot resubmit paid quotes');
      return;
    }
    
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
            
            {/* Remove Analytics tab - show only Overview and Documents */}
            <NavigationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              documentsCount={documents.length}
              showAnalytics={false} // Disable analytics tab
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
              onDownloadPDF={handleDownloadPDF}
              onMakePayment={handleMakePayment}
              onViewPolicy={handleViewPolicy}
              onViewReceipt={handleViewReceipt}
              onResubmit={handleResubmit}
              onCheckStatus={refreshData}
              quoteData={quoteData} // Pass quoteData to QuickActions for conditional rendering
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