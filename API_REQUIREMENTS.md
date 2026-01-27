# 🚀 COMPLETE API REQUIREMENTS FOR PACKERS & MOVERS SYSTEM

## 📊 TOTAL APIs NEEDED: **47 APIs**

---

## 1️⃣ AUTHENTICATION & USER MANAGEMENT APIs (12 APIs)

### 1.1 Client Authentication
- **POST** `/api/auth/client/register` - Register new client
- **POST** `/api/auth/client/login` - Client login
- **POST** `/api/auth/client/verify-otp` - Verify OTP for client
- **POST** `/api/auth/client/resend-otp` - Resend OTP

### 1.2 Crew Authentication
- **POST** `/api/auth/crew/register` - Register new crew member
- **POST** `/api/auth/crew/login` - Crew login

### 1.3 Admin/Staff Authentication
- **POST** `/api/auth/admin/login` - Admin login
- **POST** `/api/auth/sales/login` - Sales login
- **POST** `/api/auth/management/login` - Management login

### 1.4 Password Management
- **POST** `/api/auth/forgot-password` - Request password reset
- **POST** `/api/auth/verify-reset-otp` - Verify reset OTP
- **POST** `/api/auth/reset-password` - Reset password with token

---

## 2️⃣ JOB/BOOKING MANAGEMENT APIs (15 APIs)

### 2.1 Job Creation & Retrieval
- **POST** `/api/jobs/create` - Create new job/booking request
- **GET** `/api/jobs` - Get all jobs (with filters by role)
- **GET** `/api/jobs/:jobId` - Get specific job details
- **GET** `/api/jobs/client/:clientId` - Get jobs by client ID
- **GET** `/api/jobs/crew/:crewId` - Get jobs assigned to crew

### 2.2 Job Status Updates
- **PATCH** `/api/jobs/:jobId/status` - Update job status
- **PATCH** `/api/jobs/:jobId/dispatch` - Dispatch job to crew
- **PATCH** `/api/jobs/:jobId/start` - Start job work
- **PATCH** `/api/jobs/:jobId/complete` - Mark job as completed
- **PATCH** `/api/jobs/:jobId/verify` - Admin verify completed job

### 2.3 Job Cancellation
- **POST** `/api/jobs/:jobId/cancel` - Cancel job with refund calculation
- **GET** `/api/jobs/:jobId/cancellation-policy` - Get cancellation policy

### 2.4 Job Photos & Documentation
- **POST** `/api/jobs/:jobId/photos` - Upload before/after photos
- **GET** `/api/jobs/:jobId/photos` - Get job photos
- **PATCH** `/api/jobs/:jobId/checklist` - Update job checklist

---

## 3️⃣ QUOTE MANAGEMENT APIs (6 APIs)

### 3.1 Quote Creation & Management
- **POST** `/api/quotes/:jobId/create` - Admin creates quote for job
- **GET** `/api/quotes/pending` - Get jobs awaiting quotes
- **POST** `/api/quotes/:jobId/send` - Send quote to client

### 3.2 Quote Approval/Rejection
- **POST** `/api/quotes/:jobId/accept` - Client accepts quote (locks price)
- **POST** `/api/quotes/:jobId/reject` - Client rejects quote
- **GET** `/api/quotes/:jobId` - Get quote details

---

## 4️⃣ PAYMENT MANAGEMENT APIs (8 APIs)

### 4.1 Deposit Payment
- **POST** `/api/payments/deposit` - Process deposit payment
- **GET** `/api/payments/:jobId/breakdown` - Get payment breakdown

### 4.2 Final Payment
- **POST** `/api/payments/final` - Process final payment after job completion
- **POST** `/api/payments/:jobId/request-final` - Admin requests final payment
- **GET** `/api/payments/pending` - Get jobs with pending payments

### 4.3 Payment Tracking
- **GET** `/api/payments/history` - Get payment history
- **GET** `/api/payments/:paymentId` - Get payment details
- **POST** `/api/payments/:jobId/refund` - Process refund for cancelled jobs

---

## 5️⃣ CREW MANAGEMENT APIs (5 APIs)

### 5.1 Crew Assignment
- **POST** `/api/crew/assign` - Assign crew to job
- **GET** `/api/crew/available` - Get available crew members
- **GET** `/api/crew/:crewId/jobs` - Get crew's assigned jobs

### 5.2 Crew Approval (Admin)
- **GET** `/api/crew/pending` - Get pending crew registrations
- **POST** `/api/crew/:crewId/approve` - Approve crew member

---

## 6️⃣ INVOICE MANAGEMENT APIs (4 APIs)

- **POST** `/api/invoices/:jobId/generate` - Generate invoice after payment
- **GET** `/api/invoices` - Get all invoices
- **GET** `/api/invoices/:invoiceId` - Get specific invoice
- **GET** `/api/invoices/:invoiceId/download` - Download invoice PDF

---

## 7️⃣ USER PROFILE MANAGEMENT APIs (3 APIs)

- **GET** `/api/users/profile` - Get user profile
- **PATCH** `/api/users/profile` - Update user profile
- **GET** `/api/users/:userId` - Get specific user details (admin only)

