# Dashboard Components

This module contains three dashboard implementations:

## 1. Dashboard (Original)
**File:** `Dashboard.tsx`

A clean, simple dashboard with:
- Operations overview cards
- Team overview section
- Reports and complaints status cards
- Inactive resources alert

## 2. EnhancedDashboard (New)
**File:** `EnhancedDashboard.tsx`

A modern, professional dashboard with advanced features:

### Features
- **KPI Cards**: Clean stat cards for operations metrics
- **Team Overview**: Visual team member breakdown
- **Data Visualization**: 
  - Bar charts for reports breakdown
  - Donut charts for complaints distribution
- **Sectioned Layout**: Organized by domain (Operations, Team, Reports, Complaints)
- **Visual Hierarchy**: Color-coded sections with indicators
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Modern UI**: Stripe/Linear/Vercel-style design

### Components Used
- `StatCard` - KPI metric cards
- `TeamOverviewCard` - Team member cards
- `StatusDistributionCard` - Status breakdown lists
- `ChartCard` - Container for charts
- `BarChart` - Custom bar chart visualization
- `DonutChart` - Custom donut chart visualization

## 3. DashboardSwitcher (Recommended)
**File:** `DashboardSwitcher.tsx`

A wrapper component that allows users to toggle between Simple and Enhanced views:

### Features
- **Toggle Navigation**: Switch between Simple and Enhanced views
- **Persistent State**: Remembers user preference during session
- **Smooth Transitions**: Animated view changes
- **Visual Indicators**: Icons and descriptions for each view
- **Responsive**: Works on all screen sizes

### Usage
The DashboardSwitcher is now the default dashboard component used in all routes. Users can:
1. Click "Simple View" for the original dashboard
2. Click "Enhanced View" for the advanced dashboard with charts
3. Switch between views anytime without losing context

### Data Structure
```typescript
{
  kitchens_count: 306,
  branches_count: 5,
  zones_count: 51,
  project_managers_count: 2,
  quality_supervisors_count: 2,
  quality_inspectors_count: 3003,
  quality_managers_count: 2,
  total_reports: 12,
  branch_accepted_reports: 0,
  pending_supervisor: 12,
  pending_quality_manager: 0,
  branch_rejected_reports: 0,
  inactive_zones_count: 3,
  inactive_kitchens_count: 25,
  total_complaints: 1200,
  high_priority_complaints: 400,
  unresolved_complaints: 600,
  resolved_complaints: 300
}
```

## Current Implementation

All dashboard routes now use `DashboardSwitcher` by default:
- `/system-manager/dashboard`
- `/catering-manager/dashboard`
- `/project-manager/dashboard`
- `/quality-manager/dashboard`
- `/supervisor/dashboard`
- `/inspector/dashboard`

## Using Individual Dashboards

If you want to use a specific dashboard without the switcher:

```tsx
// In src/app/router/index.tsx
import { Dashboard } from '../../modules/dashboard/Dashboard';
// or
import { EnhancedDashboard } from '../../modules/dashboard/EnhancedDashboard';

// Replace DashboardSwitcher with your choice
{ path: 'dashboard', element: <Dashboard /> }
// or
{ path: 'dashboard', element: <EnhancedDashboard /> }
```

## Future Enhancements

For production use, consider:
1. Replace hardcoded data with API calls
2. Add loading states and skeletons
3. Add error handling
4. Add real-time updates
5. Add date range filters
6. Add export functionality
7. Add drill-down capabilities
8. Persist user's view preference in localStorage
