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
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Printer,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  BarChart3,
  TrendingUp,
  Users,
  ShieldCheck,
  FileSearch,
  CreditCard,
  Bell,
  RefreshCw
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
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline'>('overview');
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
          color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          icon: <Clock className="w-4 h-4" />,
          label: 'Submitted',
          description: 'Your quote is under review'
        };
      case 'approved':
        return {
          color: 'bg-gradient-to-r from-emerald-500 to-green-500',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Approved',
          description: 'Quote has been approved'
        };
      case 'rejected':
        return {
          color: 'bg-gradient-to-r from-rose-500 to-pink-500',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Rejected',
          description: 'Quote was rejected'
        };
      case 'pending':
        return {
          color: 'bg-gradient-to-r from-amber-500 to-yellow-500',
          icon: <Clock className="w-4 h-4" />,
          label: 'Pending',
          description: 'Awaiting review'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-slate-500',
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

  const refreshData = () => {
    setLoading(true);
    loadQuoteData();
    toast.success('Refreshing quote data...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading quote details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Not Found</h2>
            <p className="text-gray-600 mb-6">The quote you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader userEmail="client@example.com" />
      
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 hover:text-gray-700 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
                    onClick={refreshData}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white/80 rounded-xl transition-all duration-300"
                    title="Refresh"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-white shadow-lg ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <span className="font-medium">{statusConfig.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote ID Card - Glassmorphism */}
        <div className="mb-8 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quote {quoteData.quote_id}</h2>
                <p className="text-gray-600">Insurance coverage for shipment</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/40 text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => copyToClipboard(quoteData.quote_id)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy ID
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-white/40 shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'documents'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Documents ({documents.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Premium</h3>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(quoteData.calculated_premium)}</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Coverage</h3>
                    <p className="text-lg font-bold text-gray-900">{quoteData.selected_coverage}</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <Package className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Cargo Value</h3>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(quoteData.shipment_value)}</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Truck className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Transport</h3>
                    <p className="text-lg font-bold text-gray-900">{quoteData.transportation_mode}</p>
                  </div>
                </div>

                {/* Shipment Details Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Shipment Details</h2>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Cargo Type
                          </div>
                        </label>
                        <div className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-xl border border-gray-200">
                          <p className="font-medium text-gray-900">{quoteData.cargo_type}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Coverage Period
                          </div>
                        </label>
                        <div className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-xl border border-gray-200">
                          <p className="font-medium text-gray-900">
                            {formatDate(quoteData.start_date)} - {formatDate(quoteData.end_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Route
                          </div>
                        </label>
                        <div className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{quoteData.origin?.city || 'N/A'}</p>
                              <p className="text-xs text-gray-500">Origin</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{quoteData.destination?.city || 'N/A'}</p>
                              <p className="text-xs text-gray-500">Destination</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Shipper
                          </div>
                        </label>
                        <div className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-xl border border-gray-200">
                          <p className="font-medium text-gray-900">{quoteData.shipper_name || 'Not provided'}</p>
                          {quoteData.reference_number && (
                            <p className="text-sm text-gray-600 mt-1">Ref: {quoteData.reference_number}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coverage Details Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Coverage Details</h2>
                      <p className="text-sm text-blue-600">Insurance protection details</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white/40">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Premium</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(quoteData.calculated_premium)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Total insurance cost</p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white/40">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-amber-100">
                          <CreditCard className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Deductible</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(quoteData.deductible)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Out-of-pocket expense</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'documents' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Submitted Documents</h2>
                    <p className="text-sm text-gray-600">
                      {documents.length} document{documents.length !== 1 ? 's' : ''} attached to this quote
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    Upload New
                  </button>
                </div>
                
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents attached</h3>
                    <p className="text-gray-600 mb-6">Upload documents to complete your quote submission</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      Upload Documents
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc, index) => (
                      <div key={doc.id} className="group bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 p-4 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              index % 3 === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                              index % 3 === 1 ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' :
                              'bg-gradient-to-br from-purple-100 to-purple-200'
                            }`}>
                              <FileText className="w-5 h-5 text-gray-700" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{doc.document_type}</h3>
                              <p className="text-sm text-gray-600">{doc.file_name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-blue-600 font-medium">Verified</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => window.open(doc.file_url, '_blank')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button>
                                <a
                                href={doc.file_url}
                                download
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Download"
                                >
                                <Download className="w-4 h-4" />
                                </a>
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Quote Timeline</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-200 to-transparent"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">Quote Created</h3>
                          <span className="text-xs text-gray-500">{formatDateTime(quoteData.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-600">Quote {quoteData.quote_id} was created and submitted for review</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        quoteData.status === 'submitted' || quoteData.status === 'approved' || quoteData.status === 'rejected'
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-500'
                          : 'bg-gradient-to-br from-gray-300 to-gray-400'
                      }`}>
                        <FileSearch className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-gray-200 to-transparent"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className={`p-4 rounded-xl border ${
                        quoteData.status === 'submitted' || quoteData.status === 'approved' || quoteData.status === 'rejected'
                          ? 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
                          : 'bg-gradient-to-r from-gray-50/50 to-white/50 border-gray-200/50'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`font-medium ${
                            quoteData.status === 'submitted' || quoteData.status === 'approved' || quoteData.status === 'rejected'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}>
                            Under Review
                          </h3>
                          <span className="text-xs text-gray-400">Pending</span>
                        </div>
                        <p className={`text-sm ${
                          quoteData.status === 'submitted' || quoteData.status === 'approved' || quoteData.status === 'rejected'
                            ? 'text-gray-600'
                            : 'text-gray-400'
                        }`}>
                          Documents are being reviewed by our insurance team
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        quoteData.status === 'approved'
                          ? 'bg-gradient-to-br from-emerald-500 to-green-500'
                          : quoteData.status === 'rejected'
                          ? 'bg-gradient-to-br from-rose-500 to-pink-500'
                          : 'bg-gradient-to-br from-gray-300 to-gray-400'
                      }`}>
                        {quoteData.status === 'approved' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : quoteData.status === 'rejected' ? (
                          <AlertCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Bell className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className={`p-4 rounded-xl border ${
                        quoteData.status === 'approved'
                          ? 'bg-gradient-to-r from-emerald-50 to-white border-emerald-200'
                          : quoteData.status === 'rejected'
                          ? 'bg-gradient-to-r from-rose-50 to-white border-rose-200'
                          : 'bg-gradient-to-r from-gray-50/50 to-white/50 border-gray-200/50'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`font-medium ${
                            quoteData.status === 'approved'
                              ? 'text-emerald-900'
                              : quoteData.status === 'rejected'
                              ? 'text-rose-900'
                              : 'text-gray-400'
                          }`}>
                            {quoteData.status === 'approved' ? 'Approved' : 
                             quoteData.status === 'rejected' ? 'Rejected' : 
                             'Decision Pending'}
                          </h3>
                          <span className={`text-xs ${
                            quoteData.status === 'approved'
                              ? 'text-emerald-600'
                              : quoteData.status === 'rejected'
                              ? 'text-rose-600'
                              : 'text-gray-400'
                          }`}>
                            {quoteData.status === 'approved' ? 'Completed' : 
                             quoteData.status === 'rejected' ? 'Completed' : 
                             'Awaiting'}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          quoteData.status === 'approved'
                            ? 'text-emerald-700'
                            : quoteData.status === 'rejected'
                            ? 'text-rose-700'
                            : 'text-gray-400'
                        }`}>
                          {quoteData.status === 'approved' ? 'Quote has been approved and is ready for payment' : 
                           quoteData.status === 'rejected' ? 'Quote was rejected - contact support for details' : 
                           'Awaiting final decision from review team'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Quote PDF
                </button>
                
                <button className="w-full py-3 px-4 border border-blue-200 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Make Payment
                </button>
                
                <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Policy
                </button>
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Cost</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Insurance Premium</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(quoteData.calculated_premium)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium text-gray-900">$99.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxes (8%)</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(quoteData.calculated_premium * 0.08)}
                  </span>
                </div>
                
                <div className="border-t border-blue-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        quoteData.calculated_premium + 99 + (quoteData.calculated_premium * 0.08)
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 text-right mt-1">
                    {quoteData.status === 'approved' ? '✅ Ready for payment' : '⏳ Payable upon approval'}
                  </p>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Need Help?</h3>
                  <p className="text-sm text-gray-300">24/7 support available</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mb-4">
                Our support team is here to help with any questions about your quote.
              </p>
              
              <button className="w-full py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}