// Email service for sending quotes and notifications to clients

export interface EmailTemplate {
  to: string;
  subject: string;
  body: string;
}

export interface QuoteEmailData {
  clientName: string;
  clientEmail: string;
  jobId: string;
  quoteAmount: number;
  serviceType: string;
  propertyAddress: string;
  validUntil: string;
  notes?: string;
}

export const generateQuoteEmail = (data: QuoteEmailData): EmailTemplate => {
  const formattedAmount = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(data.quoteAmount);

  const validDate = new Date(data.validUntil).toLocaleDateString('en-GB');

  return {
    to: data.clientEmail,
    subject: `Quote for Your Booking Request - ${data.jobId}`,
    body: `
Dear ${data.clientName},

Thank you for your booking request. We are pleased to provide you with a quote for your ${data.serviceType.replace('-', ' ')} service.

QUOTE DETAILS:
- Job Reference: ${data.jobId}
- Service: ${data.serviceType.replace('-', ' ').toUpperCase()}
- Property: ${data.propertyAddress}
- Quote Amount: ${formattedAmount}
- Valid Until: ${validDate}

${data.notes ? `Additional Notes:\n${data.notes}\n\n` : ''}

To accept this quote and proceed with your booking:
1. Log into your client portal
2. Navigate to your bookings
3. Click "Accept Quote" for job ${data.jobId}
4. Complete the payment process

If you have any questions or need to discuss this quote, please don't hesitate to contact us.

Best regards,
MoveAway Admin Team
Phone: +44 20 1234 5678
Email: admin@moveaway.co.uk

This quote is valid until ${validDate}. After this date, prices may be subject to change.
    `.trim()
  };
};

export const sendQuoteEmail = async (emailData: QuoteEmailData): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const email = generateQuoteEmail(emailData);
    
    // In a real implementation, this would integrate with an email service
    // like SendGrid, AWS SES, or similar
    console.log('Sending email:', email);
    
    // Simulate successful email sending
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: 'Failed to send email notification' 
    };
  }
};