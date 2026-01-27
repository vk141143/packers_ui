# Deposit Cancellation Flow Integration Guide

## Overview

This guide shows how to integrate the new deposit cancellation flow into your booking management system. The implementation provides a seamless user experience for cancelling bookings with different flows for bookings with and without deposits.

## Components

### 1. DepositCancellationModal
Enhanced modal for bookings with paid deposits featuring:
- Multi-step cancellation process (Terms → Reason → Confirmation)
- Refund policy display
- Guided user experience
- Processing states

### 2. ClientBookingCancel
Updated component that intelligently routes to appropriate cancellation flow:
- Uses DepositCancellationModal for bookings with deposits
- Falls back to standard cancellation for bookings without deposits
- Integrated refund calculations

### 3. useCancellationFlow Hook
Custom hook managing cancellation logic:
- Refund calculations
- API integration
- State management
- Error handling

### 4. BookingDashboardWithCancellation
Comprehensive dashboard demonstrating integration:
- Booking listing with status filtering
- Conditional cancellation buttons
- Real-time status updates
- Responsive design

## Quick Integration

### Step 1: Import Components
```tsx
import { ClientBookingCancel } from './components/common/ClientBookingCancel';
import { DepositCancellationModal } from './components/common/DepositCancellationModal';
import { useCancellationFlow } from './hooks/useCancellationFlow';
```

### Step 2: Basic Usage
```tsx
const [showCancelModal, setShowCancelModal] = useState(false);
const [selectedBooking, setSelectedBooking] = useState<Job | null>(null);

// In your component JSX
{showCancelModal && selectedBooking && (
  <ClientBookingCancel
    job={selectedBooking}
    isOpen={showCancelModal}
    onClose={() => setShowCancelModal(false)}
    onCancelSuccess={() => {
      // Handle successful cancellation
      setShowCancelModal(false);
      // Refresh booking data
    }}
  />
)}
```

### Step 3: Advanced Integration
For full dashboard integration, use the `BookingDashboardWithCancellation` component:

```tsx
import { BookingDashboardWithCancellation } from './components/common/BookingDashboardWithCancellation';

<BookingDashboardWithCancellation 
  bookings={bookings}
  onBookingUpdate={(bookingId) => {
    // Handle booking updates
    refreshBookingData(bookingId);
  }}
/>
```

## Key Features

### Intelligent Flow Detection
The system automatically detects whether a booking has a paid deposit and routes to the appropriate cancellation flow:

```tsx
const hasDepositPaid = (booking.finalQuote?.depositAmount || booking.initialPayment?.amount || 0) > 0;

if (hasDepositPaid) {
  // Use DepositCancellationModal
} else {
  // Use standard cancellation flow
}
```

### Refund Policy Calculation
Automatic refund calculation based on timing:

```tsx
const getRefundPolicy = () => {
  const hoursUntilJob = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilJob > 48) {
    return { refundPercentage: 100, message: 'Full refund available' };
  } else if (hoursUntilJob > 24) {
    return { refundPercentage: 50, message: '50% refund' };
  } else {
    return { refundPercentage: 0, message: 'No refund' };
  }
};
```

### Multi-Step Process
The DepositCancellationModal guides users through:
1. **Terms & Conditions** - Display cancellation policy and get acceptance
2. **Cancellation Reason** - Collect feedback for service improvement
3. **Final Confirmation** - Show summary and confirm action

## Customization Options

### Styling
All components use Tailwind CSS classes and can be customized:

```tsx
// Custom button styling
className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl"
```

### Refund Policies
Modify refund calculations in the `useCancellationFlow` hook:

```tsx
const calculateRefund = (depositAmount: number) => {
  const processingFee = Math.min(depositAmount * 0.05, 25); // 5% fee, max £25
  const refundAmount = Math.max(depositAmount - processingFee, 0);
  return { refundAmount, processingFee };
};
```

### API Integration
Update the API endpoint in `useCancellationFlow`:

```tsx
const response = await fetch('/api/bookings/cancel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bookingId,
    reason,
    refundAmount,
    processingFee
  })
});
```

## Demo

Visit `/booking-dashboard-demo` to see the complete integration in action with:
- Sample bookings with different statuses
- Interactive cancellation flows
- Real-time status updates
- Responsive design

## Best Practices

1. **Always validate** booking status before allowing cancellation
2. **Show clear refund policies** to set proper expectations
3. **Collect cancellation reasons** for service improvement
4. **Provide confirmation** with reference numbers
5. **Handle errors gracefully** with user-friendly messages

## Error Handling

The system includes comprehensive error handling:

```tsx
try {
  await processCancellation(reason);
  // Success handling
} catch (error) {
  // Error handling with user feedback
  alert(`❌ Error: ${error.message}`);
}
```

## Testing

Test different scenarios:
- Bookings with deposits (uses enhanced modal)
- Bookings without deposits (uses standard flow)
- Different timing scenarios (affects refund amounts)
- Error conditions (network failures, validation errors)

## Support

For questions or issues with the deposit cancellation flow integration, refer to the demo implementation or check the component documentation.