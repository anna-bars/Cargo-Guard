// lib/supabase/quotes.ts - թարմացված տարբերակ
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    const quoteRequestId = uuidv4();
    
    // Սկզբում պահպանում ենք quote request առանց փաստաթղթերի
    const insertData: any = {
      id: quoteRequestId,
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
      shipper_name: quoteData.shipperName,
      reference_number: quoteData.referenceNumber,
      status: 'submitted',
      is_active: true,
      documents: [] // Սկզբում դատարկ array
    };
    
    const { data: quoteRequest, error: quoteError } = await supabase
      .from('quote_requests')
      .insert(insertData)
      .select()
      .single();
    
    if (quoteError) {
      throw new Error(`Failed to create quote request: ${quoteError.message}`);
    }
    
    // Վերբեռնում ենք փաստաթղթերը
    const uploadedDocuments: any[] = [];
    
    for (const doc of quoteData.documents) {
      if (doc.file) {
        // Ստեղծում ենք ֆայլի անունը
        const fileName = `${quoteData.quoteId}_${doc.type}_${Date.now()}_${doc.file.name}`;
        
        // Վերբեռնում ենք ֆայլը
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
        
        // Ստեղծում ենք փաստաթղթի գրառում documents աղյուսակում
        const { data: documentRecord, error: docError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            quote_request_id: quoteRequestId,
            quote_id: null,
            document_type: doc.type,
            file_name: doc.file.name,
            file_url: publicUrl,
            file_size: doc.file.size,
            status: 'pending',
            uploaded_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (docError) {
          console.error(`Failed to save document record ${doc.name}:`, docError);
          continue;
        }
        
        // Հավաքում ենք փաստաթղթերի տեղեկությունները
        uploadedDocuments.push({
          id: documentRecord.id,
          type: doc.type,
          name: doc.name,
          file_name: doc.file.name,
          file_url: publicUrl,
          file_size: doc.file.size,
          uploaded_at: new Date().toISOString()
        });
      }
    }
    
    // Update quote request-ը փաստաթղթերի տվյալներով
    if (uploadedDocuments.length > 0) {
      await supabase
        .from('quote_requests')
        .update({
          documents: uploadedDocuments,
          updated_at: new Date().toISOString()
        })
        .eq('id', quoteRequestId);
    }
    
    // Ստեղծում ենք notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'quote_submitted',
        title: 'Quote Submitted Successfully',
        message: `Your quote ${quoteData.quoteId} has been submitted with ${uploadedDocuments.length} documents.`,
        related_id: quoteRequestId,
        related_type: 'quote_requests',
        is_read: false
      });
    
    return {
      success: true,
      quoteRequestId: quoteRequestId,
      documents: uploadedDocuments
    };
    
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
}