# Implementation Plan: Reports Module

## Overview

This implementation plan creates a dedicated reports module for viewing and managing report-type form submissions. The module follows the established architecture pattern of the form-submissions module, maintaining consistency in code structure, state management, and UI patterns. The key distinction is filtering for `form_type="report"` and providing a streamlined interface optimized for report management workflows.

## Tasks

- [x] 1. Set up module structure and TypeScript types
  - Create directory structure: `src/modules/reports/` with subdirectories for `api/`, `types/`, `hooks/`, `components/`, and `pages/`
  - Define TypeScript interfaces for Report, MealTimeWindow, Kitchen, SubmittedBy, StatusHistoryEntry, and ReportResponse types
  - Define union types for ReportStatus and BranchApprovalStatus enums
  - Export all types from `src/modules/reports/types/index.ts`
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 2. Implement API client layer
  - [x] 2.1 Create ReportsAPI client with typed interfaces
    - Implement `getReports()` method that calls GET `/meal-time-windows/submissions` with `form_type: 'report'` filter
    - Implement `getReportById()` method that calls GET `/form-submissions/{id}/show`
    - Implement `updateBranchApproval()` method that calls POST `/form-submissions/{id}/branch-approval`
    - Define ReportFilters interface with search, pagination, status, form_id, kitchen_id, form_type, and date filters
    - Define GetReportsResponse and ApiResponse interfaces
    - _Requirements: 1.2, 3.2, 4.4, 10.2_

- [ ] 3. Implement React Query hooks
  - [x] 3.1 Create query key factory and data fetching hooks
    - Implement query key factory with `reports(filters)` and `report(id)` keys
    - Implement `useGetReports()` hook with filter-based query keys for granular cache control
    - Implement `useGetReportById()` hook with enabled flag based on ID presence
    - _Requirements: 1.2, 3.2, 8.1, 8.2, 10.3_
  
  - [x] 3.2 Create mutation hooks for branch approval
    - Implement `useUpdateBranchApproval()` mutation hook
    - Configure cache invalidation to invalidate both list and detail queries on success
    - Implement error handling with console logging
    - _Requirements: 4.4, 4.5, 8.3, 8.7, 10.3_

- [x] 4. Checkpoint - Verify API and hooks layer
  - Ensure all API methods are properly typed
  - Verify query key factory generates correct cache keys
  - Ensure all tests pass, ask the user if questions arise

- [ ] 5. Implement ReportDisplay component
  - [x] 5.1 Create ReportDisplay component for rendering report details
    - Display report metadata: kitchen name, inspection date, submitted by user, meal time window
    - Display status history with timeline of status changes
    - Display all form sections with questions and submitted answers
    - Display score information for each question and total score
    - Display branch approval status and notes if present
    - Support both Arabic (RTL) and English (LTR) text direction
    - Use color-coded badges for scores (green >= 80, yellow >= 60, red < 60)
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 7.2, 7.5_

- [ ] 6. Implement dialog components
  - [x] 6.1 Create ReportDialog component
    - Implement modal dialog using ActionDialog component
    - Display ReportDisplay component inside dialog
    - Support RTL/LTR text direction based on language
    - Handle dialog open/close state
    - Clear report data when dialog closes
    - _Requirements: 3.1, 3.7, 3.8, 7.2, 10.4_
  
  - [x] 6.2 Create BranchApprovalDialog component
    - Implement approval form with status selection (pending/approved/rejected)
    - Add notes textarea for approval comments
    - Validate that notes are required when rejecting a report
    - Integrate useUpdateBranchApproval mutation hook
    - Display loading state during submission
    - Close dialog and clear form on successful submission
    - Display error message if submission fails
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 9.5_

- [ ] 7. Implement ReportsPage component
  - [x] 7.1 Set up page structure and state management
    - Implement page header with title and description
    - Set up dialog state management using useDialogState hook
    - Set up filter and pagination state using useAdvancedFilters hook
    - Integrate useGetReports hook with form_type filter always set to 'report'
    - _Requirements: 1.1, 1.2, 2.1, 10.1, 10.4_
  
  - [ ] 7.2 Configure data table columns
    - Define columns for index, form name, kitchen, inspection date, status, score, and branch approval
    - Add branch approval column conditionally (hide for project_manager role)
    - Implement color-coded score badges (green >= 80, yellow >= 60, red < 60)
    - Implement status badges with translated labels
    - Add actions column with view and approval buttons
    - Restrict approval action to branch_manager role using RoleGuard
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 4.1, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 10.4_
  
  - [ ] 7.3 Implement filter system
    - Configure filter options for kitchen, form, form type, and status
    - Fetch kitchen and form options from respective APIs
    - Display active filters as removable badges
    - Implement filter change handlers that update API filters
    - Implement clear all filters action
    - Add search input for text-based filtering
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 10.4_
  
  - [ ] 7.4 Implement pagination and loading states
    - Configure DataTable with pagination support
    - Implement page change handler
    - Display loading skeletons while data is being fetched
    - Display empty state message when no reports found
    - Display error state with retry button on API failure
    - _Requirements: 1.7, 1.8, 8.5, 8.6, 9.1, 9.2, 9.3, 9.4_
  
  - [ ] 7.5 Wire dialog components
    - Integrate ReportDialog with view action
    - Integrate BranchApprovalDialog with approval action
    - Pass dialog state and handlers to dialogs
    - _Requirements: 3.1, 4.1, 10.4_

- [ ] 8. Checkpoint - Verify UI components
  - Test ReportsPage renders correctly with mock data
  - Verify filters update API calls correctly
  - Verify dialogs open and close properly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 9. Add internationalization support
  - [ ] 9.1 Add translation keys to locales files
    - Add reports section to `src/locales/en.json` with keys for title, subtitle, table headers, filter labels, button text, status labels, and error messages
    - Add reports section to `src/locales/ar.json` with Arabic translations
    - Add translation keys for meal time window, view report, approve report, rejection notes required, and other report-specific labels
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ] 9.2 Apply translations to components
    - Use `useTranslation()` hook in all components
    - Replace hardcoded text with translation keys
    - Format dates according to selected locale
    - Support RTL text direction for Arabic
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10. Integrate with router
  - [ ] 10.1 Add reports routes to router configuration
    - Add reports route to system_manager route group: `/system-manager/reports`
    - Add reports route to quality_manager route group: `/quality-manager/reports`
    - Add reports route to catering_manager route group: `/catering-manager/reports`
    - Add reports route to project_manager route group: `/project-manager/reports`
    - Replace DummyDashboard components with ReportsPage component
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 10.1_

- [ ] 11. Final checkpoint - End-to-end verification
  - Verify reports list loads with correct data
  - Test filtering by kitchen, form, status
  - Test pagination navigation
  - Test view report dialog displays complete information
  - Test branch approval workflow for branch_manager role
  - Verify role-based access control works correctly
  - Test language switching and RTL support
  - Ensure all tests pass, ask the user if questions arise

## Notes

- The module reuses existing shared components (DataTable, Badge, RowActions, ActionDialog, AdvancedFilterSystem) for consistency
- All API calls filter for `form_type: 'report'` to show only report submissions
- The module uses the same patterns as form-submissions module for maintainability
- React Query handles caching, background refetching, and cache invalidation automatically
- Role-based access control is enforced using RoleGuard component
- The module supports full internationalization with Arabic RTL and English LTR
