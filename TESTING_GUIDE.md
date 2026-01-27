# Testing Guide - SLA Visibility & Audit Enhancements

## 🧪 How to Test All Enhancements

### 1️⃣ SLA VISIBILITY TESTING

#### Admin Dashboard
1. Navigate to `/admin`
2. Look for **"SLA Status"** column in jobs table
3. Verify color coding:
   - 🟢 Green = "SLA Met" or "On Track"
   - 🟠 Orange = "At Risk" (< 6 hours)
   - 🔴 Red = "SLA Breached"
4. Check that **"SLA Timer"** column still shows countdown

#### Client Dashboard
1. Navigate to `/client`
2. View active jobs table
3. Verify **"SLA Status"** column is visible (read-only)
4. Confirm client cannot edit SLA data

#### SLA Monitoring Page
1. Navigate to `/admin/sla`
2. Check enhanced status badges with borders
3. Verify "on_track/at_risk/breached" labels
4. Confirm critical jobs alert shows correctly

---

### 2️⃣ AUDIT TIMELINE TESTING

#### Job Detail View
1. Navigate to `/admin` and click any job
2. Scroll to **"📋 Job Audit Timeline"** section
3. Verify timeline shows:
   - ✅ Job Created (with timestamp)
   - ✅ Dispatched (with crew names)
   - ✅ Crew Started
   - ✅ Checklist Completed
   - ✅ Evidence Uploaded
   - ✅ Job Completed
   - ✅ Report Generated
   - ✅ Invoice Generated
4. Check that each event has:
   - Icon (FileText, Send, Play, Camera, etc.)
   - Timestamp in UK format
   - Actor name
   - Description
5. Verify **"⚠️ Timeline is read-only"** warning at bottom

---

### 3️⃣ CREW ACCOUNTABILITY TESTING

#### Job Detail View
1. Navigate to any job with assigned crew
2. Look for **"👥 Crew Accountability"** section
3. Verify it shows:
   - **Assigned Crew:** Badge list of crew members
   - **Executed by:** Name from checklist completion
   - **Evidence uploaded by:** Names from photo uploads
4. Confirm data is read-only (no edit buttons)

#### Client Reports View
1. Navigate to `/client/reports`
2. Check completed jobs show crew names
3. Verify crew accountability is visible to clients

---

### 4️⃣ REPORT DEFENSIBILITY TESTING

#### Client Reports & Invoices
1. Navigate to `/client/reports`
2. Find completed jobs section
3. For each job, verify display shows:
   - ✅ **Immutable Reference ID** (e.g., UK-PROP-2024-003-VOID)
   - ✅ **SLA Status Badge** (Met/Breached with color)
   - ✅ **Service Type**
   - ✅ **SLA Type** (24h/48h/standard)
   - ✅ **Completion Timestamp** (UK format)
   - ✅ **Crew Names**
   - ✅ **Risk Flags** (if applicable)
4. Check for three download buttons:
   - Report (if generated)
   - Invoice (if invoiced)
   - **Compliance Pack** (Report + Invoice bundle)
5. Verify **"⚠️ All reports are auto-generated and read-only"** disclaimer

---

### 5️⃣ BILLING TRANSPARENCY TESTING

#### Invoice Table
1. Navigate to `/client/reports`
2. Scroll to **"💷 Invoice History"** section
3. Check header shows **"🔒 Read-Only"** badge
4. Verify blue info box explains billing transparency
5. For each invoice, check **"Line Items"** column shows:
   - Base cost (with property size)
   - Emergency premium (if applicable)
   - SLA charge (24h/48h commitment)
   - Risk surcharge (with risk flags)
   - Manual adjustment (with reason, if present)
6. Verify **"Job Reference"** column uses immutable ID

#### Example Invoice (INV-002):
```
Line Items:
- fire-flood-moveout - L property: £2,000
- Emergency response premium: £1,000
- Risk surcharge (fire-damage): £400
- 48h SLA commitment: £300
- Adjustment: Client loyalty discount: -£250
Total: £3,150
```

---

### 6️⃣ CLIENT PORTAL SAFETY TESTING

#### Read-Only Verification
1. Log in as **Client** role
2. Navigate through all client pages
3. Verify client CANNOT:
   - ❌ Edit SLA deadlines
   - ❌ Modify job status
   - ❌ Change crew assignments
   - ❌ Adjust invoice amounts
   - ❌ Edit audit timeline
   - ❌ Trigger admin actions

