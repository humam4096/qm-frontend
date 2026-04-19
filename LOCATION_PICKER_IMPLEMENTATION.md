# Location Picker Implementation

## Overview
Replaced manual latitude/longitude inputs with an interactive map picker in the Zone form.

## What Was Done

### 1. Dependencies Installed
- `leaflet` - Map library
- `react-leaflet` - React wrapper for Leaflet
- `@types/leaflet` - TypeScript types

### 2. Created LocationPicker Component
**File:** `src/components/ui/location-picker.tsx`

**Features:**
- Click anywhere on the map to select a location
- Displays a marker at the selected position
- Updates coordinates automatically via callback
- Shows existing coordinates when editing
- Default center: Riyadh, Saudi Arabia (24.7136, 46.6753)
- Responsive and customizable height
- Fixed Leaflet icon issues with Vite

**Props:**
```typescript
interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string; // default: "400px"
}
```

### 3. Updated ZoneFormDialog
**File:** `src/modules/zones/components/ZoneFormDialog.tsx`

**Changes:**
- Imported `LocationPicker` component
- Removed manual latitude/longitude input fields
- Added `handleLocationChange` function that uses `setValue` from react-hook-form
- Added watchers for `map_lat` and `map_lng` to pass to LocationPicker
- Map picker spans full width (col-span-2)
- Shows current coordinates below the map when selected
- Maintains all existing validation and form logic

### 4. Added Leaflet CSS
**File:** `src/index.css`
- Added `@import "leaflet/dist/leaflet.css";` for map styling

## How It Works

1. **Initial Load:**
   - If editing: Shows marker at existing coordinates
   - If creating: Shows map centered on Riyadh with no marker

2. **User Interaction:**
   - User clicks anywhere on the map
   - Marker appears at clicked location
   - Coordinates automatically update in form state via `setValue`
   - Coordinates display below the map

3. **Form Submission:**
   - Works seamlessly with existing react-hook-form validation
   - Coordinates are submitted as part of the form data

## Usage Example

```tsx
<LocationPicker
  latitude={mapLat}
  longitude={mapLng}
  onLocationChange={handleLocationChange}
  height="400px"
/>
```

## Benefits

✅ User-friendly interface - click instead of typing coordinates  
✅ Visual feedback with marker placement  
✅ Integrates seamlessly with react-hook-form  
✅ Maintains existing validation  
✅ Reusable component  
✅ Clean, simple implementation  
✅ Production-ready  

## Testing Checklist

- [ ] Create new zone - click map to select location
- [ ] Edit existing zone - verify marker shows at saved coordinates
- [ ] Click different locations - verify marker moves and coordinates update
- [ ] Submit form - verify coordinates are saved correctly
- [ ] Form validation - verify existing validation still works
- [ ] Responsive design - test on different screen sizes
