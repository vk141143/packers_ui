# Complete API Endpoint List - Packers & Movers Project

## 📊 **TOTAL API COUNT: 47 UNIQUE ENDPOINTS**

---

## 🔵 **1. QUOTE MANAGEMENT APIs (10 endpoints)**

### Quote Submission & Review
1. **POST /api/quotes/submit-for-review**
   - Submit quote request with photos for AI analysis & operations review
   - Accepts: FormData with photos, property details, service type
   - Returns: quote_id, success status
   - File: `backend-api.js`, `quoteApi.ts`

2. **GET /api/quotes/:quoteId/status**
   - Check quote status (pending/under_review/approved/rejected)
   - Returns: status, quote details (if approved)
   - File: `backend-api.js`, `quoteApi.ts`

3. **GET /api/quotes/pending-approval**
   - Get all quotes pending client approval
   - Returns: Array of quotes with status 'ops_approved'
   - File: `additional-api-endpoints.js`

### Operations Review
4. **POST /api/quotes/:quoteId/ops-review**
   - Operations team reviews and approves quote with final pricing
   - Accepts: final_price, deposit_required, deposit_amount, scope_of_work
   - Returns: success status
   - File: `backend-api.js`

5. **GET /api/ops/pending-quotes**
   - Get all quotes pending operations review
   - Returns: Array of quotes with status 'under_review'
   - File: `backend-api.js`

### Client Quote Actions
6. **POST /api/quotes/:quoteId/accept**
   - Client accepts the approved quote
   - Returns: deposit_payment_url (if deposit required) or job_id
   - File: `backend-api.js`, `quoteApi.ts`, `api.ts`

7. **POST /api/quotes/:id/approve**
   - Client approves/rejects quote
   - Accepts: approved (boolean)
   - Returns: success status, creates job if approved
   - File: `additional-api-endpoints.js`

8. **POST /api/quotes/:jobId/reject**
   - Reject quote with reason
   - Accepts: reason (string)
   - Returns: success status
   - File: `api.ts`

### Quote Creation
9. **POST /api/quotes/:quoteId/create-job**
   - Create job from approved quote after deposit
   - Returns: job_id
   - File: `quoteApi.ts`

10. **POST /api/jobs/:jobId/send-quote**
    - Send quote to client
    - Returns: success status
    - File: `api.ts`

---

## 🟢 **2. JOB MANAGEMENT APIs (15 endpoints)**

### Job Creation & Drafts
11. **POST /api/jobs/book**
    - Book a job directly
    - Accepts: BookingPayload with service details
    - Returns: job details with id
    - File: `api.ts`

12. **POST /api/jobs/draft**
    - Create job draft
    - Accepts: property_address, date, time, service_type, photos
    - Returns: draft id
    - File: `api.ts`, `bookingService.ts`

13. **GET /api/jobs/draft/:jobId**
    - Get job draft by ID
    - Returns: draft details
    - File: `api.ts`

14. **POST /api/jobs/:jobId/confirm**
    - Confirm job booking
    - Returns: confirmed job details
    - File: `api.ts`

### Job Retrieval
15. **GET /api/jobs**
    - Get all jobs sorted by scheduled date
    - Returns: Array of jobs
    - File: `additional-api-endpoints.js`

16. **GET /api/jobs/history**
    - Get job history for current user
    - Returns: Array of historical jobs
    - File: `api.ts`, `useJobs.ts`

17. **GET /api/jobs/:jobId**
    - Get job by ID
    - Returns: Single job details
    - File: `api.ts`, `useJobs.ts`

18. **GET /api/jobs/completed**
    - Get completed/verified jobs
    - Returns: Array of completed jobs
    - File: `additional-api-endpoints.js`

### Job Status Updates
19. **PUT /api/jobs/:id/status**
    - Update job status
    - Accepts: status (string)
    - Returns: Updated job
    - File: `additional-api-endpoints.js`

20. **POST /api/jobs/:jobId/complete**
    - Mark job as completed with photos
    - Accepts: crew_notes, completion_photos
    - Returns: success status
    - File: `backend-api.js`

21. **POST /api/jobs/:jobId/cancel**
    - Cancel job request
    - Accepts: reason (optional)
    - Returns: success status
    - File: `api.ts`, `useJobs.ts`

