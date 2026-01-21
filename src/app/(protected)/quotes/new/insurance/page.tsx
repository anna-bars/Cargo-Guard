'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield,
  Calendar, 
  MapPin, 
  Package, 
  DollarSign, 
  Truck,
  AlertCircle, 
  Eye, 
  Printer, 
  FileUp,
  ChevronRight,
  CreditCard,
  Zap,
  BadgeCheck,
  Users,
  Phone,
  Lock,
  Building,
  Flag,
  Box,
  Anchor,
  Plane,
  Car
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PolicyData {
  id: string;
  policy_number: string;
  status: string;
  coverage_amount: number;
  deductible: number;
  cargo_type: string;
  transportation_mode: string;
  origin: any;
  destination: any;
  coverage_start: string;
  coverage_end: string;
  premium_amount: number;
  insurance_certificate_url: string;
  terms_url: string;
  receipt_url: string;
  created_at: string;
}

interface ShipmentDocument {
  id: string;
  policy_id: string;
  commercial_invoice_status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  commercial_invoice_url: string | null;
  packing_list_status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  packing_list_url: string | null;
  bill_of_lading_status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  bill_of_lading_url: string | null;
  created_at: string;
  updated_at: string;
}

// Loading State Component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50">
    <DashboardHeader />
    <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipment details...</p>
        </div>
      </div>
    </div>
  </div>
);

// Not Found State Component
const NotFoundState = ({ router }: { router: any }) => (
  <div className="min-h-screen bg-gray-50">
    <DashboardHeader />
    <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipment Not Found</h2>
        <p className="text-gray-600 mb-6">The shipment you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
);

// Breadcrumb Component
const Breadcrumb = ({ router, policyNumber }: { router: any; policyNumber: string }) => (
  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
    <button 
      onClick={() => router.push('/dashboard')}
      className="flex items-center gap-2 hover:text-gray-700 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Dashboard
    </button>
    <ChevronRight className="w-3 h-3" />
    <button 
      onClick={() => router.push('/shipments')}
      className="hover:text-gray-700 transition-colors"
    >
      Shipments
    </button>
    <ChevronRight className="w-3 h-3" />
    <span className="text-gray-900 font-medium">{policyNumber}</span>
  </div>
);

// Header Section Component
const HeaderSection = ({ 
  policy, 
  statusConfig, 
  formattedDates 
}: { 
  policy: PolicyData; 
  statusConfig: any; 
  formattedDates: any;
}) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <div className="flex items-center gap-4 mb-3">
        <h1 className="text-3xl font-bold text-gray-900">{policy.policy_number}</h1>
        <div className={`px-3 py-1 rounded-full border ${statusConfig.color}`}>
          <span className="font-semibold text-sm">{statusConfig.label}</span>
        </div>
      </div>
      <p className="text-gray-600">Cargo Insurance Policy • Coverage in effect</p>
      <p className="text-gray-500 text-sm mt-1">
        Activated on {formattedDates?.created_at}
      </p>
    </div>
    
    <div className="flex items-center gap-3">
      <button 
        onClick={() => window.print()}
        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>
      <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2">
        <FileText className="w-4 h-4" />
        File a Claim
      </button>
    </div>
  </div>
);

