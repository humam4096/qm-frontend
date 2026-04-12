# Task 2.1: Update notifications API to support pagination parameters

## Summary

Updated the notifications API to properly support pagination parameters as specified in the design document.

## Changes Made

### 1. Cleaned up `notifications.api.ts`
- **Removed**: Unused `KitchenFilters` interface that was not related to notifications
- **Verified**: All required endpoints are present and correctly implemented:
  - `getNotifications(filters)` - Passes pagination params correctly via `{ params: filters }`
  - `markAllAsRead()` - Endpoint for marking all notifications as read
  - `deleteAll()` - Endpoint for deleting all notifications
  - `markAsRead(id)` - Endpoint for marking a specific notification as read

### 2. Verified Type Definitions
The `NotificationFilters` interface in `types/index.ts` already includes:
```typescript
export interface NotificationFilters {
  is_read?: 'true' | 'false';  // Filter by read status
  page?: number;                // Page number for pagination
  per_page?: number;            // Items per page
}
```

### 3. Verified Hook Integration
The `useNotifications` hook in `hooks/useNotifications.ts` correctly:
- Accepts `NotificationFilters` parameter
- Passes filters to the API via query key and query function
- Implements proper React Query caching with filter-based keys

## API Usage Examples

### Fetch first page (10 items)
```typescript
NotificationAPI.getNotifications({ page: 1, per_page: 10 });
```

### Fetch unread notifications
```typescript
NotificationAPI.getNotifications({ is_read: 'false', page: 1, per_page: 10 });
```

### Fetch read notifications
```typescript
NotificationAPI.getNotifications({ is_read: 'true', page: 1, per_page: 10 });
```

### Mark all as read
```typescript
NotificationAPI.markAllAsRead();
```

### Delete all notifications
```typescript
NotificationAPI.deleteAll();
```

## Requirements Validated

✅ **Requirement 5.1**: API supports pagination with `page` and `per_page` parameters  
✅ **Requirement 6.2**: `markAllAsRead` endpoint is present and functional  
✅ **Requirement 7.4**: `deleteAll` endpoint is present and functional  
✅ **Requirement 11.1**: API integrates with React Query hooks for state management

## Files Modified

1. `src/modules/notifications/api/notifications.api.ts` - Removed unused interface
2. `src/modules/notifications/api/notifications.api.example.ts` - Created example usage file

## Files Verified (No Changes Needed)

1. `src/modules/notifications/types/index.ts` - Already has correct `NotificationFilters` type
2. `src/modules/notifications/hooks/useNotifications.ts` - Already passes filters correctly
3. `src/modules/notifications/components/Notification.tsx` - Already uses hooks correctly

## Testing

- ✅ TypeScript compilation: No errors
- ✅ Type checking: All types are correctly defined and used
- ✅ API integration: Hooks correctly pass parameters to API
- ✅ Example file: Demonstrates all API usage patterns

## Next Steps

The API layer is now ready for the UI components to consume. The next tasks should focus on:
- Building the NotificationsDropdown component
- Implementing pagination UI with "Load More" functionality
- Adding filter tabs for All/Unread/Read
- Implementing optimistic updates for mark as read operations
