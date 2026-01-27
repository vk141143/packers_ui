# LANDING PAGE & BOOKING FLOW REFACTOR ARCHITECTURE

## A. LANDING PAGE REDESIGN

### New Landing Page Rules (STRICT)
- **NO booking forms** - Only marketing content and CTAs
- **NO price display** - Prices shown only after admin quote
- **NO booking creation** - All booking logic under /booking/*
- **NO AI triggers** - Landing is purely marketing
- **ONLY CTAs** - Route to /booking/start

### Landing Page Sections
1. **Hero Section**
   - Value proposition
   - Trust indicators
   - Primary CTA: "Get Free Quote" → /booking/start

2. **How It Works (Client-Visible Only)**
   - Step 1: Submit request & photos
   - Step 2: Receive quote within 24h
   - Step 3: Approve & pay deposit
   - Step 4: Professional clearance
   - Step 5: Final payment & completion

3. **Services Grid**
   - House clearance → /booking/start?service=house
   - Office clearance → /booking/start?service=office
   - Builders waste → /booking/start?service=builders
   - Garden waste → /booking/start?service=garden
   - Hoarder clearance → /booking/start?service=hoarder
   - Hazardous waste → /booking/start?service=hazardous

4. **Trust & Compliance**
   - Licensed waste carrier
   - Environment Agency registered
   - Fully insured
   - Customer testimonials
   - UK coverage map

5. **Final CTA Section**
   - "Start Your Clearance" → /booking/start

## B. BOOKING FLOW ARCHITECTURE

### Routing Structure
```
/                    → New Landing (marketing only)
/booking/start       → Booking wizard step 1
/booking/property    → Property & address details
/booking/waste       → Waste type & volume
/booking/access      → Access constraints & risks
/booking/photos      → Photo uploads
/booking/schedule    → Preferred date/time
/booking/contact     → Contact details & auth
/booking/submitted   → Confirmation page
/auth/login          → Login with booking recovery
/auth/signup         → Signup with booking recovery
/client/dashboard    → Post-booking dashboard
```

### Multi-Step Wizard Flow
1. **Property Details** (`/booking/property`)
   - Property address
   - Property type & size
   - Access information

2. **Waste Assessment** (`/booking/waste`)
   - Waste types selection
   - Volume estimation
   - Special items

3. **Access & Constraints** (`/booking/access`)
   - Access difficulties
   - Parking restrictions
   - Safety considerations

4. **Photo Upload** (`/booking/photos`)
   - Property photos
   - Waste photos
   - Access photos

5. **Schedule Preferences** (`/booking/schedule`)
   - Preferred date ranges
   - Time preferences
   - Urgency level

6. **Contact & Authentication** (`/booking/contact`)
   - Contact details
   - Force login/signup
   - Create real booking

## C. DRAFT BOOKING SYSTEM

### Draft Schema
```typescript
interface DraftBooking {
  id: string;
  sessionId: string;
  userId?: string; // null for anonymous
  propertyAddress: string;
  propertyType: string;
  wasteTypes: string[];
  volumeEstimate: number;
  accessConstraints: string[];
  photos: Photo[];
  preferredDates: string[];
  urgencyLevel: 'standard' | 'urgent' | 'emergency';
  contactDetails?: ContactDetails;
  createdAt: Date;
  expiresAt: Date; // 24 hours from creation
  status: 'draft' | 'converting' | 'converted';
}
```

### Draft Storage Strategy
- **Backend**: PostgreSQL table `draft_bookings`
- **Session**: Cookie with draftId for recovery
- **Expiry**: 24 hours auto-cleanup
- **Recovery**: URL params + session storage

### API Endpoints
```
POST   /api/draft-bookings          → Create draft
PATCH  /api/draft-bookings/:id      → Update draft
POST   /api/draft-bookings/:id/convert → Convert to real booking
GET    /api/draft-bookings/:id      → Get draft details
DELETE /api/draft-bookings/:id      → Delete draft
```

## D. AUTHENTICATION HANDOFF

### Anonymous Flow
1. User starts booking anonymously
2. Draft booking created and updated through steps
3. At final step, force authentication
4. After auth, convert draft to real booking

### Auth Recovery Sequence
```
1. Anonymous user reaches /booking/contact
2. Show auth modal with draft preservation
3. Redirect to /auth/login?draftId=xxx
4. After successful auth:
   - Retrieve draft by ID
   - Convert to real booking
   - Set status = 'client-booking-requested'
   - Redirect to /client/dashboard
   - Show "Quote being prepared" status
```

## E. WORKFLOW COMPLIANCE

### System Workflow (Backend)
```
Client request → 
AI estimate (HIDDEN) → 
Operations review (MANDATORY) → 
Admin sends quote → 
Client approves quote → 
Deposit payment → 
Booking confirmed → 
Crew assigned → 
Job in progress → 
Work completed → 
Admin reviewed → 
Final payment → 
Completed
```

### Client-Visible Workflow (UI)
```
1. Request submitted
2. Quote ready for approval
3. Approved – awaiting payment
4. Booking confirmed
5. Crew assigned
6. In progress
7. Completed – final invoice
```

### Status Mapping
```
Backend Status              → Client Display
client-booking-requested    → "Preparing your quote"
ops-reviewed-pending-quote  → "Quote ready for approval"
client-quote-approved       → "Approved – awaiting payment"
deposit-paid-confirmed      → "Booking confirmed"
crew-assigned              → "Crew assigned"
in-progress                → "In progress"
completed-pending-review   → "Completed – processing invoice"
final-payment-due          → "Final payment due"
completed                  → "Completed"
```

## F. STATE MANAGEMENT

### Landing State
- Stateless marketing page
- No booking data
- Only navigation to /booking/start

### Booking Wizard Store
```typescript
interface BookingWizardState {
  currentStep: number;
  draftId: string | null;
  formData: Partial<DraftBooking>;
  photos: Photo[];
  errors: Record<string, string>;
  isSubmitting: boolean;
  authRequired: boolean;
}
```

### Auth Recovery Store
```typescript
interface AuthRecoveryState {
  pendingDraftId: string | null;
  returnUrl: string | null;
  bookingContext: boolean;
}
```

## G. COMPONENT HIERARCHY

### New Landing Page
```
LandingPage/
├── HeroSection/
├── HowItWorksSection/
├── ServicesGrid/
│   └── ServiceCard/ (with deep-link CTAs)
├── TrustSection/
├── TestimonialsSection/
├── CoverageMapSection/
└── FinalCTASection/
```

### Booking Wizard
```
BookingWizard/
├── BookingLayout/
├── ProgressIndicator/
├── StepRouter/
├── PropertyStep/
├── WasteStep/
├── AccessStep/
├── PhotoStep/
├── ScheduleStep/
├── ContactStep/
└── SubmittedStep/
```

## H. REFACTOR CHECKLIST

### Files to DELETE
- [ ] Current Landing.tsx (has booking forms)
- [ ] PublicBooking.tsx (bypasses proper flow)
- [ ] EnhancedLanding.tsx (if has booking logic)
- [ ] Price calculator components on landing

### Files to REFACTOR
- [ ] App.tsx routing structure
- [ ] RequestBooking.tsx → move to booking wizard
- [ ] Login.tsx → add draft recovery
- [ ] SignUp.tsx → add draft recovery

### Files to CREATE
- [ ] NewLanding.tsx (marketing only)
- [ ] BookingWizard/ components
- [ ] DraftBooking service
- [ ] BookingWizardStore
- [ ] AuthRecovery service

## I. CONVERSION & TRACKING

### Analytics Events
```typescript
// Landing events
track('landing_view');
track('cta_clicked', { cta_type: 'hero' | 'service' | 'final' });

// Booking events
track('booking_started');
track('booking_step_completed', { step: number });
track('draft_created', { draftId: string });
track('auth_required');
track('booking_converted', { bookingId: string });

// Conversion events
track('quote_received');
track('quote_approved');
track('deposit_paid');
track('booking_completed');
```

## J. MIGRATION STRATEGY

### Phase 1: Create New Components
1. Build new marketing-only landing page
2. Create booking wizard components
3. Implement draft booking system

### Phase 2: Update Routing
1. Add new booking routes
2. Update authentication flow
3. Add draft recovery logic

### Phase 3: Remove Old Flow
1. Delete old landing booking forms
2. Remove price calculators from landing
3. Clean up bypassed booking logic

### Phase 4: Testing & Validation
1. Test complete user journey
2. Validate workflow compliance
3. Verify no price leakage
4. Test auth recovery flows