import { createClient } from './client';

export interface QuoteSubmitData {
  quoteId: string;
  cargoType: string;
  shipmentValue: number;
  origin: any;
  destination: any;
  startDate: string;
  endDate: string;
  transportationMode: string;
  selectedCoverage: string;
  premium: number;
  deductible: number;
  shipperName: string;
  referenceNumber?: string;
  status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  documents?: any[];
}

// ✅ Սանիտացնել filename-ը ASCII նիշերի համար
const sanitizeFileName = (fileName: string): string => {
  // Հեռացնել ոչ ASCII նիշերը
  let sanitized = fileName.replace(/[^\x00-\x7F]/g, '');
  
  // Հեռացնել հատուկ նիշերը
  sanitized = sanitized.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
  
  // Հեռացնել բացատները և փոխարինել underscore-ով
  sanitized = sanitized.replace(/\s+/g, '_');
  
  // Եթե արդյունքում դատարկ է, օգտագործել default անուն
  if (!sanitized || sanitized.trim() === '') {
    return 'document_' + Date.now() + '.png';
  }
  
  return sanitized;
};

// ✅ Ստեղծել անվտանգ filename Supabase Storage-ի համար
const createSafeFileName = (quoteId: string, docType: string, originalFileName: string): string => {
  // Ստանալ file extension
  const fileExt = originalFileName.split('.').pop() || 'png';
  
  // Սանիտացնել original filename-ը
  const sanitizedOriginal = sanitizeFileName(originalFileName.replace(`.${fileExt}`, ''));
  
  // Ստեղծել անվտանգ filename
  return `${quoteId}_${docType}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt.toLowerCase()}`;
};

export const submitQuoteToSupabase = async (data: QuoteSubmitData) => {
  const supabase = createClient();
  
  try {
    // Ստանում ենք current user-ին
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Upload documents if any
    let documentUrls: any[] = [];
    if (data.documents && data.documents.length > 0) {
      for (const doc of data.documents) {
        if (doc.file) {
          try {
            // ✅ Ստեղծել անվտանգ filename
            const safeFileName = createSafeFileName(data.quoteId, doc.type, doc.file.name);
            
            console.log('Uploading document:', {
              original: doc.file.name,
              safe: safeFileName,
              size: doc.file.size,
              type: doc.file.type
            });
            
            // Upload file to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('documents')
              .upload(safeFileName, doc.file, {
                cacheControl: '3600',
                upsert: false
              });
            
            if (uploadError) {
              console.error('Upload error details:', {
                error: uploadError,
                fileName: safeFileName,
                fileSize: doc.file.size,
                fileType: doc.file.type
              });
              throw uploadError;
            }
            
            // Ստանալ public URL
            const { data: urlData } = supabase.storage
              .from('documents')
              .getPublicUrl(safeFileName);
            
            if (!urlData || !urlData.publicUrl) {
              throw new Error('Failed to get public URL for uploaded file');
            }
            
            documentUrls.push({
              id: Math.random().toString(36).substring(7),
              name: doc.name,
              type: doc.type,
              file_url: urlData.publicUrl,
              file_name: safeFileName,
              file_size: doc.file.size,
              uploaded_at: new Date().toISOString(),
              original_name: doc.file.name // Պահպանել original անունը
            });
            
            console.log('Document uploaded successfully:', {
              name: doc.name,
              url: urlData.publicUrl,
              fileName: safeFileName
            });
            
          } catch (uploadError) {
            console.error(`Failed to upload document ${doc.name}:`, uploadError);
            // Շարունակել մյուս documents-ների upload-ը
            continue;
          }
        }
      }
    }
    
    // Ստեղծում ենք quote-ը database-ում
    const quoteData = {
      user_id: user.id,
      quote_id: data.quoteId,
      cargo_type: data.cargoType,
      shipment_value: data.shipmentValue,
      origin: data.origin,
      destination: data.destination,
      start_date: data.startDate,
      end_date: data.endDate,
      transportation_mode: data.transportationMode,
      selected_coverage: data.selectedCoverage,
      calculated_premium: data.premium,
      deductible: data.deductible,
      status: data.status || 'submitted', // Default to submitted
      shipper_name: data.shipperName,
      reference_number: data.referenceNumber || '',
      documents: documentUrls,
      is_active: true
    };
    
    console.log('Inserting quote to database:', {
      quoteId: data.quoteId,
      documentsCount: documentUrls.length
    });
    
    const { data: insertedData, error } = await supabase
      .from('quote_requests')
      .insert([quoteData])
      .select()
      .single();
    
    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }
    
    console.log('Quote submitted successfully:', insertedData);
    
    return {
      success: true,
      quoteId: data.quoteId,
      message: 'Quote submitted successfully',
      data: insertedData
    };
    
  } catch (error) {
    console.error('Error submitting quote to Supabase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};