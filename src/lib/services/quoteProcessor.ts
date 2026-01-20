import { createClient } from '../supabase/client';
import { PremiumCalculator } from './premiumCalculator';

export class QuoteProcessor {
  static async processQuote(quoteId: string) {
    const supabase = createClient();
    
    // Get quote
    const { data: quote, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (error) throw error;
    if (!quote) throw new Error('Quote not found');

    // Check if auto-approval is possible
    const shouldAutoApprove = PremiumCalculator.shouldAutoApprove({
      cargoType: quote.cargo_type,
      shipmentValue: quote.shipment_value,
      transportationMode: quote.transportation_mode,
      coverageType: quote.selected_coverage,
      startDate: quote.start_date,
      endDate: quote.end_date
    });

    let newStatus = quote.status;
    let approvedAt = null;

    if (shouldAutoApprove) {
      // Auto-approve the quote
      newStatus = 'approved';
      approvedAt = new Date().toISOString();
    } else {
      // Send for manual review
      newStatus = 'under_review';
    }

    // Update quote status
    const { data: updatedQuote, error: updateError } = await supabase
      .from('quotes')
      .update({
        status: newStatus,
        approved_at: approvedAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', quoteId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      quote: updatedQuote,
      autoApproved: shouldAutoApprove,
      message: shouldAutoApprove 
        ? 'Quote automatically approved' 
        : 'Quote sent for manual review'
    };
  }

  // Check and expire quotes
  static async checkExpiredQuotes() {
    const supabase = createClient();
    const now = new Date().toISOString();

    const { data: expiredQuotes, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('status', 'submitted')
      .lt('quote_expires_at', now);

    if (error) throw error;

    // Update expired quotes
    for (const quote of expiredQuotes) {
      await supabase
        .from('quotes')
        .update({
          status: 'expired',
          updated_at: now
        })
        .eq('id', quote.id);
    }

    return expiredQuotes.length;
  }
}