"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Calendar,
  DollarSign,
  MapPin,
  Package,
  Truck,
  Shield,
  Building,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Copy,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';

interface QuoteData {
  id: string;
  quote_id: string;
  cargo_type: string;
  shipment_value: number;
  origin: any;
  destination: any;
  start_date: string;
  end_date: string;
  transportation_mode: string;
  selected_coverage: string;
  calculated_premium: number;
  deductible: number;
  status: string;
  shipper_name: string;
  reference_number: string;
  created_at: string;
  documents?: any[];
}

export default function QuoteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const quoteId = params.id as string;

  useEffect(() => {
    loadQuoteData();
  }, [quoteId]);

  const loadQuoteData = async () => {
    const supabase = createClient();
    
    try {
      // Ստանում ենք ընթացիկ օգտատիրոջը
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to view quote details");
        router.push('/login');
        return;
      }
      
      // Ստանում ենք quote request-ը
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
      
      setQuoteData(quoteRequest);
      
      // Ստանում ենք փաստաթղթերը
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('quote_request_id', quoteId)
        .order('uploaded_at', { ascending: false });
      
      if (!docsError && docs) {
        setDocuments(docs);
      }
      
    } catch (error) {
      console.error('Error loading quote data:', error);
      toast.error("Failed to load quote details");
    } finally {
      setLoading(false);
    }
  };

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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Clock className="w-4 h-4" />,
          label: 'Submitted',
          description: 'Your quote is under review'
        };
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Approved',
          description: 'Quote has been approved'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Rejected',
          description: 'Quote was rejected'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="w-4 h-4" />,
          label: 'Pending',
          description: 'Awaiting review'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock className="w-4 h-4" />,
          label: status,
          description: ''
        };
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading quote details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Not Found</h2>
            <p className="text-gray-600 mb-6">The quote you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(quoteData.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail="client@example.com" />
      
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </button>
                <span>/</span>
                <button 
                  onClick={() => router.push('/quotes')}
                  className="hover:text-gray-700 transition-colors"
                >
                  Quotes
                </button>
                <span>/</span>
                <span className="text-gray-900 font-medium">Quote Details</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Quote Details</h1>
                  <p className="text-gray-600 mt-2">
                    Submitted on {formatDateTime(quoteData.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <span className="font-medium">{statusConfig.label}</span>
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
            {/* Quote ID Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Quote Information</h2>
                    <p className="text-sm text-gray-600">Reference details for your quote</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quote ID
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                      {quoteData.quote_id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(quoteData.quote_id)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </div>
                    {statusConfig.description && (
                      <p className="text-xs text-gray-500 mt-1">{statusConfig.description}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Submitted Date</p>
                    <p className="font-medium">{formatDateTime(quoteData.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipment Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <Truck className="w-4 h-4" />
                    <span className="text-sm">Transport Mode</span>
                  </div>
                  <p className="font-medium">{quoteData.transportation_mode}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Origin</span>
                  </div>
                  <p className="font-medium">
                    {quoteData.origin?.city || quoteData.origin?.name || 'N/A'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Destination</span>
                  </div>
                  <p className="font-medium">
                    {quoteData.destination?.city || quoteData.destination?.name || 'N/A'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Coverage Period</span>
                  </div>
                  <p className="font-medium">
                    {formatDate(quoteData.start_date)} - {formatDate(quoteData.end_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Coverage Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Coverage Details</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Coverage Type</span>
                  </div>
                  <p className="text-lg font-medium">{quoteData.selected_coverage}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Premium Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(quoteData.calculated_premium)}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Deductible</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatCurrency(quoteData.deductible)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Submitted Documents</h2>
                  <p className="text-sm text-gray-600">
                    {documents.length} document{documents.length !== 1 ? 's' : ''} attached
                  </p>
                </div>
              </div>
              
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No documents attached</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.document_type}</h3>
                          <p className="text-sm text-gray-600">
                            {doc.file_name} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(doc.file_url, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={doc.file_url}
                          download
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions & Summary */}
          <div className="space-y-6">
            {/* Shipper Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shipper Information</h3>
                  <p className="text-sm text-gray-600">Billing & contact details</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipper Name</p>
                  <p className="font-medium">{quoteData.shipper_name || 'Not provided'}</p>
                </div>
                
                {quoteData.reference_number && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Reference Number</p>
                    <p className="font-medium">{quoteData.reference_number}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Premium</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(quoteData.calculated_premium)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium text-gray-900">$99</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(quoteData.calculated_premium * 0.08)}
                  </span>
                </div>
                
                <div className="pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(
                        quoteData.calculated_premium + 99 + (quoteData.calculated_premium * 0.08)
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {quoteData.status === 'approved' ? 'Ready for payment' : 'Payable upon approval'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Quote
                </button>
                
                <button
                  onClick={() => copyToClipboard(quoteData.quote_id)}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Quote ID
                </button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${quoteData.status === 'submitted' || quoteData.status === 'approved' || quoteData.status === 'rejected' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${quoteData.status === 'submitted' || quoteData.status === 'approved' || quoteData.status === 'rejected' ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Submitted</p>
                    <p className="text-xs text-gray-500">{formatDateTime(quoteData.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${quoteData.status === 'approved' || quoteData.status === 'rejected' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${quoteData.status === 'approved' || quoteData.status === 'rejected' ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${quoteData.status === 'approved' || quoteData.status === 'rejected' ? 'text-gray-900' : 'text-gray-500'}`}>
                      Under Review
                    </p>
                    <p className="text-xs text-gray-500">Documents are being reviewed</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${quoteData.status === 'approved' ? 'bg-green-100' : quoteData.status === 'rejected' ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${quoteData.status === 'approved' ? 'bg-green-600' : quoteData.status === 'rejected' ? 'bg-red-600' : 'bg-gray-400'}`}></div>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${quoteData.status === 'approved' || quoteData.status === 'rejected' ? 'text-gray-900' : 'text-gray-500'}`}>
                      {quoteData.status === 'approved' ? 'Approved' : quoteData.status === 'rejected' ? 'Rejected' : 'Decision'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {quoteData.status === 'approved' ? 'Quote has been approved' : 
                       quoteData.status === 'rejected' ? 'Quote was rejected' : 
                       'Awaiting decision'}
                    </p>
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