# Cancellation & Refund Flow

## Overview
Clients and customers can cancel their bookings before crew enters the OTP, with automatic full refund processing.

## Cancellation Rules

### ✅ Can Cancel When:
- Job status is: `created`, `crew-assigned`, `crew-dispatched`, `crew-arrived`, `before-photos`
- OTP has NOT been verified (`otpVerified !== true`)
- Job is NOT in progress or completed

### ❌ Cannot Cancel When:
- OTP has been verified (`status === 'otp-verified'`)
- Job is in progress (`status === 'clearance-progress'`)
- Work is completed or being verified
- Job is already cancelled/refunded

## User Flow

### 1. View Job Tracking
- Client/Customer navigates to job tracking page
- Yellow banner appears: "Need to cancel? You can cancel before crew enters the OTP and get a full refund"
- "Cancel Booking" button is visible

### 2. Initiate Cancellation
- Click "Cancel Booking" button
- Modal opens with:
  - Cancellation confirmation
  - Refund information (amount and timeline)
  - Reason textarea (required)
  - "Keep Booking" and "Confirm Cancel" buttons

### 3. Confirm Cancellation
- Enter cancellation reason
- Click "Confirm Cancel"
- Processing animation shows (2 seconds simulation)
- Success alert: "Booking cancelled successfully! Refund of £X will be processed within 5-7 business days"

### 4. Post-Cancellation
- Job status changes to: `refunded`
- Red banner shows: "Booking Cancelled" with reason
- Refund details displayed:
  - Status: Processed
  - Amount: £X
  - Refunded on: [timestamp]

## Technical Implementation

### Type Updates (types/index.ts)
```typescript
export type JobStatus = 
  | ... existing statuses
  | 'cancelled'
  | 'refunded';

interface Job {
  // ... existing fields
  refundStatus?: 'pending' | 'processed' | 'failed';
  refundedAt?: string;
  refundAmount?: number;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
}
```

### Component Updates

#### EnhancedJobTracking.tsx
- Added `canCancel` logic to check if cancellation is allowed
- Cancel button with yellow banner (only shows when `canCancel === true`)
- Cancel modal with reason textarea
- `handleCancelBooking()` function:
  - Validates reason is provided
  - Updates job with refund details
  - Adds status history entries
  - Shows success message

#### StatusBadge.tsx
- Added `refunded` status with red badge

### Job Store (jobStore.ts)
- `updateJob()` method handles job updates
- Automatically notifies all subscribers
- Updates indexes for fast lookups

## Status History Tracking

When cancelled, two entries are added:
1. **Cancelled Entry**
   - Status: `cancelled`
   - Updated by: `Client` or `Customer`
   - Notes: `Booking cancelled: [reason]`

2. **Refunded Entry**
   - Status: `refunded`
   - Updated by: `System`
   - Notes: `Refund processed: £[amount]`

## UI States

### Before Cancellation
```
┌─────────────────────────────────────────┐
│ ⚠️  Need to cancel?                     │
│ You can cancel before crew enters      │
│ the OTP and get a full refund          │
│                        [Cancel Booking] │
└─────────────────────────────────────────┘
```

### After Cancellation
```
┌─────────────────────────────────────────┐
│ ❌ Booking Cancelled                    │
│ [Cancellation reason text]              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Refund Status: ✓ Processed          │ │
│ │ Amount: £1,800                      │ │
│ │ Refunded on: 15 Jan 2024, 14:30    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Refund Processing

### Timeline
- **Immediate**: Job status updated to `refunded`
- **5-7 Business Days**: Actual refund to payment method

### Refund Amount
- Full booking amount (`job.estimatedValue`)
- No cancellation fees
- Stored in `job.refundAmount`

### Refund Status
- `pending`: Refund initiated (not used in current implementation)
- `processed`: Refund completed
- `failed`: Refund failed (not used in current implementation)

## Admin/Crew View

Admin and crew can see:
- Job status: "Refunded" badge (red)
- Cancellation reason in job details
- Refund information in status history
- Cannot proceed with cancelled jobs

## Integration Points

### Payment Flow
1. Client/Customer pays → `paymentStatus: 'success'`
2. Booking confirmed → Job created
3. Can cancel → Refund processed → `refundStatus: 'processed'`

### Job Lifecycle
```
created → crew-assigned → crew-dispatched → crew-arrived → before-photos
   ↓           ↓               ↓               ↓              ↓
   └───────────┴───────────────┴───────────────┴──────────────┘
                    CAN CANCEL (Full Refund)
                              ↓
                         cancelled
                              ↓
                          refunded

otp-verified → clearance-progress → work-completed → completed
                    CANNOT CANCEL
```

## Error Handling

### Validation Errors
- Empty cancellation reason → Alert: "Please provide a cancellation reason"
- Job already cancelled → Cancel button hidden
- OTP verified → Cancel button hidden

### Processing Errors
- Simulated 2-second delay for refund processing
- In production, integrate with payment gateway API
- Handle network errors gracefully

## Future Enhancements

1. **Partial Refunds**: If crew has started work
2. **Cancellation Fees**: After certain time threshold
3. **Email Notifications**: Send cancellation confirmation
4. **SMS Alerts**: Notify crew of cancellation
5. **Analytics**: Track cancellation reasons
6. **Refund Tracking**: Real-time refund status from payment gateway

## Testing Checklist

- [ ] Cancel before crew dispatch → Full refund
- [ ] Cancel after crew dispatched → Full refund
- [ ] Cancel after crew arrived → Full refund
- [ ] Cancel after OTP verified → Button hidden
- [ ] Cancel without reason → Validation error
- [ ] View cancelled job → Shows refund details
- [ ] Admin views cancelled job → Shows cancellation info
- [ ] Crew views cancelled job → Shows cancelled status
- [ ] Job history shows refunded badge
- [ ] Status history tracks cancellation

## API Integration (Production)

```typescript
// Example refund API call
async function processRefund(jobId: string, amount: number) {
  const response = await fetch('/api/refunds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobId,
      amount,
      paymentMethod: job.paymentMethod,
      reason: job.cancellationReason
    })
  });
  
  const result = await response.json();
  return result.refundId;
}
```

## Security Considerations

1. **Authorization**: Only job owner can cancel
2. **Time Window**: Enforce cancellation deadline
3. **Audit Trail**: Log all cancellation attempts
4. **Fraud Prevention**: Monitor cancellation patterns
5. **Refund Verification**: Confirm payment method ownership
