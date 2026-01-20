import { createClient } from '../supabase/client';
import { QuoteValidator } from './quoteValidator';

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

    console.log('Processing quote:', {
      id: quote.id,
      cargo: quote.cargo_type,
      value: quote.shipment_value,
      status: quote.status
    });

    // Validate quote
    const validation = QuoteValidator.validateQuote(quote);
    
    // Calculate risk score
    const riskScore = QuoteValidator.calculateRiskScore(quote);
    
    console.log('Validation results:', {
      isValid: validation.isValid,
      status: validation.status,
      reasons: validation.reasons,
      riskScore: riskScore
    });

    let newStatus = quote.status;
    let approvedAt = null;
    let rejectionReason = null;

    if (validation.isValid) {
      if (validation.status === 'approved') {
        newStatus = 'approved';
        approvedAt = new Date().toISOString();
      } else if (validation.status === 'under_review') {
        newStatus = 'under_review';
      } else {
        newStatus = 'rejected';
        rejectionReason = QuoteValidator.getRejectionMessage(validation.reasons);
      }
    } else {
      newStatus = 'rejected';
      rejectionReason = QuoteValidator.getRejectionMessage(validation.reasons);
    }

    // Prepare update data
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      risk_score: riskScore
    };

    if (approvedAt) {
      updateData.approved_at = approvedAt;
    }

    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    // Update quote
    const { data: updatedQuote, error: updateError } = await supabase
      .from('quotes')
      .update(updateData)
      .eq('id', quoteId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log the action
    await this.logQuoteAction(quoteId, {
      fromStatus: quote.status,
      toStatus: newStatus,
      validationResults: validation,
      riskScore
    });

    return {
      quote: updatedQuote,
      validation: validation,
      autoApproved: newStatus === 'approved',
      requiresDocuments: newStatus === 'approved',
      message: this.getStatusMessage(newStatus, validation)
    };
  }

  private static async logQuoteAction(quoteId: string, action: any) {
    const supabase = createClient();
    
    try {
      await supabase
        .from('quote_actions')
        .insert({
          quote_id: quoteId,
          action: 'status_change',
          details: action,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log quote action:', error);
      // Continue even if logging fails
    }
  }

  private static getStatusMessage(status: string, validation: any): string {
    switch (status) {
      case 'approved':
        return 'Your quote has been approved! You can now proceed to payment and document submission.';
      case 'under_review':
        return 'Your quote requires manual review. Our team will contact you within 24 hours.';
      case 'rejected':
        return validation.reasons.length > 0 
          ? `Quote rejected: ${validation.reasons.join(', ')}`
          : 'Quote rejected. Please contact support for more information.';
      default:
        return 'Quote is being processed.';
    }
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