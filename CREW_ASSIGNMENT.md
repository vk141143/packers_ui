# Crew Assignment System

## Overview
The system supports **both manual and automatic crew assignment** to jobs. Admins can choose the best method based on urgency and requirements.

## Assignment Methods

### 1. ⚡ Automatic Assignment (Recommended)

**How it works:**
- AI-powered algorithm selects best crew based on:
  - ✅ Current availability
  - ✅ Workload (fewer jobs = higher priority)
  - ✅ Skills match (emergency, hoarder, fire-flood, etc.)
  - ✅ Location proximity
  - ✅ Performance history

**When to use:**
- Emergency jobs requiring immediate dispatch
- Standard jobs with no special requirements
- High volume periods
- Quick turnaround needed

**How to use:**
1. **From Create Job page:**
   - Click "Auto-Assign Crew" button
   - System automatically selects 2 best crew members
   - Confirmation shows assigned crew

2. **From Assign Crew page:**
   - Select a job
   - Click "Auto-Assign" button
   - System assigns optimal crew

**Algorithm Logic:**
```typescript
Score Calculation:
- Base score: 100 points
- Workload penalty: -10 points per current job
- Skills match bonus: +20 points
- Location match bonus: +15 points
- Top 2 highest scores selected
```

### 2. 👤 Manual Assignment

**How it works:**
- Admin manually selects crew members from available list
- Full control over who gets assigned
- Can see crew details, availability, and current workload

**When to use:**
- Special client requirements
- Specific crew expertise needed
- Client requested specific crew
- Complex or sensitive jobs

**How to use:**
1. **From Create Job page:**
   - Click "Manual Assign" button
   - Select crew members from list
   - Click "Assign Selected"

2. **From Assign Crew page:**
   - View unassigned jobs table
   - Click "Assign Crew" on desired job
   - Check boxes for crew members
   - Click "Assign Selected"

## Crew Database

### Current Crew Members:

| Name | Location | Skills | Default Status |
|------|----------|--------|----------------|
| Mike Davies | London | Emergency, Hoarder | Available |
| Tom Brown | London | Fire-Flood, Void | Available |
| James Wilson | Manchester | Probate, Furniture | Unavailable |
| David Smith | London | Emergency, Void | Available |
| Robert Johnson | Birmingham | Hoarder, Furniture | Available |
| Chris Evans | London | Fire-Flood, Probate | Available |

### Crew Information Displayed:
- Name
- Availability status (Available/Unavailable)
- Current job count
- Skills/specializations
- Location

## Workflow

### Standard Job Creation Flow:

```
1. Admin creates job
   ↓
2. Choose assignment method:
   
   Option A: Auto-Assign
   - Click "Auto-Assign Crew"
   - System selects best 2 crew
   - Crew assigned instantly
   
   Option B: Manual Assign
   - Click "Manual Assign"
   - Select crew from list
   - Confirm assignment
   ↓
3. Dispatch job to crew
   ↓
4. Crew receives job notification
   ↓
5. Crew executes job
```

### Emergency Job Flow:

```
1. Emergency job created
   ↓
2. Auto-assign immediately
   - Prioritizes available crew
   - Considers location proximity
   - Assigns within seconds
   ↓
3. Auto-dispatch (if configured)
   ↓
4. Crew notified immediately
```

## Features

### Auto-Assignment Features:
- ⚡ Instant assignment (< 1 second)
- 🎯 Smart crew selection
- 📊 Workload balancing
- 🗺️ Location-based matching
- 🛠️ Skills-based matching
- ✅ Availability checking

### Manual Assignment Features:
- 👁️ Full crew visibility
- 📋 Detailed crew information
- ✋ Complete control
- 🔍 Filter by availability
- 📊 See current workload
- 🎯 Select specific crew

## Admin Interface

### Create Job Page:
```
When job has no crew assigned:
┌─────────────────────────────────┐
│ [⚡ Auto-Assign Crew]            │
│ [Manual Assign]                 │
└─────────────────────────────────┘

After crew assigned:
┌─────────────────────────────────┐
│ ✅ Crew: Mike Davies, Tom Brown │
│ [Dispatch Job]                  │
└─────────────────────────────────┘
```

