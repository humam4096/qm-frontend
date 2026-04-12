# Implementation Plan: Notification System Enhancement

## Overview

This implementation plan transforms the existing notification system into a production-ready dropdown-based notification center with filtering, pagination, optimistic updates, and comprehensive state management. The implementation follows a bottom-up approach, starting with foundational utilities and types, then building up to API enhancements, hooks, and finally UI components.

## Tasks

- [x] 1. Enhance types and utilities
  - [x] 1.1 Update NotificationFilters type with pagination support
    - Modify `src/modules/notifications/types/index.ts`
    - Add `page` and `per_page` parameters
    - Change filter parameter to `is_read?: 'true' | 'false'`
    - _Requirements: 4.2, 5.1, 11.3_
  
  - [x] 1.2 Create date formatting utility
    - Create `src/modules/notifications/utils/formatRelativeTime.ts`
    - Implement relative time formatting logic (Just now, X minutes ago, X hours ago, etc.)
    - _Requirements: 2.4_
  
  - [ ]* 1.3 Write property test for date formatting
    - **Property 6: Relative Date Formatting**
    - **Validates: Requirements 2.4**

- [x] 2. Enhance API layer with pagination
  - [x] 2.1 Update notifications API to support pagination parameters
    - Modify `src/modules/notifications/api/notifications.api.ts`
    - Ensure `getNotifications` passes pagination params correctly
    - Add `markAllAsRead` and `deleteAll` endpoints if not present
    - _Requirements: 5.1, 6.2, 7.4, 11.1_
  
  - [ ]* 2.2 Write unit tests for API layer
    - Test pagination parameter passing
    - Test filter parameter handling
    - _Requirements: 11.1_

- [x] 3. Implement React Query hooks
  - [x] 3.1 Enhance useNotifications hook with pagination
    - Modify `src/modules/notifications/hooks/useNotifications.ts`
    - Add filter and pagination parameter support
    - Configure refetchInterval (30s) and staleTime (10s)
    - _Requirements: 11.1, 11.3, 13.4_
  
  - [x] 3.2 Create useInfiniteNotifications hook
    - Add to `src/modules/notifications/hooks/useNotifications.ts`
    - Implement infinite query with getNextPageParam
    - Handle page flattening for UI consumption
    - _Requirements: 5.3, 5.4, 11.1_
  
  - [x] 3.3 Enhance useMarkAsRead hook with optimistic updates
    - Add to `src/modules/notifications/hooks/useNotifications.ts`
    - Implement optimistic update logic in onMutate
    - Implement error rollback in onError
    - Invalidate cache in onSettled
    - _Requirements: 3.3, 3.4, 11.4, 11.5_
  
  - [x] 3.4 Create useMarkAllAsRead hook
    - Add to `src/modules/notifications/hooks/useNotifications.ts`
    - Implement mutation with cache invalidation
    - _Requirements: 6.2, 6.3, 11.4_
  
  - [x] 3.5 Create useDeleteAllNotifications hook
    - Add to `src/modules/notifications/hooks/useNotifications.ts`
    - Implement mutation with cache invalidation
    - _Requirements: 7.4, 11.4_
  
  - [x] 3.6 Create useUnreadCount hook
    - Add to `src/modules/notifications/hooks/useNotifications.ts`
    - Fetch unread notifications with per_page=1 to get count from pagination
    - _Requirements: 1.2_
  
  - [ ]* 3.7 Write property tests for hooks
    - **Property 30: Hook Parameter Acceptance**
    - **Property 31: Cache Invalidation on Mutation Success**
    - **Property 8: Optimistic Update on Click**
    - **Validates: Requirements 11.3, 11.4, 3.3**
  
  - [ ]* 3.8 Write unit tests for hooks
    - Test useNotifications with various filters
    - Test useInfiniteNotifications pagination behavior
    - Test useMarkAsRead optimistic updates and rollback
    - Test cache invalidation on mutations
    - _Requirements: 11.1, 11.4, 11.5_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create base UI components
  - [x] 5.1 Create NotificationSkeleton component
    - Create `src/modules/notifications/components/NotificationSkeleton.tsx`
    - Match NotificationItem layout with skeleton elements
    - Use Skeleton component from shadcn/ui
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [x] 5.2 Create NotificationEmpty component
    - Create `src/modules/notifications/components/NotificationEmpty.tsx`
    - Display contextual messages based on filter (All, Unread, Read)
    - Include BellOff icon and muted styling
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ]* 5.3 Write property test for empty state
    - **Property 27: Contextual Empty State Messages**
    - **Validates: Requirements 9.2**
  
  - [ ]* 5.4 Write unit tests for base components
    - Test NotificationSkeleton renders correctly
    - Test NotificationEmpty displays contextual messages
    - Test empty state icon and styling
    - _Requirements: 8.1, 9.1, 9.2_

