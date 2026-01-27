# Auto-Assignment System

## Overview
Crew members are now **automatically assigned** using **smart algorithms** that consider availability, skills, location, and workload!

## Smart Assignment Features

✅ **Availability Checking** - Only assigns crew with <2 active jobs  
✅ **Skill Matching** - Matches crew expertise to job type  
✅ **Location-Based** - Prioritizes crew near property  
✅ **Workload Balancing** - Distributes jobs evenly  
✅ **Performance-Based** - Assigns best performers to urgent jobs  

## How It Works

### 1. Crew Database

Each crew member has:
- **Skills**: emergency, hoarder, fire-flood, void-turnover, general
- **Location**: London, Birmingham, Manchester
- **Performance Score**: 0-100 rating

**Example:**
```javascript
Mike Davies:
  Skills: emergency, fire-flood, general
  Location: London
  Performance: 95/100
```

### 2. Scoring Algorithm

Each crew member gets a score (0-100) based on:

| Factor | Points | Description |
|--------|--------|-------------|
| **Skill Match** | 40 | Has exact skill for job type |
| **Location** | 30 | Same city as property |
| **Performance** | 20 | Historical performance rating |
| **Workload** | 10 | Fewer current jobs = higher score |

**Example Calculation:**
```
Job: Emergency Clearance in London

Mike Davies:
  + 40 (has 'emergency' skill)
  + 30 (based in London)
  + 19 (95% performance)
  + 10 (0 current jobs)
  = 99 points ✅ SELECTED

David Smith:
  + 20 (only 'general' skill)
  + 0 (based in Manchester)
  + 17 (85% performance)
  + 5 (1 current job)
  = 42 points ❌ NOT SELECTED
```

### 3. Assignment Process

**Step 1:** Filter available crew (< 2 active jobs)  
**Step 2:** Score each crew member for this job  
**Step 3:** Sort by score (highest first)  
**Step 4:** Select top N crew (based on job size)  
**Step 5:** Assign to job  

### 4. Crew Size Logic

| Job Size | Crew Count |
|----------|------------|
| XL | 4 members |
| L | 3 members |
| M | 2 members |
| S | 2 members |

## Crew Skills Database

```javascript
Mike Davies (London):
  - Emergency Clearance ⚡
  - Fire/Flood Move-out 🔥
  - General 📦
  Performance: 95%

Tom Brown (London):
  - Hoarder Clean-out 🧹
  - Void Property Turnover 🏠
  - General 📦
  Performance: 88%

James Wilson (Birmingham):
  - Emergency Clearance ⚡
  - Void Property Turnover 🏠
  - General 📦
  Performance: 92%

David Smith (Manchester):
  - Hoarder Clean-out 🧹
  - Fire/Flood Move-out 🔥
  - General 📦
  Performance: 85%

Robert Johnson (London):
  - Emergency Clearance ⚡
  - General 📦
  Performance: 90%

Chris Evans (Birmingham):
  - Void Property Turnover 🏠
  - Hoarder Clean-out 🧹
  - General 📦
  Performance: 87%
```

## Assignment Examples

### Example 1: Emergency in London
```
Job: Emergency Clearance, London, Size M
Needs: 2 crew

Scores:
  Mike Davies: 99 ✅
  Robert Johnson: 95 ✅
  Tom Brown: 75
  James Wilson: 60

Assigned: Mike Davies + Robert Johnson
Reason: Both have emergency skills + London-based
```

### Example 2: Hoarder Job in Birmingham
```
Job: Hoarder Clean-out, Birmingham, Size L
Needs: 3 crew

Scores:
  James Wilson: 92 ✅
  Chris Evans: 90 ✅
  Tom Brown: 85 ✅
  David Smith: 70

Assigned: James, Chris, Tom
Reason: Local crew with hoarder experience
```

## Workload Balancing

**Scenario:**
- Mike has 0 jobs → Gets +10 points
- Tom has 1 job → Gets +5 points
- David has 2 jobs → Not available (filtered out)

This ensures jobs are distributed evenly across the team.

## Location Detection

Address parsing extracts location:
- "123 High Street, **London**, SW1A" → London
- "42 Victoria Road, **Birmingham**, B1" → Birmingham
- "78 Market St, **Manchester**, M1" → Manchester

## Benefits

✅ **Better Matches** - Right crew for right job  
✅ **Faster Service** - Local crew = faster arrival  
✅ **Fair Distribution** - No crew overloaded  
✅ **Quality Assurance** - Best performers on urgent jobs  
✅ **Automatic** - No manual intervention needed  

## Admin Override

Admins can still manually reassign if needed via the Assign Crew page.

## Future Enhancements

- Real-time GPS tracking for crew location
- Crew preferences (shift times, job types)
- Customer ratings feedback loop
- Machine learning for better predictions
- Multi-day job scheduling

## Testing

To see smart assignment in action:

1. Create multiple jobs in different locations
2. Check which crew gets assigned
3. Verify crew has matching skills
4. Confirm local crew prioritized
5. Check workload is balanced
