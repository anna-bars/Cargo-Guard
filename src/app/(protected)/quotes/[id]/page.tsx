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
  RefreshCw,
  CornerUpRight,
  Layers,
  PieChart,
  Activity,
  Globe
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
          color: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700',
          icon: <Clock className="w-5 h-5" />,
          label: 'Submitted',
          description: 'Your quote is under review',
          accent: 'border-l-4 border-blue-500'
        };
      case 'approved':
        return {
          color: 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700',
          icon: <CheckCircle className="w-5 h-5" />,
          label: 'Approved',
          description: 'Quote has been approved',
          accent: 'border-l-4 border-emerald-500'
        };
      case 'rejected':
        return {
          color: 'bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700',
          icon: <AlertCircle className="w-5 h-5" />,
          label: 'Rejected',
          description: 'Quote was rejected',
          accent: 'border-l-4 border-rose-500'
        };
      case 'pending':
        return {
          color: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700',
          icon: <Clock className="w-5 h-5" />,
          label: 'Pending',
          description: 'Awaiting review',
          accent: 'border-l-4 border-amber-500'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700',
          icon: <Clock className="w-5 h-5" />,
          label: status,
          description: '',
          accent: 'border-l-4 border-gray-500'
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading quote details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/50 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Not Found</h2>
            <p className="text-gray-600 mb-6">The quote you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <DashboardHeader userEmail="client@example.com" />
      
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <button 
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 group transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="group-hover:underline">Back</span>
              </button>
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quote #{quoteData.quote_id}</h1>
                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-white shadow-lg ${statusConfig.color}`}>
                      {statusConfig.icon}
                      <span className="font-semibold text-sm">{statusConfig.label}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Created on <span className="font-medium">{formatDateTime(quoteData.created_at)}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={refreshData}
                    className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow"
                    title="Refresh"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow"
                    title="Print"
                  >
                    <Printer className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Premium Amount</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(quoteData.calculated_premium)}</p>
                <div className="mt-2 h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full group-hover:w-16 transition-all duration-300"></div>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-emerald-50 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Coverage Type</h3>
                <p className="text-lg font-bold text-gray-900 truncate">{quoteData.selected_coverage}</p>
                <div className="mt-2 h-1 w-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full group-hover:w-16 transition-all duration-300"></div>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-amber-50 rounded-xl">
                    <Package className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Cargo Value</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(quoteData.shipment_value)}</p>
                <div className="mt-2 h-1 w-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full group-hover:w-16 transition-all duration-300"></div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-lg">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Overview
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'documents'
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documents ({documents.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'timeline'
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4" />
                    Timeline
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Shipment Details */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Shipment Details</h2>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Cargo Type
                            </div>
                          </label>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="font-semibold text-gray-900">{quoteData.cargo_type}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Coverage Period
                            </div>
                          </label>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="font-semibold text-gray-900">
                              {formatDate(quoteData.start_date)} → {formatDate(quoteData.end_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Route
                            </div>
                          </label>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <p className="font-semibold text-gray-900">{quoteData.origin?.city || 'N/A'}</p>
                                <p className="text-xs text-gray-500 mt-1">Origin</p>
                              </div>
                              <div className="flex-1 px-4">
                                <div className="h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"></div>
                              </div>
                              <div className="text-center">
                                <p className="font-semibold text-gray-900">{quoteData.destination?.city || 'N/A'}</p>
                                <p className="text-xs text-gray-500 mt-1">Destination</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Shipper Information
                            </div>
                          </label>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="font-semibold text-gray-900">{quoteData.shipper_name || 'Not provided'}</p>
                            {quoteData.reference_number && (
                              <p className="text-sm text-gray-600 mt-1">Reference: {quoteData.reference_number}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Details */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Coverage Details</h2>
                        <p className="text-sm text-blue-600">Insurance protection details</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/90 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 rounded-lg bg-blue-100">
                            <PieChart className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Premium Amount</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(quoteData.calculated_premium)}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Total insurance cost</p>
                      </div>
                      
                      <div className="bg-white/90 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 rounded-lg bg-amber-100">
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
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Submitted Documents</h2>
                      <p className="text-sm text-gray-600">
                        {documents.length} document{documents.length !== 1 ? 's' : ''} attached to this quote
                      </p>
                    </div>
                    <button className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                      Upload New
                    </button>
                  </div>
                  
                  {documents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents attached</h3>
                      <p className="text-gray-600 mb-6">Upload documents to complete your quote submission</p>
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Upload Documents
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents.map((doc, index) => (
                        <div key={doc.id} className="group bg-white border border-gray-200 rounded-xl hover:border-blue-300 p-4 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                index % 3 === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                                index % 3 === 1 ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' :
                                'bg-gradient-to-br from-purple-100 to-purple-200'
                              }`}>
                                <FileText className="w-6 h-6 text-gray-700" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{doc.document_type}</h3>
                                <p className="text-sm text-gray-600">{doc.file_name}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Verified</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.open(doc.file_url, '_blank')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                                title="Preview"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <a
                                href={doc.file_url}
                                download
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                                title="Download"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300">
                                <MoreVertical className="w-5 h-5" />
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
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Quote Timeline</h2>
                  
                  <div className="space-y-6">
                    {[
                      {
                        status: 'created',
                        title: 'Quote Created',
                        description: `Quote ${quoteData.quote_id} was created and submitted for review`,
                        time: formatDateTime(quoteData.created_at),
                        completed: true,
                        icon: <CheckCircle className="w-5 h-5" />
                      },
                      {
                        status: 'review',
                        title: 'Under Review',
                        description: 'Documents are being reviewed by our insurance team',
                        time: 'In progress',
                        completed: quoteData.status !== 'submitted',
                        icon: <FileSearch className="w-5 h-5" />
                      },
                      {
                        status: 'decision',
                        title: quoteData.status === 'approved' ? 'Approved' : 
                               quoteData.status === 'rejected' ? 'Rejected' : 'Decision',
                        description: quoteData.status === 'approved' ? 'Quote has been approved and is ready for payment' : 
                                   quoteData.status === 'rejected' ? 'Quote was rejected - contact support for details' : 
                                   'Awaiting final decision from review team',
                        time: quoteData.status === 'approved' || quoteData.status === 'rejected' ? 'Completed' : 'Pending',
                        completed: quoteData.status === 'approved' || quoteData.status === 'rejected',
                        icon: quoteData.status === 'approved' ? 
                          <CheckCircle className="w-5 h-5" /> : 
                          quoteData.status === 'rejected' ? 
                          <AlertCircle className="w-5 h-5" /> : 
                          <Bell className="w-5 h-5" />
                      }
                    ].map((step, index) => (
                      <div key={step.status} className="flex items-start gap-4">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed 
                              ? step.status === 'decision' && quoteData.status === 'rejected'
                                ? 'bg-gradient-to-br from-rose-500 to-rose-600'
                                : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                              : 'bg-gradient-to-br from-gray-300 to-gray-400'
                          } shadow-lg`}>
                            <div className={`${step.completed ? 'text-white' : 'text-gray-500'}`}>
                              {step.icon}
                            </div>
                          </div>
                          {index < 2 && (
                            <div className={`absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 ${
                              step.completed ? 'bg-gradient-to-b from-emerald-200 to-transparent' : 'bg-gray-200'
                            }`}></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`p-4 rounded-xl ${
                            step.completed 
                              ? step.status === 'decision' && quoteData.status === 'rejected'
                                ? 'bg-gradient-to-r from-rose-50 to-white border border-rose-200'
                                : 'bg-gradient-to-r from-emerald-50 to-white border border-emerald-200'
                              : 'bg-gradient-to-r from-gray-50 to-white border border-gray-200'
                          }`}>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className={`font-semibold ${
                                step.completed 
                                  ? step.status === 'decision' && quoteData.status === 'rejected'
                                    ? 'text-rose-900'
                                    : 'text-emerald-900'
                                  : 'text-gray-700'
                              }`}>
                                {step.title}
                              </h3>
                              <span className={`text-sm ${
                                step.completed 
                                  ? step.status === 'decision' && quoteData.status === 'rejected'
                                    ? 'text-rose-600'
                                    : 'text-emerald-600'
                                  : 'text-gray-500'
                              }`}>
                                {step.time}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              step.completed 
                                ? step.status === 'decision' && quoteData.status === 'rejected'
                                  ? 'text-rose-700'
                                  : 'text-emerald-700'
                                : 'text-gray-600'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Quote PDF
                </button>
                
                <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Make Payment
                </button>
                
                <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  View Policy
                </button>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cost Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Premium</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(quoteData.calculated_premium)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Service Fee</span>
                  <span className="font-semibold text-gray-900">$99.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Taxes</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(quoteData.calculated_premium * 0.08)}
                  </span>
                </div>
                
                <div className="border-t border-blue-300 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-700">
                      {formatCurrency(
                        quoteData.calculated_premium + 99 + (quoteData.calculated_premium * 0.08)
                      )}
                    </span>
                  </div>
                  <div className={`text-sm font-medium ${
                    quoteData.status === 'approved' ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {quoteData.status === 'approved' ? '✅ Ready for payment' : '⏳ Payable upon approval'}
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Need Help?</h3>
                  <p className="text-sm text-gray-300">24/7 support available</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mb-6">
                Our support team is here to help with any questions about your quote.
              </p>
              
              <button className="w-full py-3.5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}