---

## 8️⃣ ANALYTICS & REPORTING APIs (4 APIs)

- **GET** `/api/analytics/dashboard` - Get dashboard analytics
- **GET** `/api/analytics/jobs` - Get job statistics
- **GET** `/api/analytics/revenue` - Get revenue analytics
- **GET** `/api/analytics/crew-performance` - Get crew performance metrics

---

## 9️⃣ ADDITIONAL FEATURES (Optional - Not Counted in Total)

### 9.1 Real-time Tracking
- **WebSocket** `/ws/tracking/:jobId` - Real-time job location tracking
- **GET** `/api/tracking/:jobId/location` - Get current crew location

### 9.2 Notifications
- **POST** `/api/notifications/send` - Send notification to user
- **GET** `/api/notifications` - Get user notifications
- **PATCH** `/api/notifications/:notificationId/read` - Mark notification as read

### 9.3 File Upload
- **POST** `/api/upload/image` - Upload image (photos, documents)
- **POST** `/api/upload/document` - Upload document

---

## 📋 API SUMMARY BY MODULE

| Module | Number of APIs |
|--------|----------------|
| Authentication & User Management | 12 |
| Job/Booking Management | 15 |
| Quote Management | 6 |
| Payment Management | 8 |
| Crew Management | 5 |
| Invoice Management | 4 |
| User Profile | 3 |
| Analytics & Reporting | 4 |
| **TOTAL CORE APIs** | **47** |

---

## 🔐 AUTHENTICATION REQUIREMENTS

All APIs (except login/register) require:
- **Authorization Header**: `Bearer <access_token>`
- **Token Refresh**: Implement JWT refresh token mechanism

---

## 📊 RESPONSE FORMAT (Standard)

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

## 🎯 PRIORITY IMPLEMENTATION ORDER

### Phase 1 (Critical - Week 1)
1. Authentication APIs (12)
2. Job Creation & Retrieval (5)
3. Quote Management (6)

### Phase 2 (High Priority - Week 2)
4. Payment Management (8)
5. Job Status Updates (5)
6. Crew Assignment (3)

### Phase 3 (Medium Priority - Week 3)
7. Invoice Management (4)
8. Job Photos & Documentation (3)
9. User Profile (3)

### Phase 4 (Nice to Have - Week 4)
10. Analytics & Reporting (4)
11. Job Cancellation (2)
12. Real-time Features (WebSocket)

---

## 🔄 WORKFLOW API SEQUENCE

### Complete Job Lifecycle:

1. **Client Books Job**: `POST /api/jobs/create`
2. **Admin Creates Quote**: `POST /api/quotes/:jobId/create`
3. **Client Accepts Quote**: `POST /api/quotes/:jobId/accept` (Price Locked)
4. **Client Pays Deposit**: `POST /api/payments/deposit`
5. **Admin Assigns Crew**: `POST /api/crew/assign`
6. **Crew Starts Job**: `PATCH /api/jobs/:jobId/start`
7. **Crew Uploads Photos**: `POST /api/jobs/:jobId/photos`
8. **Crew Completes Job**: `PATCH /api/jobs/:jobId/complete`
9. **Admin Verifies Job**: `PATCH /api/jobs/:jobId/verify`
10. **Client Pays Final Amount**: `POST /api/payments/final`
11. **Admin Generates Invoice**: `POST /api/invoices/:jobId/generate`

---

## 💾 DATABASE TABLES NEEDED

1. **users** - All user types (client, crew, admin, sales, management)
2. **jobs** - Job/booking records
3. **quotes** - Quote details
4. **payments** - Payment transactions
5. **invoices** - Generated invoices
6. **job_photos** - Before/after photos
7. **job_status_history** - Status change audit trail
8. **crew_assignments** - Crew-job mappings
9. **notifications** - User notifications
10. **analytics_cache** - Cached analytics data

---

## 🚨 CRITICAL NOTES

1. **Price Locking**: Once client accepts quote, price CANNOT be modified
2. **Payment Flow**: Deposit → Work → Final Payment → Invoice
3. **Photo Proof**: Required for job completion verification
4. **SLA Tracking**: Track response time and completion time
5. **Refund Policy**: Calculate refund based on cancellation timing
6. **Role-Based Access**: Strict permission checks on all APIs
7. **Audit Trail**: Log all status changes with timestamp and user

---

## 📱 MOBILE APP CONSIDERATIONS

- All APIs should support mobile clients
- Implement image compression for photo uploads
- Support offline mode for crew app (sync when online)
- Push notifications for status updates
- GPS tracking for crew location

---

## 🔧 TECHNICAL REQUIREMENTS

- **Framework**: Node.js/Express or Python/FastAPI
- **Database**: PostgreSQL or MongoDB
- **Authentication**: JWT tokens
- **File Storage**: AWS S3 or similar
- **Payment Gateway**: Stripe/PayPal integration
- **Email Service**: SendGrid/AWS SES
- **SMS Service**: Twilio
- **Real-time**: Socket.io or WebSocket

---

**END OF API DOCUMENTATION**
