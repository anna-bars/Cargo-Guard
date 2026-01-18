// lib/supabase/quotes.ts
import { createClient } from './client';
import { v4 as uuidv4 } from 'uuid';

interface SubmitQuoteData {
  quoteId: string;
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
  selectedCoverage: string;
  premium: number;
  deductible: number;
  shipperName: string;
  referenceNumber?: string;
  documents: Array<{
    type: string;
    name: string;
    file: File;
  }>;
}

export async function submitQuoteToSupabase(quoteData: SubmitQuoteData) {
  const supabase = createClient();
  
  try {
    // Ստանում ենք ընթացիկ օգտատիրոջը
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Ստեղծում ենք quote_requests գրառումը
    const quoteId = uuidv4();
    
    const { data: quoteRequest, error: quoteError } = await supabase
      .from('quote_requests')
      .insert({
        id: quoteId,
        quote_id: quoteData.quoteId,
        user_id: user.id,
        cargo_type: quoteData.cargoType,
        shipment_value: quoteData.shipmentValue,
        origin: quoteData.origin,
        destination: quoteData.destination,
        start_date: quoteData.startDate,
        end_date: quoteData.endDate,
        transportation_mode: quoteData.transportationMode,
        selected_coverage: quoteData.selectedCoverage,
        calculated_premium: quoteData.premium,
        deductible: quoteData.deductible,
        status: 'submitted',
        is_active: true
      })
      .select()
      .single();
    
    if (quoteError) {
      throw new Error(`Failed to create quote request: ${quoteError.message}`);
    }
    
    // Վերբեռնում ենք փաստաթղթերը
    const uploadedDocuments = [];
    
    for (const doc of quoteData.documents) {
      if (doc.file) {
        // Ստեղծում ենք ֆայլի անունը
        const fileName = `${quoteData.quoteId}_${doc.type}_${Date.now()}_${doc.file.name}`;
        
        // Վերբեռնում ենք ֆայլը Supabase Storage-ում
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('documents')
          .upload(fileName, doc.file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error(`Failed to upload document ${doc.name}:`, uploadError);
          continue;
        }
        
        // Ստանում ենք ֆայլի URL-ը
        const { data: { publicUrl } } = supabase
          .storage
          .from('documents')
          .getPublicUrl(fileName);
        
        // Ստեղծում ենք documents աղյուսակում գրառում
        const { data: documentRecord, error: docError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            quote_id: quoteId,
            document_type: doc.type,
            file_name: doc.file.name,
            file_url: publicUrl,
            file_size: doc.file.size,
            status: 'pending'
          })
          .select()
          .single();
        
        if (docError) {
          console.error(`Failed to save document record ${doc.name}:`, docError);
          continue;
        }
        
        uploadedDocuments.push(documentRecord);
      }
    }
    
    // Ստեղծում ենք notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'quote_submitted',
        title: 'Quote Submitted Successfully',
        message: `Your quote ${quoteData.quoteId} has been submitted and is under review.`,
        related_id: quoteId,
        related_type: 'quote_requests',
        is_read: false
      });
    
    return {
      success: true,
      quoteRequestId: quoteId,
      documents: uploadedDocuments
    };
    
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
}