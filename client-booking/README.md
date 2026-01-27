# Client Booking Module

This folder contains all the components, services, and utilities related to client booking functionality.

## Folder Structure

```
client-booking/
├── components/          # Reusable booking components
│   └── BookingForm.tsx  # Main booking form component
├── pages/              # Page-level components
│   └── BookingPage.tsx # Main booking page
├── services/           # API and business logic
│   └── bookingService.ts # Booking API calls and logic
├── types/              # TypeScript type definitions
│   └── booking.ts      # Booking-related types
├── utils/              # Utility functions
│   └── bookingUtils.ts # Helper functions for booking
├── index.ts            # Main exports
└── README.md           # This file
```

## Components

### BookingPage
Main page component that handles the complete booking flow for public users.

### BookingForm
Reusable form component for collecting booking information.

## Services

### BookingService
Handles API calls for creating job drafts and managing booking data.

## Types

### booking.ts
Contains all TypeScript interfaces and types used throughout the booking module:
- `BookingFormData` - Form data structure
- `BookingErrors` - Validation error structure
- `ServiceType` - Available service types
- `SLAType` - Service level agreements
- `JobDraft` - Job draft response structure

## Utils

### BookingUtils
Utility functions for:
- Form validation
- Date formatting
- Price calculation
- Session storage management

## Usage

```typescript
import { BookingPage, BookingService, BookingUtils } from './client-booking';

// Use the booking page
<BookingPage />

// Validate form data
const errors = BookingUtils.validateForm(formData);

// Create booking draft
const result = await BookingService.createBookingDraft(bookingData);
```

## Features

- ✅ Form validation
- ✅ Address input with autocomplete
- ✅ Date validation (no past dates)
- ✅ Service type selection
- ✅ SLA level selection with pricing
- ✅ Session storage for form persistence
- ✅ API integration for job drafts
- ✅ Error handling and fallbacks
- ✅ Responsive design
- ✅ Animations and transitions