- [x] 6. Enhance NotificationItem component
  - [x] 6.1 Update NotificationItem with optimistic updates and styling
    - Modify `src/modules/notifications/components/NotificationItem.tsx`
    - Add unread/read visual differentiation (bg-blue-50 vs bg-white)
    - Implement click handler with mark as read and navigation
    - Use formatRelativeTime for date display
    - Add hover effect styling
    - Wrap with React.memo for performance
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 13.5_
  
  - [ ]* 6.2 Write property tests for NotificationItem
    - **Property 4: Notification Item Content Display**
    - **Property 5: Read/Unread Visual Differentiation**
    - **Property 7: Hover Effect on Notification Items**
    - **Property 9: Navigation on Click**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.5, 3.2**
  
  - [ ]* 6.3 Write unit tests for NotificationItem
    - Test content display (title, message, date)
    - Test unread indicator styling
    - Test click behavior (mark as read + navigate)
    - Test hover effect
    - Test React.memo optimization
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2_

- [x] 7. Create filter and header components
  - [x] 7.1 Create NotificationFilters component
    - Create `src/modules/notifications/components/NotificationFilters.tsx`
    - Render three filter tabs (All, Unread, Read)
    - Highlight active filter with border-b-2 border-primary
    - Display counts in parentheses
    - Handle filter change callback
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  
  - [x] 7.2 Create NotificationsHeader component
    - Create `src/modules/notifications/components/NotificationsHeader.tsx`
    - Display "Notifications" title
    - Add "Mark All as Read" button (disabled when no unread)
    - Add "Clear All" button
    - Show loading states on buttons
    - _Requirements: 6.1, 6.5, 7.1_
  
  - [ ]* 7.3 Write property tests for filter component
    - **Property 10: Filter Fetch Behavior**
    - **Property 11: Active Filter Visual Indication**
    - **Validates: Requirements 4.2, 4.3**
  
  - [ ]* 7.4 Write unit tests for filter and header components
    - Test filter tab rendering and highlighting
    - Test filter change callback
    - Test header button states and callbacks
    - Test loading states
    - _Requirements: 4.1, 4.2, 4.3, 6.1, 6.5, 7.1_

