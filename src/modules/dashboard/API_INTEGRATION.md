# Dashboard API Integration

This document describes the API integration for the dashboard module.

## Structure

The dashboard module follows the same structure as other modules (e.g., locations):

```
src/modules/dashboard/
├── api/
│   └── dashboard.api.ts       # API client functions
├── hooks/
│   └── useDashboard.ts        # React Query hooks
├── types/
│   └── index.ts               # TypeScript interfaces
├── components/
│   ├── BarChart.tsx
│   ├── ChartCard.tsx
│   └── DonutChart.tsx
├── Dashboard.tsx              # Simple dashboard view
├── EnhancedDashboard.tsx      # Advanced dashboard with charts
└── DashboardSwitcher.tsx      # Toggle between views
```

## API Endpoint

**GET** `/dashboard`

### Response Format

```json
{
  "status": 200,
  "message": "تم جلب البيانات بنجاح.",
  "data": {
    "kitchens_count": 306,
    "branches_count": 5,
    "zones_count": 51,
    "project_managers_count": 2,
    "quality_supervisors_count": 2,
    "quality_inspectors_count": 3003,
    "quality_managers_count": 2,
    "total_reports": 12,
    "branch_accepted_reports": 0,
    "pending_supervisor": 12,
    "pending_quality_manager": 0,
    "branch_rejected_reports": 0,
    "inactive_zones_count": 3,
    "inactive_kitchens_count": 25,
    "total_complaints": 1200,
    "high_priority_complaints": 400,
    "unresolved_complaints": 600,
    "resolved_complaints": 300
  },
  "pagination": null
}
```

## Usage

### In Components

```tsx
import { useDashboard } from './hooks/useDashboard';

export const MyDashboard = () => {
  const { data, isLoading, isError, error } = useDashboard();
  
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} />;
  
  const dashboardData = data?.data.data;
  
  return (
    <div>
      <h1>Kitchens: {dashboardData.kitchens_count}</h1>
      {/* ... */}
    </div>
  );
};
```

## Features

### React Query Configuration

The `useDashboard` hook is configured with:
- **staleTime**: 5 minutes - Dashboard data doesn't change frequently
- **refetchOnWindowFocus**: true - Refetch when user returns to the tab
- **queryKey**: `["dashboard"]` - For cache management

### Loading States

Both Dashboard and EnhancedDashboard components include:
- Skeleton loading states
- Error handling with user-friendly messages
- Null checks for data safety

### Type Safety

All data is fully typed with TypeScript:
- `DashboardData` interface for the data structure
- `GetDashboardResponse` interface for the API response
- Proper error typing

## Cache Management

The dashboard data is cached by React Query. To manually invalidate:

```tsx
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['dashboard'] });
```

## Error Handling

Errors are displayed with:
- Alert icon
- Error message
- Fallback UI
- Proper error boundaries

## Future Enhancements

Consider adding:
1. Manual refresh button
2. Auto-refresh interval
3. Real-time updates via WebSocket
4. Data export functionality
5. Date range filters
6. Comparison with previous periods