// Status Banner Component
const StatusBanner = ({ policy, statusConfig }: { policy: PolicyData; statusConfig: any }) => (
  <div className={`mb-6 p-4 rounded-xl border ${statusConfig.bgColor} ${statusConfig.color.replace('text-', 'border-').replace('border-200', 'border')}`}>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${statusConfig.bgColor} flex items-center justify-center`}>
        {policy.status === 'active' ? (
          <CheckCircle className={`w-5 h-5 ${statusConfig.iconColor}`} />
        ) : policy.status === 'pending' ? (
          <Clock className={`w-5 h-5 ${statusConfig.iconColor}`} />
        ) : (
          <AlertCircle className={`w-5 h-5 ${statusConfig.iconColor}`} />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">
          {policy.status === 'active' ? 'Policy Active' : 
           policy.status === 'pending' ? 'Policy Pending' : 
           'Policy Inactive'}
        </h3>
        <p className="text-sm text-gray-600">
          {policy.status === 'active' 
            ? 'Your cargo is currently insured and protected against all covered risks.'
            : policy.status === 'pending'
            ? 'Your policy is being processed. Coverage will begin once approved.'
            : 'This policy is no longer active.'
          }
        </p>
      </div>
    </div>
  </div>
);

// Progress Steps Component
const ProgressSteps = () => (
  <div className="mb-8">
    <div className="flex items-center justify-between max-w-[75%]">
      <div className="flex items-center">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
            1
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Policy Issued</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>
        
        <div className="h-0.5 w-20 mx-4 bg-green-600" />
        
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
            2
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Document Upload</p>
            <p className="text-xs text-gray-500">Current Step</p>
          </div>
        </div>
        
        <div className="h-0.5 w-20 mx-4 bg-gray-300" />
        
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 bg-white text-gray-400">
            3
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Ready for Transit</p>
            <p className="text-xs text-gray-500">All documents uploaded</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Policy Overview Component
const PolicyOverviewCard = ({ 
  policy, 
  transportIcon, 
  formattedDates 
}: { 
  policy: PolicyData; 
  transportIcon: React.ReactNode; 
  formattedDates: any;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-blue-100">
        <Shield className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Policy Overview</h2>
        <p className="text-sm text-gray-600">Key details of your cargo insurance</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Coverage Amount</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          ${policy.coverage_amount.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">Total insured value</p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Deductible</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          ${policy.deductible.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">Per claim amount</p>
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Cargo Type</span>
        </div>
        <p className="font-semibold text-gray-900">{policy.cargo_type}</p>
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-gray-600">
            {transportIcon}
          </div>
          <span className="text-sm font-medium text-gray-700">Transport Mode</span>
        </div>
        <p className="font-semibold text-gray-900">{policy.transportation_mode}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Coverage Period</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="font-medium text-gray-900">
                {formattedDates?.coverage_start}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">End Date</p>
              <p className="font-medium text-gray-900">
                {formattedDates?.coverage_end}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Shipment Route</h3>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 mx-auto">
              <Flag className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-500">Origin</p>
            <p className="font-medium text-gray-900">
              {policy.origin?.city || 'Unknown'}
            </p>
          </div>
          <div className="flex-1 px-4">
            <div className="relative">
              <div className="h-0.5 bg-gray-300"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 border-2 border-green-500 bg-white rounded-full"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 border-2 border-green-500 bg-white rounded-full"></div>
              <Truck className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 mx-auto">
              <Building className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-500">Destination</p>
            <p className="font-medium text-gray-900">
              {policy.destination?.city || 'Unknown'}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Document Card Component
const DocumentCard = ({ 
  doc, 
  policy, 
  handleFileUpload, 
  handleViewDocument, 
  handleDownloadDocument 
}: { 
  doc: any; 
  policy: PolicyData; 
  handleFileUpload: any; 
  handleViewDocument: any; 
  handleDownloadDocument: any;
}) => (
  <div className={`border rounded-xl p-5 transition-all duration-200 ${
    doc.status === 'approved' 
      ? 'border-green-200 bg-green-50' 
      : doc.status === 'uploaded'
      ? 'border-yellow-200 bg-yellow-50'
      : 'border-gray-200 hover:border-gray-300'
  }`}>
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${
          doc.status === 'approved' ? 'bg-green-100' :
          doc.status === 'uploaded' ? 'bg-yellow-100' :
          doc.status === 'rejected' ? 'bg-red-100' :
          'bg-gray-100'
        }`}>
          {doc.status === 'approved' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : doc.status === 'uploaded' ? (
            <Clock className="w-5 h-5 text-yellow-600" />
          ) : doc.status === 'rejected' ? (
            <XCircle className="w-5 h-5 text-red-600" />
          ) : (
            <FileText className="w-5 h-5 text-gray-600" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{doc.title}</h3>
            {doc.required && (
              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                Required
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              doc.status === 'approved' ? 'bg-green-500' :
              doc.status === 'uploaded' ? 'bg-yellow-500' :
              doc.status === 'rejected' ? 'bg-red-500' :
              'bg-gray-400'
            }`}></div>
            <span className={`text-sm font-medium ${
              doc.status === 'approved' ? 'text-green-700' :
              doc.status === 'uploaded' ? 'text-yellow-700' :
              doc.status === 'rejected' ? 'text-red-700' :
              'text-gray-700'
            }`}>
              {doc.status === 'approved' ? 'Approved' :
               doc.status === 'uploaded' ? 'Under Review' :
               doc.status === 'rejected' ? 'Rejected' :
               'Not Uploaded'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {doc.url ? (
          <>
            <button
              onClick={() => handleViewDocument(doc.url!)}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => handleDownloadDocument(doc.url!, `${doc.title.toLowerCase().replace(/\s+/g, '-')}-${policy.policy_number}.pdf`)}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        ) : null}
        
        <label className="cursor-pointer">
          <div className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            doc.url 
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
          }`}>
            <Upload className="w-4 h-4" />
            {doc.url ? 'Replace' : 'Upload'}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(doc.id, file);
            }}
          />
        </label>
      </div>
    </div>
  </div>
);