- [x] 8. Create list and pagination components
  - [x] 8.1 Create NotificationsList component
    - Create `src/modules/notifications/components/NotificationsList.tsx`
    - Handle loading state (3 skeleton items)
    - Handle error state with retry button
    - Handle empty state with contextual message
    - Render list of NotificationItem components
    - Max height 400px with overflow-y-auto
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 10.1, 10.5_
  
  - [x] 8.2 Create LoadMoreButton component
    - Create `src/modules/notifications/components/LoadMoreButton.tsx`
    - Display "Load More" button with full width
    - Show loading state with spinner
    - Hide when hasMore is false
    - _Requirements: 5.2, 5.6_
  
  - [ ]* 8.3 Write property tests for list and pagination
    - **Property 13: Load More Fetches Next Page**
    - **Property 14: Append Without Refetch**
    - **Property 15: Load More Button Visibility**
    - **Property 16: Pagination Loading Indicator**
    - **Property 24: Loading State Display**
    - **Property 26: Empty State Display**
    - **Property 28: Error Display on Fetch Failure**
    - **Property 29: Retry Option on Error**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5, 5.6, 8.1, 9.1, 10.1, 10.5**
  
  - [ ]* 8.4 Write unit tests for list and pagination
    - Test loading state with skeletons
    - Test error state with retry
    - Test empty state messages
    - Test notification list rendering
    - Test LoadMoreButton visibility and loading
    - _Requirements: 5.2, 5.6, 8.1, 8.2, 8.3, 9.1, 10.1, 10.5_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Create dialog components
  - [x] 10.1 Create DeleteAllDialog component
    - Create `src/modules/notifications/components/DeleteAllDialog.tsx`
    - Use Dialog component from shadcn/ui
    - Display confirmation message
    - Provide Cancel and Confirm buttons
    - Show loading state during deletion
    - Confirm button with variant="destructive"
    - _Requirements: 7.2, 7.3, 7.4, 7.6_
  
  - [ ]* 10.2 Write property tests for dialog
    - **Property 20: Clear All Confirmation Dialog**
    - **Property 21: Confirmation Required for Deletion**
    - **Property 22: Delete All API Call on Confirmation**
    - **Validates: Requirements 7.2, 7.3, 7.4**
  
  - [ ]* 10.3 Write unit tests for DeleteAllDialog
    - Test dialog display and confirmation requirement
    - Test confirm callback
    - Test cancel behavior
    - Test loading state
    - _Requirements: 7.2, 7.3, 7.4, 7.6_

- [x] 11. Create main NotificationsDropdown component
  - [x] 11.1 Create NotificationsDropdown container component
    - Create `src/modules/notifications/components/NotificationsDropdown.tsx`
    - Use DropdownMenu from shadcn/ui
    - Render bell icon with unread badge
    - Manage dropdown open/close state
    - Manage active filter state (default: 'all')
    - Coordinate all child components
    - Set dropdown width to 400px (responsive on mobile)
    - Position with align="end"
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.5, 12.1_
  
  - [x] 11.2 Wire all components together in NotificationsDropdown
    - Integrate NotificationsHeader with mark all as read and delete all handlers
    - Integrate NotificationFilters with filter state
    - Integrate NotificationsList with infinite query data
    - Integrate LoadMoreButton with fetchNextPage
    - Integrate DeleteAllDialog with confirmation flow
    - Handle dropdown close on notification click
    - _Requirements: 1.3, 1.4, 3.1, 4.2, 4.4, 5.3, 6.2, 7.4_
  
  - [ ]* 11.3 Write property tests for NotificationsDropdown
    - **Property 1: Unread Badge Display**
    - **Property 2: Dropdown Toggle Behavior**
    - **Property 3: Click Outside to Close**
    - **Property 12: Pagination Reset on Filter Change**
    - **Property 17: Mark All as Read API Call**
    - **Property 18: Mark All as Read Success Behavior**
    - **Property 19: Mark All as Read Loading State**
    - **Property 23: Empty State After Deletion**
    - **Property 25: Prevent Duplicate Requests**
    - **Validates: Requirements 1.2, 1.3, 1.4, 4.4, 6.2, 6.3, 6.4, 6.5, 7.5, 8.5**
  
  - [ ]* 11.4 Write unit tests for NotificationsDropdown
    - Test bell icon and badge display
    - Test dropdown open/close behavior
    - Test filter state management
    - Test component integration
    - Test mark all as read flow
    - Test delete all flow with confirmation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.2, 4.4, 6.2, 6.3, 7.2, 7.4_

