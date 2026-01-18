"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle, 
  ChevronRight, 
  FileText, 
  Upload, 
  FileCheck,
  AlertCircle,
  Shield,
  Building,
  FileDigit,
  X,
  Download,
  Eye,
  Calendar,
  DollarSign,
  MapPin,
  Package,
  Truck
} from 'lucide-react';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';

interface QuoteData {
  id: string;
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
  coverageType: string;
  premium: number;
  deductible: number;
}

interface Document {
  id: string;
  name: string;
  type: 'commercial-invoice' | 'packing-list' | 'bill-of-lading' | 'other';
  file: File | null;
  previewUrl?: string;
  uploadedAt?: Date;
  status: 'pending' | 'uploaded' | 'processing' | 'verified';
}

export default function SubmitDocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [shipperName, setShipperName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Commercial Invoice', type: 'commercial-invoice', file: null, status: 'pending' },
    { id: '2', name: 'Packing List', type: 'packing-list', file: null, status: 'pending' },
    { id: '3', name: 'Bill of Lading', type: 'bill-of-lading', file: null, status: 'pending' },
  ]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate loading quote data from API or params
    const mockQuoteData: QuoteData = {
      id: 'Q-0025',
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
      transportationMode: 'Air Freight',
      coverageType: 'Premium Coverage',
      premium: 1215,
      deductible: 500
    };

    // Get coverage type from URL params if available
    const coverageType = searchParams.get('coverage') || 'premium';
    mockQuoteData.coverageType = coverageType.charAt(0).toUpperCase() + coverageType.slice(1) + ' Coverage';

    setQuoteData(mockQuoteData);
    setLoading(false);
  }, [searchParams]);

 const handleFileUpload = (documentId: string, file: File) => {
  const updatedDocuments = documents.map(doc => {
    if (doc.id === documentId) {
      const previewUrl = URL.createObjectURL(file);
      return {
        ...doc,
        file,
        previewUrl,
        uploadedAt: new Date(),
        status: 'uploaded' as const // Cast to the specific type
      };
    }
    return doc;
  });

  setDocuments(updatedDocuments);

  // Simulate upload progress
  simulateUploadProgress(documentId);
};

  const simulateUploadProgress = (documentId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [documentId]: progress }));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(prev => ({ ...prev, [documentId]: 0 }));
        }, 500);
      }
    }, 100);
  };

  const handleRemoveDocument = (documentId: string) => {
  const updatedDocuments = documents.map(doc => {
    if (doc.id === documentId) {
      if (doc.previewUrl) {
        URL.revokeObjectURL(doc.previewUrl);
      }
      return {
        ...doc,
        file: null,
        previewUrl: undefined,
        status: 'pending' as const // Cast to the specific type
      };
    }
    return doc;
  });

  setDocuments(updatedDocuments);
};
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (documentId: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      handleFileUpload(documentId, file);
    }
  };

  const handleFileInput = (documentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(documentId, file);
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

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'commercial-invoice':
        return <FileText className="w-5 h-5" />;
      case 'packing-list':
        return <FileCheck className="w-5 h-5" />;
      case 'bill-of-lading':
        return <FileDigit className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'uploaded':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'verified':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const allDocumentsUploaded = documents.every(doc => doc.status === 'uploaded' || doc.status === 'verified');

  const handleSubmit = async () => {
    if (!shipperName.trim()) {
      alert('Please enter shipper name');
      return;
    }

    if (!allDocumentsUploaded) {
      alert('Please upload all required documents');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Quote submitted successfully! Our team will review your documents and get back to you within 24 hours.');
      router.push('/quotes/pending');
    }, 2000);
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
                  onClick={() => router.push('/quotes')}
                  className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quotes
                </button>
                <ChevronRight className="w-3 h-3" />
                <button 
                  onClick={() => router.push('/quotes/new')}
                  className="hover:text-gray-700 transition-colors"
                >
                  New Quote
                </button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 font-medium">Submit Documents</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Submit Required Documents</h1>
              <p className="text-gray-600 mt-2">Upload shipping documents to complete your quote submission</p>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Quote ID</p>
                <p className="font-mono font-medium">{quoteData?.id}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-blue-600" />
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
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Coverage Options</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
                
                <div className="h-0.5 w-20 mx-4 bg-blue-600" />
                
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
                    3
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Submit Documents</p>
                    <p className="text-xs text-blue-500">Current Step</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_0.02fr_1fr] gap-8">
          {/* Left Column - Quote Summary */}
          <div className="lg:col-span-2 space-y-6 w-[102%]">
            {/* Quote Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Quote Summary</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Ready for Submission
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_0.02fr_0.7fr] gap-6 mb-6">
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
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Coverage Period</span>
                  </div>
                  <p className="font-medium">
                    {formatDate(quoteData?.startDate || '')} - {formatDate(quoteData?.endDate || '')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Coverage Type</span>
                  </div>
                  <p className="font-medium">{quoteData?.coverageType}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Premium Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(quoteData?.premium || 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Deductible</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(quoteData?.deductible || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipper Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Shipper Information</h2>
                  <p className="text-sm text-gray-600">Enter details for billing and documentation</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipper's Name / Company *
                  </label>
                  <input
                    type="text"
                    value={shipperName}
                    onChange={(e) => setShipperName(e.target.value)}
                    placeholder="Enter shipper or company name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This name will appear on your insurance policy
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO / Reference Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter purchase order or reference number"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Useful for tracking and internal reference
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Upload Required Documents</h2>
                    <p className="text-sm text-gray-600">All documents are required for quote approval</p>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  allDocumentsUploaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {allDocumentsUploaded ? 'All documents ready' : `${documents.filter(d => d.status === 'uploaded').length}/3 uploaded`}
                </div>
              </div>
              
              <div className="space-y-4">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className={`
                      p-4 rounded-xl border-2 transition-all
                      ${document.status === 'uploaded' ? 'border-green-200 bg-green-50' : 
                        document.status === 'processing' ? 'border-blue-200 bg-blue-50' :
                        'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(document.id, e)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`
                          w-12 h-12 rounded-lg flex items-center justify-center
                          ${document.status === 'uploaded' ? 'bg-green-100 text-green-600' : 
                            document.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {getDocumentIcon(document.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{document.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(document.status)}`}>
                              {document.status === 'uploaded' ? 'Uploaded' :
                               document.status === 'processing' ? 'Processing' :
                               'Required'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {document.status === 'uploaded' && document.file ? (
                              <>
                                {document.file.name} • {(document.file.size / 1024 / 1024).toFixed(2)} MB • 
                                Uploaded at {document.uploadedAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </>
                            ) : 'Upload PDF or image files (max 10MB)'}
                          </p>
                          
                          {/* Progress Bar */}
                          {uploadProgress[document.id] > 0 && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[document.id]}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {document.status === 'uploaded' && (
                          <>
                            <button
                              type="button"
                              onClick={() => window.open(document.previewUrl, '_blank')}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument(document.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {document.status !== 'uploaded' && (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileInput(document.id, e)}
                            />
                            <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                              Upload
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                    
                    {/* Drop Zone */}
                    {document.status !== 'uploaded' && (
                      <div className="mt-4">
                        <label className="block">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileInput(document.id, e)}
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PDF, JPG, or PNG (max 10MB)
                            </p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Document Requirements */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <h4 className="text-sm font-medium text-gray-900">Document Requirements</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                    <span>All documents must be clear and legible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                    <span>Maximum file size: 10MB per document</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                    <span>Accepted formats: PDF, JPG, PNG</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                    <span>Documents should show complete shipment details</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Information */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Quote ID</p>
                  <p className="font-mono font-medium text-gray-900">{quoteData?.id}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Premium</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(quoteData?.premium || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium text-gray-900">$99</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taxes</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency((quoteData?.premium || 0) * 0.08)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(
                          (quoteData?.premium || 0) + 99 + ((quoteData?.premium || 0) * 0.08)
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">
                      Payable after approval
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!allDocumentsUploaded || !shipperName.trim() || isSubmitting}
                  className={`
                    w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                    ${!allDocumentsUploaded || !shipperName.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                    }
                    flex items-center justify-center gap-2
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit for Approval'
                  )}
                </button>
                
                <button
                  onClick={() => router.back()}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Coverage Options
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    You'll be notified via email once your documents are reviewed
                  </span>
                </div>
              </div>
            </div>

            {/* Approval Process */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Approval Process</h4>
                  <p className="text-sm text-gray-600">What happens next</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Document Review</p>
                    <p className="text-xs text-gray-600">Within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quote Approval</p>
                    <p className="text-xs text-gray-600">If all documents are valid</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment & Policy</p>
                    <p className="text-xs text-gray-600">Only after approval</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  ⓘ No payment required until approved
                </p>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Need Help?</h4>
                  <p className="text-sm text-gray-600">Document support available</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Our team can help you prepare the required documents or answer any questions.
              </p>
              
              <button className="w-full py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Contact Document Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}