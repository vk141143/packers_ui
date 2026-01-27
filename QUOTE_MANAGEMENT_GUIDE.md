# Quote Management System - User Guide

## Overview
The quote management system allows admins to create and send quotes to clients for their booking requests, and enables clients to review and accept these quotes.

## How It Works

### For Admins:

1. **Access Quote Management**
   - Navigate to Admin Dashboard → Quote Management
   - You'll see all jobs with status "client-booking-request" that need quotes

2. **Create a Quote**
   - Click "Create Quote for Client" on any pending booking request
   - Enter the quote amount (required)
   - Add optional notes for special terms or conditions
   - Click "Send Quote to Client"

3. **Quote Details Include:**
   - Quote amount
   - Service type and property details
   - Client contact information
   - Validity period (7 days by default)
   - Additional notes

4. **Email Notification**
   - System automatically sends email to client with quote details
   - Email includes instructions for accepting the quote
   - Client receives job reference and quote amount

### For Clients:

1. **Receive Quote Notification**
   - Email notification with quote details
   - Login instructions for client portal

2. **Review Quote**
   - Access client portal to view detailed quote
   - See price breakdown and terms
   - Review validity period

3. **Accept Quote**
   - Click "Accept Quote & Pay" to proceed
   - Redirected to secure payment portal
   - Booking confirmed after payment

## System Flow

```
Client Booking Request → Admin Creates Quote → Email Sent to Client → Client Reviews → Client Accepts → Payment → Booking Confirmed
```

## Job Status Progression

1. `client-booking-request` - Initial booking, needs quote
2. `admin-quoted` - Quote created and sent to client
3. `client-approved` - Client accepted the quote
4. `payment-pending` - Awaiting payment
5. `booking-confirmed` - Payment received, booking confirmed

## Features

### Admin Features:
- View all pending quote requests
- Create detailed quotes with notes
- Automatic email notifications
- Track quote status
- Client contact information display

### Client Features:
- Email notifications
- Detailed quote review
- Price breakdown
- One-click quote acceptance
- Secure payment integration

## Troubleshooting

### Quote Page Shows Empty
**Problem:** Admin sees "No pending quote requests"
**Solution:** 
- Check if there are jobs with status `client-booking-request`
- Verify job data includes client contact information
- Ensure jobs are properly created in the system

### Quote Not Sending
**Problem:** Error when trying to send quote
**Solution:**
- Verify quote amount is entered
- Check client email address is valid
- Ensure job exists in system

### Client Can't See Quote
**Problem:** Client doesn't see quote in portal
**Solution:**
- Verify quote was successfully created (status changed to `admin-quoted`)
- Check client is logged in with correct account
- Confirm client ID matches job client ID

## Technical Details

### Quote Data Structure:
```typescript
{
  quotedBy: string;
  quotedAt: string;
  quotedAmount: number;
  breakdown: {
    basePrice: number;
    additionalCharges: Array<{description: string, amount: number}>;
  };
  validUntil: string;
  notes?: string;
}
```

### Email Template:
- Professional format with company branding
- Clear quote details and amount
- Instructions for acceptance
- Contact information for questions
- Validity period clearly stated

## Best Practices

1. **For Admins:**
   - Review job details carefully before quoting
   - Include clear notes for complex jobs
   - Respond to quote requests promptly
   - Follow up on expired quotes

2. **For System Setup:**
   - Ensure email service is properly configured
   - Test quote flow end-to-end
   - Monitor quote acceptance rates
   - Keep client contact information updated

## Support

For technical issues or questions about the quote system:
- Check system logs for error messages
- Verify job data integrity
- Test email service connectivity
- Contact system administrator if issues persist