- [x] 12. Implement accessibility features
  - [x] 12.1 Add keyboard navigation support
    - Add Tab, Enter, and Escape key handlers to NotificationsDropdown
    - Ensure Escape closes dropdown
    - Add keyboard navigation to filter tabs
    - _Requirements: 14.1, 14.2_
  
  - [x] 12.2 Add ARIA labels and roles
    - Add aria-label to bell icon ("Notifications")
    - Add aria-label to unread badge ("{count} unread notifications")
    - Add appropriate ARIA roles to NotificationItem
    - Add ARIA labels to buttons and interactive elements
    - _Requirements: 14.3, 14.4, 14.5_
  
  - [ ]* 12.3 Write property tests for accessibility
    - **Property 35: Keyboard Navigation Support**
    - **Property 36: Escape Key Closes Dropdown**
    - **Property 37: ARIA Labels on Notification Items**
    - **Validates: Requirements 14.1, 14.2, 14.5**
  
  - [ ]* 12.4 Write accessibility tests
    - Test keyboard navigation (Tab, Enter, Escape)
    - Test ARIA labels on all interactive elements
    - Test screen reader announcements
    - Run axe-core accessibility tests
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 13. Implement responsive design
  - [x] 13.1 Add responsive styles to NotificationsDropdown
    - Adjust dropdown width for mobile (<640px)
    - Ensure touch-friendly tap targets (44x44px minimum)
    - Make dropdown scrollable on mobile
    - Ensure proper positioning on small screens
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 13.2 Write property test for touch targets
    - **Property 32: Touch Target Minimum Size**
    - **Validates: Requirements 12.2**
  
  - [ ]* 13.3 Write responsive design tests
    - Test mobile viewport behavior
    - Test touch target sizes
    - Test scrolling on mobile
    - Test positioning on small screens
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 14. Implement performance optimizations
  - [x] 14.1 Add React.memo to components
    - Wrap NotificationFilters with React.memo
    - Wrap NotificationEmpty with React.memo
    - Verify NotificationItem is already memoized
    - _Requirements: 13.5_
  
  - [x] 14.2 Add useCallback for stable callbacks
    - Memoize filter change handler
    - Memoize mark as read handler
    - Memoize mark all as read handler
    - Memoize delete all handler
    - _Requirements: 13.2_
  
  - [x] 14.3 Optimize dropdown refetch behavior
    - Stop refetch interval when dropdown is closed
    - Resume refetch when dropdown opens
    - _Requirements: 13.1, 13.2_
  
  - [ ]* 14.4 Write property test for performance
    - **Property 33: No Re-renders When Closed**
    - **Property 34: Cache Prevents Refetch**
    - **Validates: Requirements 13.2, 13.4**
  
  - [ ]* 14.5 Write performance tests
    - Test render time (<100ms)
    - Test re-render prevention when dropdown closed
    - Test React Query caching behavior
    - Test React.memo effectiveness
    - _Requirements: 13.1, 13.2, 13.4, 13.5_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Integration and final wiring
  - [x] 16.1 Integrate NotificationsDropdown into application header
    - Import NotificationsDropdown in header component
    - Position bell icon in header layout
    - Ensure proper z-index for dropdown
    - _Requirements: 1.1_
  
  - [ ]* 16.2 Write integration tests
    - Test complete notification flow (open → view → click → mark as read → navigate)
    - Test filter flow (switch filters → verify correct data)
    - Test pagination flow (load more → verify append)
    - Test mark all as read flow
    - Test delete all flow with confirmation
    - _Requirements: All requirements_
  
  - [ ]* 16.3 Run full test suite
    - Run all unit tests
    - Run all property-based tests (100 iterations minimum)
    - Run all integration tests
    - Run accessibility tests
    - Verify 80%+ code coverage
    - _Requirements: All requirements_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at reasonable breaks
- Property tests validate universal correctness properties (37 total)
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: types → API → hooks → components
- All components use existing shadcn/ui components for consistency
- React Query handles all server state management with caching and optimistic updates
- Performance optimizations (React.memo, useCallback) are applied throughout
- Full accessibility support with keyboard navigation and ARIA labels
- Responsive design ensures mobile compatibility