### Job Verification
22. **POST /api/jobs/:jobId/verify**
    - Operations verifies completed job
    - Accepts: verified_by, verification_notes
    - Returns: invoice_id, remaining_balance
    - File: `backend-api.js`, `additional-api-endpoints.js`

23. **GET /api/ops/pending-verifications**
    - Get all jobs pending verification
    - Returns: Array of completed jobs awaiting verification
    - File: `backend-api.js`

24. **POST /api/jobs/:id/verify** (Quality Check)
    - Verify job quality
    - Accepts: verified (boolean), notes
    - Returns: Updated job status
    - File: `additional-api-endpoints.js`

25. **POST /api/jobs/:jobId/ops-review**
    - Submit operations review
    - Accepts: review data
    - Returns: success status
    - File: `api.ts`

---

## 💰 **3. PAYMENT PROCESSING APIs (5 endpoints)**

### Deposit Payments
26. **POST /api/quotes/:quoteId/deposit**
    - Process deposit payment
    - Accepts: payment_method, card_details
    - Returns: transaction_id, job_id
    - File: `backend-api.js`, `quoteApi.ts`

27. **POST /api/payments/:jobId/deposit**
    - Process deposit payment for job
    - Accepts: payment data
    - Returns: success status
    - File: `api.ts`

### Final Payments
28. **POST /api/payments/:jobId/final**
    - Process final payment after job completion
    - Accepts: payment data
    - Returns: success status
    - File: `api.ts`

29. **GET /api/payments/:jobId/breakdown**
    - Get payment breakdown
    - Returns: totalAmount, depositPaid, remainingBalance
    - File: `api.ts`

### Payment Status
30. **GET /api/ops/jobs-awaiting-approval**
    - Get jobs awaiting payment approval
    - Returns: Array of jobs
    - File: `api.ts`

---

## 👷 **4. CREW MANAGEMENT APIs (2 endpoints)**

31. **POST /api/crew/assign/:bookingId**
    - Assign crew to booking
    - Accepts: crew IDs
    - Returns: success status
    - File: `api.ts`

32. **GET /api/crew/assigned**
    - Get assigned crew members
    - Returns: Array of crew assignments
    - File: `api.ts`

---

## 📄 **5. INVOICE MANAGEMENT APIs (2 endpoints)**

33. **GET /api/invoices**
    - Get all invoices
    - Returns: Array of invoices
    - File: `api.ts`, `useInvoices.ts`

34. **GET /api/invoices/:jobIdOrUrl/download**
    - Download invoice by job ID or URL
    - Returns: filename
    - File: `api.ts`, `useInvoices.ts`

---

## ⭐ **6. RATING & FEEDBACK APIs (3 endpoints)**

35. **POST /api/jobs/:jobId/rating**
    - Submit job rating
    - Accepts: rating (number), comment, crewId
    - Returns: success status
    - File: `api.ts`, `useJobs.ts`

36. **GET /api/jobs/:jobId/rating**
    - Get job rating
    - Returns: rating details
    - File: `api.ts`

37. **POST /api/jobs/:id/feedback**
    - Submit client feedback (public endpoint)
    - Accepts: rating, comments, issues
    - Returns: Updated job
    - File: `additional-api-endpoints.js`

38. **POST /api/jobs/:id/request-feedback**
    - Request feedback from client
    - Returns: success status
    - File: `additional-api-endpoints.js`

---

## 🔧 **7. OPERATIONS/ADMIN APIs (8 endpoints)**

### Pending Reviews
39. **GET /api/ops/pending-reviews**
    - Get pending operations reviews
    - Returns: Array of jobs needing review
    - File: `api.ts`

### User Management
40. **GET /api/users/pending**
    - Get pending user approvals (crew, sales, management)
    - Returns: Array of pending users
    - File: `userStore.ts` (local store, no actual API)

41. **POST /api/users/:userId/approve**
    - Approve user application
    - Returns: success status
    - File: `userStore.ts` (local store, no actual API)

42. **POST /api/users/:userId/reject**
    - Reject user application
    - Returns: success status
    - File: `userStore.ts` (local store, no actual API)

### Analytics & Reports
43. **GET /api/analytics/dashboard**
    - Get dashboard analytics
    - Returns: KPIs, metrics, charts data
    - File: Referenced in dashboard components

