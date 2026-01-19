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
  Sparkles,
  Zap,
  Target,
  LineChart,
  Globe,
  Database,
  Cloud,
  Shield as ShieldIcon,
  FileBarChart,
  BadgeCheck,
  Rocket,
  Cpu,
  Network,
  GitBranch,
  Code,
  Terminal,
  Layers,
  Activity,
  PieChart
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
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'analytics'>('overview');
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
          color: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700',
          border: 'border border-blue-200',
          icon: <Sparkles className="w-5 h-5" />,
          label: 'In Review',
          description: 'AI analysis in progress',
          accent: 'border-l-4 border-blue-500'
        };
      case 'approved':
        return {
          color: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700',
          border: 'border border-emerald-200',
          icon: <BadgeCheck className="w-5 h-5" />,
          label: 'Active',
          description: 'Coverage is active',
          accent: 'border-l-4 border-emerald-500'
        };
      case 'rejected':
        return {
          color: 'bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700',
          border: 'border border-rose-200',
          icon: <AlertCircle className="w-5 h-5" />,
          label: 'Declined',
          description: 'Requires adjustment',
          accent: 'border-l-4 border-rose-500'
        };
      case 'pending':
        return {
          color: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700',
          border: 'border border-amber-200',
          icon: <Clock className="w-5 h-5" />,
          label: 'Processing',
          description: 'Initial assessment',
          accent: 'border-l-4 border-amber-500'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700',
          border: 'border border-gray-200',
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <DashboardHeader userEmail="client@example.com" />
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 text-center shadow-2xl">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Not Found</h2>
            <p className="text-gray-600 mb-6">The quote you're looking for doesn't exist in our database.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(quoteData.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <DashboardHeader userEmail="client@example.com" />
      
      {/* Background Elements */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div> */}
      
      <div className="relative max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <button 
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 group transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="group-hover:underline">Back to quotes</span>
              </button>
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl blur opacity-30"></div>
                      <div className="relative px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                        <span className="text-sm font-semibold">QUOTE #{quoteData.quote_id}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${statusConfig.color} ${statusConfig.border}`}>
                      {statusConfig.icon}
                      <span className="font-semibold text-sm">{statusConfig.label}</span>
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mt-2">
                    Shipment Protection
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Created on <span className="font-medium text-gray-900">{formatDateTime(quoteData.created_at)}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={refreshData}
                    className="p-2.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl hover:bg-white hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow"
                    title="Refresh"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl hover:bg-white hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow"
                    title="Print"
                  >
                    <Printer className="w-5 h-5 text-gray-700" />
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-5 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Premium</h3>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(quoteData.calculated_premium)}</p>
                  <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-5 hover:border-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-xl">
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Coverage</h3>
                  <p className="text-lg font-bold text-gray-900 truncate">{quoteData.selected_coverage}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs text-emerald-600">Active Protection</span>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-5 hover:border-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-xl">
                      <Package className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Cargo Value</h3>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(quoteData.shipment_value)}</p>
                  <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-5 hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl">
                      <Truck className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Transport</h3>
                  <p className="text-lg font-bold text-gray-900">{quoteData.transportation_mode}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Network className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-purple-600">Global Network</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-1 shadow-lg">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 border border-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Overview
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'documents'
                      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 border border-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documents ({documents.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === 'analytics'
                      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 border border-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <LineChart className="w-4 h-4" />
                    Analytics
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Shipment Details */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Shipment Details</h2>
                          <p className="text-sm text-gray-600">AI-powered risk assessment</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm text-emerald-600">Live Analysis</span>
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
                          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-300">
                            <p className="font-semibold text-gray-900">{quoteData.cargo_type}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Coverage Timeline
                            </div>
                          </label>
                          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-300">
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
                          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-300">
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <p className="font-semibold text-gray-900">{quoteData.origin?.city || 'N/A'}</p>
                                <p className="text-xs text-blue-600 mt-1">Origin</p>
                              </div>
                              <div className="flex-1 px-4">
                                <div className="relative h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 animate-shimmer"></div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="font-semibold text-gray-900">{quoteData.destination?.city || 'N/A'}</p>
                                <p className="text-xs text-blue-600 mt-1">Destination</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Client Profile
                            </div>
                          </label>
                          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-300">
                            <p className="font-semibold text-gray-900">{quoteData.shipper_name || 'Not provided'}</p>
                            {quoteData.reference_number && (
                              <p className="text-sm text-gray-600 mt-1">Ref: {quoteData.reference_number}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Details */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                        <ShieldIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Coverage Details</h2>
                        <p className="text-sm text-blue-600">Real-time protection metrics</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                            <PieChart className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Premium Analysis</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(quoteData.calculated_premium)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-600">Optimized Rate</span>
                        </div>
                      </div>
                      
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-lg">
                            <CreditCard className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Deductible</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(quoteData.deductible)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-amber-600" />
                          <span className="text-xs text-amber-600">Risk Buffer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Documents</h2>
                      <p className="text-sm text-gray-600">
                        Secure verified files
                      </p>
                    </div>
                    <button className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Upload New
                    </button>
                  </div>
                  
                  {documents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4 border border-gray-300">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                      <p className="text-gray-600 mb-6">Upload documents to complete your submission</p>
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Upload Documents
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc, index) => (
                        <div key={doc.id} className="group bg-gradient-to-r from-gray-50 to-white border border-gray-300 rounded-xl hover:border-blue-500 p-4 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2.5 rounded-lg ${
                                index % 3 === 0 ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/10' :
                                index % 3 === 1 ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10' :
                                'bg-gradient-to-br from-purple-500/10 to-purple-600/10'
                              }`}>
                                <FileText className="w-5 h-5 text-gray-700" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{doc.document_type}</h3>
                                <p className="text-sm text-gray-600 truncate max-w-[180px]">{doc.file_name}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-700">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Verified</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => window.open(doc.file_url, '_blank')}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300"
                                title="Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a
                                href={doc.file_url}
                                download
                                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all duration-300"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-300">
                        <h3 className="font-semibold text-gray-900 mb-3">Risk Score</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl font-bold text-blue-600">78</span>
                          <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Good</div>
                        </div>
                        <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Based on cargo type and route analysis</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-300">
                        <h3 className="font-semibold text-gray-900 mb-3">Cost Efficiency</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl font-bold text-emerald-600">92%</span>
                          <div className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Optimal</div>
                        </div>
                        <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Premium vs industry average</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-300">
                      <h3 className="font-semibold text-gray-900 mb-4">Timeline Analysis</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Quote Created</p>
                              <p className="text-xs text-gray-600">{formatDateTime(quoteData.created_at)}</p>
                            </div>
                          </div>
                          <BadgeCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
                              <Code className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">AI Analysis</p>
                              <p className="text-xs text-gray-600">Processing risk assessment</p>
                            </div>
                          </div>
                          <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center">
                              <Rocket className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Activation</p>
                              <p className="text-xs text-gray-600">Ready for deployment</p>
                            </div>
                          </div>
                          <div className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Pending</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
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
                
                <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all duration-300 flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  View Policy
                </button>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cost Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                  <span className="text-gray-700">Premium</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(quoteData.calculated_premium)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                  <span className="text-gray-700">Service Fee</span>
                  <span className="font-semibold text-gray-900">$99.00</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                  <span className="text-gray-700">Taxes</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(quoteData.calculated_premium * 0.08)}
                  </span>
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-700">
                      {formatCurrency(
                        quoteData.calculated_premium + 99 + (quoteData.calculated_premium * 0.08)
                      )}
                    </span>
                  </div>
                  <div className={`text-sm font-medium ${
                    quoteData.status === 'approved' ? 'text-emerald-600' : 'text-blue-600'
                  } flex items-center gap-2`}>
                    <div className={`w-2 h-2 rounded-full ${quoteData.status === 'approved' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`}></div>
                    {quoteData.status === 'approved' ? '✅ Ready for payment' : '⏳ Processing'}
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl">
                  <Terminal className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Support</h3>
                  <p className="text-sm text-gray-600">24/7 assistance</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Our team is here to help with any questions about your shipment protection.
              </p>
              
              <button className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}