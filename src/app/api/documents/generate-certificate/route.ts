import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { policyId, policyNumber, quoteData, user } = await request.json();
    
    // Create certificate HTML
    const htmlContent = generateCertificateHTML(policyNumber, quoteData, user);
    
    // For now, we'll just create a URL and store it
    // In production, you would use puppeteer to generate PDF
    
    // Create unique filename
    const fileName = `certificate-${policyNumber}-${Date.now()}.pdf`;
    const certificateUrl = `https://storage.cargoguard.com/certificates/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      certificateUrl,
      html: htmlContent // For preview
    });
    
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate certificate'
    }, { status: 500 });
  }
}

function generateCertificateHTML(policyNumber: string, quoteData: any, user: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Insurance Certificate - ${policyNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .certificate { border: 3px solid #1e40af; padding: 30px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-name { color: #1e40af; font-size: 28px; font-weight: bold; }
        .certificate-title { color: #1e40af; font-size: 22px; margin-top: 10px; }
        .section { margin-bottom: 20px; }
        .section-title { color: #111827; font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #1e40af; padding-bottom: 5px; }
        .field { display: flex; margin-bottom: 8px; }
        .field-label { min-width: 180px; font-weight: bold; color: #4b5563; }
        .field-value { color: #111827; }
        .signature { margin-top: 40px; text-align: right; }
        .watermark { opacity: 0.1; position: absolute; font-size: 120px; transform: rotate(-45deg); top: 300px; left: 100px; color: #1e40af; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="watermark">CARGO GUARD</div>
        
        <div class="header">
          <div class="company-name">CARGO GUARD INSURANCE</div>
          <div class="certificate-title">INSURANCE CERTIFICATE OF COVERAGE</div>
        </div>
        
        <div class="section">
          <div class="section-title">Policy Information</div>
          <div class="field">
            <div class="field-label">Policy Number:</div>
            <div class="field-value">${policyNumber}</div>
          </div>
          <div class="field">
            <div class="field-label">Date of Issue:</div>
            <div class="field-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="field">
            <div class="field-label">Certificate ID:</div>
            <div class="field-value">CERT-${Date.now().toString().slice(-8)}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Insured Party</div>
          <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">${user?.email || 'Customer'}</div>
          </div>
          <div class="field">
            <div class="field-label">Client ID:</div>
            <div class="field-value">${user?.id?.substring(0, 8).toUpperCase() || 'N/A'}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Cargo & Coverage Details</div>
          <div class="field">
            <div class="field-label">Cargo Type:</div>
            <div class="field-value">${quoteData?.cargo_type || 'General Cargo'}</div>
          </div>
          <div class="field">
            <div class="field-label">Coverage Amount:</div>
            <div class="field-value">$${(quoteData?.shipment_value || 0).toLocaleString()}</div>
          </div>
          <div class="field">
            <div class="field-label">Deductible:</div>
            <div class="field-value">$${(quoteData?.deductible || 0).toLocaleString()}</div>
          </div>
          <div class="field">
            <div class="field-label">Coverage Type:</div>
            <div class="field-value">${quoteData?.selected_coverage || 'Standard'} Coverage</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Transportation Details</div>
          <div class="field">
            <div class="field-label">Origin:</div>
            <div class="field-value">${quoteData?.origin?.city || 'Loading Point'}</div>
          </div>
          <div class="field">
            <div class="field-label">Destination:</div>
            <div class="field-value">${quoteData?.destination?.city || 'Delivery Point'}</div>
          </div>
          <div class="field">
            <div class="field-label">Transport Mode:</div>
            <div class="field-value">${quoteData?.transportation_mode || 'Road'} Transport</div>
          </div>
          <div class="field">
            <div class="field-label">Coverage Period:</div>
            <div class="field-value">${new Date(quoteData?.start_date).toLocaleDateString()} to ${new Date(quoteData?.end_date).toLocaleDateString()}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Important Conditions</div>
          <div style="font-size: 12px; line-height: 1.5;">
            <p>1. This certificate confirms that the cargo described above is insured against all risks of physical loss or damage.</p>
            <p>2. Coverage is subject to terms and conditions of the master policy.</p>
            <p>3. Claims must be reported within 14 days of incident.</p>
            <p>4. This certificate is valid only during the coverage period specified.</p>
          </div>
        </div>
        
        <div class="signature">
          <div style="margin-bottom: 5px;"><strong>Digitally Signed by:</strong></div>
          <div>Cargo Guard Insurance System</div>
          <div>${new Date().toISOString()}</div>
          <div style="margin-top: 10px;">
            <img src="data:image/svg+xml;base64,${Buffer.from('<svg width="200" height="50" xmlns="http://www.w3.org/2000/svg"><text x="10" y="30" font-family="Arial" font-size="12" fill="blue">VERIFIED - DIGITAL SIGNATURE</text></svg>').toString('base64')}" alt="Signature" />
          </div>
        </div>
        
        <div class="footer">
          <p>This is an electronically generated certificate. No physical copy required.</p>
          <p>For verification: https://verify.cargoguard.com/${policyNumber}</p>
          <p>Contact: claims@cargoguard.com | +1-800-CARGO-GUARD</p>
        </div>
      </div>
    </body>
    </html>
  `;
}