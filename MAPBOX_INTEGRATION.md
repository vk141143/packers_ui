# Mapbox Integration Guide

## Overview

The UK Packers & Movers platform now includes comprehensive Mapbox integration for location services, providing:

- **Address Autocomplete** - Smart address input with UK-focused geocoding
- **Live Job Tracking** - Real-time crew location and route visualization  
- **Interactive Maps** - Property locations with navigation and routing
- **Crew Location Tracking** - GPS tracking for crew members

## 🗺️ Features

### 1. Address Input with Autocomplete
- UK-focused address search using Mapbox Geocoding API
- Real-time suggestions as you type
- Automatic coordinate extraction for precise locations
- Used in booking forms and job creation

### 2. Enhanced Job Maps
- Real property coordinates instead of hardcoded locations
- Crew location markers with live updates
- Route visualization between crew and property
- Distance and ETA calculations
- Interactive navigation controls

### 3. Live Tracking System
- Real-time crew location updates
- Progress tracking with status indicators
- Estimated arrival times
- Direct communication with crew
- Map integration for visual tracking

### 4. Crew Location Tracker
- GPS tracking for crew members
- Automatic location updates every 30 seconds
- Manual location refresh capability
- Location accuracy indicators
- Error handling for GPS issues

## 🚀 Setup Instructions

### 1. Get Mapbox Access Token

1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Create a new access token with these scopes:
   - `styles:read`
   - `fonts:read` 
   - `datasets:read`
   - `geocoding:read`
   - `directions:read`

### 2. Configure Environment Variables

Add to your `.env` file:
```bash
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
```

### 3. Dependencies

The following packages are already included:
- `mapbox-gl` - Core Mapbox GL JS library
- `@types/mapbox-gl` - TypeScript definitions (if needed)

## 📁 File Structure

```
src/
├── services/
│   └── mapboxService.ts          # Core Mapbox service
├── components/common/
│   ├── AddressInput.tsx          # Address autocomplete input
│   ├── JobMap.tsx                # Enhanced job map component
│   ├── LiveTracking.tsx          # Live job tracking widget
│   └── CrewLocationTracker.tsx   # Crew GPS tracking
└── dashboards/
    ├── client/
    │   ├── BookMoveModern.tsx     # Uses AddressInput
    │   └── JobTrackingModern.tsx  # Uses LiveTracking
    └── crew/
        └── JobDetailsModern.tsx   # Uses CrewLocationTracker
```

## 🔧 Component Usage

### AddressInput Component
```tsx
import { AddressInput } from '../../components/common/AddressInput';

<AddressInput
  value={address}
  onChange={(address, coordinates) => {
    setAddress(address);
    if (coordinates) {
      // Store coordinates for later use
      setCoordinates(coordinates);
    }
  }}
  placeholder="Enter property address"
  required
/>
```

### LiveTracking Component
```tsx
import { LiveTracking } from '../../components/common/LiveTracking';

<LiveTracking 
  job={job} 
  className="mb-6" 
/>
```

### JobMap Component
```tsx
import { JobMap } from '../../components/common/JobMap';

<JobMap
  job={job}
  onClose={() => setShowMap(false)}
  showRoute={true}
  crewLocation={crewCoordinates}
/>
```

### CrewLocationTracker Component
```tsx
import { CrewLocationTracker } from '../../components/common/CrewLocationTracker';

<CrewLocationTracker
  jobId={job.id}
  onLocationUpdate={(location) => {
    // Handle location updates
    updateCrewLocation(location);
  }}
/>
```

## 🌍 Mapbox Service API

### Core Methods

```typescript
// Geocode address to coordinates
const results = await mapboxService.geocodeAddress("123 Main St, London");

// Reverse geocode coordinates to address  
const address = await mapboxService.reverseGeocode(-0.1276, 51.5074);

// Get route between two points
const route = await mapboxService.getRoute(startCoords, endCoords);

// Get current device location
const location = await mapboxService.getCurrentLocation();

// Calculate distance between points
const distance = mapboxService.calculateDistance(point1, point2);
```

## 🎯 Integration Points

### 1. Booking Flow
- **BookMoveModern.tsx** - Uses `AddressInput` for property address
- Coordinates are stored and used for crew assignment
- Address validation ensures accurate locations

### 2. Job Tracking
- **JobTrackingModern.tsx** - Uses `LiveTracking` component
- Real-time updates show crew progress
- Interactive map shows current positions

### 3. Crew Operations
- **JobDetailsModern.tsx** - Uses `CrewLocationTracker`
- Crew can share their location in real-time
- Automatic GPS tracking with manual override

### 4. Admin Dashboard
- Enhanced job management with location data
- Route optimization for crew assignments
- Distance-based crew selection

## 🔒 Security & Privacy

### Location Data Handling
- GPS coordinates are only stored temporarily
- Location tracking requires user consent
- Data is not shared with third parties
- Crew can disable tracking when off-duty

### API Security
- Mapbox tokens are scoped to specific domains
- Rate limiting prevents API abuse
- Error handling protects against failures

## 🚨 Error Handling

### Common Issues & Solutions

1. **"Geolocation not supported"**
   - Browser doesn't support GPS
   - Fallback to manual address entry

2. **"Location access denied"**
   - User denied location permissions
   - Show instructions to enable location

3. **"Network error"**
   - Mapbox API unavailable
   - Fallback to cached data or manual entry

4. **"Invalid coordinates"**
   - Geocoding failed for address
   - Show error message and retry option

## 📱 Mobile Considerations

### Responsive Design
- Maps are optimized for mobile screens
- Touch-friendly controls and markers
- Simplified UI for smaller screens

### Performance
- Lazy loading of map components
- Efficient coordinate updates
- Minimal battery drain from GPS

### Offline Support
- Cached map tiles for offline viewing
- Graceful degradation when offline
- Local storage for recent locations

## 🔄 Future Enhancements

### Planned Features
- **Route Optimization** - Multi-stop route planning
- **Geofencing** - Automatic status updates based on location
- **Heat Maps** - Service area visualization
- **Traffic Integration** - Real-time traffic-aware routing
- **Offline Maps** - Full offline map support

### Integration Opportunities
- **Fleet Management** - Vehicle tracking and management
- **Customer Notifications** - Location-based updates
- **Analytics** - Location-based performance metrics
- **Scheduling** - Location-aware job scheduling

## 📞 Support

For Mapbox integration issues:
1. Check the browser console for errors
2. Verify your Mapbox token is valid
3. Ensure location permissions are granted
4. Test with different addresses/locations

## 🔗 Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/)
- [Mapbox Directions API](https://docs.mapbox.com/api/navigation/directions/)
- [Web Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)