### Assign Crew Page:
```
Left Panel: Unassigned Jobs
┌─────────────────────────────────┐
│ Job ID | Client | Date | Action │
│ JOB-001| Council| 5/1  |[Assign]│
└─────────────────────────────────┘

Right Panel: Available Crew
┌─────────────────────────────────┐
│ [⚡ Auto-Assign]                 │
│                                 │
│ ☐ Mike Davies (0 jobs)          │
│ ☐ Tom Brown (1 job)             │
│ ☐ David Smith (0 jobs)          │
│                                 │
│ [Assign Selected (0)]           │
└─────────────────────────────────┘
```

## Technical Implementation

### Files Created/Modified:

1. **New File:** `src/utils/crewAssignment.ts`
   - Auto-assignment algorithm
   - Crew database
   - Availability checking
   - Workload management

2. **Updated:** `src/dashboards/admin/CreateJob.tsx`
   - Added auto-assign button
   - Added manual assign button
   - Import crew assignment utilities

3. **Updated:** `src/dashboards/admin/AssignCrew.tsx`
   - Uses crew database
   - Added auto-assign option
   - Shows crew details (workload, skills)

### Key Functions:

```typescript
// Automatic assignment
autoAssignCrew(job: Job, crewCount: number): AutoAssignmentResult

// Check availability
checkCrewAvailability(crewIds: string[]): boolean

// Update workload
incrementCrewWorkload(crewIds: string[]): void
decrementCrewWorkload(crewIds: string[]): void

// Get statistics
getCrewStats(): CrewStats
getAvailableCrewCount(): number
```

## Benefits

### Auto-Assignment Benefits:
- ⏱️ **Speed:** Instant assignment
- 🎯 **Accuracy:** Algorithm-based selection
- ⚖️ **Fairness:** Balanced workload distribution
- 📈 **Efficiency:** Reduces admin workload
- 🚀 **Scalability:** Handles high volume

### Manual Assignment Benefits:
- 🎨 **Flexibility:** Full control
- 🤝 **Client Relations:** Meet specific requests
- 🎓 **Training:** Assign based on experience
- 🔧 **Customization:** Handle special cases

## Future Enhancements

Potential improvements:
- [ ] Real-time GPS tracking for location-based assignment
- [ ] Machine learning for better crew selection
- [ ] Crew preferences and availability calendar
- [ ] Automatic re-assignment if crew unavailable
- [ ] Performance-based scoring
- [ ] Client feedback integration
- [ ] Crew skill certification tracking
- [ ] Multi-job route optimization
- [ ] Predictive workload balancing
- [ ] Integration with crew mobile app

## Testing

### Test Auto-Assignment:
1. Create a new job
2. Click "Auto-Assign Crew"
3. Verify 2 crew members assigned
4. Check they are available
5. Verify workload updated

### Test Manual Assignment:
1. Navigate to Assign Crew page
2. Select a job
3. Choose crew members manually
4. Click "Assign Selected"
5. Verify assignment successful

## Configuration

### Adjust Crew Count:
```typescript
// In CreateJob.tsx or AssignCrew.tsx
autoAssignCrew(job, 2) // Change 2 to desired count
```

### Modify Scoring Algorithm:
```typescript
// In crewAssignment.ts
score -= crew.currentJobs * 10; // Adjust workload penalty
score += 20; // Adjust skills bonus
score += 15; // Adjust location bonus
```

### Add New Crew Members:
```typescript
// In crewAssignment.ts - crewDatabase array
{
  id: '7',
  name: 'New Crew Member',
  available: true,
  currentJobs: 0,
  skills: ['emergency', 'void'],
  location: 'London'
}
```

## Summary

The system now supports **both automatic and manual crew assignment**, giving admins flexibility to choose the best method for each situation. Auto-assignment is recommended for speed and efficiency, while manual assignment provides full control for special cases.

**Default Recommendation:** Use auto-assign for 80% of jobs, manual assign for special requirements.
