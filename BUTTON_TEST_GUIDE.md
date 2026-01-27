# ✅ Button Functionality Test Guide

## How to Test the Workflow Buttons

### Setup:
1. Start the dev server: `npm run dev`
2. Navigate to Crew Dashboard
3. Click on JOB-001 (Westminster Council - Emergency Clearance)

---

## Test Each Button in Order:

### ✅ Step 1: "I've Arrived at Pickup" Button
**Status:** `dispatched` → `at-pickup`
- **Location:** Blue card with MapPin icon
- **Action:** Click button
- **Expected:** 
  - Status changes to "At Pickup" (cyan badge)
  - Green checkmark appears: "Arrived at pickup location"
  - Camera upload section appears

---

### ✅ Step 2: "Take Before Photos" Button
**Status:** `at-pickup` (stays same)
- **Location:** Blue card with Camera icon
- **Action:** Click "Take Before Photos" → Select images
- **Expected:**
  - Green checkmark: "X photo(s) captured"
  - "Start Packing" button appears

---

### ✅ Step 3: "Start Packing" Button
**Status:** `at-pickup` → `packing`
- **Location:** Appears after photos uploaded
- **Action:** Click button
- **Expected:**
  - Status changes to "Packing" (yellow badge)
  - Timer starts (00:00:00)
  - Yellow card shows "Step 3: Packing Items"
  - "All Items Loaded - Start Transit" button appears

---

### ✅ Step 4: "All Items Loaded - Start Transit" Button
**Status:** `packing` → `in-transit`
- **Location:** Yellow card with Package icon
- **Action:** Click button
- **Expected:**
  - Status changes to "In Transit" (purple badge)
  - Purple card shows "Step 4: In Transit to Delivery"
  - Timer continues running
  - Shows crew names: "Mike Davies, Tom Brown"
  - "Arrived at Delivery Location" button appears

---

### ✅ Step 5: "Arrived at Delivery Location" Button
**Status:** `in-transit` → `at-delivery`
- **Location:** Purple card with Truck icon
- **Action:** Click button
- **Expected:**
  - Status changes to "At Delivery" (indigo badge)
  - Green checkmark: "Arrived at delivery location"
  - Blue card shows "Step 5: Start Unloading"
  - "Start Unloading" button appears

---

### ✅ Step 6: "Start Unloading" Button
**Status:** `at-delivery` → `unloading`
- **Location:** Blue card with Package icon
- **Action:** Click button
- **Expected:**
  - Status changes to "Unloading" (orange badge)
  - Yellow card shows "Step 6: Unloading Items"
  - Timer continues running
  - "Take After Photos" button appears

---

### ✅ Step 7: "Take After Photos" Button
**Status:** `unloading` (stays same)
- **Location:** Yellow card with Camera icon
- **Action:** Click "Take After Photos" → Select images
- **Expected:**
  - Green checkmark: "X after photo(s) captured"
  - "Complete Job" button appears

---

### ✅ Step 8: "Complete Job" Button
**Status:** `unloading` → `completed`
- **Location:** Appears after after photos uploaded
- **Action:** Click button
- **Expected:**
  - Status changes to "Completed" (green badge)
  - Alert shows:
    - "✅ Job Completed!"
    - Total time taken
    - "The SAME crew (Mike Davies, Tom Brown) handled pickup and delivery"
  - Redirects to Crew Dashboard
  - Green card shows "✅ Job Completed!"

---

## Quick Test Checklist:

- [ ] Button 1: "I've Arrived at Pickup" works
- [ ] Button 2: "Take Before Photos" works
- [ ] Button 3: "Start Packing" works
- [ ] Button 4: "All Items Loaded - Start Transit" works
- [ ] Button 5: "Arrived at Delivery Location" works
- [ ] Button 6: "Start Unloading" works
- [ ] Button 7: "Take After Photos" works
- [ ] Button 8: "Complete Job" works
- [ ] Timer starts at packing and continues through transit/unloading
- [ ] Status badge updates at each step
- [ ] Crew names displayed during transit
- [ ] Same crew confirmation shown at completion

---

## Visual Indicators:

### Status Badge Colors:
- Gray = Created
- Blue = Dispatched
- Cyan = At Pickup
- Yellow = Packing
- Purple = In Transit
- Indigo = At Delivery
- Orange = Unloading
- Green = Completed

### Progress Indicators:
- ✅ Green checkmarks for completed steps
- ⏱️ Timer running during packing/transit/unloading
- 📸 Photo counts displayed
- 👥 Crew names shown during transit

---

## Troubleshooting:

### If buttons don't work:
1. Check browser console for errors
2. Verify job status in React DevTools
3. Ensure jobStore.updateJobStatus is being called
4. Check that Button component has onClick prop

### If status doesn't update:
1. Verify jobStore.notify() is called
2. Check useEffect subscription in JobDetails
3. Ensure StatusBadge has all status configs

### If timer doesn't start:
1. Verify startTime is set when packing begins
2. Check useEffect timer interval
3. Ensure status is 'packing', 'in-transit', or 'unloading'

---

## Success Criteria:

✅ All 8 buttons work in sequence
✅ Status updates at each step
✅ Timer tracks total duration
✅ Photos can be uploaded
✅ Same crew confirmation shown
✅ Redirects to dashboard on completion

---

## Notes:

- Cannot skip steps - must follow order
- Before photos required before packing
- After photos required before completion
- Timer continues through transit and unloading
- Same crew tracked throughout entire workflow
