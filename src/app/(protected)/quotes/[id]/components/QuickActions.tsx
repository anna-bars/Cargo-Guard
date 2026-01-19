import { Download, CreditCard, ExternalLink, Upload, RefreshCw, Receipt } from 'lucide-react';
import { StatusConfig } from '../types';

interface QuickActionsProps {
  statusConfig: StatusConfig;
  onMakePayment: () => void;
  onViewPolicy: () => void;
  onViewReceipt: () => void;
  onResubmit: () => void;
  onCheckStatus: () => void;
}

export default function QuickActions({
  statusConfig,
  onMakePayment,
  onViewPolicy,
  onViewReceipt,
  onResubmit,
  onCheckStatus,
}: QuickActionsProps) {
  return (
    <div className="bg-white/90 rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {statusConfig.showActions.downloadQuote && (
          <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download Quote PDF
          </button>
        )}
        
        {statusConfig.showActions.makePayment && (
          <button
            onClick={onMakePayment}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Make Payment
          </button>
        )}
        
        {statusConfig.showActions.viewPolicy && (
          <button
            onClick={onViewPolicy}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            View Policy
          </button>
        )}
        
        {statusConfig.showActions.viewReceipt && (
          <button
            onClick={onViewReceipt}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Receipt className="w-5 h-5" />
            View Receipt
          </button>
        )}
        
        {statusConfig.showActions.resubmit && (
          <button
            onClick={onResubmit}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Resubmit Quote
          </button>
        )}
        
        {statusConfig.showActions.checkStatus && (
          <button
            onClick={onCheckStatus}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Check Status
          </button>
        )}
        
        {!statusConfig.showActions.downloadQuote && 
          !statusConfig.showActions.makePayment && 
          !statusConfig.showActions.viewPolicy && 
          !statusConfig.showActions.viewReceipt &&
          !statusConfig.showActions.resubmit && 
          !statusConfig.showActions.checkStatus && (
          <div className="text-center py-4 text-gray-500">
            No actions available for this status
          </div>
        )}
      </div>
    </div>
  );
}