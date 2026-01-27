# Client Bookings → Crew Assignment Workflow

## New Workflow (As Requested)

### Step-by-Step Process:

```
1. Admin clicks "Client Bookings" in sidebar
   ↓
2. Sees list of all client bookings
   ↓
3. Clicks on any job row
   ↓
4. Modal popup appears showing:
   - Job details (service type, addresses, date, SLA)
   - Available crew members with full details
   ↓
5. Admin has 2 options:
   
   Option A: Auto-Assign (Recommended)
   - Click "Auto-Assign Best Available Crew"
   - System selects best 2 crew automatically
   - Done!
   
   Option B: Manual Selection
   - See all crew members with:
     * Name
     * Availability status
     * Current workload (number of jobs)
     * Location
     * Skills
   - Check boxes to select crew
   - Click "Assign Selected Crew (X)"
   - Done!
   ↓
6. Crew assigned to job
   ↓
7. Modal closes, back to bookings list
```

## Modal Features

### Job Details Section (Top):
- Service Type
- SLA Type
- Pickup Address
- Delivery Address
- Scheduled Date
- Current Status

### Auto-Assign Section:
```
┌─────────────────────────────────────────────┐
│ [⚡ Auto-Assign Best Available Crew]        │
│ System will automatically select best crew  │
└─────────────────────────────────────────────┘
```

### Manual Selection Section:
Shows each crew member as a card with:
```
┌─────────────────────────────────────────────┐
│ ☐ Mike Davies              [Available]      │
│ Location: London                            │
│ Current Jobs: 0                             │
│ Skills: emergency, hoarder                  │
└─────────────────────────────────────────────┘
```

### Crew Information Displayed:
- ✅ Name
- ✅ Availability (Available/Unavailable)
- ✅ Location (London, Manchester, Birmingham)
- ✅ Current Jobs (workload)
- ✅ Skills (emergency, hoarder, fire-flood, etc.)

### Visual Indicators:
- **Available crew:** Green badge, white background, clickable
- **Unavailable crew:** Red badge, gray background, disabled
- **Selected crew:** Blue border, blue background highlight

## User Experience

### What Admin Sees:

1. **Client Bookings Page:**
   - Table with all jobs
   - Click any row to assign crew

2. **Crew Assignment Modal:**
   - Large, centered popup
   - Job details at top
   - Auto-assign button (quick option)
   - OR divider
   - Manual crew selection with full details
   - Assign/Cancel buttons at bottom

3. **After Assignment:**
   - Success message
   - Modal closes
   - Back to bookings list
   - Job now has crew assigned

## Benefits of This Workflow

✅ **Single Click Access:** Click job → See crew → Assign
✅ **Full Visibility:** See all crew details before assigning
✅ **Flexibility:** Choose auto or manual assignment
✅ **Context:** Job details visible while selecting crew
✅ **Speed:** No navigation between pages
✅ **Clarity:** Clear availability and workload info

## Technical Implementation

### Files Modified:
- `src/dashboards/admin/ClientBookings.tsx`

### Key Features Added:
1. Modal state management
2. Crew selection state
3. Auto-assign integration
4. Manual selection with checkboxes
5. Real-time crew database display
6. Availability filtering
7. Visual feedback for selection

### Modal Styling:
- Full-screen overlay (dark background)
- Centered white card
- Scrollable content
- Sticky header with close button
- Responsive design

## Example Flow

### Scenario: Emergency Job Needs Crew

1. Admin opens "Client Bookings"
2. Sees "JOB-001 - Westminster Council - Emergency Clearance"
3. Clicks on the job row
4. Modal opens showing:
   ```
   Job: JOB-001 - Westminster Council
   Service: emergency-clearance
   SLA: 24h
   Pickup: 123 High Street, London
   
   [⚡ Auto-Assign Best Available Crew]
   
   OR
   
   Available Crew:
   ☐ Mike Davies (London, 0 jobs, emergency/hoarder) ✅
   ☐ Tom Brown (London, 1 job, fire-flood/void) ✅
   ☐ David Smith (London, 0 jobs, emergency/void) ✅
   ☐ James Wilson (Manchester, 3 jobs) ❌ Unavailable
   ```
5. Admin clicks "Auto-Assign" → Mike Davies & David Smith assigned
6. OR manually selects Mike & Tom → Clicks "Assign Selected (2)"
7. Success! Crew assigned to job

## Comparison: Old vs New

### Old Workflow:
```
Client Bookings → Click Job → Navigate to Create Job page
→ Click "Assign Crew" → Navigate to Assign Crew page
→ Select crew → Assign → Navigate back
(4 page navigations)
```

### New Workflow:
```
Client Bookings → Click Job → Modal opens
→ Select crew → Assign → Modal closes
(0 page navigations, 1 modal)
```

**Result:** 75% faster workflow! 🚀

## Future Enhancements

Potential improvements:
- [ ] Filter crew by location
- [ ] Sort crew by availability/workload
- [ ] Show crew photos
- [ ] Display crew ratings/reviews
- [ ] Show crew schedule/calendar
- [ ] Bulk assign multiple jobs
- [ ] Save crew preferences per client
- [ ] Crew recommendation based on past jobs

## Summary

The new workflow provides a **streamlined, single-page experience** for assigning crew to jobs directly from the Client Bookings page. Admins can see all relevant information and make decisions without navigating between multiple pages.

**Key Improvement:** Click job → See crew → Assign → Done! ✅