// Required Documents Card Component
const RequiredDocumentsCard = ({
  documents,
  documentList,
  documentCompletionPercentage,
  policy,
  uploading,
  handleFileUpload,
  handleViewDocument,
  handleDownloadDocument,
  getDocumentName
}: {
  documents: ShipmentDocument | null;
  documentList: any[];
  documentCompletionPercentage: string;
  policy: PolicyData;
  uploading: any;
  handleFileUpload: any;
  handleViewDocument: any;
  handleDownloadDocument: any;
  getDocumentName: (type: string) => string;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100">
          <FileUp className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Required Documents</h2>
          <p className="text-sm text-gray-600">Upload required documents for claim processing</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Completion</p>
        <p className="text-xl font-bold text-blue-600">
          {documentCompletionPercentage}
        </p>
      </div>
    </div>
    
    <div className="space-y-4">
      {documentList.map((doc) => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          policy={policy}
          handleFileUpload={handleFileUpload}
          handleViewDocument={handleViewDocument}
          handleDownloadDocument={handleDownloadDocument}
        />
      ))}
    </div>
    
    {uploading.type && (
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900">
            Uploading {getDocumentName(uploading.type)}...
          </span>
          <span className="font-bold text-blue-600">{uploading.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploading.progress}%` }}
          ></div>
        </div>
      </div>
    )}
  </div>
);

// System Documents Card Component
const SystemDocumentsCard = ({ 
  policy, 
  handleViewDocument 
}: { 
  policy: PolicyData; 
  handleViewDocument: any;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-6">Policy Documents</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Insurance Certificate</h3>
            <p className="text-sm text-gray-600">Official policy document</p>
          </div>
        </div>
        <button
          onClick={() => policy.insurance_certificate_url && handleViewDocument(policy.insurance_certificate_url)}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          View Document
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Terms & Conditions</h3>
            <p className="text-sm text-gray-600">Policy terms and coverage details</p>
          </div>
        </div>
        <button
          onClick={() => policy.terms_url && handleViewDocument(policy.terms_url)}
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          View Terms
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-100">
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Payment Receipt</h3>
            <p className="text-sm text-gray-600">Transaction confirmation</p>
          </div>
        </div>
        <button
          onClick={() => policy.receipt_url && handleViewDocument(policy.receipt_url)}
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          View Receipt
        </button>
      </div>
    </div>
  </div>
);

// Premium Summary Card Component
const PremiumSummaryCard = ({ 
  premiumSummary, 
  formattedDates 
}: { 
  premiumSummary: any; 
  formattedDates: any;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-green-100">
        <DollarSign className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Premium Summary</h3>
        <p className="text-sm text-gray-600">Payment breakdown</p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <span className="text-gray-600">Base Premium</span>
        <span className="font-semibold text-gray-900">
          ${premiumSummary?.basePremium.toLocaleString()}
        </span>
      </div>
      
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <span className="text-gray-600">Service Fee</span>
        <span className="font-semibold text-gray-900">${premiumSummary?.serviceFee.toLocaleString()}</span>
      </div>
      
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <span className="text-gray-600">Taxes</span>
        <span className="font-semibold text-gray-900">
          ${premiumSummary?.taxes.toLocaleString()}
        </span>
      </div>
      
      <div className="pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-gray-900">Total Paid</span>
          <span className="text-2xl font-bold text-blue-600">
            ${premiumSummary?.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
    
    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="font-semibold text-green-700">Payment Completed</span>
      </div>
      <p className="text-sm text-green-600 mt-1">
        Paid on {formattedDates?.short_created_at}
      </p>
    </div>
  </div>
);

// Next Steps Card Component
const NextStepsCard = ({ documents }: { documents: ShipmentDocument | null }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h4 className="font-semibold text-gray-900 mb-6">Next Steps</h4>
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Policy Activated</p>
          <p className="text-xs text-gray-500">Your cargo is now insured</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            documents?.commercial_invoice_status === 'uploaded' &&
            documents?.packing_list_status === 'uploaded' &&
            documents?.bill_of_lading_status === 'uploaded'
              ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {documents?.commercial_invoice_status === 'uploaded' &&
             documents?.packing_list_status === 'uploaded' &&
             documents?.bill_of_lading_status === 'uploaded' ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Upload className="w-4 h-4 text-blue-600" />
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Upload Documents</p>
          <p className="text-xs text-gray-500">
            {documents?.commercial_invoice_status === 'uploaded' &&
             documents?.packing_list_status === 'uploaded' &&
             documents?.bill_of_lading_status === 'uploaded'
              ? 'All documents uploaded'
              : 'Upload required shipping documents'
            }
          </p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Truck className="w-4 h-4 text-gray-600" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Shipment in Transit</p>
          <p className="text-xs text-gray-500">Begins once documents are approved</p>
        </div>
      </div>
    </div>
    
    <button className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
      Track Shipment
    </button>
  </div>
);

// Help Card Component
const HelpCard = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Users className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">Need Assistance?</h4>
        <p className="text-sm text-gray-600">Our team is here to help</p>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Phone className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Claims Support</p>
          <p className="text-xs text-gray-600">1-800-CLAIM-HELP</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">24/7 Emergency</p>
          <p className="text-xs text-gray-600">For urgent cargo issues</p>
        </div>
      </div>
    </div>
    
    <button className="w-full mt-4 py-2 px-4 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
      Contact Support
    </button>
  </div>
);

// Main Component
export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState<PolicyData | null>(null);
  const [documents, setDocuments] = useState<ShipmentDocument | null>(null);
  const [uploading, setUploading] = useState<{
    type: 'commercial_invoice' | 'packing_list' | 'bill_of_lading' | null;
    progress: number;
  }>({ type: null, progress: 0 });
  const shipmentId = params.id as string;

  // Memoized helper functions
  const getStatusDisplay = useCallback((status: string) => {
    const statusConfig = {
      active: { 
        label: 'Active', 
        color: 'bg-green-100 text-green-800 border-green-200',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      pending: { 
        label: 'Pending', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      expired: { 
        label: 'Expired', 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        iconColor: 'text-gray-600',
        bgColor: 'bg-gray-50'
      },
      cancelled: { 
        label: 'Cancelled', 
        color: 'bg-red-100 text-red-800 border-red-200',
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50'
      }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  }, []);

  const getTransportIcon = useCallback((mode: string) => {
    switch (mode.toLowerCase()) {
      case 'air': return <Plane className="w-4 h-4" />;
      case 'sea': return <Anchor className="w-4 h-4" />;
      case 'road': return <Car className="w-4 h-4" />;
      default: return <Truck className="w-4 h-4" />;
    }
  }, []);

  const getDocumentName = useCallback((type: string) => {
    switch (type) {
      case 'commercial_invoice': return 'Commercial Invoice';
      case 'packing_list': return 'Packing List';
      case 'bill_of_lading': return 'Bill of Lading';
      default: return 'Document';
    }
  }, []);

  // Memoized values
  const statusConfig = useMemo(() => 
    policy ? getStatusDisplay(policy.status) : getStatusDisplay('pending'),
    [policy, getStatusDisplay]
  );

  const formattedDates = useMemo(() => {
    if (!policy) return null;
    
    return {
      created_at: new Date(policy.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      coverage_start: new Date(policy.coverage_start).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      coverage_end: new Date(policy.coverage_end).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      short_created_at: new Date(policy.created_at).toLocaleDateString()
    };
  }, [policy]);

  const documentList = useMemo(() => {
    if (!documents) return [];
    
    return [
      {
        id: 'commercial_invoice',
        title: 'Commercial Invoice',
        description: 'Shows cargo value and trade details',
        status: documents.commercial_invoice_status || 'pending',
        url: documents.commercial_invoice_url,
        required: true
      },
      {
        id: 'packing_list',
        title: 'Packing List',
        description: 'Quantity, weight, and packaging details',
        status: documents.packing_list_status || 'pending',
        url: documents.packing_list_url,
        required: true
      },
      {
        id: 'bill_of_lading',
        title: 'Bill of Lading / Air Waybill',
        description: 'Carrier-issued shipment receipt',
        status: documents.bill_of_lading_status || 'pending',
        url: documents.bill_of_lading_url,
        required: true
      }
    ];
  }, [documents]);

  const documentCompletionPercentage = useMemo(() => {
    if (!documents) return "0%";
    
    const totalDocs = 3;
    const uploadedDocs = [
      documents.commercial_invoice_status === 'uploaded' || documents.commercial_invoice_status === 'approved',
      documents.packing_list_status === 'uploaded' || documents.packing_list_status === 'approved',
      documents.bill_of_lading_status === 'uploaded' || documents.bill_of_lading_status === 'approved'
    ].filter(Boolean).length;
    
    return `${Math.round((uploadedDocs / totalDocs) * 100)}%`;
  }, [documents]);

  const premiumSummary = useMemo(() => {
    if (!policy) return null;
    
    const serviceFee = 99;
    const taxes = Math.round(policy.premium_amount * 0.08);
    const totalAmount = policy.premium_amount + serviceFee + taxes;
    
    return {
      basePremium: policy.premium_amount,
      serviceFee,
      taxes,
      totalAmount
    };
  }, [policy]);

  const transportIcon = useMemo(() => 
    policy ? getTransportIcon(policy.transportation_mode) : null,
    [policy, getTransportIcon]
  );

  // File upload handler
  const handleFileUpload = useCallback(async (
    type: 'commercial_invoice' | 'packing_list' | 'bill_of_lading',
    file: File
  ) => {
    if (!policy) return;
    
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload PDF, JPEG, or PNG files only');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    setUploading({ type, progress: 0 });
    
    try {
      const supabase = createClient();
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploading(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);
      
      // Your upload logic here...
      // (Keep your existing upload logic)
      
      clearInterval(progressInterval);
      setUploading({ type, progress: 100 });
      
      toast.success(`${getDocumentName(type)} uploaded successfully!`);
      
      setTimeout(() => {
        setUploading({ type: null, progress: 0 });
      }, 1000);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload document: ${error.message}`);
      setUploading({ type: null, progress: 0 });
    }
  }, [policy, getDocumentName]);

  // View document handler
  const handleViewDocument = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  // Download document handler
  const handleDownloadDocument = useCallback((url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      
      try {
        // Load policy data
        const { data: policyData, error: policyError } = await supabase
          .from('policies')
          .select('*')
          .eq('id', shipmentId)
          .single();
        
        if (policyError || !policyData) {
          toast.error('Shipment not found');
          router.push('/dashboard');
          return;
        }
        
        setPolicy(policyData);
        
        // Load or create shipment document record
        const { data: existingDocs } = await supabase
          .from('documents')
          .select('*')
          .eq('policy_id', shipmentId)
          .maybeSingle();
        
        if (existingDocs) {
          setDocuments(existingDocs);
        } else {
          // Create new document record if doesn't exist
          const { data: newDocs } = await supabase
            .from('documents')
            .insert([{
              policy_id: shipmentId,
              commercial_invoice_status: 'pending',
              packing_list_status: 'pending',
              bill_of_lading_status: 'pending'
            }])
            .select()
            .single();
          
          if (newDocs) {
            setDocuments(newDocs);
          }
        }
        
      } catch (error) {
        console.error('Error loading shipment:', error);
        toast.error('Failed to load shipment details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [shipmentId, router]);

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show not found state
  if (!policy) {
    return <NotFoundState router={router} />;
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb router={router} policyNumber={policy.policy_number} />
        
        <div className="mb-8">
          <HeaderSection 
            policy={policy}
            statusConfig={statusConfig}
            formattedDates={formattedDates!}
          />
          
          <StatusBanner 
            policy={policy}
            statusConfig={statusConfig}
          />
          
          <ProgressSteps />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PolicyOverviewCard 
              policy={policy}
              transportIcon={transportIcon!}
              formattedDates={formattedDates!}
            />
            
            <RequiredDocumentsCard 
              documents={documents}
              documentList={documentList}
              documentCompletionPercentage={documentCompletionPercentage}
              policy={policy}
              uploading={uploading}
              handleFileUpload={handleFileUpload}
              handleViewDocument={handleViewDocument}
              handleDownloadDocument={handleDownloadDocument}
              getDocumentName={getDocumentName}
            />
            
            <SystemDocumentsCard 
              policy={policy}
              handleViewDocument={handleViewDocument}
            />
          </div>

          <div className="space-y-6">
            <PremiumSummaryCard 
              premiumSummary={premiumSummary!}
              formattedDates={formattedDates!}
            />
            
            <NextStepsCard documents={documents} />
            
            <HelpCard />
          </div>
        </div>
      </div>
    </div>
  );
}