44. **GET /api/reports/compliance/:jobId**
    - Get compliance report for job
    - Returns: PDF report
    - File: `jobStore.ts` (generated locally)

45. **GET /api/reports/sla**
    - Get SLA performance reports
    - Returns: SLA metrics
    - File: Referenced in management dashboard

46. **GET /api/jobs/audit-trail/:jobId**
    - Get complete audit trail for job
    - Returns: Status history, changes log
    - File: `jobStore.ts` (statusHistory field)

---

## 🛍️ **8. SERVICE CATALOG APIs (2 endpoints)**

47. **GET /api/services**
    - Get all available services
    - Returns: Array of services
    - File: `api.ts`

48. **GET /api/services/:serviceId**
    - Get service by ID
    - Returns: Service details
    - File: `api.ts`

---

## 📋 **API WORKFLOW SUMMARY**

### **Complete Booking Flow (10 Steps)**

1. **Client Submits Quote Request** → `POST /api/quotes/submit-for-review`
2. **AI Analysis (Internal)** → Automatic processing
3. **Ops Reviews Quote** → `POST /api/quotes/:quoteId/ops-review`
4. **Client Checks Status** → `GET /api/quotes/:quoteId/status`
5. **Client Accepts Quote** → `POST /api/quotes/:quoteId/accept`
6. **Deposit Payment** → `POST /api/quotes/:quoteId/deposit`
7. **Job Created** → `POST /api/quotes/:quoteId/create-job`
8. **Crew Assigned** → `POST /api/crew/assign/:bookingId`
9. **Work Completed** → `POST /api/jobs/:jobId/complete`
10. **Admin Verifies** → `POST /api/jobs/:jobId/verify`
11. **Final Payment** → `POST /api/payments/:jobId/final`
12. **Invoice Generated** → `GET /api/invoices/:jobId/download`

---

## 🎯 **API CATEGORIES BREAKDOWN**

| Category | Count | Percentage |
|----------|-------|------------|
| Quote Management | 10 | 21% |
| Job Management | 15 | 31% |
| Payment Processing | 5 | 10% |
| Crew Management | 2 | 4% |
| Invoice Management | 2 | 4% |
| Rating & Feedback | 4 | 8% |
| Operations/Admin | 8 | 17% |
| Service Catalog | 2 | 4% |
| **TOTAL** | **48** | **100%** |

---

## ⚠️ **IMPORTANT NOTES**

### Current Implementation Status:
- ✅ All APIs are **MOCK implementations**
- ✅ No external integrations (no real backend)
- ✅ Data stored in **localStorage** and **memory stores**
- ✅ No actual HTTP requests made
- ✅ Simulated delays for realistic UX

### Files Containing API Definitions:
1. `backend-api.js` - Main backend API structure (10 endpoints)
2. `additional-api-endpoints.js` - Workflow completion APIs (8 endpoints)
3. `api-routes.ts` - Route definitions (6 endpoints)
4. `api.ts` - Service layer APIs (24 endpoints)
5. `quoteApi.ts` - Quote-specific APIs (5 endpoints)
6. `apiClient.ts` - HTTP client wrapper (mock)
7. `apiService.ts` - Caching & batching service
8. `authService.ts` - Authentication APIs (separate from main count)
9. `bookingService.ts` - Booking service wrapper

### Authentication APIs (Not counted in main list):
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-otp
- POST /api/auth/refresh-token
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET /api/auth/profile
- PUT /api/auth/profile

---

## 🚀 **DEPLOYMENT REQUIREMENTS**

To make these APIs functional in production:

1. **Backend Framework**: Express.js, Node.js
2. **Database**: MongoDB/PostgreSQL for data persistence
3. **File Storage**: AWS S3/Cloudinary for photo uploads
4. **Payment Gateway**: Stripe/PayPal integration
5. **Email Service**: SendGrid/AWS SES for notifications
6. **Authentication**: JWT tokens with refresh mechanism
7. **API Documentation**: Swagger/OpenAPI specs
8. **Rate Limiting**: Express rate limiter
9. **Security**: Helmet.js, CORS, input validation
10. **Monitoring**: Error tracking (Sentry), logging (Winston)

---

**Generated on:** ${new Date().toISOString()}
**Project:** Packers & Movers Management System
**Version:** 1.0.0