#### Can View (Read-Only)
1. Verify client CAN view:
   - ✅ SLA status for all jobs
   - ✅ Job completion confirmations
   - ✅ Audit timeline (if visible)
   - ✅ Crew names
   - ✅ Invoice line items
   - ✅ Compliance pack downloads

---

## 🎯 QUICK TEST SCENARIOS

### Scenario 1: Emergency Job with SLA At Risk
1. Find job with < 6 hours to deadline
2. Check it shows **Orange "At Risk"** badge
3. Verify SLA timer shows critical countdown
4. Confirm it appears in urgent alerts

### Scenario 2: Completed Job with SLA Met
1. Find completed job (JOB-003)
2. Check it shows **Green "SLA Met"** badge
3. Verify audit timeline is complete
4. Check report and invoice are available
5. Download compliance pack

### Scenario 3: Invoice with Manual Adjustment
1. View invoice INV-002
2. Check line items show adjustment
3. Verify reason is displayed: "Client loyalty discount"
4. Confirm adjusted by "Sarah Johnson"
5. Check total reflects adjustment

### Scenario 4: Crew Accountability Chain
1. Open job with crew assigned
2. Check "Assigned Crew" shows names
3. Verify "Executed by" matches checklist completion
4. Confirm "Evidence uploaded by" matches photo uploads
5. Check timeline shows crew actions

---

## 🔍 VALIDATION CHECKLIST

### SLA Status
- [ ] Green badge for on-track jobs
- [ ] Orange badge for at-risk jobs (< 6h)
- [ ] Red badge for breached jobs
- [ ] Status is immutable after completion
- [ ] Visible in all dashboards

### Audit Timeline
- [ ] Shows all 8 event types
- [ ] Timestamps in UK format (en-GB)
- [ ] Actor names displayed
- [ ] Icons render correctly
- [ ] Read-only warning present
- [ ] Cannot be edited

### Crew Accountability
- [ ] Assigned crew visible
- [ ] Executor identified
- [ ] Evidence uploaders listed
- [ ] Data is read-only
- [ ] Visible to clients

### Report Defensibility
- [ ] Immutable reference ID shown
- [ ] SLA outcome displayed
- [ ] Risk flags listed
- [ ] Crew names visible
- [ ] Compliance pack downloadable
- [ ] Auto-generated disclaimer present

### Billing Transparency
- [ ] Line items breakdown visible
- [ ] Base cost explained
- [ ] Premiums itemized
- [ ] Risk surcharges justified
- [ ] Manual adjustments documented
- [ ] Locked status indicated

### Client Safety
- [ ] No edit capabilities
- [ ] No action triggers
- [ ] Read-only SLA data
- [ ] Safe for live demo
- [ ] Clear visual indicators

---

## 🐛 KNOWN LIMITATIONS

1. **Mock Data Only**: Currently using static mock data
2. **No Real-Time Updates**: SLA status updates on page refresh
3. **No PDF Generation**: Download buttons show alerts (not implemented)
4. **No Email Notifications**: SLA alerts are visual only

---

## 📝 DEMO SCRIPT FOR UK COUNCIL

### Opening (Admin View)
1. Show admin dashboard with SLA status column
2. Highlight color-coded badges (green/orange/red)
3. Click on a job to show audit timeline
4. Point out crew accountability section

### Middle (Client View)
1. Switch to client portal
2. Show read-only SLA visibility
3. Navigate to Reports & Invoices
4. Demonstrate compliance pack download
5. Show detailed invoice line items

### Closing (SLA Monitoring)
1. Navigate to SLA monitoring page
2. Show real-time status tracking
3. Highlight critical jobs alert
4. Emphasize audit-ready features

### Key Talking Points:
- ✅ "All SLA data is auto-calculated and immutable"
- ✅ "Complete audit trail from creation to invoice"
- ✅ "Full crew accountability at every stage"
- ✅ "Transparent billing with line-item breakdown"
- ✅ "Client-safe portal with read-only access"
- ✅ "Compliance pack for regulatory requirements"

---

## 🚀 SUCCESS CRITERIA

✅ **System is audit-ready**
✅ **SLA compliance is visible at all levels**
✅ **Crew accountability is tracked**
✅ **Billing is transparent and justified**
✅ **Client portal is safe for live demo**
✅ **No new pages or UI redesign**
✅ **All data is read-only where appropriate**
✅ **UK council demo-ready**
